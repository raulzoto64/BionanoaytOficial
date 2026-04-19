import { useState } from 'react';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { Section, Category, EcosystemMember, Product } from '../../../data/supabase';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Zap
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
  label = "Sección" 
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

      <div className={`${isActive ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'} transition-opacity`}>
        {children}
      </div>

      {!isActive && (
        <div className="absolute inset-0 bg-[#19FF00]/0 group-hover:bg-[#19FF00]/5 pointer-events-none transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-sm text-[#1C5D15] px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 border border-[#1C5D15]/10">
              <Zap size={12} className="text-[#19FF00] fill-[#19FF00]" />
              Click para editar
            </div>
          </div>
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
  onMoveSectionDown
}: VisualEditorPreviewProps) {
  return (
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
          <EditableBlock
            key={section.id}
            sectionId={section.id}
            activeSectionId={activeSectionId}
            onClick={onSectionClick}
            onDelete={onDeleteSection}
            onMoveUp={onMoveSectionUp}
            onMoveDown={onMoveSectionDown}
            index={index}
            totalSections={sections.length}
            label={section.type.toUpperCase()}
          >
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
              />
            )}
          </EditableBlock>
        );
      })}
    </div>
  );
}
