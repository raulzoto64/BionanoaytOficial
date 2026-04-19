"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabaseAPI, EcosystemMember, EcosystemMemberTranslation } from "../data/supabase";
import { Button } from "../components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem, 
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  type CarouselApi 
} from "../components/ui/carousel";
import { ecosystemPreloadCache } from "../data/BackgroundPreload";

interface EcosystemProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaActionType?: string;
  sectionId?: string; // Nuevo: ID de la sección para el scroll
  items?: Array<{
    title?: string;
    label?: string;
    description?: string;
    desc?: string;
    iconPath?: string;
  }>;
}

export function Ecosystem({ title, subtitle, items, sectionId, ctaText, ctaLink, ctaActionType }: EcosystemProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Inicialización instantánea desde caché si existe
  const [members, setMembers] = useState<EcosystemMember[]>(() => 
    ecosystemPreloadCache && ecosystemPreloadCache.language === language ? ecosystemPreloadCache.members : []
  );
  const [translations, setTranslations] = useState<Record<string, EcosystemMemberTranslation>>(() => 
    ecosystemPreloadCache && ecosystemPreloadCache.language === language ? ecosystemPreloadCache.translations : {}
  );
  const [loading, setLoading] = useState(() => 
    ecosystemPreloadCache && ecosystemPreloadCache.language === language ? false : true
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [language]);

  const loadMembers = async () => {
    // 1. Primero verificamos el caché del preloader (llenado en segundo plano al entrar a la Home)
    // 1. Verificamos el caché del preloader (centralizado)
    const { ecosystemPreloadCache } = await import('../data/BackgroundPreload');
    if (ecosystemPreloadCache && ecosystemPreloadCache.language === language) {
      setMembers(ecosystemPreloadCache.members);
      setTranslations(ecosystemPreloadCache.translations);
      setLoading(false);
      console.log('[Ecosystem] Cargado desde caché del preloader (instantáneo)');
      return;
    }

    // 2. Si no hay caché, cargamos de la base de datos
    setLoading(true);
    try {
      const ecosystemMembers = await supabaseAPI.getEcosystemMembers();
      
      const translationPromises = ecosystemMembers.map(async (member) => {
        const translation = await supabaseAPI.getEcosystemMemberTranslation(member.id, language);
        return { id: member.id, translation };
      });

      const translationsResult = await Promise.all(translationPromises);
      const translationMap: Record<string, EcosystemMemberTranslation> = {};
      translationsResult.forEach(({ id, translation }) => {
        translationMap[id] = translation;
      });

      // Actualizar el caché centralizado (para que sea instantáneo en el próximo render)
      const { setEcosystemPreloadCache } = await import('../data/BackgroundPreload');
      setEcosystemPreloadCache({
        members: ecosystemMembers,
        translations: translationMap,
        language
      });

      setMembers(ecosystemMembers);
      setTranslations(translationMap);
    } catch (error) {
      console.error('Error al cargar miembros del ecosistema:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estado de carga optimizado con menor padding
  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-[#629960]/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 lg:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 bg-[#1C5D15]/10 rounded-full w-32 animate-pulse" />
              <div className="h-12 bg-[#1C5D15]/10 rounded-xl w-64 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-[#629960]/10 rounded w-full animate-pulse" />
                <div className="h-4 bg-[#629960]/10 rounded w-5/6 animate-pulse" />
              </div>
            </div>
            {/* Skeleton que imita el carrusel para mantener la altura constante */}
            <div className="h-[480px] w-full max-w-[450px] bg-white/50 rounded-2xl border-2 border-dashed border-[#1C5D15]/10 flex items-center justify-center">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C5D15]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#629960]/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-10 lg:gap-16 items-center">
          
          {/* Lado Izquierdo: Texto */}
          <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="inline-block px-4 py-1.5 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4 font-bold text-sm tracking-wide shadow-sm">
              {language === 'es' ? 'Ecosistema' : 'Ecosystem'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1C5D15] tracking-tight">
              {title || (language === 'es' ? 'Nuestro Ecosistema' : 'Our Ecosystem')}
            </h2>
            <p className="text-lg md:text-xl mb-6 text-[#629960] leading-relaxed max-w-lg mx-auto md:mx-0">
              {subtitle || (language === 'es' 
                ? 'Conectamos innovadores, empresarios y profesionales para construir un ecosistema sostenible y tecnológico.' 
                : 'We connect innovators, entrepreneurs, and professionals to build a sustainable and technological ecosystem.')
              }
            </p>
            
            <div className="space-y-4 md:space-y-5 mb-0 md:mb-8 w-full">
              {(items && items.length > 0 ? items : [
                { 
                  title: language === 'es' ? 'Red de Innovadores' : 'Network of Innovators', 
                  description: language === 'es' ? 'Conectamos profesionales del sector' : 'We connect sector professionals', 
                  iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                },
                { 
                  title: language === 'es' ? 'Crecimiento Sostenible' : 'Sustainable Growth', 
                  description: language === 'es' ? 'Desarrollo responsable y ecológico' : 'Responsible and ecological development', 
                  iconPath: "M13 10V3L4 14h7v7l9-11h-7z" 
                }
              ]).map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                  <div className="mt-0 md:mt-1 bg-[#19FF00]/20 p-2 md:p-2.5 rounded-xl shrink-0">
                    <svg className="w-5 h-5 md:w-5 md:h-5 text-[#1C5D15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.iconPath || "M13 10V3L4 14h7v7l9-11h-7z"} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[#1C5D15] font-bold text-base md:text-lg">{item.title || item.label}</h4>
                    <p className="text-[#629960] text-sm md:text-base">{item.description || item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="hidden md:inline-flex bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg rounded-full px-8 uppercase text-sm font-bold tracking-wider h-12"
              onClick={() => handleAction(ctaActionType, ctaLink || "/ecosystem", navigate)}
            >
              {ctaText || (language === 'es' ? 'Conocer Más' : 'Learn More')}
            </Button>
          </div>

          {/* Lado Derecho: Carrusel Compacto */}
          <div className="relative mt-2 md:mt-0 flex justify-center w-full overflow-hidden md:overflow-visible px-2 sm:px-0"> 
            <Carousel 
              key={isMobile ? 'mobile-carousel' : 'desktop-carousel'}
              orientation={isMobile ? "horizontal" : "vertical"} 
              opts={{ loop: true, align: "start", slidesToScroll: 1 }}
              setApi={setCarouselApi}
              pauseOnHover={true}
              className={isMobile ? "w-full mt-2" : "h-[420px] md:h-[480px] w-full max-w-[450px] mb-5"}
            >
              <CarouselContent className={isMobile ? "-ml-2 py-4" : "mb-5 h-[480px] md:h-[500px]"}> 
                {members.map((member) => {
                  const translation = translations[member.id];
                  const initials = translation?.name ? translation.name.split(' ').map((n) => n.charAt(0)).join('').slice(0, 2) : 'EM';
                  
                  return (
                    <CarouselItem key={member.id} className={isMobile ? "pl-2 basis-[85%] sm:basis-1/2 focus:outline-none" : "basis-1/2 md:basis-[48%]"}>
                      <Link 
                        id={`member-${member.id}`}
                        to={member.slug ? `/ecosystem/${member.slug}` : '#'}
                        state={{ from: 'home', sectionId }}
                        className="block h-full group"
                        onClick={() => {
                          console.log('[EcosystemCard] Clicked member, saving state:', { from: 'home', sectionId });
                        }}
                      >
                        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#629960]/10 group-hover:border-[#19FF00] flex flex-col h-full mx-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-xl border-2 border-[#629960]/10 group-hover:border-[#19FF00] flex items-center justify-center bg-gradient-to-br from-[#1C5D15] to-[#629960] transition-colors overflow-hidden shrink-0 shadow-inner">
                              {member.image ? (
                                <img src={member.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-bold text-base">{initials}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base md:text-lg font-bold text-[#1C5D15] truncate">{translation?.name || 'Miembro'}</h3>
                              <p className="text-[10px] text-[#19FF00] font-bold bg-[#1C5D15] px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">{member.sector}</p>
                            </div>
                          </div>
                          
                          <p className="text-xs md:text-sm text-[#629960] line-clamp-none md:line-clamp-2 mb-3 flex-1">
                            {translation?.description}
                          </p>
                          
                          <div className="flex items-center text-[#1C5D15] font-bold text-xs group-hover:text-[#629960] transition-colors pt-2 border-t border-gray-50">
                            {language === 'es' ? 'Ver detalles' : 'View details'}
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {/* Controles para Desktop */}
              {!isMobile && (
                <>
                  <CarouselPrevious className="hidden md:flex -top-10 left-1/2 -translate-x-1/2 rotate-90 bg-white border-[#1C5D15]/10 text-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15]" />
                  <CarouselNext className="hidden md:flex -bottom-10 left-1/2 -translate-x-1/2 rotate-90 bg-white border-[#1C5D15]/10 text-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15]" />
                </>
              )}
              {/* Puntos para todos */}
              <CarouselDots className={isMobile ? "mt-2" : "absolute -right-8 top-1/2 -translate-y-1/2 flex-col gap-2"} />
            </Carousel>
          </div>

        </div>

        {/* Botón visible solo en móviles, debajo del carrusel */}
        <div className="mt-6 flex justify-center md:hidden">
          <Button 
            size="lg" 
            className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg rounded-full px-8 uppercase text-sm font-bold tracking-wider h-12"
            onClick={() => handleAction(ctaActionType, ctaLink || "/ecosystem", navigate)}
          >
            {ctaText || (language === 'es' ? 'Conocer Más' : 'Learn More')}
          </Button>
        </div>
      </div>
    </section>
  );
}