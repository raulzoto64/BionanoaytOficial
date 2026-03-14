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
import { Footer } from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function Home() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<
    (Product & { translation: ProductTranslation })[]
  >([]);
  const { language } = useLanguage();

  useEffect(() => {
    loadPageContent();
    loadFeaturedProducts();
  }, [language]);

  const loadPageContent = async () => {
    try {
      console.log("Loading page content for language:", language);
      const content = await supabaseAPI.getPageContent("page-home", language);
      console.log("Page content received:", content);
      setPageContent(content);
    } catch (error) {
      console.error("Error al cargar contenido de página:", error);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      console.log("Loading featured products...");
      const products = await supabaseAPI.getFeaturedProducts();
      console.log("Featured products from DB:", products);

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

      console.log("Products with translations:", productsWithTranslations);
      setFeaturedProducts(productsWithTranslations);
    } catch (error) {
      console.error("Error al cargar productos destacados:", error);
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

        {/* Skeleton for Leadership */}
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="h-6 bg-[#1C5D15]/20 rounded-full w-1/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-12 bg-[#1C5D15]/20 rounded-lg w-1/2 mx-auto mb-4 animate-pulse"></div>
              <div className="h-8 bg-[#629960]/20 rounded-lg w-3/4 mx-auto animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#19FF00]/30 mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 bg-[#1C5D15]/20 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-[#629960]/20 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Skeleton for Ecosystem */}
        <div className="py-20 bg-[#629960]/10">
          <div className="max-w-6xl mx-auto px-6">
            {/* Título del esqueleto principal */}
            <div className="h-12 bg-[#1C5D15]/20 rounded-lg w-1/3 mx-auto mb-12 animate-pulse"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {" "}
              {/* Ajustado a 3 columnas para que coincida con tu imagen */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg border-2 border-[#629960]/20 min-h-[380px] justify-center"
                >
                  {/* Círculo Interno: flex-shrink-0 evita que se aplaste */}
                  <div className="w-32 h-32 rounded-full border-4 border-[#629960]/30 mb-6 animate-pulse bg-[#629960]/10 flex-shrink-0"></div>

                  {/* Contenedor de texto con altura fija para simular el espacio de 2 líneas */}
                  <div className="w-full flex flex-col items-center">
                    <div className="h-7 bg-[#1C5D15]/20 rounded-lg w-full mb-3 animate-pulse"></div>
                    <div className="h-7 bg-[#1C5D15]/20 rounded-lg w-2/3 mb-4 animate-pulse"></div>{" "}
                    {/* Segunda línea de título */}
                    {/* Subtítulo o categoría */}
                    <div className="h-5 bg-[#629960]/20 rounded-lg w-1/2 animate-pulse"></div>
                  </div>
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

  console.log("Page content sections:", pageContent.sections);

  return (
    <>
      <SEO
        title={seoData.metaTitle}
        description={seoData.metaDescription}
        keywords={seoData.metaKeywords}
      />

      {pageContent.sections.map((section: Section) => {
        if (!section.visible) return null;

        console.log("Rendering section:", section.type);

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
            console.log("Features section content:", section.content);
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
            return (
              <div key={section.id} id="ecosystem">
                <div id="allies">
                  <Ecosystem />
                </div>
                {/* News Section */}
                <NewsSection />
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
