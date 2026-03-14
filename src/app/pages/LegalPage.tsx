import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { DatabaseManager } from '../data/DatabaseManager';
import { LegalPage as LegalPageType } from '../data/supabase';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
      console.error('Error loading legal page:', error);
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
  const content = language === 'es' ? legalPage.content_es : legalPage.content_en;

  return (
    <div className="min-h-screen bg-[#F7F9CE]">
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

      {/* Content Section */}
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Navigation Links */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              {language === 'es' 
                ? '¿Necesitas información adicional?' 
                : 'Need additional information?'}
            </p>
            <Button
              onClick={() => navigate('/#contact')}
              className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white"
            >
              {language === 'es' ? 'Contáctanos' : 'Contact Us'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}