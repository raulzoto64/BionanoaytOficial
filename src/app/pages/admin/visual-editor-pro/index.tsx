import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabaseAPI, PageWithContent, Section, ReusableSection } from '../../../data/supabase';
import { toast } from 'sonner';

import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { DeviceCanvas } from './DeviceCanvas';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { SEO } from '../../../components/SEO';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

export function AdminVisualEditor() {
  const { type = 'page', id } = useParams<{ type?: string; id?: string }>();
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
  const [allBlogPosts] = useState<any[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [allForms, setAllForms] = useState<any[]>([]);

  // Cargar datos necesarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, members, categories, forms] = await Promise.all([
          supabaseAPI.getAllProducts(),
          supabaseAPI.getAllEcosystemMembers(),
          supabaseAPI.getAllCategories(),
          supabaseAPI.getForms()
        ]);

        setAllProducts(products);
        setAllEcosystemMembers(members);
        setAllCategories(categories);
        setAllForms(forms || []);
      } catch (error) {

      }
    };
    fetchData();
  }, []);

  // Escuchar evento para deseleccionar todas las secciones
  useEffect(() => {
    const handleDeselectSection = () => {
      if (!['footer', 'legal', 'blog'].includes(type)) {
        setActiveSectionId(null);

      }
    };

    window.addEventListener('editor:deselect-section', handleDeselectSection);
    return () => window.removeEventListener('editor:deselect-section', handleDeselectSection);
  }, []);

  useEffect(() => {
    if (id || type === 'footer') {
      loadUniversalData();
    }
  }, [id, type]); // Recargar si cambia el ID o el tipo

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

  const loadUniversalData = async () => {
    setLoading(true);
    try {
      // 1. Cargar metadatos del objeto (si aplica)
      if (type === 'page' && id) {
        const allPages = await supabaseAPI.getAllPages();
        const pageObj = allPages.find((p: any) => p.id === id);
        if (pageObj) {
          setPage(pageObj as any);

        }
      } else if (type === 'blog' && id) {
        const [blogPost, blogTransES, blogTransEN] = await Promise.all([
          supabaseAPI.getBlogPostById(id),
          supabaseAPI.getBlogPostTranslation(id, 'es'),
          supabaseAPI.getBlogPostTranslation(id, 'en')
        ]);
        
        if (blogPost) {
          // Guardamos las traducciones en un objeto estructurado dentro de la página
          const pageData = { 
            ...blogPost, 
            translationES: blogTransES, 
            translationEN: blogTransEN,
            // Mantener compatibilidad con componentes que buscan .translation
            translation: activeLanguage === 'es' ? blogTransES : blogTransEN
          };
          setPage(pageData as any);
          
          // Poblar contenido de cabecera con datos reales.
          // CRÍTICO: La imagen de portada viene del registro global blogPost, NO de la traducción.
          const headerContentES = {
            title_es: blogTransES?.title || blogPost.title || '',
            excerpt_es: blogTransES?.excerpt || blogPost.excerpt || '',
            cover_image: blogPost.cover_image, // <--- Este es el valor real
            author: blogPost.author,
            type: blogPost.type,
            category_name: blogPost.category_name,
            meta_title: blogTransES?.meta_title || '',
            meta_description: blogTransES?.meta_description || '',
            meta_keywords: blogTransES?.meta_keywords || ''
          };

          const headerContentEN = {
            title_en: blogTransEN?.title || blogPost.title || '',
            excerpt_en: blogTransEN?.excerpt || blogPost.excerpt || '',
            cover_image: blogPost.cover_image,
            author: blogPost.author,
            type: blogPost.type,
            category_name: blogPost.category_name,
            meta_title: blogTransEN?.meta_title || '',
            meta_description: blogTransEN?.meta_description || '',
            meta_keywords: blogTransEN?.meta_keywords || ''
          };

          const headerSectionES = { id: 'page-header', type: 'page-metadata' as any, order: -1, visible: true, content: headerContentES };
          const headerSectionEN = { id: 'page-header', type: 'page-metadata' as any, order: -1, visible: true, content: headerContentEN };
          
          // Cargar Secciones / Contenido Universal
          const [sES, sEN] = await Promise.all([
            supabaseAPI.getUniversalContent(type, id, 'es'),
            supabaseAPI.getUniversalContent(type, id, 'en')
          ]);

          const prepareSections = (rawContent: any, headerSection: any) => {
            if (!Array.isArray(rawContent) || rawContent.length === 0) {
               // Fallback para contenido legacy que viene como string HTML o objeto simple
               let content = rawContent;
               if (typeof content === 'string') content = { html: content };
               else if (!content || typeof content !== 'object') content = { html: '<p>Empieza a escribir...</p>' };
               else if (content.content) content = { html: content.content }; // Manejo de estructura de traducción plana

               return [headerSection, { id: 'main-content', type: 'rich-text' as any, order: 0, visible: true, content }];
            }
            return [headerSection, ...rawContent];
          };

          setSectionsES(prepareSections(sES, headerSectionES));
          setSectionsEN(prepareSections(sEN, headerSectionEN));
          setActiveSectionId('page-header');
        }
        return; // Terminamos carga específica
      } else if (type === 'product' && id) {
        const [product, prodTransES, prodTransEN] = await Promise.all([
          supabaseAPI.getProductById(id),
          supabaseAPI.getProductTranslation(id, 'es'),
          supabaseAPI.getProductTranslation(id, 'en')
        ]);
        

        
        if (product) {
          const pageData = { 
            ...product, 
            translationES: prodTransES, 
            translationEN: prodTransEN,
            translation: activeLanguage === 'es' ? prodTransES : prodTransEN
          };
          setPage(pageData as any);
          
          const headerContentES = {
            name: prodTransES?.name || product.slug || '',
            description: prodTransES?.description || '',
            short_description: prodTransES?.short_description || '',
            cover_image: product.image,
            images: product.images || [],
            category: product.category,
            status: product.status,
            featured: product.featured,
            technical_specs: prodTransES?.technical_specs || {},
            features: prodTransES?.features || [],
            benefits: prodTransES?.benefits || [],
            meta_title: prodTransES?.meta_title || '',
            meta_description: prodTransES?.meta_description || ''
          };

          const headerContentEN = {
            name: prodTransEN?.name || product.slug || '',
            description: prodTransEN?.description || '',
            short_description: prodTransEN?.short_description || '',
            cover_image: product.image,
            images: product.images || [],
            category: product.category,
            status: product.status,
            featured: product.featured,
            technical_specs: prodTransEN?.technical_specs || {},
            features: prodTransEN?.features || [],
            benefits: prodTransEN?.benefits || [],
            meta_title: prodTransEN?.meta_title || '',
            meta_description: prodTransEN?.meta_description || ''
          };

          const headerSectionES = { id: 'page-header', type: 'page-metadata' as any, order: -1, visible: true, content: headerContentES };
          const headerSectionEN = { id: 'page-header', type: 'page-metadata' as any, order: -1, visible: true, content: headerContentEN };
          
          const [sES, sEN] = await Promise.all([
            supabaseAPI.getUniversalContent(type, id, 'es'),
            supabaseAPI.getUniversalContent(type, id, 'en')
          ]);

          const prepareSections = (rawContent: any, headerSection: any) => {
            if (!Array.isArray(rawContent) || rawContent.length === 0) {
               return [headerSection];
            }
            return [headerSection, ...rawContent];
          };

          setSectionsES(prepareSections(sES, headerSectionES));
          setSectionsEN(prepareSections(sEN, headerSectionEN));
          setActiveSectionId('page-header');
        }
        return;
      } else if (type === 'legal' && id) {
        let rawLegal = await supabaseAPI.getLegalPageById(id);
        let legalPage = Array.isArray(rawLegal) ? rawLegal[0] : rawLegal;
        
        if (!legalPage || (typeof legalPage === 'object' && Object.keys(legalPage).length === 0)) {
           const allPages = await supabaseAPI.getLegalPages();
           legalPage = allPages.find((p: any) => p.id === id || p.slug === id);
        }

        if (legalPage) {
            setPage({ ...legalPage, slug: legalPage.slug || 'untitled-legal' } as any);
        }
      } else if (type === 'footer') {
        setPage({ id: 'footer-global', slug: 'footer' } as any);
      }

      // 2. Cargar Secciones / Contenido Universal
      const [sES, sEN] = await Promise.all([
        supabaseAPI.getUniversalContent(type, id || 'footer', 'es'),
        supabaseAPI.getUniversalContent(type, id || 'footer', 'en')
      ]);

      // Resolver el objeto de datos actual (no el estado React que es stale)
      // page aún no se actualizó porque setPage() es asíncrono
      let currentEntity: any = null;
      if (type === 'legal') {
        // legalPage ya fue resuelto arriba en este mismo bloque
        // Re-fetch para tenerlo disponible aquí
        let rawLegalCurrent = await supabaseAPI.getLegalPageById(id || '');
        currentEntity = Array.isArray(rawLegalCurrent) ? rawLegalCurrent[0] : rawLegalCurrent;
        if (!currentEntity || Object.keys(currentEntity).length === 0) {
          const allP = await supabaseAPI.getLegalPages();
          currentEntity = allP.find((p: any) => p.id === id || p.slug === id);
        }
      }

      const headerContentES = {
        title_es: type === 'legal'
          ? (currentEntity?.title_es || '')
          : (page?.translation?.title || page?.title || ''),
        excerpt_es: type === 'legal' ? '' : (page?.translation?.excerpt || page?.excerpt || ''),
        cover_image: type === 'legal' ? '' : (page?.cover_image || ''),
        author: type === 'legal' ? '' : (page?.author || ''),
        type: page?.type,
        category_name: page?.category_name
      };

      const headerContentEN = {
        title_en: type === 'legal'
          ? (currentEntity?.title_en || '')
          : (page?.translation?.title || page?.title || ''),
        excerpt_en: type === 'legal' ? '' : (page?.translation?.excerpt || page?.excerpt || ''),
        cover_image: type === 'legal' ? '' : (page?.cover_image || ''),
        author: type === 'legal' ? '' : (page?.author || ''),
        type: page?.type,
        category_name: page?.category_name
      };

      const headerSectionES = { id: 'page-header', type: 'page-metadata' as any, order: -1, visible: true, content: headerContentES };
      const headerSectionEN = { id: 'page-header', type: 'page-metadata' as any, order: -1, visible: true, content: headerContentEN };



      if (type === 'footer') {
        setSectionsES([ { id: 'footer-main', type: 'footer-settings' as any, order: 0, visible: true, content: sES } ]);
        setSectionsEN([ { id: 'footer-main', type: 'footer-settings' as any, order: 0, visible: true, content: sEN } ]);
        setActiveSectionId('footer-main');
      } else if ((type === 'legal' || type === 'blog') && (!Array.isArray(sES) || sES.length === 0)) {
        const wrapContent = (content: any) => {
          if (typeof content === 'string') return { html: content };
          if (content && typeof content === 'object' && !Array.isArray(content)) return content;
          return { html: '<p>Empieza a escribir aquí...</p>' };
        };
        const contentES = wrapContent(sES);
        const contentEN = wrapContent(sEN);
        
        const baseSectionES = { id: 'main-content', type: 'rich-text' as any, order: 0, visible: true, content: contentES };
        const baseSectionEN = { id: 'main-content', type: 'rich-text' as any, order: 0, visible: true, content: contentEN };
        
        setSectionsES([headerSectionES, baseSectionES]);
        setSectionsEN([headerSectionEN, baseSectionEN]);
        setActiveSectionId('page-header');
      } else {
        const sectionsArrayES = Array.isArray(sES) ? sES : [];
        const sectionsArrayEN = Array.isArray(sEN) ? sEN : [];
        
        if (type === 'blog' || type === 'legal') {
           const INTERNAL_TYPES = ['blog-text', 'rich-text', 'blog-intro', 'blog-quote', 'blog-list', 'blog-image', 'blog-divider'];
           
           // Para legales, filtramos ESTRICTAMENTE solo contenido interno (sin CTAs, banners, etc)
           // Para blogs, solemos permitir CTAs al final, así que solo filtramos en legales
           const filteredES = type === 'legal' 
             ? sectionsArrayES.filter(s => INTERNAL_TYPES.includes(s.type))
             : sectionsArrayES;
           
           const filteredEN = type === 'legal'
             ? sectionsArrayEN.filter(s => INTERNAL_TYPES.includes(s.type))
             : sectionsArrayEN;

           setSectionsES([headerSectionES, ...filteredES]);
           setSectionsEN([headerSectionEN, ...filteredEN]);
           setActiveSectionId('page-header');
        } else {
           setSectionsES(sectionsArrayES);
           setSectionsEN(sectionsArrayEN);
           if (sectionsArrayES.length > 0) setActiveSectionId(sectionsArrayES[0].id);
        }
      }

      // Los datos del catálogo (productos, miembros, etc.) ahora se cargan de forma diferida 
      // o bajo demanda en los componentes que los necesiten, igual que en la web pública.
      

    } catch (err) {
      toast.error('Error al cargar contenido');

    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page || (!id && type !== 'footer')) return;
    setSaving(true);
    try {
      const finalId = id || 'footer';
      
      // Si es footer, extraemos el contenido de la sección envuelta
      if (type === 'footer') {
        const footerES = sectionsES[0]?.content;
        const footerEN = sectionsEN[0]?.content;
        
        // El footer suele ser global, guardamos por separado si la API lo requiere o unificado
        // En este caso saveUniversalContent para footer toma el objeto completo
        await supabaseAPI.saveUniversalContent('footer', 'global', 'es', footerES);
        // Nota: Si el footer tiene traducciones internas, el objeto footerES/EN ya las debería contener
      } else {
        // Separar secciones reales de la sección virtual de metadatos antes de guardar
        const realSectionsES = sectionsES.filter(s => s.id !== 'page-header');
        const realSectionsEN = sectionsEN.filter(s => s.id !== 'page-header');
        
        // Guardar metadatos si han cambiado
        let headerES = sectionsES.find(s => s.id === 'page-header')?.content;
        let headerEN = sectionsEN.find(s => s.id === 'page-header')?.content;

        // Fallback: Si por alguna razón el header ya no está en el array (ej. filtrado accidental)
        // intentamos recuperarlo de los datos actuales del post/página para no perder la imagen
        if (!headerES && type === 'blog') {

           const pAny = page as any;
           headerES = {
             cover_image: pAny?.cover_image,
             author: pAny?.author,
             type: pAny?.type,
             category_name: pAny?.category_name,
             title_es: pAny?.translationES?.title || pAny?.title || '',
             excerpt_es: pAny?.translationES?.excerpt || pAny?.excerpt || '',
           };
        }



        if (type === 'blog') {

          
          await Promise.all([
            supabaseAPI.updateBlogPostTranslation(finalId, 'es', {
              content: JSON.stringify(realSectionsES),
              ...(headerES ? {
                title: headerES.title_es,
                excerpt: headerES.excerpt_es,
                meta_title: headerES.meta_title,
                meta_description: headerES.meta_description,
                meta_keywords: headerES.meta_keywords,
              } : {})
            }),
            supabaseAPI.updateBlogPostTranslation(finalId, 'en', {
              content: JSON.stringify(realSectionsEN),
              ...(headerEN ? {
                title: headerEN.title_en,
                excerpt: headerEN.excerpt_en,
                meta_title: headerEN.meta_title,
                meta_description: headerEN.meta_description,
                meta_keywords: headerEN.meta_keywords,
              } : {})
            })
          ]);

          if (headerES) {

            await supabaseAPI.updateBlogPostMetadata(finalId, {
               author: headerES.author,
               cover_image: headerES.cover_image,
               type: headerES.type,
               category_name: headerES.category_name,
            });
          }

          // Limpiar caché para que el sitio público vea los cambios inmediatamente
          supabaseAPI._invalidateCache('blog-posts-all');
          supabaseAPI._invalidateCache('blog-posts-published');
          supabaseAPI._invalidateCache('blog-posts-ready-es');
          supabaseAPI._invalidateCache('blog-posts-ready-en');
          supabaseAPI._invalidateCache(`blog-post-${finalId}`); 
          supabaseAPI._invalidateCache(`blog-translations-es`);
          supabaseAPI._invalidateCache(`blog-translations-en`);



        } else if (type === 'product') {

           // Asegurar que el slug no sea null
           const slugToSave = headerES?.name 
             ? headerES.name.toLowerCase()
                 .trim()
                 .replace(/\s+/g, '-')
                 .replace(/[^\w-]+/g, '')
             : (page?.slug || finalId);
           
           await Promise.all([
             supabaseAPI.updateProductTranslation(finalId, 'es', {
                ...headerES,
                sections: JSON.stringify(realSectionsES)
             }),
             supabaseAPI.updateProductTranslation(finalId, 'en', {
                ...headerEN,
                sections: JSON.stringify(realSectionsEN)
             }),
             supabaseAPI.updateProduct(finalId, {
               slug: slugToSave,
               image: headerES?.cover_image,
               images: headerES?.images || [],
               category: headerES?.category,
               status: headerES?.status,
               featured: headerES?.featured
            })
          ]);
           
           supabaseAPI._invalidateCache(`product-${finalId}`);
           supabaseAPI._invalidateCache('all-products');


        } else if (type === 'legal') {
          if (headerES) {
            await supabaseAPI.updateLegalPageMetadata(finalId, {
               title_es: headerES.title_es,
               title_en: headerEN?.title_en
            });
          }
          await Promise.all([
            supabaseAPI.saveUniversalContent(type, finalId, 'es', realSectionsES),
            supabaseAPI.saveUniversalContent(type, finalId, 'en', realSectionsEN)
          ]);
        } else {
          await Promise.all([
            supabaseAPI.saveUniversalContent(type, finalId, 'es', realSectionsES),
            supabaseAPI.saveUniversalContent(type, finalId, 'en', realSectionsEN)
          ]);
        }


      }
      
      toast.success('Cambios publicados con éxito');
      
      // Regresar a la página padre después de guardar con éxito
      setTimeout(() => {
        if (type === 'product') navigate('/admin/products');
        else if (type === 'blog') navigate('/admin/blog/posts');
        else if (type === 'legal') navigate('/admin/legal');
        else if (type === 'footer') navigate('/admin/footer');
        else navigate('/admin/content');
      }, 1500);
    } catch (error) {

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

  const handleAddLibrarySection = (libSection: ReusableSection) => {
    const newId = `${libSection.type}-${Date.now()}`;
    
    // El contenido de la biblioteca es { es: ..., en: ... }
    const contentES = libSection.content.es || libSection.content; // fallback si no hay estructura idiomatica
    const contentEN = libSection.content.en || libSection.content;

    const newSectionES: Section = {
      id: newId,
      type: libSection.type as any,
      order: sectionsES.length * 10,
      visible: true,
      content: contentES
    };

    const newSectionEN: Section = {
      id: newId,
      type: libSection.type as any,
      order: sectionsEN.length * 10,
      visible: true,
      content: contentEN
    };

    setSectionsES(prev => [...prev, newSectionES]);
    setSectionsEN(prev => [...prev, newSectionEN]);
    setActiveSectionId(newId);
    toast.success(`Sección "${libSection.name}" añadida desde la biblioteca`);
  };

  const handleViewLive = () => {
    if (!page?.slug) return;
    // Limpiamos prefijos y slashes iniciales para evitar que //lo-que-sea sea tratado como un dominio
    const cleanSlug = page.slug.replace(/^page-/, '').replace(/^\/+/, '');
    
    let path = `/${cleanSlug}`;
    if (type === 'blog') path = `/blog/${cleanSlug}`;
    else if (type === 'legal') path = `/legal/${cleanSlug}`;
    else if (cleanSlug === 'home' || cleanSlug === '') path = '/';

    window.open(path, '_blank');
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
      <SEO title={`Editando: ${page?.slug || 'Contenido'} | Editor Visual`} />
      <div className="h-screen w-full bg-[#f0f2f0] flex flex-col overflow-hidden font-sans">
        
        <Toolbar 
          pageTitle={(page?.slug || 'Editor').replace(/page-/g, '').replace(/-/g, ' ')}
          onBack={() => {
            if (type === 'product') navigate('/admin/products');
            else if (type === 'blog') navigate('/admin/blog/posts');
            else if (type === 'legal') navigate('/admin/legal');
            else if (type === 'footer') navigate('/admin/footer');
            else navigate('/admin/content');
          }}
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
            onAddLibrarySection={handleAddLibrarySection}
            allProducts={allProducts}
            allEcosystemMembers={allEcosystemMembers}
            availableForms={allForms}
            pageSlug={page?.slug}
            entityType={type as any}
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
            entityType={type as any}
            page={page}
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
