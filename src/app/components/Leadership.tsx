import { useLanguage } from "../contexts/LanguageContext";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface LeadershipProps {
  members: TeamMember[];
  title: string;
  subtitle: string;
}

export function Leadership({ members, title, subtitle }: LeadershipProps) {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4">
            {t('leadership.title')}
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 text-[#1C5D15]">
            {title}
          </h2>
          <p className="text-xl text-[#629960] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {members.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="relative inline-block mb-4">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#629960]/20 shadow-lg group-hover:scale-105 group-hover:border-[#19FF00] group-hover:shadow-[#19FF00]/20 transition-all duration-300 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Green Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#19FF00]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-[#1C5D15] font-bold text-sm tracking-widest uppercase">BioNano A&T</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl mb-2 text-[#1C5D15]">{member.name}</h3>
              <p className="text-[#629960]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
