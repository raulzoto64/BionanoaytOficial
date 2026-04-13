import { Section } from '../../../../data/supabase';
import { SectionEditor } from '../SectionEditor';
import { Button } from '../../../../components/ui/button';
import { Plus, Cpu } from 'lucide-react';

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

export function TechnologyEditor({
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
      <div className="bg-[#629960]/5 p-4 rounded-lg border border-[#629960]/10 flex items-center gap-4">
        <Cpu className="w-8 h-8 text-[#1C5D15]" />
        <div>
          <h3 className="text-lg font-semibold text-[#1C5D15]">Editor de Tecnología</h3>
          <p className="text-sm text-[#629960]">
            Gestiona el contenido enfocado en innovación y bio-nanotecnología.
          </p>
        </div>
      </div>

      <Button
        onClick={onAddSection}
        className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Sección Tecnológica
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
