import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { supabaseAPI, type BlogPost, type BlogPostTranslation } from "../data/supabase";
import { SEO } from "../components/SEO";
import { Breadcrumb } from "../components/Breadcrumb";
import { RelatedPosts } from "../components/RelatedPosts";
import { DynamicSection } from "../components/DynamicSection";
// @ts-ignore
import '../../styles/blog-content.css';

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

export function BlogPost() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [post, setPost] = useState<PostWithTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
        setLoading(true);
        try {
          // 1. Primero intentamos buscar por slug en la lista (para rapidez)
          const allPosts = await supabaseAPI.getBlogPosts('published');
          let postFound = allPosts.find((p: any) => p.slug === slug);
  
          // 2. CRÍTICO: Si lo encontramos en la lista, hacemos un fetch individual 
          // para asegurarnos de tener la IMAGEN DE PORTADA más reciente (bypass caché)
          if (postFound) {
            console.log("🔍 [BlogPost] Post encontrado en lista, verificando versión fresca del servidor...");
            const freshPost = await supabaseAPI.getBlogPostById(postFound.id);
            if (freshPost) {
               console.log("✨ [BlogPost] Versión fresca recuperada:", freshPost.cover_image);
               postFound = { ...postFound, ...freshPost };
            }
          }

          if (!postFound) {
            setError('Post no encontrado');
            setLoading(false);
            return;
          }

          const translation = await supabaseAPI.getBlogPostTranslation(postFound.id, language);
          const relations = await supabaseAPI.getBlogPostCategories(postFound.id);
          const allCategories = await supabaseAPI.getBlogCategories();
  
          const categoryNames: Record<string, string> = {};
          for (const category of allCategories) {
            const categoryTranslation = await supabaseAPI.getBlogCategoryTranslation(category.id, language);
            categoryNames[category.id] = categoryTranslation.name || category.slug;
          }

          const category_id = relations.length > 0 ? relations[0].category_id : undefined;

          setPost({
            ...postFound,
            translation,
            category_id,
            category_name: category_id ? categoryNames[category_id] || 'Sin categoría' : 'Sin categoría'
          });
        } catch (err) {
          setError('Error al cargar el post');
          console.error('Error loading blog post:', err);
        } finally {
          setLoading(false);
        }
    };

    loadPost();
  }, [slug, language]);

  // ✅ Persistir el contexto de retorno para la Home
  const location = useLocation();
  useEffect(() => {
    const from = (location.state as any)?.from;
    const sectionId = (location.state as any)?.sectionId;
    
    if (from === 'home') {
      sessionStorage.setItem('bx_return_from', 'home');
      if (sectionId) {
        sessionStorage.setItem('bx_return_section', sectionId);
      }
    }
  }, [location.state]);

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

  if (error || !post) {
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

  const seoData = {
    metaTitle: post.translation.title,
    metaDescription: post.translation.excerpt,
    metaKeywords: post.category_name
  };

  return (
    <>
      <SEO
        title={seoData.metaTitle || "BionanoAyT"}
        description={seoData.metaDescription || ""}
        keywords={seoData.metaKeywords}
      />

      {/* ✅ MANTENIDO: Breadcrumb que pediste - Navegación Inicio / Blog */}
      <div className="bg-[#629960]/10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            links={[
              { name: language === 'es' ? 'Inicio' : 'Home', href: '/' },
              { name: language === 'es' ? 'Blog' : 'Blog', href: '/blog' },
              { name: post.translation.title }
            ]}
          />
        </div>
      </div>

      {/* ✅ RECUPERADO: Diseño original del artículo que te gustaba */}
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {post.cover_image && (
              <div className="relative h-80 overflow-hidden">
                <img
                  src={post.cover_image}
                  alt={post.translation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            )}

            <div className="p-8">
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#19FF00]/20 text-[#1C5D15] text-sm font-medium rounded-full">
                  {post.category_name}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md ${
                  post.type === 'article' 
                    ? 'bg-[#1C5D15] text-white' 
                    : 'bg-[#19FF00] text-[#1C5D15]'
                }`}>
                  {language === 'es' 
                    ? (post.type === 'article' ? 'Artículo' : 'Noticia') 
                    : (post.type === 'article' ? 'Article' : 'News')
                  }
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
                {post.translation.title}
              </h1>

              {/* Article Excerpt */}
              {post.translation.excerpt && (
                <div className="border-l-4 border-[#19FF00] pl-6 py-2 mb-8 bg-[#F0F9F0]">
                  <p className="text-lg text-[#629960] italic">
                    {post.translation.excerpt}
                  </p>
                </div>
              )}

              {/* Article Content - renderiza secciones JSON o HTML legacy */}
              {(() => {
                const raw = post.translation.content || '';
                
                // Intentar parsear como JSON de secciones
                let sections: any[] = [];
                try {
                  const parsed = JSON.parse(raw);
                  if (Array.isArray(parsed)) sections = parsed;
                } catch {
                  // Es HTML legacy: envolver en una sección de texto
                  sections = raw ? [{ id: 'legacy', type: 'blog-text', content: { html: raw } }] : [];
                }

                if (sections.length === 0) return null;

                return (
                  <div className="blog-sections space-y-2">
                    {sections.map((section: any) => {
                      switch (section.type) {
                        case 'blog-text':
                        case 'rich-text':
                          return (
                            <div key={section.id} className="blog-content">
                              <div
                                className="prose prose-lg max-w-none text-[#629960] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: section.content?.html || '' }}
                              />
                            </div>
                          );
                        case 'blog-intro':
                          return (
                            <div key={section.id} className="blog-content my-4">
                              <div
                                className="text-xl md:text-2xl font-medium text-[#1C5D15] leading-relaxed border-l-4 border-[#19FF00] pl-6 py-2"
                                dangerouslySetInnerHTML={{ __html: section.content?.html || '' }}
                              />
                            </div>
                          );
                        case 'blog-quote':
                          return (
                            <div key={section.id} className="w-full my-8">
                              <div className="border-l-4 border-[#19FF00] pl-6 py-4 bg-[#F0F9F0] rounded-r-lg">
                                <p className="text-xl text-[#1C5D15] italic font-medium leading-relaxed">
                                  &ldquo;{section.content?.text}&rdquo;
                                </p>
                                {section.content?.author && (
                                  <p className="mt-2 text-sm text-[#629960] font-bold uppercase tracking-wider">
                                    &mdash; {section.content.author}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        case 'blog-image':
                          return (
                            <div key={section.id} className="w-full my-8">
                              <figure className="relative overflow-hidden rounded-xl shadow-lg">
                                <img
                                  src={section.content?.url}
                                  alt={section.content?.caption || ''}
                                  className="w-full h-auto object-cover max-h-[500px]"
                                />
                                {section.content?.caption && (
                                  <figcaption className="bg-[#1C5D15]/90 text-white p-4 text-sm italic">
                                    {section.content.caption}
                                  </figcaption>
                                )}
                              </figure>
                            </div>
                          );
                        case 'blog-list':
                          return (
                            <div key={section.id} className="blog-content w-full py-4">
                              <ul className="space-y-4">
                                {(section.content?.items || []).map((item: string, i: number) => (
                                  <li key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#19FF00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                      <div className="w-2 h-2 rounded-full bg-[#1C5D15]"></div>
                                    </div>
                                    <span className="text-lg text-[#629960]">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        case 'blog-divider':
                          return (
                            <div key={section.id} className="w-full py-8 text-center">
                              <div className="h-0.5 w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#19FF00] to-transparent"></div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                );
              })()}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-[#629960]/20">
                <div className="flex items-center justify-between">
                  <div className="text-[#629960]">
                    {language === 'es' ? 'Compartir artículo:' : 'Share article:'}
                  </div>
                  <div className="flex gap-4">
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

          {/* Related Posts */}
          <div className="mt-16">
            <RelatedPosts 
              currentPostId={post.id} 
              language={language} 
              type={post.type} 
            />
          </div>
        </div>
      </div>

      {/* ── SECCIONES DE PÁGINA (products, hero, cta, etc.) ──────────────────
           Aparecen FUERA de la tarjeta del artículo, full-width debajo */}
      {(() => {
        const raw = post.translation.content || '';
        let allSections: any[] = [];
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) allSections = parsed;
        } catch { return null; }

        const BLOG_TYPES = ['blog-text', 'blog-intro', 'blog-quote', 'blog-list', 'blog-image', 'blog-divider', 'rich-text'];
        const pageSections = allSections.filter(
          (s: any) => !BLOG_TYPES.includes(s.type) && s.type !== 'page-metadata'
        );

        if (pageSections.length === 0) return null;

        return (
          <div className="blog-page-sections">
            {pageSections.map((section: any, index: number) => (
              <DynamicSection
                key={section.id}
                section={section}
                index={index}
                language={language}
                isEditor={false}
              />
            ))}
          </div>
        );
      })()}
    </>
  );
}