import { Page, Section } from '../../../data/supabase';
import { Hero } from '../../../components/Hero';
import { TrustBar } from '../../../components/TrustBar';
import { Purpose } from '../../../components/Purpose';
import { FeaturedProduct } from '../../../components/FeaturedProduct';
import { Products } from '../../../components/Products';
import { Timeline } from '../../../components/Timeline';
import { Leadership } from '../../../components/Leadership';
import { Ecosystem } from '../../../components/Ecosystem';
import { Footer } from '../../../components/Footer';

interface PreviewPaneProps {
  editingPage: Page | null;
  sections: Section[];
}

export function PreviewPane({ editingPage, sections }: PreviewPaneProps) {
  if (!editingPage) return null;

  return (
    <div className="h-full overflow-y-auto bg-white border-l-2 border-[#629960]/20 preview-container">
      <div className="sticky top-0 z-10 bg-white border-b border-[#629960]/20 p-4">
        <h3 className="text-xl font-semibold text-[#1C5D15] mb-2">
          Vista Previa: {editingPage.slug.replace(/-/g, ' ')}
        </h3>
        <p className="text-sm text-[#629960]">
          Idioma: Español
        </p>
      </div>

      <div className="p-4">
        {sections.filter(sec => sec.visible).map((section) => {
          const content = section.content;
          
          switch (section.type) {
            case 'hero':
              return (
                <div key={section.id} className="mb-12">
                  <Hero content={content} />
                </div>
              );
            case 'trust':
              return (
                <div key={section.id} className="mb-12">
                  <TrustBar partners={content.partners} />
                </div>
              );
            case 'features':
              return (
                <div key={section.id} className="mb-12">
                  <Purpose purposes={content.items} />
                </div>
              );
            case 'featured':
              return (
                <div key={section.id} className="mb-12">
                  <FeaturedProduct content={content} />
                </div>
              );
            case 'products':
              const mockProducts = [
                {
                  id: '1',
                  slug: 'producto-mock-1',
                  category: 'Categoría 1',
                  image: 'https://picsum.photos/seed/product1/400/300',
                  featured: true,
                  translation: {
                    product_id: '1',
                    language: 'es' as const,
                    name: 'Producto Mock 1',
                    short_description: 'Descripción corta del producto mock 1',
                    description: 'Descripción detallada del producto mock 1',
                    features: ['Característica 1', 'Característica 2', 'Característica 3'],
                    benefits: ['Beneficio 1', 'Beneficio 2'],
                    technical_specs: {},
                    meta_title: '',
                    meta_description: '',
                  }
                },
                {
                  id: '2',
                  slug: 'producto-mock-2',
                  category: 'Categoría 2',
                  image: 'https://picsum.photos/seed/product2/400/300',
                  featured: false,
                  translation: {
                    product_id: '2',
                    language: 'es' as const,
                    name: 'Producto Mock 2',
                    short_description: 'Descripción corta del producto mock 2',
                    description: 'Descripción detallada del producto mock 2',
                    features: ['Característica A', 'Característica B'],
                    benefits: ['Beneficio A', 'Beneficio B'],
                    technical_specs: {},
                    meta_title: '',
                    meta_description: '',
                  }
                }
              ];
              
              return (
                <div key={section.id} className="mb-12">
                  <Products 
                    products={mockProducts} 
                    title={content.title || 'Productos'} 
                    subtitle={content.subtitle || 'Conoce nuestra variedad de productos'} 
                  />
                </div>
              );
            case 'timeline':
              return (
                <div key={section.id} className="mb-12">
                  <Timeline milestones={content.milestones} />
                </div>
              );
            case 'team':
              return (
                <div key={section.id} className="mb-12">
                  <Leadership 
                    members={content.members} 
                    title={content.title} 
                    subtitle={content.subtitle} 
                  />
                </div>
              );
            case 'ecosystem':
              return (
                <div key={section.id} className="mb-12">
                  <Ecosystem />
                </div>
              );
            case 'contact':
              return (
                <div key={section.id} className="mb-12">
                  <Footer contactInfo={content.contactInfo} />
                </div>
              );
            case 'text':
              return (
                <div key={section.id} className="mb-12">
                  <div className="max-w-full mx-auto px-6 py-12 bg-white">
                    <h2 className="text-3xl font-bold text-[#1C5D15] mb-6">
                      {content.title}
                    </h2>
                    {content.subtitle && (
                      <p className="text-xl text-[#629960] mb-8">
                        {content.subtitle}
                      </p>
                    )}
                    {content.text && (
                      <div className="prose prose-green max-w-none text-[#1C5D15]">
                        <div dangerouslySetInnerHTML={{ __html: content.text }} />
                      </div>
                    )}
                    {!content.title && !content.subtitle && !content.text && (
                      <p className="text-[#629960] italic">Esta sección está vacía. Añade contenido para ver la vista previa.</p>
                    )}
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
