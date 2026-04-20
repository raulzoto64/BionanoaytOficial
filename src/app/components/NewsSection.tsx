"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation } from '../data/supabase';
import { Link, useNavigate } from 'react-router';
import { ContentCard } from './ContentCard';
import { newsPreloadCache } from '../data/BackgroundPreload';
import { handleAction } from '../utils/actions';

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

interface NewsSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaActionType?: string;
  isEditor?: boolean;
  sectionId?: string;
}

// Caché global para evitar recargas (mismo patrón que Ecosystem.tsx)
let newsSectionCache: {
  posts: PostWithTranslation[];
  language: string;
} | null = null;

export function NewsSection({ title, subtitle, ctaText, ctaLink, ctaActionType, isEditor = false, sectionId }: NewsSectionProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Inicialización instantánea desde caché
  const [featuredPosts, setFeaturedPosts] = useState<PostWithTranslation[]>(() => 
    newsPreloadCache && newsPreloadCache.language === language ? newsPreloadCache.posts : []
  );
  const [loading, setLoading] = useState(() => 
    newsPreloadCache && newsPreloadCache.language === language ? false : true
  );



  useEffect(() => {
    const loadFeaturedPosts = async () => {
      // Usar caché si está disponible para este idioma (solo en prod para velocidad)
      if (!isEditor && newsPreloadCache && newsPreloadCache.language === language && newsPreloadCache.posts.length > 0) {
        setFeaturedPosts(newsPreloadCache.posts);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // OPTIMIZACIÓN: Carga masiva de traducciones (mismo patrón que Blog.tsx)
        const [allCategories, postsWithTranslationsRaw] = await Promise.all([
          supabaseAPI.getBlogCategories(),
          supabaseAPI.getAllBlogPostTranslations(language)
        ]);

        const categoryNamesMap: Record<string, string> = {};
        await Promise.all(allCategories.map(async (cat: any) => {
          const trans = await supabaseAPI.getBlogCategoryTranslation(cat.id, language);
          categoryNamesMap[cat.id] = trans?.name || cat.slug;
        }));

        // Procesar y priorizar destacados, pero mostrar recientes si no hay suficientes
        const processedPosts = postsWithTranslationsRaw.map((post: any) => {
          const translation = post.title ? {
            post_id: post.id,
            language: language,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content
          } : (post.translation || { title: post.slug.replace(/-/g, ' ').toUpperCase(), excerpt: "..." });

          return {
            ...post,
            translation,
            category_name: post.category_name || (post.category_id ? categoryNamesMap[post.category_id] : (language === 'es' ? 'General' : 'General'))
          };
        });

        // Lógica de Prioridad:
        // 1. Artículos marcados como destacados (featured = 1)
        // 2. Si hay menos de 5, rellenar con los más recientes (independientemente de si son featured o no)
        const featured = processedPosts.filter((p: any) => p.featured);
        const nonFeatured = processedPosts.filter((p: any) => !p.featured);
        
        // Tomamos hasta 5 en total
        const finalDisplay = [...featured, ...nonFeatured].slice(0, 5);

        // Actualizar caché global
        const { setNewsPreloadCache } = await import('../data/BackgroundPreload');
        setNewsPreloadCache({ posts: finalDisplay, language });
        
        setFeaturedPosts(finalDisplay);
      } catch (error) {
        console.error("Error cargando noticias destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPosts();
  }, [language, isEditor]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#629960]/10 to-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-[#1C5D15]/20 rounded-lg w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-[#629960]/20 rounded-lg w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden h-[450px]">
                <div className="h-32 bg-[#1C5D15]/10 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-[#629960]/20 rounded-full w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-[#1C5D15]/20 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-20 bg-[#629960]/15 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-[#1C5D15]/20 rounded-full w-1/3 animate-pulse mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) {
    if (!isEditor) return null;
    return (
      <section id="news" className="py-20 bg-gradient-to-b from-[#629960]/10 to-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-12 text-center">
           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1C5D15] tracking-tight">
             {title || (language === 'es' ? 'Noticias Destacadas' : 'Featured News')}
           </h2>
           <div 
             className="text-lg md:text-xl text-[#629960] leading-relaxed max-w-2xl mx-auto mb-8 [&_p]:m-0"
             dangerouslySetInnerHTML={{ __html: subtitle || 'Mantente al día con los últimos avances en bionanotecnología y sostenibilidad.' }}
           />
           <div className="p-10 border-2 border-dashed border-[#1C5D15]/30 bg-white/50 rounded-2xl">
             <p className="text-[#1C5D15] text-xl font-bold mb-2">No hay noticias destacadas 📰</p>
             <p className="text-[#629960]">Agrega noticias y márcalas como "destacadas" en el sistema para que aparezcan aquí.</p>
           </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-20 bg-gradient-to-b from-[#629960]/10 to-white">
      <div className="max-w-9xl mx-auto px-5 lg:px-12">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1C5D15] tracking-tight">
              {title || (language === 'es' ? 'Noticias Destacadas' : 'Featured News')}
            </h2>
            <div 
              className="text-lg md:text-xl text-[#629960] leading-relaxed max-w-2xl mx-auto [&_p]:m-0"
              dangerouslySetInnerHTML={{ 
                __html: subtitle || (language === 'es'
                  ? 'Mantente al día con los últimos avances en bionanotecnología y sostenibilidad.'
                  : 'Stay up to date with the latest advances in bionanotechnology and sustainability.')
              }}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {featuredPosts.map((post) => (
            <ContentCard 
              key={post.id} 
              type="blog" 
              data={post} 
              sectionId={sectionId || 'news'}
              from="home"
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => handleAction(ctaActionType, ctaLink || "/blog", navigate, { from: 'home', sectionId: sectionId || 'news' })}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#1C5D15] text-white font-bold rounded-full hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg uppercase text-sm tracking-wider"
          >
            {ctaText || (language === 'es' ? 'Ver todas las noticias' : 'View all news')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
