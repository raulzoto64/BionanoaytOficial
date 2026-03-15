import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Lightbulb,
  FileCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Slider from "react-slick";
import { useLanguage } from "../contexts/LanguageContext";

// Sub-componente para detectar si el texto se corta y mostrar tooltip
const TextWithTooltip = ({
  text,
  className,
  lines = 1,
}: {
  text: string;
  className: string;
  lines?: number;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const checkOverflow = () => {
    const el = textRef.current;
    if (el) {
      // Si el contenido es más grande que el espacio visible, activamos el tooltip
      const isOverflowing =
        lines === 1
          ? el.scrollWidth > el.clientWidth
          : el.scrollHeight > el.clientHeight;
      setShowTooltip(isOverflowing);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div className="w-full">
      <p
        ref={textRef}
        title={showTooltip ? text : undefined}
        className={`${className} ${lines === 1 ? "truncate" : "line-clamp-3"} transition-all`}
        style={
          lines > 1
            ? {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
              }
            : {}
        }
      >
        {text}
      </p>
    </div>
  );
};

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

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: "Lightbulb" | "FileCheck" | "TrendingUp";
}

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  const { t } = useLanguage();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Lightbulb":
        return Lightbulb;
      case "FileCheck":
        return FileCheck;
      case "TrendingUp":
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const settings = {
    dots: true,
    infinite: milestones.length > 3, // Solo infinito si hay suficientes cartas
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0, // Añadido para estabilidad
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    swipe: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: milestones.length > 2,
        },
      },
      {
        breakpoint: 768, // Ajustado de 640 a 768 para tablets/móviles grandes
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Desactivar flechas en móvil
        },
      },
    ],
    dotsClass: "slick-dots !bottom-[-40px]",
    customPaging: () => (
      <div className="w-3 h-3 bg-[#19FF00]/30 rounded-full hover:bg-[#19FF00] transition-colors" />
    ),
  };

  return (
    <section className="py-20 bg-[#1C5D15] text-white pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl text-center mb-16 font-bold">
          {t("timeline.title")}
        </h2>

        <div className="relative px-10 md:px-16">
          <Slider {...settings}>
            {milestones
              .filter((m) => m.title.trim() && m.description.trim())
              .map((milestone, index) => {
                const IconComponent = getIconComponent(milestone.icon);
                return (
                  <div key={index} className="px-3">
                    <div className="bg-[#629960]/30 rounded-2xl p-8 hover:bg-[#629960]/40 transition-all duration-300 h-80 flex flex-col items-center justify-center border border-white/10 shadow-xl">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-[#19FF00] rounded-full shrink-0 shadow-inner">
                        <IconComponent className="w-8 h-8 text-[#1C5D15]" />
                      </div>

                      <div className="text-[#19FF00] font-bold text-2xl mb-2">
                        {milestone.year}
                      </div>

                      {/* Título: 1 línea. Tooltip solo si se corta */}
                      <TextWithTooltip
                        text={milestone.title}
                        lines={1}
                        className="text-xl font-semibold mb-3 text-center cursor-default"
                      />

                      {/* Descripción: 3 líneas. Tooltip solo si se corta */}
                      <TextWithTooltip
                        text={milestone.description}
                        lines={3}
                        className="text-white/80 text-center text-sm leading-relaxed"
                      />
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
