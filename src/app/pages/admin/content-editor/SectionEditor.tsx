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
  Save 
} from 'lucide-react';
import { ImageUpload } from '../../../components/ImageUpload';
import { toast } from 'sonner';

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
}: SectionEditorProps) {
  const sectionTypes = [
    { value: 'hero', label: 'Hero (Banner Principal)' },
    { value: 'text', label: 'Texto' },
    { value: 'features', label: 'Características' },
    { value: 'products', label: 'Productos' },
    { value: 'team', label: 'Equipo' },
    { value: 'timeline', label: 'Línea de Tiempo' },
    { value: 'contact', label: 'Contacto' },
    { value: 'custom', label: 'Personalizado' },
    { value: 'trust', label: 'Confianza' },
    { value: 'ecosystem', label: 'Ecosistema' },
    { value: 'featured', label: 'Destacado' },
    { value: 'blog', label: 'Blog / Noticias' },
    { value: 'clientes', label: 'Clientes (Ecosistema)' },
    { value: 'flipcards', label: 'Tarjetas Informativas' },
    { value: 'category-filter', label: 'Filtro de Categorías' },
  ];

  const handleSaveSection = async () => {
    try {
      await onSaveSection(section);
      toast.success('Sección guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la sección');
    }
  };

  return (
    <Card className={`p-3 bg-white border-2 ${section.visible ? 'border-[#629960]/20' : 'border-gray-300'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="p-0 h-6 w-6"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <div>
            <h3 className="text-sm text-[#1C5D15]">
              Sección {index + 1}: {sectionTypes.find(t => t.value === section.type)?.label}
            </h3>
            <p className="text-xs text-[#629960]">ID: {section.id}</p>
          </div>
          <Badge className={section.visible ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-400 text-white'}>
            {section.visible ? 'Visible' : 'Oculta'}
          </Badge>
        </div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ visible: !section.visible })}
            className="border-[#629960] text-[#629960] h-6 px-2 text-xs"
          >
            {section.visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={index === 0}
            className="border-[#1C5D15] text-[#1C5D15] h-6 px-2"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="border-[#1C5D15] text-[#1C5D15] h-6 px-2"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="border-red-500 text-red-500 hover:bg-red-50 h-6 px-2"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSection}
            className="border-[#19FF00] text-[#1C5D15] h-6 px-2"
          >
            <Save className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-[#1C5D15] text-sm">Tipo de Sección</Label>
              <select
                value={section.type}
                onChange={(e) => onUpdate({ type: e.target.value as Section['type'] })}
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              >
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-[#1C5D15] text-sm">Orden</Label>
              <Input
                type="number"
                value={section.order}
                onChange={(e) => onUpdate({ order: parseInt(e.target.value) })}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm text-[#1C5D15] font-semibold">Contenido</h4>
            
            {(section.type === 'hero' || section.type === 'text' || section.type === 'features' || 
              section.type === 'team' || section.type === 'products' || section.type === 'featured' ||
              section.type === 'trust' || section.type === 'ecosystem' || section.type === 'timeline' || section.type === 'blog') && (
              <>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Título (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.title || ''}
                      onChange={(e) => onUpdateContent('title', e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Título (English)</Label>
                    <Input
                      type="text"
                      value={(section as any).contentEN?.title || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        onUpdate({
                          ...section,
                          contentEN: {
                            ...currentContentEN,
                            title: e.target.value
                          }
                        } as any);
                      }}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                {(section.type === 'hero' || section.type === 'text') && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#1C5D15] text-sm">
                        {section.type === 'hero' ? 'Subtítulo' : 'Texto'} (Español)
                      </Label>
                      <textarea
                        value={section.content.subtitle || section.content.text || ''}
                        onChange={(e) => onUpdateContent(section.type === 'hero' ? 'subtitle' : 'text', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-[#1C5D15] text-sm">
                        {section.type === 'hero' ? 'Subtítulo' : 'Texto'} (English)
                      </Label>
                      <textarea
                        value={(section as any).contentEN?.subtitle || (section as any).contentEN?.text || ''}
                        onChange={(e) => {
                          const currentContentEN = (section as any).contentEN || {};
                          onUpdate({
                            ...section,
                            contentEN: {
                              ...currentContentEN,
                              [section.type === 'hero' ? 'subtitle' : 'text']: e.target.value
                            }
                          } as any);
                        }}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {section.type === 'hero' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Texto del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaText || ''}
                          onChange={(e) => onUpdateContent('ctaText', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Texto del Botón (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.ctaText || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            onUpdate({
                              ...section,
                              contentEN: {
                                ...currentContentEN,
                                ctaText: e.target.value
                              }
                            } as any);
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Enlace del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaLink || ''}
                          onChange={(e) => onUpdateContent('ctaLink', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Enlace del Botón (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.ctaLink || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            onUpdate({
                              ...section,
                              contentEN: {
                                ...currentContentEN,
                                ctaLink: e.target.value
                              }
                            } as any);
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#1C5D15] text-sm">Imagen de Fondo</Label>
                      <ImageUpload
                        currentImage={section.content.backgroundImage}
                        onImageUpload={(url) => onUpdateContent('backgroundImage', url)}
                        type="banner"
                      />
                    </div>
                  </>
                )}

                {section.type === 'featured' && (
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Imagen del Producto</Label>
                    <ImageUpload
                      currentImage={section.content.productImage}
                      onImageUpload={(url) => onUpdateContent('productImage', url)}
                      type="banner"
                    />
                  </div>
                )}

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-xs font-semibold text-[#1C5D15] mb-2">SEO - Meta Tags</h5>
                  <div>
                    <Label className="text-[#1C5D15] text-xs">Título Meta</Label>
                    <Input
                      type="text"
                      value={section.content.seo?.metaTitle || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaTitle: e.target.value
                        });
                      }}
                      className="mt-1 text-xs"
                      placeholder="Título para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-1">
                    <Label className="text-[#1C5D15] text-xs">Descripción Meta</Label>
                    <textarea
                      value={section.content.seo?.metaDescription || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaDescription: e.target.value
                        });
                      }}
                      className="w-full mt-1 px-2 py-1 border rounded text-xs"
                      rows={2}
                      placeholder="Descripción para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-1">
                    <Label className="text-[#1C5D15] text-xs">Palabras Clave</Label>
                    <Input
                      type="text"
                      value={section.content.seo?.metaKeywords || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaKeywords: e.target.value
                        });
                      }}
                      className="mt-1 text-xs"
                      placeholder="palabra1, palabra2, palabra3"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
