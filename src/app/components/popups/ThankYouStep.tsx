import { useEffect } from 'react';

interface ThankYouStepProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function ThankYouStep({ title, message, onClose }: ThankYouStepProps) {
  useEffect(() => {
    // Cerrar automaticamente despues de 3 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Cerrar
      </button>
    </div>
  );
}