"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { supabaseAPI, EcosystemMember, EcosystemMemberTranslation } from "../data/supabase";
import { Button } from "../components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ContentCard } from "../components/ContentCard";

export function EcosystemPage() {
  const { language } = useLanguage();
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

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(ecosystemMembers.map(member => member.sector)));
      setCategories(uniqueCategories);

      const translationPromises = ecosystemMembers.map(async (member) => {
        const translation = await supabaseAPI.getEcosystemMemberTranslation(member.id, language);
        return { id: member.id, translation };
      });

      const translationsResult = await Promise.all(translationPromises);
      const translationMap: Record<string, EcosystemMemberTranslation> = {};
      translationsResult.forEach(({ id, translation }) => {
        translationMap[id] = translation;
      });

      setTranslations(translationMap);
    } catch (error) {
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

  // Loading state
  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#629960]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 bg-[#1C5D15]/10 rounded w-32 animate-pulse mx-auto mb-4" />
              <div className="h-12 bg-[#1C5D15]/10 rounded w-64 animate-pulse mx-auto" />
            </div>
            
            <div className="flex justify-center">
              <div className="h-10 bg-white rounded-lg animate-pulse w-48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-[280px] bg-white rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#629960]/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-block px-4 py-1.5 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4 font-bold text-sm tracking-wide shadow-sm">
              {language === 'es' ? 'Ecosistema' : 'Ecosystem'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1C5D15] tracking-tight">
              {language === 'es' ? 'Nuestro Ecosistema' : 'Our Ecosystem'}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-[#629960] leading-relaxed max-w-2xl mx-auto">
              {language === 'es' 
                ? 'Conectamos innovadores, empresarios y profesionales para construir un ecosistema sostenible y tecnológico.' 
                : 'We connect innovators, entrepreneurs, and professionals to build a sustainable and technological ecosystem.'
              }
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-center">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48 bg-white border-[#629960]/20 focus:border-[#1C5D15]">
                <SelectValue placeholder={language === 'es' ? 'Filtrar por categoría' : 'Filter by category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'es' ? 'Todas las categorías' : 'All categories'}
                </SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const translation = translations[member.id];
              
              return (
                <ContentCard 
                  key={member.id} 
                  type="ecosystem" 
                  data={{
                    id: member.id,
                    slug: member.slug,
                    image: member.image,
                    sector: member.sector,
                    translation: {
                      name: translation?.name || 'Miembro',
                      description: translation?.description || ''
                    }
                  }} 
                />
              );
            })}
          </div>

          {/* No Results Message */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-[#629960]">
                {language === 'es' ? 'No se encontraron miembros en esta categoría.' : 'No members found in this category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}