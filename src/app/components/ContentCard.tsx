"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router';

// Types for Blog/News Post
interface BlogPostData {
  id: string;
  slug: string;
  author: string;
  cover_image: string;
  status: 'draft' | 'published';
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  translation: {
    title: string;
    excerpt: string;
  };
  category_id?: string;
  category_name?: string;
  type: 'article' | 'news';
}

// Types for Ecosystem Member
interface EcosystemMemberData {
  id: string;
  slug: string;
  image: string;
  sector: string;
  translation: {
    name: string;
    description: string;
  };
}

interface ContentCardProps {
  type: 'blog' | 'ecosystem';
  data: BlogPostData | EcosystemMemberData;
}

export function ContentCard({ type, data }: ContentCardProps) {
  const { language } = useLanguage();

  // Blog/News Post Card
  if (type === 'blog') {
    const post = data as BlogPostData;
    
    return (
      <article 
        className="h-[450px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#629960]/10 flex flex-col group overflow-hidden w-[80%] sm:w-full mx-auto"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <div className="absolute top-2 right-2 z-10">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md shadow-sm ${
              post.type === 'article' 
                ? 'bg-[#1C5D15] text-white' 
                : 'bg-[#19FF00] text-[#1C5D15]'
            }`}>
              {language === 'es' 
                ? (post.type === 'article' ? 'Artículo' : 'Noticia') 
                : (post.type === 'article' ? 'Article' : 'News')
              }
            </span>
          </div>
          
          {post.cover_image ? (
            <img 
              src={post.cover_image} 
              alt={post.translation.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-[#1C5D15]/10 flex items-center justify-center">
              <span className="text-[#1C5D15]/40 text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#19FF00] bg-[#1C5D15] px-2 py-0.5 rounded">
              {post.category_name || (language === 'es' ? 'Sin categoría' : 'Uncategorized')}
            </span>
            <span className="text-[10px] text-[#629960] font-medium">
              {new Date(post.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#1C5D15] mb-2 line-clamp-2 group-hover:text-[#629960] transition-colors leading-tight">
            {post.translation.title}
          </h3>

          {/* Description: Limitada estrictamente a 4 líneas ocupando el ancho del padre */}
          <p className="text-sm text-[#629960] line-clamp-4 mb-4">
            {post.translation.excerpt}
          </p>

          {/* Botón siempre al final (piso de la caja) */}
          <div className="mt-auto">
            <Link 
              to={`/blog/${post.slug}`}
              className="text-[#1C5D15] text-sm font-semibold flex items-center gap-1 hover:text-[#19FF00] transition-colors"
            >
              {language === 'es' ? 'Leer más' : 'Read more'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Ecosystem Member Card
  if (type === 'ecosystem') {
    const member = data as EcosystemMemberData;
    const initials = member.translation?.name ? member.translation.name.split(' ').map((n) => n.charAt(0)).join('').slice(0, 2) : 'EM';
    
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#629960]/10 hover:border-[#19FF00] h-full flex flex-col">
        <div className="p-5 flex flex-col h-full">
          <Link 
            to={member.slug ? `/ecosystem/${member.slug}` : '#'}
            className="flex flex-col h-full group"
          >
            <div className="flex items-center gap-4 mb-3 shrink-0">
              <div className="w-12 h-12 rounded-xl border-2 border-[#629960]/10 group-hover:border-[#19FF00] flex items-center justify-center bg-gradient-to-br from-[#1C5D15] to-[#629960] transition-colors overflow-hidden shrink-0 shadow-inner">
                {member.image ? (
                  <img src={member.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-base">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-[#1C5D15] truncate">{member.translation?.name || 'Miembro'}</h3>
                <p className="text-[10px] text-[#19FF00] font-bold bg-[#1C5D15] px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">{member.sector}</p>
              </div>
            </div>
            
            {/* Descripción del ecosistema limitada a 2 líneas */}
            <p className="text-xs md:text-sm text-[#629960] line-clamp-2 mb-3">
              {member.translation?.description}
            </p>
            
            <div className="flex items-center text-[#1C5D15] font-bold text-xs group-hover:text-[#629960] transition-colors pt-2 border-t border-gray-50 mt-auto">
              {language === 'es' ? 'Ver detalles' : 'View details'}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}