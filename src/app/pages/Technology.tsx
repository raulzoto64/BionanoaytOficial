import { useEffect, useState } from "react";
import { PageContent, Section, supabaseAPI } from "../data/supabase";
import { DynamicSection } from "../components/DynamicSection";
import { Hero } from "../components/Hero";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { 
  Microscope, Atom, Shield, Leaf, TrendingUp, 
  ChevronDown, ChevronUp, Quote, BarChart3, Zap,
  FlaskConical, Globe, Star, Check
} from "lucide-react";
import { useState as useLocalState } from "react";
import { Leadership } from "../components/Leadership";
import { Timeline } from "../components/Timeline";

// Mapa de iconos disponibles
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Microscope, Atom, Shield, Leaf, TrendingUp, FlaskConical, Globe, Star, Zap, Check, BarChart3
};

// ── Componente FAQ inline ──────────────────────────────────────────────────
function FaqItem({ item }: { item: { question: string; answer: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#629960]/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#629960]/5 transition-colors"
      >
        <span className="font-bold text-[#1C5D15] text-lg">{item.question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#629960] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#629960] shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-[#629960]/5 text-[#629960] leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function Technology() {
  const { language } = useLanguage();
  const [pageContent, setPageContent] = useState<PageContent | null>(() => 
    supabaseAPI.getCachedData(`page-content-page-technology-${language}`)
  );

  useEffect(() => {
    loadPageContent();
  }, [language]);

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent('page-technology', language);
      setPageContent(content);
      supabaseAPI._saveToCache(`page-content-page-technology-${language}`, content);
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

        switch (section.type) {
          // ── HERO ──────────────────────────────────────────────────────────
          case 'hero':
            return (
              <div key={section.id}>
                <Hero content={section.content} />
              </div>
            );

          // ── FEATURES / TECH CARDS ─────────────────────────────────────────
          case 'features':
            return (
              <section key={section.id} className="py-20 bg-white">
                {section.content.title && (
                  <div className="max-w-6xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                )}
                <div className="max-w-6xl mx-auto px-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {section.content.items?.map((item: any, index: number) => {
                      const IconComponent = ICON_MAP[item.icon];
                      return (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-[#629960]/20 hover:border-[#19FF00] transition-all duration-300 hover:shadow-xl group"
                        >
                          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#19FF00] rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                            {IconComponent ? <IconComponent className="w-7 h-7 text-[#1C5D15]" /> : <span className="text-[#1C5D15] font-bold">{item.icon}</span>}
                          </div>
                          <h3 className="text-2xl font-bold text-[#1C5D15] mb-4">{item.title}</h3>
                          <p className="text-[#629960] mb-6 leading-relaxed">{item.description}</p>
                          {item.details && item.details.length > 0 && (
                            <ul className="space-y-2">
                              {item.details.map((detail: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-[#629960] text-sm">
                                  <span className="text-[#19FF00] font-bold mt-0.5 shrink-0">✓</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          // ── STATS ─────────────────────────────────────────────────────────
          case 'stats':
            return (
              <section key={section.id} className="py-20 bg-[#1C5D15] text-white">
                <div className="max-w-6xl mx-auto px-6">
                  {section.content.title && (
                    <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{section.content.title}</h2>
                      {section.content.subtitle && <p className="text-xl text-white/80 max-w-3xl mx-auto">{section.content.subtitle}</p>}
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {section.content.stats?.map((stat: any, index: number) => (
                      <div key={index} className="text-center group">
                        <div className="text-4xl md:text-5xl font-black text-[#19FF00] mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                        <div className="text-white/80 text-sm uppercase tracking-wider font-medium">{stat.label}</div>
                        {stat.description && <p className="text-white/60 text-xs mt-2">{stat.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── FAQ ───────────────────────────────────────────────────────────
          case 'faq':
            return (
              <section key={section.id} className="py-20 bg-[#629960]/5">
                <div className="max-w-4xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">
                      {section.content.title}
                    </h2>
                    {section.content.subtitle && (
                      <p className="text-xl text-[#629960]">{section.content.subtitle}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    {section.content.items?.map((item: any, index: number) => (
                      <FaqItem key={index} item={item} />
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── QUOTE ─────────────────────────────────────────────────────────
          case 'quote':
            return (
              <section key={section.id} className="py-24 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    {section.content.image && (
                      <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative">
                        <div className="absolute inset-0 bg-[#19FF00] rounded-full rotate-6 opacity-20" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#1C5D15]/10 shadow-2xl">
                          <img src={section.content.image} alt={section.content.author} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 relative">
                      <Quote className="absolute -top-10 -left-6 w-16 h-16 text-[#19FF00] opacity-10" />
                      <blockquote className="relative z-10">
                        <p className="text-2xl md:text-4xl font-serif italic text-[#1C5D15] leading-snug mb-8">
                          "{section.content.quote}"
                        </p>
                        <footer className="flex items-center gap-4">
                          <div className="h-px w-12 bg-[#19FF00]" />
                          <div>
                            <div className="text-xl font-bold text-[#1C5D15]">{section.content.author}</div>
                            {section.content.role && (
                              <div className="text-sm font-medium text-[#629960] uppercase tracking-widest">{section.content.role}</div>
                            )}
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </section>
            );

          // ── BENTO GRID ────────────────────────────────────────────────────
          case 'bento':
            return (
              <section key={section.id} className="py-20 bg-[#629960]/5">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
                    {section.content.items?.map((item: any, index: number) => {
                      const IconComponent = ICON_MAP[item.icon];
                      const isLarge = item.size === 'large';
                      return (
                        <div
                          key={index}
                          className={`${isLarge ? 'md:col-span-2' : ''} bg-white rounded-2xl p-8 border-2 border-[#629960]/10 hover:border-[#19FF00] hover:shadow-xl transition-all duration-300 group`}
                        >
                          {IconComponent && (
                            <div className="w-12 h-12 bg-[#19FF00]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#19FF00] transition-colors">
                              <IconComponent className="w-6 h-6 text-[#1C5D15]" />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-[#1C5D15] mb-3">{item.title}</h3>
                          <p className="text-[#629960] leading-relaxed">{item.description}</p>
                          {item.details && item.details.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {item.details.map((d: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[#629960]">
                                  <span className="text-[#19FF00] font-bold shrink-0">✓</span>{d}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          // ── HISTORY (Timeline carousel) ────────────────────────────────────
          case 'history':
            return (
              <Timeline
                key={section.id}
                milestones={section.content.milestones}
                title={section.content.title}
                subtitle={section.content.subtitle}
                description={section.content.description}
              />
            );

          // ── TEAM ──────────────────────────────────────────────────────────
          case 'team':
            return (
              <Leadership
                key={section.id}
                members={section.content.members}
                title={section.content.title}
                subtitle={section.content.subtitle}
              />
            );

          // ── TIMELINE (Proceso circular) ────────────────────────────────────
          case 'timeline':
            return (
              <section key={section.id} className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-xl text-[#629960]">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid md:grid-cols-4 gap-6">
                    {section.content.milestones?.map((item: any, index: number) => (
                      <div key={index} className="text-center group">
                        <div className="w-20 h-20 bg-[#1C5D15] text-[#19FF00] rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:bg-[#19FF00] group-hover:text-[#1C5D15] transition-all duration-300">
                          {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-[#1C5D15] mb-2">{item.title}</h3>
                        <p className="text-[#629960] text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
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
      })}

      {/* CTA Section */}
      <section className="py-20 bg-[#1C5D15] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Interesado en conocer más?</h2>
          <p className="text-xl text-[#F7F9CE] mb-8">
            Contáctanos para recibir información técnica detallada de nuestros productos
          </p>
          <a
            href="/#contact"
            className="inline-block px-8 py-3 bg-[#19FF00] text-[#1C5D15] rounded-full hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-[#19FF00]/20 font-bold uppercase tracking-wider text-base"
          >
            Contactar a nuestro equipo
          </a>
        </div>
      </section>
    </div>
  );
}
