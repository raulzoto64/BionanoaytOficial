import {
  FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe,
  AlertTriangle, CheckCircle, Sprout, Building2, Fish, Apple,
  HeartPulse, Shirt, Warehouse, Shield, Star, ShoppingCart, Package, Truck, Award, Users
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FlaskConical, FileCheck, Microscope, Factory, TrendingUp, Globe,
  AlertTriangle, CheckCircle, Sprout, Building2, Fish, Apple,
  HeartPulse, Shirt, Warehouse, Shield, Star, ShoppingCart, Package, Truck, Award, Users
};

function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICON_MAP[name] || FlaskConical;
  return <C className={className} />;
}

export function FlipCards({ items }: { items: any[] }) {
  return (
    <section className="py-10">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {items?.map((item: any, index: number) => (
            <div key={index} className="group flip-card h-28 min-h-[7rem]">
              <div className="flip-card-inner relative h-full rounded-2xl shadow-sm transition-transform duration-500 bg-transparent" style={{ transformStyle: 'preserve-3d' }}>
                <div className="flip-card-face absolute inset-0 rounded-2xl bg-white border border-[#E8F0E2] p-2 flex flex-col items-center justify-center gap-1.5 text-center [backface-visibility:hidden]">
                  <div className="w-9 h-9 rounded-full bg-[#1C5D15] flex items-center justify-center">
                    <Icon name={item.icon} className="w-4.5 h-4.5 text-[#19FF00]" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1C5D15] leading-none">
                    {item.title}
                  </span>
                </div>
                <div className="flip-card-face flip-card-back absolute inset-0 rounded-2xl bg-[#1C5D15] text-white p-2 flex flex-col justify-center gap-1.5 text-center" style={{ transform: 'rotateY(180deg)' }}>
                  <div className="flex items-center gap-1.5 justify-center">
                    <Icon name={item.icon} className="w-3.5 h-3.5 text-[#19FF00]" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#19FF00] leading-none">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[0.65rem] leading-[1rem] text-white/85">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
