import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  FileText, 
  Globe, 
  Loader2,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Page, 
  PageContent, 
  supabaseAPI 
} from '../../../data/supabase';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { useConfirm } from '../../../hooks/useConfirm';


interface PageWithContent extends Page {
  contentES: PageContent | null;
  contentEN: PageContent | null;
}

export function AdminContent() {
  const [pagesData, setPagesData] = useState<PageWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { confirmDialog, confirmModalProps } = useConfirm();


  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const allPages = await supabaseAPI.getAllPages();
      const pagesWithContent = await Promise.all(
        allPages.map(async (page: Page) => {
          const contentES = await supabaseAPI.getPageContent(page.id, 'es');
          const contentEN = await supabaseAPI.getPageContent(page.id, 'en');
          return { ...page, contentES, contentEN };
        })
      );
      setPagesData(pagesWithContent);
    } catch (error) {
      toast.error('Error al cargar páginas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVisual = (pageId: string) => {
    navigate(`/admin/visual-editor/${pageId}`);
  };

  const handleCreatePage = async () => {
    const slug = prompt('Ingresa el slug o nombre para la nueva página (ej. "nueva-pagina"):');
    if (!slug) return;
    
    setCreating(true);
    try {
      await supabaseAPI.createPage({ slug, type: 'custom', status: 'published' });
      toast.success('Página creada con éxito');
      loadPages();
    } catch (e) {
      toast.error('Error al crear la página');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePage = (e: React.MouseEvent, pageId: string, pageName: string) => {
    e.stopPropagation();
    confirmDialog({
      title: 'Eliminar Página',
      message: `¿Estás seguro de que deseas eliminar permanentemente la página "${pageName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar Página',
      cancelText: 'Cancelar',
      iconType: 'warning',
      onConfirm: async () => {
        try {
          await supabaseAPI.deletePage(pageId);
          toast.success('Página eliminada con éxito');
          loadPages();
        } catch (error) {
          toast.error('Error al eliminar la página');
        }
      }
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-[#1C5D15] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-[#1C5D15] mb-2">Editor de Contenido</h2>
          <p className="text-[#629960] font-medium">Selecciona una página para editarla, u opciones para añadir y eliminar.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleCreatePage}
            disabled={creating}
            className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white font-bold h-12 px-6 rounded-xl flex items-center gap-2"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Nueva Página
          </Button>
          <div className="w-16 h-16 bg-[#F7F9CE] rounded-2xl flex items-center justify-center">
               <Settings className="w-8 h-8 text-[#1C5D15] animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagesData.map((page) => (
          <Card 
            key={page.id} 
            className="group overflow-hidden bg-white border-2 border-emerald-50 hover:border-[#1C5D15]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#1C5D15]/10 flex flex-col cursor-pointer"
            onClick={() => handleEditVisual(page.id)}
          >
            <div className="p-1 h-32 bg-gradient-to-br from-[#1C5D15] to-[#629960] relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#19FF00]/20 rounded-full blur-3xl" />
               </div>
               <div className="relative h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
               </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1C5D15] capitalize mb-1">
                    {page.slug.replace(/-/g, ' ').replace('page ', '')}
                  </h3>
                  <p className="text-xs text-[#629960] font-mono">{page.slug}</p>
                </div>
                <Badge className={page.status === 'published' ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-100 text-gray-400'}>
                  {page.status === 'published' ? 'Live' : 'Draft'}
                </Badge>
              </div>

              <div className="mt-auto pt-6 border-t flex items-center justify-between">
                <span className="text-xs text-[#629960]">
                  {page.contentES?.sections.length || 0} Bloques
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                    onClick={(e) => handleDeletePage(e, page.id, page.slug)}
                    title="Eliminar página"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white font-bold text-xs rounded-lg group-hover:translate-x-1 transition-all"
                  >
                    Abrir Editor
                    <Globe className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <ConfirmModal {...confirmModalProps} />
    </div>
  );
}
