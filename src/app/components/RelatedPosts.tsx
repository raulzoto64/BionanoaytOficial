import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { supabaseAPI } from "../data/supabase";

interface RelatedPost {
  id: string;
  slug: string;
  author: string;
  cover_image: string;
  status: 'draft' | 'published';
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  translation: {
    title: string;
    excerpt: string;
  };
  category_id?: string;
  category_name?: string;
  type: 'article' | 'news';
}

interface RelatedPostsProps {
  currentPostId: string;
  language: "es" | "en";
  type: 'article' | 'news';
}

export function RelatedPosts({ currentPostId, language, type }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      try {
        const allPosts = await supabaseAPI.getBlogPosts('published');
        const related = allPosts
          .filter(post => post.id !== currentPostId && post.type === type)
          .slice(0, 3);

        const allCategories = await supabaseAPI.getBlogCategories('active');

const categoryNames: Record<string, string> = {};
        for (const category of allCategories) {
          const translation = await supabaseAPI.getBlogCategoryTranslation(category.id, language);
          categoryNames[category.id] = translation.name || category.slug;
        }

        const postsWithTranslations = await Promise.all(
          related.map(async (post) => {
            const translation = await supabaseAPI.getBlogPostTranslation(post.id, language);
            const relations = await supabaseAPI.getBlogPostCategories(post.id);
            const category_id = relations.length > 0 ? relations[0].category_id : undefined;

            return {
              ...post,
              translation,
              category_id,
              category_name: category_id ? categoryNames[category_id] || 'Sin categoría' : 'Sin categoría'
            };
          })
        );

        setRelatedPosts(postsWithTranslations);
      } catch (error) {
        // En caso de fallo, se omite para no ensuciar la consola
      } finally {
        setLoading(false);
      }
    };

    loadRelatedPosts();
  }, [currentPostId, language, type]);

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-black text-[#1C5D15] mb-6">Posts relacionados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C5D15]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-black text-[#1C5D15] mb-6">Posts relacionados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#629960]/10 hover:border-[#19FF00] overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              {post.cover_image ? (
                <img 
                  src={post.cover_image} 
                  alt={post.translation.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-[#1C5D15]/10 flex items-center justify-center">
                  <span className="text-[#1C5D15]/40 text-xs">No image</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#19FF00] bg-[#1C5D15] px-3 py-1 rounded shadow-sm">
                  {post.category_name || (language === 'es' ? 'Sin categoría' : 'Uncategorized')}
                </span>
                <span className="text-[10px] text-[#629960] font-medium">
                  {new Date(post.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#1C5D15] mb-2 line-clamp-2 transition-colors leading-tight hover:text-[#1C5D15]/80">
                {post.translation.title}
              </h4>

              <p className="text-sm text-[#629960] line-clamp-3 mb-4">
                {post.translation.excerpt}
              </p>

              <div className="mt-auto">
                <span className="text-[#1C5D15] text-sm font-semibold flex items-center gap-1 transition-colors">
                  {language === 'es' ? 'Leer más' : 'Read more'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
