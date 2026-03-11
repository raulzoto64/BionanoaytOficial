import { useState, useId } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  userId?: string;
  type?: 'avatar' | 'banner';
}

export function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  userId = 'default', 
  type = 'avatar' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const uniqueId = useId(); // Generar un id único para cada componente

  // Configuración de ImageKit (Cuentas por defecto de HitPoly)
  const DEFAULT_CONFIG = {
    avatar: {
      publicKey: "public_Et8QkoYluHINxWKh3aTIOB0b464=",
      privateKey: "private_n+77Uw3D8PATiLls8b3tA8JrH+k="
    },
    banner: {
      publicKey: "public_LMAf2QROhvzzt89GcZrQQLp1ydI=",
      privateKey: "private_KHCQyprWox4wBQO/T0lfRn2xMSE="
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Preparar datos para upload
      const fileName = `${type}_user_${userId}_${Date.now()}.webp`;
      const folder = type === 'avatar' ? "/perfiles/avatares" : "/perfiles/banners";

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
        const imageUrl = `${data.url}?v=${Date.now()}`;
        onImageUpload(imageUrl);
      } else {
        console.error('Error ImageKit:', data.message);
        alert(`Error: ${data.message || 'No se pudo subir la imagen'}`);
      }
    } catch (error) {
      console.error('Error al subir:', error);
      alert('Error al conectar con el servidor de imágenes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative w-32 h-32">
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          id={uniqueId} 
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById(uniqueId)?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
        </Button>
      </div>
    </div>
  );
}
