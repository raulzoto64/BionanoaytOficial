import { Section } from '../../../../data/supabase';
import { SectionEditor } from '../SectionEditor';
import { Button } from '../../../../components/ui/button';
import { Plus, Settings2 } from 'lucide-react';

interface PageEditorProps {
  sections: Section[];
  expandedSections: Set<string>;
  onToggleSection: (id: string) => void;
  onUpdateSection: (index: number, updates: Partial<Section>) => void;
  onUpdateContent: (index: number, field: string, value: any) => void;
  onDeleteSection: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSaveIndividual: (section: Section) => void;
  onAddSection: () => void;
}

export function ProcessEditor({
  sections,
  expandedSections,
  onToggleSection,
  onUpdateSection,
  onUpdateContent,
  onDeleteSection,
  onMoveUp,
  onMoveDown,
  onSaveIndividual,
  onAddSection,
}: PageEditorProps) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-center gap-4">
        <Settings2 className="w-8 h-8 text-orange-600" />
        <div>
          <h3 className="text-lg font-semibold text-orange-900">Editor de Procesos</h3>
          <p className="text-sm text-orange-700">Maneja las etapas, sectores y certificaciones.</p>
        </div>
      </div>

      <Button onClick={onAddSection} className="bg-orange-600 text-white hover:bg-orange-700">
        <Plus className="w-4 h-4 mr-2" />
        Añadir Sección de Proceso
      </Button>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            totalSections={sections.length}
            isExpanded={expandedSections.has(section.id)}
            onToggleExpanded={() => onToggleSection(section.id)}
            onUpdate={(updates) => onUpdateSection(index, updates)}
            onUpdateContent={(field, value) => onUpdateContent(index, field, value)}
            onDelete={() => onDeleteSection(index)}
            onMoveUp={() => onMoveUp(index)}
            onMoveDown={() => onMoveDown(index)}
            onSaveSection={onSaveIndividual}
          />
        ))}
      </div>
    </div>
  );
}
