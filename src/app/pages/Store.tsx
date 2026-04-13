import { useEffect, useState } from "react";
import { PageContent, Section, supabaseAPI, Product, ProductTranslation } from "../data/supabase";
import { DynamicSection } from "../components/DynamicSection";
import { ensureExternalLink } from "../utils/url";
import {
  FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe,
  AlertTriangle, ChevronDown, ChevronUp, Quote, CheckCircle,
  Sprout, Building2, Fish, Apple, HeartPulse, Shirt, Warehouse, Shield,
  Star, ShoppingCart, Package, Truck, Award, Users, Info, ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { useNavigate, useSearchParams } from "react-router";
import { FlipCards } from "../components/FlipCards";

// ── Mapa de iconos ─────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe,
  AlertTriangle, CheckCircle, Sprout, Building2, Fish, Apple,
  HeartPulse, Shirt, Warehouse, Shield, Star, ShoppingCart, Package, Truck, Award, Users
};

function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICON_MAP[name] || FlaskConical;
  return <C className={className} />;
}

// ── Componente de estrellas ─────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' :
            star - 0.5 === rating ? 'text-yellow-400 fill-yellow-400/50' :
            'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// ── Componente de producto para la sección products ────────────────────────
function ProductCard({ product, index }: { product: any; index: number }) {
  const navigate = useNavigate();
  const rating = index % 2 === 0 ? 5 : 4.5; // Alternar entre 5 y 4.5 estrellas

  return (
    <div
      onClick={() => navigate(`/products/${product.slug}`)}
      className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      <div className="h-44 overflow-hidden bg-[#F7F9CE]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 text-[11px] uppercase font-bold tracking-wide text-[#1C5D15]">
          {product.category}
        </div>
        <h3 className="text-lg font-semibold text-[#1C5D15] mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-[#629960] mb-3 line-clamp-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <StarRating rating={rating} />
          <span className="text-sm font-bold text-[#19FF00]">Ver detalle</span>
        </div>
      </div>
    </div>
  );
}

export function Store() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ecosystemMembers, setEcosystemMembers] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Estados para el popup de partners (movidos AFUERA del map)
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const loadPageContent = async () => {
    try {
      const content = await supabaseAPI.getPageContent('page-store', language);
      setPageContent(content);
    } catch (error) {
      console.error('Error loading store content:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await supabaseAPI.getProducts();
      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          const translation = await supabaseAPI.getProductTranslation(product.id, language);
          const category = await supabaseAPI.getCategoryTranslation(product.category, language);

          return {
            ...product,
            name: translation?.name || product.slug,
            description: translation?.description || '',
            category_id: product.category,
            category: category?.name || product.category,
            price: product.price_per_unit || 0,
          };
        })
      );
      setProducts(productsWithDetails.filter((product) => product.status === 'active'));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await supabaseAPI.getCategories();
      const categoriesWithTranslations = await Promise.all(
        categoriesData.map(async (category) => {
          const translation = await supabaseAPI.getCategoryTranslation(category.id, language);
          return {
            ...category,
            name: translation?.name || category.id,
          };
        })
      );
      setCategories(categoriesWithTranslations);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadEcosystemMembers = async () => {
    try {
      const members = await supabaseAPI.getEcosystemMembers();
      const membersWithTranslations = await Promise.all(
        members.map(async (member) => {
          const translation = await supabaseAPI.getEcosystemMemberTranslation(member.id, language);
          return {
            ...member,
            translation
          };
        })
      );
      setEcosystemMembers(membersWithTranslations.filter(m => m.status === 'active'));
    } catch (error) {
      console.error('Error loading ecosystem members:', error);
    }
  };

  useEffect(() => {
    loadPageContent();
    loadProducts();
    loadCategories();
    loadEcosystemMembers();
  }, [language]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  if (!pageContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]">
        <div className="text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl text-[#1C5D15] mb-2">Cargando tienda...</h2>
          <p className="text-[#629960]">Por favor, espera mientras se cargan los productos</p>
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


      {pageContent.sections
        .filter((section: Section) => section.visible)
        .map((section: Section) => {
          switch (section.type) {
            // ── 1. HERO ──────────────────────────────────────────────────────
          case 'hero':
            return (
              <section key={section.id} className="relative h-[290px] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${section.content.backgroundImage}')` }}
                >
                  <div className="absolute inset-0 bg-[#1C5D15]/85" />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {section.content.title}
                  </h1>
                  <div
                    className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: section.content.subtitle || '' }}
                  />
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {section.content.ctaText && (
                      <a
                        href={section.content.ctaLink || '#products'}
                        className="inline-block px-6 py-3 bg-[#19FF00] text-[#1C5D15] font-bold rounded-full hover:bg-white hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg uppercase text-sm tracking-wider"
                      >
                        {section.content.ctaText}
                      </a>
                    )}
                    {section.content.secondaryCtaText && (
                      <a
                        href={section.content.secondaryCtaLink || '#products'}
                        className="inline-block px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 uppercase text-sm tracking-wider"
                      >
                        {section.content.secondaryCtaText}
                      </a>
                    )}
                  </div>
                </div>

                {/* ✅ Popup Modal Exactamente igual que Home */}
                <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
                  <DialogContent
                    className="sm:max-w-[500px] bg-[#F7F9CE] border-2 border-[#1C5D15] p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      .dialog-content-scroll::-webkit-scrollbar { display: none; }
                      [data-slot="dialog-close"] { 
                        transition: color 0.3s ease; 
                        z-index: 100;
                        color: ${isScrolled ? '#1C5D15' : 'white'};
                      }
                    `}} />
                    {selectedPartner && (
                      <div
                        className="flex flex-col h-full overflow-y-auto dialog-content-scroll"
                        onScroll={(e) => {
                          const scrollTop = (e.target as HTMLDivElement).scrollTop;
                          setIsScrolled(scrollTop > 80);
                        }}
                      >
                        {/* Header con imagen como BANNER COMPLETO de fondo */}
                        <div className="relative h-60 bg-[#1C5D15] overflow-hidden shrink-0">
                          <img
                            src={selectedPartner.image}
                            alt={selectedPartner.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1C5D15] to-transparent opacity-70" />
                        </div>

                        {/* Contenido */}
                        <div className="pt-6 pb-8 px-8 flex-1">
                          <div className="text-center mb-6">
                            <DialogTitle className="text-2xl font-bold text-[#1C5D15] mb-1">{selectedPartner.name}</DialogTitle>
                            {selectedPartner.placeholder && (
                              <span className="text-sm font-medium text-[#629960] uppercase tracking-widest">{selectedPartner.placeholder}</span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {selectedPartner.description && (
                              <div className="bg-white/50 p-4 rounded-xl border border-[#1C5D15]/10">
                                <p className="text-[#1C5D15] text-sm leading-relaxed">{selectedPartner.description}</p>
                              </div>
                            )}

                            {selectedPartner.details && selectedPartner.details.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold text-[#1C5D15] uppercase tracking-wider flex items-center gap-2">
                                  <Info className="w-3 h-3" />
                                  Detalles Clave:
                                </h4>
                                <ul className="grid grid-cols-1 gap-2">
                                  {selectedPartner.details.map((detail: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#629960] bg-white/30 p-2 rounded-lg border border-white/50">
                                      <span className="text-[#19FF00] font-bold">✓</span>
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer Boton */}
                        <div className="bg-[#1C5D15]/5 p-6 border-t border-[#1C5D15]/10 flex justify-center">
                            <button
                              onClick={() => navigate(`/ecosystem/${selectedPartner.slug}`)}
                              className="flex items-center gap-2 px-8 py-3 bg-[#1C5D15] text-[#19FF00] rounded-full font-bold hover:bg-[#19FF00] hover:text-[#1C5D15] transition-all duration-300 shadow-lg hover:shadow-[#19FF00]/20 active:scale-95"
                            >
                              <Globe className="w-4 h-4" />
                              Ver Cliente
                            </button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

              </section>
            );


          // ── 2. FLIPCARDS (Tarjetas que giran) ────────────────────────────
          case 'flipcards':
            return <FlipCards key={section.id} items={section.content.items} />;

          // ── ✅ NUEVA SECCION: CLIENTES / SECTORES ─────────────────────────
          case 'clientes':
            // ✅ USAMOS MIEMBROS DEL ECOSISTEMA DIRECTAMENTE
            let clientesList: any[] = [];
            
            if (section.content.selectedMemberIds?.length > 0) {
              const selectedIds = section.content.selectedMemberIds;
              const filtered = ecosystemMembers.filter(m => selectedIds.includes(m.id));
              
              // ✅ MAPEAMOS TODOS LOS CAMPOS EXISTENTES EN ECOSYSTEM MEMBER
              clientesList = filtered.map(member => ({
                id: member.id,
                slug: member.slug,
                name: member.translation?.name || member.slug,
                placeholder: member.sector,
                image: member.image,
                description: member.translation?.description || "",
                link: member.social_media?.website,
                social_media: member.social_media,
                videos: member.videos,
                short_videos: member.short_videos,
                details: []
              }));
            }

            return (
              <section key={section.id} className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    {section.content.title && <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>}
                    {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {clientesList.map((cliente: any, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => setSelectedPartner(cliente)}
                        className="rounded-2xl overflow-hidden text-center transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 group"
                        style={{ backgroundColor: '#F7F9CE' }}
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={cliente.image} 
                            alt={cliente.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-[#1C5D15]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              Ver Más →
                            </span>
                          </div>
                        </div>
                        <div className="p-4 border-t border-[#1C5D15]/10">
                          <h3 className="font-bold text-[#1C5D15] mb-1">{cliente.name}</h3>
                          <p className="text-xs text-[#629960]">{cliente.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 3. CATEGORY FILTER (Barra de filtros) ───────────────────────
          case 'category-filter':
            return (
              <section key={section.id} className="py-4 bg-white border-y border-[#E8F0E2] sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-[#1C5D15] text-white'
                          : 'bg-[#F7F9CE] text-[#1C5D15] hover:bg-[#E8F0E2]'
                      }`}
                    >
                      Todas las Categorías
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-[#1C5D15] text-white'
                            : 'bg-[#F7F9CE] text-[#1C5D15] hover:bg-[#E8F0E2]'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            );

          // ── 4. FEATURES (Ahora es la seccion normal para Tecnologia no Store) ──────────
          case 'features':
            return null;


          // ── 3. PRODUCTS ──────────────────────────────────────────────────
          case 'products':
            {
              return (
                <section key={section.id} id="products" className="py-16 bg-[#F7F9CE]">
                  <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  </div>
                </section>
              );
            }



          // ── 4. TRUST (Testimonios o certificaciones) ────────────────────
          case 'trust':
            // ✅ SI ESTA EN STORE Y TIENE selectedMemberIds USAMOS MIEMBROS DEL ECOSISTEMA
            // ✅ SINO USAMOS PARTNERS MANUALES
            let partnersList: any[] = section.content.partners || [];

            if (section.content.selectedMemberIds?.length > 0) {
              const selectedIds = section.content.selectedMemberIds;
              const filtered = ecosystemMembers.filter(m => selectedIds.includes(m.id));
              
              // ✅ MAPEAMOS TODOS LOS CAMPOS EXISTENTES EN ECOSYSTEM MEMBER
              partnersList = filtered.map(member => ({
                id: member.id,
                slug: member.slug,
                name: member.translation?.name || member.slug,
                placeholder: member.sector,
                image: member.image,
                description: member.translation?.description || "",
                link: member.social_media?.website,
                social_media: member.social_media,
                videos: member.videos,
                short_videos: member.short_videos,
                details: []
              }));
            }

            return (
              <section key={section.id} className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16">
                    {section.content.title && <h2 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">{section.content.title}</h2>}
                    {section.content.subtitle && <p className="text-xl text-[#629960] max-w-3xl mx-auto">{section.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {partnersList.map((partner: any, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => setSelectedPartner(partner)}
                        className="bg-[#F7F9CE] rounded-2xl overflow-hidden text-center transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 group"
                      >
                        {/* Imagen como banner de fondo completo */}
                        <div className="relative h-32 bg-[#F7F9CE] overflow-hidden">
                          <img 
                            src={partner.image} 
                            alt={partner.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {/* Overlay hover con boton Ver Mas */}
                          <div className="absolute inset-0 bg-[#1C5D15]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              Ver Más →
                            </span>
                          </div>
                        </div>

                        <div className="p-4 border-t border-[#1C5D15]/10">
                          <h3 className="font-bold text-[#1C5D15] mb-1">{partner.name}</h3>
                          <p className="text-xs text-[#629960]">{partner.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popup Modal Exactamente igual que Home */}
                <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
                  <DialogContent
                    className="sm:max-w-[500px] bg-[#F7F9CE] border-2 border-[#1C5D15] p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      .dialog-content-scroll::-webkit-scrollbar { display: none; }
                      [data-slot="dialog-close"] { 
                        transition: color 0.3s ease; 
                        z-index: 100;
                        color: ${isScrolled ? '#1C5D15' : 'white'};
                      }
                    `}} />
                    {selectedPartner && (
                      <div
                        className="flex flex-col h-full overflow-y-auto dialog-content-scroll"
                        onScroll={(e) => {
                          const scrollTop = (e.target as HTMLDivElement).scrollTop;
                          setIsScrolled(scrollTop > 80);
                        }}
                      >
                        {/* Header con imagen como BANNER COMPLETO de fondo */}
                        <div className="relative h-60 bg-[#1C5D15] overflow-hidden shrink-0">
                          <img
                            src={selectedPartner.image}
                            alt={selectedPartner.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1C5D15] to-transparent opacity-70" />
                        </div>

                        {/* Contenido */}
                        <div className="pt-6 pb-8 px-8 flex-1">
                          <div className="text-center mb-6">
                            <DialogTitle className="text-2xl font-bold text-[#1C5D15] mb-1">{selectedPartner.name}</DialogTitle>
                            {selectedPartner.placeholder && (
                              <span className="text-sm font-medium text-[#629960] uppercase tracking-widest">{selectedPartner.placeholder}</span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {selectedPartner.description && (
                              <div className="bg-white/50 p-4 rounded-xl border border-[#1C5D15]/10">
                                <p className="text-[#1C5D15] text-sm leading-relaxed">{selectedPartner.description}</p>
                              </div>
                            )}

                            {selectedPartner.details && selectedPartner.details.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold text-[#1C5D15] uppercase tracking-wider flex items-center gap-2">
                                  <Info className="w-3 h-3" />
                                  Detalles Clave:
                                </h4>
                                <ul className="grid grid-cols-1 gap-2">
                                  {selectedPartner.details.map((detail: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#629960] bg-white/30 p-2 rounded-lg border border-white/50">
                                      <span className="text-[#19FF00] font-bold">✓</span>
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer Boton */}
                        <div className="bg-[#1C5D15]/5 p-6 border-t border-[#1C5D15]/10 flex justify-center">
                          {selectedPartner.link ? (
                              <a
                                href={ensureExternalLink(selectedPartner.link)}
                                target="_blank"
                                rel="noopener noreferrer"
                              className="flex items-center gap-2 px-8 py-3 bg-[#1C5D15] text-[#19FF00] rounded-full font-bold hover:bg-[#19FF00] hover:text-[#1C5D15] transition-all duration-300 shadow-lg hover:shadow-[#19FF00]/20 active:scale-95"
                            >
                              <Globe className="w-4 h-4" />
                              Visitar Sitio Web
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              disabled
                              className="px-8 py-3 bg-gray-200 text-gray-400 rounded-full font-bold cursor-not-allowed"
                            >
                              Sin enlace disponible
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </section>
            );

          // ── 5. CTA FINAL ────────────────────────────────────────────────
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
                    <div className="text-5xl mb-6">{section.content.emoji || '🛒'}</div>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">{section.content.title}</h2>
                  <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">{section.content.subtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={section.content.ctaLink || '/#contact'}
                      className="inline-block px-10 py-4 bg-[#19FF00] text-[#1C5D15] font-bold rounded-full hover:bg-white hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-[#19FF00]/30 uppercase tracking-wider text-sm"
                    >
                      {section.content.ctaText}
                    </a>
                    {section.content.secondaryCtaText && (
                      <a
                        href={section.content.secondaryCtaLink || '/store'}
                        className="inline-block px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 uppercase tracking-wider text-sm"
                      >
                        {section.content.secondaryCtaText}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            );

          // ── 6. TEXT/BANNER ──────────────────────────────────────────────
          case 'text':
            return (
              <section key={section.id} className="py-16 bg-[#19FF00] text-[#1C5D15]">
                <div className="max-w-6xl mx-auto px-6">
                  <div
                    className="text-center prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content.html }}
                  />
                </div>
              </section>
            );

          default:
            return (
              <DynamicSection
                key={section.id}
                section={section}
                language={language}
              />
            );
        }
      })}
    </div>
  );
}