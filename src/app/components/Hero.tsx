import { Button } from "./ui/button";

interface HeroProps {
  content: Record<string, any>;
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Preload/Discovery Image - invisible but helps browser prioritize */}
      <img 
        src={content.backgroundImage} 
        alt="" 
        className="hidden" 
        loading="eager"
        // @ts-ignore
        fetchpriority="high"
      />
      
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
      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-6 text-center text-white">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] mb-6 leading-tight">
          {content.title}
        </h1>
        <div 
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95 [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: content.subtitle || '' }}
        />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary Button */}
          {content.ctaText && (
            <Button 
              size="lg"
              className="bg-[#19FF00] text-[#1C5D15] hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 px-10 py-4 text-base shadow-xl hover:shadow-[#19FF00]/20 rounded-full uppercase font-bold tracking-wider h-12"
              asChild
            >
              {content.ctaLink ? (
                <a href={content.ctaLink}>{content.ctaText}</a>
              ) : (
                <span>{content.ctaText}</span>
              )}
            </Button>
          )}

          {/* Secondary Button */}
          {content.secondaryCtaText && (
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 px-10 py-4 text-base rounded-full uppercase font-bold tracking-wider h-12"
              asChild
            >
              {content.secondaryCtaLink ? (
                <a href={content.secondaryCtaLink}>{content.secondaryCtaText}</a>
              ) : (
                <span>{content.secondaryCtaText}</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
