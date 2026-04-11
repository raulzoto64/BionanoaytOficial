import { useEffect, useState } from "react";
import {
  PageContent,
  Section,
  supabaseAPI,
  Product,
  ProductTranslation,
} from "../data/supabase";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { Purpose } from "../components/Purpose";
import { FeaturedProduct } from "../components/FeaturedProduct";
import { Products } from "../components/Products";
import { Timeline } from "../components/Timeline";
import { Leadership } from "../components/Leadership";
import { Ecosystem } from "../components/Ecosystem";
import { NewsSection } from "../components/NewsSection";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { useDatabase } from "../hooks/useDatabase";

export function Home() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<
    (Product & { translation: ProductTranslation })[]
  >([]);
  const { language } = useLanguage();
  const { updateTrigger } = useDatabase();

  useEffect(() => {
    loadPageContent();
    loadFeaturedProducts();
  }, [language, updateTrigger]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent("page-home", language);
      setPageContent(content);
    } catch (error) {
      console.error("Error loading home page content:", error);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const products = await supabaseAPI.getFeaturedProducts();

      // Get translations for each featured product and category
      const productsWithTranslations = await Promise.all(
        products.map(async (product) => {
          const translation = await supabaseAPI.getProductTranslation(
            product.id,
            language,
          );
          const categoryTranslation = await supabaseAPI.getCategoryTranslation(
            product.category,
            language,
          );
          return {
            ...product,
            translation,
            categoryName: categoryTranslation?.name || product.category,
          };
        }),
      );

      setFeaturedProducts(productsWithTranslations);
    } catch (error) {
    }
  };


  const defaultHero = {
    title: "Bionanoaxus (BNX)",
    subtitle: language === 'es' ? "Innovación bionanotecnológica para un mundo mejor" : "Bionanotechnology innovation for a better world",
    backgroundImage: "https://sb-jzmdfoptxmqywihyhoty.supabase.co/storage/v1/object/public/site_assets/hero-bg.jpg",
    ctaText: language === 'es' ? "Saber más" : "Learn more",
    ctaLink: "#purpose"
  };

  // Get Hero section if available
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

      <div id="hero">
        <Hero content={heroContent} />
      </div>

      {pageContent ? (
        <>
        {pageContent.sections.map((section: Section) => {
          if (!section.visible || section.type === "hero") return null;

          switch (section.type) {
            case "trust":
              return (
                <div key={section.id} id="trust">
                  <TrustBar partners={section.content.partners} />
                </div>
              );
            case "features":
              return (
                <div key={section.id} id="purpose">
                  <Purpose purposes={section.content.items} />
                </div>
              );
            case "featured":
              return (
                <div key={section.id} id="featured">
                  <FeaturedProduct content={section.content} />
                </div>
              );
            case "products":
              return (
                <div key={section.id} id="products">
                  <Products
                    products={featuredProducts}
                    title={section.content.title}
                    subtitle={section.content.subtitle}
                  />
                </div>
              );
            case "timeline":
              return (
                <div key={section.id} id="timeline">
                  <Timeline 
                    milestones={section.content.milestones}
                    title={section.content.title}
                    subtitle={section.content.subtitle}
                    description={section.content.description}
                  />
                </div>
              );
            case "team":
              return (
                <div key={section.id} id="team">
                  <Leadership
                    members={section.content.members}
                    title={section.content.title}
                    subtitle={section.content.subtitle}
                  />
                </div>
              );

            case "news":
              return (
                <div key={section.id} id="news">
                  <NewsSection 
                    title={section.content.title} 
                    subtitle={section.content.subtitle} 
                  />
                </div>
              );
            case "ecosystem":
              return (
                <div key={section.id} id="ecosystem">
                  <div id="allies">
                    <Ecosystem 
                      title={section.content.title} 
                      subtitle={section.content.subtitle} 
                      items={section.content.items}
                    />
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
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
