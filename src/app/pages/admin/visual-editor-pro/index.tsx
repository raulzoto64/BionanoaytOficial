import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase, supabaseAPI, PageWithContent, Section } from '../../../data/supabase';
import { toast } from 'sonner';

import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { DeviceCanvas } from './DeviceCanvas';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { SEO } from '../../../components/SEO';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

export function AdminVisualEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const [page, setPage] = useState<PageWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'es' | 'en'>('es');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Sincronizar el contexto de idioma con la previsualización
  useEffect(() => {
    setLanguage(activeLanguage);
  }, [activeLanguage, setLanguage]);

  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, w: 0 });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sectionsES, setSectionsES] = useState<Section[]>([]);
  const [sectionsEN, setSectionsEN] = useState<Section[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allEcosystemMembers, setAllEcosystemMembers] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<any[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Escuchar evento para deseleccionar todas las secciones
  useEffect(() => {
    const handleDeselectSection = () => {
      setActiveSectionId(null);
      console.log('[EDITOR] Todas las secciones desactivadas');
    };

    window.addEventListener('editor:deselect-section', handleDeselectSection);
    return () => window.removeEventListener('editor:deselect-section', handleDeselectSection);
  }, []);

  useEffect(() => {
    if (id) {
      loadPageData(id);
    }
  }, [id, activeLanguage]); // Re-load metadata if language changes for translations

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
      const allPages = await supabaseAPI.getAllPages();
      const page = allPages.find(p => p.id === pageId);

      if (!page) {
        toast.error('Página no encontrada');
        navigate('/admin/content');
        return;
      }

      const [contentES, contentEN] = await Promise.all([
        supabaseAPI.getPageContent(pageId, 'es'),
        supabaseAPI.getPageContent(pageId, 'en')
      ]);

      const targetPage = { ...page, contentES, contentEN };

      setPage(targetPage as any);
      let sES = targetPage.contentES?.sections || [];
      let sEN = targetPage.contentEN?.sections || [];

      // Normalize Home News logic
      if (page.id === 'page-home' || page.slug === 'home' || page.slug === 'page-home') {
        const normalizeSections = (sectionsArr: any[]) => {
          let arr = [...sectionsArr];
          let newsIdx = arr.findIndex((s: any) => s.type === 'news');
          let newsBlock = null;

          if (newsIdx >= 0) {
            [newsBlock] = arr.splice(newsIdx, 1);
          } else {
            newsBlock = {
              id: 'news-home-auto',
              type: 'news' as any,
              order: 90,
              visible: true,
              content: { title: '', subtitle: '', ctaText: '', ctaLink: '' }
            };
          }

          const ecoIdx = arr.findIndex((s: any) => s.type === 'ecosystem');
          if (ecoIdx >= 0) arr.splice(ecoIdx + 1, 0, newsBlock);
          else arr.push(newsBlock);

          return arr.map((s, idx) => ({ ...s, order: idx * 10 }));
        };
        sES = normalizeSections(sES);
        sEN = normalizeSections(sEN);
      }

      setSectionsES(sES);
      setSectionsEN(sEN);

      if (sES.length > 0) setActiveSectionId(sES[0].id);

      const [products, productTranslations, members, memberTranslations, categories, categoryTranslations, blogPosts, blogTranslations, blogMeta] = await Promise.all([
        supabaseAPI.getProducts(),
        supabase.from('product_translations').select('*').eq('language', activeLanguage),
        supabaseAPI.getEcosystemMembers(),
        supabase.from('ecosystem_member_translations').select('*').eq('language', activeLanguage),
        supabaseAPI.getCategories(),
        supabase.from('category_translations').select('*').eq('language', activeLanguage),
        supabaseAPI.getBlogPosts('published'),
        supabase.from('blog_post_translations').select('*').eq('language', activeLanguage),
        supabase.from('blog_categories').select('*, blog_category_translations(*)').eq('blog_category_translations.language', activeLanguage)
      ]);

      const productTranslationsMap = (productTranslations.data || []).reduce((acc: any, t: any) => { acc[t.product_id] = t; return acc; }, {});
      setAllProducts(products.map(p => ({ ...p, translation: productTranslationsMap[p.id] || null })));

      const memberTranslationsMap = (memberTranslations.data || []).reduce((acc: any, t: any) => { acc[t.member_id] = t; return acc; }, {});
      setAllEcosystemMembers(members.map(m => ({ ...m, translation: memberTranslationsMap[m.id] || null })));

      const categoryTranslationsMap = (categoryTranslations.data || []).reduce((acc: any, t: any) => { acc[t.category_id] = t; return acc; }, {});
      setAllCategories(categories.map(c => ({ ...c, name: categoryTranslationsMap[c.id]?.name || c.id })));

      // Blog posts normalization for preview
      const blogTranslationsMap = (blogTranslations.data || []).reduce((acc: any, t: any) => { acc[t.post_id] = t; return acc; }, {});
      const enrichedBlogPosts = blogPosts.map(post => ({
        ...post,
        translation: blogTranslationsMap[post.id] || { title: 'Untitled', excerpt: '' },
        category_name: 'General'
      }));
      setAllBlogPosts(enrichedBlogPosts);

    } catch (err) {
      toast.error('Error al cargar la página');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      console.log(`📤 Saving page ${page.id}...`);
      console.log(`   ES sections: ${sectionsES.length}`, sectionsES.map(s => `${s.id}(${s.type})`));
      console.log(`   EN sections: ${sectionsEN.length}`, sectionsEN.map(s => `${s.id}(${s.type})`));
      
      await Promise.all([
        supabaseAPI.updatePageContent(page.id, 'es', sectionsES),
        supabaseAPI.updatePageContent(page.id, 'en', sectionsEN)
      ]);
      toast.success('Cambios publicados con éxito');
    } catch (error) {
      console.error('❌ Error saving:', error);
      toast.error('Error al guardar: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSection = (sectionId: string, content: any, lang: 'es' | 'en' | 'both' = 'both') => {
    if (lang === 'es' || lang === 'both') {
      setSectionsES(prev => prev.map(s => s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s));
    }
    if (lang === 'en' || lang === 'both') {
      setSectionsEN(prev => prev.map(s => s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s));
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setSectionsES(prev => prev.filter(s => s.id !== sectionId));
    setSectionsEN(prev => prev.filter(s => s.id !== sectionId));
    if (activeSectionId === sectionId) setActiveSectionId(null);
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const move = (prev: Section[]) => {
      const idx = prev.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      
      const newArr = [...prev];
      [newArr[idx], newArr[newIdx]] = [newArr[newIdx], newArr[idx]];
      
      // Update order
      return newArr.map((s, i) => ({ ...s, order: i * 10 }));
    };

    setSectionsES(prev => move(prev));
    setSectionsEN(prev => move(prev));
  };

  const handleAddSection = (type: string) => {
    const newId = `${type}-${Date.now()}`;
    const newSection: Section = {
      id: newId,
      type: type as any,
      order: sectionsES.length * 10,
      visible: true,
      content: {
        title: 'Nueva Sección',
        subtitle: 'Descripción de ejemplo para la nueva sección.',
        items: []
      }
    };

    setSectionsES(prev => [...prev, newSection]);
    setSectionsEN(prev => [...prev, newSection]);
    setActiveSectionId(newId);
  };

  const handleViewLive = () => {
    if (!page) return;
    const slug = page.slug.replace(/^page-/, '');
    window.open(slug === 'home' ? '/' : `/${slug}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F7F9CE]/30">
        <Loader2 className="w-12 h-12 text-[#1C5D15] animate-spin mb-4" />
        <p className="text-[#1C5D15] font-bold uppercase tracking-widest text-sm">Inicializando Editor Visual...</p>
      </div>
    );
  }

  if (!page) return null;

  const activeSections = activeLanguage === 'es' ? sectionsES : sectionsEN;
  const activeSectionES = sectionsES.find(s => s.id === activeSectionId) || null;
  const activeSectionEN = sectionsEN.find(s => s.id === activeSectionId) || null;

  return (
    <ProtectedRoute>
      <SEO title={`Editando: ${page.slug} | Editor Visual`} />
      <div className="h-screen w-full bg-[#f0f2f0] flex flex-col overflow-hidden font-sans">
        
        <Toolbar 
          pageTitle={page.slug.replace(/page-/g, '').replace(/-/g, ' ')}
          onBack={() => navigate('/admin/content')}
          deviceView={deviceView}
          setDeviceView={setDeviceView}
          deviceOrientation={deviceOrientation}
          setDeviceOrientation={setDeviceOrientation}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          onViewLive={handleViewLive}
          onSave={handleSave}
          saving={saving}
          setCustomWidth={setCustomWidth}
        />

        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeSectionES={activeSectionES}
            activeSectionEN={activeSectionEN}
            handleUpdateSection={handleUpdateSection}
            onAddSection={handleAddSection}
            allProducts={allProducts}
            allEcosystemMembers={allEcosystemMembers}
            pageSlug={page?.slug}
          />

          <DeviceCanvas 
            deviceView={deviceView}
            deviceOrientation={deviceOrientation}
            customWidth={customWidth}
            onResizeStart={startResize}
            isResizing={isResizing}
            activeLanguage={activeLanguage}
            activeSections={activeSections}
            activeSectionId={activeSectionId}
            setActiveSectionId={setActiveSectionId}
            allProducts={allProducts}
            allEcosystemMembers={allEcosystemMembers}
            allCategories={allCategories}
            allBlogPosts={allBlogPosts}
            pageSlug={page.slug}
            onDeleteSection={handleDeleteSection}
            onMoveSectionUp={(id) => handleMoveSection(id, 'up')}
            onMoveSectionDown={(id) => handleMoveSection(id, 'down')}
          />
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(28,93,21,0.2); border-radius: 10px; }
          .custom-scrollbar-dark::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
          .custom-scrollbar-content::-webkit-scrollbar { width: 0px; }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
