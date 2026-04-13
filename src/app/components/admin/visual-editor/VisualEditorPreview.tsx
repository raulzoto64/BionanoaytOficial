import { Section, Category, EcosystemMember, Product } from '../../../data/supabase';
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
  Warehouse
} from 'lucide-react';
import { FlipCards } from '../../FlipCards';
import { FeaturedProduct } from '../../FeaturedProduct';
import { Timeline } from '../../Timeline';
import { Leadership } from '../../Leadership';
import { NewsSection } from '../../NewsSection';
import { TrustBar } from '../../TrustBar';
import { Purpose } from '../../Purpose';
import { Ecosystem } from '../../Ecosystem';

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

interface VisualEditorPreviewProps {
  sections: Section[];
  activeSectionId: string | null;
  onSectionClick: (id: string) => void;
  availableCategories?: Category[];
  availableEcosystemMembers?: EcosystemMember[];
  availableProducts?: Product[];
}

function EditableBlock({ 
  sectionId, 
  activeSectionId, 
  onClick, 
  children, 
  label = "Sección" 
}: { 
  sectionId: string; 
  activeSectionId: string | null; 
  onClick: (id: string) => void; 
  children: React.ReactNode;
  label?: string;
}) {
  const isActive = activeSectionId === sectionId;
  
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-200 border-2 ${
        isActive 
          ? 'border-[#19FF00] z-10 shadow-[0_0_0_4px_rgba(25,255,0,0.1)]' 
          : 'border-transparent hover:border-[#1C5D15]/50'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(sectionId);
      }}
    >
      {/* Etiqueta flotante */}
      <div 
        className={`absolute -top-6 left-0 bg-[#1C5D15] text-[#19FF00] text-xs font-bold px-2 py-1 rounded-t-md transition-opacity duration-200 ${
          isActive || 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ zIndex: 20 }}
      >
        {label}
      </div>

      <div className={isActive ? '' : 'pointer-events-none'}>
        {children}
      </div>
      
      {!isActive && (
        <div className="absolute inset-0 z-10" />
      )}
    </div>
  );
}

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

export function VisualEditorPreview({ 
  sections, 
  activeSectionId, 
  onSectionClick,
  availableCategories = [],
  availableEcosystemMembers = [],
  availableProducts = []
}: VisualEditorPreviewProps) {

  const renderSectionComponent = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return (
          <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-[#1C5D15]">
            {section.content.backgroundImage && (
              <img 
                src={section.content.backgroundImage} 
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                alt="Hero background"
              />
            )}
            <div className="relative z-10 text-center px-6 max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                {section.content.title}
              </h1>
              <div 
                className="text-xl text-white/90 mb-10 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: section.content.subtitle }}
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {section.content.ctaText && (
                  <button className="bg-[#19FF00] text-[#1C5D15] px-8 py-4 rounded-full font-black uppercase tracking-wider hover:scale-105 transition-transform">
                    {section.content.ctaText}
                  </button>
                )}
                {section.content.secondaryCtaText && (
                  <button className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-white/20 transition-all">
                    {section.content.secondaryCtaText}
                  </button>
                )}
              </div>
            </div>
          </section>
        );

      case 'features':
        return <Purpose purposes={section.content.items || []} />;

      case 'text':
        return (
          <section className="py-20 bg-[#F7F9CE]/30">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-black text-[#1C5D15] mb-8">{section.content.title}</h2>
              <div 
                className="text-lg text-[#629960] leading-loose"
                dangerouslySetInnerHTML={{ __html: section.content.text }}
              />
            </div>
          </section>
        );

      case 'products':
        return (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-[#1C5D15] mb-4">{section.content.title}</h2>
                <p className="text-[#629960] text-lg max-w-2xl mx-auto">{section.content.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {availableProducts.slice(0, 3).map((product: any) => (
                  <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="h-64 bg-gray-100 relative">
                      <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#1C5D15] uppercase tracking-widest">
                        Bio-Tec
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-[#1C5D15] mb-2">{product.name}</h3>
                      <p className="text-[#629960] text-sm mb-6 line-clamp-2">{product.description}</p>
                      <button className="w-full bg-[#1C5D15] text-white py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-[#1C5D15]/90 transition-colors">
                        Saber más
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'blog':
        return (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-[#1C5D15] mb-2">{section.content.title}</h2>
                  <p className="text-[#629960]">{section.content.subtitle}</p>
                </div>
                <button className="text-[#1C5D15] font-black uppercase text-xs tracking-widest border-b-2 border-[#19FF00] pb-1">
                  Ver todo el blog
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 group">
                    <div className="h-56 bg-gray-200 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1530836361283-9b4972d13bb2?q=80&w=800&auto=format&fit=crop`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt="Blog post" 
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-[#F7F9CE] text-[#1C5D15] text-[10px] font-bold px-2 py-1 rounded-md uppercase">Innovación</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">12 Abr 2024</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1C5D15] mb-3 group-hover:text-[#629960] transition-colors">
                        El futuro de la nanotecnología en la agricultura sostenible
                      </h3>
                      <p className="text-[#629960] text-xs leading-relaxed line-clamp-2">
                        Exploramos cómo los nuevos materiales a escala nanométrica están revolucionando el campo...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'trust':
        return <TrustBar partners={section.content.partners || []} title={section.content.title} subtitle={section.content.subtitle} />;
      
      case 'ecosystem':
        return (
          <div id="allies">
            <Ecosystem
              title={section.content.title}
              subtitle={section.content.subtitle}
              items={section.content.items || []}
            />
          </div>
        );

      case 'hero-blog':
        return (
          <div className="relative h-96 bg-gray-900 flex items-center justify-center text-white text-center rounded-3xl overflow-hidden mx-4 my-8">
            <img src={section.content.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="relative z-10 p-10">
              <span className="bg-[#19FF00] text-[#1C5D15] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                {section.content.badge}
              </span>
              <h1 className="text-4xl font-black mb-4">{section.content.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: section.content.subtitle }} />
            </div>
          </div>
        );

      // --- Tipos adicionales ---
      case 'featured':
        return <FeaturedProduct content={section.content} />;

      case 'timeline':
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
            title={section.content.title}
            subtitle={section.content.subtitle}
          />
        );

      case 'news':
        return <NewsSection title={section.content.title} subtitle={section.content.subtitle} />;

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
                      <Icon name={item.icon || "FlaskConical"} className="w-5 h-5 text-[#1C5D15]" />
                    </div>
                    <h3 className="text-base font-bold text-[#1C5D15] mb-2">{item.title}</h3>
                    <div className="text-[#629960] text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: item.description }} />
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
                <Icon name="Quote" className="w-10 h-10 text-[#19FF00] opacity-30 mb-3" />
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
              {section.content.subtitle && <p className="text-[#629960] text-center mb-10" dangerouslySetInnerHTML={{ __html: section.content.subtitle }} />}
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

      // --- STORE TYPES ---

      case 'flipcards':
        return <FlipCards items={section.content.items || []} />;

      case 'category-filter':
        return (
          <section className="py-4 bg-white border-y border-[#E8F0E2] sticky top-16 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-wrap gap-2.5 justify-center">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1C5D15] text-white">
                  Todas las Categorías
                </span>
                {availableCategories.map((category) => (
                  <span key={category.id} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F7F9CE] text-[#1C5D15]">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        );

      case 'clientes':
        {
          const selectedMemberIds = section.content.selectedMemberIds || [];
          const filteredMembers = availableEcosystemMembers.filter((member) =>
            selectedMemberIds.includes(member.id)
          );

          if (filteredMembers.length > 0) {
            return (
              <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    {section.content.title && <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>}
                    {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredMembers.map((member, index: number) => (
                      <div 
                        key={member.id}
                        className="rounded-2xl overflow-hidden text-center transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 group border border-[#1C5D15]/5"
                        style={{ backgroundColor: '#F7F9CE' }}
                      >
                        <div className="relative h-32 overflow-hidden bg-white/50">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.translation?.name || member.slug} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <Globe className="w-12 h-12 text-[#1C5D15]" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[#1C5D15]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                              Detalles →
                            </span>
                          </div>
                        </div>
                        <div className="p-4 border-t border-[#1C5D15]/10">
                          <h3 className="font-bold text-[#1C5D15] mb-1 truncate">{member.translation?.name || member.slug}</h3>
                          <p className="text-[10px] text-[#629960] line-clamp-1 italic">{member.sector || "Miembro Ecosistema"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                  {section.content.title && <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>}
                  {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                </div>
                <div className="text-center py-16 bg-[#1C5D15]/5 rounded-3xl border-2 border-dashed border-[#1C5D15]/20">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1C5D15]/10">
                    <Globe className="w-8 h-8 text-[#1C5D15] animate-pulse" />
                  </div>
                  <h3 className="text-[#1C5D15] font-bold mb-1">Sección de Clientes Vacía</h3>
                  <p className="text-[#629960] text-sm max-w-xs mx-auto">Haz clic aquí para seleccionar los miembros del ecosistema que deseas mostrar.</p>
                </div>
              </div>
            </section>
          );
        }

      case 'cta':
        return (
          <section className="py-16 bg-[#1C5D15] text-white text-center">
            <div className="max-w-3xl mx-auto px-6">
              {section.content.icon && (
                <div className="flex items-center justify-center mb-6">
                  <Icon name={section.content.icon} className="w-16 h-16 text-[#19FF00]" />
                </div>
              )}
              {section.content.title && <h2 className="text-3xl font-bold mb-3">{section.content.title}</h2>}
              {section.content.subtitle && <p className="text-white/80 text-lg mb-8">{section.content.subtitle}</p>}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {section.content.ctaText && (
                  <button className="bg-[#19FF00] text-[#1C5D15] px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform">
                    {section.content.ctaText}
                  </button>
                )}
                {section.content.secondaryCtaText && (
                  <button className="bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-white/10 transition-all">
                    {section.content.secondaryCtaText}
                  </button>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return (
          <div className="p-20 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-20" />
            Componente de tipo <span className="font-bold text-[#1C5D15]">{section.type}</span> en construcción o no previsualizable.
          </div>
        );
    }
  };

  return (
    <div className="space-y-0">
      {sections.map((section) => (
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
  );
}
