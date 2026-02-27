interface Partner {
  name: string;
  placeholder: string;
  image: string;
}

interface TrustBarProps {
  partners: Partner[];
}

export function TrustBar({ partners }: TrustBarProps) {
  return (
    <section className="bg-[#1C5D15] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-center text-white/70 mb-8 text-sm tracking-wider uppercase">
          Respaldados por
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center w-32 h-32 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all hover:scale-105 overflow-hidden group"
            >
              <div className="w-full h-20 overflow-hidden relative">
                <img 
                  src={partner.image} 
                  alt={partner.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
              </div>
              <span className="text-white text-sm font-bold opacity-90 mt-2">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
