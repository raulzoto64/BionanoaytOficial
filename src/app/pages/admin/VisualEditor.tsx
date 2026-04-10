import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router';
import { supabase, supabaseAPI, PageWithContent, Section } from '../../data/supabase';
import { Button } from '../../components/ui/button';
import { 
  ChevronLeft, 
  Save, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Globe, 
  Eye, 
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

import { VisualEditorSidebar } from '../../components/admin/visual-editor/VisualEditorSidebar';
import { VisualEditorPreview } from '../../components/admin/visual-editor/VisualEditorPreview';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { SEO } from '../../components/SEO';

// Helper component for Iframe Preview (defined outside to prevent re-mounting on every render)
const PreviewFrame = ({ children, language }: { children: React.ReactNode, language: string }) => {
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
    <iframe 
      ref={frameRef} 
      title="Visual Preview"
      className="w-full h-full border-none transition-opacity duration-300"
      onLoad={() => {
        // Trigger style injection on actual load if not done
        setStylesLoaded(false);
      }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
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
  
  const [sectionsES, setSectionsES] = useState<Section[]>([]);
  const [sectionsEN, setSectionsEN] = useState<Section[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPageData(id);
    }
  }, [id]);

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
      setSectionsES(targetPage.contentES?.sections || []);
      setSectionsEN(targetPage.contentEN?.sections || []);
      
      if (targetPage.contentES?.sections?.length > 0) {
        setActiveSectionId(targetPage.contentES.sections[0].id);
      }

      // 2. Cargar lista de productos y sus traducciones de forma eficiente (UNA sola petición extra)
      const [products, allTranslations] = await Promise.all([
        supabaseAPI.getProducts(),
        supabase.from('product_translations').select('*').eq('language', activeLanguage)
      ]);

      const translationsMap = (allTranslations.data || []).reduce((acc: any, t: any) => {
        acc[t.product_id] = t;
        return acc;
      }, {});

      const productsWithDetails = products.map(p => ({
        ...p,
        translation: translationsMap[p.id] || null
      }));

      setAllProducts(productsWithDetails);
      
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

  const activeSectionES = sectionsES.find(s => s.id === activeSectionId) || null;
  const activeSectionEN = sectionsEN.find(s => s.id === activeSectionId) || null;
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
    const url = page.slug === 'page-home' ? '/' : `/${page.slug}`;
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
            onClick={() => setDeviceView('mobile')}
            className={`p-2 rounded-xl transition-all ${deviceView === 'mobile' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            title="Móvil (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeviceView('tablet')}
            className={`p-2 rounded-xl transition-all ${deviceView === 'tablet' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeviceView('desktop')}
            className={`p-2 rounded-xl transition-all ${deviceView === 'desktop' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            title="Escritorio (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
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
        {/* Sidebar Controls */}
        <aside className="w-[400px] bg-white border-r flex-shrink-0 flex flex-col h-full overflow-hidden shadow-2xl relative z-10">
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
          <div className="relative group transition-all duration-700 w-full flex justify-center">
            
            {/* Device Container */}
            <div 
              className={`bg-white transition-all duration-700 ease-out shadow-[0_0_100px_rgba(0,0,0,0.5)] relative mx-auto ${
                deviceView === 'mobile' ? 'w-[375px] h-[812px] rounded-[60px] border-[12px] border-[#111] overflow-hidden' : 
                deviceView === 'tablet' ? 'w-[768px] h-[1024px] rounded-[40px] border-[14px] border-[#111] overflow-hidden' : 
                'w-full max-w-[1400px] min-h-screen rounded-sm shadow-none md:rounded-xl'
              }`}
            >
              {/* Device Notch / Camera */}
              {deviceView === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#111] rounded-b-3xl z-[100] flex items-end justify-center pb-1">
                  <div className="w-12 h-1 bg-gray-800 rounded-full" />
                </div>
              )}
              {deviceView === 'tablet' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rounded-full mt-4 z-[100] border border-gray-800" />
              )}

              {/* Real Content Wrapper */}
              <div className={`h-full overflow-y-auto custom-scrollbar-content ${deviceView !== 'desktop' ? 'bg-white' : ''}`}>
                 <PreviewFrame language={activeLanguage}>
                   <div className="min-h-screen">
                     <VisualEditorPreview 
                       sections={activeSections} 
                       activeSectionId={activeSectionId}
                       onSectionClick={setActiveSectionId}
                       language={activeLanguage}
                       availableProducts={allProducts}
                     />
                   </div>
                 </PreviewFrame>
              </div>

              {/* Device Home Indicator */}
              {deviceView === 'mobile' && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#111] rounded-full z-[100]" />
              )}
            </div>

            {/* Viewport Info Badge */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1C5D15] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl opacity-50 group-hover:opacity-100 transition-opacity">
              {deviceView} View • {activeLanguage.toUpperCase()}
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
