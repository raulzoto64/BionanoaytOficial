"use client";

import { useLanguage, Language } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import {
  supabaseAPI,
  EcosystemMember,
  EcosystemMemberTranslation,
  PageContent,
  Section
} from "../data/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ContentCard } from "../components/ContentCard";
import { useDatabase } from "../hooks/useDatabase";
import { SEO } from "../components/SEO";
import { TrustBar } from "../components/TrustBar";
import { DynamicSection } from "../components/DynamicSection";


// ── Componente de Catálogo de Miembros ──────────────────────────────────────
function EcosystemCatalog({ language }: { language: Language }) {
  const [members, setMembers] = useState<EcosystemMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<EcosystemMember[]>([]);
  const [translations, setTranslations] = useState<Record<string, EcosystemMemberTranslation>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadMembers();
  }, [language]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const ecosystemMembers = await supabaseAPI.getEcosystemMembers();
      setMembers(ecosystemMembers);
      setFilteredMembers(ecosystemMembers);

      const uniqueCategories = Array.from(new Set(ecosystemMembers.map((member: any) => member.sector))) as string[];
      setCategories(uniqueCategories);

      const translationPromises = ecosystemMembers.map(async (member: any) => {
        const translation = await supabaseAPI.getEcosystemMemberTranslation(member.id, language);
        return { id: member.id, translation };
      });

      const translationsResult = await Promise.all(translationPromises);
      const translationMap: Record<string, EcosystemMemberTranslation> = {};
      translationsResult.forEach(({ id, translation }) => {
        translationMap[id] = translation;
      });

      setTranslations(translationMap);
      console.log('[EcosystemCatalog] Members and translations LOADED:', ecosystemMembers.length);
    } catch (error) {
      console.error('[EcosystemCatalog] Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(members.filter(member => member.sector === category));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-[280px] bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-64 bg-white border-[#629960]/20 focus:border-[#1C5D15] rounded-xl shadow-sm">
            <SelectValue placeholder={language === 'es' ? 'Filtrar por sector' : 'Filter by sector'} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#629960]/10">
            <SelectItem value="all">
              {language === 'es' ? 'Todos los sectores' : 'All sectors'}
            </SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => (
          <ContentCard
            key={member.id}
            type="ecosystem"
            data={{
              id: member.id,
              slug: member.slug,
              image: member.image,
              sector: member.sector,
              translation: {
                name: translations[member.id]?.name || 'Miembro',
                description: translations[member.id]?.description || ''
              }
            }}
          />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-lg text-[#629960] font-medium">
            {language === 'es' ? 'No se encontraron miembros en este sector.' : 'No members found in this sector.'}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Componente Hero Especializado para Ecosistema ───────────────────────────
function EcosystemBanner({ content }: { content: any }) {
  return (
    <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${content.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-[#1C5D15]/85"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-5 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-black mb-3">
          {content.title}
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>
      </div>
    </section>
  );
}

// ── Página Principal Dinámica ──────────────────────────────────────────────
export function EcosystemPage() {
  const { language } = useLanguage();
  const { updateTrigger } = useDatabase();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageContent();
  }, [language, updateTrigger]);



  const loadPageContent = async () => {
    setLoading(true);
    try {
      const content = await supabaseAPI.getPageContent("page-ecosystem", language);
      setPageContent(content);
    } catch (error) {
      console.error("Error loading ecosystem page content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C5D15]"></div>
      </div>
    );
  }

  // Fallback si no hay contenido en la DB
  if (!pageContent || pageContent.sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]/30">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-[#1C5D15]/10 max-w-md">
          <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">Página en Construcción</h2>
          <p className="text-[#629960] mb-8">Estamos configurando el ecosistema. Por favor, vuelve pronto.</p>
          <div className="bg-[#19FF00]/10 p-4 rounded-xl text-xs text-[#1C5D15] font-mono">
            ID: page-ecosystem
          </div>
        </div>
      </div>
    );
  }

  const heroSection = pageContent.sections.find(s => s.type === "hero");
  const seoData = heroSection?.content?.seo || {};

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={seoData.metaTitle || (language === 'es' ? 'Ecosistema - BionanoAyT' : 'Ecosystem - BionanoAyT')}
        description={seoData.metaDescription}
        keywords={seoData.metaKeywords}
      />

      {pageContent.sections.map((section: Section, index: number) => {
        if (!section.visible) return null;
        return (
          <EcosystemSectionPreview
            key={section.id}
            section={section}
            index={index}
            language={language}
          />
        );
      })}
    </div>
  );
}

export function EcosystemSectionPreview({ section, index, language }: any) {
  switch (section.type) {
          case 'hero':
            return <EcosystemBanner key={section.id} content={section.content} />;

          case 'trust':
            return (
              <section key={section.id} className="py-16 bg-[#F7F9CE]/30">
                <TrustBar
                  partners={section.content.partners || []}
                  title={section.content.title}
                  subtitle={section.content.subtitle}
                />
              </section>
            );

          case 'category-filter': // Usamos este tipo para el catálogo de miembros
            return (
              <section id="ecosystem-catalog" key={section.id} className="py-20 bg-[#629960]/5">
                <div className="max-w-7xl mx-auto px-6">
                  {section.content.title && (
                    <div className="text-center mb-16">
                      <h2 className="text-4xl font-black text-[#1C5D15] mb-4">{section.content.title}</h2>
                      {section.content.subtitle && <p className="text-[#629960] text-lg max-w-2xl mx-auto">{section.content.subtitle}</p>}
                    </div>
                  )}
                  <EcosystemCatalog language={language} />
                </div>
              </section>
            );

          case 'stats':
            return (
              <section key={section.id} className="py-8 bg-[#1C5D15] text-white overflow-hidden relative">

                <div className="absolute top-0 right-0 w-64 h-64 bg-[#19FF00] rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#19FF00] rounded-full blur-[120px] opacity-10 -ml-32 -mb-32"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {section.content.stats?.map((stat: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-5xl font-black text-[#19FF00] tracking-tighter">{stat.value}</div>
                        <div className="text-sm font-bold uppercase tracking-widest text-white/70">{stat.label}</div>
                        {stat.description && <p className="text-xs text-white/50">{stat.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          default:
            return (
              <DynamicSection
                key={section.id}
                section={section}
                language={language}
                index={index}
              />
            );
        }
}
