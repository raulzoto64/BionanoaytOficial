interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsCardsProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
}

export function StatsCards({ title, subtitle, stats = [] }: StatsCardsProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-[#1C5D15] to-[#0d3a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {title && <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>}
        {subtitle && <p className="text-white/80 mb-10">{subtitle}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-[#19FF00] mb-1">{stat.value}</div>
              <div className="text-white/90 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
              {stat.description && <p className="text-white/60 text-xs mt-1">{stat.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
