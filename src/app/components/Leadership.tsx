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
      <div className="max-w-6xl mx-auto px-6">
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

        <div className="grid md:grid-cols-3 gap-10">
          {members.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="relative inline-block mb-4">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#19FF00] shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
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
