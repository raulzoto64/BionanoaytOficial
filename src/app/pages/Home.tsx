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
  


  const [pageContent, setPageContent] = useState<PageContent | null>(() => {
    const cached = supabaseAPI.getCachedData(`page-content-page-home-${language}`);
    if (cached) console.info("[SCROLL] pageContent obtenido de CACHÉ");
    return cached;
  });
  const [homeProducts, setHomeProducts] = useState<
    (Product & { translation: ProductTranslation; categoryName: string })[]
  >(() => supabaseAPI.getCachedData(`home-products-ready-${language}`) || []);

  const [renderedSectionsCount, setRenderedSectionsCount] = useState(0);
  
  const [targetAnchor, setTargetAnchor] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;

    // Detectar si es una recarga física (F5)
    const forms = window.performance.getEntriesByType('navigation');
    const isReload = forms.length > 0 && (forms[0] as any).type === 'reload';

    if (isReload) {

      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
      sessionStorage.removeItem('bx_return_section');
      return null;
    }

    const anchorFromSession = sessionStorage.getItem('bx_return_section');
    const anchorFromHash = window.location.hash.replace('#', '');
    const initial = anchorFromSession || anchorFromHash;
    
    if (initial) {
      console.log(`[SCROLL] Ancla inicial detectada: "${initial}" (Session: ${anchorFromSession}, Hash: ${anchorFromHash})`);
    }

    return initial;
  });

  useEffect(() => {
    // ✅ DETECTOR DE RECARGA (F5): Si se recarga físicamente, mandamos a "/" (arriba)
    const isReload = window.performance
      .getEntriesByType('navigation')
      .map((nav) => (nav as any).type)
      .includes('reload');

    if (isReload && window.location.hash) {

      window.history.replaceState(null, '', window.location.pathname);
      setTargetAnchor(null);
      sessionStorage.removeItem('bx_return_section');
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash) setTargetAnchor(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ✅ 0. Reset de scroll preventivo si tenemos ancla (evita heredar scroll de la página anterior)
  useEffect(() => {
    if (targetAnchor) {
      console.log(`[SCROLL] Reset preventivo a (0,0) para iniciar búsqueda de: ${targetAnchor}`);
      window.scrollTo(0, 0);
    }
  }, [targetAnchor]);

  // ✅ 1. Renderizado Progresivo Inteligente (Modo Relámpago si hay ancla)
  useEffect(() => {
    if (!pageContent) {
      console.info("[SCROLL] Esperando pageContent para renderizar secciones...");
      return;
    }

    const totalSections = pageContent.sections.filter(s => s.visible && s.type !== "hero").length;
    console.info(`[SCROLL] Preparando renderizado de ${totalSections} secciones. Ancla: ${targetAnchor}, Nav: ${navigationType}`);
    
    // ✅ MODO RELÁMPAGO: Si volvemos (POP) o tenemos un ancla guardada, renderizamos TODO al instante
    if (targetAnchor || navigationType === 'POP') {
      setRenderedSectionsCount(totalSections);
    } else {
      // ✅ MODO PROGRESIVO: Para visitas nuevas (PUSH), cargamos suavemente
      setRenderedSectionsCount(Math.min(2, totalSections));
      let current = 0;
      const interval = setInterval(() => {
        current++;
        const next = Math.min(2 + current, totalSections);
        setRenderedSectionsCount(next);
        if (next >= totalSections) clearInterval(interval);
      }, 75);
      return () => clearInterval(interval);
    }
  }, [pageContent, homeProducts, navigationType, targetAnchor]);

  // ✅ 2. Motor de Scroll con Auto-Corrección (Deep Telemetry)
  useEffect(() => {
    if (!pageContent || !targetAnchor) return;


    
    let attempts = 0;
    const maxAttempts = 100;
    
    const scrollToTarget = () => {
      const element = document.getElementById(targetAnchor) || 
                     document.querySelector(`[data-section-type="${targetAnchor}"]`) ||
                     document.querySelector(`[data-section-id="${targetAnchor}"]`);

      if (element) {
        const rect = element.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;
        const targetTop = Math.max(0, rect.top + currentScrollY - 80);
        
        console.info(`[SCROLL] ¡Elemento detectado! Scroll a: ${targetTop}px. Anchor: ${targetAnchor}`);

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Verificación de estabilidad (Causa raíz: Layout Shift)
        setTimeout(() => {
          const freshRect = element.getBoundingClientRect();
          const freshTargetTop = freshRect.top + window.pageYOffset - 80;
          const shift = Math.abs(freshTargetTop - targetTop);
          
          if (shift > 5) {
            window.scrollTo({ top: freshTargetTop, behavior: 'smooth' });
          }
          
          // ✅ Limpieza Final: Una vez que estamos seguros de haber llegado
          if (Math.abs(freshRect.top - 80) < 60) {
            console.log(`[SCROLL] Estabilidad alcanzada para "${targetAnchor}". Limpiando estados.`);
            sessionStorage.removeItem('bx_return_section');
            sessionStorage.removeItem('bx_return_from');
            
            // Eliminar el hash de la URL sin recargar la página
            window.history.replaceState(null, '', window.location.pathname);
            setTargetAnchor(null);
          }
        }, 800);

        return true;
      }
      return false;
    };

    const interval = setInterval(() => {
      attempts++;
      const success = scrollToTarget();
      if (!success && attempts % 10 === 0) {

      }
      if (success || attempts > maxAttempts) {

        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [pageContent, renderedSectionsCount, targetAnchor]);

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
      const activeProducts = products.filter((p: any) => p.status === 'active');

      const productsWithTranslations = await Promise.all(
        activeProducts.map(async (product: Product) => {
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
    backgroundImage: "/images/hero-bg.jpg",
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

      <div id="hero" style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <Hero content={heroContent} />
      </div>

      {pageContent ? (
        <>
          {pageContent.sections
            .filter((s: Section) => s.visible && s.type !== "hero")
            .filter((_: Section, index: number) => index < renderedSectionsCount)
            .map((section: Section, index: number) => (
              <DynamicSection
                key={section.id}
                section={section}
                products={homeProducts}
                language={language}
                index={index}
                targetAnchor={targetAnchor}
              />
            ))}
        </>
      ) : (
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
