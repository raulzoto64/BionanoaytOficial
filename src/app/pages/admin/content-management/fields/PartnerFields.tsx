import { Section } from '../../../../data/supabase';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { ImageUpload } from '../../../../components/ImageUpload';

interface PartnerFieldsProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onUpdateContent: (field: string, value: any) => void;
}

export function PartnerFields({ section, onUpdate, onUpdateContent }: PartnerFieldsProps) {
  return (
    <div>
      <Label className="text-[#1C5D15]">Logos de Aliados</Label>
      {section.content.partners && section.content.partners.length > 0 ? (
        (section.content.partners as any[]).map((partner: any, idx: number) => (
          <div key={idx} className="border p-4 rounded-lg mb-4 relative group/partner">
            <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover/partner:opacity-100 transition-opacity z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPartnersES = section.content.partners.filter((_: any, i: number) => i !== idx);
                  const currentContentEN = (section as any).contentEN || {};
                  const newPartnersEN = (currentContentEN.partners || []).filter((_: any, i: number) => i !== idx);
                  onUpdate({
                    content: { ...section.content, partners: newPartnersES },
                    contentEN: { ...currentContentEN, partners: newPartnersEN }
                  } as any);
                }}
                className="h-8 w-8 p-0 bg-white text-red-500 hover:text-red-700 shadow-sm border rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#1C5D15]">Nombre (Español)</Label>
                <Input
                  type="text"
                  value={partner.name || ''}
                  onChange={(e) => {
                    const newPartners = [...section.content.partners];
                    newPartners[idx] = { ...newPartners[idx], name: e.target.value };
                    onUpdateContent('partners', newPartners);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[#1C5D15]">Nombre (English)</Label>
                <Input
                  type="text"
                  value={(section as any).contentEN?.partners?.[idx]?.name || ''}
                  onChange={(e) => {
                      const currentContentEN = (section as any).contentEN || {};
                      const currentPartnersEN = [...(currentContentEN.partners || [])];
                      currentPartnersEN[idx] = { ...(currentPartnersEN[idx] || {}), name: e.target.value };
                      onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                    }}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-[#1C5D15]">Abreviatura (Español)</Label>
                <Input
                  type="text"
                  value={partner.placeholder || ''}
                  onChange={(e) => {
                    const newPartners = [...section.content.partners];
                    newPartners[idx] = { ...newPartners[idx], placeholder: e.target.value };
                    onUpdateContent('partners', newPartners);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[#1C5D15]">Abreviatura (English)</Label>
                <Input
                  type="text"
                  value={(section as any).contentEN?.partners?.[idx]?.placeholder || ''}
                  onChange={(e) => {
                      const currentContentEN = (section as any).contentEN || {};
                      const currentPartnersEN = [...(currentContentEN.partners || [])];
                      currentPartnersEN[idx] = { ...(currentPartnersEN[idx] || {}), placeholder: e.target.value };
                      onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                    }}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-[#1C5D15]">Imagen</Label>
              <ImageUpload
                currentImage={partner.image}
                onImageUpload={(url) => {
                  const newPartners = [...section.content.partners];
                  newPartners[idx] = { ...newPartners[idx], image: url };
                  onUpdateContent('partners', newPartners);
                }}
                type="avatar"
              />
            </div>

            <div className="mt-4">
              <Label className="text-[#1C5D15]">Enlace (URL)</Label>
              <Input
                type="text"
                value={partner.link || ''}
                onChange={(e) => {
                  const newPartners = [...section.content.partners];
                  newPartners[idx] = { ...newPartners[idx], link: e.target.value };
                  onUpdateContent('partners', newPartners);
                }}
                placeholder="https://ejemplo.com"
                className="mt-1"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-[#1C5D15]">Descripción (Español)</Label>
                <textarea
                  value={partner.description || ''}
                  onChange={(e) => {
                    const newPartners = [...section.content.partners];
                    newPartners[idx] = { ...newPartners[idx], description: e.target.value };
                    onUpdateContent('partners', newPartners);
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  rows={3}
                  placeholder="Breve descripción de la organización..."
                />
              </div>
              <div>
                <Label className="text-[#1C5D15]">Descripción (English)</Label>
                <textarea
                  value={(section as any).contentEN?.partners?.[idx]?.description || ''}
                  onChange={(e) => {
                      const currentContentEN = (section as any).contentEN || {};
                      const currentPartnersEN = [...(currentContentEN.partners || [])];
                      currentPartnersEN[idx] = { ...(currentPartnersEN[idx] || {}), description: e.target.value };
                      onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                    }}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  rows={3}
                  placeholder="Short organization description..."
                />
              </div>
            </div>

            {/* Details section omitted here but can be added similarly */}
          </div>
        ))
      ) : (
        <div className="text-[#629960] text-sm">
          No hay aliados definidos
        </div>
      )}
      <Button
        variant="outline"
        onClick={() => {
          const newPartner = { name: "", image: "", link: "", details: [], description: "" };
          const updatedPartnersES = [...(section.content.partners || []), newPartner];
          const currentContentEN = (section as any).contentEN || {};
          const updatedPartnersEN = [...(currentContentEN.partners || []), { ...newPartner }];
          onUpdate({
            content: { ...section.content, partners: updatedPartnersES },
            contentEN: { ...currentContentEN, partners: updatedPartnersEN }
          } as any);
        }}
        className="w-full mt-4 py-8 border-dashed border-2 border-[#1C5D15]/30 text-[#1C5D15] hover:bg-[#1C5D15]/5 hover:border-[#1C5D15] transition-all"
      >
        <Plus className="w-5 h-5 mr-2" />
        Añadir Nuevo Aliado / Logo
      </Button>
    </div>
  );
}
