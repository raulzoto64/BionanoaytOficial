import { Button } from "./ui/button";
import { Leaf, Shield, Droplets } from "lucide-react";

interface Feature {
  icon: 'Shield' | 'Leaf' | 'Droplets';
  title: string;
  description: string;
}

interface FeaturedProductProps {
  content: Record<string, any>;
}

export function FeaturedProduct({ content }: FeaturedProductProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return Shield;
      case 'Leaf':
        return Leaf;
      case 'Droplets':
        return Droplets;
      default:
        return Shield;
    }
  };

  return (
    <section className="py-20 bg-[#629960]/10">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1C5D15] to-[#629960] p-8">
              <img
                src={content.productImage}
                alt={content.productName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4">
              {content.title}
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 text-[#1C5D15]">
              {content.productName}
            </h2>
            <p className="text-xl mb-6 text-[#629960]">
              {content.productDescription}
            </p>
            
            <div className="space-y-4 mb-8">
              {content.features.map((feature: any, index: number) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 bg-[#19FF00]/20 p-2 rounded-lg">
                      <IconComponent className="w-5 h-5 text-[#1C5D15]" />
                    </div>
                    <div>
                      <h4 className="text-[#1C5D15] mb-1">{feature.title}</h4>
                      <p className="text-[#629960]">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button 
              size="lg"
              className="mt-4 bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg rounded-full px-8 uppercase text-sm font-bold tracking-wider h-12"
              asChild
            >
              {content.ctaLink ? (
                <a href={content.ctaLink}>{content.ctaText}</a>
              ) : (
                <span>{content.ctaText}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
