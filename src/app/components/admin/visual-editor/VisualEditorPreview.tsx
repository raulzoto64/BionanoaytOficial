import { useState } from 'react';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { Section, Category, EcosystemMember, Product } from '../../../data/supabase';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Zap,
  Plus
} from 'lucide-react';
import { DynamicSection } from '../../DynamicSection';
import { ProcessSectionPreview } from '../../../pages/Process';
import { TechnologySectionPreview } from '../../../pages/Technology';
import { StoreSectionPreview } from '../../../pages/Store';
import { EcosystemSectionPreview } from '../../../pages/Ecosystem';
import { BlogSectionPreview } from '../../../pages/Blog';
interface VisualEditorPreviewProps {
  sections: Section[];
  activeSectionId: string | null;
  onSectionClick: (id: string) => void;
  availableCategories?: Category[];
  availableEcosystemMembers?: EcosystemMember[];
  availableProducts?: Product[];
  availableBlogPosts?: any[];
  pageSlug?: string;
  onDeleteSection?: (id: string) => void;
  onMoveSectionUp?: (id: string) => void;
  onMoveSectionDown?: (id: string) => void;
  entityType?: 'page' | 'blog' | 'legal' | 'footer' | 'product';
  page?: any;
}

interface EditableBlockProps {
  sectionId: string;
  activeSectionId: string | null;
  onClick: (id: string) => void;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  index: number;
  totalSections: number;
  children: React.ReactNode;
  label?: string;
  hideControls?: boolean;
}

function EditableBlock({ 
  sectionId, 
  activeSectionId, 
  onClick, 
  onDelete,
  onMoveUp,
  onMoveDown,
  index,
  totalSections,
  children, 
  label = "Sección",
  hideControls = false
}: EditableBlockProps) {
  const isActive = activeSectionId === sectionId;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  return (
    <div 
      className={`relative group transition-all duration-300 ${
        isActive ? 'ring-2 ring-[#19FF00] ring-offset-0 z-40' : 'hover:ring-2 hover:ring-[#19FF00]/30 ring-offset-0'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(sectionId);
      }}
    >
      {/* Label and Control Toolbar */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full px-4 py-1.5 bg-[#1C5D15] text-white text-[10px] font-black uppercase tracking-widest rounded-t-xl transition-all duration-300 z-[51] flex items-center gap-3 shadow-lg ${
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
      }`}>
        <span>{label}</span>
        
        {!hideControls && (
          <div className="flex items-center gap-1 border-l border-white/20 pl-3 ml-1">
            <button 
              disabled={index === 0}
              onClick={(e) => { e.stopPropagation(); onMoveUp?.(sectionId); }}
              className={`p-1 hover:text-[#19FF00] disabled:opacity-30 disabled:hover:text-white transition-colors`}
              title="Mover arriba"
            >
              <ArrowUp size={14} />
            </button>
            
            <button 
              disabled={index === totalSections - 1}
              onClick={(e) => { e.stopPropagation(); onMoveDown?.(sectionId); }}
              className={`p-1 hover:text-[#19FF00] disabled:opacity-30 disabled:hover:text-white transition-colors`}
              title="Mover abajo"
            >
              <ArrowDown size={14} />
            </button>
            
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setDeleteConfirmOpen(true);
              }}
              className="p-1 hover:text-red-400 transition-colors ml-1"
              title="Eliminar sección"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete?.(sectionId);
        }}
        title="Eliminar Sección"
        message="¿Estás seguro de que quieres eliminar esta sección de forma permanente?<br/>Esta acción no se puede deshacer."
      />

      <div className={`${isActive ? 'opacity-100' : 'opacity-100 group-hover:opacity-100'} transition-opacity`}>
        {children}
      </div>

      {!isActive && (
        <div className="absolute inset-0 bg-transparent group-hover:bg-[#19FF00]/5 pointer-events-none transition-colors duration-300 flex items-center justify-center">
          {/* Eliminado el overlay de 'Click para editar' para máxima fidelidad visual */}
        </div>
      )}
    </div>
  );
}

export function VisualEditorPreview({ 
  sections, 
  activeSectionId, 
  onSectionClick,
  availableCategories = [],
  availableEcosystemMembers = [],
  availableProducts = [],
  availableBlogPosts = [],
  pageSlug = '',
  onDeleteSection,
  onMoveSectionUp,
  onMoveSectionDown,
  entityType = 'page',
  page
}: VisualEditorPreviewProps) {
  const isLockedEntity = ['footer', 'product'].includes(entityType);

  const renderSections = () => (
    <div className="space-y-0 relative">
      {sections.map((section, index) => {
        let PreviewComponent = null;

        if (pageSlug?.includes('process')) {
          PreviewComponent = <ProcessSectionPreview section={section} index={index} language="es" navigate={() => {}} />;
        } else if (pageSlug?.includes('technology')) {
          PreviewComponent = <TechnologySectionPreview section={section} index={index} language="es" navigate={() => {}} />;
        } else if (pageSlug?.includes('store')) {
          PreviewComponent = <StoreSectionPreview section={section} index={index} language="es" navigate={() => {}} categories={availableCategories} filteredProducts={availableProducts} ecosystemMembers={availableEcosystemMembers} />;
        } else if (pageSlug?.includes('ecosystem')) {
          PreviewComponent = <EcosystemSectionPreview section={section} index={index} language="es" navigate={() => {}} />;
        } else if (pageSlug?.includes('blog')) {
          PreviewComponent = <BlogSectionPreview section={section} index={index} language="es" navigate={() => {}} filteredPosts={availableBlogPosts} />;
        }

        return (
          <div key={section.id}>
            <EditableBlock
              sectionId={section.id}
              activeSectionId={activeSectionId}
              onClick={onSectionClick}
              onDelete={onDeleteSection}
              onMoveUp={onMoveSectionUp}
              onMoveDown={onMoveSectionDown}
              index={index}
              totalSections={sections.length}
              label={section.type === 'footer-settings' ? 'Configuración Footer' : (section.type === 'rich-text' ? 'Contenido Principal' : section.type.toUpperCase())}
              hideControls={isLockedEntity}
            >
              <div className={entityType === 'blog' ? 'blog-content' : (entityType === 'legal' ? 'prose prose-lg max-w-none' : '')}>
                {PreviewComponent || (
                    <DynamicSection 
                      section={section}
                      isEditor={true}
                      availableProducts={availableProducts}
                      availableCategories={availableCategories}
                      availableEcosystemMembers={availableEcosystemMembers}
                      availableBlogPosts={availableBlogPosts}
                      pageSlug={pageSlug}
                      onSectionClick={onSectionClick}
                      index={index}
                      entityType={entityType}
                    />
                )}
              </div>
            </EditableBlock>

            {!isLockedEntity && (
               <div className="group/add relative h-0 z-50 opacity-0 hover:opacity-100 transition-opacity">
                 <div className="absolute top-0 left-0 w-full h-12 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                   <div className="absolute w-full h-px bg-[#19FF00] shadow-[0_0_10px_#19FF00]"></div>
                   <button 
                     onClick={() => {
                        const event = new CustomEvent('editor:open-library', { detail: { insertAt: index + 1 } });
                        window.dispatchEvent(event);
                     }}
                     className="relative z-10 bg-[#1C5D15] text-[#19FF00] p-2 rounded-full shadow-[0_0_20px_rgba(25,255,0,0.5)] hover:scale-125 transition-all pointer-events-auto border border-[#19FF00]/50"
                     title="Añadir sección aquí"
                   >
                     <Plus className="w-5 h-5" />
                   </button>
                 </div>
               </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (entityType === 'blog' && page) {
    const title = page.translation?.title || page.title || page.title_es || 'Título del Artículo';
    const excerpt = page.translation?.excerpt || page.excerpt || '';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <EditableBlock
            sectionId="page-header"
            activeSectionId={activeSectionId}
            onClick={onSectionClick}
            index={-1}
            totalSections={sections.length}
            label="Cabecera del Artículo"
            hideControls={true}
          >
            <article className="bg-white rounded-t-lg shadow-lg overflow-hidden">
              {page.cover_image && (
                <div className="relative h-80 overflow-hidden">
                  <img src={page.cover_image} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
              )}
              
              <div className="p-8 pb-0">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-[#19FF00]/20 text-[#1C5D15] text-sm font-medium rounded-full">
                    {page.category_name || 'Industria y Regulación'}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md ${page.type === 'news' ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-[#1C5D15] text-white'}`}>
                    {page.type === 'news' ? 'NOTICIA' : 'ARTÍCULO'}
                  </span>
                  <span className="text-sm text-[#629960]">
                    {new Date(page.created_at || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-sm text-[#629960]">
                    Por {page.author || 'BioNano A&T'}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#1C5D15] mb-6">
                  {title}
                </h1>

                {excerpt && (
                  <div className="border-l-4 border-[#19FF00] pl-6 py-2 mb-8 bg-[#F0F9F0]">
                    <p className="text-lg text-[#629960] italic">{excerpt}</p>
                  </div>
                )}
              </div>
            </article>
          </EditableBlock>

          <div className="bg-white rounded-b-lg shadow-lg px-8 pb-12">
            {renderSections()}
          </div>
        </div>
      </div>
    );
  }

  if (entityType === 'legal' && page) {
    const title = page.title_es || page.title_en || 'Página Legal';
    
    return (
      <div className="min-h-screen bg-[#F7F9CE]">
        <EditableBlock
          sectionId="page-header"
          activeSectionId={activeSectionId}
          onClick={onSectionClick}
          index={-1}
          totalSections={sections.length}
          label="Cabecera Legal"
          hideControls={true}
        >
          <div className="bg-[#1C5D15] text-white py-12 px-6 shadow-md">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="text-white/80">Información legal y política de la empresa</p>
            </div>
          </div>
        </EditableBlock>
        
        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
               {renderSections()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderSections();
}
