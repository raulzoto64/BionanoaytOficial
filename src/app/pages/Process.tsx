import { useEffect, useState } from "react";
import { PageContent, Section, supabaseAPI } from "../data/supabase";
import { DynamicSection } from "../components/DynamicSection";
import {
  FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe,
  AlertTriangle, ChevronDown, ChevronUp, Quote, CheckCircle,
  Sprout, Building2, Fish, Apple, HeartPulse, Shirt, Warehouse, Shield
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { useNavigate } from "react-router";
import { handleAction } from "../utils/actions";

// ── Mapa de iconos ─────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe,
  AlertTriangle, CheckCircle, Sprout, Building2, Fish, Apple,
  HeartPulse, Shirt, Warehouse, Shield
};
function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICON_MAP[name] || FlaskConical;
  return <C className={className} />;
}

// ── FAQ Item collapsible ───────────────────────────────────────────────────
function FaqItem({ item }: { item: { question: string; answer: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#629960]/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#629960]/5 transition-colors"
      >
        <span className="font-bold text-[#1C5D15] text-base md:text-lg">{item.question}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-[#629960] shrink-0" />
          : <ChevronDown className="w-5 h-5 text-[#629960] shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-[#629960]/5 text-[#629960] leading-relaxed text-sm md:text-base">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function Process() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [pageContent, setPageContent] = useState<PageContent | null>(() => 
    supabaseAPI.getCachedData(`page-content-page-process-${language}`)
  );

  useEffect(() => { loadPageContent(); }, [language]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent('page-process', language);
      setPageContent(content);
      supabaseAPI._saveToCache(`page-content-page-process-${language}`, content);
    } catch (error) {}
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

  const seoData = pageContent.sections.find(sec => sec.type === 'hero')?.content?.seo || {};

  return (
    <div className="min-h-screen">
      <SEO
        title={seoData.metaTitle}
        description={seoData.metaDescription}
        keywords={seoData.metaKeywords}
      />

      {pageContent.sections.map((section: Section, index: number) => {
        if (!section.visible) return null;
        return (
          <ProcessSectionPreview
            key={section.id}
            section={section}
            index={index}
            language={language}
            navigate={navigate}
          />
        );
      })}
    </div>
  );
}

export function ProcessSectionPreview({ section, index, language, navigate }: any) {
  switch (section.type) {
          // ── 1. HERO (pantalla completa centrado) ─────────────────────────
          case 'hero':
            return (
              <div key={section.id} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${section.content.backgroundImage}')` }}
                >
                  <div className="absolute inset-0 bg-[#1C5D15]/88" />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
                  <div className="inline-block px-5 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full font-bold text-sm uppercase tracking-wider mb-6">
                    {section.content.badge || 'Procesos Industriales'}
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    {section.content.title}
                  </h1>
                  <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed">
                    {section.content.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {section.content.ctaText && (
                      <button
                        onClick={() => handleAction(section.content.ctaType, section.content.ctaLink || '#process-steps', navigate)}
                        className="inline-block px-8 py-3 bg-[#19FF00] text-[#1C5D15] font-bold rounded-full hover:bg-white hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl uppercase tracking-wider text-sm"
                      >
                        {section.content.ctaText}
                      </button>
                    )}
                    {section.content.secondaryCtaText && (
                      <button
                        onClick={() => handleAction(section.content.secondaryCtaType, section.content.secondaryCtaLink || '/store', navigate)}
                        className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 uppercase tracking-wider text-sm"
                      >
                        {section.content.secondaryCtaText}
                      </button>
                    )}
                  </div>
                </div>
                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
                  <ChevronDown className="w-8 h-8" />
                </div>
              </div>
            );

          // ── 2. PROBLEM POINTS (Los retos de su industria) ─────────────────
          case 'problems':
            return (
              <section key={section.id} className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-red-200">
                      ⚠ {section.content.badge || 'El Problema'}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && (
                      <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.content.items?.map((item: any, index: number) => (
                      <div key={index} className="bg-white border-l-4 border-red-400 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                          <Icon name={item.icon} className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1C5D15] mb-2">{item.title}</h3>
                        <p className="text-[#629960] text-sm leading-relaxed">{item.description}</p>
                        {item.stat && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-2xl font-black text-red-500">{item.stat}</span>
                            <span className="text-xs text-[#629960] ml-2">{item.statLabel}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 3. PROCESS STEPS (Pasos alternados izq/der) ───────────────────
          case 'features':
            return (
              <section key={section.id} id="process-steps" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-20">
                    <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full font-bold text-sm uppercase tracking-wider mb-4">
                      {section.content.badge || 'Nuestro Proceso'}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && (
                      <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>
                    )}
                  </div>
                  <div className="space-y-24">
                    {section.content.items?.map((step: any, index: number) => {
                      const isEven = index % 2 === 0;
                      return (
                        <div
                          key={index}
                          className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                        >
                          {/* Text Side */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 bg-[#1C5D15] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                                <Icon name={step.icon} className="w-8 h-8 text-[#19FF00]" />
                              </div>
                              <div>
                                <div className="text-xs text-[#629960] uppercase tracking-widest font-bold">Etapa {String(index + 1).padStart(2, '0')}</div>
                                <h3 className="text-2xl md:text-3xl font-bold text-[#1C5D15]">{step.title}</h3>
                              </div>
                            </div>
                            <p className="text-lg text-[#629960] mb-6 leading-relaxed">{step.description}</p>
                            {step.details && step.details.length > 0 && (
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {step.details.map((detail: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-[#629960] text-sm">
                                    <CheckCircle className="w-4 h-4 text-[#19FF00] shrink-0 mt-0.5" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {step.duration && (
                              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#629960]/10 rounded-full text-sm text-[#629960] font-medium">
                                ⏱ Duración estimada: <strong className="text-[#1C5D15]">{step.duration}</strong>
                              </div>
                            )}
                          </div>

                          {/* Visual Side */}
                          <div className="flex-1">
                            <div className={`w-full h-72 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center relative shadow-2xl`}>
                              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <Icon name={step.icon} className="w-64 h-64 text-white" />
                              </div>
                              <div className="relative z-10 text-center text-white p-8">
                                <div className="text-7xl font-black text-[#19FF00]/40 mb-2">{String(index + 1).padStart(2, '0')}</div>
                                <div className="text-2xl font-bold">{step.title}</div>
                                {step.result && (
                                  <div className="mt-4 px-4 py-2 bg-[#19FF00]/20 rounded-xl border border-[#19FF00]/30 text-[#19FF00] font-bold text-sm">
                                    ✓ {step.result}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          // ── 4. SECTORES (Industrias que Servimos) ─────────────────────────
          case 'sectors':
            return (
              <section key={section.id} className="py-20 bg-[#1C5D15]">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{section.content.title}</h2>
                    {section.content.subtitle && (
                      <p className="text-xl text-white/80 max-w-3xl mx-auto">{section.content.subtitle}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {section.content.items?.map((item: any, index: number) => (
                      <div key={index} className="group bg-white/10 rounded-2xl p-6 text-center transition-all duration-300 border border-white/10 hover:border-[#19FF00] hover:shadow-2xl hover:shadow-[#19FF00]/20 hover:-translate-y-1 cursor-default">
                        <div className="flex items-center justify-center w-14 h-14 bg-[#19FF00]/20 group-hover:bg-[#1C5D15]/20 rounded-xl mx-auto mb-4 transition-colors">
                          <Icon name={item.icon} className="w-7 h-7 text-[#19FF00] group-hover:text-[#1C5D15]" />
                        </div>
                        <h3 className="font-bold text-white group-hover:text-[#1C5D15] mb-1 transition-colors">{item.title}</h3>
                        {item.description && (
                          <p className="text-white/60 group-hover:text-[#1C5D15]/70 text-xs leading-relaxed transition-colors">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 5. TIMELINE FASE (proceso horizontal con flechas) ─────────────
          case 'timeline':
            return (
              <section key={section.id} className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-[#629960]">{section.content.subtitle}</p>}
                  </div>
                  {/* Grid de 5 columnas en desktop, 1 en móvil */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {section.content.milestones?.map((item: any, index: number) => (
                      <div key={index} className="relative">
                        <div className="text-center bg-white p-5 rounded-2xl shadow-lg border-2 border-[#629960]/20 hover:border-[#19FF00] transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col items-center">
                          <div className="w-10 h-10 bg-[#1C5D15] text-[#19FF00] rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3 group-hover:bg-[#19FF00] group-hover:text-[#1C5D15] transition-colors shrink-0">
                            {index + 1}
                          </div>
                          <div className="text-base font-bold text-[#1C5D15] mb-1">{item.phase}</div>
                          <div className="text-[#629960] text-xs font-semibold uppercase tracking-wide mb-2">{item.time}</div>
                          {item.desc && <p className="text-[#629960] text-xs leading-relaxed">{item.desc}</p>}
                        </div>
                        {/* Flecha entre cajas en desktop */}
                        {index < (section.content.milestones?.length - 1) && (
                          <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 items-center justify-center">
                            <span className="text-[#19FF00] font-black text-lg">›</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 6. STATS ─────────────────────────────────────────────────────
          case 'stats':
            return (
              <section key={section.id} className="py-20 bg-gradient-to-br from-[#1C5D15] to-[#0d3a0a] text-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-white/80 max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {section.content.stats?.map((stat: any, index: number) => (
                      <div key={index} className="text-center group">
                        <div className="text-4xl md:text-5xl font-black text-[#19FF00] mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                        <div className="text-white font-bold text-sm uppercase tracking-wider">{stat.label}</div>
                        {stat.description && <p className="text-white/60 text-xs mt-2">{stat.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 7. CERTIFICATIONS ────────────────────────────────────────────
          case 'certifications':
            return (
              <section key={section.id} className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {section.content.items?.map((item: any, index: number) => (
                      <div key={index} className="text-center p-8 bg-gradient-to-b from-[#629960]/5 to-white border-2 border-[#629960]/15 rounded-2xl hover:border-[#19FF00] hover:shadow-xl transition-all duration-300 group">
                        <div className="text-4xl font-black text-[#19FF00] mb-3 group-hover:scale-110 transition-transform duration-300">{item.acronym}</div>
                        <h3 className="text-lg font-bold text-[#1C5D15] mb-2">{item.name}</h3>
                        <p className="text-[#629960] text-sm leading-relaxed">{item.description}</p>
                        {item.year && <div className="mt-3 text-xs text-[#629960]/60">Obtenida: {item.year}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 8. QUOTE ──────────────────────────────────────────────────────
          case 'quote':
            return (
              <section key={section.id} className="py-24 bg-[#629960]/5 overflow-hidden">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                    {section.content.image && (
                      <div className="w-44 h-44 md:w-56 md:h-56 shrink-0 relative">
                        <div className="absolute inset-0 bg-[#19FF00] rounded-full rotate-6 opacity-20" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#1C5D15]/10 shadow-2xl">
                          <img src={section.content.image} alt={section.content.author} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 relative">
                      <Quote className="absolute -top-8 -left-4 w-14 h-14 text-[#19FF00] opacity-15" />
                      <blockquote className="relative z-10">
                        <p className="text-xl md:text-3xl font-serif italic text-[#1C5D15] leading-snug mb-6">
                          "{section.content.quote}"
                        </p>
                        <footer className="flex items-center gap-4">
                          <div className="h-px w-12 bg-[#19FF00]" />
                          <div>
                            <div className="text-lg font-bold text-[#1C5D15]">{section.content.author}</div>
                            {section.content.role && <div className="text-sm text-[#629960] uppercase tracking-widest">{section.content.role}</div>}
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </section>
            );

          // ── 9. FAQ ────────────────────────────────────────────────────────
          case 'faq':
            return (
              <section key={section.id} className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-[#629960]">{section.content.subtitle}</p>}
                  </div>
                  <div className="space-y-4">
                    {section.content.items?.map((item: any, index: number) => (
                      <FaqItem key={index} item={item} />
                    ))}
                  </div>
                  {section.content.ctaText && (
                    <div className="text-center mt-12">
                      <button
                        onClick={() => handleAction(section.content.ctaType, section.content.ctaLink || '/#contact', navigate)}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#1C5D15] text-white rounded-full font-bold hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg uppercase text-sm tracking-wider"
                      >
                        {section.content.ctaText}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            );

          // ── 10. CTA FINAL ────────────────────────────────────────────────
          case 'cta':
            return (
              <section key={section.id} className="py-24 bg-[#1C5D15] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-96 h-96 bg-[#19FF00] rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#19FF00] rounded-full translate-x-1/2 translate-y-1/2" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                  {section.content.icon ? (
                    <div className="flex justify-center mb-6">
                      <Icon name={section.content.icon} className="w-16 h-16 text-[#19FF00]" />
                    </div>
                  ) : (
                    <div className="text-5xl mb-6">{section.content.emoji || '🚀'}</div>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">{section.content.title}</h2>
                  <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">{section.content.subtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleAction(section.content.ctaType, section.content.ctaLink || '/#contact', navigate)}
                      className="inline-block px-10 py-4 bg-[#19FF00] text-[#1C5D15] font-bold rounded-full hover:bg-white hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-[#19FF00]/30 uppercase tracking-wider text-sm"
                    >
                      {section.content.ctaText}
                    </button>
                    {section.content.secondaryCtaText && (
                      <button
                        onClick={() => handleAction(section.content.secondaryCtaType, section.content.secondaryCtaLink || '/store', navigate)}
                        className="inline-block px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 uppercase tracking-wider text-sm"
                      >
                        {section.content.secondaryCtaText}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            );

          default:
            return (
              <DynamicSection
                key={section.id}
                section={section}
                language={language}
                index={index}
              />
            );
        }
}
