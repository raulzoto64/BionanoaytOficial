import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { ensureExternalLink } from "../utils/url";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "./ui/carousel";
import { Globe, ExternalLink, Info } from "lucide-react";

interface Partner {
  name: string;
  placeholder: string;
  image: string;
  link?: string;
  description?: string;
  details?: string[];
}

interface TrustBarProps {
  partners: Partner[];
  title?: string;
  subtitle?: string;
}

export function TrustBar({ partners, title, subtitle }: TrustBarProps) {
  const { t } = useLanguage();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsScrolled(false);
  };

  return (
    <section className="bg-[#1C5D15] py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#19FF00]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-5 lg:px-6 relative z-10">
        {(title || subtitle) ? (
          <div className="text-center mb-10">
            {title && (
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[#19FF00] text-lg opacity-90 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <h3 className="text-center text-white/70 mb-8 text-sm tracking-wider uppercase flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-[#19FF00]" />
            {t('trustbar.title')}
          </h3>
        )}

        <Carousel
          opts={{
            align: partners.length > 5 ? "start" : "center",
            loop: partners.length > 5,
            dragFree: true
          }}
          className="w-full max-w-5xl mx-auto px-2 sm:px-10"
        >
          <CarouselContent className="py-4">
            {partners.map((partner) => (
              <CarouselItem key={partner.name} className="flex-none px-4">
                <div
                  onClick={() => handlePartnerClick(partner)}
                  className="flex flex-col w-36 rounded-xl border border-white/20 overflow-hidden group cursor-pointer hover:border-[#19FF00] transition-all duration-300 hover:shadow-xl hover:shadow-[#19FF00]/10 hover:-translate-y-1 bg-white/5"
                >
                  {/* Image area with hover overlay */}
                  <div className="relative w-full h-24 bg-white/10 overflow-hidden">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#1C5D15]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {t('btn.learn_more')} →
                      </span>
                    </div>
                  </div>

                  {/* Name - single line with ellipsis + tooltip */}
                  <div className="bg-black/30 px-3 py-2 border-t border-white/10 group-hover:bg-[#19FF00]/10 transition-colors">
                    <span
                      className="text-white text-[11px] font-bold block truncate text-center group-hover:text-[#19FF00] transition-colors"
                      title={partner.name}
                    >
                      {partner.name}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white/10 text-white hover:bg-[#19FF00] hover:text-[#1C5D15] border-white/20 hidden sm:flex" />
          <CarouselNext className="bg-white/10 text-white hover:bg-[#19FF00] hover:text-[#1C5D15] border-white/20 hidden sm:flex" />
          <CarouselDots dotClassName="bg-white/20" />
        </Carousel>
      </div>

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
              {/* Header with Background Image */}
              <div className="relative h-70 bg-[#1C5D15] overflow-hidden shrink-0">
                <img
                  src={selectedPartner.image}
                  alt={selectedPartner.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-10" />
              </div>

              {/* Content */}
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
                      <div 
                        className="text-[#1C5D15] text-sm leading-relaxed [&_p]:m-0"
                        dangerouslySetInnerHTML={{ __html: selectedPartner.description }}
                      />
                    </div>
                  )}

                  {selectedPartner.details && selectedPartner.details.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#1C5D15] uppercase tracking-wider flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        Detalles Clave:
                      </h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedPartner.details.map((detail, idx) => (
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

              {/* Footer Actions */}
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
}
