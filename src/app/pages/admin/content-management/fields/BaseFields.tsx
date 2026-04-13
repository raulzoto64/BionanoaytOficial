import { Section } from '../../../../data/supabase';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';

interface BaseFieldsProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onUpdateContent: (field: string, value: any) => void;
  showTextarea?: boolean;
  textareaField?: 'subtitle' | 'text';
}

export function BaseFields({ 
  section, 
  onUpdate, 
  onUpdateContent, 
  showTextarea = false, 
  textareaField = 'subtitle' 
}: BaseFieldsProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[#1C5D15]">Título (Español)</Label>
          <Input
            type="text"
            value={section.content.title || ''}
            onChange={(e) => onUpdateContent('title', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#1C5D15]">Título (English)</Label>
          <Input
            type="text"
            value={(section as any).contentEN?.title || ''}
            onChange={(e) => {
              const currentContentEN = (section as any).contentEN || {};
              onUpdate({
                contentEN: {
                  ...currentContentEN,
                  title: e.target.value
                }
              } as any);
            }}
            className="mt-1"
          />
        </div>
      </div>

      {showTextarea && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1C5D15]">
              {textareaField === 'subtitle' ? 'Subtítulo' : 'Texto'} (Español)
            </Label>
            <textarea
              value={section.content[textareaField] || ''}
              onChange={(e) => onUpdateContent(textareaField, e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-[#1C5D15]">
              {textareaField === 'subtitle' ? 'Subtítulo' : 'Texto'} (English)
            </Label>
            <textarea
              value={(section as any).contentEN?.[textareaField] || ''}
              onChange={(e) => {
                const currentContentEN = (section as any).contentEN || {};
                onUpdate({
                  contentEN: {
                    ...currentContentEN,
                    [textareaField]: e.target.value
                  }
                } as any);
              }}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
        </div>
      )}
    </>
  );
}
