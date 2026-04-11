import { Section } from '../../../data/supabase';
import { EditableBlock } from './EditableBlock';

// Importar los mismos componentes que usa el Front-End real
import { Hero } from '../../Hero';
import { Purpose } from '../../Purpose';
import { FeaturedProduct } from '../../FeaturedProduct';
import { Timeline } from '../../Timeline';
import { Leadership } from '../../Leadership';
import { TrustBar } from '../../TrustBar';
import { Ecosystem } from '../../Ecosystem';
import { NewsSection } from '../../NewsSection';
import { Products } from '../../Products';

interface VisualEditorPreviewProps {
  sections: Section[];
  activeSectionId: string | null;
  onSectionClick: (id: string) => void;
  availableProducts?: any[];
}

export function VisualEditorPreview({ sections, activeSectionId, onSectionClick, availableProducts = [] }: VisualEditorPreviewProps) {

  const renderSectionComponent = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return <Hero content={section.content} />;

      case 'trust':
        return <TrustBar partners={section.content.partners || []} />;

      case 'features':
        return <Purpose purposes={section.content.items || []} />;

      case 'featured':
        return <FeaturedProduct content={section.content} />;

      case 'products':
        const selectedIds = section.content.selectedProductIds || [];
        const filteredProducts = selectedIds.length > 0
          ? availableProducts.filter(p => selectedIds.includes(p.id))
          : availableProducts.filter(p => p.featured);

        return (
          <Products
            title={section.content.title || ''}
            subtitle={section.content.subtitle || ''}
            products={filteredProducts}
          />
        );

      case 'timeline':
        return (
          <Timeline
            milestones={section.content.milestones || []}
            title={section.content.title}
            subtitle={section.content.subtitle}
            description={section.content.description}
          />
        );

      case 'team':
        return (
          <Leadership
            members={section.content.members || []}
            title={section.content.title || ''}
            subtitle={section.content.subtitle || ''}
          />
        );

      case 'ecosystem':
        return (
          <Ecosystem
            title={section.content.title}
            subtitle={section.content.subtitle}
            items={section.content.items}
          />
        );

      case 'news':
        return (
          <NewsSection
            title={section.content.title}
            subtitle={section.content.subtitle}
            ctaText={section.content.ctaText}
            ctaLink={section.content.ctaLink}
            isEditor={true}
          />
        );

      case 'contact':
        return (
          <div className="py-20 text-center bg-[#1C5D15]/5">
            <h2 className="text-3xl text-[#1C5D15] font-bold mb-2">📧 Sección de Contacto</h2>
            <p className="text-[#629960]">Se carga automáticamente desde la configuración del footer.</p>
          </div>
        );

      default:
        return (
          <div className="py-16 text-center bg-gray-50 border-2 border-dashed border-gray-300">
            <h2 className="text-xl text-gray-500 font-bold mb-2 uppercase">{section.type}</h2>
            <p className="text-gray-400 text-sm">Vista previa no disponible para este tipo de sección.</p>
          </div>
        );
    }
  };
  const visibleSections = sections.filter(s => s.visible !== false && s.type !== 'contact');

  return (
    <div className="w-full flex-1 h-full min-h-screen bg-white">
      {visibleSections.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400 py-40">
          <div className="text-center">
            <p className="text-2xl mb-2">📄</p>
            <p className="font-medium">Esta página no tiene secciones visibles.</p>
            <p className="text-sm mt-1">Usa el editor clásico para agregar secciones.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {visibleSections.map((section) => (
            <EditableBlock
              key={section.id}
              sectionId={section.id}
              activeSectionId={activeSectionId}
              onClick={onSectionClick}
              label={section.type.toUpperCase()}
            >
              {renderSectionComponent(section)}
            </EditableBlock>
          ))}
        </div>
      )}
    </div>
  );
}
