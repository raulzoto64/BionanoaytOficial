import { useEffect, useState } from "react";
import { PageContent, Section, supabaseAPI } from "../data/supabase";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { Purpose } from "../components/Purpose";
import { FeaturedProduct } from "../components/FeaturedProduct";
import { Products } from "../components/Products";
import { Timeline } from "../components/Timeline";
import { Leadership } from "../components/Leadership";
import { Ecosystem } from "../components/Ecosystem";
import { Footer } from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function Home() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    loadPageContent();
  }, [language]);

  const loadPageContent = async () => {
    try {
      console.log('Loading page content for language:', language);
      const content = await supabaseAPI.getPageContent('page-home', language);
      console.log('Page content received:', content);
      setPageContent(content);
    } catch (error) {
      console.error('Error al cargar contenido de página:', error);
    }
  };

  if (!pageContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="text-2xl text-[#1C5D15] mb-2">Cargando contenido...</h2>
          <p className="text-[#629960]">Por favor, espera mientras se cargan los datos</p>
        </div>
      </div>
    );
  }

  // Get SEO data from hero section or use defaults
  const seoData = pageContent.sections.find(sec => sec.type === 'hero')?.content?.seo || {};

  console.log('Page content sections:', pageContent.sections);
  
  return (
    <>
      <SEO
        title={seoData.metaTitle}
        description={seoData.metaDescription}
        keywords={seoData.metaKeywords}
      />
      
      {pageContent.sections.map((section: Section) => {
        if (!section.visible) return null;

        console.log('Rendering section:', section.type);

        switch (section.type) {
          case 'hero':
            return (
              <div key={section.id} id="hero">
                <Hero content={section.content} />
              </div>
            );
          case 'trust':
            return (
              <div key={section.id} id="trust">
                <TrustBar partners={section.content.partners} />
              </div>
            );
          case 'features':
            console.log('Features section content:', section.content);
            return (
              <div key={section.id} id="purpose">
                <Purpose purposes={section.content.items} />
              </div>
            );
          case 'featured':
            return (
              <div key={section.id} id="featured">
                <FeaturedProduct content={section.content} />
              </div>
            );
          case 'products':
            return (
              <div key={section.id} id="products">
                <Products products={section.content.products} title={section.content.title} subtitle={section.content.subtitle} />
              </div>
            );
          case 'timeline':
            return (
              <div key={section.id} id="timeline">
                <Timeline milestones={section.content.milestones} />
              </div>
            );
          case 'team':
            return (
              <div key={section.id} id="team">
                <Leadership members={section.content.members} title={section.content.title} subtitle={section.content.subtitle} />
              </div>
            );
          case 'ecosystem':
            return (
              <div key={section.id} id="ecosystem">
                <div id="allies">
                  <Ecosystem allies={section.content.allies} />
                </div>
              </div>
            );
          case 'contact':
            return (
              <div key={section.id} id="contact">
                <Footer contactInfo={section.content.contactInfo} />
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
