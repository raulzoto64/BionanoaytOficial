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
import { API_BASE_URL, getApiHeaders } from "../data/apiConfig";

export function Home() {
  const { language } = useLanguage();
  const { updateTrigger } = useDatabase();
  const navigationType = useNavigationType();
  
  console.log("🏠 [HOME-CORE] Renderizado de Home detectado.");

  const [pageContent, setPageContent] = useState<PageContent | null>(() => 
    supabaseAPI.getCachedData(`page-content-page-home-${language}`)
  );
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
      console.log(`🔄 [HOME-CORE] Recarga detectada en INIT. Ignorando hash.`);
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
      sessionStorage.removeItem('bx_return_section');
      return null;
    }

    const initial = sessionStorage.getItem('bx_return_section') || window.location.hash.replace('#', '');
    if (initial) console.log(`🎯 [HOME-CORE] Ancla inicial detectada: #${initial}`);
    return initial;
  });

  useEffect(() => {
    // ✅ DETECTOR DE RECARGA (F5): Si se recarga físicamente, mandamos a "/" (arriba)
    const isReload = window.performance
      .getEntriesByType('navigation')
      .map((nav) => (nav as any).type)
      .includes('reload');

    if (isReload && window.location.hash) {
      console.log("🔄 [HOME-CORE] Recarga detectada. Limpiando hash para empezar en el top.");
      window.history.replaceState(null, '', window.location.pathname);
      setTargetAnchor(null);
      sessionStorage.removeItem('bx_return_section');
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      console.log(`🔗 [HOME-CORE] Cambio de HASH detectado: #${hash}`);
      if (hash) setTargetAnchor(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ✅ 1. Renderizado Progresivo Inteligente (Modo Relámpago si hay ancla)
  useEffect(() => {
    if (!pageContent || homeProducts.length === 0) return;

    const totalSections = pageContent.sections.filter(s => s.visible && s.type !== "hero").length;
    
    if (targetAnchor || (navigationType === 'POP' || navigationType === 'PUSH')) {
      // MODO RELÁMPAGO: Renderizar todo de golpe
      setRenderedSectionsCount(totalSections);
    } else {
      // MODO PROGRESIVO: Cargar suavemente
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

    console.log(`🔍 [SCROLL-ENGINE] Buscando destino: #${targetAnchor}`);
    
    let attempts = 0;
    const maxAttempts = 100;
    
    const scrollToTarget = () => {
      const element = document.getElementById(targetAnchor) || 
                     document.querySelector(`[data-section-type="${targetAnchor}"]`) ||
                     document.querySelector(`[data-section-id="${targetAnchor}"]`);

      if (element) {
        const rect = element.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;
        const targetTop = rect.top + currentScrollY - 80;
        
        console.log(`📍 [SCROLL-ENGINE] Elemento encontrado. Posición actual Y: ${targetTop.toFixed(0)}px`);

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
            console.warn(`⚠️ [SCROLL-ENGINE] DETECTADO DESPLAZAMIENTO: La sección se movió ${shift.toFixed(0)}px durante el scroll. Re-ajustando...`);
            window.scrollTo({ top: freshTargetTop, behavior: 'smooth' });
          } else {
            console.log(`✅ [SCROLL-ENGINE] Destino alcanzado con precisión.`);
          }
          
          // ✅ Limpieza Final: Una vez que estamos seguros de haber llegado
          if (Math.abs(freshRect.top - 80) < 60) {
            console.log("🧹 [SCROLL-ENGINE] Destino consolidado. Limpiando ancla de la URL.");
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
        console.log(`⏳ [SCROLL-ENGINE] Intento ${attempts}: Esperando a que #${targetAnchor} aparezca en el DOM...`);
      }
      if (success || attempts > maxAttempts) {
        if (!success) console.error(`❌ [SCROLL-ENGINE] Error: No se pudo encontrar #${targetAnchor} tras 10 segundos.`);
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
