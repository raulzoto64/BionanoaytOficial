"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation} from '../data/supabase';
import { ContentCard } from '../components/ContentCard';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allPosts, allCategories] = await Promise.all([
          supabaseAPI.getBlogPosts('published'),
          supabaseAPI.getBlogCategories('active')
        ]);

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
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

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
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-[#19FF00]/20 text-[#1C5D15] rounded-full mb-4 font-bold text-sm tracking-widest uppercase">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-6 tracking-tight">
            {language === 'es' ? 'Actualidad y Ciencia' : 'News & Science'}
          </h1>
          <p className="text-lg text-[#629960] max-w-2xl mx-auto leading-relaxed">
            {language === 'es' 
              ? 'Explora las últimas innovaciones en bioseguridad, nanotecnología y desarrollo sostenible.' 
              : 'Explore the latest innovations in biosecurity, nanotechnology, and sustainable development.'
            }
          </p>
        </div>

        {/* Grid de cartas */}
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
    </div>
  );
}