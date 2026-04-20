import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { DatabaseManager } from '../data/DatabaseManager';
import { LegalPage as LegalPageType } from '../data/supabase';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DynamicSection } from '../components/DynamicSection';
import '../../styles/blog-content.css';

// Componentes que se renderizan dentro de la tarjeta blanca (cuerpo del texto)
const INTERNAL_TYPES = ['blog-text', 'rich-text', 'blog-intro', 'blog-quote', 'blog-list', 'blog-image', 'blog-divider'];

export function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadLegalPage(slug);
    }
  }, [slug]);

  const loadLegalPage = async (pageSlug: string) => {
    setIsLoading(true);
    try {
      const page = await DatabaseManager.getLegalPageBySlug(pageSlug);
      if (!page || !page.is_active) {
        navigate('/');
        return;
      }
      setLegalPage(page);
    } catch (error) {
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1C5D15]"></div>
      </div>
    );
  }

  if (!legalPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">Página no encontrada</h2>
          <Button onClick={() => navigate('/')} className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const title = language === 'es' ? legalPage.title_es : legalPage.title_en;
  const rawContent = language === 'es' ? legalPage.content_es : legalPage.content_en;

  // Intentar parsear el contenido como JSON de secciones
  let allSections: any[] = [];
  try {
    const parsed = JSON.parse(rawContent || '[]');
    if (Array.isArray(parsed)) allSections = parsed;
    else throw new Error("No es array");
  } catch {
    // Si falla, asumimos que es HTML legacy
    allSections = rawContent ? [{ id: 'legacy-content', type: 'blog-text', content: { html: rawContent } }] : [];
  }

  // Filtrar y ordenar secciones: internas (cuerpo) y externas (página/CTA)
  const internalSections = allSections
    .filter(s => INTERNAL_TYPES.includes(s.type))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const externalSections = allSections
    .filter(s => !INTERNAL_TYPES.includes(s.type) && s.type !== 'page-metadata')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-[#F0F9F0]">
      {/* Hero Section */}
      <div className="bg-[#1C5D15] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            className="mb-6 bg-white/10 text-white hover:bg-white/20 border-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-white/80">
            {language === 'es' 
              ? 'Información legal y política de la empresa' 
              : 'Legal information and company policy'}
          </p>
        </div>
      </div>

      {/* Content Section (Tarjeta Blanca para textos y términos) */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 blog-content-wrapper overflow-hidden">
          {internalSections.length > 0 ? (
             <div className="blog-sections space-y-2">
                {internalSections.map(section => {
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
                    case 'blog-list':
                      return (
                        <div key={section.id} className="w-full my-6 pl-2">
                           <ul className="space-y-3">
                             {section.content?.items?.map((item: string, i: number) => (
                               <li key={i} className="flex items-start gap-3 text-lg text-[#629960]">
                                 <span className="text-[#19FF00] mt-1 shrink-0">✦</span>
                                 <span dangerouslySetInnerHTML={{ __html: item }} />
                               </li>
                             ))}
                           </ul>
                        </div>
                      );
                    case 'blog-image':
                      return (
                        <div key={section.id} className="w-full my-8">
                           <img 
                             src={section.content?.url} 
                             alt={section.content?.caption || ''}
                             className="w-full h-auto rounded-xl shadow-md max-h-[600px] object-cover"
                           />
                           {section.content?.caption && (
                             <p className="text-center text-sm text-gray-500 mt-2 italic">
                               {section.content.caption}
                             </p>
                           )}
                        </div>
                      );
                    case 'blog-divider':
                      return (
                        <div key={section.id} className="flex justify-center items-center py-8">
                           <div className="w-16 h-1 bg-[#19FF00] rounded-full"></div>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
             </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              No hay contenido disponible.
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
