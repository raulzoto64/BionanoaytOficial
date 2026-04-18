import { useState, useEffect } from 'react';
import { LeadData } from './types';
import { PopupBase } from './PopupBase';
import { ThankYouStep } from './ThankYouStep';
import { supabaseAPI, Form } from '../../data/supabase';
import { Loader2, Mail, User, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExitIntentPopupProps {
  popupId: string | null;
  onClose: () => void;
  onSubmit: (data: LeadData) => void;
}

export function ExitIntentPopup({ popupId, onClose, onSubmit }: ExitIntentPopupProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formConfig, setFormConfig] = useState<Form | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (popupId && popupId !== 'exit-intent') {
      loadFormConfig(popupId);
    } else if (popupId === 'exit-intent') {
      // Default Exit Intent Config Multilingual
      setFormConfig({
        id: 'exit-intent',
        name: 'Exit Intent',
        title_es: '¿Quieres descargar nuestro informe?',
        title_en: 'Want to download our report?',
        subtitle_es: 'Bionanotecnología y sostenibilidad aplicada.',
        subtitle_en: 'Applied bionanotechnology and sustainability.',
        image_url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
        fields: [
          { 
            id: 'f1', 
            label_es: 'Nombre', 
            label_en: 'Name', 
            name: 'name', 
            type: 'text', 
            required: true, 
            placeholder_es: 'Tu nombre...', 
            placeholder_en: 'Your name...' 
          },
          { 
            id: 'f2', 
            label_es: 'Email', 
            label_en: 'Email', 
            name: 'email', 
            type: 'email', 
            required: true, 
            placeholder_es: 'tu@email.com', 
            placeholder_en: 'you@email.com' 
          },
          { 
            id: 'f3', 
            label_es: 'Mensaje (opcional)', 
            label_en: 'Message (optional)', 
            name: 'message', 
            type: 'textarea', 
            required: false 
          }
        ],
        is_active: true,
        created_at: '',
        updated_at: ''
      });
    }
  }, [popupId]);

  const loadFormConfig = async (id: string) => {
    setLoading(true);
    try {
      const form = await supabaseAPI.getFormById(id);
      if (form) {
        setFormConfig(form);
      }
    } catch (error) {
      console.error('Error loading form config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        lead_type: (formConfig?.name || 'custom-form') as any,
        metadata: { formId: formConfig?.id, language }
      } as any);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOpen = !!popupId;

  if (showThankYou) {
    return (
      <PopupBase isOpen={isOpen} onClose={onClose}>
        <ThankYouStep
          title={language === 'es' ? "¡Formulario Recibido!" : "Form Received!"}
          message={language === 'es' 
            ? "Gracias por ponerte en contacto con nosotros. Uno de nuestros especialistas te responderá a la brevedad." 
            : "Thank you for contacting us. One of our specialists will respond to you shortly."}
          onClose={onClose}
        />
      </PopupBase>
    );
  }

  if (loading) {
    return (
      <PopupBase isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="w-10 h-10 text-[#1C5D15] animate-spin mb-4" />
          <p className="text-[#629960] font-bold">{language === 'es' ? 'Cargando formulario...' : 'Loading form...'}</p>
        </div>
      </PopupBase>
    );
  }

  if (!formConfig && popupId) {
    return (
      <PopupBase isOpen={isOpen} onClose={onClose}>
        <div className="p-10 text-center">
          <p className="text-red-500 font-bold">
            {language === 'es' 
              ? 'Error: El formulario seleccionado no existe o no está disponible.' 
              : 'Error: The selected form does not exist or is not available.'}
          </p>
        </div>
      </PopupBase>
    );
  }

  // Helper to pick the right lang field
  const title = language === 'es' ? formConfig?.title_es : formConfig?.title_en;
  const subtitle = language === 'es' ? formConfig?.subtitle_es : formConfig?.subtitle_en;

  return (
    <PopupBase isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row min-h-[500px] overflow-hidden">
        {/* Lado Izquierdo: Imagen Premium */}
        <div className="hidden md:block md:w-[45%] relative">
          <img 
            src={formConfig?.image_url || 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800'} 
            className="w-full h-full object-cover"
            alt="Bionano Visual"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C5D15]/90 via-transparent to-transparent flex items-end p-10">
            <div>
              <div className="w-16 h-1 bg-[#19FF00] mb-4"></div>
              <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-none">Bionano<br/>Technology</h3>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="flex-1 p-8 lg:p-12 bg-white flex flex-col justify-center overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="mb-10">
            <span className="inline-block px-3 py-1 bg-[#19FF00]/10 text-[#1C5D15] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
              {formConfig?.name || 'Formulario'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#1C5D15] mb-3 leading-tight tracking-tighter">
              {title}
            </h2>
            <div className="w-12 h-0.5 bg-gray-100 mb-4" />
            <p className="text-[#629960] font-medium text-sm lg:text-base opacity-80 max-w-md">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {formConfig?.fields.map((field) => {
                const label = (language === 'es' ? field.label_es : field.label_en) || field.name || 'Campo';
                const placeholder = language === 'es' ? field.placeholder_es : field.placeholder_en;
                const fallbackPlaceholder = `${language === 'es' ? 'Introduce' : 'Enter'} ${label.toLowerCase()}...`;

                return (
                  <div key={field.id} className={`relative group ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                    <label className="block text-[10px] font-black text-[#629960] uppercase tracking-widest ml-1 mb-2 opacity-60 group-focus-within:opacity-100 transition-opacity">
                      {label} {field.required && <span className="text-[#19FF00]">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        placeholder={placeholder || (language === 'es' ? 'Cuéntanos un poco más...' : 'Tell us more...')}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#19FF00]/30 focus:bg-white focus:border-[#19FF00]/30 outline-none transition-all text-sm text-[#1C5D15] min-h-[100px] shadow-sm"
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    ) : field.type === 'select' ? (
                      <div className="relative">
                        <select
                          required={field.required}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#19FF00]/30 focus:bg-white focus:border-[#19FF00]/30 outline-none transition-all text-sm text-[#1C5D15] appearance-none shadow-sm cursor-pointer"
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                          <option value="">{language === 'es' ? 'Selecciona...' : 'Select...'}</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none rotate-90" size={14} />
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={placeholder || fallbackPlaceholder}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#19FF00]/30 focus:bg-white focus:border-[#19FF00]/30 outline-none transition-all text-sm text-[#1C5D15] shadow-sm"
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#19FF00] transition-colors">
                          {field.type === 'email' && <Mail size={16} />}
                          {field.type === 'text' && <User size={16} />}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#1C5D15]/20 flex items-center justify-center gap-2 mt-4 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {language === 'es' ? 'Enviando...' : 'Sending...'}
                </>
              ) : (
                <>
                  {language === 'es' ? 'Enviar Solicitud' : 'Send Request'} <Check size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-[9px] text-center text-gray-400 font-bold uppercase tracking-[0.2em]">
            {language === 'es' 
              ? 'Protegemos tus datos • Al enviar aceptas nuestra Política de Privacidad' 
              : 'Protecting your data • By sending you accept our Privacy Policy'}
          </p>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(26,92,21,0.1); border-radius: 10px; }
      `}</style>
    </PopupBase>
  );
}