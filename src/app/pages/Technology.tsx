import { useEffect, useState } from "react";
import { PageContent, Section, supabaseAPI } from "../data/supabase";
import { Hero } from "../components/Hero";
import { Purpose } from "../components/Purpose";
import { Timeline } from "../components/Timeline";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function Technology() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    loadPageContent();
  }, [language]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent('page-technology', language);
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

  return (
    <div className="min-h-screen">
      <SEO
        title={seoData.metaTitle}
        description={seoData.metaDescription}
        keywords={seoData.metaKeywords}
      />
      {pageContent.sections.map((section: Section) => {
        if (!section.visible) return null;

        switch (section.type) {
          case 'hero':
            return (
              <div key={section.id}>
                <Hero content={section.content} />
              </div>
            );
          case 'features':
            return (
              <section key={section.id} className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {section.content.items?.map((item: any, index: number) => {
                      return (
                        <div 
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-[#629960]/20 hover:border-[#19FF00] transition-all duration-300 hover:shadow-xl"
                        >
                          <div className="inline-block px-6 py-3 bg-[#19FF00] text-[#1C5D15] rounded-lg font-bold text-lg mb-6">
                            {item.icon}
                          </div>
                          <h3 className="text-2xl text-[#1C5D15] mb-4">{item.title}</h3>
                          <p className="text-[#629960] mb-6 leading-relaxed">
                            {item.description}
                          </p>
                          <ul className="space-y-2">
                            {item.details?.map((detail: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-[#629960]">
                                <span className="text-[#19FF00] mt-1">✓</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          case 'timeline':
            return (
              <section key={section.id} className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl text-[#1C5D15] mb-4">
                      {section.content.title}
                    </h2>
                    <p className="text-xl text-[#629960]">
                      {section.content.subtitle}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    {section.content.milestones?.map((item: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 bg-[#1C5D15] text-[#19FF00] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                          {item.step}
                        </div>
                        <h3 className="text-xl text-[#1C5D15] mb-2">{item.title}</h3>
                        <p className="text-[#629960]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}

      {/* CTA Section */}
      <section className="py-20 bg-[#1C5D15] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl mb-6">
            ¿Interesado en conocer más?
          </h2>
          <p className="text-xl text-[#F7F9CE] mb-8">
            Contáctanos para recibir información técnica detallada de nuestros productos
          </p>
          <a 
            href="/#contact"
            className="inline-block px-8 py-4 bg-[#19FF00] text-[#1C5D15] rounded-lg hover:bg-[#19FF00]/90 transition-colors"
          >
            Contactar a nuestro equipo
          </a>
        </div>
      </section>
    </div>
  );
}
