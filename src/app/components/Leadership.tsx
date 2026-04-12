import { useLanguage } from "../contexts/LanguageContext";
import { Linkedin } from "lucide-react";
import { ensureExternalLink } from "../utils/url";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "./ui/carousel";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

interface LeadershipProps {
  members: TeamMember[];
  title: string;
  subtitle: string;
}

// Tarjeta de miembro reutilizable
function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="relative mb-6">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#629960]/10 shadow-lg group-hover:scale-110 group-hover:border-[#19FF00] group-hover:shadow-[#19FF00]/30 transition-all duration-500 relative bg-gray-100 mx-auto">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* LinkedIn Overlay on Hover */}
          <div className="absolute inset-0 bg-[#3AC026]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
            {member.linkedin ? (
              <a
                href={ensureExternalLink(member.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white text-[#1C5D15] rounded-full shadow-xl hover:scale-125 hover:bg-[#19FF00] transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                title="Ver Perfil de LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            ) : (
              <span className="text-white font-bold text-[10px] tracking-widest uppercase bg-[#1C5D15]/80 px-3 py-1 rounded-full">
                Bionano A&T
              </span>
            )}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#1C5D15] group-hover:text-[#3AC026] transition-colors duration-300 text-center">
        {member.name}
      </h3>
      <p className="text-[#629960] font-medium text-center">{member.role}</p>
    </div>
  );
}

export function Leadership({ members, title, subtitle }: LeadershipProps) {
  const { t } = useLanguage();
  const useCarousel = members.length > 3;

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4 font-bold text-sm">
            {t('leadership.title')}
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 text-[#1C5D15] font-bold">
            {title}
          </h2>
          <p className="text-xl text-[#629960] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* ── Móvil: siempre grid ──────────────────────────────────────── */}
        {/* ── Tablet/Desktop > 3: Carrusel ────────────────────────────── */}

        {useCarousel ? (
          <>
            {/* Carrusel: solo en md+ */}
            <div className="hidden md:block px-10">
              <Carousel
                opts={{ align: "start", loop: true }}
                pauseOnHover={false}
                className="w-full"
              >
                <CarouselContent className="-ml-6">
                  {members.map((member) => (
                    <CarouselItem
                      key={member.name}
                      className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="py-4">
                        <MemberCard member={member} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white border-2 border-[#629960]/20 text-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] hover:border-[#19FF00]" />
                <CarouselNext className="bg-white border-2 border-[#629960]/20 text-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] hover:border-[#19FF00]" />
                <CarouselDots dotClassName="bg-[#629960]/30" />
              </Carousel>
            </div>

            {/* Grid vertical en móvil */}
            <div className="md:hidden flex flex-col gap-12 items-center">
              {members.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </>
        ) : (
          /* Grid estático cuando son 3 o menos */
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-16">
            {members.map((member) => (
              <div key={member.name} className="w-64">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
