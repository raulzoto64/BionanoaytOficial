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
        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.link || '#'}
              target={partner.link ? "_blank" : undefined}
              rel={partner.link ? "noopener noreferrer" : undefined}
              className={`flex flex-col items-center justify-center w-36 min-h-[144px] bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-75 hover:scale-105 overflow-hidden group ${!partner.link ? 'cursor-pointer' : 'cursor-pointer'}`}
            >
              <div className="w-full h-24 overflow-hidden relative border-b border-white/5 bg-white/5 flex items-center justify-center">
                <img 
                  src={partner.image} 
                  alt={partner.name}
                  className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-75 p-2"
                />
              </div>
              <span className="text-white text-[11px] font-bold opacity-100 px-3 py-2 leading-tight w-full text-center break-words flex items-center justify-center min-h-[40px] bg-black/10">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
