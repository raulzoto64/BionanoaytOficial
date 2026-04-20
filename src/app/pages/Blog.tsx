"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation, PageContent } from '../data/supabase';
import { HeroBlog } from '../components/HeroBlog';
import { BlogPostsSection } from '../components/BlogPostsSection';

interface PostWithTranslation {
  id: string;
  slug: string;
  author: string;
  cover_image: string;
  status: 'draft' | 'published';
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  translation: BlogPostTranslation;
  category_id?: string;
  category_name?: string;
  type: 'article' | 'news';
}

export function Blog() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<PostWithTranslation[]>(() => 
    supabaseAPI.getCachedData(`blog-posts-ready-${language}`) || []
  );
  const [filteredPosts, setFilteredPosts] = useState<PostWithTranslation[]>(() => 
    supabaseAPI.getCachedData(`blog-posts-ready-${language}`) || []
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'news' | 'article'>('all');
  const [pageData, setPageData] = useState<PageContent | null>(() => 
    supabaseAPI.getCachedData(`page-content-page-blog-${language}`)
  );
  const [loading, setLoading] = useState(!pageData);

  // --- RENDERIZADOR DE SECCIONES ---
  const renderSection = (section: any, index: number) => {
    if (!section.visible) return null;
    return (
      <BlogSectionPreview
        key={section.id}
        section={section}
        index={index}
        language={language}
        filteredPosts={filteredPosts}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    );
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Obtenemos todo el contenido de la página y las categorías
        const [allCategories, pageContent] = await Promise.all([
          supabaseAPI.getBlogCategories(),
          supabaseAPI.getPageContent('page-blog', language)
        ]);
        
        setPageData(pageContent);

        // Mapa de categorías para no repetir peticiones
        const categoryNamesMap: Record<string, string> = {};
        await Promise.all(allCategories.map(async (cat: any) => {
          const trans = await supabaseAPI.getBlogCategoryTranslation(cat.id, language);
          categoryNamesMap[cat.id] = trans?.name || cat.slug;
        }));

        // OPTIMIZACIÓN: Usar la API de traducciones masiva para evitar 100 peticiones individuales
        // Bypasseamos el cache manual para asegurar que los cambios SQL se vean
        const postsWithTranslationsRaw = await supabaseAPI.getAllBlogPostTranslations(language);
        
        const postsWithCategories = postsWithTranslationsRaw.map((post: any) => {
          // Ya no descartamos artículos. Si falta traducción, usamos fallbacks.
          const translation = post.title ? {
            post_id: post.id,
            language: language,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            meta_keywords: post.meta_keywords
          } : (post.translation || { 
            title: post.slug.replace(/-/g, ' ').toUpperCase(), 
            excerpt: "Contenido en preparación...",
            content: "[]" 
          });

          return {
            ...post,
            translation,
            category_name: post.category_name || (post.category_id ? categoryNamesMap[post.category_id] : (language === 'es' ? 'General' : 'General'))
          };
        });

        console.log(`📊 [BLOG] Artículos procesados (${language}):`, postsWithCategories.length);
        
        setPosts(postsWithCategories);
        setFilteredPosts(postsWithCategories);
        
        // Guardar en caché local para persistencia rápida
        supabaseAPI._saveToCache(`blog-posts-ready-${language}`, postsWithCategories);
        supabaseAPI._saveToCache(`page-content-page-blog-${language}`, pageContent);
      } catch (error) {
        console.error("Error cargando datos del blog:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  // --- FILTRADO LÓGICO ---
  useEffect(() => {
    console.log(`🔍 [FILTER] Aplicando filtro: ${activeFilter} sobre ${posts.length} posts`);
    if (activeFilter === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.type === activeFilter);
      console.log(`✅ [FILTER] Resultado: ${filtered.length} posts tipo ${activeFilter}`);
      setFilteredPosts(filtered);
    }
  }, [activeFilter, posts]);

  // MECANISMO DE CURA: Si está vacío y no está cargando, intentamos una recarga forzada
  useEffect(() => {
    if (!loading && posts.length > 0) {
      const counts = posts.reduce((acc: any, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {});
      console.log("📊 [STATS] Distribución en memoria:", counts);
    }

    if (!loading && posts.length === 0) {
      console.log("🔄 [BLOG] Sincronizando con la base de datos...");
      const timer = setTimeout(() => {
        // Bloqueamos el cache manual para esta petición de rescate
        supabaseAPI._invalidateCache(`blog-posts-ready-${language}`);
        supabaseAPI._invalidateCache(`blog-translations-${language}`);
        // Forzamos la recarga de la página (estado)
        setLoading(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [posts.length, loading, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1C5D15]"></div>
          <p className="mt-4 text-[#629960] font-medium">
            {language === 'es' ? 'Cargando historias...' : 'Loading stories...'}
          </p>
        </div>
      </div>
    );
  }

  // Obtenemos las secciones (pageData ya es el contenido filtrado por idioma)
  const sections = pageData?.sections;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0]">
      {/* Si hay secciones en la DB, las recorremos. 
        renderSection ahora sí procesará el hero-blog.
      */}
      {sections && sections.length > 0 ? (
        sections.map((section: any) => renderSection(section))
      ) : (
        /* FALLBACK: Si no hay diseño en la DB, mostramos un Hero básico y el listado */
        <>
          <div className="py-20 text-center">
            <h1 className="text-4xl font-bold text-[#1C5D15]">Blog</h1>
          </div>
          <BlogPostsSection 
            posts={filteredPosts}
            language={language}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalPages={Math.ceil(filteredPosts.length / 12)}
          />
        </>
      )}
    </div>
  );
}

export function BlogSectionPreview({ 
  section, language, index, 
  filteredPosts = [], activeFilter = 'all', setActiveFilter = () => {} 
}: any) {
  switch (section.type) {
    case "hero":
      return <HeroBlog key={section.id} content={section.content} />;

    case "hero-blog":
      return <HeroBlog key={section.id} content={section.content} />;

    case "header":
      return (
        <div key={section.id} className="max-w-6xl mx-auto px-4 text-center mb-16 pt-12">
          <div className="inline-block px-4 py-1.5 bg-[#19FF00]/20 text-[#1C5D15] rounded-full mb-4 font-bold text-sm uppercase tracking-widest">
            {section.content.badge || "Blog"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-6">
            {section.content.title}
          </h1>
          <p className="text-lg text-[#629960] max-w-2xl mx-auto">
            {section.content.description}
          </p>
        </div>
      );

    case "blog-posts":
      return (
        <BlogPostsSection 
          key={section.id}
          posts={filteredPosts}
          language={language}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          totalPages={Math.ceil(filteredPosts.length / 12)}
        />
      );

    default:
      return null;
  }
}
