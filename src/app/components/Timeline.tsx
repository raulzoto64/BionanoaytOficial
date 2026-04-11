import { useState, useRef, useEffect } from "react";
import {
  Lightbulb,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
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
      >
        {text}
      </p>
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
}

export function Timeline({ milestones, title, subtitle, description }: TimelineProps) {
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

  return (
    <section className="py-20 bg-[#1C5D15] text-white pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title || t("timeline.title")}
          </h2>
          {subtitle && (
            <h3 className="text-xl text-white/90 mb-4">{subtitle}</h3>
          )}
          {description && (
            <div 
              className="text-lg text-white/80 max-w-3xl mx-auto prose prose-invert"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className="px-2 sm:px-16 w-full max-w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            pauseOnHover={false}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4">
              {milestones
                .filter((m) => m.title.trim() && m.description.trim())
                .map((milestone, index) => {
                  const IconComponent = getIconComponent(milestone.icon);
                  return (
                    <CarouselItem
                      key={index}
                      className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="bg-[#629960]/30 rounded-2xl p-8 hover:bg-[#629960]/40 transition-all duration-300 h-80 flex flex-col items-center justify-center border border-white/10 shadow-xl">
                        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-[#19FF00] rounded-full shrink-0 shadow-inner">
                          <IconComponent className="w-8 h-8 text-[#1C5D15]" />
                        </div>

                        <div className="text-[#19FF00] font-bold text-2xl mb-2">
                          {milestone.year}
                        </div>

                        <TextWithTooltip
                          text={milestone.title}
                          lines={1}
                          className="text-xl font-semibold mb-3 text-center cursor-default"
                        />

                        <TextWithTooltip
                          text={milestone.description}
                          lines={3}
                          className="text-white/80 text-center text-sm leading-relaxed"
                        />
                      </div>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
            <CarouselPrevious className="bg-white/10 text-white hover:bg-[#19FF00] hover:text-[#1C5D15] border-white/20 hidden sm:flex" />
            <CarouselNext className="bg-white/10 text-white hover:bg-[#19FF00] hover:text-[#1C5D15] border-white/20 hidden sm:flex" />
            <CarouselDots dotClassName="bg-white/20" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
