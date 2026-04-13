"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation, PageWithContent } from '../data/supabase';
import { ContentCard } from '../components/ContentCard';
import { HeroBlog } from '../components/HeroBlog';

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
  const [pageData, setPageData] = useState<PageWithContent | null>(null);
  const [loading, setLoading] = useState(true);

  const renderSection = (section: any, language: string) => {
    if (!section.visible) return null;

    switch (section.type) {
      // TIPO HERO BLOG 380px ALTO
      case "hero-blog":
        return <HeroBlog key={section.id} content={section.content} />;

      // TIPO HEADER BANNER PRINCIPAL
      case "header":
        return (
          <div key={section.id} className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-[#19FF00]/20 text-[#1C5D15] rounded-full mb-4 font-bold text-sm tracking-widest uppercase">
              {section.content.badge || "Blog"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-6 tracking-tight">
              {section.content.title}
            </h1>
            <p className="text-lg text-[#629960] max-w-2xl mx-auto leading-relaxed">
              {section.content.description}
            </p>
          </div>
        );

      case "text":
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
            <p className="text-[#629960] leading-relaxed">{section.content.description}</p>
          </div>
        );

      case "image":
        return (
          <div className="rounded-2xl overflow-hidden">
            <img 
              src={section.content.imageUrl} 
              alt={section.content.alt || ""} 
              className="w-full h-auto object-cover"
            />
          </div>
        );

      case "callout":
        return (
          <div className="bg-[#19FF00]/10 border border-[#1C5D15]/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#1C5D15] mb-2">{section.content.title}</h3>
            <p className="text-[#629960]">{section.content.text}</p>
          </div>
        );

      // TIPO LISTADO DE POSTS DEL BLOG
      case "blog-posts":
        return (
          <div key={section.id}>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {posts.map((post) => (
                  <ContentCard 
                    key={post.id} 
                    type="blog" 
                    data={post} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#629960]/30">
                <h3 className="text-xl font-bold text-[#1C5D15] mb-2">
                  {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                </h3>
                <p className="text-[#629960]">
                  {language === 'es' ? 'Estamos preparando nuevos artículos para ti.' : 'We are preparing new articles for you.'}
                </p>
              </div>
            )}

            {/* Paginación */}
            {posts.length > 8 && (
              <div className="flex justify-center mt-12 gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all">2</button>
              </div>
            )}
          </div>
        );

      default:
        // Para secciones desconocidas no renderizamos nada (evita errores)
        return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allPosts, allCategories, pageContent] = await Promise.all([
          supabaseAPI.getBlogPosts('published'),
          supabaseAPI.getBlogCategories('active'),
          supabaseAPI.getPageContent('page-blog', language)
        ]);
        
        setPageData(pageContent as PageWithContent | null);

        const categoryNamesMap: Record<string, string> = {};
        await Promise.all(allCategories.map(async (cat) => {
          const trans = await supabaseAPI.getBlogCategoryTranslation(cat.id, language);
          categoryNamesMap[cat.id] = trans.name || cat.slug;
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
              ? categoryNamesMap[category_id] || (language === 'es' ? 'General' : 'General') 
              : (language === 'es' ? 'Sin categoría' : 'Uncategorized')
          };
        }));

        setPosts(postsWithTranslations);
        setFilteredPosts(postsWithTranslations);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  // Filtrar posts cuando cambia el filtro activo
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.type === activeFilter));
    }
  }, [activeFilter, posts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1C5D15]"></div>
          <p className="mt-4 text-[#629960] font-medium">
            {language === 'es' ? 'Cargando historias...' : 'Loading stories...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0]">
      {/* RENDERIZAR SECCIONES DINAMICAS DESDE EL EDITOR VISUAL */}
      {pageData && pageData.sections && pageData.sections.map((section: any) => {
        // El hero-blog va FUERA del contenedor para ser full width
        if (section.type === 'hero-blog' && section.visible) {
          return (
            <div key={section.id} className="-mt-[1px]">
              <HeroBlog content={section.content} />
            </div>
          );
        }
        return null;
      })}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* FILTRO DE CATEGORIAS */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-[#1C5D15] text-white shadow-lg'
                : 'bg-white text-[#1C5D15] border border-[#1C5D15]/20 hover:border-[#1C5D15]'
            }`}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </button>
          <button
            onClick={() => setActiveFilter('news')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              activeFilter === 'news'
                ? 'bg-[#1C5D15] text-white shadow-lg'
                : 'bg-white text-[#1C5D15] border border-[#1C5D15]/20 hover:border-[#1C5D15]'
            }`}
          >
            {language === 'es' ? 'Noticias' : 'News'}
          </button>
          <button
            onClick={() => setActiveFilter('article')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              activeFilter === 'article'
                ? 'bg-[#1C5D15] text-white shadow-lg'
                : 'bg-white text-[#1C5D15] border border-[#1C5D15]/20 hover:border-[#1C5D15]'
            }`}
          >
            {language === 'es' ? 'Artículos' : 'Articles'}
          </button>
        </div>

        {/* RENDERIZAR OTRAS SECCIONES DENTRO DEL CONTENEDOR */}
        {pageData && pageData.sections && pageData.sections.map((section: any) => {
          if (section.type !== 'hero-blog') {
            return renderSection(section, language);
          }
          return null;
        })}

        {/* Grid de cartas */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-12">
            {filteredPosts.map((post) => (
              <ContentCard 
                key={post.id} 
                type="blog" 
                data={post} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#629960]/30">
            <h3 className="text-xl font-bold text-[#1C5D15] mb-2">
              {language === 'es' ? 'Próximamente' : 'Coming Soon'}
            </h3>
            <p className="text-[#629960]">
              {language === 'es' ? 'Estamos preparando nuevos artículos para ti.' : 'We are preparing new articles for you.'}
            </p>
          </div>
        )}

        {/* Paginación */}
        {filteredPosts.length > 8 && (
          <div className="flex justify-center mt-12 gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all">2</button>
          </div>
        )}
      </div>
    </div>
  );
}