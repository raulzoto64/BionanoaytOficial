"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation, PageWithContent } from '../data/supabase';
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
  const [posts, setPosts] = useState<PostWithTranslation[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostWithTranslation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'news' | 'article'>('all');
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // --- RENDERIZADOR DE SECCIONES ---
  const renderSection = (section: any) => {
    if (!section.visible) return null;

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
        // Si la sección viene de la DB, usamos el componente de listado
        return (
          <BlogPostsSection 
            key={section.id}
            posts={filteredPosts}
            language={language}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalPages={Math.ceil(filteredPosts.length / 8)}
          />
        );

      default:
        return null;
    }
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Asegúrate de que el slug 'page-blog' sea el correcto en tu base de datos
        const [allPosts, allCategories, pageContent] = await Promise.all([
          supabaseAPI.getBlogPosts('published'),
          supabaseAPI.getBlogCategories('active'),
          supabaseAPI.getPageContent('page-blog', language)
        ]);
        
        setPageData(pageContent);

        // Mapa de categorías para no repetir peticiones
        const categoryNamesMap: Record<string, string> = {};
        await Promise.all(allCategories.map(async (cat) => {
          const trans = await supabaseAPI.getBlogCategoryTranslation(cat.id, language);
          categoryNamesMap[cat.id] = trans?.name || cat.slug;
        }));

        const postsWithTranslations = await Promise.all(allPosts.map(async (post) => {
          const [translation, relations] = await Promise.all([
            supabaseAPI.getBlogPostTranslation(post.id, language),
            supabaseAPI.getBlogPostCategories(post.id)
          ]);

          const category_id = relations.length > 0 ? relations[0].category_id : undefined;

          return {
            ...post,
            translation,
            category_id,
            category_name: category_id 
              ? categoryNamesMap[category_id] 
              : (language === 'es' ? 'General' : 'General')
          };
        }));

        setPosts(postsWithTranslations);
        setFilteredPosts(postsWithTranslations);
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
    if (activeFilter === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.type === activeFilter));
    }
  }, [activeFilter, posts]);

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
            totalPages={Math.ceil(filteredPosts.length / 8)}
          />
        </>
      )}
    </div>
  );
}