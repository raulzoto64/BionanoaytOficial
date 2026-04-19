import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Switch } from '../../../components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Loader2, Database, Eye, Info, CheckCircle2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabaseAPI, ReusableSection } from '../../../data/supabase';
import { DEFAULT_SECTION_TEMPLATES } from '../../../utils/sectionTemplates';
import { DynamicSection } from '../../../components/DynamicSection';

interface CatalogItem {
  id?: string;
  name: string;
  type: string;
  content: any;
  isSynced: boolean;
  dbItem?: ReusableSection;
}

export function AdminSections() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dependencias para el visualizador
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [dbSections, products, productTranslations, members, memberTranslations, categories, blogPosts, blogTranslations] = await Promise.all([
        supabaseAPI.getReusableSections(),
        supabaseAPI.getProducts(),
        supabaseAPI.getAllProductTranslations('es'),
        supabaseAPI.getEcosystemMembers(),
        supabaseAPI.getAllEcosystemMemberTranslations('es'),
        supabaseAPI.getCategories(),
        supabaseAPI.getBlogPosts('published'),
        supabaseAPI.getAllBlogPostTranslations('es')
      ]);
      
      const productTranslationsMap = (productTranslations || []).reduce((acc: any, t: any) => { acc[t.product_id] = t; return acc; }, {});
      setAllProducts(products.map((p: any) => ({ ...p, translation: productTranslationsMap[p.id] || null })));

      const memberTranslationsMap = (memberTranslations || []).reduce((acc: any, t: any) => { acc[t.member_id] = t; return acc; }, {});
      setAllMembers(members.map((m: any) => ({ ...m, translation: memberTranslationsMap[m.id] || null })));
      
      const blogTranslationsMap = (blogTranslations || []).reduce((acc: any, t: any) => { acc[t.post_id] = t; return acc; }, {});
      setAllBlogPosts((blogPosts || []).map((post: any) => ({
        ...post,
        translation: blogTranslationsMap[post.id] || { title: 'Untitled', excerpt: '' }
      })));

      setAllCategories(categories || []);
      
      const combined: CatalogItem[] = DEFAULT_SECTION_TEMPLATES.map(template => {
        const dbMatch = dbSections.find((s: ReusableSection) => s.name === template.name && s.type === template.type);
        return {
          id: dbMatch?.id,
          name: template.name,
          type: template.type,
          content: dbMatch ? dbMatch.content : template.content,
          isSynced: !!dbMatch,
          dbItem: dbMatch
        };
      });

      dbSections.forEach((dbS: ReusableSection) => {
        if (!combined.find((c: CatalogItem) => c.name === dbS.name && c.type === dbS.type)) {
          combined.push({
            id: dbS.id,
            name: dbS.name,
            type: dbS.type,
            content: dbS.content,
            isSynced: true,
            dbItem: dbS
          });
        }
      });

      setCatalog(combined);
    } catch (error) {
      toast.error('Error al cargar catálogo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSync = async (item: CatalogItem) => {
    try {
      if (item.isSynced && item.id) {
        const toastId = toast.loading(`Eliminando "${item.name}"...`);
        await supabaseAPI.deleteReusableSection(item.id);
        toast.dismiss(toastId);
        toast.success(`Sección "${item.name}" eliminada de la base de datos`);
      } else {
        const toastId = toast.loading(`Sincronizando "${item.name}"...`);
        await supabaseAPI.saveReusableSection({
          name: item.name,
          type: item.type,
          content: item.content
        });
        toast.dismiss(toastId);
        toast.success(`Sección "${item.name}" sincronizada con éxito`);
      }
      loadCatalog();
    } catch (error) {
      toast.error('Error al procesar la sincronización');
    }
  };

  const filteredCatalog = catalog.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-[#1C5D15] animate-spin mb-4" />
          <p className="text-[#1C5D15] font-bold uppercase tracking-widest text-sm">Cargando Catálogo de Secciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-[#1C5D15] mb-2 tracking-tighter">Catálogo de Secciones</h2>
          <p className="text-[#629960] font-bold uppercase tracking-widest text-xs opacity-70">
             Gestiona y sincroniza la biblioteca de componentes para tu sitio.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nombre o tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-white border-2 border-emerald-50 rounded-2xl focus:ring-[#19FF00]/20 focus:border-[#19FF00]/40 transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredCatalog.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center">
          <Search className="w-16 h-16 text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-[#1C5D15] mb-2">No se encontraron secciones</h3>
          <p className="text-[#629960] text-sm max-w-md">Intenta con otro término de búsqueda o sincroniza nuevas secciones.</p>
          {searchQuery && (
            <Button variant="link" onClick={() => setSearchQuery('')} className="mt-4 text-[#19FF00]">
               Limpiar Búsqueda
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalog.map((item, idx) => (
            <Card 
              key={idx} 
              className={`group relative overflow-hidden transition-all duration-300 border-2 rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:-translate-y-2 ${
                item.isSynced 
                  ? 'bg-white border-[#19FF00]/20 shadow-lg shadow-[#1C5D15]/5' 
                  : 'bg-gray-50/50 border-dashed border-gray-200 grayscale-[0.5]'
              }`}
            >
              {/* CAPA DE CLIC GIGANTE (Z-40) */}
              <div 
                className="absolute inset-0 z-40 cursor-pointer" 
                onPointerDown={() => console.log(`[MOUSE] 🖱️ Click impulsado en: ${item.name}`)}
                onClick={() => {
                  const t0 = performance.now();
                  setSelectedItem(item);
                  setIsPreviewOpen(true);
                  console.log(`[CATALOG] ✅ Modal opened in ${Math.round(performance.now() - t0)}ms`);
                }}
              />

              <div className="relative z-10 flex flex-col h-full pointer-events-none">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                     <Badge variant="outline" className="mb-2 text-[10px] font-mono tracking-tighter text-[#629960] border-[#F7F9CE]">
                      TIPO: {item.type.toUpperCase()}
                    </Badge>
                    <h3 className="text-xl font-black text-[#1C5D15] leading-tight group-hover:text-[#19FF00] transition-colors">{item.name}</h3>
                  </div>
                  <div 
                      className="flex items-center gap-2 pointer-events-auto relative z-50"
                      onClick={(e) => e.stopPropagation()}
                  >
                    <Switch 
                       checked={item.isSynced}
                       onCheckedChange={() => handleToggleSync(item)}
                       className="data-[state=checked]:bg-[#19FF00] data-[state=unchecked]:bg-gray-200 scale-75"
                    />
                  </div>
                </div>

                <div className="mb-8 flex-1">
                  <p className="text-xs text-[#629960] font-medium leading-relaxed opacity-80 italic">
                    {item.isSynced 
                      ? '✓ Sincronizado: Disponible en el editor visual.' 
                      : '○ Local: Sincroniza para activar este componente.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                     {item.isSynced ? <CheckCircle2 className="w-3.5 h-3.5 text-[#19FF00]" /> : <Database className="w-3.5 h-3.5 text-gray-300" />}
                     <span className="text-[10px] font-black uppercase text-gray-400">Ver Detalles</span>
                  </div>
                  <Eye className="w-5 h-5 text-[#19FF00]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Previsualización - SUPER ANCHO (PC VIEW) */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] w-full max-h-[92vh] overflow-hidden flex flex-col rounded-[3.5rem] border-none shadow-[0_0_100px_rgba(0,0,0,0.2)] p-0 bg-white">
          {selectedItem && (
            <>
              <DialogHeader className="p-8 bg-[#1C5D15] text-white shrink-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Database className="w-6 h-6 text-[#19FF00]" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{selectedItem.name}</DialogTitle>
                    <DialogDescription className="text-white/60 font-mono text-[10px] tracking-widest">TIPO: {selectedItem.type}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50 custom-scrollbar">
                <div className="mb-4">
                   <h4 className="text-sm font-black text-[#1C5D15] uppercase tracking-widest border-b pb-4 mb-6 flex items-center gap-2">
                     <Eye className="w-4 h-4 text-[#19FF00]" />
                     Vista Previa Visual (Desktop)
                   </h4>
                   <div className="rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-white min-h-[500px] relative">
                      <div className="transform scale-[0.9] origin-top transform-gpu pt-4">
                        <DynamicSection 
                          section={{
                            id: 'preview-modal',
                            type: selectedItem.type,
                            content: selectedItem.content.es || selectedItem.content,
                            visible: true,
                            order: 0
                          }}
                          isEditor={true}
                          availableProducts={allProducts}
                          availableEcosystemMembers={allMembers}
                          availableCategories={allCategories}
                          availableBlogPosts={allBlogPosts}
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t flex justify-end gap-3 shrink-0">
                <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="rounded-full px-6 font-bold uppercase text-xs">Cerrar</Button>
                <Button 
                   onClick={() => handleToggleSync(selectedItem)}
                   className={`${selectedItem.isSynced ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15]'} text-white rounded-full px-8 font-black uppercase text-xs transition-all shadow-lg`}
                >
                   {selectedItem.isSynced ? 'Eliminar de DB' : 'Sincronizar Ahora'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
