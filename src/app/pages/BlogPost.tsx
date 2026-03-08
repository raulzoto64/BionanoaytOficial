import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPost as BlogPostType, BlogPostTranslation } from '../data/supabase';
import '../../styles/blog-content.css';

export function BlogPost() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [translation, setTranslation] = useState<BlogPostTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        // Get post by slug
        const postData = await supabaseAPI.getBlogPostBySlug(slug);
        if (!postData) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        setPost(postData);

        // Get translation
        const postTranslation = await supabaseAPI.getBlogPostTranslation(postData.id, language);
        setTranslation(postTranslation);
      } catch (error) {
        console.error('Error loading post:', error);
        setError('Error loading post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C5D15]"></div>
          <p className="mt-4 text-[#629960]">{language === 'es' ? 'Cargando artículo...' : 'Loading article...'}</p>
        </div>
      </div>
    );
  }

  if (error || !post || !translation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#1C5D15] mb-4">
            {language === 'es' ? 'Artículo no encontrado' : 'Article not found'}
          </h1>
          <p className="text-[#629960] mb-8">
            {language === 'es' ? 'Lo sentimos, el artículo que buscas no existe o ha sido eliminado.' : 'Sorry, the article you are looking for does not exist or has been removed.'}
          </p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C5D15] text-white rounded-lg hover:bg-[#629960] transition-colors"
          >
            {language === 'es' ? 'Volver al blog' : 'Back to blog'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-[#629960] hover:text-[#1C5D15] transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === 'es' ? 'Volver al blog' : 'Back to blog'}
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {post.cover_image && (
            <div className="relative h-80 overflow-hidden">
              <img 
                src={post.cover_image} 
                alt={translation.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          )}

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-[#19FF00]/20 text-[#1C5D15] text-sm font-medium rounded-full">
                {language === 'es' ? 'Tecnología' : 'Technology'}
              </span>
              <span className="text-sm text-[#629960]">
                {new Date(post.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="text-sm text-[#629960]">
                {language === 'es' ? 'Por' : 'By'} {post.author}
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C5D15] mb-6">
              {translation.title}
            </h1>

            {/* Article Excerpt */}
            <div className="border-l-4 border-[#19FF00] pl-6 py-2 mb-8 bg-[#F0F9F0]">
              <p className="text-lg text-[#629960] italic">
                {translation.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div 
              className="blog-content text-[#629960]"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-[#629960]/20">
              <div className="flex items-center justify-between">
                <div className="text-[#629960]">
                  {language === 'es' ? 'Compartir artículo:' : 'Share article:'}
                </div>
                <div className="flex gap-4">
                  {/* Social sharing buttons can be added here */}
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#629960] text-white hover:bg-[#1C5D15] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#629960] text-white hover:bg-[#1C5D15] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#629960] text-white hover:bg-[#1C5D15] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}