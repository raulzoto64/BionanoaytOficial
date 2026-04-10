"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation } from '../data/supabase';
import { Link } from 'react-router';
import { ContentCard } from './ContentCard';

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
  isEditor?: boolean;
}

export function NewsSection({ title, subtitle, ctaText, ctaLink, isEditor = false }: NewsSectionProps) {
  const { language } = useLanguage();
  const [featuredPosts, setFeaturedPosts] = useState<PostWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        const allPosts = await supabaseAPI.getBlogPosts('published');
        const featured = allPosts.filter(post => post.featured).slice(0, 5);
        
        const allCategories = await supabaseAPI.getBlogCategories('active');

        const categoryNames: Record<string, string> = {};
        for (const category of allCategories) {
          const translation = await supabaseAPI.getBlogCategoryTranslation(category.id, language);
          categoryNames[category.id] = translation.name || category.slug;
        }

        const postsWithTranslations = [];
        for (const post of featured) {
          const translation = await supabaseAPI.getBlogPostTranslation(post.id, language);
          const relations = await supabaseAPI.getBlogPostCategories(post.id);
          const category_id = relations.length > 0 ? relations[0].category_id : undefined;
          
          postsWithTranslations.push({
            ...post,
            translation,
            category_id,
            category_name: category_id ? categoryNames[category_id] || 'Sin categoría' : 'Sin categoría'
          });
        }

        setFeaturedPosts(postsWithTranslations);
      } catch (error) {
        console.error('Error loading featured blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPosts();
  }, [language]);

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
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={ctaLink || "/blog"}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#1C5D15] text-white font-bold rounded-full hover:bg-[#19FF00] hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg uppercase text-sm tracking-wider"
          >
            {ctaText || (language === 'es' ? 'Ver todas las noticias' : 'View all news')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}