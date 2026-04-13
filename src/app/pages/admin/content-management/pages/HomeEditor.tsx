import { Section } from '../../../../data/supabase';
import { SectionEditor } from '../SectionEditor';
import { Button } from '../../../../components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Card } from '../../../../components/ui/card';

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

export function HomeEditor({
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
      <div className="bg-[#1C5D15]/5 p-4 rounded-lg border border-[#1C5D15]/10">
        <h3 className="text-lg font-semibold text-[#1C5D15] mb-2">Configuración de Página de Inicio</h3>
        <p className="text-sm text-[#629960]">
          La página de inicio suele incluir Hero, Partners, Features y Productos destacados.
        </p>
      </div>

      <Button
        onClick={onAddSection}
        className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#629960] hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Añadir Sección a Home
      </Button>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <FileText className="w-12 h-12 text-[#1C5D15]/20 mx-auto mb-4" />
            <p className="text-[#629960]">No hay secciones definidas para esta página.</p>
          </Card>
        ) : (
          sections.map((section, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}
