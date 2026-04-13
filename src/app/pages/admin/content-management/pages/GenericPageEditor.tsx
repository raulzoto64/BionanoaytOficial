import { Section } from '../../../../data/supabase';
import { SectionEditor } from '../SectionEditor';
import { Button } from '../../../../components/ui/button';
import { Plus } from 'lucide-react';

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
  title?: string;
}

export function GenericPageEditor({
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
  title = "Editor de Página"
}: PageEditorProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">Editor modular para páginas de contenido dinámico.</p>
      </div>

      <Button onClick={onAddSection} variant="outline" className="border-gray-300">
        <Plus className="w-4 h-4 mr-2" />
        Añadir Sección
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
