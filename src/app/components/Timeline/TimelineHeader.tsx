import { useLanguage } from "../../contexts/LanguageContext";

interface TimelineHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function TimelineHeader({ title, subtitle, description }: TimelineHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        ??? {title || t('timeline.title')}
      </h2>
      {subtitle && <h3 className="text-xl text-white/90 mb-4">{subtitle}</h3>}
      <p className="text-lg text-white/80 max-w-3xl mx-auto">
        {description || t('timeline.description')}
      </p>
    </div>
  );
}