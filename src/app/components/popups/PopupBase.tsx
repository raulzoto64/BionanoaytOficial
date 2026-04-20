import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PopupBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function PopupBase({ isOpen, onClose, children }: PopupBaseProps) {
  
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay fondo - Transparente como pediste */}
      <div 
        className="absolute inset-0 bg-green-900/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Contenedor popup */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Boton cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
