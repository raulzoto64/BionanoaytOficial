import { Button } from "./ui/button";

interface HeroBlogProps {
  content: Record<string, any>;
}

export function HeroBlog({ content }: HeroBlogProps) {
  return (
    <section className="relative h-[380px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${content.backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-[#1C5D15]/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-6 text-center text-white">
        <div className="inline-block px-4 py-1.5 bg-[#19FF00]/20 text-white rounded-full mb-4 font-bold text-sm tracking-widest uppercase">
          {content.badge || "Blog"}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
          {content.title}
        </h1>
        
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      </div>
    </section>
  );
}
