"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { supabaseAPI, EcosystemMember, EcosystemMemberTranslation } from "../data/supabase";
import { Button } from "../components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "../components/ui/carousel";

export function Ecosystem() {
  const { language } = useLanguage();
  const [members, setMembers] = useState<EcosystemMember[]>([]);
  const [translations, setTranslations] = useState<Record<string, EcosystemMemberTranslation>>({});
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    loadMembers();
  }, [language]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const ecosystemMembers = await supabaseAPI.getEcosystemMembers();
      setMembers(ecosystemMembers);

      const translationPromises = ecosystemMembers.map(async (member) => {
        const translation = await supabaseAPI.getEcosystemMemberTranslation(member.id, language);
        return { id: member.id, translation };
      });

      const translationsResult = await Promise.all(translationPromises);
      const translationMap: Record<string, EcosystemMemberTranslation> = {};
      translationsResult.forEach(({ id, translation }) => {
        translationMap[id] = translation;
      });

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
      <section className="py-12 md:py-16 bg-[#629960]/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 bg-[#1C5D15]/10 rounded w-32 animate-pulse" />
              <div className="h-12 bg-[#1C5D15]/10 rounded w-64 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-[180px] bg-white rounded-xl animate-pulse" />
              <div className="h-[180px] bg-white rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#629960]/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Lado Izquierdo: Texto */}
          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4 font-bold text-sm tracking-wide shadow-sm">
              {language === 'es' ? 'Ecosistema' : 'Ecosystem'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1C5D15] tracking-tight">
              {language === 'es' ? 'Nuestro Ecosistema' : 'Our Ecosystem'}
            </h2>
            <p className="text-lg md:text-xl mb-8 text-[#629960] leading-relaxed max-w-lg">
              {language === 'es' 
                ? 'Conectamos innovadores, empresarios y profesionales para construir un ecosistema sostenible y tecnológico.' 
                : 'We connect innovators, entrepreneurs, and professionals to build a sustainable and technological ecosystem.'
              }
            </p>
            
            <div className="space-y-5 mb-8">
              {[
                { 
                  label: language === 'es' ? 'Red de Innovadores' : 'Network of Innovators', 
                  desc: language === 'es' ? 'Conectamos profesionales del sector' : 'We connect sector professionals', 
                  iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                },
                { 
                  label: language === 'es' ? 'Crecimiento Sostenible' : 'Sustainable Growth', 
                  desc: language === 'es' ? 'Desarrollo responsable y ecológico' : 'Responsible and ecological development', 
                  iconPath: "M13 10V3L4 14h7v7l9-11h-7z" 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 bg-[#19FF00]/20 p-2.5 rounded-xl shrink-0">
                    <svg className="w-5 h-5 text-[#1C5D15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.iconPath} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[#1C5D15] font-bold text-lg">{item.label}</h4>
                    <p className="text-[#629960] text-sm md:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-[#1C5D15] text-white hover:bg-[#1C5D15]/90 px-10 rounded-xl transition-all shadow-md hover:shadow-lg">
              <Link to="/ecosystem">
                {language === 'es' ? 'Conocer Más' : 'Learn More'}
              </Link>
            </Button>
          </div>

          {/* Lado Derecho: Carrusel Compacto */}
          <div className="relative mt-0 md:mt-0 flex justify-center"> 
            <Carousel 
              orientation="vertical" 
              opts={{ loop: true, align: "start", slidesToScroll: 1 }}
              setApi={setCarouselApi}
              className="h-[420px] md:h-[480px] w-full max-w-[450px] mb-5"
            >
              <CarouselContent className="-mt-4 mb-5 h-[480px] md:h-[500px]"> 
                {members.map((member) => {
                  const translation = translations[member.id];
                  const initials = translation?.name ? translation.name.split(' ').map((n) => n.charAt(0)).join('').slice(0, 2) : 'EM';
                  
                  return (
                    <CarouselItem key={member.id} className="pt-4 basis-1/2 md:basis-[48%]">
                      <Link 
                        to={member.slug ? `/ecosystem/${member.slug}` : '#'}
                        className="block h-full group"
                      >
                        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#629960]/10 group-hover:border-[#19FF00] flex flex-col h-full">
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
                          
                          <p className="text-xs md:text-sm text-[#629960] line-clamp-2 mb-3 flex-1">
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
            </Carousel>
          </div>

        </div>
      </div>
    </section>
  );
}