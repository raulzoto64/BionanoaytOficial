import { useEffect, useState } from "react";
import {
  PageContent,
  Section,
  supabaseAPI,
  Product,
  ProductTranslation,
} from "../data/supabase";
import { Hero } from "../components/Hero";
import { DynamicSection } from "../components/DynamicSection";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { useDatabase } from "../hooks/useDatabase";
import { useNavigationType } from "react-router";

export function Home() {
  const { language } = useLanguage();
  const { updateTrigger } = useDatabase();
  const navigationType = useNavigationType();
  
  const [pageContent, setPageContent] = useState<PageContent | null>(() => 
    supabaseAPI.getCachedData(`page-content-page-home-${language}`)
  );
  const [homeProducts, setHomeProducts] = useState<
    (Product & { translation: ProductTranslation; categoryName: string })[]
  >(() => supabaseAPI.getCachedData(`home-products-ready-${language}`) || []);

  useEffect(() => {
    loadPageContent();
    loadHomeProducts();
  }, [language, updateTrigger]);

  // Restaurar scroll si regresamos de un producto (específicamente cuando el contenido ya cargó)
  useEffect(() => {
    if (!pageContent) return;

    const from = sessionStorage.getItem('bx_return_from');
    const sectionId = sessionStorage.getItem('bx_return_section');
    
    console.log('[Home] Restoration check:', { from, sectionId, navigationType, hasElement: sectionId ? !!document.getElementById(sectionId) : false });

    if (sectionId && (from === 'home' || !from)) {
      // Con el caché activo, el Ecosistema carga instantáneamente
      // Un solo scroll a 400ms es suficiente para todos los casos
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const headerOffset = sectionId.includes('ecosystem') ? 80 : -600;
          const scrollTo = elementTop - headerOffset;
          
          console.log('[Home-DEBUG] Scroll a sección:', sectionId, '→ pos:', elementTop, 'offset:', headerOffset, '→ final:', scrollTo);
          window.scrollTo({ top: scrollTo, behavior: 'smooth' });
          
          sessionStorage.removeItem('bx_return_from');
          sessionStorage.removeItem('bx_return_section');
        } else {
          console.log('[Home-DEBUG] Elemento no encontrado:', sectionId);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pageContent, navigationType]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent("page-home", language);
      setPageContent(content);
    } catch (error) {
      console.error("Error loading home page content:", error);
    }
  };

  const loadHomeProducts = async () => {
    try {
      const products = await supabaseAPI.getProducts();
      const activeProducts = products.filter(p => p.status === 'active');

      const productsWithTranslations = await Promise.all(
        activeProducts.map(async (product) => {
          const translation = await supabaseAPI.getProductTranslation(product.id, language);
          const categoryTranslation = await supabaseAPI.getCategoryTranslation(product.category, language);
          return {
            ...product,
            translation,
            categoryName: categoryTranslation?.name || product.category,
          } as (Product & { translation: ProductTranslation; categoryName: string });
        }),
      );

      setHomeProducts(productsWithTranslations);
      // Guardar el resultado procesado para carga instantánea la próxima vez
      supabaseAPI._saveToCache(`home-products-ready-${language}`, productsWithTranslations);
    } catch (error) {
      console.error("Error loading home products:", error);
    }
  };

  const defaultHero = {
    title: "Bionanoaxus (BNX)",
    subtitle: language === 'es'
      ? "Innovación bionanotecnológica para un mundo mejor"
      : "Bionanotechnology innovation for a better world",
    backgroundImage: "https://sb-jzmdfoptxmqywihyhoty.supabase.co/storage/v1/object/public/site_assets/hero-bg.jpg",
    ctaText: language === 'es' ? "Saber más" : "Learn more",
    ctaLink: "#purpose"
  };

  const heroSection = pageContent?.sections.find(s => s.type === "hero");
  const heroContent = (heroSection?.content || defaultHero) as any;
  const seoData = heroContent?.seo || {};

  return (
    <>
      <SEO
        title={seoData.metaTitle || "BionanoAyT"}
        description={seoData.metaDescription || ""}
        keywords={seoData.metaKeywords}
      />

        {/* Hero siempre primero */}
        <div id="hero" style={{ minHeight: '100vh', overflow: 'hidden' }}>
          <Hero content={heroContent} />
        </div>

      {/* Secciones dinámicas: se renderizan TODAS las secciones guardadas en BD */}
      {pageContent ? (
        <>
          {pageContent.sections
            .filter((s: Section) => s.visible && s.type !== "hero")
            .map((section: Section, index: number) => (
              <DynamicSection
                key={section.id}
                section={section}
                products={homeProducts}
                language={language}
                index={index}
              />
            ))}
        </>
      ) : (
        /* Skeleton de carga */
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[#F7F9CE] animate-pulse"></div>
                  <div className="h-6 bg-[#1C5D15]/20 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-16 bg-[#629960]/20 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
