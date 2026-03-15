import { useEffect, useState } from "react";
import { PageContent, Section, supabaseAPI } from "../data/supabase";
import { FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function Process() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    loadPageContent();
  }, [language]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent('page-process', language);
      setPageContent(content);
    } catch (error) {
    }
  };

  const getIconComponent = (iconName: string) => {
    if (!iconName) return FlaskConical;
    
    switch (iconName) {
      case 'FlaskConical':
        return FlaskConical;
      case 'FileCheck':
        return FileCheck;
      case 'Microscope':
        return Microscope;
      case 'Factory':
        return Factory;
      case 'TrendingUp':
        return TrendingUp;
      case 'Globe':
        return Globe;
      default:
        return FlaskConical;
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
                <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${section.content.backgroundImage}')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[#1C5D15]/85"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
                    <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
                      {section.content.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95">
                      {section.content.subtitle}
                    </p>
                    {section.content.ctaText && (
                      <button 
                        className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90 px-8 py-6 text-lg shadow-lg rounded-lg transition-colors"
                      >
                        {section.content.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          case 'features':
            return (
              <section key={section.id} className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="space-y-16">
                    {section.content.items.map((step: any, index: number) => {
                      const isEven = index % 2 === 0;
                      
                      return (
                        <div 
                          key={index}
                          className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 bg-[#19FF00] rounded-full flex items-center justify-center flex-shrink-0">
                                {(() => {
                                  try {
                                    if (step.icon && typeof step.icon === 'string') {
                                      const Icon = getIconComponent(step.icon);
                                      return <Icon className="w-8 h-8 text-[#1C5D15]" />;
                                    }
                                  } catch (error) {
                                  }
                                  return <FlaskConical className="w-8 h-8 text-[#1C5D15]" />;
                                })()}
                              </div>
                              <div>
                                <div className="text-sm text-[#629960]">Paso {index + 1}</div>
                                <h3 className="text-3xl text-[#1C5D15]">{step.title}</h3>
                              </div>
                            </div>
                            <p className="text-lg text-[#629960] mb-6 leading-relaxed">
                              {step.description}
                            </p>
                            <ul className="grid grid-cols-2 gap-3">
                              {step.details.map((detail: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-[#629960]">
                                  <span className="text-[#19FF00] mt-1">✓</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex-1">
                            <div className={`w-full h-80 rounded-2xl bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center text-white text-6xl`}>
                              {step.image ? (
                                <img 
                                  src={step.image} 
                                  alt={`Imagen paso ${index + 1}`} 
                                  className="w-full h-full object-cover opacity-20"
                                />
                              ) : step.icon ? (
                                (() => {
                                  try {
                                    if (typeof step.icon === 'string') {
                                      const Icon = getIconComponent(step.icon);
                                      return <Icon className="w-32 h-32 opacity-20" />;
                                    }
                                                                } catch (error) {
                                  }
                                  return null;
                                })()
                              ) : null}
                            </div>
                          </div>
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

                  <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    {section.content.milestones.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="text-center bg-white p-6 rounded-xl shadow-lg border-2 border-[#19FF00]">
                          <div className="text-2xl text-[#1C5D15] mb-2">{item.phase}</div>
                          <div className="text-[#629960]">{item.time}</div>
                        </div>
                        {index < 3 && (
                          <div className="hidden md:block text-[#19FF00] text-3xl">→</div>
                        )}
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
    </div>
  );
}
