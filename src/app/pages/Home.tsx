import { useEffect, useState } from "react";
import { useScrollRestore } from "../hooks/useScrollRestore";
import { useMenuNavigation } from "../hooks/useMenuNavigation";
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

  // ✅ 1. Lógica de Navegación Abstraída
  const restoredAnchor = useScrollRestore(pageContent, navigationType);
  const menuAnchor = useMenuNavigation(pageContent, navigationType);
  const targetAnchor = restoredAnchor || menuAnchor;

  // ✅ 2. Motor de Renderizado Progresivo
  // Si hay ancla o caché, empezamos con todas las secciones para que el DOM esté listo
  const [renderedSectionsCount, setRenderedSectionsCount] = useState<number>(() => {
    const cached = supabaseAPI.getCachedData(`page-content-page-home-${language}`);
    if (targetAnchor || cached) {
      const sections = cached?.sections?.filter((s: any) => s.visible && s.type !== "hero") || [];
      return sections.length || 0;
    }
    return 0;
  });

  useEffect(() => {
    if (!pageContent) return;

    const sections = pageContent.sections.filter(s => s.visible && s.type !== "hero");
    const totalSections = sections.length;
    
    // Si hay ancla activa, forzamos render completo inmediatamente
    if (targetAnchor) {
      setRenderedSectionsCount(totalSections);
      return;
    }

    if (renderedSectionsCount >= totalSections) return;

    const step = navigationType === 'POP' ? 4 : 1;
    const delay = navigationType === 'POP' ? 50 : 100;

    const interval = setInterval(() => {
      setRenderedSectionsCount(prev => {
        if (prev >= totalSections) {
          clearInterval(interval);
          return prev;
        }
        return Math.min(prev + step, totalSections);
      });
    }, delay);

    return () => clearInterval(interval);
  }, [pageContent, navigationType, targetAnchor, renderedSectionsCount]);

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
