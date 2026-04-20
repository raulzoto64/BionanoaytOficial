import { Section } from '../../../data/supabase';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Trash2, 
  Save,
} from 'lucide-react';
import { ImageUpload } from '../../../components/ImageUpload';
import { toast } from 'sonner';
import { BaseFields } from './fields/BaseFields';
import { HeroFields } from './fields/HeroFields';
import { PartnerFields } from './fields/PartnerFields';
import { SubItemFields } from './fields/SubItemFields';

interface SectionEditorProps {
  section: Section;
  index: number;
  totalSections: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onUpdate: (updates: Partial<Section>) => void;
  onUpdateContent: (field: string, value: any) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSaveSection: (section: Section) => void;
  ecosystemRefs?: React.MutableRefObject<Record<string, { save: () => Promise<void> }>>;
}

export function SectionEditor({
  section,
  index,
  totalSections,
  isExpanded,
  onToggleExpanded,
  onUpdate,
  onUpdateContent,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSaveSection,
  ecosystemRefs,
}: SectionEditorProps) {
  const sectionTypes = [
    { value: 'hero', label: 'Hero (Banner Principal)' },
    { value: 'text', label: 'Texto' },
    { value: 'features', label: 'Características / Pasos' },
    { value: 'products', label: 'Productos' },
    { value: 'team', label: 'Equipo' },
    { value: 'timeline', label: 'Línea de Tiempo' },
    { value: 'contact', label: 'Contacto' },
    { value: 'custom', label: 'Personalizado' },
    { value: 'trust', label: 'Confianza / Aliados' },
    { value: 'featured', label: 'Destacado' },
    { value: 'ecosystem', label: 'Ecosistema' },
    { value: 'news', label: 'Noticias' },
    { value: 'problems', label: 'Problemas / Retos' },
    { value: 'sectors', label: 'Sectores / Industrias' },
    { value: 'stats', label: 'Estadísticas' },
    { value: 'certifications', label: 'Certificaciones' },
    { value: 'quote', label: 'Cita / Testimonio' },
    { value: 'faq', label: 'Preguntas Frecuentes' },
    { value: 'cta', label: 'LLamado a la Acción' },
  ];

  const handleSaveSection = async () => {
    try {
      await onSaveSection(section);
      toast.success('Sección guardada');
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  return (
    <Card className={`p-6 bg-white border-2 shadow-sm transition-all ${section.visible ? 'border-emerald-100' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="p-0 h-8 w-8 hover:bg-emerald-50"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-emerald-600" />}
          </Button>
          <div className="flex flex-col">
            <h3 className="text-md font-bold text-gray-800">
              {index + 1}. {sectionTypes.find(t => t.value === section.type)?.label || section.type}
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">{section.id}</span>
          </div>
          <Badge className={section.visible ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-100 text-gray-400'}>
            {section.visible ? 'Activa' : 'Oculta'}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdate({ visible: !section.visible })}
            title={section.visible ? 'Ocultar' : 'Mostrar'}
          >
            {section.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <div className="flex items-center border rounded-lg bg-gray-50 overflow-hidden">
             <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                disabled={index === 0}
                className="h-8 w-8 p-0 rounded-none border-r"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                disabled={index === totalSections - 1}
                className="h-8 w-8 p-0 rounded-none"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveSection}
            className="text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Sección</Label>
              <select
                value={section.type}
                onChange={(e) => onUpdate({ type: e.target.value as Section['type'] })}
                className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prioridad / Orden</Label>
              <Input
                type="number"
                value={section.order}
                onChange={(e) => onUpdate({ order: parseInt(e.target.value) })}
                className="mt-1 h-10"
              />
            </div>
          </div>

          <div className="space-y-6">
            <BaseFields 
              section={section} 
              onUpdate={onUpdate} 
              onUpdateContent={onUpdateContent}
              showTextarea={['hero', 'text', 'problems', 'features', 'cta', 'quote'].includes(section.type)}
              textareaField={['hero', 'problems', 'features', 'cta'].includes(section.type) ? 'subtitle' : 'text'}
            />

            {section.type === 'hero' && (
              <HeroFields 
                section={section} 
                onUpdate={onUpdate} 
                onUpdateContent={onUpdateContent} 
              />
            )}

            {section.type === 'trust' && (
              <PartnerFields 
                section={section} 
                onUpdate={onUpdate} 
                onUpdateContent={onUpdateContent} 
              />
            )}

            {section.type === 'problems' && (
              <SubItemFields
                section={section}
                onUpdateContent={onUpdateContent}
                fieldKey="items"
                itemTemplate={{ title: '', description: '', icon: 'AlertTriangle', stat: '', statLabel: '' }}
              />
            )}

            {section.type === 'features' && (
              <SubItemFields
                section={section}
                onUpdateContent={onUpdateContent}
                fieldKey="items"
                itemTemplate={{ title: '', description: '', icon: 'CheckCircle', result: '', duration: '' }}
              />
            )}

            {section.type === 'sectors' && (
              <SubItemFields
                section={section}
                onUpdateContent={onUpdateContent}
                fieldKey="items"
                itemTemplate={{ title: '', description: '', icon: 'Building2' }}
              />
            )}

            {section.type === 'stats' && (
              <SubItemFields
                section={section}
                onUpdateContent={onUpdateContent}
                fieldKey="stats"
                itemTemplate={{ value: '', label: '', description: '' }}
              />
            )}

            {section.type === 'certifications' && (
              <SubItemFields
                section={section}
                onUpdateContent={onUpdateContent}
                fieldKey="items"
                itemTemplate={{ acronym: '', name: '', description: '', year: '' }}
              />
            )}

            {section.type === 'faq' && (
              <SubItemFields
                section={section}
                onUpdateContent={onUpdateContent}
                fieldKey="items"
                itemTemplate={{ question: '', answer: '' }}
              />
            )}

            {section.type === 'quote' && (
              <div className="space-y-4">
                <Label className="text-[#1C5D15]">Autor y Texto de Cita</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input 
                    placeholder="Autor" 
                    value={section.content.author || ''} 
                    onChange={e => onUpdateContent('author', e.target.value)} 
                  />
                  <Input 
                    placeholder="Rol" 
                    value={section.content.role || ''} 
                    onChange={e => onUpdateContent('role', e.target.value)} 
                  />
                </div>
                <textarea
                  placeholder="La cita..."
                  value={section.content.quote || ''}
                  onChange={e => onUpdateContent('quote', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                />
                <ImageUpload
                  currentImage={section.content.image}
                  onImageUpload={url => onUpdateContent('image', url)}
                  type="avatar"
                />
              </div>
            )}

            {section.type === 'featured' && (
              <div>
                <Label className="text-[#1C5D15]">Imagen del Producto Destacado</Label>
                <ImageUpload
                  currentImage={section.content.productImage}
                  onImageUpload={(url) => onUpdateContent('productImage', url)}
                  type="banner"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
