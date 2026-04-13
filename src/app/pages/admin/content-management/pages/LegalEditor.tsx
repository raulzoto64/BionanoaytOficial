import { Section } from '../../../data/supabase';
import { SectionEditor } from '../SectionEditor';
import { Button } from '../../../../components/ui/button';
import { Plus, ShieldCheck } from 'lucide-react';

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

export function LegalEditor({
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
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-slate-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Editor de Páginas Legales</h3>
          <p className="text-sm text-slate-700">Términos, privacidad y avisos legales.</p>
        </div>
      </div>

      <Button onClick={onAddSection} className="bg-slate-600 text-white hover:bg-slate-700">
        <Plus className="w-4 h-4 mr-2" />
        Añadir Cláusula/Sección
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
