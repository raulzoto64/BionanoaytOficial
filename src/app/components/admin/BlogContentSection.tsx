import { useState } from 'react';
import { Trash2, GripVertical, Image as ImageIcon, Video, Quote, Grid, Type } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select } from '../../components/ui/select';
import { SelectContent } from '../../components/ui/select';
import { SelectItem } from '../../components/ui/select';
import { SelectTrigger } from '../../components/ui/select';
import { SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RichTextEditor } from './RichTextEditor';
import { ImageUpload } from '../../components/ImageUpload';

export type SectionType = 'text' | 'image' | 'video' | 'quote' | 'gallery';

interface BlogContentSectionProps {
  section: {
    id: string;
    type: SectionType;
    content: string;
    title?: string;
    order: number;
    headingLevel?: 1 | 2 | 3 | 4;
  };
  onUpdate: (section: { id: string; type: SectionType; content: string; title?: string; order: number; headingLevel?: 1 | 2 | 3 | 4 }) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function BlogContentSection({
  section,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: BlogContentSectionProps) {
  const [localTitle, setLocalTitle] = useState(section.title || '');
  const [localType, setLocalType] = useState(section.type);
  const [localHeadingLevel, setLocalHeadingLevel] = useState(section.headingLevel || 2);

  const handleHeadingLevelChange = (value: string) => {
    const level = parseInt(value) as 1 | 2 | 3 | 4;
    setLocalHeadingLevel(level);
    onUpdate({ ...section, headingLevel: level });
  };

  const handleContentChange = (content: string) => {
    onUpdate({ ...section, content });
  };

  const handleTypeChange = (type: SectionType) => {
    setLocalType(type);
    onUpdate({ ...section, type });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setLocalTitle(title);
    onUpdate({ ...section, title });
  };

  const renderSectionIcon = () => {
    switch (localType) {
      case 'text':    return <Type className="w-4 h-4" />;
      case 'image':   return <ImageIcon className="w-4 h-4" />;
      case 'video':   return <Video className="w-4 h-4" />;
      case 'quote':   return <Quote className="w-4 h-4" />;
      case 'gallery': return <Grid className="w-4 h-4" />;
      default:        return null;
    }
  };

  const renderSectionContent = () => {
    switch (localType) {
      case 'text':
        return (
          <RichTextEditor
            value={section.content}
            onChange={handleContentChange}
            placeholder="Escribe el contenido de la sección..."
            minHeight="220px"
          />
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <Input
              value={localTitle}
              onChange={handleTitleChange}
              placeholder="Autor de la cita"
            />
            <RichTextEditor
              value={section.content}
              onChange={handleContentChange}
              placeholder="Escribe la cita..."
              minHeight="150px"
            />
          </div>
        );

      case 'image':
        return (
          <ImageUpload
            onImageUpload={handleContentChange}
            currentImage={section.content}
            type="banner"
          />
        );

      case 'video':
        return (
          <div className="space-y-4">
            <Input
              value={section.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="URL del video (YouTube, Vimeo, etc.)"
            />
            {section.content && (
              <div className="aspect-video bg-[#629960]/10 rounded-lg flex items-center justify-center">
                <p className="text-[#629960]">Vista previa del video</p>
              </div>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <Input
              value={section.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="URLs de imágenes separadas por comas"
            />
            {section.content && (
              <div className="grid grid-cols-2 gap-4">
                {section.content.split(',').map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border border-[#629960]/30">
                    <img
                      src={url.trim()}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 mb-4 bg-white border-2 border-[#629960]/20 hover:border-[#629960]/40 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-[#629960] cursor-move" />
          <div className="w-8 h-8 bg-[#F0F9F0] rounded-full flex items-center justify-center">
            {renderSectionIcon()}
          </div>
          <div className="flex-1">
            <Input
              value={localTitle || (localType === 'text' ? '' : localType.charAt(0).toUpperCase() + localType.slice(1))}
              onChange={handleTitleChange}
              placeholder="Título de la sección"
              className="text-lg font-medium text-[#1C5D15] border-none p-0 h-auto focus:ring-0"
            />
          </div>
          {localType === 'text' && localTitle && (
            <div className="ml-2">
              <Select value={localHeadingLevel.toString()} onValueChange={handleHeadingLevelChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="H" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canMoveUp && onMoveUp && (
            <Button variant="outline" size="sm" className="border-[#629960] text-[#629960]" onClick={onMoveUp}>↑</Button>
          )}
          {canMoveDown && onMoveDown && (
            <Button variant="outline" size="sm" className="border-[#629960] text-[#629960]" onClick={onMoveDown}>↓</Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Tipo de Sección</Label>
          <Select value={localType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="image">Imagen</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="quote">Cita</SelectItem>
              <SelectItem value="gallery">Galería</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderSectionContent()}
      </div>
    </Card>
  );
}
