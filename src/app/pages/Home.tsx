import { useEffect, useState, useLayoutEffect } from "react";
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
    return cached;
  });
  
  const [homeProducts, setHomeProducts] = useState<
    (Product & { translation: ProductTranslation; categoryName: string })[]
  >(() => supabaseAPI.getCachedData(`home-products-ready-${language}`) || []);

  // ✅ Calcular ancla inicial SÍNCRONAMENTE para evitar el frame "null"
  const getInitialAnchor = () => {
    if (typeof window === 'undefined') return null;
    const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navType = navEntries.length > 0 ? navEntries[0].type : 'unknown';
    
    // Si es un reload físico, ignorar anclas antiguas para empezar de cero a arriba
    if (navType === 'reload') {
      return null;
    }

    // ✅ PRIORIDAD 1: sessionStorage (El lugar más seguro para POP/Atrás)
    const sessionAnchor = sessionStorage.getItem('bx_return_section');
    // ✅ PRIORIDAD 2: history.state (Push navigation)
    // ✅ PRIORIDAD 3: URL Hash
    const anchor = sessionAnchor || window.history.state?.returnSection || window.location.hash.replace('#', '');
    
    if (anchor) {
      // IMPORTANTE: NO borramos sessionStorage aquí.
      // Si lo borramos ahora, ScrollToTop no lo verá en su useEffect y forzará un scroll al top.
    }
    return anchor || null;
  };

  const initialAnchor = getInitialAnchor();
  const [targetAnchor, setTargetAnchor] = useState<string | null>(initialAnchor);

  // ✅ Si hay ancla o caché, empezamos con todas las secciones para que el DOM esté listo
  const [renderedSectionsCount, setRenderedSectionsCount] = useState<number>(() => {
    const cached = supabaseAPI.getCachedData(`page-content-page-home-${language}`);
    if (initialAnchor || cached) {
      const sections = cached?.sections?.filter((s: any) => s.visible && s.type !== "hero") || [];
      return sections.length || 0;
    }
    return 0;
  });

  // ✅ 1. Inicialización de Estado y Limpieza (Efectos secundarios)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (isReload) {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
      setTargetAnchor(null);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setTargetAnchor(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ✅ 2. Detector de navegación POP (Atrás)
  useEffect(() => {
    if (navigationType === 'POP') {
      const anchorFromSession = sessionStorage.getItem('bx_return_section');
      const anchorFromHistory = window.history.state?.returnSection;
      const target = anchorFromSession || anchorFromHistory;
      
      if (target) {
        setTargetAnchor(target);
      }
    }
  }, [navigationType]);

  // ✅ 4. Motor de Renderizado Progresivo
  useEffect(() => {
    if (!pageContent) return;

    const sections = pageContent.sections.filter(s => s.visible && s.type !== "hero");
    const totalSections = sections.length;
    
    // Si ya terminamos y no hay ancla nueva, no hacer nada
    if (renderedSectionsCount >= totalSections && !targetAnchor) return;

    if (targetAnchor) {
      setRenderedSectionsCount(totalSections);
      return;
    }

    // Si ya llegamos al máximo, no iniciamos intervalos
    if (renderedSectionsCount >= totalSections) return;

    const step = navigationType === 'POP' ? 4 : 1;
    const delay = navigationType === 'POP' ? 50 : 100;

    const interval = setInterval(() => {
      setRenderedSectionsCount(prev => {
        if (prev >= totalSections) {
          clearInterval(interval);
          return prev;
        }
        const next = Math.min(prev + step, totalSections);
        return next;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [pageContent, navigationType, targetAnchor]);

  // ✅ 5. Motor de Scroll Automático Inteligente
  useLayoutEffect(() => {
    // Si no hay ancla, el motor duerme
    if (!targetAnchor) {
      setTimeout(() => {
        const sessionAnchor = sessionStorage.getItem('bx_return_section');
        const pending = sessionAnchor || window.history.state?.returnSection || window.location.hash.replace('#', '');
        if (pending) {
          setTargetAnchor(pending);
        }
      }, 0);
      return;
    }

    // Si no hay contenido aún, esperamos a la BD
    if (!pageContent) {
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 60; // 6 segundos
    let activeScrollLocker: NodeJS.Timeout | null = null;

    const breakLock = () => {
      if (activeScrollLocker) clearInterval(activeScrollLocker);
      setTargetAnchor(null);
      console.log(`[SCROLL-LOCK] 🛑 Cerrojo liberado (Intervención del usuario o fin de tiempo)`);
      window.removeEventListener('wheel', breakLock);
      window.removeEventListener('touchstart', breakLock);
    };

    const scrollToTarget = () => {
      const cleanType = targetAnchor.replace(/^home-/, '').replace(/^store-/, '');
      
      const element = 
        document.getElementById(targetAnchor) || 
        document.querySelector(`[data-section-type="${cleanType}"]`) ||
        document.querySelector(`[data-section-id="${targetAnchor}"]`) ||
        document.querySelector(`[data-section-type="${targetAnchor}"]`);

      if (element) {
        sessionStorage.removeItem('bx_return_section');
        sessionStorage.removeItem('bx_return_from');
        if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);

        let lockTime = 0;
        const maxLockTime = 1500; 
        const intervalMs = 25; 

        // Si el usuario intenta hacer scroll manualmente, soltamos el ancla inmediatamente
        window.addEventListener('wheel', breakLock, { passive: true });
        window.addEventListener('touchstart', breakLock, { passive: true });

        activeScrollLocker = setInterval(() => {
          lockTime += intervalMs;
          
          const freshRect = element.getBoundingClientRect();
          const freshTop = Math.max(0, freshRect.top + window.pageYOffset - 80);
          
          console.log(`[SCROLL-LOCK] 🔒 Forzando posición: ${freshTop}px`);
          window.scrollTo({ top: freshTop, behavior: 'instant' as ScrollBehavior });
          
          if (lockTime >= maxLockTime) {
            breakLock(); 
          }
        }, intervalMs);

        return true;
      }
      return false;
    };

    const interval = setInterval(() => {
      attempts++;
      if (scrollToTarget() || attempts >= maxAttempts) {
        if (attempts >= maxAttempts) {
          sessionStorage.removeItem('bx_return_section');
          sessionStorage.removeItem('bx_return_from');
        }
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (activeScrollLocker) clearInterval(activeScrollLocker);
      window.removeEventListener('wheel', breakLock);
      window.removeEventListener('touchstart', breakLock);
    };
  }, [pageContent, targetAnchor]);

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
