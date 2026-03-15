import { useLanguage } from "../../contexts/LanguageContext";

export function TimelineHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {t('timeline.title')}
      </h2>
      <p className="text-lg text-white/80 max-w-3xl mx-auto">
        {t('timeline.description')}
      </p>
    </div>
  );
}