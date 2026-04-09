import { useLanguage } from "../contexts/LanguageContext";

interface Partner {
  name: string;
  placeholder: string;
  image: string;
  link?: string;
}

interface TrustBarProps {
  partners: Partner[];
}

export function TrustBar({ partners }: TrustBarProps) {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[#1C5D15] py-12">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        <h3 className="text-center text-white/70 mb-8 text-sm tracking-wider uppercase">
          {t('trustbar.title')}
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.link || '#'}
              target={partner.link ? "_blank" : undefined}
              rel={partner.link ? "noopener noreferrer" : undefined}
              className="flex flex-col w-36 rounded-xl border border-white/20 overflow-hidden group cursor-pointer hover:border-[#19FF00] transition-all duration-300 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-1"
            >
              {/* Image area with hover overlay */}
              <div className="relative w-full h-24 bg-white/5 overflow-hidden">
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
                  <span className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                    Ver más →
                  </span>
                </div>
              </div>

              {/* Name - single line with ellipsis + tooltip */}
              <div className="bg-black/20 px-3 py-2">
                <span
                  className="text-white text-[11px] font-bold block truncate text-center"
                  title={partner.name}
                >
                  {partner.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
