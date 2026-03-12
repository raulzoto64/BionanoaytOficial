import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { supabaseAPI, EcosystemMember, EcosystemMemberTranslation } from "../data/supabase";
import { Button } from "../components/ui/button";

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute -right-15 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors shadow-lg"
    >
      <ChevronRight className="w-6 h-6 text-[#1C5D15]" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute -left-15 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors shadow-lg"
    >
      <ChevronLeft className="w-6 h-6 text-[#1C5D15]" />
    </button>
  );
}

interface EcosystemProps {}

export function Ecosystem({}: EcosystemProps) {
  const { t, language } = useLanguage();
  const [members, setMembers] = useState<EcosystemMember[]>([]);
  const [translations, setTranslations] = useState<Record<string, EcosystemMemberTranslation>>({});
  const [loading, setLoading] = useState(true);

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipe: true,
    draggable: true,
    touchMove: true,
    touchThreshold: 5,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          nextArrow: undefined,
          prevArrow: undefined
        }
      }
    ],
    dotsClass: "slick-dots !bottom-[-40px]",
    customPaging: () => (
      <div className="w-3 h-3 bg-[#629960]/30 rounded-full hover:bg-[#19FF00] transition-colors" />
    ),
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#629960]/10 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl text-center mb-12 text-[#1C5D15]">
            {t('ecosystem.title')}
          </h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#629960]">Cargando miembros...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#629960]/10 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl text-center mb-12 text-[#1C5D15]">
          {t('ecosystem.title')}
        </h2>
        
        <div className="relative px-4 md:px-16 lg:px-20">
          <Slider {...settings}>
            {members.map((member) => {
              const translation = translations[member.id];
              const initials = translation?.name ? translation.name.split(' ').map((n: string) => n.charAt(0)).join('') : 'EM';
              
              return (
                <div key={member.id} className="px-4">
                  <Link 
                    to={member.slug ? `/ecosystem/${member.slug}` : '#'}
                    className="block"
                  >
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-[#629960]/20 hover:border-[#19FF00] group h-auto flex flex-col items-center">
                      <div className="w-32 h-32 mx-auto mt-4 mb-4 rounded-full border-4 border-[#629960] group-hover:border-[#19FF00] flex items-center justify-center bg-gradient-to-br from-[#1C5D15] to-[#629960] transition-colors overflow-hidden flex-shrink-0">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={translation?.name || 'Miembro del ecosistema'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-3xl">{initials}</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-start mt-2">
                        <h3 className="text-xl mb-2 text-[#1C5D15]">{translation?.name || 'Miembro'}</h3>
                        <p className="text-[#629960] mb-3">{member.sector}</p>
                        {translation?.description && (
                          <p className="text-sm text-[#629960] line-clamp-3 mb-4">
                            {translation.description}
                          </p>
                        )}
                        <Button className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] self-center">
                          Ver más
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}
