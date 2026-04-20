import { useState } from 'react';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { Section, Category, EcosystemMember, Product } from '../../../data/supabase';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Zap,
  Plus,
  Check
} from 'lucide-react';
import { DynamicSection } from '../../DynamicSection';
import { ProcessSectionPreview } from '../../../pages/Process';
import { TechnologySectionPreview } from '../../../pages/Technology';
import { StoreSectionPreview } from '../../../pages/Store';
import { EcosystemSectionPreview } from '../../../pages/Ecosystem';
import { BlogSectionPreview } from '../../../pages/Blog';
import { ProductTabs } from '../../ProductTabs';
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
              className={`p-1 disabled:opacity-30 disabled:hover:text-white transition-colors`}
              title="Mover arriba"
            >
              <ArrowUp size={14} />
            </button>
            
            <button 
              disabled={index === totalSections - 1}
              onClick={(e) => { e.stopPropagation(); onMoveDown?.(sectionId); }}
              className={`p-1 disabled:opacity-30 disabled:hover:text-white transition-colors`}
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
  const isLockedEntity = entityType === 'footer';

  const renderSections = () => (
    <div className="space-y-0 relative">
      {sections.map((section, index) => {
        let PreviewComponent = null;

        // No mostrar la sección de cabecera en la lista dinámica (ya se muestra arriba)
        if (section.id === 'page-header') return null;

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
  // Encontrar la sección de metadatos (cabecera)
  const headerSection = sections.find(s => s.id === 'page-header');
  const headerData = headerSection?.content || {};

  if (['blog', 'product'].includes(entityType as string) && page) {
    const title = headerData.name || headerData.title_es || headerData.title_en || 'Sin título';
    const excerpt = headerData.short_description || headerData.excerpt_es || headerData.excerpt_en || '';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F0F9F0] py-12 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <EditableBlock
            sectionId="page-header"
            activeSectionId={activeSectionId}
            onClick={onSectionClick}
            index={-1}
            totalSections={sections.length}
            label="CONFIGURACIÓN BASE DEL PRODUCTO (4 ÍTEMS)"
            hideControls={true}
          >
            {entityType === 'product' ? (
              <div className="bg-white rounded-t-3xl shadow-xl overflow-hidden p-8 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Galería de Producto */}
                  <div className="space-y-4">
                    <div className="aspect-square rounded-3xl border-4 border-[#19FF00]/10 overflow-hidden bg-gray-50 flex items-center justify-center relative group shadow-inner">
                      {headerData.cover_image ? (
                        <img src={headerData.cover_image} className="w-full h-full object-cover" alt="Principal" />
                      ) : (
                        <div className="text-[#1C5D15]/20 font-black uppercase tracking-widest text-xs">Sin Imagen</div>
                      )}
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {(headerData.images || []).map((img: string, i: number) => (
                        <div key={i} className="w-20 h-20 rounded-2xl border-2 border-gray-50 overflow-hidden flex-shrink-0 shadow-sm hover:border-[#19FF00]/50 transition-all cursor-pointer">
                          <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Técnica */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 bg-[#1C5D15] text-[#19FF00] text-[11px] font-black uppercase rounded-full tracking-wider shadow-lg shadow-[#1C5D15]/20">
                        {headerData.category || 'PRODUCTO'}
                      </span>
                      <span className={`px-4 py-1.5 border-2 border-[#1C5D15]/10 text-[#1C5D15] text-[11px] font-black uppercase rounded-full`}>
                        {headerData.status || 'draft'}
                      </span>
                    </div>
                    
                    <h1 className="text-5xl font-black text-[#1C5D15] leading-[1.1] mb-6 tracking-tight">
                      {title}
                    </h1>
                    
                    <div className="prose prose-sm text-[#629960] mb-8 font-medium leading-relaxed max-w-xl">
                      {excerpt}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <article className="bg-white rounded-t-lg shadow-lg overflow-hidden">
                {headerData.cover_image && (
                  <div className="relative h-96 overflow-hidden">
                    <img src={headerData.cover_image} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-12 pb-0">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="px-4 py-1 bg-[#19FF00]/20 text-[#1C5D15] text-xs font-black uppercase rounded-full tracking-widest">
                      {headerData.category_name || 'Blog'}
                    </span>
                    <span className="text-sm font-bold text-[#629960] opacity-60">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <h1 className="text-5xl font-black text-[#1C5D15] mb-8 leading-[1.1] tracking-tight">
                    {title}
                  </h1>

                  {excerpt && (
                    <div className="border-l-8 border-[#19FF00] pl-10 py-4 mb-12 bg-[#F0F9F0] rounded-r-2xl">
                      <p className="text-xl text-[#1C5D15]/80 italic leading-relaxed">{excerpt}</p>
                    </div>
                  )}
                </div>
              </article>
            )}
          </EditableBlock>

          <div className="bg-white rounded-b-3xl shadow-xl px-12 pb-20">
            {/* TABS OFICIALES REUTILIZADAS */}
            {entityType === 'product' && (
              <div className="mt-8">
                <ProductTabs 
                  translation={{
                    description: headerData.description || '',
                    features: headerData.features || [],
                    benefits: headerData.benefits || [],
                    technical_specs: headerData.technical_specs || {}
                  }}
                  language="es"
                  t={(key) => {
                    const keys: any = {
                      'products.features': 'Características',
                      'products.benefits': 'Beneficios',
                      'products.specs': 'Especificaciones Técnicas',
                      'price.unit': 'unidad'
                    };
                    return keys[key] || key;
                  }}
                />
              </div>
            )}
            
            {renderSections()}
          </div>
        </div>
      </div>
    );
  }

  // Si es legal
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

  // Fallback para cualquier otro caso (como Footer o Páginas genéricas)
  const filteredSections = sections.filter(s => s.id !== 'page-header');

  return (
    <div className="visual-editor-preview min-h-full pb-32">
      <div className="space-y-0 relative">
        {filteredSections.map((section, index) => {
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
                totalSections={filteredSections.length}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
