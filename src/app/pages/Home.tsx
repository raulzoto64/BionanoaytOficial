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
import { DatabaseManager } from "../data/DatabaseManager";

export function Home() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<
    (Product & { translation: ProductTranslation })[]
  >([]);
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    location: ''
  });
  const { language } = useLanguage();

  useEffect(() => {
    loadPageContent();
    loadFeaturedProducts();
    loadContactInfo();
  }, [language]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent("page-home", language);
      setPageContent(content);
    } catch (error) {
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

  const loadContactInfo = async () => {
    try {
      const settings = await DatabaseManager.getFooterSettings();
      setContactInfo({
        phone: settings.contact_info?.phone || '',
        email: settings.contact_info?.email || '',
        location: settings.contact_info?.location || ''
      });
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-[#F7F9CE]">
        {/* Skeleton for Hero */}
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[#1C5D15]/10 animate-pulse"></div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="w-3/4 max-w-4xl mx-auto px-6">
              <div className="h-12 bg-[#1C5D15]/20 rounded-lg mb-6 animate-pulse"></div>
              <div className="h-24 bg-[#1C5D15]/15 rounded-lg mb-8 animate-pulse"></div>
              <div className="h-10 bg-[#19FF00]/30 rounded-lg w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skeleton for Purpose */}
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

        {/* Skeleton for Products */}
        <div className="py-20 bg-[#629960]/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="h-8 bg-[#1C5D15]/20 rounded-full w-1/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-16 bg-[#1C5D15]/15 rounded-lg w-3/4 mx-auto mb-6 animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-[#629960]/20"
                >
                  <div className="h-56 bg-[#1C5D15]/10 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-4 bg-[#629960]/20 rounded-lg mb-2 animate-pulse"></div>
                    <div className="h-8 bg-[#1C5D15]/20 rounded-lg mb-3 animate-pulse"></div>
                    <div className="h-12 bg-[#629960]/15 rounded-lg mb-6 animate-pulse"></div>
                    <div className="h-8 bg-[#1C5D15]/20 rounded-lg w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton for Timeline */}
        <div className="py-20 bg-[#1C5D15] text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-12 bg-white/20 rounded-lg w-1/3 mx-auto mb-16 animate-pulse"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#629960]/30 rounded-xl p-6">
                  <div className="w-16 h-16 bg-[#19FF00]/30 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 bg-white/30 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-8 bg-white/20 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-12 bg-white/15 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton for Footer */}
        <div className="py-20 bg-[#1C5D15] text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="h-8 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-[#19FF00]/30 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="h-8 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#19FF00]/20 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded-lg mb-1 animate-pulse"></div>
                      <div className="h-6 bg-white/15 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#19FF00]/20 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded-lg mb-1 animate-pulse"></div>
                      <div className="h-6 bg-white/15 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#19FF00]/20 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded-lg mb-1 animate-pulse"></div>
                      <div className="h-6 bg-white/15 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get SEO data from hero section or use defaults
  const seoData =
    pageContent.sections.find((sec) => sec.type === "hero")?.content?.seo || {};

  return (
    <>
      <SEO
        title={seoData.metaTitle}
        description={seoData.metaDescription}
        keywords={seoData.metaKeywords}
      />

      {pageContent.sections.map((section: Section) => {
        if (!section.visible) return null;

        switch (section.type) {
          case "hero":
            return (
              <div key={section.id} id="hero">
                <Hero content={section.content} />
              </div>
            );
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
                <Timeline milestones={section.content.milestones} />
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
          case "ecosystem":
            const hasDedicatedNews = pageContent.sections.some(s => s.type === 'news');
            return (
              <div key={section.id} id="ecosystem">
                <div id="allies">
                  <Ecosystem 
                    title={section.content.title} 
                    subtitle={section.content.subtitle} 
                  />
                </div>
                {!hasDedicatedNews && <NewsSection />}
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
          default:
            return null;
        }
      })}
    </>
  );
}
