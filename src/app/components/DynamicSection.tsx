import { useState, useEffect, useRef } from 'react';
import { Section, supabaseAPI } from '../data/supabase';
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
import {
  Quote,
  Shield,
  CheckCircle2,
  Users,
  Cloud,
  Zap,
  Sprout,
  Globe,
  Clock,
  FileText,
  AlertCircle,
  Truck,
  Building,
  Factory,
  FlaskConical,
  Microscope,
  TrendingUp,
  AlertTriangle,
  Building2,
  Fish,
  Apple,
  HeartPulse,
  Shirt,
  Warehouse,
} from 'lucide-react';

// Mapeo de nombres de iconos a componentes
const IconMap: Record<string, any> = {
  Quote,
  Shield,
  CheckCircle2,
  Users,
  Cloud,
  Zap,
  Sprout,
  Globe,
  Clock,
  FileText,
  AlertCircle,
  Truck,
  Building,
  Factory,
  FlaskConical,
  Microscope,
  TrendingUp,
  AlertTriangle,
  Building2,
  Fish,
  Apple,
  HeartPulse,
  Shirt,
  Warehouse
};

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const IconComp = IconMap[name] || Globe;
  return <IconComp className={className} />;
};

function FaqPreviewItem({ item }: { item: any }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-bold text-[#1C5D15] flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-[#19FF00] rounded-full" />
        {item.question}
      </h3>
      <div
        className="mt-2 text-sm text-[#629960] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: item.answer }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RENDERIZADOR UNIVERSAL DE SECCIONES
// Cualquier sección creada desde el Editor Visual se renderiza 
// automáticamente en TODAS las páginas públicas.
// ══════════════════════════════════════════════════════════════

// Wrapper para Lazy Loading: solo carga cuando está por entrar en pantalla
function LazySectionWrapper({ children, sectionType, forceVisible, isEditor }: { children: React.ReactNode | (() => React.ReactNode), sectionType: string, forceVisible: boolean, isEditor?: boolean }) {
  // Siempre forzamos hero o lo visible. Para el resto, inicia falso.
  // En el editor SIEMPRE es visible para evitar parpadeos y lag al editar props
  const [isVisible, setIsVisible] = useState(isEditor || forceVisible || sectionType === 'hero');
  const domRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        if (domRef.current) observer.unobserve(domRef.current);
      }
    }, { rootMargin: '400px 0px' }); // Cargar 400px ANTES de que aparezca


    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  if (!isVisible) {
    // Placeholder mínimo esperando lazy load
    return <div ref={domRef} className="w-full min-h-[300px] flex items-center justify-center opacity-0"><span className="hidden">Loading {sectionType}...</span></div>;
  }

  // Solo ejecutamos el renderizado del contenido cuando es visible
  return <>{typeof children === 'function' ? (children as Function)() : children}</>;

}


interface DynamicSectionProps {
  section: Section;
  products?: any[];
  language?: string;
  index?: number;
  targetAnchor?: string | null;
  isEditor?: boolean;
  availableCategories?: any[];
  availableEcosystemMembers?: any[];
  availableBlogPosts?: any[];
  availableProducts?: any[];
  pageSlug?: string;
  onSectionClick?: (id: string) => void;
  entityType?: 'page' | 'blog' | 'legal' | 'footer' | 'product';
}

export function DynamicSection({
  section,
  products = [],
  language = 'es',
  index = 0,
  targetAnchor,
  isEditor = false,
  availableCategories = [],
  availableEcosystemMembers = [],
  availableBlogPosts = [],
  availableProducts = [],
  pageSlug = '',
  onSectionClick,
  entityType = 'page'
}: DynamicSectionProps) {
  const navigate = useNavigate();

  // ✅ CARGA PEREZOSA (LAZY LOADING) EN EL EDITOR
  const [localProducts, setLocalProducts] = useState<any[]>(availableProducts);
  const [localMembers, setLocalMembers] = useState<any[]>(availableEcosystemMembers);
  const [localBlogPosts, setLocalBlogPosts] = useState<any[]>(availableBlogPosts);

  useEffect(() => {
    if (!isEditor) return;

    if (localProducts.length === 0 && (['products', 'featured', 'problems'].includes(section.type))) {
      supabaseAPI.getProducts().then(prods => {
         supabaseAPI.getAllProductTranslations(language).then(trans => {
            const transMap = (trans || []).reduce((acc: any, t: any) => { acc[t.product_id] = t; return acc; }, {});
            setLocalProducts((prods || []).map((p: any) => ({ ...p, translation: transMap[p.id] || null })));
         });
      });
    }

    if (localMembers.length === 0 && section.type === 'trust') {
      supabaseAPI.getEcosystemMembers().then(members => {
         supabaseAPI.getAllEcosystemMemberTranslations(language).then(trans => {
            const transMap = (trans || []).reduce((acc: any, t: any) => { acc[t.member_id] = t; return acc; }, {});
            setLocalMembers((members || []).map((m: any) => ({ ...m, translation: transMap[m.id] || null })));
         });
      });
    }

    if (localBlogPosts.length === 0 && section.type === 'blog') {
       supabaseAPI.getBlogPosts('published').then(posts => {
          supabaseAPI.getAllBlogPostTranslations(language).then(trans => {
             const transMap = (trans || []).reduce((acc: any, t: any) => { acc[t.post_id] = t; return acc; }, {});
             setLocalBlogPosts((posts || []).map((p: any) => ({ ...p, translation: transMap[p.id] || null })));
          });
       });
    }
  }, [section.type, isEditor, language]);
  if (!section.visible && !isEditor) return null;


  // Renderizar la seccion por tipo
  const renderSectionContent = () => {
    switch (section.type) {
      // ── HERO ─────────────────────────────────────
      case 'hero':
        {
          const isEcosystem = pageSlug?.includes('ecosystem');
          if (isEcosystem) {
            return (
              <section key={section.id} id={section.id} className="relative h-[300px] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${section.content.backgroundImage}')` }}
                >
                  <div className="absolute inset-0 bg-[#1C5D15]/85"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto px-5 text-center text-white">
                  <h1 className="text-3xl md:text-5xl font-black mb-3">
                    {section.content.title}
                  </h1>
                  <p
                    className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content.subtitle || '' }}
                  />

                </div>
              </section>
            );
          }

          return (
            <div key={section.id}>
              <Hero content={section.content} />
            </div>
          );
        }

      // ── TRUST BAR ────────────────────────────────
      case 'trust':
        {
          if (pageSlug?.includes('store') && section.content.selectedMemberIds?.length > 0) {
            const selectedIds = section.content.selectedMemberIds;
            const filtered = localMembers.filter(m => selectedIds.includes(m.id));
            return (
              <section key={section.id} id={section.id} className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                  <h2 className="text-[#1C5D15] text-4xl font-bold mb-4">{section.content.title}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {filtered.map(m => (
                      <div key={m.id} className="bg-[#F7F9CE] p-4 rounded-xl border border-[#1C5D15]/10">
                        <img src={m.image} className="h-16 w-16 mx-auto mb-2 object-contain" />
                        <div className="text-[#1C5D15] font-bold text-xs">{m.translation?.name || m.slug}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          return (
            <div key={section.id}>
              <TrustBar
                partners={section.content.partners || []}
                title={section.content.title}
                subtitle={section.content.subtitle}
              />
            </div>
          );
        }

      // ── FEATURES / PURPOSE ───────────────────────
      case 'features':
        return (
          <div key={section.id}>
            <Purpose
              purposes={section.content.items || []}
              title={section.content.title}
              subtitle={section.content.subtitle}
              ctaText={section.content.ctaText}
              ctaLink={section.content.ctaLink}
              ctaActionType={section.content.ctaActionType}
            />
          </div>
        );

      // ── FEATURED PRODUCT ─────────────────────────
      case 'featured':
        return (
          <div key={section.id}>
            <FeaturedProduct content={section.content} sectionId={section.id} />
          </div>
        );


      // ── PRODUCTS CATALOG ─────────────────────────
      case 'products':
        {
          const isStore = pageSlug?.includes('store');
          const selectedIds = section.content.selectedProductIds || [];
          // En el editor usamos localProducts si se pasan, si no, products de la prop (que vienen del contexto en vivo)
          const productsSource = localProducts.length > 0 ? localProducts : products;

          const displayProducts = isStore
            ? productsSource
            : (selectedIds.length > 0
              ? productsSource.filter(p => selectedIds.includes(p.id))
              : productsSource.filter(p => p.featured).slice(0, 3));

          return (
            <div key={section.id} id={section.id}>
              <Products
                title={section.content.title}
                subtitle={section.content.subtitle}
                products={displayProducts}
                ctaText={section.content.ctaText}
                ctaLink={section.content.ctaLink}
                ctaActionType={section.content.ctaActionType}
                isStoreLayout={isStore}
                sectionId={section.id}
              />
            </div>
          );

        }

      // ── HISTORY / TIMELINE ───────────────────────
      case 'history':
      case 'timeline':
        return (
          <div key={section.id} id={section.id}>
            <Timeline
              milestones={section.content.milestones || []}
              title={section.content.title}
              subtitle={section.content.subtitle}
              description={section.content.description}
              ctaText={section.content.ctaText}
              ctaLink={section.content.ctaLink}
              ctaActionType={section.content.ctaActionType}
            />
          </div>
        );

      // ── TEAM / LEADERSHIP ───────────────────────
      case 'team':
        return (
          <div key={section.id}>
            <Leadership
              members={section.content.members || []}
              title={section.content.title}
              subtitle={section.content.subtitle}
              ctaText={section.content.ctaText}
              ctaLink={section.content.ctaLink}
              ctaActionType={section.content.ctaActionType}
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
                ctaText={section.content.ctaText}
                ctaLink={section.content.ctaLink}
                ctaActionType={section.content.ctaActionType}
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
              sectionId={section.id}
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
                  className="text-lg text-[#629960] leading-loose mb-10"
                  dangerouslySetInnerHTML={{ __html: section.content.text || section.content.subtitle || '' }}
                />
                {section.content.ctaText && (
                  <div className="mt-4">
                    <Button
                      onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                      className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                    >
                      {section.content.ctaText}
                    </Button>
                  </div>
                )}
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
                {section.content.subtitle && (
                  <p
                    className="text-white/80 text-lg mb-8"
                    dangerouslySetInnerHTML={{ __html: section.content.subtitle }}
                  />
                )}

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
                        <span className="font-bold text-[#1C5D15]" dangerouslySetInnerHTML={{ __html: item.question }} />
                        <span className="text-[#19FF00] text-2xl group-open:rotate-45 transition-transform">+</span>
                      </summary>

                      <div className="p-5 pt-0 text-[#629960] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </details>
                  ))}
                </div>

                {section.content.ctaText && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                      className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                    >
                      {section.content.ctaText}
                    </Button>
                  </div>
                )}
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

      case 'blog-posts':
        {
          const displayPosts = availableBlogPosts.length > 0 ? availableBlogPosts : [];
          return (
            <div key={section.id}>
              <BlogPostsSection
                posts={displayPosts}
                language={language}
                activeFilter="all"
                onFilterChange={() => { }}
                totalPages={1}
                sectionId={section.id}
                from="home"
              />
            </div>
          );
        }

      // ── CATEGORY FILTER (Ecosystem Directory) ───
      case 'category-filter':
        {
          if (!isEditor) return null; // El filtro real se maneja en el componente de página Ecosystem

          const displayMembers = availableEcosystemMembers.slice(0, 3);
          return (
            <section key={section.id} id={section.id} className="py-20 bg-[#629960]/5 border-y border-[#E8F0E2]">
              <div className="max-w-7xl mx-auto px-6">
                {section.content.title && (
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-[#1C5D15] mb-4">{section.content.title}</h2>
                    {section.content.subtitle && (
                      <p
                        className="text-[#629960] text-lg max-w-2xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: section.content.subtitle }}
                      />
                    )}

                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 justify-center mb-12">
                  <span className="px-5 py-2 rounded-full text-xs font-bold bg-[#1C5D15] text-white shadow-lg">Todas las Categorías</span>
                  {(availableCategories || []).slice(0, 5).map((category: any) => (
                    <span key={category.id} className="px-5 py-2 rounded-full text-xs font-bold bg-white text-[#1C5D15] border border-[#1C5D15]/10 transition-colors">
                      {category.name}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {displayMembers.map((member: any) => (
                    <div key={member.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#1C5D15]/5">
                      <div className="h-40 bg-gray-50 rounded-2xl mb-4 overflow-hidden">
                        {member.image ? <img src={member.image} alt="" className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full flex items-center justify-center text-[#1C5D15]/20"><Globe size={48} /></div>}
                      </div>
                      <div className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded w-fit mb-2">{member.sector || "Miembro"}</div>
                      <h3 className="text-lg font-bold text-[#1C5D15] mb-2 truncate">{member.translation?.name || member.slug}</h3>
                      <div className="w-full h-1 bg-[#F7F9CE] rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

      // ── CLIENTES ─────────────────────────────────
      case 'clientes':
        {
          if (!isEditor) return null; // En vivo se maneja por Custom Component de página

          const selectedMemberIds = section.content.selectedMemberIds || [];
          const filteredMembers = availableEcosystemMembers.filter((m: any) => selectedMemberIds.includes(m.id));

          return (
            <section key={section.id} id={section.id} className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title || 'Nuestros Aliados'}</h2>
                  <p
                    className="text-xl text-[#629960] max-w-3xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: section.content.subtitle || '' }}
                  />

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((m: any) => (
                      <div key={m.id} className="bg-[#F7F9CE] rounded-2xl overflow-hidden p-6 text-center border border-[#1C5D15]/5">
                        <img src={m.image} className="h-20 w-auto mx-auto mb-4 object-contain" alt={m.slug} />
                        <h3 className="font-bold text-[#1C5D15]">{m.translation?.name || m.slug}</h3>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 font-bold uppercase text-xs tracking-widest">Sin aliados seleccionados</div>
                  )}
                </div>
              </div>
            </section>
          );
        }

      // ── CERTIFICATIONS ───────────────────────────
      case 'certifications':
        return (
          <div key={section.id} id={section.id}>
            <section className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-6 text-center">
                {section.content.title && <h2 className="text-3xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>}
                {section.content.subtitle && <p className="text-[#629960] mb-10 max-w-2xl mx-auto">{section.content.subtitle}</p>}
                <div className="grid md:grid-cols-3 gap-5">
                  {(section.content.items || []).map((item: any, i: number) => (
                    <div key={i} className="p-6 bg-[#629960]/5 border-2 border-[#629960]/15 rounded-2xl hover:border-[#19FF00] transition-all group">
                      <div className="text-3xl font-black text-[#19FF00] mb-2">{item.acronym}</div>
                      <h3 className="font-bold text-[#1C5D15] mb-1">{item.name}</h3>
                      <p className="text-[#629960] text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description }} />

                      {item.year && <div className="mt-2 text-xs text-[#629960]/50">Obtenida: {item.year}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

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

                {section.content.ctaText && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                      className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                    >
                      {section.content.ctaText}
                    </Button>
                  </div>
                )}
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
                <blockquote
                  className="text-2xl md:text-3xl font-bold text-[#1C5D15] italic leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: section.content.quote || section.content.title || '' }}
                />

                {section.content.author && (
                  <p className="text-[#629960] font-bold uppercase tracking-wider text-sm">— {section.content.author}</p>
                )}

                {section.content.ctaText && (
                  <div className="mt-10">
                    <Button
                      onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                      className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                    >
                      {section.content.ctaText}
                    </Button>
                  </div>
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
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:text-[#1C5D15] transition-all group">
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      {item.description && <p className="text-xs mt-1 opacity-70">{item.description}</p>}
                    </div>
                  ))}
                </div>

                {section.content.ctaText && (
                  <div className="mt-12">
                    <Button
                      onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                      className="bg-[#19FF00] text-[#1C5D15] hover:bg-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                    >
                      {section.content.ctaText}
                    </Button>
                  </div>
                )}
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
                      <p className="text-[#629960] text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description }} />

                    </div>
                  ))}
                </div>

                {section.content.ctaText && (
                  <div className="mt-12 text-center">
                    <Button
                      onClick={() => handleAction(section.content.ctaActionType, section.content.ctaLink, navigate)}
                      className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform"
                    >
                      {section.content.ctaText}
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>
        );

      // ── BLOG ─────────────────────────────────────
      case 'blog':
        return (
          <div key={section.id} id={section.id}>
             <section className="py-20 bg-white">
               <div className="max-w-6xl mx-auto px-6">
                 <div className="text-center mb-12">
                   <h2 className="text-4xl font-bold text-[#1C5D15] mb-2">{section.content.title}</h2>
                   <p className="text-[#629960]">{section.content.subtitle}</p>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8">
                   {(localBlogPosts || []).slice(0, 3).map((post: any) => (
                     <div key={post.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-4">
                       <div className="h-40 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                         <img src={post.image} className="w-full h-full object-cover" />
                       </div>
                       <h3 className="font-bold text-[#1C5D15] mb-2">{post.translation?.title || 'Draft'}</h3>
                       <p className="text-xs text-[#629960] line-clamp-2">{post.translation?.excerpt}</p>
                     </div>
                   ))}
                 </div>
               </div>
             </section>
          </div>
        );

      // ── RICH TEXT ────────────────────────────────
      case 'rich-text':
        const isFidelityEntity = ['legal', 'blog'].includes(entityType || '');
        return (
          <div 
            key={section.id} 
            id={section.id} 
            className={`${isFidelityEntity ? 'bg-transparent py-4' : 'bg-white py-10 md:py-20'} min-h-[100px] flex flex-col`}
          >
            <div className="max-w-4xl mx-auto px-4 md:px-6 w-full flex-grow">
               <div className={isFidelityEntity ? '' : 'bg-white shadow-2xl shadow-[#1C5D15]/5 rounded-[32px] md:rounded-[40px] p-6 md:p-16 border border-[#F7F9CE] relative overflow-hidden'}>
                  {!isFidelityEntity && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#19FF00]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  )}
                  
                  <div 
                    className="prose prose-lg max-w-none text-[#1a1a1a] leading-relaxed prose-headings:text-[#1C5D15] prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-[#334155] prose-li:text-[#334155] prose-strong:text-[#1C5D15]"
                    dangerouslySetInnerHTML={{ __html: section.content.html || '' }}
                  />


               </div>
            </div>
          </div>
        );

      // ── RICH-TEXT (legacy HTML content fallback) ────────────
      case 'rich-text':
        return (
          <div className="blog-content w-full py-6 overflow-hidden">
            <div
              className="prose prose-lg max-w-none text-[#629960] leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: section.content.html || '' }}
            />
          </div>
        );

      case 'blog-text':
        return (
          <div className="blog-content w-full py-4 overflow-hidden">
             <div 
               className="prose prose-lg max-w-none text-[#629960] leading-relaxed break-words"
               dangerouslySetInnerHTML={{ __html: section.content.html || '' }}
             />
          </div>
        );

      case 'blog-quote':
        return (
          <div className="w-full my-8">
            <div className="border-l-4 border-[#19FF00] pl-6 py-4 bg-[#F0F9F0] rounded-r-lg">
              <p className="text-xl text-[#1C5D15] italic font-medium leading-relaxed">
                &ldquo;{section.content.text}&rdquo;
              </p>
              {section.content.author && (
                <p className="mt-2 text-sm text-[#629960] font-bold uppercase tracking-wider">
                  &mdash; {section.content.author}
                </p>
              )}
            </div>
          </div>
        );

      case 'blog-image':
        return (
          <div className="w-full my-8">
            <figure className="relative overflow-hidden rounded-xl shadow-lg border border-[#F7F9CE]">
              <img 
                src={section.content.url} 
                alt={section.content.caption || ''} 
                className="w-full h-auto object-cover max-h-[500px]" 
              />
              {section.content.caption && (
                <figcaption className="bg-[#1C5D15]/90 text-white p-4 text-sm italic backdrop-blur-sm">
                  {section.content.caption}
                </figcaption>
              )}
            </figure>
          </div>
        );

      case 'blog-divider':
        return (
          <div className="w-full py-8 text-center">
            <div className="h-0.5 w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#19FF00] to-transparent"></div>
          </div>
        );

      case 'blog-intro':
        return (
          <div className="blog-content w-full py-2 overflow-hidden">
             <div 
               className="text-xl md:text-2xl font-medium text-[#1C5D15] leading-relaxed border-l-4 border-[#19FF00] pl-6 break-words"
               dangerouslySetInnerHTML={{ __html: section.content.html || '' }}
             />
          </div>
        );

      case 'blog-list':
        return (
          <div className="blog-content w-full py-4">
             <ul className="space-y-4">
               {(section.content.items || []).map((item: string, i: number) => (
                 <li key={i} className="flex gap-4">
                   <div className="w-6 h-6 rounded-full bg-[#19FF00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#1C5D15]"></div>
                   </div>
                   <span className="text-lg text-[#629960]">{item}</span>
                 </li>
               ))}
             </ul>
          </div>
        );

      default:
        console.warn(`⚠️ Tipo de sección desconocido: "${section.type}" (id: ${section.id})`);
        return null;
    }
  };

  // SI HAY UN OBJETIVO (ANCLA), FORZAMOS LA CARGA DE TODO EL DOCUMENTO
  // Esto es vital para que las secciones intermedias tengan su altura real 
  // y el scrollbar no "crezca" mientras bajamos.
  const isAnyTargetActive = !!targetAnchor;

  const shouldForceLoad = isAnyTargetActive ||
    index < 1 ||
    section.type === 'hero';

  useEffect(() => {
    if (isAnyTargetActive) {
      console.log(`🔌 [DYNAMIC-SECTION] Carga prioritaria activada para "${section.type}" (id: ${section.id}) debido a navegación por ancla: #${targetAnchor}`);
    }
  }, [isAnyTargetActive, targetAnchor]);


  return (
    <div
      id={section.id}
      data-section-type={section.type}
      key={section.id}
      style={{ scrollMarginTop: '80px' }}
      className={!section.visible && isEditor ? '' : ''}
    >
      <LazySectionWrapper sectionType={section.type} forceVisible={shouldForceLoad} isEditor={isEditor}>
        {() => renderSectionContent()}
      </LazySectionWrapper>
    </div>

  );
}
