import { Button } from "./ui/button";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
  };
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${content.backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-[#1C5D15]/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
          {content.title}
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95">
          {content.subtitle}
        </p>
        <Button 
          size="lg"
          className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90 px-8 py-6 text-lg shadow-lg"
        >
          {content.ctaText}
        </Button>
      </div>
    </section>
  );
}
