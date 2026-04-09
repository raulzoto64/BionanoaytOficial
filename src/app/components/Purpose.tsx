import { Users, Target, Lightbulb } from "lucide-react";

interface PurposeItem {
  icon: 'Users' | 'Target' | 'Lightbulb';
  title: string;
  description: string;
}

interface PurposeProps {
  purposes: PurposeItem[];
}

export function Purpose({ purposes }: PurposeProps) {
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
        <div className="grid md:grid-cols-3 gap-10">
          {purposes.map((purpose) => {
            const IconComponent = getIconComponent(purpose.icon);
            return (
              <div key={purpose.title} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[#F7F9CE]">
                  <IconComponent className="w-10 h-10 text-[#1C5D15]" />
                </div>
                <h3 className="text-2xl mb-4 text-[#1C5D15]">{purpose.title}</h3>
                <p className="text-[#629960] leading-relaxed">{purpose.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
