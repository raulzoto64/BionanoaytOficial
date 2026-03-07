import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function Blog() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C5D15] mb-4">
            {language === 'es' ? 'Blog' : 'Blog'}
          </h1>
          <p className="text-xl text-[#629960] max-w-3xl mx-auto">
            {language === 'es' 
              ? 'Artículos sobre bioseguridad, nanotecnología y prácticas sostenibles' 
              : 'Articles about biosecurity, nanotechnology, and sustainable practices'
            }
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder Posts */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-r from-[#1C5D15] to-[#629960] flex items-center justify-center">
                <span className="text-white font-medium">
                  {language === 'es' ? 'Imagen del artículo' : 'Article Image'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#19FF00]/20 text-[#1C5D15] text-sm font-medium rounded-full">
                    {language === 'es' ? 'Tecnología' : 'Technology'}
                  </span>
                  <span className="text-sm text-[#629960]">
                    {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1C5D15] mb-3">
                  {language === 'es' 
                    ? 'Título del artículo de ejemplo' 
                    : 'Sample Article Title'
                  }
                </h3>
                <p className="text-[#629960] mb-4">
                  {language === 'es' 
                    ? 'Este es un extracto del artículo que describe el contenido principal. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' 
                    : 'This is an excerpt of the article that describes the main content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                  }
                </p>
                <button className="text-[#1C5D15] font-medium flex items-center gap-2 hover:text-[#19FF00] transition-colors">
                  {language === 'es' ? 'Leer más' : 'Read more'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-[#629960] text-[#1C5D15] rounded-lg hover:bg-[#19FF00]/10 transition-colors">
              {language === 'es' ? 'Anterior' : 'Previous'}
            </button>
            <button className="px-4 py-2 bg-[#1C5D15] text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-white border border-[#629960] text-[#1C5D15] rounded-lg hover:bg-[#19FF00]/10 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-[#629960] text-[#1C5D15] rounded-lg hover:bg-[#19FF00]/10 transition-colors">
              3
            </button>
            <button className="px-4 py-2 bg-white border border-[#629960] text-[#1C5D15] rounded-lg hover:bg-[#19FF00]/10 transition-colors">
              {language === 'es' ? 'Siguiente' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}