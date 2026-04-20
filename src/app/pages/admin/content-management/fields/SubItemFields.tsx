import { Section } from '../../../../data/supabase';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface SubItemFieldsProps {
  section: Section;
  onUpdateContent: (field: string, value: any) => void;
  fieldKey: string;
  itemTemplate: any;
}

export function SubItemFields({ section, onUpdateContent, fieldKey, itemTemplate }: SubItemFieldsProps) {
  const items = section.content[fieldKey] || [];
  
  return (
    <div className="space-y-4">
      <Label className="text-[#1C5D15] capitalize">{fieldKey}</Label>
      {items.map((item: any, idx: number) => (
        <div key={idx} className="p-4 border rounded-lg bg-gray-50/50 relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newItems = items.filter((_: any, i: number) => i !== idx);
              onUpdateContent(fieldKey, newItems);
            }}
            className="absolute -right-2 -top-2 h-8 w-8 p-0 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <div className="grid md:grid-cols-2 gap-3">
             {Object.keys(itemTemplate).map((key) => (
               <div key={key}>
                 <Label className="text-xs text-[#629960]">{key}</Label>
                 <Input
                   value={item[key] || ''}
                   onChange={(e) => {
                     const newItems = [...items];
                     newItems[idx] = { ...newItems[idx], [key]: e.target.value };
                     onUpdateContent(fieldKey, newItems);
                   }}
                   className="h-8 text-sm"
                 />
               </div>
             ))}
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          onUpdateContent(fieldKey, [...items, { ...itemTemplate }]);
        }}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Añadir {fieldKey}
      </Button>
    </div>
  );
}
