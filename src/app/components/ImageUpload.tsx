import { useState, useId } from 'react';
import { Button } from './ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string | string[]) => void;
  currentImages?: string[] | string;
  currentImage?: string;
  userId?: string;
  type?: 'avatar' | 'banner' | 'product';
}

export function ImageUpload({ 
  onImageUpload, 
  currentImages = [], 
  currentImage,
  userId = 'default', 
  type = 'product' 
}: ImageUploadProps) {
  // Manejar compatibilidad con currentImage
  const images = currentImage ? [currentImage] : currentImages;
  const [uploading, setUploading] = useState(false);
  const uniqueId = useId(); // Generar un id único para cada componente

  // Configuración de ImageKit (Cuentas por defecto de HitPoly)
  const DEFAULT_CONFIG = {
    avatar: {
      publicKey: "public_eytYlzqr/41E3UAUOhgd42aLsRU=",
      privateKey: "private_0pjvBk9JAaqJa5froe2f3miRYyk="
    },
    banner: {
      publicKey: "public_eytYlzqr/41E3UAUOhgd42aLsRU=",
      privateKey: "private_0pjvBk9JAaqJa5froe2f3miRYyk="
    },
    product: {
      publicKey: "public_eytYlzqr/41E3UAUOhgd42aLsRU=",
      privateKey: "private_0pjvBk9JAaqJa5froe2f3miRYyk="
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Preparar datos para upload
        const fileName = `${type}_user_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webp`;
        const folder = type === 'avatar' ? "/perfiles/avatares" : type === 'banner' ? "/perfiles/banners" : "/productos/imagenes";

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('useUniqueFileName', 'false');
        formData.append('overwriteFile', 'true');
        formData.append('folder', folder);

        // Obtener configuración de ImageKit
        const config = DEFAULT_CONFIG[type];

        // Subir a ImageKit
        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Basic ${btoa(`${config.privateKey}:`)}`
          }
        });

        const data = await response.json();
        
        if (response.ok && data.url) {
          // Agregar versión para evitar caché
          return `${data.url}?v=${Date.now()}`;
        } else {
          console.error('Error ImageKit:', data.message);
          throw new Error(`Error: ${data.message || 'No se pudo subir la imagen'}`);
        }
      });

        const newImages = await Promise.all(uploadPromises);
        const updatedImages = [...currentImages, ...newImages];
        // Si solo se espera una imagen, devolver la primera
        if (currentImage !== undefined) {
          onImageUpload(newImages[0] || '');
        } else {
          onImageUpload(updatedImages);
        }
    } catch (error) {
      console.error('Error al subir:', error);
      alert('Error al conectar con el servidor de imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const imagesArray = Array.isArray(currentImages) ? currentImages : [];
    const updatedImages = imagesArray.filter((_, i) => i !== index);
    if (currentImage !== undefined) {
      onImageUpload('');
    } else {
      onImageUpload(updatedImages);
    }
  };

  return (
    <div className="space-y-4">
      {Array.isArray(images) && images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square w-full">
              <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md transition-colors"
                title="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          id={uniqueId}
          multiple
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById(uniqueId)?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
        </Button>
      </div>
    </div>
  );
}
