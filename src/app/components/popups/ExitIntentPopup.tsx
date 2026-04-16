import { useState } from 'react';
import { LeadData, LeadType } from './types';
import { PopupBase } from './PopupBase';
import { ThankYouStep } from './ThankYouStep';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadData) => void;
}

export function ExitIntentPopup({ isOpen, onClose, onSubmit }: ExitIntentPopupProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    message: '',
    lead_type: 'exit-intent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <PopupBase isOpen={isOpen} onClose={onClose}>
        <ThankYouStep
          title="¡Gracias por tu interés!"
          message="Hemos recibido tu solicitud. Te enviaremos el informe a tu correo en breve."
          onClose={onClose}
        />
      </PopupBase>
    );
  }

  return (
    <PopupBase isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Quieres descargar nuestro informe?</h2>
        <p className="text-gray-600 mb-6">
          Ingresa tus datos y te enviaremos nuestro informe exclusivo sobre protección de agua con tecnología bionanotecnológica.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje (opcional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Descargar informe'}
            </button>
          </div>
        </form>
      </div>
    </PopupBase>
  );
}