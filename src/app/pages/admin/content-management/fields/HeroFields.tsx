import { Section } from '../../../../data/supabase';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { ImageUpload } from '../../../../components/ImageUpload';

interface HeroFieldsProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onUpdateContent: (field: string, value: any) => void;
}

export function HeroFields({ section, onUpdate, onUpdateContent }: HeroFieldsProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[#1C5D15]">Texto del Botón (Español)</Label>
          <Input
            type="text"
            value={section.content.ctaText || ''}
            onChange={(e) => onUpdateContent('ctaText', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#1C5D15]">Texto del Botón (English)</Label>
          <Input
            type="text"
            value={(section as any).contentEN?.ctaText || ''}
            onChange={(e) => {
              const currentContentEN = (section as any).contentEN || {};
              onUpdate({
                contentEN: {
                  ...currentContentEN,
                  ctaText: e.target.value
                }
              } as any);
            }}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[#1C5D15]">Enlace del Botón (Español)</Label>
          <Input
            type="text"
            value={section.content.ctaLink || ''}
            onChange={(e) => onUpdateContent('ctaLink', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[#1C5D15]">Enlace del Botón (English)</Label>
          <Input
            type="text"
            value={(section as any).contentEN?.ctaLink || ''}
            onChange={(e) => {
              const currentContentEN = (section as any).contentEN || {};
              // Fixed the typo in original AdminContent.tsx where it was modifying section object directly
              onUpdate({
                contentEN: {
                  ...currentContentEN,
                  ctaLink: e.target.value
                }
              } as any);
            }}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label className="text-[#1C5D15]">Imagen de Fondo</Label>
        <ImageUpload
          currentImage={section.content.backgroundImage}
          onImageUpload={(url) => onUpdateContent('backgroundImage', url)}
          type="banner"
        />
      </div>
    </>
  );
}
