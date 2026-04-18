import { useState, useEffect, useRef } from 'react';
import { Section } from '../data/supabase';
import { Hero } from './Hero';
import { TrustBar } from './TrustBar';
import { Purpose } from './Purpose';
import { FeaturedProduct } from './FeaturedProduct';
import { Products } from './Products';
import { Timeline } from './Timeline';
import { Leadership } from './Leadership';
import { Ecosystem } from './Ecosystem';
import { NewsSection } from './NewsSection';
import { StatsCards } from './StatsCards';
import { FlipCards } from './FlipCards';
import { HeroBlog } from './HeroBlog';
import { BlogPostsSection } from './BlogPostsSection';
import { useNavigate } from 'react-router';
import { handleAction } from '../utils/actions';
import { Button } from './ui/button';

// ══════════════════════════════════════════════════════════════
// RENDERIZADOR UNIVERSAL DE SECCIONES
// Cualquier sección creada desde el Editor Visual se renderiza 
// automáticamente en TODAS las páginas públicas.
// ══════════════════════════════════════════════════════════════

// Wrapper para Lazy Loading: solo carga cuando está por entrar en pantalla
function LazySectionWrapper({ children, sectionType, forceVisible }: { children: React.ReactNode, sectionType: string, forceVisible: boolean }) {
  // Siempre forzamos hero o lo visible. Para el resto, inicia falso.
  const [isVisible, setIsVisible] = useState(forceVisible || sectionType === 'hero');
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        if (domRef.current) observer.unobserve(domRef.current);
      }
    }, { rootMargin: '800px 0px' }); // Cargar 800px ANTES de que aparezca

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  if (!isVisible) {
    // Placeholder mínimo esperando lazy load
    return <div ref={domRef} className="w-full min-h-[300px] flex items-center justify-center opacity-0"><span className="hidden">Loading {sectionType}...</span></div>;
  }

  return <>{children}</>;
}


interface DynamicSectionProps {
  section: Section;
  products?: any[];
  language?: string;
  index?: number;
}

export function DynamicSection({ section, products = [], language = 'es', index = 0 }: DynamicSectionProps) {
  const navigate = useNavigate();
  if (!section.visible) return null;

  // Renderizar la seccion por tipo
  const renderSectionContent = () => {
    switch (section.type) {
    // ── HERO ─────────────────────────────────────
    case 'hero':
      return (
        <div key={section.id}>
          <Hero content={section.content} />
        </div>
      );

    // ── TRUST BAR ────────────────────────────────
    case 'trust':
      return (
        <div key={section.id}>
          <TrustBar 
            partners={section.content.partners || []} 
            title={section.content.title} 
            subtitle={section.content.subtitle} 
          />
        </div>
      );

    // ── FEATURES / PURPOSE ──────────────────────
    case 'features':
      return (
        <div key={section.id}>
          <Purpose purposes={section.content.items} />
        </div>
      );

    // ── FEATURED PRODUCT ────────────────────────
    case 'featured':
      return (
        <div key={section.id}>
          <FeaturedProduct content={section.content} />
        </div>
      );

    // ── PRODUCTS ─────────────────────────────────
    case 'products':
      {
        const selectedIds = section.content.selectedProductIds || [];
        const displayProducts = selectedIds.length > 0
          ? products.filter(p => selectedIds.includes(p.id))
          : products.filter(p => p.featured).slice(0, 3);

        return (
          <div key={section.id}>
            <Products
              products={displayProducts}
              title={section.content.title}
              subtitle={section.content.subtitle}
              ctaText={section.content.ctaText}
              ctaLink={section.content.ctaLink}
              ctaActionType={section.content.ctaActionType}
              sectionId={section.id}
            />
          </div>
        );
      }

    // ── TIMELINE ─────────────────────────────────
    case 'timeline':
      return (
        <div key={section.id} id={section.id}>
          <Timeline 
            milestones={section.content.milestones}
            title={section.content.title}
            subtitle={section.content.subtitle}
            description={section.content.description}
          />
        </div>
      );

    // ── TEAM / LEADERSHIP ───────────────────────
    case 'team':
      return (
        <div key={section.id}>
          <Leadership
            members={section.content.members}
            title={section.content.title}
            subtitle={section.content.subtitle}
          />
        </div>
      );

    // ── ECOSYSTEM ────────────────────────────────
    case 'ecosystem':
      return (
        <div key={section.id} id={section.id}>
          <div id="allies">
            <Ecosystem 
              title={section.content.title} 
              subtitle={section.content.subtitle} 
              items={section.content.items}
              sectionId={section.id}
            />
          </div>
        </div>
      );

    // ── NEWS ─────────────────────────────────────
    case 'news':
      return (
        <div key={section.id} id={section.id}>
          <NewsSection 
            title={section.content.title} 
            subtitle={section.content.subtitle}
            ctaText={section.content.ctaText}
            ctaLink={section.content.ctaLink}
            ctaActionType={section.content.ctaActionType}
          />
        </div>
      );

    // ── STATS ────────────────────────────────────
    case 'stats':
      return (
        <div key={section.id} id={section.id}>
          <StatsCards
            title={section.content.title}
            subtitle={section.content.subtitle}
            stats={section.content.stats || []}
          />
        </div>
      );

    // ── TEXT BLOCK ────────────────────────────────
    case 'text':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-20 bg-[#F7F9CE]/30">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-black text-[#1C5D15] mb-8">{section.content.title}</h2>
              <div 
                className="text-lg text-[#629960] leading-loose"
                dangerouslySetInnerHTML={{ __html: section.content.text || section.content.subtitle || '' }}
              />
            </div>
          </section>
        </div>
      );

    // ── CTA ──────────────────────────────────────
    case 'cta':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-16 bg-[#1C5D15] text-white text-center">
            <div className="max-w-3xl mx-auto px-6">
              {section.content.title && <h2 className="text-3xl font-bold mb-3">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-white/80 text-lg mb-8">{section.content.subtitle}</p>}
              {section.content.ctaText && (
                <Button 
                  onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                  className="bg-[#19FF00] text-[#1C5D15] hover:bg-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                >
                  {section.content.ctaText}
                </Button>
              )}
            </div>
          </section>
        </div>
      );

    // ── FAQ ──────────────────────────────────────
    case 'faq':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              {section.content.title && (
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-[#1C5D15] mb-4">{section.content.title}</h2>
                  {section.content.subtitle && <p className="text-[#629960] text-lg">{section.content.subtitle}</p>}
                </div>
              )}
              <div className="space-y-4">
                {(section.content.items || []).map((item: any, i: number) => (
                  <details key={i} className="group border border-[#1C5D15]/10 rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-[#F7F9CE]/30 transition-colors">
                      <span className="font-bold text-[#1C5D15]">{item.question}</span>
                      <span className="text-[#19FF00] text-2xl group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="p-5 pt-0 text-[#629960] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      );

    // ── FLIPCARDS ────────────────────────────────
    case 'flipcards':
      return (
        <div key={section.id} id={section.id}>
          <FlipCards items={section.content.items || []} />
        </div>
      );

    // ── HERO BLOG ───────────────────────────────
    case 'hero-blog':
      return (
        <div key={section.id} id={section.id}>
          <HeroBlog content={section.content} />
        </div>
      );

    // ── BLOG POSTS ──────────────────────────────
    case 'blog-posts':
      return (
        <div key={section.id} id={section.id}>
          <BlogPostsSection
            posts={[]}
            language={language}
            activeFilter="all"
            onFilterChange={() => {}}
            totalPages={1}
          />
        </div>
      );

    // ── CATEGORY FILTER (Ecosystem Directory) ───
    case 'category-filter':
      // Este se renderiza normalmente por el componente de la página
      return null;

    // ── CLIENTES ─────────────────────────────────
    case 'clientes':
      return null; // Se maneja específicamente por cada página

    // ── BENTO GRID ──────────────────────────────
    case 'bento':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-16 bg-[#629960]/5">
            <div className="max-w-6xl mx-auto px-6">
              {section.content.title && (
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>
                  {section.content.subtitle && <p className="text-[#629960]">{section.content.subtitle}</p>}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(section.content.items || []).map((item: any, i: number) => (
                  <div key={i} className={`${item.size === 'large' ? 'md:col-span-2' : ''} bg-white rounded-2xl p-6 border-2 border-[#629960]/10 hover:border-[#19FF00] transition-all`}>
                    <h3 className="text-base font-bold text-[#1C5D15] mb-2">{item.title}</h3>
                    <div className="text-[#629960] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description || '' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );

    // ── QUOTE ────────────────────────────────────
    case 'quote':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-16 bg-[#F7F9CE]/50">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="text-6xl text-[#19FF00] mb-4">"</div>
              <blockquote className="text-2xl md:text-3xl font-bold text-[#1C5D15] italic leading-relaxed mb-6">
                {section.content.quote || section.content.title}
              </blockquote>
              {section.content.author && (
                <p className="text-[#629960] font-bold uppercase tracking-wider text-sm">— {section.content.author}</p>
              )}
            </div>
          </section>
        </div>
      );

    // ── SECTORS ──────────────────────────────────
    case 'sectors':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-16 bg-[#1C5D15] text-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
              {section.content.title && <h2 className="text-3xl font-bold mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-white/70 mb-10">{section.content.subtitle}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(section.content.items || []).map((item: any, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-[#19FF00] hover:text-[#1C5D15] transition-all group">
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    {item.description && <p className="text-xs mt-1 opacity-70">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );

    // ── PROBLEMS ─────────────────────────────────
    case 'problems':
      return (
        <div key={section.id} id={section.id}>
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 text-center">
              {section.content.title && <h2 className="text-3xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-[#629960] mb-10">{section.content.subtitle}</p>}
              <div className="grid md:grid-cols-3 gap-5">
                {(section.content.items || []).map((item: any, i: number) => (
                  <div key={i} className="bg-white border-l-4 border-red-400 rounded-xl p-5 text-left shadow-sm">
                    <h3 className="font-bold text-[#1C5D15] mb-1">{item.title}</h3>
                    <p className="text-[#629960] text-xs leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );

    // ── DEFAULT: Si no se reconoce, no rompe nada
    default:
      console.warn(`⚠️ Tipo de sección desconocido: "${section.type}" (id: ${section.id})`);
      return null;
  }
  };

  // Envolver el resultado de la seccion en el Lazy Loader.
  // Forzamos carga inmediata para: primeras 2 secciones, hero, ecosystem, news y products
  // porque tienen datos dinámicos que afectan la altura total de la página (scroll restoration)
  const shouldForceLoad = index < 2 || 
                        section.type === 'ecosystem' || 
                        section.type === 'news' || 
                        section.type === 'products';
  
  return (
    <div 
      id={section.id} 
      data-section-type={section.type}
      key={section.id} 
      style={{ scrollMarginTop: '80px' }}
    >
      <LazySectionWrapper sectionType={section.type} forceVisible={shouldForceLoad}>
        {renderSectionContent()}
      </LazySectionWrapper>
    </div>
  );
}
