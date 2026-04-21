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

  // ✅ Calcular ancla inicial SÍNCRONAMENTE para evitar el frame "null"
  const getInitialAnchor = () => {
    if (typeof window === 'undefined') return null;
    const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navType = navEntries.length > 0 ? navEntries[0].type : 'unknown';
    
    // Si es un reload físico, ignorar anclas antiguas para empezar de cero a arriba
    if (navType === 'reload') {
      console.debug("[SCROLL] Home.Initializer -> Reload detectado. Ignorando anclas.");
      return null;
    }

    const anchor = sessionStorage.getItem('bx_return_section') || window.location.hash.replace('#', '');
    if (anchor) {
      console.info(`[SCROLL] Home.Initializer -> Encontrado: #${anchor} (Nav: ${navType})`);
    }
    return anchor || null;
  };

  const initialAnchor = getInitialAnchor();
  const [targetAnchor, setTargetAnchor] = useState<string | null>(initialAnchor);

  // ✅ Si hay ancla o caché, empezamos con todas las secciones para que el DOM esté listo
  const [renderedSectionsCount, setRenderedSectionsCount] = useState(() => {
    const cached = supabaseAPI.getCachedData(`page-content-page-home-${language}`);
    if (initialAnchor || cached) {
      const sections = cached?.sections?.filter((s: any) => s.visible && s.type !== "hero") || [];
      console.debug(`[SCROLL] Home.Initializer -> Flash Mode ON (${sections.length} secciones)`);
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
      sessionStorage.removeItem('bx_return_section');
      sessionStorage.removeItem('bx_return_from');
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
      if (anchorFromSession) {
        console.info(`[SCROLL] Navegación POP detectada. Cargando ancla: ${anchorFromSession}`);
        setTargetAnchor(anchorFromSession);
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
      console.info("[SCROLL] Home.Engine -> Modo FLASH (Ancla detectada). Renderizando todo.");
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
  useEffect(() => {
    // Si no hay ancla, el motor duerme
    if (!targetAnchor) {
      const pending = sessionStorage.getItem('bx_return_section') || window.location.hash.replace('#', '');
      if (pending) {
        console.info(`[SCROLL] Motor -> Activando ancla pendiente: #${pending}`);
        setTargetAnchor(pending);
      }
      return;
    }

    // Si no hay contenido aún, esperamos a la BD
    if (!pageContent) {
      console.log(`[SCROLL] Motor -> Esperando pageContent para #${targetAnchor}`);
      return;
    }

    console.info(`[SCROLL] 🔍 Iniciando búsqueda inteligente de: #${targetAnchor}`);
    let attempts = 0;
    const maxAttempts = 60; // 6 segundos máximo (100ms * 60)

    const scrollToTarget = () => {
      // 1. Limpiar el ancla de prefijos comunes para buscar por 'type'
      const cleanType = targetAnchor.replace(/^home-/, '').replace(/^store-/, '');
      
      // 2. Buscador Multi-Criterio (Cascada)
      const element = 
        document.getElementById(targetAnchor) || 
        document.querySelector(`[data-section-type="${cleanType}"]`) ||
        document.querySelector(`[data-section-id="${targetAnchor}"]`) ||
        document.querySelector(`[data-section-type="${targetAnchor}"]`);

      if (element) {
        const rect = element.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const targetTop = Math.max(0, absoluteTop - 80); // 80px del header
        
        console.info(`[SCROLL] ✅ ORIGEN HALLADO: <${element.tagName.toLowerCase()} id="${element.id}" data-section-type="${element.getAttribute('data-section-type') || ''}"> a ${targetTop}px`);
        
        // Salto instantáneo primero para asegurar el área (evita ver el scroll bajar)
        window.scrollTo({ top: targetTop, behavior: 'instant' as any });
        
        // Refuerzo suave después de un mini-frame para precisión fina
        setTimeout(() => {
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }, 50);

        // Verificación de estabilidad a largo plazo (Layout Shifts por imágenes)
        setTimeout(() => {
          const freshRect = element.getBoundingClientRect();
          const freshTop = freshRect.top + window.pageYOffset - 80;
          const drift = Math.abs(freshTop - targetTop);
          
          if (drift > 10) {
            console.warn(`[SCROLL] ⚡ Layout Shift detectado: El elemento se movió ${Math.round(drift)}px. Re-ajustando...`);
            window.scrollTo({ top: freshTop, behavior: 'smooth' });
          }
          
          // Limpieza final si estamos en el rango correcto (+- 100px)
          if (Math.abs(freshRect.top - 80) < 100) {
            console.info(`[SCROLL] 🏁 Estabilidad lograda para #${targetAnchor}.`);
            sessionStorage.removeItem('bx_return_section');
            sessionStorage.removeItem('bx_return_from');
            if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
            setTargetAnchor(null);
          }
        }, 800);

        return true;
      }
      return false;
    };

    const interval = setInterval(() => {
      attempts++;
      if (scrollToTarget() || attempts >= maxAttempts) {
        if (attempts >= maxAttempts) {
          console.error(`[SCROLL] ❌ Fallo crítico: No se encontró la sección para #${targetAnchor} tras 6 segundos.`);
          console.error(`[SCROLL] DOM Actual:`, document.querySelectorAll('[data-section-type]'));
        }
        clearInterval(interval);
      } else if (attempts % 10 === 0) {
        console.log(`[SCROLL] Buscando en el DOM... (Intento ${attempts}/${maxAttempts})`);
      }
    }, 100);

    return () => clearInterval(interval);
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
