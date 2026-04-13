import { Page, Section } from '../../../data/supabase';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Save, X, Plus, FileText } from 'lucide-react';
import { SectionEditor } from './SectionEditor';
import { PreviewPane } from './PreviewPane';

interface EditorViewProps {
  editingPage: Page;
  sections: Section[];
  expandedSections: Set<string>;
  onSave: () => void;
  onCancel: () => void;
  onAddSection: () => void;
  onToggleSectionExpanded: (sectionId: string) => void;
  onUpdateSection: (index: number, updates: Partial<Section>) => void;
  onUpdateSectionContent: (index: number, field: string, value: any) => void;
  onDeleteSection: (index: number) => void;
  onMoveSectionUp: (index: number) => void;
  onMoveSectionDown: (index: number) => void;
  onSaveIndividualSection: (section: Section) => void;
}

export function EditorView({
  editingPage,
  sections,
  expandedSections,
  onSave,
  onCancel,
  onAddSection,
  onToggleSectionExpanded,
  onUpdateSection,
  onUpdateSectionContent,
  onDeleteSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onSaveIndividualSection,
}: EditorViewProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Editor Section (50%) */}
      <div className="w-1/2 h-full overflow-y-auto p-4 bg-[#F7F9CE]/50">
        <div className="max-w-full">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-[#1C5D15] mb-1">
                Editar: {editingPage.slug} (Español)
              </h2>
              <p className="text-[#629960] text-sm">
                Gestiona las secciones de la página
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] text-sm px-3 py-1 rounded-md transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </button>
              <button 
                onClick={onCancel} 
                className="bg-white border border-gray-300 text-sm px-3 py-1 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </button>
            </div>
          </div>

          <Button
            onClick={onAddSection}
            className="mb-4 bg-[#629960] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] text-sm px-3 py-1"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Sección
          </Button>

          <div className="space-y-3">
            {sections.length === 0 ? (
              <Card className="p-8 bg-white border-2 border-[#629960]/20 text-center">
                <FileText className="w-12 h-12 text-[#1C5D15] mx-auto mb-3" />
                <h3 className="text-xl text-[#1C5D15] mb-2">No hay secciones</h3>
                <p className="text-[#629960] mb-3">Agrega tu primera sección para comenzar</p>
              </Card>
            ) : (
              sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  totalSections={sections.length}
                  isExpanded={expandedSections.has(section.id)}
                  onToggleExpanded={() => onToggleSectionExpanded(section.id)}
                  onUpdate={(updates) => onUpdateSection(index, updates)}
                  onUpdateContent={(field, value) => onUpdateSectionContent(index, field, value)}
                  onDelete={() => onDeleteSection(index)}
                  onMoveUp={() => onMoveSectionUp(index)}
                  onMoveDown={() => onMoveSectionDown(index)}
                  onSaveSection={onSaveIndividualSection}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Preview Section (50%) */}
      <div className="w-1/2 h-full overflow-hidden">
        <PreviewPane editingPage={editingPage} sections={sections} />
      </div>
    </div>
  );
}
