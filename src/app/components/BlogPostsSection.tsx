"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, BlogPostTranslation } from '../data/supabase';
import { ContentCard } from './ContentCard';

interface PostWithTranslation {
  id: string;
  slug: string;
  author: string;
  cover_image: string;
  status: 'draft' | 'published';
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  translation: BlogPostTranslation;
  category_id?: string;
  category_name?: string;
  type: 'article' | 'news';
}

export interface BlogPostsSectionProps {
  posts?: PostWithTranslation[];
  loading?: boolean;
  language?: string;
  activeFilter?: 'all' | 'news' | 'article';
  onFilterChange?: (filter: 'all' | 'news' | 'article') => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sectionId?: string;
  from?: string;
}

export function BlogPostsSection({
  posts = [],
  loading = false,
  language = 'es',
  activeFilter = 'all',
  onFilterChange = () => {},
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  sectionId,
  from
}: BlogPostsSectionProps) {
  // Usamos los props directamente para evitar conflictos de estado entre padre e hijo
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  useEffect(() => {
    if (currentPage !== currentPageState) {
      setCurrentPageState(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPageState(page);
    onPageChange(page);
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#629960]/30">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1C5D15]"></div>
        <p className="mt-4 text-[#629960] font-medium">
          {language === 'es' ? 'Cargando...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#629960]/30">
        <h3 className="text-xl font-bold text-[#1C5D15] mb-2">
          {language === 'es' ? 'Próximamente' : 'Coming Soon'}
        </h3>
        <p className="text-[#629960]">
          {language === 'es' ? 'Estamos preparando nuevos artículos para ti.' : 'We are preparing new articles for you.'}
        </p>
      </div>
    );
  }

return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* FILTRO DE CATEGORIAS */}
      <div className="flex justify-center gap-3 mb-12">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-[#1C5D15] text-white shadow-lg'
              : 'bg-white text-[#1C5D15] border border-[#1C5D15]/20 hover:border-[#1C5D15]'
          }`}
        >
          {language === 'es' ? 'Todos' : 'All'}
        </button>
        <button
          onClick={() => onFilterChange('news')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all ${
            activeFilter === 'news'
              ? 'bg-[#1C5D15] text-white shadow-lg'
              : 'bg-white text-[#1C5D15] border border-[#1C5D15]/20 hover:border-[#1C5D15]'
          }`}
        >
          {language === 'es' ? 'Noticias' : 'News'}
        </button>
        <button
          onClick={() => onFilterChange('article')}
          className={`px-6 py-2.5 rounded-full font-medium transition-all ${
            activeFilter === 'article'
              ? 'bg-[#1C5D15] text-white shadow-lg'
              : 'bg-white text-[#1C5D15] border border-[#1C5D15]/20 hover:border-[#1C5D15]'
          }`}
        >
          {language === 'es' ? 'Artículos' : 'Articles'}
        </button>
      </div>

      {/* Grid de cartas */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {posts.slice((currentPageState - 1) * 12, currentPageState * 12).map((post) => (
            <ContentCard 
              key={post.id} 
              type="blog" 
              data={post} 
              sectionId={sectionId}
              from={from}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#629960]/30">
          <h3 className="text-xl font-bold text-[#1C5D15] mb-2">
            {language === 'es' ? 'Próximamente' : 'Coming Soon'}
          </h3>
          <p className="text-[#629960]">
            {language === 'es' ? 'Estamos preparando nuevos artículos para ti.' : 'We are preparing new articles for you.'}
          </p>
        </div>
      )}

      {/* Paginación */}
      {posts.length > 12 && (
        <div className="flex justify-center mt-12 gap-2">
          <button 
            onClick={() => handlePageChange(currentPageState - 1)}
            disabled={currentPageState === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                currentPageState === page 
                  ? 'bg-[#1C5D15] text-white border-[#1C5D15]' 
                  : 'border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(currentPageState + 1)}
            disabled={currentPageState === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#629960]/20 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

    
