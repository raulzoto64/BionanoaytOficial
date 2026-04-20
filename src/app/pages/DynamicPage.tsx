import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  PageContent,
  supabaseAPI,
} from "../data/supabase";
import { DynamicSection } from "../components/DynamicSection";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { Loader2 } from "lucide-react";

export function DynamicPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPageContent();
      loadProducts();
    }
  }, [slug, language]);

  const loadPageContent = async () => {
    setLoading(true);

    try {
      // 1. Obtenemos todas las páginas para encontrar el ID real (UUID)
      const allPages = await supabaseAPI.getAllPages();
      const pageInfo = allPages.find((p: any) => {
        const cleanP = p.slug.replace(/^\/+/, '');
        const cleanS = slug!.replace(/^\/+/, '');
        return cleanP === cleanS;
      });

      if (!pageInfo) {

      }



      // 2. Pedimos el contenido usando el ID único (UUID)
      const content = await supabaseAPI.getPageContent(pageInfo.id, language);

      
      setPageContent(content || { sections: [], page_id: pageInfo.id, language });

    } catch (error) {

      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const allProducts = await supabaseAPI.getProducts();
      setProducts(allProducts);
    } catch (error) {

    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F9CE]/30">
        <Loader2 className="w-12 h-12 text-[#1C5D15] animate-spin mb-4" />
        <p className="text-[#1C5D15] font-bold uppercase tracking-widest text-sm">Cargando página...</p>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-6xl font-black text-[#1C5D15] mb-4">404</h1>
        <p className="text-xl text-[#629960] mb-8">Lo sentimos, la página "{slug}" no existe.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#1C5D15] text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${slug?.replace(/-/g, ' ') || ''} | Bionano A&T`} />
      
      <div className="min-h-screen">
        {pageContent.sections.filter(s => s.visible).map((section, index) => (
          <DynamicSection
            key={section.id}
            section={section}
            products={products}
            language={language}
            index={index}
            pageSlug={slug || ''}
          />
        ))}
        
        {pageContent.sections.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[#629960] italic pt-40">Esta página aún no tiene contenido. Usa el Editor Visual para empezar.</p>
          </div>
        )}
      </div>
    </>
  );
}
