import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router';
import { supabase, supabaseAPI, PageWithContent, Section, EcosystemMember, EcosystemMemberTranslation } from '../../data/supabase';
import { Button } from '../../components/ui/button';
import { 
  ChevronLeft, 
  Save, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Globe, 
  Loader2,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { toast } from 'sonner';

import { VisualEditorSidebar } from '../../components/admin/visual-editor/VisualEditorSidebar';
import { VisualEditorPreview } from '../../components/admin/visual-editor/VisualEditorPreview';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { SEO } from '../../components/SEO';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

// Helper component for Iframe Preview (defined outside to prevent re-mounting on every render)
const PreviewFrame = ({ children }: { children: React.ReactNode }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    if (!frameRef.current) return;
    const doc = frameRef.current.contentWindow?.document;
    if (!doc) return;

    // Only inject styles once or when mountNode is created
    if (!stylesLoaded) {
      const heads = document.getElementsByTagName('head')[0].innerHTML;
      doc.head.innerHTML = heads;
      
      // Inject some specific styles for the iframe
      const style = doc.createElement('style');
      style.innerHTML = `
        body { background-color: white; overflow-x: hidden; width: 100%; margin: 0; padding: 0; }
        .iframe-root { min-height: 100vh; }
        * { cursor: pointer !important; }
      `;
      doc.head.appendChild(style);
      setStylesLoaded(true);
    }
    
    doc.body.className = "bg-white overflow-x-hidden selection:bg-[#19FF00]/30";
    setMountNode(doc.body);
  }, [stylesLoaded]);

  // Reset stylesLoaded if language changes to force a slight re-sync if needed, 
  // but usually not necessary. For now stay stable.

  return (
    <>
      <iframe 
        ref={frameRef} 
        title="Visual Preview"
        className="w-full h-full border-none transition-opacity duration-300"
        onLoad={() => {
          // Trigger style injection on actual load if not done
          setStylesLoaded(false);
        }}
      />
      {mountNode && createPortal(children, mountNode)}
    </>
  );
};

export function AdminVisualEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'es' | 'en'>('es');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, w: 0 });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [sectionsES, setSectionsES] = useState<Section[]>([]);
  const [sectionsEN, setSectionsEN] = useState<Section[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allEcosystemMembers, setAllEcosystemMembers] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPageData(id);
    }
  }, [id]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.current.x;
      const newW = Math.max(320, Math.min(resizeStart.current.w + (deltaX * 2), 2000));
      setCustomWidth(newW);
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const el = document.getElementById('device-mockup');
    resizeStart.current = { x: e.clientX, w: el?.offsetWidth || 0 };
  };

  const loadPageData = async (pageId: string) => {
    setLoading(true);
    try {
      // 1. Obtener la página desde todas las páginas (usa caché o es rápido)
      const allPages = await supabaseAPI.getAllPages();
      const page = allPages.find(p => p.id === pageId);
      
      if (!page) {
        toast.error('Página no encontrada');
        navigate('/admin/content');
        return;
      }

      // 2. Obtener el contenido en sí mismo de forma paralela
      const [contentES, contentEN] = await Promise.all([
        supabaseAPI.getPageContent(pageId, 'es'),
        supabaseAPI.getPageContent(pageId, 'en')
      ]);

      const targetPage = {
        ...page,
        contentES,
        contentEN
      };

      setPage(targetPage as any);
      let sES = targetPage.contentES?.sections || [];
      let sEN = targetPage.contentEN?.sections || [];

      // Si es el Home, aseguramos que la sección de noticias esté siempre justo debajo de 'ecosystem'
      if (page.id === 'page-home' || page.slug === 'home' || page.slug === 'page-home') {
        const normalizeSections = (sectionsArr: any[]) => {
          let arr = [...sectionsArr];
          
          // Buscar si existe news
          let newsIdx = arr.findIndex((s: any) => s.type === 'news');
          let newsBlock = null;

          if (newsIdx >= 0) {
            // Extraer el bloque temporalmente
            [newsBlock] = arr.splice(newsIdx, 1);
          } else {
            // Crear el bloque si no existe
            newsBlock = {
              id: 'news-home-auto',
              type: 'news' as any,
              order: 90,
              visible: true,
              content: { title: '', subtitle: '', ctaText: '', ctaLink: '' }
            };
          }

          // Encontrar 'ecosystem'
          const ecoIdx = arr.findIndex((s: any) => s.type === 'ecosystem');
          if (ecoIdx >= 0) {
            // Insertar justo después de ecosystem
            arr.splice(ecoIdx + 1, 0, newsBlock);
          } else {
            // Si por alguna razón no hay ecosystem, mandar al final (pero antes de contact si existiera)
            const contactIdx = arr.findIndex((s: any) => s.type === 'contact');
            if (contactIdx >= 0) arr.splice(contactIdx, 0, newsBlock);
            else arr.push(newsBlock);
          }

          // Repara y limpia el orden visual
          return arr.map((s, idx) => ({ ...s, order: idx * 10 }));
        };

        sES = normalizeSections(sES);
        sEN = normalizeSections(sEN);
      }

      setSectionsES(sES);
      setSectionsEN(sEN);
      
      if (targetPage.contentES?.sections && targetPage.contentES.sections.length > 0) {
        setActiveSectionId(targetPage.contentES.sections[0].id);
      }

      // 2. Cargar lista de productos, miembros y categorias de forma eficiente
      const [products, productTranslations, members, memberTranslations, categories, categoryTranslations] = await Promise.all([
        supabaseAPI.getProducts(),
        supabase.from('product_translations').select('*').eq('language', activeLanguage),
        supabaseAPI.getEcosystemMembers(),
        supabase.from('ecosystem_member_translations').select('*').eq('language', activeLanguage),
        supabaseAPI.getCategories(),
        supabase.from('category_translations').select('*').eq('language', activeLanguage)
      ]);

      const productTranslationsMap = (productTranslations.data || []).reduce((acc: any, t: any) => {
        acc[t.product_id] = t;
        return acc;
      }, {});

      const productsWithDetails = products.map(p => ({
        ...p,
        translation: productTranslationsMap[p.id] || null
      }));
      setAllProducts(productsWithDetails);

      const memberTranslationsMap = (memberTranslations.data || []).reduce((acc: any, t: any) => {
        acc[t.member_id] = t;
        return acc;
      }, {});

      const membersWithDetails = members.map(m => ({
        ...m,
        translation: memberTranslationsMap[m.id] || null
      }));
      setAllEcosystemMembers(membersWithDetails);
      
      const categoryTranslationsMap = (categoryTranslations.data || []).reduce((acc: any, t: any) => {
        acc[t.category_id] = t;
        return acc;
      }, {});

      const categoriesWithDetails = categories.map(c => ({
        ...c,
        name: categoryTranslationsMap[c.id]?.name || c.id
      }));
      
      // ✅ Guardamos las categorias en un estado para pasarlas al Preview
      setAllCategories(categoriesWithDetails);
      
    } catch (err) {
      toast.error('Error al cargar la página');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      await Promise.all([
        supabaseAPI.updatePageContent(page.id, 'es', sectionsES),
        supabaseAPI.updatePageContent(page.id, 'en', sectionsEN)
      ]);
      toast.success('Cambios publicados con éxito');
    } catch (error) {
      toast.error('Error al guardar los cambios');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const activeSectionESById = sectionsES.find(s => s.id === activeSectionId) || null;
  const activeSectionENById = sectionsEN.find(s => s.id === activeSectionId) || null;
  const activeSectionIndexByES = activeSectionESById ? sectionsES.findIndex(s => s.id === activeSectionId) : -1;
  const activeSectionIndexByEN = activeSectionENById ? sectionsEN.findIndex(s => s.id === activeSectionId) : -1;

  const activeSectionES = activeSectionESById || (activeSectionIndexByEN >= 0 && activeSectionIndexByEN < sectionsES.length ? sectionsES[activeSectionIndexByEN] : null);
  const activeSectionEN = activeSectionENById || (activeSectionIndexByES >= 0 && activeSectionIndexByES < sectionsEN.length ? sectionsEN[activeSectionIndexByES] : null);
  const activeSections = activeLanguage === 'es' ? sectionsES : sectionsEN;

  const handleUpdateSection = (sectionId: string, content: any, lang: 'es' | 'en' | 'both' = 'both') => {
    if (lang === 'es' || lang === 'both') {
      setSectionsES(prev => prev.map(s => s.id === sectionId ? { ...s, content } : s));
    }
    if (lang === 'en' || lang === 'both') {
      setSectionsEN(prev => prev.map(s => s.id === sectionId ? { ...s, content } : s));
    }
  };


  const handleViewLive = () => {
    if (!page) return;
    const slugWithoutPrefix = page.slug.replace(/^page-/, '');
    const url = page.slug === 'page-home'
      ? '/'
      : `/${slugWithoutPrefix}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F7F9CE]/30">
        <Loader2 className="w-12 h-12 text-[#1C5D15] animate-spin mb-4" />
        <p className="text-[#1C5D15] font-bold animate-pulse uppercase tracking-widest text-sm">Inicializando Editor Visual...</p>
      </div>
    );
  }

  if (!page) return null;

  return (
    <ProtectedRoute>
      <SEO title={`Editando: ${page.slug.replace(/page-/g, '').replace(/-/g, ' ')} | Editor Visual`} />
      <div className="h-screen w-full bg-[#f0f2f0] flex flex-col overflow-hidden font-sans">
      {/* Premium Toolbar */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/content')} 
            className="text-[#629960] hover:text-[#1C5D15] hover:bg-[#1C5D15]/5 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Panel
          </Button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h1 className="font-extrabold text-[#1C5D15] text-sm uppercase tracking-tighter">
              {page.slug.replace(/page-/g, '').replace(/-/g, ' ')}
            </h1>
            <p className="text-[10px] text-[#629960] font-medium uppercase tracking-widest leading-none">Editor Visual Pro</p>
          </div>
        </div>
        
        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button 
            onClick={() => { setDeviceView('mobile'); setCustomWidth(null); }}
            className={`p-2 rounded-xl transition-all ${deviceView === 'mobile' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            title="Móvil"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setDeviceView('tablet'); setCustomWidth(null); }}
            className={`p-2 rounded-xl transition-all ${deviceView === 'tablet' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setDeviceView('desktop'); setCustomWidth(null); }}
            className={`p-2 rounded-xl transition-all ${deviceView === 'desktop' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            title="Escritorio (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          
          {deviceView !== 'desktop' && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button 
                onClick={() => { setDeviceOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait'); setCustomWidth(null); }}
                className={`p-2 rounded-xl transition-all bg-white text-[#1C5D15] shadow-sm hover:scale-105`}
                title="Rotar dispositivo (Ensanchar)"
              >
                <Smartphone className={`w-4 h-4 transition-transform duration-500 ${deviceOrientation === 'landscape' ? '-rotate-90' : ''}`} />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 border rounded-xl p-1 gap-1">
            <button
              className={`h-7 px-3 text-[10px] font-black rounded-lg transition-all ${activeLanguage === 'es' ? 'bg-[#1C5D15] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveLanguage('es')}
            >
              ES
            </button>
            <button
              className={`h-7 px-3 text-[10px] font-black rounded-lg transition-all ${activeLanguage === 'en' ? 'bg-[#1C5D15] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveLanguage('en')}
            >
              EN
            </button>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleViewLive}
            className="rounded-full border-[#1C5D15]/20 text-[#1C5D15] hover:bg-[#1C5D15]/5 h-9 font-bold text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Previsualizar
          </Button>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] text-white rounded-full px-6 font-bold shadow-lg shadow-[#1C5D15]/20 h-9 transition-all active:scale-95"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Publicar
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Boton Toggle Flotante - Posición inteligente */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute z-[999] transition-all duration-300 ease-out bg-white shadow-xl rounded-lg p-2 hover:bg-gray-50 hover:shadow-2xl ${
            sidebarOpen 
              ? 'left-[356px] top-[72px]' 
              : 'left-4 top-[72px]'
          }`}
          title="Alternar panel de configuración"
        >
          {sidebarOpen ? <PanelLeftClose className="w-5 h-5 text-[#1C5D15]" /> : <PanelLeftOpen className="w-5 h-5 text-[#1C5D15]" />}
        </button>

        {/* Sidebar Controls */}
        <aside className={`${sidebarOpen ? 'w-[400px]' : 'w-0'} bg-white border-r flex-shrink-0 flex flex-col h-full overflow-hidden shadow-2xl relative z-10 transition-all duration-300 ease-out`}>

          <div className="p-4 border-b bg-gray-50/80 flex items-center justify-between">
            <div>
              <h2 className="font-black text-[#1C5D15] text-xs uppercase tracking-widest">Configuración</h2>
              <p className="text-[10px] text-[#629960] font-medium">Personaliza el bloque seleccionado</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            {activeSectionES && activeSectionEN ? (
               <VisualEditorSidebar 
                 sectionES={activeSectionES} 
                 sectionEN={activeSectionEN}
                 onUpdateSection={handleUpdateSection}
                 availableProducts={allProducts}
               />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 select-none">
                <div className="w-20 h-20 bg-[#F7F9CE] rounded-full flex items-center justify-center mb-6 animate-bounce transition-all duration-1000">
                  <Globe className="w-10 h-10 text-[#1C5D15]" />
                </div>
                <h3 className="text-[#1C5D15] font-black uppercase text-sm mb-2">Editor en Vivo</h3>
                <p className="text-xs text-[#629960] leading-relaxed">
                  Toca cualquier elemento del sitio en el panel derecho para editar sus propiedades, textos e imágenes de forma visual.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Premium Preview Canvas with Device Mockup */}
        <main className="flex-1 bg-[#222] overflow-y-auto flex items-start justify-center p-8 lg:p-12 custom-scrollbar-dark">
          <div className="relative group w-full flex justify-center py-10 min-h-screen items-start">
            
            <div className={`relative flex items-center justify-center ${deviceView !== 'desktop' ? 'mx-auto' : 'w-full'}`}>
              {/* Drag Handle (Right) */}
              {deviceView !== 'desktop' && (
                <div 
                  onMouseDown={startResize}
                  className="absolute -right-8 w-6 h-20 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] rounded-full cursor-ew-resize z-50 flex flex-col items-center justify-center border border-gray-200 transition-all active:bg-gray-50 active:scale-95 group-hover:opacity-100 opacity-50"
                  title="Arrastrar para redimensionar"
                >
                  <div className="w-1 h-8 bg-gray-300 rounded-full flex gap-1">
                     <span className="w-px h-full bg-gray-400"></span>
                     <span className="w-px h-full bg-gray-400"></span>
                  </div>
                </div>
              )}

              {/* Device Container */}
              <div 
                id="device-mockup"
                style={{
                  width: customWidth ? `${customWidth}px` : 
                    (deviceView === 'mobile' ? (deviceOrientation === 'landscape' ? '812px' : '375px') : 
                     deviceView === 'tablet' ? (deviceOrientation === 'landscape' ? '1024px' : '768px') : undefined)
                }}
                className={`bg-white ease-out shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative flex-shrink-0 origin-top ${isResizing ? '' : 'transition-all duration-700'} ${
                  deviceView === 'mobile' ? 
                    (deviceOrientation === 'landscape' ? 'h-[375px] rounded-[40px] border-[12px] border-[#111] overflow-hidden' : 'h-[812px] rounded-[60px] border-[12px] border-[#111] overflow-hidden') : 
                  deviceView === 'tablet' ? 
                    (deviceOrientation === 'landscape' ? 'h-[768px] rounded-[40px] border-[14px] border-[#111] overflow-hidden' : 'h-[1024px] rounded-[40px] border-[14px] border-[#111] overflow-hidden') : 
                  'w-full max-w-[1400px] rounded-sm shadow-none rounded-xl overflow-hidden h-[calc(100vh-120px)] min-h-[600px]'
                }`}
              >
              {/* Device Notch / Camera */}
              {deviceView === 'mobile' && deviceOrientation === 'portrait' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#111] rounded-b-3xl z-[100] flex items-end justify-center pb-1">
                  <div className="w-12 h-1 bg-gray-800 rounded-full" />
                </div>
              )}
              {deviceView === 'mobile' && deviceOrientation === 'landscape' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-40 bg-[#111] rounded-r-3xl z-[100] flex items-center justify-end pr-1">
                  <div className="w-1 h-12 bg-gray-800 rounded-full" />
                </div>
              )}
              
              {deviceView === 'tablet' && deviceOrientation === 'portrait' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rounded-full mt-4 z-[100] border border-gray-800" />
              )}
              {deviceView === 'tablet' && deviceOrientation === 'landscape' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#111] rounded-full ml-4 z-[100] border border-gray-800" />
              )}

              {/* Real Content Wrapper */}
              <div className={`h-full overflow-y-auto custom-scrollbar-content ${deviceView !== 'desktop' ? 'bg-white' : ''}`}>
                 <PreviewFrame>
                   <div className="min-h-screen relative flex flex-col overflow-x-hidden">
                     {/* Static Settings (No edit) */}
                     <div className="pointer-events-none opacity-90 saturate-50 z-50">
                       <Navigation />
                     </div>
                     
                     <div className="pt-20 flex-1">
                       <VisualEditorPreview 
                         sections={activeSections} 
                         activeSectionId={activeSectionId}
                         onSectionClick={setActiveSectionId}
                         availableProducts={allProducts}
                         availableEcosystemMembers={allEcosystemMembers}
                         availableCategories={allCategories}
                       />
                     </div>
                     
                     {/* Static Menu (No edit) */}
                     <div className="pointer-events-none opacity-90 saturate-50 mt-auto shrink-0 z-40 bg-white">
                       <Footer contactInfo={{ phone: "+57 (300) 123-4567", email: "contacto@bionanoayt.com", location: "Bogotá, Colombia" }} />
                     </div>
                   </div>
                 </PreviewFrame>
              </div>

              {/* Device Home Indicator */}
              {deviceView === 'mobile' && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#111] rounded-full z-[100]" />
              )}
            </div> {/* Closes device-mockup */}

            {/* Iframe Shield to prevent mouse events trapped by iframe during drag */}
            {isResizing && <div className="absolute inset-0 z-[999] cursor-ew-resize bg-transparent" />}
            
          </div> {/* Closes wrapper div */}

          {/* Viewport Info Badge - Positioned relative to the whole container now */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1C5D15] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl opacity-50 transition-opacity z-[100] border border-white/20 backdrop-blur-md">
              {deviceView} View • {customWidth ? `${Math.round(customWidth)}px` : (deviceView === 'mobile' ? (deviceOrientation === 'landscape' ? '812px' : '375px') : deviceView === 'tablet' ? (deviceOrientation === 'landscape' ? '1024px' : '768px') : '100%')} • {activeLanguage.toUpperCase()}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1C5D15/20; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #1C5D15; }

        .custom-scrollbar-dark::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar-dark:hover::-webkit-scrollbar-thumb { background: #444; }

        .custom-scrollbar-content::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar-content:hover::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-content::-webkit-scrollbar-thumb { background: #1C5D15/40; border-radius: 10px; }
      `}</style>
      </div>
    </ProtectedRoute>
  );
}
