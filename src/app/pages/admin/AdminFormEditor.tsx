import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabaseAPI, Form, FormField } from '../../data/supabase';
import {
  Plus,
  Trash2,
  Save,
  Smartphone,
  ChevronUp,
  ChevronDown,
  Monitor,
  Tablet,
  ChevronLeft,
  Mail,
  User,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  ChevronRight,
  MousePointer2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { ImageUpload } from '../../components/ImageUpload';
import { useLanguage } from '../../contexts/LanguageContext';

const PREDEFINED_FIELDS = [
  { label_es: 'Nombre Completo', label_en: 'Full Name', name: 'name', type: 'text', required: true, placeholder_es: 'Tu nombre...', placeholder_en: 'Your name...' },
  { label_es: 'Correo Electrónico', label_en: 'Email Address', name: 'email', type: 'email', required: true, placeholder_es: 'tu@email.com', placeholder_en: 'you@email.com' },
  { label_es: 'Teléfono / WhatsApp', label_en: 'Phone / WhatsApp', name: 'phone', type: 'tel', required: true, placeholder_es: '+57...', placeholder_en: '+1...' },
  { label_es: 'Mensaje / Comentario', label_en: 'Message / Comment', name: 'message', type: 'textarea', required: false, placeholder_es: '¿En qué podemos ayudarte?', placeholder_en: 'How can we help you?' },
  { label_es: 'Empresa', label_en: 'Company', name: 'company', type: 'text', required: false, placeholder_es: 'Nombre de tu empresa', placeholder_en: 'Your company name' },
];

export function AdminFormEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const [form, setForm] = useState<Partial<Form> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState<'sections' | 'config'>('sections');
  const [activeLanguage, setActiveLanguage] = useState<'es' | 'en'>('es');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  // Sincronizar idioma con el contexto para la previsualización
  useEffect(() => {
    setLanguage(activeLanguage);
  }, [activeLanguage, setLanguage]);

  useEffect(() => {
    if (id && id !== 'new') {
      loadForm(id);
    } else {
      setForm({
        name: 'Nuevo Formulario',
        title_es: '¿Te gustaría recibir nuestro catálogo?',
        title_en: 'Would you like to receive our catalog?',
        subtitle_es: 'Déjanos tus datos y te lo enviaremos gratis.',
        subtitle_en: 'Leave your details and we will send it for free.',
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        fields: [
          { id: crypto.randomUUID(), label_es: 'Nombre Completo', label_en: 'Full Name', name: 'name', type: 'text', required: true, placeholder_es: 'Tu nombre...', placeholder_en: 'Your name...' },
          { id: crypto.randomUUID(), label_es: 'Email', label_en: 'Email', name: 'email', type: 'email', required: true, placeholder_es: 'tu@email.com', placeholder_en: 'you@email.com' }
        ],
        is_active: true
      });
      setLoading(false);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getFormById(formId);
      if (data) setForm(data);
    } catch (error) {
      toast.error('Error al cargar el formulario');
      navigate('/admin/forms');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    console.log('[EDITOR] Intentando guardar formulario...', form);

    if (!form?.name || !form?.title_es || !form?.title_en) {
      const missing = [];
      if (!form?.name) missing.push('Nombre');
      if (!form?.title_es) missing.push('Título ES');
      if (!form?.title_en) missing.push('Título EN');

      console.warn('[EDITOR] Faltan campos obligatorios:', missing);
      toast.error(`Campos obligatorios faltantes: ${missing.join(', ')}`);
      return;
    }

    setSaving(true);
    try {
      console.log('[EDITOR] Ejecutando guardado en Supabase...');
      if (form.id) {
        const result = await supabaseAPI.updateForm(form.id, form);
        console.log('[EDITOR] Resultado actualización:', result);
        toast.success('Formulario publicado correctamente');
      } else {
        const result = await supabaseAPI.createForm(form);
        console.log('[EDITOR] Resultado creación:', result);
        toast.success('Nuevo formulario creado');
      }

      setTimeout(() => {
        navigate('/admin/forms');
      }, 1000);
    } catch (error: any) {
      console.error('[EDITOR] Error crítico al guardar:', error);
      toast.error(`Error al guardar: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    if (!form) return;
    const newField: FormField = {
      id: crypto.randomUUID(),
      label_es: 'Nuevo Campo',
      label_en: 'New Field',
      name: `field_${form.fields?.length || 0}`,
      type: 'text',
      required: false,
      placeholder_es: '',
      placeholder_en: ''
    };
    setForm({ ...form, fields: [...(form.fields || []), newField] });
    setActiveFieldId(newField.id);
    setActiveTab('config');
  };

  const quickAddField = (predefined: any) => {
    if (!form) return;
    const newField: FormField = { id: crypto.randomUUID(), ...predefined };
    setForm({ ...form, fields: [...(form.fields || []), newField] });
    toast.success(`Añadido: ${predefined.label_es}`);
  };

  const removeField = (id: string) => {
    if (!form) return;
    setForm({ ...form, fields: form.fields?.filter(f => f.id !== id) });
    if (activeFieldId === id) setActiveFieldId(null);
  };

  const updateField = (fId: string, updates: Partial<FormField>) => {
    if (!form) return;
    setForm({ ...form, fields: form.fields?.map(f => f.id === fId ? { ...f, ...updates } : f) });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (!form?.fields) return;
    const newFields = [...form.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setForm({ ...form, fields: newFields });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f0f2f0]">
        <Loader2 className="w-12 h-12 text-[#1C5D15] animate-spin mb-4" />
        <p className="text-[#1C5D15] font-black uppercase tracking-widest text-xs">Cargando Workspace Pro...</p>
      </div>
    );
  }

  if (!form) return null;

  const activeField = form.fields?.find(f => f.id === activeFieldId);

  return (
    <div className="h-screen w-full bg-[#f0f2f0] flex flex-col overflow-hidden font-sans">

      {/* TOOLBAR PREMIUM - IGUAL AL EDITOR DE PAGINAS */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-50 shadow-sm relative">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/forms')}
            className="text-[#629960] hover:text-[#1C5D15] hover:bg-[#1C5D15]/5 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver
          </Button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h1 className="font-extrabold text-[#1C5D15] text-sm uppercase tracking-tighter">
              {form.name}
            </h1>
            <p className="text-[10px] text-[#629960] font-medium uppercase tracking-widest leading-none">Editor Visual de Formularios</p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-2 rounded-xl transition-all ${deviceView === 'mobile' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-2 rounded-xl transition-all ${deviceView === 'tablet' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-2 rounded-xl transition-all ${deviceView === 'desktop' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 border rounded-xl p-1 gap-1">
            <button
              className={`h-7 px-3 text-[10px] font-black rounded-lg transition-all ${activeLanguage === 'es' ? 'bg-[#1C5D15] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveLanguage('es')}
            >
              ES
            </button>
            <button
              className={`h-7 px-3 text-[10px] font-black rounded-lg transition-all ${activeLanguage === 'en' ? 'bg-[#1C5D15] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveLanguage('en')}
            >
              EN
            </button>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1C5D15] hover:text-[#1C5D15] text-white rounded-full px-8 py-5 h-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#1C5D15]/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Publicando...' : 'Publicar Cambios'}
          </Button>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR COLAPSABLE */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute z-[999] transition-all duration-300 ease-out bg-white shadow-xl rounded-lg p-2 hover:bg-gray-50 left-4 top-[16px] ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <PanelLeftOpen className="w-5 h-5 text-[#1C5D15]" />
        </button>

        <aside className={`${sidebarOpen ? 'w-[400px]' : 'w-0'} bg-white border-r flex-shrink-0 flex flex-col h-full overflow-hidden shadow-2xl relative z-10 transition-all duration-300 ease-out`}>
          <div className="p-4 border-b bg-gray-50/80">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-black text-[#1C5D15] text-xs uppercase tracking-widest leading-none mb-1">Configuración Pro</h2>
                <p className="text-[9px] text-[#629960] font-bold uppercase tracking-tighter">Formulario {activeLanguage.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <PanelLeftClose className="w-4 h-4 text-[#1C5D15]" />
              </button>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('sections')}
                className={`flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'sections' ? 'bg-white text-[#1C5D15] shadow-sm' : 'text-gray-500 hover:text-[#1C5D15]'}`}
              >
                📋 Estructura
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'config' ? 'bg-white text-[#1C5D15] shadow-sm' : 'text-gray-500 hover:text-[#1C5D15]'}`}
              >
                ⚙️ Ajustes
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar-sidebar">
            {activeTab === 'sections' ? (
              <div className="p-6 space-y-8">
                {/* Datos Básicos */}
                <section>
                  <h3 className="text-[#1C5D15] font-black uppercase text-[10px] tracking-[0.2em] mb-4">Fila de Cabecera</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block ml-1">Título ({activeLanguage.toUpperCase()})</label>
                      <input
                        type="text"
                        value={activeLanguage === 'es' ? (form.title_es || '') : (form.title_en || '')}
                        onChange={(e) => setForm({ ...form, [activeLanguage === 'es' ? 'title_es' : 'title_en']: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-[#1C5D15] shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block ml-1">Subtítulo ({activeLanguage.toUpperCase()})</label>
                      <textarea
                        value={activeLanguage === 'es' ? (form.subtitle_es || '') : (form.subtitle_en || '')}
                        onChange={(e) => setForm({ ...form, [activeLanguage === 'es' ? 'subtitle_es' : 'subtitle_en']: e.target.value })}
                        rows={3}
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-medium text-[#629960] shadow-inner leading-relaxed"
                      />
                    </div>
                  </div>
                </section>

                {/* Lista de Campos */}
                <section className="pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#1C5D15] font-black uppercase text-[10px] tracking-[0.2em]">Campos de Entrada</h3>
                    <button onClick={addField} className="p-2 bg-[#1C5D15] text-white rounded-xl hover:text-[#1C5D15] transition-all shadow-lg shadow-[#1C5D15]/20">
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.fields?.map((field, idx) => (
                      <div
                        key={field.id}
                        onClick={() => { setActiveFieldId(field.id); setActiveTab('config'); }}
                        className={`group p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-[#19FF00] cursor-pointer transition-all flex items-center justify-between ${activeFieldId === field.id ? 'bg-[#F7F9CE]/30 border-[#19FF00]' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform">
                            {field.type === 'text' && <User size={14} className="text-[#1C5D15]" />}
                            {field.type === 'email' && <Mail size={14} className="text-[#1C5D15]" />}
                            {field.type === 'textarea' && <Layers size={14} className="text-[#1C5D15]" />}
                            {field.type === 'tel' && <ChevronRight size={14} className="text-[#1C5D15]" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-[#1C5D15] uppercase">{activeLanguage === 'es' ? field.label_es : field.label_en}</p>
                            <p className="text-[8px] font-bold text-gray-300 uppercase">{field.type}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); moveField(idx, 'up'); }} disabled={idx === 0} className="p-1.5 hover:bg-white rounded-lg text-gray-300 hover:text-[#1C5D15]"><ChevronUp size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); moveField(idx, 'down'); }} disabled={idx === (form.fields?.length || 0) - 1} className="p-1.5 hover:bg-white rounded-lg text-gray-300 hover:text-[#1C5D15]"><ChevronDown size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pt-8">
                  <h3 className="text-[#1C5D15] font-black uppercase text-[10px] tracking-[0.2em] mb-4">Librería de Campos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PREDEFINED_FIELDS.map(pf => (
                      <button
                        key={pf.name}
                        onClick={() => quickAddField(pf)}
                        className="bg-white border-2 border-gray-100 hover:border-[#19FF00] hover:bg-gray-50 p-4 rounded-3xl flex flex-col items-center justify-center transition-all group"
                      >
                        <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Plus size={14} className="text-[#1C5D15]" />
                        </div>
                        <span className="text-[9px] font-black text-[#1C5D15] uppercase text-center leading-tight">{activeLanguage === 'es' ? pf.label_es : pf.label_en}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="p-8">
                {activeField ? (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-black text-[#1C5D15] uppercase tracking-widest">Edición de Campo</span>
                      <button onClick={() => removeField(activeField.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Etiqueta ({activeLanguage.toUpperCase()})</label>
                        <input
                          type="text"
                          value={activeLanguage === 'es' ? activeField.label_es : activeField.label_en}
                          onChange={(e) => updateField(activeField.id, { [activeLanguage === 'es' ? 'label_es' : 'label_en']: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-[#1C5D15]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Placeholder ({activeLanguage.toUpperCase()})</label>
                        <input
                          type="text"
                          value={(activeLanguage === 'es' ? activeField.placeholder_es : activeField.placeholder_en) || ''}
                          onChange={(e) => updateField(activeField.id, { [activeLanguage === 'es' ? 'placeholder_es' : 'placeholder_en']: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-[#629960]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Tipo de Campo</label>
                          <select
                            value={activeField.type}
                            onChange={(e) => updateField(activeField.id, { type: e.target.value as any })}
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-[10px] font-black uppercase text-[#1C5D15]"
                          >
                            <option value="text">Texto</option>
                            <option value="email">Email</option>
                            <option value="tel">Teléfono</option>
                            <option value="textarea">Área de texto</option>
                            <option value="select">Lista Desplegable</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Obligatorio</label>
                          <div className="flex h-[52px] items-center px-5 bg-gray-50 rounded-2xl">
                            <input
                              type="checkbox"
                              checked={activeField.required}
                              onChange={(e) => updateField(activeField.id, { required: e.target.checked })}
                              className="w-4 h-4 rounded text-[#1C5D15] focus:ring-[#19FF00]"
                            />
                            <span className="text-[10px] font-black text-[#1C5D15] uppercase ml-3 tracking-widest">Activo</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-50">
                        <h3 className="text-[#1C5D15] font-black uppercase text-[10px] tracking-[0.2em] mb-4">Imagen del Formulario</h3>
                        <ImageUpload
                          currentImage={form.image_url}
                          onImageUpload={(url) => setForm({ ...form, image_url: Array.isArray(url) ? url[0] : url })}
                          type="product"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none opacity-40">
                    <MousePointer2 className="w-12 h-12 text-[#1C5D15] mb-4 animate-bounce" />
                    <h3 className="text-[#1C5D15] font-black uppercase text-xs mb-2">Selecciona un campo</h3>
                    <p className="text-[10px] text-[#629960] leading-relaxed">Toca cualquier campo de la lista o de la previsualización para editar sus detalles.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* WORKSPACE / CANVAS REDESIÑADO */}
        <main className="flex-1 bg-[#222] overflow-y-auto flex items-start justify-center p-12 lg:p-20 custom-scrollbar-dark relative">
          {/* Info Badge */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#1C5D15] text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl z-[100] border border-white/20 backdrop-blur-md flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#19FF00] animate-pulse"></div>
            {deviceView} View • {activeLanguage.toUpperCase()} MODE • MOCKUP LIVE
          </div>

          <div className={`relative transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${deviceView === 'mobile' ? 'w-[375px] h-[812px] bg-white rounded-[60px] border-[12px] border-[#111] shadow-[0_50px_100px_rgba(0,0,0,0.5)]' :
            deviceView === 'tablet' ? 'w-[768px] h-[1024px] bg-white rounded-[40px] border-[14px] border-[#111] shadow-[0_50px_100px_rgba(0,0,0,0.5)]' :
              'w-full max-w-[1200px] h-[800px] bg-transparent'
            } flex items-center justify-center relative overflow-hidden`}>

            {deviceView === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#111] rounded-b-3xl z-[100] flex items-end justify-center pb-1">
                <div className="w-12 h-1 bg-gray-800 rounded-full" />
              </div>
            )}

            {/* EL POPUP REAL COMO PREVIEW */}
            <div className={`w-full h-full overflow-y-auto custom-scrollbar-preview ${deviceView === 'desktop' ? 'flex items-center justify-center p-10 bg-[#222]/50 backdrop-blur-sm rounded-[4rem]' : ''}`}>
              <div className={`${deviceView === 'desktop' ? 'w-full transform scale-[0.85]' : 'scale-[0.9] md:scale-100'} origin-center`}>
                <div className="bg-white rounded-[4rem] shadow-[-20px_40px_100px_rgba(28,93,21,0.15)] overflow-hidden flex flex-col md:flex-row border border-white/50 w-full min-h-[550px]">
                  {/* Lado Izquierdo */}
                  <div className={`relative ${deviceView === 'mobile' ? 'h-48 w-full' : 'w-[45%]'} flex-shrink-0 group overflow-hidden`}>
                    <img src={form.image_url} className="w-full h-full object-cover" alt="Visual" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C5D15]/90 via-transparent to-transparent flex items-end p-10">
                      <div className="transform transition-transform group-hover:translate-x-2">
                        <div className="w-16 h-1 bg-[#19FF00] mb-4"></div>
                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-tight">Bionano<br />Technology</h3>
                      </div>
                    </div>
                  </div>

                  {/* Contenido (Interactuable para seleccionar) */}
                  <div className="flex-1 p-10 lg:p-14 bg-white flex flex-col justify-center relative">
                    <div className="mb-10 group/edit cursor-pointer" onClick={() => setActiveTab('sections')}>
                      <span className="inline-block px-3 py-1 bg-[#19FF00]/10 text-[#1C5D15] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                        {form.name}
                      </span>
                      <h2 className="text-3xl lg:text-4xl font-black text-[#1C5D15] mb-4 leading-tight tracking-tighter">
                        {activeLanguage === 'es' ? form.title_es : form.title_en}
                      </h2>
                      <p className="text-[#629960] font-medium text-sm lg:text-base opacity-70">
                        {activeLanguage === 'es' ? form.subtitle_es : form.subtitle_en}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      {form.fields?.map(f => (
                        <div
                          key={f.id}
                          onClick={(e) => { e.stopPropagation(); setActiveFieldId(f.id); setActiveTab('config'); }}
                          className={`space-y-2 cursor-pointer transition-all hover:scale-105 ${f.type === 'textarea' ? 'md:col-span-2' : ''} ${activeFieldId === f.id ? 'ring-2 ring-[#19FF00] ring-offset-4 rounded-2xl' : ''}`}
                        >
                          <label className="text-[10px] font-black text-[#1C5D15]/30 uppercase tracking-[0.2em] ml-1">
                            {activeLanguage === 'es' ? f.label_es : f.label_en || f.name} {f.required && '*'}
                          </label>
                          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[13px] text-gray-300 font-medium min-h-[50px] flex items-center shadow-sm">
                            {(activeLanguage === 'es' ? f.placeholder_es : f.placeholder_en) || `Introduce ${activeLanguage === 'es' ? f.label_es : f.label_en}...`}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12">
                      <button className="px-10 py-5 bg-[#1C5D15] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#1C5D15]/20 flex items-center gap-3">
                        {activeLanguage === 'es' ? 'Enviar Solicitud' : 'Send Request'} <ChevronRight size={18} className="text-[#19FF00]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {deviceView === 'mobile' && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#111] rounded-full z-[100]" />
            )}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar-sidebar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-sidebar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb { background: rgba(28,93,21,0.05); border-radius: 10px; }
        .custom-scrollbar-preview::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
