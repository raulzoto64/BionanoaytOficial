import { useState, useRef, useEffect } from "react";
import {
  Lightbulb,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { handleAction } from "../utils/actions";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "./ui/carousel";

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
        dangerouslySetInnerHTML={{ __html: text }}
      />

    </div>
  );
};

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: "Lightbulb" | "FileCheck" | "TrendingUp";
}

interface TimelineProps {
  milestones: Milestone[];
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaActionType?: string;
}

export function Timeline({ milestones, title, subtitle, description, ctaText, ctaLink, ctaActionType }: TimelineProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  return (
    <section className="py-24 bg-gradient-to-b from-[#1C5D15] to-[#0A2E07] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#19FF00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#19FF00]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full mb-6 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
            {t("timeline.label") || "Nuestra Historia"}
          </div>
          <h2 
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
            dangerouslySetInnerHTML={{ __html: title || t("timeline.title") }}
          />
          {subtitle && (
            <p 
              className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
          {description && (
            <p 
              className="mt-4 text-[#19FF00]/80 font-medium max-w-xl mx-auto"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {milestones.map((milestone, index) => {
                const IconComponent = getIconComponent(milestone.icon);
                return (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-4xl font-black text-[#19FF00] opacity-40 group-hover:opacity-100 transition-opacity">
                          {milestone.year}
                        </div>
                        <div className="w-12 h-12 bg-[#19FF00] text-[#1C5D15] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                          <IconComponent size={24} />
                        </div>
                      </div>
                      <h3 
                        className="text-xl font-bold text-white mb-4 group-hover:text-[#19FF00] transition-colors"
                        dangerouslySetInnerHTML={{ __html: milestone.title }}
                      />

                      <TextWithTooltip
                        text={milestone.description}
                        className="text-white/60 leading-relaxed text-sm"
                        lines={3}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-center mt-12 gap-4">
              <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-[#19FF00] hover:text-[#1C5D15]" />
              <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-[#19FF00] hover:text-[#1C5D15]" />
            </div>
            <CarouselDots dotClassName="bg-white/20" />
          </Carousel>
        </div>

        {ctaText && (
          <div className="text-center mt-12">
            <Button 
                onClick={() => handleAction(ctaActionType, ctaLink, navigate)}
                className="bg-[#19FF00] text-[#1C5D15] hover:bg-white px-10 py-4 rounded-full font-bold uppercase text-sm tracking-widest shadow-xl transition-all duration-300"
            >
                {ctaText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
