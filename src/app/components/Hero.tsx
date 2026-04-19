import { Button } from "./ui/button";
import { useNavigate } from 'react-router';
import { handleAction } from '../utils/actions';

interface HeroProps {
  content: Record<string, any>;
}

export function Hero({ content }: HeroProps) {
  const navigate = useNavigate();
  return (
    <section 
      className="relative flex items-center justify-center overflow-hidden"
      style={content.height ? { height: content.height, minHeight: 'auto' } : { minHeight: '100vh' }}
    >
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
        <h1 
          className={`${content.height ? 'text-3xl md:text-4xl mb-3' : 'text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] mb-6'} leading-tight`}
          dangerouslySetInnerHTML={{ __html: content.title || '' }}
        />

        <div 
          className={`${content.height ? 'text-lg md:text-xl mb-4' : 'text-xl md:text-2xl mb-10'} max-w-3xl mx-auto opacity-95 [&_p]:m-0`}
          dangerouslySetInnerHTML={{ __html: content.subtitle || '' }}
        />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

           {/* Primary Button */}
           {content.ctaText && (
             <Button 
               size="lg"
               className="bg-[#19FF00] text-[#1C5D15] hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 px-10 py-4 text-base shadow-xl hover:shadow-[#19FF00]/20 rounded-full uppercase font-bold tracking-wider h-12"
               onClick={() => handleAction(content.ctaActionType, content.ctaLink, navigate)}
             >
               {content.ctaText}
             </Button>
           )}

           {/* Secondary Button */}
           {content.secondaryCtaText && (
             <Button 
               size="lg"
               variant="outline"
               className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 px-10 py-4 text-base rounded-full uppercase font-bold tracking-wider h-12"
               onClick={() => handleAction(content.secondaryCtaActionType, content.secondaryCtaLink, navigate)}
             >
               {content.secondaryCtaText}
             </Button>
           )}
        </div>
      </div>
    </section>
  );
}
