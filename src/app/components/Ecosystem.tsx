import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import { useLanguage } from "../contexts/LanguageContext";

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors shadow-lg"
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
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors shadow-lg"
    >
      <ChevronLeft className="w-6 h-6 text-[#1C5D15]" />
    </button>
  );
}

interface Ally {
  name: string;
  sector: string;
  initials: string;
  image?: string;
}

interface EcosystemProps {
  allies: Ally[];
}

export function Ecosystem({ allies }: EcosystemProps) {
  const { t } = useLanguage();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
        }
      }
    ],
    dotsClass: "slick-dots !bottom-[-40px]",
    customPaging: () => (
      <div className="w-3 h-3 bg-[#629960]/30 rounded-full hover:bg-[#19FF00] transition-colors" />
    ),
  };

  return (
    <section className="py-20 bg-[#629960]/10 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl text-center mb-12 text-[#1C5D15]">
          {t('ecosystem.title')}
        </h2>
        
        <div className="relative px-12">
          <Slider {...settings}>
            {allies.map((ally) => (
              <div key={ally.name} className="px-4">
                <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-[#629960]/20 hover:border-[#19FF00] group h-72 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-[#629960] group-hover:border-[#19FF00] flex items-center justify-center bg-gradient-to-br from-[#1C5D15] to-[#629960] transition-colors overflow-hidden">
                    {ally.image ? (
                      <img
                        src={ally.image}
                        alt={ally.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-3xl">{ally.initials}</span>
                    )}
                  </div>
                  <h3 className="text-2xl mb-2 text-[#1C5D15]">{ally.name}</h3>
                  <p className="text-[#629960]">{ally.sector}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
