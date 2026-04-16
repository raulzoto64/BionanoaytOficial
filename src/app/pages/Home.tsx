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

  // Sistema de Renderizado Progresivo Temporal
  const [renderedSectionsCount, setRenderedSectionsCount] = useState(0);
  const startTime = performance.now();

  // ✅ Renderizado Progresivo Inteligente
  useEffect(() => {
    // Si NO tenemos datos cargados aun: no hacemos nada
    if (!pageContent || homeProducts.length === 0) return;

    console.log(`\n🚀 [HOME-PROGRESSIVE] Iniciando renderizado progresivo`, {
      tiempoDesdeInicio: `${Math.round(performance.now() - startTime)}ms`,
      totalSecciones: pageContent.sections.filter(s => s.visible && s.type !== "hero").length,
      productosCargados: homeProducts.length
    });

    const totalSections = pageContent.sections.filter(s => s.visible && s.type !== "hero").length;
    let current = 0;

    // ✅ SI TENEMOS CACHE: MOSTRAMOS TODO INMEDIATAMENTE
    if (navigationType === 'POP' || navigationType === 'PUSH') {
      console.log(`✅ [HOME-CACHE] Regresando, mostrando TODO instantaneamente 0ms`);
      setRenderedSectionsCount(totalSections);
      return;
    }

    // ✅ PRIMERA CARGA: Mostramos 2 secciones inmediatamente
    setRenderedSectionsCount(2);
    console.log(`✅ [HOME] Secciones 0 y 1 mostradas en ${Math.round(performance.now() - startTime)}ms`);
    
    // ✅ El resto se van agregando una cada 75ms en segundo plano
    const interval = setInterval(() => {
      current++;
      const next = Math.min(2 + current, totalSections);
      
      setRenderedSectionsCount(next);
      console.log(`✅ [HOME] Seccion ${next-1} mostrada en ${Math.round(performance.now() - startTime)}ms`);
      
      if (next >= totalSections) {
        clearInterval(interval);
        console.log(`🏁 [HOME] Renderizado completo total: ${Math.round(performance.now() - startTime)}ms\n`);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [pageContent, homeProducts, navigationType]);

  // ✅ Scroll automatico SOLO cuando viene explicitamente desde el boton Ver en Home
  useEffect(() => {
    const sectionId = sessionStorage.getItem('bx_return_section');

    if (!pageContent || !sectionId) return;

    // ✅ BUSCAMOS LA SECCION INMEDIATAMENTE, NO ESPERAMOS A TODAS
    // Empezamos a chequear cada 40ms hasta que aparezca en el DOM
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      const element = document.querySelector(`[data-section-type="${sectionId}"]`);

      if (element || attempts > 25) {
        clearInterval(checkInterval);
        
        if (element) {
            const rect = element.getBoundingClientRect();
            const isMobile = window.innerWidth < 768;
            const offset = isMobile ? 1100 : 600;
            const absoluteTop = rect.top + window.pageYOffset + offset;
            
            // ✅ Esperamos a que React Router termine de restaurar el scroll
            setTimeout(() => {
              window.scrollTo({
                top: absoluteTop,
                behavior: 'smooth'
              });
            }, 200);
        }
        
        // Limpiar siempre despues de intentar
        sessionStorage.removeItem('bx_return_section');
        sessionStorage.removeItem('bx_return_from');
      }
    }, 40);

  }, [pageContent]);

  useEffect(() => {
    loadPageContent();
    loadHomeProducts();
  }, [language, updateTrigger]);



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
            .filter((section: Section, index: number) => index < renderedSectionsCount)
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
