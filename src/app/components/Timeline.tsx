import { Lightbulb, FileCheck, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import { useLanguage } from "../contexts/LanguageContext";

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors"
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
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors"
    >
      <ChevronLeft className="w-6 h-6 text-[#1C5D15]" />
    </button>
  );
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: 'Lightbulb' | 'FileCheck' | 'TrendingUp';
}

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  const { t } = useLanguage();
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb':
        return Lightbulb;
      case 'FileCheck':
        return FileCheck;
      case 'TrendingUp':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
      <div className="w-3 h-3 bg-[#19FF00]/30 rounded-full hover:bg-[#19FF00] transition-colors" />
    ),
  };

  return (
    <section className="py-20 bg-[#1C5D15] text-white pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl text-center mb-16">
          {t('timeline.title')}
        </h2>

        <div className="relative px-12">
          <Slider {...settings}>
            {milestones.filter(milestone => milestone.title.trim() && milestone.description.trim()).map((milestone, index) => {
              const IconComponent = getIconComponent(milestone.icon);
              return (
                <div key={index} className="px-4">
                  <div className="bg-[#629960]/30 rounded-xl p-6 hover:bg-[#629960]/40 transition-colors h-64 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-[#19FF00] rounded-full">
                      <IconComponent className="w-8 h-8 text-[#1C5D15]" />
                    </div>
                    <div className="text-[#19FF00] text-2xl mb-2 text-center">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl mb-2 text-center">{milestone.title}</h3>
                    <p className="text-white/80 text-center">{milestone.description}</p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}
