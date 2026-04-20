import { Users, Target, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { handleAction } from "../utils/actions";

interface PurposeItem {
  icon: 'Users' | 'Target' | 'Lightbulb';
  title: string;
  description: string;
}

interface PurposeProps {
  purposes: PurposeItem[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaActionType?: string;
}

export function Purpose({ purposes, title, subtitle, ctaText, ctaLink, ctaActionType }: PurposeProps) {
  const navigate = useNavigate();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return Users;
      case 'Target':
        return Target;
      case 'Lightbulb':
        return Lightbulb;
      default:
        return Users;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && <h2 className="text-4xl font-black text-[#1C5D15] mb-4" dangerouslySetInnerHTML={{ __html: title }} />}
            {subtitle && <p className="text-[#629960] text-lg max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: subtitle }} />}

          </div>
        )}
        <div className="grid md:grid-cols-3 gap-10">

          {(purposes || []).map((purpose) => {
            const IconComponent = getIconComponent(purpose.icon);
            return (
              <div key={purpose.title} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[#F7F9CE]">
                  <IconComponent className="w-10 h-10 text-[#1C5D15]" />
                </div>
                <h3 className="text-2xl mb-4 text-[#1C5D15]" dangerouslySetInnerHTML={{ __html: purpose.title }} />

                <p className="text-[#629960] leading-relaxed" dangerouslySetInnerHTML={{ __html: purpose.description }}></p>
              </div>
            );
          })}
        </div>

        {ctaText && (
          <div className="text-center mt-16">
            <Button 
                onClick={() => handleAction(ctaActionType, ctaLink, navigate)}
                className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-10 py-4 rounded-full font-bold uppercase text-sm tracking-widest shadow-xl transition-all duration-300"
            >
                {ctaText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
