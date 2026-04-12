import { Section } from '../../../data/supabase';
import { EditableBlock } from './EditableBlock';
import { useState } from 'react';

// Importar los mismos componentes que usa el Front-End real
import { Hero } from '../../Hero';
import { Purpose } from '../../Purpose';
import { FeaturedProduct } from '../../FeaturedProduct';
import { Timeline } from '../../Timeline';
import { Leadership } from '../../Leadership';
import { TrustBar } from '../../TrustBar';
import { Ecosystem } from '../../Ecosystem';
import { NewsSection } from '../../NewsSection';
import { Products } from '../../Products';
import {
  ChevronDown, ChevronUp, Quote, CheckCircle,
  FlaskConical, Globe, Star, Zap, Microscope,
  Atom, Shield, Leaf, Factory, TrendingUp,
  AlertTriangle, Sprout, Building2, Fish,
  Apple, HeartPulse, Shirt, Warehouse
} from 'lucide-react';

// Mapa global de iconos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FlaskConical, Globe, Star, Zap, Microscope, Atom, Shield, Leaf, Factory,
  TrendingUp, AlertTriangle, CheckCircle, Sprout, Building2, Fish,
  Apple, HeartPulse, Shirt, Warehouse
};
function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICON_MAP[name] || FlaskConical;
  return <C className={className} />;
}

// FAQ collapsible para preview
function FaqPreviewItem({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#629960]/20 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-[#629960]/5 transition-colors">
        <span className="font-bold text-[#1C5D15] text-sm">{item.question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#629960] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#629960] shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1 bg-[#629960]/5 text-[#629960] text-sm leading-relaxed">{item.answer}</div>}
    </div>
  );
}

interface VisualEditorPreviewProps {
  sections: Section[];
  activeSectionId: string | null;
  onSectionClick: (id: string) => void;
  availableProducts?: any[];
}

export function VisualEditorPreview({ sections, activeSectionId, onSectionClick, availableProducts = [] }: VisualEditorPreviewProps) {

  const renderSectionComponent = (section: Section) => {
    switch (section.type) {

      // ── Componentes existentes ───────────────────────────────────────────
      case 'hero':
        return <Hero content={section.content} />;

      case 'trust':
        return <TrustBar partners={section.content.partners || []} />;

      case 'features':
        // Si tiene contenido de proceso, renderiza el layout alternado igual que en Process.tsx
        if (section.content.badge || section.content.items?.[0]?.details || section.content.items?.[0]?.duration || section.content.items?.[0]?.result) {
          return (
            <section className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-20">
                  {section.content.badge && (
                    <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full font-bold text-sm uppercase tracking-wider mb-4">
                      {section.content.badge}
                    </div>
                  )}
                  {section.content.title && <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>}
                  {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                </div>
                <div className="space-y-24">
                  {section.content.items?.map((step: any, index: number) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-[#1C5D15] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                              <Icon name={step.icon || 'FlaskConical'} className="w-8 h-8 text-[#19FF00]" />
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

                        <div className="flex-1">
                          <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center relative shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                              <Icon name={step.icon || 'FlaskConical'} className="w-64 h-64 text-white" />
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
        }
        // Fallback: Purpose normal (Home)
        return <Purpose purposes={section.content.items || []} />;

      case 'featured':
        return <FeaturedProduct content={section.content} />;

      case 'products':
        const selectedIds = section.content.selectedProductIds || [];
        const filteredProducts = selectedIds.length > 0
          ? availableProducts.filter(p => selectedIds.includes(p.id))
          : availableProducts.filter(p => p.featured);
        return (
          <Products
            title={section.content.title || ''}
            subtitle={section.content.subtitle || ''}
            products={filteredProducts}
          />
        );

      case 'timeline':
        if (section.content.milestones?.[0]?.step !== undefined) {
          return (
            <section className="py-20 bg-gray-50">
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
        }

        if (section.content.milestones?.[0]?.phase !== undefined) {
          return (
            <section className="py-20 bg-gray-50">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>
                  {section.content.subtitle && <p className="text-xl text-[#629960]">{section.content.subtitle}</p>}
                </div>
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
        }

        return (
          <Timeline
            milestones={section.content.milestones || []}
            title={section.content.title}
            subtitle={section.content.subtitle}
            description={section.content.description}
          />
        );

      case 'history':
        return (
          <Timeline
            milestones={section.content.milestones || []}
            title={section.content.title}
            subtitle={section.content.subtitle}
            description={section.content.description}
          />
        );

      case 'team':
        return (
          <Leadership
            members={section.content.members || []}
            title={section.content.title || ''}
            subtitle={section.content.subtitle || ''}
          />
        );

      case 'ecosystem':
        return (
          <Ecosystem
            title={section.content.title}
            subtitle={section.content.subtitle}
            items={section.content.items}
          />
        );

      case 'news':
        return (
          <NewsSection
            title={section.content.title}
            subtitle={section.content.subtitle}
            ctaText={section.content.ctaText}
            ctaLink={section.content.ctaLink}
            isEditor={true}
          />
        );

      // ── Nuevos tipos (Technology / Process) ─────────────────────────────

      case 'stats':
        return (
          <section className="py-16 bg-gradient-to-br from-[#1C5D15] to-[#0d3a0a] text-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
              {section.content.title && <h2 className="text-3xl font-bold text-white mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-white/80 mb-10">{section.content.subtitle}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {section.content.stats?.map((stat: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black text-[#19FF00] mb-1">{stat.value}</div>
                    <div className="text-white/90 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
                    {stat.description && <p className="text-white/60 text-xs mt-1">{stat.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'bento':
        return (
          <section className="py-16 bg-[#629960]/5">
            <div className="max-w-6xl mx-auto px-6">
              {section.content.title && (
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>
                  {section.content.subtitle && <p className="text-[#629960]">{section.content.subtitle}</p>}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.items?.map((item: any, i: number) => (
                  <div key={i} className={`${item.size === 'large' ? 'md:col-span-2' : ''} bg-white rounded-2xl p-6 border-2 border-[#629960]/10 hover:border-[#19FF00] transition-all`}>
                    <div className="w-10 h-10 bg-[#19FF00]/20 rounded-xl flex items-center justify-center mb-3">
                      <Icon name={item.icon} className="w-5 h-5 text-[#1C5D15]" />
                    </div>
                    <h3 className="text-base font-bold text-[#1C5D15] mb-2">{item.title}</h3>
                    <p className="text-[#629960] text-sm leading-relaxed">{item.description}</p>
                    {item.details?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {item.details.map((d: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1 text-xs text-[#629960]">
                            <span className="text-[#19FF00] font-bold">✓</span>{d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'quote':
        return (
          <section className="py-16 bg-[#629960]/5">
            <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
              {section.content.image && (
                <div className="w-40 h-40 shrink-0 rounded-full overflow-hidden border-4 border-[#1C5D15]/10 shadow-xl">
                  <img src={section.content.image} alt={section.content.author} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <Quote className="w-10 h-10 text-[#19FF00] opacity-30 mb-3" />
                <blockquote className="text-xl italic text-[#1C5D15] leading-snug mb-4">"{section.content.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#19FF00]" />
                  <div>
                    <div className="font-bold text-[#1C5D15]">{section.content.author}</div>
                    {section.content.role && <div className="text-xs text-[#629960] uppercase tracking-widest">{section.content.role}</div>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'faq':
        return (
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              {section.content.title && <h2 className="text-3xl font-bold text-[#1C5D15] text-center mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-[#629960] text-center mb-10">{section.content.subtitle}</p>}
              <div className="space-y-3">
                {section.content.items?.map((item: any, i: number) => (
                  <FaqPreviewItem key={i} item={item} />
                ))}
              </div>
            </div>
          </section>
        );

      case 'certifications':
        return (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
              {section.content.title && <h2 className="text-3xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-[#629960] mb-10 max-w-2xl mx-auto">{section.content.subtitle}</p>}
              <div className="grid md:grid-cols-3 gap-5">
                {section.content.items?.map((item: any, i: number) => (
                  <div key={i} className="p-6 bg-[#629960]/5 border-2 border-[#629960]/15 rounded-2xl hover:border-[#19FF00] transition-all">
                    <div className="text-3xl font-black text-[#19FF00] mb-2">{item.acronym}</div>
                    <h3 className="font-bold text-[#1C5D15] mb-1">{item.name}</h3>
                    <p className="text-[#629960] text-xs leading-relaxed">{item.description}</p>
                    {item.year && <div className="mt-2 text-xs text-[#629960]/50">Obtenida: {item.year}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'sectors':
        return (
          <section className="py-16 bg-[#1C5D15]">
            <div className="max-w-6xl mx-auto px-6 text-center">
              {section.content.title && <h2 className="text-3xl font-bold text-white mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-white/80 mb-10">{section.content.subtitle}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.content.items?.map((item: any, i: number) => (
                  <div key={i} className="bg-white/10 hover:bg-[#19FF00] rounded-xl p-4 text-center transition-all group">
                    <div className="w-10 h-10 mx-auto mb-2 bg-[#19FF00]/20 group-hover:bg-[#1C5D15]/20 rounded-lg flex items-center justify-center">
                      <Icon name={item.icon} className="w-5 h-5 text-[#19FF00] group-hover:text-[#1C5D15]" />
                    </div>
                    <div className="text-white group-hover:text-[#1C5D15] font-bold text-sm">{item.title}</div>
                    {item.description && <p className="text-white/60 group-hover:text-[#1C5D15]/70 text-xs mt-1">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'problems':
        return (
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 text-center">
              {section.content.title && <h2 className="text-3xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-[#629960] mb-10">{section.content.subtitle}</p>}
              <div className="grid md:grid-cols-3 gap-5">
                {section.content.items?.map((item: any, i: number) => (
                  <div key={i} className="bg-white border-l-4 border-red-400 rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-3">
                      <Icon name={item.icon} className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="font-bold text-[#1C5D15] mb-1">{item.title}</h3>
                    <p className="text-[#629960] text-xs leading-relaxed">{item.description}</p>
                    {item.stat && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xl font-black text-red-500">{item.stat}</span>
                        <span className="text-xs text-[#629960] ml-2">{item.statLabel}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className="py-16 bg-[#1C5D15] text-white text-center">
            <div className="max-w-3xl mx-auto px-6">
              {section.content.icon ? (
                <div className="flex items-center justify-center mb-6">
                  <Icon name={section.content.icon} className="w-16 h-16 text-[#19FF00]" />
                </div>
              ) : section.content.emoji ? (
                <div className="text-5xl mb-4">{section.content.emoji}</div>
              ) : null}
              {section.content.title && <h2 className="text-3xl font-bold mb-3">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-white/80 text-lg mb-8">{section.content.subtitle}</p>}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {section.content.ctaText && (
                  <span className="px-8 py-3 bg-[#19FF00] text-[#1C5D15] font-bold rounded-full text-sm uppercase tracking-wider">
                    {section.content.ctaText}
                  </span>
                )}
                {section.content.secondaryCtaText && (
                  <span className="px-8 py-3 border-2 border-white text-white font-bold rounded-full text-sm uppercase tracking-wider">
                    {section.content.secondaryCtaText}
                  </span>
                )}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <div className="py-20 text-center bg-[#1C5D15]/5">
            <h2 className="text-3xl text-[#1C5D15] font-bold mb-2">📧 Sección de Contacto</h2>
            <p className="text-[#629960]">Se carga automáticamente desde la configuración del footer.</p>
          </div>
        );

      default:
        return (
          <div className="py-16 text-center bg-gray-50 border-2 border-dashed border-gray-300">
            <h2 className="text-xl text-gray-500 font-bold mb-2 uppercase">{section.type}</h2>
            <p className="text-gray-400 text-sm">Vista previa no disponible para este tipo de sección.</p>
          </div>
        );
    }
  };

  const visibleSections = sections.filter(s => s.visible !== false && s.type !== 'contact');

  return (
    <div className="w-full flex-1 h-full min-h-screen bg-white">
      {visibleSections.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400 py-40">
          <div className="text-center">
            <p className="text-2xl mb-2">📄</p>
            <p className="font-medium">Esta página no tiene secciones visibles.</p>
            <p className="text-sm mt-1">Usa el editor clásico para agregar secciones.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {visibleSections.map((section) => (
            <EditableBlock
              key={section.id}
              sectionId={section.id}
              activeSectionId={activeSectionId}
              onClick={onSectionClick}
              label={section.type.toUpperCase()}
            >
              {renderSectionComponent(section)}
            </EditableBlock>
          ))}
        </div>
      )}
    </div>
  );
}
