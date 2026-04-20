import React, { useState } from 'react';
import { Section, Form } from '../../../data/supabase';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { ImageUpload } from '../../ImageUpload';
import { Trash2, Plus, X, Globe, CheckCircle2, AlertCircle, Zap, Database, Copy, Save, Layout, Type, Newspaper, Search } from 'lucide-react';
import { supabaseAPI } from '../../../data/supabase';
import { toast } from 'sonner';
import { RichTextEditor } from '../RichTextEditor';

const CTA_ICON_OPTIONS = [
  'FlaskConical', 'Globe', 'Microscope', 'Factory', 'TrendingUp',
  'AlertTriangle', 'CheckCircle', 'Sprout', 'Building2', 'Fish',
  'Apple', 'HeartPulse', 'Shirt', 'Warehouse', 'Shield'
];

interface VisualEditorSidebarProps {
  sectionES: Section;
  sectionEN: Section;
  onUpdateSection: (sectionId: string, content: any, lang: 'es' | 'en' | 'both') => void;
  availableProducts?: any[];
  availableEcosystemMembers?: any[];
  availableForms?: Form[];
  availableCategories?: any[];
  availableBlogPosts?: any[];
  pageSlug?: string;
  entityType?: 'page' | 'blog' | 'legal' | 'footer' | 'product';
}

export function VisualEditorSidebar({ 
  sectionES, 
  sectionEN, 
  onUpdateSection, 
  availableProducts = [], 
  availableEcosystemMembers = [],
  availableForms = [],
  availableCategories = [],
  availableBlogPosts = [],
  pageSlug = '',
  entityType = 'page'
}: VisualEditorSidebarProps) {
  const [fieldLangs, setFieldLangs] = useState<Record<string, 'es' | 'en'>>({});
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});
  
  // ✅ ESTADO LOCAL INMEDIATO - SOLUCION DEFINITIVA PARA REACT
  const [ctaType, setCtaType] = useState<string | null>(null);
  const [ctaType2, setCtaType2] = useState<string | null>(null);
  
  // ✅ Controlar si las listas estan abiertas o cerradas
  const [isListOpen, setIsListOpen] = useState<Record<string, boolean>>({});

  // ✅ CARGA PEREZOSA (LAZY LOADING) DE CATÁLOGOS
  const [lazyProducts, setLazyProducts] = useState<any[]>(availableProducts);
  const [lazyMembers, setLazyMembers] = useState<any[]>(availableEcosystemMembers);
  const [lazyCategories, setLazyCategories] = useState<any[]>([]);
  const [lazyForms, setLazyForms] = useState<Form[]>(availableForms);

  React.useEffect(() => {
    // Si no tenemos productos y la pestaña es de 'config', cargar bajo demanda si aplicable
    if (lazyProducts.length === 0 && (['products', 'featured', 'problems'].includes(sectionES.type))) {
      console.log("🚚 [Sidebar] Lazy loading products...");
      supabaseAPI.getProducts().then(prods => {
         supabaseAPI.getAllProductTranslations('es').then(trans => {
            const transMap = (trans || []).reduce((acc: any, t: any) => { acc[t.product_id] = t; return acc; }, {});
            setLazyProducts((prods || []).map((p: any) => ({ ...p, translation: transMap[p.id] || null })));
         });
      });
    }

    if (lazyMembers.length === 0 && sectionES.type === 'trust') {
      console.log("🚚 [Sidebar] Lazy loading ecosystem members...");
      supabaseAPI.getEcosystemMembers().then(members => {
         supabaseAPI.getAllEcosystemMemberTranslations('es').then(trans => {
            const transMap = (trans || []).reduce((acc: any, t: any) => { acc[t.member_id] = t; return acc; }, {});
            setLazyMembers((members || []).map((m: any) => ({ ...m, translation: transMap[m.id] || null })));
         });
      });
    }

    if (lazyForms.length === 0) {
      supabaseAPI.getForms().then(setLazyForms);
    }
  }, [sectionES.type]);

  // ✅ SINCRONIZAR VALOR REAL CUANDO LLEGA DEL PADRE
  React.useEffect(() => {
    setCtaType(sectionES.content.ctaActionType ?? null);
    setCtaType2(sectionES.content.secondaryCtaActionType ?? null);
  }, [sectionES.content.ctaActionType, sectionES.content.secondaryCtaActionType]);

  // Lista completa de rutas y popups disponibles
  console.log("🔍 [Sidebar] availableForms Prop:", availableForms);
  const AVAILABLE_ROUTES = [
    { value: '/', label: '🏠 Página Principal (Home)' },
    { value: '/store', label: '🛒 Tienda / Productos' },
    { value: '/blog', label: '📰 Blog / Noticias' },
    { value: '/technology', label: '🔬 Tecnología' },
    { value: '/ecosystem', label: '🤝 Ecosistema' },
    { value: '/about-us', label: '📖 Sobre Nosotros' },
    { value: '/contact', label: '📞 Contacto' },
  ];

  const AVAILABLE_POPUPS = [
    { value: 'exit-intent', label: '📩 Popup predeterminado (Exit Intent)' },
    ...lazyForms.map(form => ({
      value: form.id,
      label: `📋 Formulario: ${form.name}`
    }))
  ];

  const handleContentMultipleChanges = (changes: Record<string, any>, targetLang: 'es' | 'en' | 'both' = 'both') => {
    const nextES = { ...sectionES, content: { ...sectionES.content } };
    const nextEN = { ...sectionEN, content: { ...sectionEN.content } };
    
    for (const [field, val] of Object.entries(changes)) {
      if (targetLang === 'es' || targetLang === 'both') nextES.content[field] = val;
      if (targetLang === 'en' || targetLang === 'both') nextEN.content[field] = val;
    }
    
    if (targetLang === 'es' || targetLang === 'both') {
      onUpdateSection(sectionES.id, nextES.content, 'es');
    }
    if (targetLang === 'en' || targetLang === 'both') {
      onUpdateSection(sectionEN.id, nextEN.content, 'en');
    }
  };

  /**
   * COMPONENTE AUXILIAR INTERNO: Selector de Acción Universal
   */
  const ActionSelector = ({ 
    label, 
    value, 
    actionType, 
    fieldPrefix = 'cta',
    onChange: customOnChange
  }: { 
    label: string; 
    value: string; 
    actionType: string | undefined; 
    fieldPrefix?: 'cta' | 'secondaryCta' | string;
    onChange?: (type: string, val: string) => void;
  }) => {
    const isPopup = actionType === 'popup';
    const isRoute = actionType === 'route';

    return (
      <div className="space-y-2 p-3 bg-[#1C5D15]/5 rounded-xl border border-[#1C5D15]/10 mb-2">
        <Label className="text-[#1C5D15] font-black text-[10px] uppercase mb-1 block tracking-wider">
          {label}
        </Label>
        
        <div className="space-y-2">
          <div>
            <Label className="text-[9px] text-gray-400 uppercase font-bold mb-1 block">Tipo de Acción</Label>
            <select
              className="w-full text-[10px] h-8 border rounded-md bg-white px-2 focus:ring-2 focus:ring-[#19FF00] outline-none"
              value={actionType || 'url'}
              onChange={(e) => {
                const newType = e.target.value;
                let defaultVal = '';
                if (newType === 'popup') defaultVal = 'exit-intent';
                else if (newType === 'route') defaultVal = '/';
                else if (newType === 'chat') defaultVal = 'chat';
                
                if (customOnChange) {
                  customOnChange(newType, defaultVal);
                } else {
                  handleContentMultipleChanges({
                    [`${fieldPrefix}ActionType`]: newType,
                    [`${fieldPrefix}Link`]: defaultVal
                  }, 'both');
                }
              }}
            >
              <option value="url">🌐 URL Externa (Nueva Pestaña)</option>
              <option value="route">📍 Página / Ruta (Interna)</option>
              <option value="popup">📩 Abrir Popup / Formulario</option>
              <option value="chat">💬 Abrir Burbuja de Chat</option>
            </select>
          </div>

            {actionType !== 'chat' && (
            <div>
              <Label className="text-[9px] text-gray-400 uppercase font-bold mb-1 block">
                {isPopup ? 'Seleccionar Popup' : 'Destino / Enlace'}
              </Label>
              
              {isPopup ? (
                <select
                  className="w-full text-[10px] h-8 border rounded-md bg-white px-2 focus:ring-2 focus:ring-[#19FF00] outline-none"
                  value={value}
                  onChange={(e) => {
                    if (customOnChange) customOnChange(actionType || 'popup', e.target.value);
                    else handleContentChange(`${fieldPrefix}Link`, e.target.value, 'both');
                  }}
                >
                  {AVAILABLE_POPUPS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              ) : isRoute ? (
                <select
                  className="w-full text-[10px] h-8 border rounded-md bg-white px-2 focus:ring-2 focus:ring-[#19FF00] outline-none"
                  value={value}
                  onChange={(e) => {
                    if (customOnChange) customOnChange(actionType || 'route', e.target.value);
                    else handleContentChange(`${fieldPrefix}Link`, e.target.value, 'both');
                  }}
                >
                  {AVAILABLE_ROUTES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              ) : (
                <Input
                  className="text-[10px] h-8 focus:ring-1 focus:ring-[#19FF00]"
                  placeholder="https://..."
                  value={value}
                  onChange={(e) => {
                    if (customOnChange) customOnChange(actionType || 'url', e.target.value);
                    else handleContentChange(`${fieldPrefix}Link`, e.target.value, 'both');
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!sectionES || !sectionEN) {
    return null;
  }

  const handleSaveToLibrary = async () => {
    try {
      const name = prompt('Nombre para esta sección en la biblioteca:', `${sectionES.type.toUpperCase()} - ${new Date().toLocaleDateString()}`);
      if (!name) return;

      const toastId = toast.loading('Guardando en biblioteca...');
      
      // Guardamos la versión ES como base (o podríamos guardar ambas, pero la tabla reusable_sections
      // según mi implementación actual guarda un 'content' JSON).
      // Para hacerlo pro, podríamos guardar un objeto que contenga ambos idiomas si quisiéramos,
      // pero por ahora guardaremos el contenido actual seleccionado o ambos en un wrapper.
      const payload = {
        name,
        type: sectionES.type,
        content: {
          es: sectionES.content,
          en: sectionEN.content
        }
      };

      await supabaseAPI.saveReusableSection(payload);
      toast.dismiss(toastId);
      toast.success('Sección guardada en la biblioteca con éxito');
    } catch (error) {
      console.error('Error saving to library:', error);
      toast.error('Error al guardar en la biblioteca');
    }
  };

  const handleContentChange = (field: string, value: any, lang: 'es' | 'en' | 'both') => {
    console.log(`🔵 [DEBUG VISUAL EDITOR] handleContentChange:`, {
      field,
      value,
      lang,
      previousValue_es: sectionES.content[field],
      previousValue_en: sectionEN.content[field]
    });
    
    if (lang === 'both') {
      console.log(`   ↳ Guardando en AMBOS idiomas ES + EN`);
      onUpdateSection(sectionES.id, { ...sectionES.content, [field]: value }, 'es');
      onUpdateSection(sectionEN.id, { ...sectionEN.content, [field]: value }, 'en');
    } else {
      const target = lang === 'es' ? sectionES : sectionEN;
      console.log(`   ↳ Guardando solo en idioma: ${lang.toUpperCase()}`);
      onUpdateSection(target.id, { ...target.content, [field]: value }, lang);
    }
  };

  const getFieldLang = (fieldKey: string) => fieldLangs[fieldKey] || 'es';

  const setFieldLang = (fieldKey: string, lang: 'es' | 'en') => {
    setFieldLangs(prev => ({ ...prev, [fieldKey]: lang }));
  };

  const LanguageToggle = ({ fieldKey, label }: { fieldKey: string, label: string }) => {
    const current = getFieldLang(fieldKey);
    return (
      <div className="flex items-center justify-between mb-1.5">
        <Label className="text-[#1C5D15] font-bold text-xs uppercase tracking-tight">{label}</Label>
        <div className="flex items-center bg-gray-100 rounded-md p-0.5 border border-gray-200 shadow-sm">
          <button
            onClick={() => setFieldLang(fieldKey, 'es')}
            className={`px-2 py-0.5 text-[9px] font-black rounded-sm transition-all ${current === 'es' ? 'bg-[#1C5D15] text-white shadow-sm scale-110' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            ES
          </button>
          <button
            onClick={() => setFieldLang(fieldKey, 'en')}
            className={`px-2 py-0.5 text-[9px] font-black rounded-sm transition-all ${current === 'en' ? 'bg-[#1C5D15] text-white shadow-sm scale-110' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            EN
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {entityType !== 'footer' && (
        <div className="bg-[#1C5D15]/5 rounded-xl p-4 border border-[#1C5D15]/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-black text-[#1C5D15] uppercase tracking-widest text-[11px] flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#19FF00]" />
                Sección: {sectionES.type}
              </h3>
              <p className="text-[10px] text-[#629960] font-bold uppercase tracking-tighter opacity-70">ID: {sectionES.id.split('-')[0]}...</p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSaveToLibrary}
              className="h-8 text-[10px] font-black uppercase tracking-tighter border-[#1C5D15]/30 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white transition-all gap-1.5 shadow-sm rounded-lg"
            >
              <Database className="w-3.5 h-3.5" />
              Guardar en Biblioteca
            </Button>
          </div>
          <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-lg border border-[#1C5D15]/5">
             <Zap className="w-3 h-3 text-[#19FF00] fill-[#19FF00]" />
             <p className="text-[9px] text-[#1C5D15] font-bold uppercase tracking-tight">Editor Pro: Multi-idioma Sincronizado</p>
          </div>
        </div>
      )}

      {entityType === 'footer' && (
        <div className="bg-gradient-to-r from-[#1C5D15] to-[#629960] rounded-2xl p-6 text-white shadow-lg space-y-2 mb-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <Layout className="w-8 h-8 text-[#19FF00] mb-2" />
          <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Editor de Footer</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Configuración Global del Sitio</p>
        </div>
      )}

      {entityType === 'legal' && (
        <div className="bg-gradient-to-r from-[#1C5D15] to-[#629960] rounded-2xl p-6 text-white shadow-lg space-y-2 mb-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <Database className="w-8 h-8 text-[#19FF00] mb-2" />
          <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Página Legal</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Contenido de Términos o Privacidad</p>
        </div>
      )}

      {entityType === 'blog' && (
        <div className="bg-gradient-to-r from-[#1C5D15] to-[#629960] rounded-2xl p-6 text-white shadow-lg space-y-2 mb-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <Newspaper className="w-8 h-8 text-[#19FF00] mb-2" />
          <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Editor de Blog</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Redacción de Noticia / Artículo</p>
        </div>
      )}

      {/* SECCIÓN ESPECIAL: METADATOS DE PÁGINA (CABECERA) */}
      {sectionES.id === 'page-header' && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-5 animate-in fade-in slide-in-from-right-4">
             <h4 className="text-[11px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-2 border-b pb-3">
               <Layout className="w-4 h-4 text-[#19FF00]" />
               Metadatos de la {entityType === 'blog' ? 'Noticia' : 'Página'}
             </h4>

             {/* TÍTULO */}
             <div className="space-y-2">
                 <LanguageToggle fieldKey="meta-title" label="Título Principal" />
                 <Input 
                   value={(getFieldLang('meta-title') === 'es' ? sectionES.content.title_es : sectionEN.content.title_en) || ''}
                   onChange={(e) => {
                      const lang = getFieldLang('meta-title');
                      handleContentChange(lang === 'es' ? 'title_es' : 'title_en', e.target.value, 'both');
                   }}
                   placeholder="Título impactante del artículo..."
                   className="font-bold border-[#1C5D15]/20 focus:ring-[#19FF00]"
                 />
             </div>

             {/* EXTRACTO / SUBTÍTULO */}
             {entityType !== 'legal' && (
               <div className="space-y-2">
                  <LanguageToggle fieldKey="meta-excerpt" label="Extracto / Resumen" />
                  <RichTextEditor 
                    value={(getFieldLang('meta-excerpt') === 'es' ? sectionES.content.excerpt_es : sectionEN.content.excerpt_en) || ''}
                    onChange={(val) => {
                       const lang = getFieldLang('meta-excerpt');
                       handleContentChange(lang === 'es' ? 'excerpt_es' : 'excerpt_en', val, 'both');
                    }}
                    minHeight="100px"
                  />
               </div>
             )}

             {/* IMAGEN DE PORTADA */}
             {entityType !== 'legal' && (
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Imagen de Portada</Label>
                  <ImageUpload 
                    currentImage={sectionES.content.cover_image}
                    onImageUpload={(url) => handleContentChange('cover_image', url, 'both')}
                    type="banner"
                  />
               </div>
             )}

             {/* CATEGORÍA Y AUTOR (SOLO BLOG) */}
             {entityType === 'blog' && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                   <div className="space-y-1.5">
                      <Label className="text-[9px] font-black text-[#1C5D15] uppercase opacity-60">Categoría</Label>
                      <Input 
                        value={sectionES.content.category_name || ''}
                        onChange={(e) => handleContentChange('category_name', e.target.value, 'both')}
                        className="h-8 text-[10px]"
                        placeholder="Ej: Biotecnología"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-[9px] font-black text-[#1C5D15] uppercase opacity-60">Tipo</Label>
                      <select 
                        value={sectionES.content.type || 'article'}
                        onChange={(e) => handleContentChange('type', e.target.value, 'both')}
                        className="w-full h-8 text-[10px] border rounded-md bg-white px-2 focus:ring-2 focus:ring-[#19FF00] outline-none"
                      >
                         <option value="article">📰 Artículo</option>
                         <option value="news">🚩 Noticia</option>
                      </select>
                   </div>
                </div>
             )}

             {entityType === 'blog' && (
                <div className="space-y-1.5">
                   <Label className="text-[9px] font-black text-[#1C5D15] uppercase opacity-60">Autor / Firma</Label>
                   <Input 
                     value={sectionES.content.author || ''}
                     onChange={(e) => handleContentChange('author', e.target.value, 'both')}
                     className="h-8 text-[10px]"
                     placeholder="Nombre del redactor..."
                   />
                </div>
             )}
             
             {entityType === 'blog' && (
                <div className="space-y-4 pt-4 border-t border-[#1C5D15]/10">
                   <h5 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                     <Search className="w-3 h-3 text-[#19FF00]" />
                     Optimización SEO
                   </h5>
                   
                   <div className="space-y-2">
                      <LanguageToggle fieldKey="meta-seo-title" label="Meta Título" />
                      <Input 
                        value={(getFieldLang('meta-seo-title') === 'es' ? sectionES.content.meta_title : sectionEN.content.meta_title) || ''}
                        onChange={(e) => {
                           const lang = getFieldLang('meta-seo-title');
                           handleContentChange('meta_title', e.target.value, lang);
                        }}
                        placeholder="Título para buscadores (Google)..."
                        className="text-[10px]"
                      />
                   </div>

                   <div className="space-y-2">
                      <LanguageToggle fieldKey="meta-seo-desc" label="Meta Descripción" />
                      <Input 
                        value={(getFieldLang('meta-seo-desc') === 'es' ? sectionES.content.meta_description : sectionEN.content.meta_description) || ''}
                        onChange={(e) => {
                           const lang = getFieldLang('meta-seo-desc');
                           handleContentChange('meta_description', e.target.value, lang);
                        }}
                        placeholder="Descripción breve para resultados de búsqueda..."
                        className="text-[10px]"
                      />
                   </div>

                   <div className="space-y-2">
                      <LanguageToggle fieldKey="meta-seo-keys" label="Palabras Clave" />
                      <Input 
                        value={(getFieldLang('meta-seo-keys') === 'es' ? sectionES.content.meta_keywords : sectionEN.content.meta_keywords) || ''}
                        onChange={(e) => {
                           const lang = getFieldLang('meta-seo-keys');
                           handleContentChange('meta_keywords', e.target.value, lang);
                        }}
                        placeholder="Ej: biotecnología, manzanas, pesticidas..."
                        className="text-[10px]"
                      />
                   </div>
                </div>
             )}
          </div>
          
             {/* CONFIGURACIÓN ESPECÍFICA DE PRODUCTO */}
             {entityType === 'product' && (
               <div className="space-y-6 pt-4 border-t border-[#1C5D15]/10 animate-in fade-in zoom-in-95">
                  <h5 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#19FF00]" />
                    Configuración de Producto
                  </h5>

                  {/* NOMBRE COMERCIAL */}
                  <div className="space-y-2">
                      <LanguageToggle fieldKey="prod-name" label="Nombre Comercial" />
                      <Input 
                        value={(getFieldLang('prod-name') === 'es' ? sectionES.content.name : sectionEN.content.name) || ''}
                        onChange={(e) => {
                           const lang = getFieldLang('prod-name');
                           handleContentChange('name', e.target.value, lang);
                        }}
                        placeholder="Nombre del producto..."
                        className="text-[11px] font-bold"
                      />
                  </div>

                  {/* DESCRIPCIÓN CORTA (RESUMEN) */}
                  <div className="space-y-2">
                      <LanguageToggle fieldKey="prod-short" label="Descripción Corta (Hero)" />
                      <textarea 
                        value={(getFieldLang('prod-short') === 'es' ? sectionES.content.short_description : sectionEN.content.short_description) || ''}
                        onChange={(e) => {
                           const lang = getFieldLang('prod-short');
                           handleContentChange('short_description', e.target.value, lang);
                        }}
                        className="w-full text-[10px] p-2 border rounded-md focus:ring-1 focus:ring-[#19FF00] outline-none min-h-[60px]"
                        placeholder="Resumen del producto para el encabezado..."
                      />
                  </div>

                  {/* ESTADO Y CATEGORÍA */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <Label className="text-[9px] font-black text-[#1C5D15] uppercase opacity-60">Categoría Técnica</Label>
                        <select 
                          value={sectionES.content.category || ''}
                          onChange={(e) => handleContentChange('category', e.target.value, 'both')}
                          className="w-full h-8 text-[10px] border rounded-md bg-white px-2 focus:ring-2 focus:ring-[#19FF00] outline-none"
                        >
                           <option value="">Seleccionar...</option>
                           {availableCategories.map((cat: any) => (
                             <option key={cat.id} value={cat.id}>{cat.name}</option>
                           ))}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <Label className="text-[9px] font-black text-[#1C5D15] uppercase opacity-60">Estado</Label>
                        <select 
                          value={sectionES.content.status || 'draft'}
                          onChange={(e) => handleContentChange('status', e.target.value, 'both')}
                          className="w-full h-8 text-[10px] border rounded-md bg-white px-2 focus:ring-2 focus:ring-[#19FF00] outline-none"
                        >
                           <option value="active">🟢 Activo</option>
                           <option value="inactive">🔴 Inactivo</option>
                           <option value="draft">🟡 Borrador</option>
                        </select>
                     </div>
                  </div>

                  {/* GALERÍA DE IMÁGENES */}
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Galería del Producto</Label>
                     <ImageUpload 
                       currentImages={sectionES.content.images || []}
                       onImageUpload={(urls) => handleContentChange('images', urls, 'both')}
                       type="product"
                     />
                  </div>

                  {/* DESCRIPCIÓN COMPLETA (CUERPO) */}
                  <div className="space-y-2">
                      <LanguageToggle fieldKey="prod-desc" label="Descripción Detallada (Caja 1)" />
                      <textarea 
                        value={(getFieldLang('prod-desc') === 'es' ? sectionES.content.description : sectionEN.content.description) || ''}
                        onChange={(e) => {
                           const lang = getFieldLang('prod-desc');
                           handleContentChange('description', e.target.value, lang);
                        }}
                        className="w-full text-[10px] p-2 border rounded-md focus:ring-1 focus:ring-[#19FF00] outline-none min-h-[100px]"
                        placeholder="Historia y detalles profundos del producto..."
                      />
                  </div>

                  {/* CARACTERÍSTICAS (LISTA) */}
                  <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <LanguageToggle fieldKey="prod-features" label="Características (Caja 2)" />
                         <Button size="sm" variant="ghost" className="h-5 text-[8px] font-bold" 
                           onClick={() => {
                              const lang = getFieldLang('prod-features');
                              const current = [...((lang === 'es' ? sectionES.content.features : sectionEN.content.features) || [])];
                              current.push("");
                              handleContentChange('features', current, lang);
                           }}
                         >
                           <Plus className="w-2.5 h-2.5 mr-1" /> Añadir
                         </Button>
                      </div>
                      <div className="space-y-1.5">
                         {((getFieldLang('prod-features') === 'es' ? sectionES.content.features : sectionEN.content.features) || []).map((feat: string, idx: number) => (
                           <div key={idx} className="flex gap-1">
                              <Input 
                                value={feat}
                                onChange={(e) => {
                                   const lang = getFieldLang('prod-features');
                                   const next = [...((lang === 'es' ? sectionES.content.features : sectionEN.content.features) || [])];
                                   next[idx] = e.target.value;
                                   handleContentChange('features', next, lang);
                                }}
                                className="h-7 text-[10px]"
                                placeholder="Escribe una característica..."
                              />
                           </div>
                         ))}
                      </div>
                  </div>

                  {/* BENEFICIOS (LISTA) */}
                  <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <LanguageToggle fieldKey="prod-benefits" label="Beneficios (Caja 3)" />
                         <Button size="sm" variant="ghost" className="h-5 text-[8px] font-bold" 
                           onClick={() => {
                              const lang = getFieldLang('prod-benefits');
                              const current = [...((lang === 'es' ? sectionES.content.benefits : sectionEN.content.benefits) || [])];
                              current.push("");
                              handleContentChange('benefits', current, lang);
                           }}
                         >
                           <Plus className="w-2.5 h-2.5 mr-1" /> Añadir
                         </Button>
                      </div>
                      <div className="space-y-1.5">
                         {((getFieldLang('prod-benefits') === 'es' ? sectionES.content.benefits : sectionEN.content.benefits) || []).map((ben: string, idx: number) => (
                           <div key={idx} className="flex gap-1">
                              <Input 
                                value={ben}
                                onChange={(e) => {
                                   const lang = getFieldLang('prod-benefits');
                                   const next = [...((lang === 'es' ? sectionES.content.benefits : sectionEN.content.benefits) || [])];
                                   next[idx] = e.target.value;
                                   handleContentChange('benefits', next, lang);
                                }}
                                className="h-7 text-[10px]"
                                placeholder="Escribe un beneficio..."
                              />
                           </div>
                         ))}
                      </div>
                  </div>

                  {/* ESPECIFICACIONES TÉCNICAS (JSON) */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Especificaciones</Label>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-5 text-[8px] font-black text-[#1C5D15]"
                          onClick={() => {
                            const current = { ...sectionES.content.technical_specs };
                            current[`Nueva Spec ${Object.keys(current).length + 1}`] = '';
                            handleContentChange('technical_specs', current, 'both');
                          }}
                        >
                          <Plus className="w-2.5 h-2.5 mr-1" /> Añadir
                        </Button>
                     </div>
                     <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(sectionES.content.technical_specs || {}).map(([key, val], idx) => (
                           <div key={idx} className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg relative group">
                              <div className="flex-1 space-y-1">
                                 <Input 
                                   value={key}
                                   onChange={(e) => {
                                      const next = { ...sectionES.content.technical_specs };
                                      delete next[key];
                                      next[e.target.value] = val;
                                      handleContentChange('technical_specs', next, 'both');
                                   }}
                                   className="h-6 text-[9px] font-bold border-none bg-transparent p-0"
                                   placeholder="Nombre"
                                 />
                                 <Input 
                                   value={val as string}
                                   onChange={(e) => {
                                      const next = { ...sectionES.content.technical_specs };
                                      next[key] = e.target.value;
                                      handleContentChange('technical_specs', next, 'both');
                                   }}
                                   className="h-6 text-[9px] text-[#629960] border-none bg-transparent p-0"
                                   placeholder="Valor (Ej: 99.9%)"
                                 />
                              </div>
                              <button 
                                onClick={() => {
                                   const next = { ...sectionES.content.technical_specs };
                                   delete next[key];
                                   handleContentChange('technical_specs', next, 'both');
                                }}
                                className="text-red-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* FEATURES & BENEFITS (LISTS) */}
                  <div className="space-y-3">
                      <LanguageToggle fieldKey="prod-features" label="Características Destacadas" />
                      <div className="space-y-2">
                         {((getFieldLang('prod-features') === 'es' ? sectionES.content.features : sectionEN.content.features) || []).map((f: string, i: number) => (
                            <div key={i} className="flex gap-2">
                               <Input 
                                 value={f}
                                 onChange={(e) => {
                                    const lang = getFieldLang('prod-features');
                                    const next = [...(lang === 'es' ? sectionES.content.features : sectionEN.content.features)];
                                    next[i] = e.target.value;
                                    handleContentChange('features', next, lang);
                                 }}
                                 className="h-7 text-[10px]"
                               />
                               <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => {
                                  const lang = getFieldLang('prod-features');
                                  const next = (lang === 'es' ? sectionES.content.features : sectionEN.content.features).filter((_: any, idx: number) => idx !== i);
                                  handleContentChange('features', next, lang);
                               }}>
                                 <X className="w-3 h-3" />
                               </Button>
                            </div>
                         ))}
                         <Button variant="outline" size="sm" className="w-full h-7 text-[9px] font-black uppercase" onClick={() => {
                            const lang = getFieldLang('prod-features');
                            const next = [...(lang === 'es' ? sectionES.content.features : sectionEN.content.features), 'Nueva característica'];
                            handleContentChange('features', next, lang);
                         }}>
                            <Plus className="w-3 h-3 mr-1" /> Añadir Característica
                         </Button>
                      </div>
                  </div>

                  {/* SEO DE PRODUCTO */}
                  <div className="space-y-4 pt-4 border-t border-[#1C5D15]/10">
                     <h5 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                       <Search className="w-3 h-3 text-[#19FF00]" />
                       SEO de Producto
                     </h5>
                     <div className="space-y-2">
                        <LanguageToggle fieldKey="prod-seo-title" label="Meta Título" />
                        <Input 
                          value={(getFieldLang('prod-seo-title') === 'es' ? sectionES.content.meta_title : sectionEN.content.meta_title) || ''}
                          onChange={(e) => handleContentChange('meta_title', e.target.value, getFieldLang('prod-seo-title'))}
                          placeholder="Título para buscadores..."
                          className="text-[10px]"
                        />
                     </div>
                     <div className="space-y-2">
                        <LanguageToggle fieldKey="prod-seo-desc" label="Meta Descripción" />
                        <Input 
                          value={(getFieldLang('prod-seo-desc') === 'es' ? sectionES.content.meta_description : sectionEN.content.meta_description) || ''}
                          onChange={(e) => handleContentChange('meta_description', e.target.value, getFieldLang('prod-seo-desc'))}
                          placeholder="Descripción breve..."
                          className="text-[10px]"
                        />
                     </div>
                  </div>
               </div>
             )}
          
          <div className="p-4 bg-[#19FF00]/5 border border-dashed border-[#19FF00]/30 rounded-xl">
             <p className="text-[9px] text-[#1C5D15] font-bold uppercase text-center italic">
               💡 Los cambios en esta cabecera se verán reflejados al guardar.
             </p>
          </div>
        </div>
      )}
      
      {/* SECCIÓN ESPECIAL: FOOTER SETTINGS */}
      {sectionES.type === 'footer-settings' && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#19FF00]" />
              Configuración de Copyright
            </h4>
            <div>
              <LanguageToggle fieldKey="footer-copyright" label="Texto Copyright" />
              <Input
                value={(getFieldLang('footer-copyright') === 'es' ? sectionES.content.copyright_text_es : sectionEN.content.copyright_text_en) || ''}
                onChange={(e) => {
                  const lang = getFieldLang('footer-copyright');
                  handleContentChange(lang === 'es' ? 'copyright_text_es' : 'copyright_text_en', e.target.value, 'both');
                }}
                placeholder="© {{year}} BionanoAyT..."
              />
            </div>
          </div>

          <div className="p-4 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#19FF00]" />
              Redes Sociales
            </h4>
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
              <div key={social}>
                <Label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">{social}</Label>
                <Input
                  value={sectionES.content.social_media?.[social] || ''}
                  onChange={(e) => {
                    const newSocial = { ...sectionES.content.social_media, [social]: e.target.value };
                    handleContentChange('social_media', newSocial, 'both');
                  }}
                  placeholder="https://..."
                  className="h-8 text-[10px]"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Columnas del Footer</h4>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[9px] font-black uppercase"
                onClick={() => {
                   const newId = `col-${Date.now()}`;
                   const newCol = { id: newId, title_es: 'Nueva Columna', title_en: 'New Column', links: [] };
                   const newCols = [...(sectionES.content.columns || []), newCol];
                   handleContentChange('columns', newCols, 'both');
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Añadir
              </Button>
            </div>

            {(sectionES.content.columns || []).map((column: any, colIdx: number) => (
              <div key={column.id} className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-3 relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-red-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const newCols = sectionES.content.columns.filter((_: any, i: number) => i !== colIdx);
                    handleContentChange('columns', newCols, 'both');
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>

                <div>
                  <LanguageToggle fieldKey={`footer-col-title-${colIdx}`} label={`Columna #${colIdx + 1}`} />
                  <Input
                    value={(getFieldLang(`footer-col-title-${colIdx}`) === 'es' ? column.title_es : column.title_en) || ''}
                    onChange={(e) => {
                       const lang = getFieldLang(`footer-col-title-${colIdx}`);
                       const newCols = [...sectionES.content.columns];
                       newCols[colIdx] = { ...newCols[colIdx], [lang === 'es' ? 'title_es' : 'title_en']: e.target.value };
                       handleContentChange('columns', newCols, 'both');
                    }}
                    className="h-8 text-[11px]"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <Label className="text-[9px] font-bold text-gray-400 uppercase">Enlaces</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 text-[8px] font-black uppercase text-[#1C5D15]"
                      onClick={() => {
                        const newCols = [...sectionES.content.columns];
                        const newLink = { id: `link-${Date.now()}`, label_es: 'Enlace', label_en: 'Link', url: '/', type: 'link' };
                        newCols[colIdx].links = [...(newCols[colIdx].links || []), newLink];
                        handleContentChange('columns', newCols, 'both');
                      }}
                    >
                      <Plus className="w-2.5 h-2.5 mr-1" /> Link
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(column.links || []).map((link: any, linkIdx: number) => (
                      <div key={link.id} className="p-2 bg-gray-50 rounded-lg space-y-2 relative group/link">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 p-0 text-red-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100"
                          onClick={() => {
                            const newCols = [...sectionES.content.columns];
                            newCols[colIdx].links = newCols[colIdx].links.filter((_: any, i: number) => i !== linkIdx);
                            handleContentChange('columns', newCols, 'both');
                          }}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </Button>

                        <div>
                          <LanguageToggle fieldKey={`footer-col-${colIdx}-link-${linkIdx}`} label="Etiqueta" />
                          <Input
                            value={(getFieldLang(`footer-col-${colIdx}-link-${linkIdx}`) === 'es' ? link.label_es : link.label_en) || ''}
                            onChange={(e) => {
                               const lang = getFieldLang(`footer-col-${colIdx}-link-${linkIdx}`);
                               const newCols = [...sectionES.content.columns];
                               newCols[colIdx].links[linkIdx] = { ...newCols[colIdx].links[linkIdx], [lang === 'es' ? 'label_es' : 'label_en']: e.target.value };
                               handleContentChange('columns', newCols, 'both');
                            }}
                            className="h-7 text-[10px]"
                          />
                        </div>
                         <ActionSelector 
                           label="Acción / Link"
                           value={link.url || ''}
                           actionType={link.actionType || 'url'}
                           onChange={(type, val) => {
                             const newCols = [...sectionES.content.columns];
                             newCols[colIdx].links[linkIdx] = { 
                               ...newCols[colIdx].links[linkIdx], 
                               url: val, 
                               actionType: type 
                             };
                             handleContentChange('columns', newCols, 'both');
                           }}
                         />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-100 rounded-xl border border-dashed border-[#1C5D15]/30">
             <p className="text-[10px] text-[#1C5D15]/50 font-bold uppercase text-center italic">
               🔒 El formulario de captación (leads) no es editable
             </p>
          </div>
        </div>
      )}

      {/* SECCIÓN ESPECIAL: RICH TEXT (PARA BLOG/LEGAL LEGACY O SIMPLE) */}
      {sectionES.type === 'rich-text' && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-[#19FF00]" />
              Contenido de Cuerpo
            </h4>
            <div>
              <LanguageToggle fieldKey="rich-text-content" label="Editor de Texto" />
              <RichTextEditor
                value={(getFieldLang('rich-text-content') === 'es' ? sectionES.content.html : sectionEN.content.html) || ''}
                onChange={(val) => handleContentChange('html', val, getFieldLang('rich-text-content'))}
                minHeight="400px"
              />
            </div>
          </div>


        </div>
      )}

      {/* Tipo HERO BLOG */}
      {sectionES.type === 'hero-blog' && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="hero-blog-badge" label="Badge / Etiqueta" />
              <Input
                value={(getFieldLang('hero-blog-badge') === 'es' ? sectionES.content.badge : sectionEN.content.badge) || ''}
                onChange={(e) => handleContentChange('badge', e.target.value, getFieldLang('hero-blog-badge'))}
                placeholder="Blog"
                className="focus:ring-[#19FF00]/30"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="hero-blog-title" label="Título Principal" />
              <Input
                value={(getFieldLang('hero-blog-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ''}
                onChange={(e) => handleContentChange('title', e.target.value, getFieldLang('hero-blog-title'))}
                placeholder="Actualidad y Ciencia"
                className="focus:ring-[#19FF00]/30"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="hero-blog-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('hero-blog-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ''}
                onChange={(val) => handleContentChange('subtitle', val, getFieldLang('hero-blog-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <Label className="text-[#1C5D15] font-bold text-xs uppercase mb-2 block">Imagen de Fondo (Global)</Label>
              <ImageUpload
                currentImage={sectionES.content.backgroundImage}
                onImageUpload={(url) => handleContentChange('backgroundImage', url, 'both')}
                type="banner"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tipo Hero */}
      {sectionES.type === 'hero' && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="hero-title" label="Título Principal" />
              <Input
                value={(getFieldLang('hero-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ''}
                onChange={(e) => handleContentChange('title', e.target.value, getFieldLang('hero-title'))}
                placeholder="Innovando en Biotecnología..."
                className="focus:ring-[#19FF00]/30"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="hero-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('hero-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ''}
                onChange={(val) => handleContentChange('subtitle', val, getFieldLang('hero-subtitle'))}
                minHeight="100px"
              />
            </div>
          </div>

          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <Label className="text-[#1C5D15] font-bold text-xs uppercase mb-2 block">Imágenes (Global)</Label>
              <ImageUpload
                currentImage={sectionES.content.backgroundImage}
                onImageUpload={(url) => handleContentChange('backgroundImage', url, 'both')}
                type="banner"
              />
            </div>
          </div>

          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4 font-sans">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest mb-1 flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#19FF00] fill-[#19FF00]" />
              Botones y Acciones
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <LanguageToggle fieldKey="hero-cta" label="Botón Primario (Texto)" />
                <Input
                  placeholder="Ej: Ver más"
                  value={(getFieldLang('hero-cta') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ''}
                  onChange={(e) => handleContentChange('ctaText', e.target.value, getFieldLang('hero-cta'))}
                />
                <ActionSelector 
                  label="Acción Primaria" 
                  value={sectionES.content.ctaLink || ''} 
                  actionType={sectionES.content.ctaActionType}
                  fieldPrefix="cta"
                />
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="space-y-2">
                <LanguageToggle fieldKey="hero-cta2" label="Botón Secundario (Texto)" />
                <Input
                  placeholder="Ej: Contacto"
                  value={(getFieldLang('hero-cta2') === 'es' ? sectionES.content.secondaryCtaText : sectionEN.content.secondaryCtaText) || ''}
                  onChange={(e) => handleContentChange('secondaryCtaText', e.target.value, getFieldLang('hero-cta2'))}
                />
                <ActionSelector 
                  label="Acción Secundaria" 
                  value={sectionES.content.secondaryCtaLink || ''} 
                  actionType={sectionES.content.secondaryCtaActionType}
                  fieldPrefix="secondaryCta"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tipo Bento / ¿Por Qué Elegirnos? */}
      {sectionES.type === "bento" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="bento-title" label="Título Principal" />
              <Input
                value={(getFieldLang('bento-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('bento-title'))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="bento-subtitle" label="Subtítulo" />
              <Input
                value={(getFieldLang('bento-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(e) => handleContentChange("subtitle", e.target.value, getFieldLang('bento-subtitle'))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">CARDS BENTO</Label>
            {(sectionES.content.items || []).map((_: any, idx: number) => {
              const fKey = `bento-${idx}`;

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = [...(sectionES.content.items || [])];
                      const newListEN = [...(sectionEN.content.items || [])];
                      newListES.splice(idx, 1);
                      newListEN.splice(idx, 1);
                      handleContentChange("items", newListES, 'es');
                      handleContentChange("items", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Card #${idx + 1}`} />

                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                        <select
                          className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                          value={sectionES.content.items[idx].icon || 'FlaskConical'}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.items || [])];
                            const newListEN = [...(sectionEN.content.items || [])];
                            newListES[idx].icon = e.target.value;
                            newListEN[idx].icon = e.target.value;
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                        >
                          <option value="FlaskConical">Frasco (Flask)</option>
                          <option value="Globe">Globo (Globe)</option>
                          <option value="Shield">Escudo (Shield)</option>
                          <option value="Leaf">Hoja (Leaf)</option>
                          <option value="Zap">Rayo (Zap)</option>
                          <option value="Microscope">Microscopio</option>
                          <option value="Atom">Átomo (Atom)</option>
                          <option value="Star">Estrella (Star)</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Tamaño</Label>
                        <select
                          className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                          value={sectionES.content.items[idx].size || 'normal'}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.items || [])];
                            const newListEN = [...(sectionEN.content.items || [])];
                            newListES[idx].size = e.target.value;
                            newListEN[idx].size = e.target.value;
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                        >
                          <option value="normal">Normal</option>
                          <option value="large">Grande (Doble)</option>
                        </select>
                      </div>
                    </div>



                    <RichTextEditor
                      placeholder="Descripción"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].description : sectionEN.content.items[idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].description = val;
                        handleContentChange("items", newList, lang);
                      }}
                      minHeight="60px"
                    />

                    {/* LISTA DE CHECKS */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <Label className="text-[#1C5D15] text-[10px] font-bold uppercase tracking-tight">Lista de características ✓</Label>
                      <div className="grid gap-2">
                        {((getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].details : sectionEN.content.items[idx].details) || []).map((detail: string, dIdx: number) => (
                          <div key={dIdx} className="flex gap-1.5 animate-in slide-in-from-left-2 transition-all">
                            <Input
                              value={detail}
                              onChange={(e) => {
                                const lang = getFieldLang(fKey);
                                const target = lang === 'es' ? sectionES : sectionEN;
                                const newList = [...target.content.items];
                                if (!newList[idx].details) newList[idx].details = [];
                                newList[idx].details[dIdx] = e.target.value;
                                handleContentChange("items", newList, lang);
                              }}
                              className="text-[10px] h-8 flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-300 hover:text-red-500 hover:bg-red-50"
                              onClick={() => {
                                const newListES = [...sectionES.content.items];
                                const newListEN = [...sectionEN.content.items];
                                newListES[idx].details = (newListES[idx].details || []).filter((_: any, i: number) => i !== dIdx);
                                newListEN[idx].details = (newListEN[idx].details || []).filter((_: any, i: number) => i !== dIdx);
                                handleContentChange("items", newListES, 'es');
                                handleContentChange("items", newListEN, 'en');
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-8 text-[10px] text-[#1C5D15]/60 hover:text-[#1C5D15] border-dashed border border-[#1C5D15]/20 bg-gray-50/50"
                          onClick={() => {
                            const newListES = [...sectionES.content.items];
                            const newListEN = [...sectionEN.content.items];
                            if (!newListES[idx].details) newListES[idx].details = [];
                            if (!newListEN[idx].details) newListEN[idx].details = [];
                            newListES[idx].details.push("");
                            newListEN[idx].details.push("");
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Nueva Característica
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.items || [];
                const currentEN = sectionEN.content.items || [];
                const newItem = { icon: "FlaskConical", size: "normal", title: "", description: "", details: [] };
                handleContentChange("items", [...currentES, { ...newItem }], 'es');
                handleContentChange("items", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Card Bento
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Quote */}
      {sectionES.type === "quote" && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="quote-text" label="Cita" />
              <RichTextEditor
                value={(getFieldLang('quote-text') === 'es' ? sectionES.content.quote : sectionEN.content.quote) || ''}
                onChange={(val) => handleContentChange('quote', val, getFieldLang('quote-text'))}
                minHeight="120px"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="quote-author" label="Autor" />
              <Input
                value={(getFieldLang('quote-author') === 'es' ? sectionES.content.author : sectionEN.content.author) || ''}
                onChange={(e) => handleContentChange('author', e.target.value, getFieldLang('quote-author'))}
                placeholder="Nombre del autor"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="quote-role" label="Cargo / Rol" />
              <Input
                value={(getFieldLang('quote-role') === 'es' ? sectionES.content.role : sectionEN.content.role) || ''}
                onChange={(e) => handleContentChange('role', e.target.value, getFieldLang('quote-role'))}
                placeholder="Puesto o división"
              />
            </div>
            <div>
              <Label className="text-[#1C5D15] font-bold text-xs uppercase mb-2 block">Imagen (Global)</Label>
              <ImageUpload
                currentImage={sectionES.content.image}
                onImageUpload={(url) => handleContentChange('image', url, 'both')}
                type="avatar"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tipo Timeline */}
      {sectionES.type === "timeline" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="timeline-title" label="Título Principal" />
              <Input
                value={(getFieldLang('timeline-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('timeline-title'))}
                placeholder="Nuestra Trayectoria"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="timeline-subtitle" label="Subtítulo / Eslogan" />
              <Input
                value={(getFieldLang('timeline-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(e) => handleContentChange("subtitle", e.target.value, getFieldLang('timeline-subtitle'))}
                placeholder="Un camino de innovación..."
              />
            </div>
            <div>
              <LanguageToggle fieldKey="timeline-desc" label="Descripción de Sección" />
              <RichTextEditor
                value={(getFieldLang('timeline-desc') === 'es' ? sectionES.content.description : sectionEN.content.description) || ""}
                onChange={(val) => handleContentChange("description", val, getFieldLang('timeline-desc'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1">HITOS (SINCRONIZADOS)</Label>
            {((sectionES.content.milestones || sectionEN.content.milestones || []) as any[]).map((ms: any, idx: number) => {
              const fKey = `milestone-${idx}`;
              const sample = sectionES.content.milestones?.[idx] || sectionEN.content.milestones?.[idx] || {};
              const isStep = sample.step !== undefined;
              const isPhase = sample.phase !== undefined;
              const isYear = !isStep && !isPhase;

              const getValue = (field: string) => {
                if (getFieldLang(fKey) === 'es') {
                  return sectionES.content.milestones?.[idx]?.[field] ?? '';
                }
                return sectionEN.content.milestones?.[idx]?.[field] ?? '';
              };

              const updateField = (field: string, value: any) => {
                const lang = getFieldLang(fKey);
                const target = lang === 'es' ? sectionES : sectionEN;
                const newList = [...(target.content.milestones || [])];
                newList[idx] = { ...newList[idx], [field]: value };
                handleContentChange("milestones", newList, lang);
              };

              return (
                <div key={idx} className="p-3 border rounded-xl bg-gray-50/50 relative group space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => {
                      const newES = sectionES.content.milestones.filter((_: any, i: number) => i !== idx);
                      const newEN = sectionEN.content.milestones.filter((_: any, i: number) => i !== idx);
                      handleContentChange("milestones", newES, 'es');
                      handleContentChange("milestones", newEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Hito #${idx + 1}`} />

                  {isStep && (
                    <>
                      <Input
                        placeholder="Paso"
                        value={getValue('step') || ''}
                        onChange={(e) => updateField('step', e.target.value)}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Título"
                        value={getValue('title') || ''}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="text-xs h-8"
                      />
                      <RichTextEditor
                        placeholder="Descripción"
                        value={getValue('desc') || ''}
                        onChange={(val) => updateField('desc', val)}
                        minHeight="60px"
                      />
                    </>
                  )}

                  {isPhase && (
                    <>
                      <Input
                        placeholder="Fase"
                        value={getValue('phase') || ''}
                        onChange={(e) => updateField('phase', e.target.value)}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Duración"
                        value={getValue('time') || ''}
                        onChange={(e) => updateField('time', e.target.value)}
                        className="text-xs h-8"
                      />
                      <RichTextEditor
                        placeholder="Descripción"
                        value={getValue('desc') || ''}
                        onChange={(val) => updateField('desc', val)}
                        minHeight="60px"
                      />
                    </>
                  )}

                  {isYear && (
                    <>
                      <Input
                        placeholder="Año"
                        value={getValue('year') || ''}
                        onChange={(e) => updateField('year', e.target.value)}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Título"
                        value={getValue('title') || ''}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="text-xs h-8"
                      />
                      <RichTextEditor
                        placeholder="Descripción"
                        value={getValue('description') || ''}
                        onChange={(val) => updateField('description', val)}
                        minHeight="60px"
                      />
                    </>
                  )}
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.milestones || [];
                const currentEN = sectionEN.content.milestones || [];
                const sample = currentES[0] || {};
                const isYear = sample.year !== undefined;
                const isStep = sample.step !== undefined;
                const isPhase = sample.phase !== undefined;
                const newItem = isStep 
                  ? { step: `${currentES.length + 1}`, title: "", desc: "" }
                  : isPhase 
                    ? { phase: "", time: "" }
                    : { year: "", title: "", description: "", icon: "Lightbulb" };
                handleContentChange("milestones", [...currentES, { ...newItem }], 'es');
                handleContentChange("milestones", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2 text-[#1C5D15]" /> Agregar Hito Sincronizado
            </Button>
          </div>
        </div>
      )}

      {/* Tipo History */}
      {sectionES.type === "history" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="history-title" label="Título Principal" />
              <Input
                value={(getFieldLang('history-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('history-title'))}
                placeholder="Título de historia"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="history-subtitle" label="Subtítulo" />
              <Input
                value={(getFieldLang('history-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(e) => handleContentChange("subtitle", e.target.value, getFieldLang('history-subtitle'))}
                placeholder="Subtítulo de historia"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="history-desc" label="Descripción de Sección" />
              <RichTextEditor
                value={(getFieldLang('history-desc') === 'es' ? sectionES.content.description : sectionEN.content.description) || ""}
                onChange={(val) => handleContentChange("description", val, getFieldLang('history-desc'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1">HITOS (SINCRONIZADOS)</Label>
            {(sectionES.content.milestones || []).map((ms: any, idx: number) => {
              const fKey = `history-${idx}`;
              return (
                <div key={idx} className="p-3 border rounded-xl bg-gray-50/50 relative group space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => {
                      const newES = sectionES.content.milestones.filter((_: any, i: number) => i !== idx);
                      const newEN = sectionEN.content.milestones.filter((_: any, i: number) => i !== idx);
                      handleContentChange("milestones", newES, 'es');
                      handleContentChange("milestones", newEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Hito #${idx + 1}`} />

                  {ms.year !== undefined ? (
                    <div className="grid gap-2">
                      <Input
                        placeholder="Año"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.milestones[idx].year : sectionEN.content.milestones[idx].year) || ""}
                        onChange={(e) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.milestones];
                          newList[idx].year = e.target.value;
                          handleContentChange("milestones", newList, lang);
                        }}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Título"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.milestones[idx].title : sectionEN.content.milestones[idx].title) || ""}
                        onChange={(e) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.milestones];
                          newList[idx].title = e.target.value;
                          handleContentChange("milestones", newList, lang);
                        }}
                        className="text-xs h-8"
                      />
                      <RichTextEditor
                        placeholder="Descripción"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.milestones[idx].description : sectionEN.content.milestones[idx].description) || ""}
                        onChange={(val) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.milestones];
                          newList[idx].description = val;
                          handleContentChange("milestones", newList, lang);
                        }}
                        minHeight="60px"
                      />
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Input
                        placeholder="Fase"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.milestones[idx].phase : sectionEN.content.milestones[idx].phase) || ""}
                        onChange={(e) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.milestones];
                          newList[idx].phase = e.target.value;
                          handleContentChange("milestones", newList, lang);
                        }}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Duración"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.milestones[idx].time : sectionEN.content.milestones[idx].time) || ""}
                        onChange={(e) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.milestones];
                          newList[idx].time = e.target.value;
                          handleContentChange("milestones", newList, lang);
                        }}
                        className="text-xs h-8"
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.milestones || [];
                const currentEN = sectionEN.content.milestones || [];
                const sample = currentES[0] || {};
                const newItem = sample.year !== undefined ? { year: "", title: "", description: "", icon: "Lightbulb" } : { phase: "", time: "" };
                handleContentChange("milestones", [...currentES, { ...newItem }], 'es');
                handleContentChange("milestones", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2 text-[#1C5D15]" /> Agregar Hito Sincronizado
            </Button>
          </div>
        </div>
      )}

      {/* Tipo FAQ */}
      {sectionES.type === "faq" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="faq-title" label="Título Principal" />
              <Input
                value={(getFieldLang('faq-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('faq-title'))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="faq-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('faq-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('faq-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">PREGUNTAS FRECUENTES</Label>
            {(sectionES.content.items || []).map((item: any, idx: number) => {
              const fKey = `faq-item-${idx}`;
              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("items", newListES, 'es');
                      handleContentChange("items", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Pregunta #${idx + 1}`} />

                  <div className="grid gap-3">
                    <div>
                      <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Pregunta</Label>
                      <Input
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].question : sectionEN.content.items[idx].question) || ""}
                        onChange={(e) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.items];
                          newList[idx] = { ...newList[idx], question: e.target.value };
                          handleContentChange("items", newList, lang);
                        }}
                        className="text-xs h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Respuesta</Label>
                      <RichTextEditor
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].answer : sectionEN.content.items[idx].answer) || ""}
                        onChange={(val) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.items];
                          newList[idx] = { ...newList[idx], answer: val };
                          handleContentChange("items", newList, lang);
                        }}
                        minHeight="80px"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.items || [];
                const currentEN = sectionEN.content.items || [];
                const newItem = { question: "", answer: "" };
                handleContentChange("items", [...currentES, { ...newItem }], 'es');
                handleContentChange("items", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Pregunta
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Features / Trust */}
      {(sectionES.type === "features" || sectionES.type === "trust") && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="list-title" label="Título de Sección" />
              <Input
                value={(getFieldLang('list-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('list-title'))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="list-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('list-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('list-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          {/* Si es Store y tipo trust, permitimos selección de ecosistema */}
          {pageSlug?.includes('store') && sectionES.type === "trust" ? (
            <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
              <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#19FF00]" />
                Clientes (Ecosistema)
              </Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {availableEcosystemMembers.map(member => {
                  const isSelected = (sectionES.content.selectedMemberIds || []).includes(member.id);
                  return (
                    <div 
                      key={member.id}
                      onClick={() => {
                        const current = sectionES.content.selectedMemberIds || [];
                        const next = isSelected ? current.filter((id: string) => id !== member.id) : [...current, member.id];
                        handleContentChange('selectedMemberIds', next, 'both');
                      }}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-[#19FF00]/10 border-[#19FF00]/40' : 'bg-gray-50 border-gray-100'}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#1C5D15] border-[#1C5D15]' : 'bg-white border-gray-300'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-bold text-[#1C5D15] truncate">{member.translation?.name || member.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">
                {sectionES.type === "trust" ? "Aliados Sincronizados" : "Características Sincronizadas"}
              </Label>
              {(sectionES.content.items || sectionES.content.partners || []).map((_: any, idx: number) => {
              const arrayKey = sectionES.type === "trust" ? "partners" : "items";
              const currentListES = sectionES.content[arrayKey] || [];
              const fKey = `${arrayKey}-${idx}`;

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = currentListES.filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content[arrayKey] || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange(arrayKey, newListES, 'es');
                      handleContentChange(arrayKey, newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Item #${idx + 1}`} />

                  <div className="grid gap-3">

                    {/* Selector de icono - SOLO modo normal features (Purpose/Propósito) */}
                    {sectionES.type === "features" && !sectionES.content.badge && !sectionES.content.items?.[0]?.details && (
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                        <select
                          className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                          value={sectionES.content.items?.[idx]?.icon || 'Users'}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.items || [])];
                            const newListEN = [...(sectionEN.content.items || [])];
                            newListES[idx] = { ...newListES[idx], icon: e.target.value };
                            newListEN[idx] = { ...newListEN[idx], icon: e.target.value };
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                        >
                          <option value="Users">Personas (Users)</option>
                          <option value="Target">Objetivo (Target)</option>
                          <option value="Lightbulb">Bombilla (Lightbulb)</option>
                          <option value="Shield">Escudo (Shield)</option>
                          <option value="Leaf">Hoja (Leaf)</option>
                          <option value="Globe">Globo (Globe)</option>
                          <option value="Zap">Rayo (Zap)</option>
                          <option value="Star">Estrella (Star)</option>
                          <option value="TrendingUp">Crecimiento (TrendingUp)</option>
                          <option value="Microscope">Microscopio</option>
                          <option value="Atom">Átomo (Atom)</option>
                          <option value="FlaskConical">Frasco (FlaskConical)</option>
                        </select>
                      </div>
                    )}

                    <Input
                      placeholder="Nombre / Título"
                      value={(getFieldLang(fKey) === 'es' ? (sectionES.content[arrayKey][idx].title || sectionES.content[arrayKey][idx].name) : (sectionEN.content[arrayKey][idx].title || sectionEN.content[arrayKey][idx].name)) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content[arrayKey]];
                        if (newList[idx].title !== undefined) newList[idx].title = e.target.value;
                        else newList[idx].name = e.target.value;
                        handleContentChange(arrayKey, newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content[arrayKey][idx].description : sectionEN.content[arrayKey][idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content[arrayKey]];
                        newList[idx].description = val;
                        handleContentChange(arrayKey, newList, lang);
                      }}
                      minHeight="70px"
                    />

                    {sectionES.type === "features" && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Duración estimada"
                          value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].duration : sectionEN.content.items[idx].duration) || ""}
                          onChange={(e) => {
                            const lang = getFieldLang(fKey);
                            const target = lang === 'es' ? sectionES : sectionEN;
                            const newList = [...target.content.items];
                            newList[idx].duration = e.target.value;
                            handleContentChange("items", newList, lang);
                          }}
                          className="text-xs h-9"
                        />
                        <Input
                          placeholder="Resultado esperado"
                          value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].result : sectionEN.content.items[idx].result) || ""}
                          onChange={(e) => {
                            const lang = getFieldLang(fKey);
                            const target = lang === 'es' ? sectionES : sectionEN;
                            const newList = [...target.content.items];
                            newList[idx].result = e.target.value;
                            handleContentChange("items", newList, lang);
                          }}
                          className="text-xs h-9"
                        />
                      </div>
                    )}

                    {/* LISTA DE CHECKS / DETALLES - MODO TECNOLOGIA */}
                    {sectionES.type === "features" && (
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <Label className="text-[#1C5D15] text-[10px] font-bold uppercase tracking-tight">Lista de Características ✓</Label>
                        <div className="grid gap-2">
                          {((getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].details : sectionEN.content[arrayKey][idx].details) || []).map((detail: string, dIdx: number) => (
                            <div key={dIdx} className="flex gap-1.5 animate-in slide-in-from-left-2 transition-all">
                              <Input
                                value={detail}
                                onChange={(e) => {
                                  const lang = getFieldLang(fKey);
                                  const target = lang === 'es' ? sectionES : sectionEN;
                                  const newList = [...target.content[arrayKey]];
                                  if (!newList[idx].details) newList[idx].details = [];
                                  newList[idx].details[dIdx] = e.target.value;
                                  handleContentChange(arrayKey, newList, lang);
                                }}
                                className="text-[10px] h-8 flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-300 hover:text-red-500 hover:bg-red-50"
                                onClick={() => {
                                  const newListES = [...sectionES.content[arrayKey]];
                                  const newListEN = [...sectionEN.content[arrayKey]];
                                  newListES[idx].details = (newListES[idx].details || []).filter((_: any, i: number) => i !== dIdx);
                                  newListEN[idx].details = (newListEN[idx].details || []).filter((_: any, i: number) => i !== dIdx);
                                  handleContentChange(arrayKey, newListES, 'es');
                                  handleContentChange(arrayKey, newListEN, 'en');
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-[10px] text-[#1C5D15]/60 hover:text-[#1C5D15] border-dashed border border-[#1C5D15]/20 bg-gray-50/50"
                            onClick={() => {
                              const newListES = [...sectionES.content[arrayKey]];
                              const newListEN = [...sectionEN.content[arrayKey]];
                              if (!newListES[idx].details) newListES[idx].details = [];
                              if (!newListEN[idx].details) newListEN[idx].details = [];
                              newListES[idx].details.push("");
                              newListEN[idx].details.push("");
                              handleContentChange(arrayKey, newListES, 'es');
                              handleContentChange(arrayKey, newListEN, 'en');
                            }}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Nueva Característica ✓
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Placeholder y link - solo para trust */}
                    {sectionES.type === "trust" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[#1C5D15] text-[9px] uppercase font-bold mb-1 block">Categoría</Label>
                          <Input
                            placeholder="Ej: Inversión"
                            value={(getFieldLang(fKey) === 'es' ? sectionES.content[arrayKey][idx].placeholder : sectionEN.content[arrayKey][idx].placeholder) || ""}
                            onChange={(e) => {
                              const lang = getFieldLang(fKey);
                              const target = lang === 'es' ? sectionES : sectionEN;
                              const newList = [...target.content[arrayKey]];
                              newList[idx].placeholder = e.target.value;
                              handleContentChange(arrayKey, newList, lang);
                            }}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-[#1C5D15] text-[9px] uppercase font-bold mb-1 block">Enlace URL (Global)</Label>
                          <Input
                            placeholder="https://..."
                            value={sectionES.content[arrayKey][idx].link || ""}
                            onChange={(e) => {
                              const newListES = [...sectionES.content[arrayKey]];
                              const newListEN = [...sectionEN.content[arrayKey]];
                              newListES[idx].link = e.target.value;
                              newListEN[idx].link = e.target.value;
                              handleContentChange(arrayKey, newListES, 'es');
                              handleContentChange(arrayKey, newListEN, 'en');
                            }}
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    )}

                    {sectionES.type === "trust" && (
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <Label className="text-[#1C5D15] text-[10px] font-bold uppercase tracking-tight">Hitos del Socio</Label>
                        <div className="grid gap-2">
                          {((getFieldLang(fKey) === 'es' ? sectionES.content.partners[idx].details : sectionEN.content[arrayKey][idx].details) || []).map((detail: string, dIdx: number) => (
                            <div key={dIdx} className="flex gap-1.5 animate-in slide-in-from-left-2 transition-all">
                              <Input
                                value={detail}
                                onChange={(e) => {
                                  const lang = getFieldLang(fKey);
                                  const target = lang === 'es' ? sectionES : sectionEN;
                                  const newList = [...target.content[arrayKey]];
                                  newList[idx].details[dIdx] = e.target.value;
                                  handleContentChange(arrayKey, newList, lang);
                                }}
                                className="text-[10px] h-8 flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-300 hover:text-red-500 hover:bg-red-50"
                                onClick={() => {
                                  const newListES = [...sectionES.content[arrayKey]];
                                  const newListEN = [...sectionEN.content[arrayKey]];
                                  newListES[idx].details = (newListES[idx].details || []).filter((_: any, i: number) => i !== dIdx);
                                  newListEN[idx].details = (newListEN[idx].details || []).filter((_: any, i: number) => i !== dIdx);
                                  handleContentChange(arrayKey, newListES, 'es');
                                  handleContentChange(arrayKey, newListEN, 'en');
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-[10px] text-[#1C5D15]/60 hover:text-[#1C5D15] border-dashed border border-[#1C5D15]/20 bg-gray-50/50"
                            onClick={() => {
                              const newListES = [...sectionES.content[arrayKey]];
                              const newListEN = [...sectionEN.content[arrayKey]];
                              if (!newListES[idx].details) newListES[idx].details = [];
                              if (!newListEN[idx].details) newListEN[idx].details = [];
                              newListES[idx].details.push("");
                              newListEN[idx].details.push("");
                              handleContentChange(arrayKey, newListES, 'es');
                              handleContentChange(arrayKey, newListEN, 'en');
                            }}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Nuevo Hito Sincronizado
                          </Button>
                        </div>
                      </div>
                    )}

                    {sectionES.type === "trust" && (
                      <div className="pt-2">
                        <Label className="text-[9px] uppercase font-bold text-gray-400 mb-1 block">Imagen (Global)</Label>
                        <ImageUpload
                          currentImage={sectionES.content[arrayKey][idx].image}
                          onImageUpload={(url) => {
                            const newListES = [...sectionES.content[arrayKey]];
                            const newListEN = [...sectionEN.content[arrayKey]];
                            newListES[idx].image = url;
                            newListEN[idx].image = url;
                            handleContentChange(arrayKey, newListES, 'es');
                            handleContentChange(arrayKey, newListEN, 'en');
                          }}
                          type="avatar"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const arrayKey = sectionES.type === "trust" ? "partners" : "items";
                const currentES = sectionES.content[arrayKey] || [];
                const currentEN = sectionEN.content[arrayKey] || [];
                const newItem = sectionES.type === "trust"
                  ? { name: "", image: "", link: "", description: "", placeholder: "", details: [] }
                  : { title: "", description: "", icon: "Users", duration: "", result: "" };
                handleContentChange(arrayKey, [...currentES, { ...newItem }], 'es');
                handleContentChange(arrayKey, [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Item Sincronizado
            </Button>
          </div>
        )}
      </div>
    )}

      {/* Tipo Featured */}
      {sectionES.type === "featured" && (
        <div className="space-y-6">
          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="feat-tag" label="Etiqueta Superior" />
              <Input
                value={(getFieldLang('feat-tag') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('feat-tag'))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="feat-name" label="Nombre del Producto" />
              <Input
                value={(getFieldLang('feat-name') === 'es' ? sectionES.content.productName : sectionEN.content.productName) || ""}
                onChange={(e) => handleContentChange("productName", e.target.value, getFieldLang('feat-name'))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="feat-desc" label="Descripción del Producto" />
              <RichTextEditor
                value={(getFieldLang('feat-desc') === 'es' ? sectionES.content.productDescription : sectionEN.content.productDescription) || ""}
                onChange={(val) => handleContentChange("productDescription", val, getFieldLang('feat-desc'))}
                minHeight="120px"
              />
            </div>
          </div>

          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest border-b pb-2">Botón de Acción (CTA)</h4>
            <div>
              <LanguageToggle fieldKey="feat-cta-text" label="Texto del Botón" />
              <Input
                value={(getFieldLang('feat-cta-text') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ""}
                onChange={(e) => handleContentChange("ctaText", e.target.value, getFieldLang('feat-cta-text'))}
                placeholder="Ej: Ver Producto"
              />
            </div>
            <ActionSelector 
              label="Acción del Botón"
              value={sectionES.content.ctaLink || ''}
              actionType={sectionES.content.ctaActionType}
              fieldPrefix="cta"
            />
          </div>

          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest border-b pb-2">Características Clave</h4>
            <div className="space-y-4">
              {(sectionES.content.features || []).map((_: any, idx: number) => {
                const fKey = `feat-item-${idx}`;
                return (
                  <div key={idx} className="p-3 border rounded-lg bg-gray-50/50 relative group space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => {
                        const newES = sectionES.content.features.filter((_: any, i: number) => i !== idx);
                        const newEN = sectionEN.content.features.filter((_: any, i: number) => i !== idx);
                        handleContentChange("features", newES, 'es');
                        handleContentChange("features", newEN, 'en');
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>

                    <LanguageToggle fieldKey={fKey} label={`Característica #${idx + 1}`} />

                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                          <select
                            className="w-full text-[10px] h-8 border rounded-md bg-white"
                            value={sectionES.content.features[idx].icon || 'Shield'}
                            onChange={(e) => {
                              const newListES = [...sectionES.content.features];
                              const newListEN = [...sectionEN.content.features];
                              newListES[idx].icon = e.target.value;
                              newListEN[idx].icon = e.target.value;
                              handleContentChange("features", newListES, 'es');
                              handleContentChange("features", newListEN, 'en');
                            }}
                          >
                            <option value="Shield">Escudo (Shield)</option>
                            <option value="Leaf">Hoja (Leaf)</option>
                            <option value="Droplets">Gotas (Droplets)</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Título</Label>
                          <Input
                            value={(getFieldLang(fKey) === 'es' ? sectionES.content.features[idx].title : sectionEN.content.features[idx].title) || ""}
                            onChange={(e) => {
                              const lang = getFieldLang(fKey);
                              const target = lang === 'es' ? sectionES : sectionEN;
                              const newList = [...target.content.features];
                              newList[idx].title = e.target.value;
                              handleContentChange("features", newList, lang);
                            }}
                            className="h-8 text-[10px]"
                          />
                        </div>
                      </div>
                      <RichTextEditor
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.features[idx].description : sectionEN.content.features[idx].description) || ""}
                        onChange={(val) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...target.content.features];
                          newList[idx].description = val;
                          handleContentChange("features", newList, lang);
                        }}
                        minHeight="60px"
                      />
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-[10px] border-dashed border-[#1C5D15]/20 text-[#1C5D15]"
                onClick={() => {
                  const currentES = sectionES.content.features || [];
                  const currentEN = sectionEN.content.features || [];
                  const newItem = { icon: "Shield", title: "", description: "" };
                  handleContentChange("features", [...currentES, newItem], 'es');
                  handleContentChange("features", [...currentEN, newItem], 'en');
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Añadir Característica Sincronizada
              </Button>
            </div>
          </div>

          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <Label className="text-[#1C5D15] font-bold text-xs uppercase mb-2 block">Imagen del Producto (Global)</Label>
            <ImageUpload
              currentImage={sectionES.content.productImage}
              onImageUpload={(url) => handleContentChange("productImage", url, 'both')}
              type="banner"
            />
          </div>
        </div>
      )}

      {/* Tipo Timeline / History */}
      {(sectionES.type === "timeline" || sectionES.type === "history") && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="time-title" label="Título de Sección" />
              <Input
                value={(getFieldLang('time-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('time-title'))}
                placeholder="Nuestra Trayectoria"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="time-subtitle" label="Subtítulo" />
              <Input
                value={(getFieldLang('time-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(e) => handleContentChange("subtitle", e.target.value, getFieldLang('time-subtitle'))}
                placeholder="Hitos importantes"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="time-desc" label="Descripción Principal" />
              <RichTextEditor
                value={(getFieldLang('time-desc') === 'es' ? sectionES.content.description : sectionEN.content.description) || ""}
                onChange={(val) => handleContentChange("description", val, getFieldLang('time-desc'))}
                minHeight="100px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">
              {sectionES.type === "timeline" && pageSlug?.includes('technology') ? "PASOS DEL PROCESO" : "HITOS / EVENTOS"}
            </Label>
            {(sectionES.content.milestones || []).map((_: any, idx: number) => {
              const fKey = `milestone-${idx}`;
              const isTechStep = sectionES.type === "timeline" && pageSlug?.includes('technology');

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.milestones || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.milestones || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("milestones", newListES, 'es');
                      handleContentChange("milestones", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={isTechStep ? `Paso #${idx + 1}` : `Hito #${idx + 1}`} />

                  <div className="grid gap-3">
                    {isTechStep ? (
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Número / Paso</Label>
                        <Input
                          placeholder="Ej: 01"
                          value={sectionES.content.milestones[idx].step || ""}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.milestones || [])];
                            const newListEN = [...(sectionEN.content.milestones || [])];
                            newListES[idx].step = e.target.value;
                            newListEN[idx].step = e.target.value;
                            handleContentChange("milestones", newListES, 'es');
                            handleContentChange("milestones", newListEN, 'en');
                          }}
                          className="text-xs h-8"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Año / Fecha</Label>
                          <Input
                            placeholder="Ej: 2024"
                            value={sectionES.content.milestones[idx].year || ""}
                            onChange={(e) => {
                              const newListES = [...(sectionES.content.milestones || [])];
                              const newListEN = [...(sectionEN.content.milestones || [])];
                              newListES[idx].year = e.target.value;
                              newListEN[idx].year = e.target.value;
                              handleContentChange("milestones", newListES, 'es');
                              handleContentChange("milestones", newListEN, 'en');
                            }}
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                          <select
                            className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                            value={sectionES.content.milestones[idx].icon || 'Lightbulb'}
                            onChange={(e) => {
                              const newListES = [...(sectionES.content.milestones || [])];
                              const newListEN = [...(sectionEN.content.milestones || [])];
                              newListES[idx].icon = e.target.value;
                              newListEN[idx].icon = e.target.value;
                              handleContentChange("milestones", newListES, 'es');
                              handleContentChange("milestones", newListEN, 'en');
                            }}
                          >
                            <option value="Lightbulb">Idea (Lightbulb)</option>
                            <option value="FileCheck">Registro (FileCheck)</option>
                            <option value="TrendingUp">Crecimiento (TrendingUp)</option>
                            <option value="Rocket">Lanzamiento (Rocket)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <Input
                      placeholder={isTechStep ? "Título del Paso" : "Título del Hito"}
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.milestones[idx].title : sectionEN.content.milestones[idx].title) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.milestones];
                        newList[idx].title = e.target.value;
                        handleContentChange("milestones", newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción detallada"
                      value={(getFieldLang(fKey) === 'es' ? (sectionES.content.milestones[idx].description || sectionES.content.milestones[idx].desc) : (sectionEN.content.milestones[idx].description || sectionEN.content.milestones[idx].desc)) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.milestones];
                        if (isTechStep) newList[idx].desc = val;
                        else newList[idx].description = val;
                        handleContentChange("milestones", newList, lang);
                      }}
                      minHeight="60px"
                    />
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.milestones || [];
                const currentEN = sectionEN.content.milestones || [];
                const isTechStep = sectionES.type === "timeline" && pageSlug?.includes('technology');
                const newItem = isTechStep 
                  ? { step: `0${currentES.length + 1}`, title: "", desc: "" }
                  : { year: "", title: "", description: "", icon: "Lightbulb" };
                handleContentChange("milestones", [...currentES, { ...newItem }], 'es');
                handleContentChange("milestones", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> {sectionES.type === "timeline" && pageSlug?.includes('technology') ? "Agregar Paso" : "Agregar Hito"}
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Team */}
      {sectionES.type === "team" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="team-title" label="Título de Sección" />
              <Input
                value={(getFieldLang('team-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('team-title'))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="team-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('team-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('team-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1">EQUIPO (SINCRONIZADO)</Label>
            {(sectionES.content.members || []).map((_: any, idx: number) => {
              const fKey = `member-${idx}`;
              return (
                <div key={idx} className="p-4 border rounded-xl bg-white relative group space-y-4 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newES = sectionES.content.members.filter((_: any, i: number) => i !== idx);
                      const newEN = sectionEN.content.members.filter((_: any, i: number) => i !== idx);
                      handleContentChange("members", newES, 'es');
                      handleContentChange("members", newEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Miembro #${idx + 1}`} />

                  <div className="grid gap-3">
                    <Input
                      placeholder="Nombre"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.members[idx].name : sectionEN.content.members[idx].name) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.members];
                        newList[idx].name = e.target.value;
                        handleContentChange("members", newList, lang);
                      }}
                      className="text-xs h-9"
                    />
                    <Input
                      placeholder="Cargo / Rol"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.members[idx].role : sectionEN.content.members[idx].role) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.members];
                        newList[idx].role = e.target.value;
                        handleContentChange("members", newList, lang);
                      }}
                      className="text-xs h-9"
                    />
                    <Input
                      placeholder="Enlace LinkedIn (Global)"
                      value={sectionES.content.members[idx].linkedin || ""}
                      onChange={(e) => {
                        const newListES = [...sectionES.content.members];
                        const newListEN = [...sectionEN.content.members];
                        newListES[idx].linkedin = e.target.value;
                        newListEN[idx].linkedin = e.target.value;
                        handleContentChange("members", newListES, 'es');
                        handleContentChange("members", newListEN, 'en');
                      }}
                      className="text-xs h-9"
                    />
                    <div>
                      <Label className="text-[9px] uppercase font-bold text-gray-400 mb-1 block">Foto (Global)</Label>
                      <ImageUpload
                        currentImage={sectionES.content.members[idx].image}
                        onImageUpload={(url) => {
                          const newListES = [...sectionES.content.members];
                          const newListEN = [...sectionEN.content.members];
                          newListES[idx].image = url;
                          newListEN[idx].image = url;
                          handleContentChange("members", newListES, 'es');
                          handleContentChange("members", newListEN, 'en');
                        }}
                        type="avatar"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.members || [];
                const currentEN = sectionEN.content.members || [];
                const newItem = { name: "", role: "", image: "", linkedin: "" };
                handleContentChange("members", [...currentES, { ...newItem }], 'es');
                handleContentChange("members", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2 text-[#1C5D15]" /> Agregar Miembro Sincronizado
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Ecosystem / News / Products / Blog */}
      {(sectionES.type === "ecosystem" || sectionES.type === "news" || sectionES.type === "products" || sectionES.type === "blog") && (
        <div className="space-y-6">
          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey={`${sectionES.type}-title`} label="Título de Sección" />
              <Input
                value={(getFieldLang(`${sectionES.type}-title`) === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang(`${sectionES.type}-title`))}
              />
            </div>
            <div>
              <LanguageToggle fieldKey={`${sectionES.type}-subtitle`} label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang(`${sectionES.type}-subtitle`) === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang(`${sectionES.type}-subtitle`))}
                minHeight="100px"
              />
            </div>
          </div>

          {sectionES.type === "ecosystem" && (
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest border-b pb-2">Botón Acción CTA</h4>
                <div>
                  <LanguageToggle fieldKey="eco-cta-text" label="Texto del Botón" />
                  <Input
                    value={(getFieldLang('eco-cta-text') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ""}
                    onChange={(e) => handleContentChange("ctaText", e.target.value, getFieldLang('eco-cta-text'))}
                    placeholder="Ej: Conocer Más"
                    className="text-xs h-9"
                  />
                </div>
                <ActionSelector 
                  label="Acción del Botón"
                  value={sectionES.content.ctaLink || ''}
                  actionType={sectionES.content.ctaActionType}
                  fieldPrefix="cta"
                />
              </div>

              <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">CARACTERÍSTICAS SINCRONIZADAS</Label>
              {(sectionES.content.items || []).map((_: any, idx: number) => {
                const fKey = `ecosystem-item-${idx}`;

                return (
                  <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                      onClick={() => {
                        const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                        const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                        handleContentChange("items", newListES, 'es');
                        handleContentChange("items", newListEN, 'en');
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>

                    <LanguageToggle fieldKey={fKey} label={`Item #${idx + 1}`} />

                    <div className="grid gap-3">
                      <Input
                        placeholder="Título"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].title : sectionEN.content.items[idx].title) || ""}
                        onChange={(e) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...(target.content.items || [])];
                          newList[idx].title = e.target.value;
                          handleContentChange("items", newList, lang);
                        }}
                        className="text-xs h-9"
                      />

                      <RichTextEditor
                        placeholder="Descripción"
                        value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].description : sectionEN.content.items[idx].description) || ""}
                        onChange={(val) => {
                          const lang = getFieldLang(fKey);
                          const target = lang === 'es' ? sectionES : sectionEN;
                          const newList = [...(target.content.items || [])];
                          newList[idx].description = val;
                          handleContentChange("items", newList, lang);
                        }}
                        minHeight="60px"
                      />
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
                onClick={() => {
                  const currentES = sectionES.content.items || [];
                  const currentEN = sectionEN.content.items || [];
                  const newItem = { title: "", description: "", icon: "Users" };
                  handleContentChange("items", [...currentES, { ...newItem }], 'es');
                  handleContentChange("items", [...currentEN, { ...newItem }], 'en');
                }}
              >
                <Plus className="w-3 h-3 mr-2" /> Agregar Item Sincronizado
              </Button>
            </div>
          )}

          {sectionES.type === "news" && (
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
              <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest border-b pb-2">Botón de Acción (CTA)</h4>
              <div>
                <LanguageToggle fieldKey="news-cta" label="Texto del Botón" />
                <Input
                  value={(getFieldLang('news-cta') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ""}
                  onChange={(e) => handleContentChange("ctaText", e.target.value, getFieldLang('news-cta'))}
                  placeholder="Ej: Ver todas las noticias"
                />
              </div>
              <ActionSelector 
                label="Acción del Botón"
                value={sectionES.content.ctaLink || ''}
                actionType={sectionES.content.ctaActionType}
                fieldPrefix="cta"
              />
            </div>
          )}

          {sectionES.type === "blog" && (
            <div className="space-y-6">
              <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
                <div className="bg-[#19FF00]/10 rounded-lg p-3 mb-2">
                  <p className="text-[10px] text-[#1C5D15] font-medium">
                    ✅ Los artículos del blog se cargan AUTOMATICAMENTE, no se pueden editar aqui. Solo puedes cambiar el titulo y subtitulo de la sección.
                  </p>
                </div>
                <div>
                  <LanguageToggle fieldKey="blog-title" label="Título de la sección" />
                  <Input
                    value={(getFieldLang('blog-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ''}
                    onChange={(e) => handleContentChange('title', e.target.value, getFieldLang('blog-title'))}
                    placeholder="Nuestro Blog"
                    className="focus:ring-[#19FF00]/30"
                  />
                </div>
                <div>
                  <LanguageToggle fieldKey="blog-subtitle" label="Subtítulo" />
                  <Input
                    value={(getFieldLang('blog-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ''}
                    onChange={(e) => handleContentChange('subtitle', e.target.value, getFieldLang('blog-subtitle'))}
                    placeholder="Artículos, consejos y novedades sobre biotecnología"
                    className="focus:ring-[#19FF00]/30"
                  />
                </div>
              </div>
            </div>
          )}

          {sectionES.type === "products" && (
            <>
            {pageSlug?.includes('store') ? (
              <div className="p-4 bg-white border rounded-xl shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[#1C5D15]">
                  <CheckCircle2 className="w-4 h-4 text-[#19FF00]" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Catálogo Automático</h4>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed italic">
                  En la página de la Tienda, todos los productos activos de tu inventario se muestran automáticamente. No es necesario seleccionarlos manualmente aquí.
                </p>
                <div className="p-3 bg-amber-50 rounded-lg flex gap-2 items-start border border-amber-100">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 leading-tight">
                    Para gestionar qué productos aparecen, usa el <strong>Inventario de Productos</strong> en el panel de administración general.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Selección de Productos (Máx 3)</h4>
                  <span className="text-[9px] bg-[#1C5D15]/10 text-[#1C5D15] px-2 py-0.5 rounded-full font-bold">
                    {(sectionES.content.selectedProductIds || []).length} / 3
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <div className="flex flex-col">
                    <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Selección de Productos (Máx 3)</h4>
                    {((sectionES.content.selectedProductIds || []).length > 3 || (sectionES.content.selectedProductIds || []).some((id: string) => !availableProducts.find(p => p.id === id))) && (
                      <span className="text-[8px] text-amber-500 font-bold animate-pulse">⚠️ Hay IDs obsoletos o exceso de items</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {(sectionES.content.selectedProductIds || []).length > 0 && (
                      <button 
                        onClick={() => handleContentChange("selectedProductIds", [], 'both')}
                        className="text-[9px] text-red-500 hover:text-red-700 font-bold underline"
                      >
                        Limpiar
                      </button>
                    )}
                    <span className="text-[9px] bg-[#1C5D15]/10 text-[#1C5D15] px-2 py-0.5 rounded-full font-bold">
                      {Math.min((sectionES.content.selectedProductIds || []).filter((id: string) => availableProducts.find(p => p.id === id)).length, 3)} / 3
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {availableProducts.map((prod) => {
                    const isSelected = (sectionES.content.selectedProductIds || []).includes(prod.id);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => {
                          // 1. Obtener lista actual limpando IDs que ya no existen
                          const current = (sectionES.content.selectedProductIds || []).filter((id: string) => 
                            availableProducts.find(p => p.id === id)
                          );
                          
                          let newList;
                          if (isSelected) {
                            newList = current.filter((id: string) => id !== prod.id);
                          } else {
                            if (current.length >= 3) {
                              toast.warning('Capacidad máxima alcanzada (3). Deselecciona uno para añadir este.');
                              return;
                            }
                            newList = [...current, prod.id];
                          }
                          console.log('🛒 [CATALOGO] Actualizando selección:', newList);
                          handleContentChange("selectedProductIds", newList, 'both');
                        }}
                        className={`group flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#1C5D15]/5 border-[#1C5D15] shadow-sm' 
                            : 'hover:bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50 group-hover:scale-105 transition-transform">
                          <img src={prod.image} className="w-full h-full object-cover" alt={prod.slug} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-extrabold text-[#1C5D15] truncate">{prod.translation?.name || prod.slug}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{prod.category}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#19FF00] border-[#19FF00]' : 'border-gray-200 group-hover:border-[#19FF00]/30'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#1C5D15]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {availableProducts.length === 0 && (
                   <div className="py-8 text-center border-2 border-dashed rounded-xl">
                      <p className="text-[10px] text-gray-400 font-medium">Cargando productos...</p>
                   </div>
                )}

                {(sectionES.content.selectedProductIds || []).filter((id: string) => availableProducts.find(p => p.id === id)).length === 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl flex gap-2 items-start border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 leading-tight font-medium">
                      Si no seleccionas productos específicos, el sistema mostrará automáticamente los ítems marcados como <strong>Destacados</strong> en tu inventario.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Botón de Acción Final</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <LanguageToggle fieldKey="products-cta-text" label="Texto del Botón" />
                  <Input 
                    value={(getFieldLang('products-cta-text') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ""}
                    onChange={(e) => handleContentChange("ctaText", e.target.value, getFieldLang('products-cta-text'))}
                    placeholder="Ej: Ver Catálogo Completo"
                    className="mt-1"
                  />
                </div>
                <ActionSelector 
                  label="Acción del Botón"
                  value={sectionES.content.ctaLink || ''}
                  actionType={sectionES.content.ctaActionType}
                  fieldPrefix="cta"
                />
              </div>
            </div>
          </>
        )}
        </div>
      )}

      {/* TIPO BLOG-TEXT y BLOG-INTRO */}
      {(sectionES.type === "blog-text" || sectionES.type === "blog-intro") && (
        <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
          <LanguageToggle fieldKey="blog-content" label="Contenido HTML" />
          <RichTextEditor
            value={(getFieldLang('blog-content') === 'es' ? sectionES.content.html : sectionEN.content.html) || ''}
            onChange={(val) => handleContentChange('html', val, getFieldLang('blog-content'))}
            minHeight="300px"
          />
        </div>
      )}

      {/* TIPO BLOG-QUOTE */}
      {sectionES.type === "blog-quote" && (
        <div className="space-y-6">
          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
             <div>
                <LanguageToggle fieldKey="blog-quote-text" label="Cita / Testimonio" />
                <textarea
                  value={(getFieldLang('blog-quote-text') === 'es' ? sectionES.content.text : sectionEN.content.text) || ''}
                  onChange={(e) => handleContentChange('text', e.target.value, getFieldLang('blog-quote-text'))}
                  placeholder="Escribe la frase destacada aquí..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#19FF00] outline-none"
                  rows={4}
                />
             </div>
             <div>
                <LanguageToggle fieldKey="blog-quote-author" label="Autor / Referencia" />
                <Input
                  value={(getFieldLang('blog-quote-author') === 'es' ? sectionES.content.author : sectionEN.content.author) || ''}
                  onChange={(e) => handleContentChange('author', e.target.value, getFieldLang('blog-quote-author'))}
                  placeholder="Ej: Dr. Alberto Linero"
                  className="mt-1"
                />
             </div>
          </div>
        </div>
      )}

      {/* TIPO BLOG-LIST */}
      {sectionES.type === "blog-list" && (
        <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
          <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">ELEMENTOS DE LA LISTA</Label>
          {(sectionES.content.items || []).map((_: any, idx: number) => {
            const fKey = `blog-list-item-${idx}`;

            return (
              <div key={idx} className="p-3 border rounded-lg bg-gray-50 relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                  onClick={() => {
                    const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                    const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                    handleContentChange("items", newListES, 'es');
                    handleContentChange("items", newListEN, 'en');
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>

                <LanguageToggle fieldKey={fKey} label={`Punto #${idx + 1}`} />
                <Input
                  value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx] : sectionEN.content.items[idx]) || ''}
                  onChange={(e) => {
                    const lang = getFieldLang(fKey);
                    const target = lang === 'es' ? sectionES : sectionEN;
                    const newList = [...(target.content.items || [])];
                    newList[idx] = e.target.value;
                    handleContentChange("items", newList, lang);
                  }}
                  placeholder="Escribe el punto aquí..."
                  className="mt-1"
                />
              </div>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
            onClick={() => {
              const currentES = sectionES.content.items || [];
              const currentEN = sectionEN.content.items || [];
              handleContentChange("items", [...currentES, ""], 'es');
              handleContentChange("items", [...currentEN, ""], 'en');
            }}
          >
            <Plus className="w-3 h-3 mr-2 text-[#1C5D15]" /> Agregar Item
          </Button>
        </div>
      )}

      {/* TIPO BLOG-IMAGE */}
      {sectionES.type === "blog-image" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border rounded-xl shadow-sm space-y-4">
             <div>
                <Label className="text-[#1C5D15] font-bold text-xs uppercase mb-2 block">Cargar Imagen</Label>
                <ImageUpload
                  currentImage={sectionES.content.url}
                  onImageUpload={(url) => handleContentChange('url', url, 'both')}
                  type="banner"
                />
             </div>
             <div>
                <LanguageToggle fieldKey="blog-caption" label="Texto Alternativo / Epígrafe" />
                <Input
                  value={(getFieldLang('blog-caption') === 'es' ? sectionES.content.caption : sectionEN.content.caption) || ''}
                  onChange={(e) => handleContentChange('caption', e.target.value, getFieldLang('blog-caption'))}
                  placeholder="Ej: Muestra microscópica de tejido vegetal..."
                />
             </div>
          </div>
        </div>
      )}

      {/* TIPO BLOG-DIVIDER */}
      {sectionES.type === "blog-divider" && (
        <div className="p-4 bg-white border rounded-xl shadow-sm text-center">
           <Label className="text-[#1C5D15] font-bold text-xs uppercase mb-2 block">Separador Visual</Label>
           <p className="text-[10px] text-gray-400">Este bloque insertará automáticamente una línea verde suave para separar el contenido del artículo. No requiere configuración adicional.</p>
        </div>
      )}

      {sectionES.type === "custom" && (
        <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
          <LanguageToggle fieldKey="custom-json" label="JSON Content (Low Level)" />
          <textarea
            value={JSON.stringify(getFieldLang('custom-json') === 'es' ? sectionES.content : sectionEN.content, null, 2)}
            onChange={(e) => {
              try {
                const val = JSON.parse(e.target.value);
                handleContentChange('CONTENT_ROOT', val, getFieldLang('custom-json'));
              } catch (e) { }
            }}
            className="w-full mt-1 font-mono px-3 py-2 border rounded-lg text-xs"
            rows={15}
          />
        </div>
      )}

      {sectionES.content?.seo && (
        <div className="mt-8 border-t pt-6 space-y-6">
          <h4 className="font-extrabold text-[#1C5D15] text-xs uppercase tracking-widest px-1">Configuración SEO</h4>
          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="seo-title" label="Título Meta" />
              <Input
                value={(getFieldLang('seo-title') === 'es' ? sectionES.content.seo.metaTitle : sectionEN.content.seo.metaTitle) || ''}
                onChange={(e) => {
                  const lang = getFieldLang('seo-title');
                  const target = lang === 'es' ? sectionES : sectionEN;
                  handleContentChange('seo', { ...target.content.seo, metaTitle: e.target.value }, lang);
                }}
              />
            </div>
            <div>
              <LanguageToggle fieldKey="seo-desc" label="Descripción Meta" />
              <textarea
                value={(getFieldLang('seo-desc') === 'es' ? sectionES.content.seo.metaDescription : sectionEN.content.seo.metaDescription) || ''}
                onChange={(e) => {
                  const lang = getFieldLang('seo-desc');
                  const target = lang === 'es' ? sectionES : sectionEN;
                  handleContentChange('seo', { ...target.content.seo, metaDescription: e.target.value }, lang);
                }}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tipo Problems */}
      {sectionES.type === "problems" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="problems-title" label="Título Principal" />
              <Input
                value={(getFieldLang('problems-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('problems-title'))}
                placeholder="Los Retos de la Industria"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="problems-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('problems-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('problems-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">PROBLEMAS IDENTIFICADOS</Label>
            {(sectionES.content.items || []).map((_: any, idx: number) => {
              const fKey = `problem-${idx}`;

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("items", newListES, 'es');
                      handleContentChange("items", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Problema #${idx + 1}`} />

                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                        <select
                          className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                          value={sectionES.content.items[idx].icon || 'AlertTriangle'}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.items || [])];
                            const newListEN = [...(sectionEN.content.items || [])];
                            newListES[idx].icon = e.target.value;
                            newListEN[idx].icon = e.target.value;
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                        >
                          <option value="AlertTriangle">Triángulo de Alerta</option>
                          <option value="TrendingUp">Tendencia Ascendente</option>
                          <option value="Globe">Globo</option>
                          <option value="Shield">Escudo</option>
                          <option value="Leaf">Hoja</option>
                          <option value="Zap">Rayo</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Estadística</Label>
                        <Input
                          placeholder="Ej: 40%"
                          value={sectionES.content.items[idx].stat || ""}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.items || [])];
                            const newListEN = [...(sectionEN.content.items || [])];
                            newListES[idx].stat = e.target.value;
                            newListEN[idx].stat = e.target.value;
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>

                    <Input
                      placeholder="Título del Problema"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].title : sectionEN.content.items[idx].title) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].title = e.target.value;
                        handleContentChange("items", newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción del Problema"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].description : sectionEN.content.items[idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].description = val;
                        handleContentChange("items", newList, lang);
                      }}
                      minHeight="60px"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Etiqueta Estadística</Label>
                        <Input
                          placeholder="Ej: de pérdida"
                          value={sectionES.content.items[idx].statLabel || ""}
                          onChange={(e) => {
                            const newListES = [...(sectionES.content.items || [])];
                            const newListEN = [...(sectionEN.content.items || [])];
                            newListES[idx].statLabel = e.target.value;
                            newListEN[idx].statLabel = e.target.value;
                            handleContentChange("items", newListES, 'es');
                            handleContentChange("items", newListEN, 'en');
                          }}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.items || [];
                const currentEN = sectionEN.content.items || [];
                const newItem = { icon: "AlertTriangle", title: "", description: "", stat: "", statLabel: "" };
                handleContentChange("items", [...currentES, { ...newItem }], 'es');
                handleContentChange("items", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Problema
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Sectors */}
      {sectionES.type === "sectors" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="sectors-title" label="Título Principal" />
              <Input
                value={(getFieldLang('sectors-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('sectors-title'))}
                placeholder="Industrias que Servimos"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="sectors-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('sectors-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('sectors-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">SECTORES INDUSTRIALES</Label>
            {(sectionES.content.items || []).map((_: any, idx: number) => {
              const fKey = `sector-${idx}`;

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("items", newListES, 'es');
                      handleContentChange("items", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Sector #${idx + 1}`} />

                  <div className="grid gap-3">
                    <div>
                      <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                      <select
                        className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                        value={sectionES.content.items[idx].icon || 'Factory'}
                        onChange={(e) => {
                          const newListES = [...(sectionES.content.items || [])];
                          const newListEN = [...(sectionEN.content.items || [])];
                          newListES[idx].icon = e.target.value;
                          newListEN[idx].icon = e.target.value;
                          handleContentChange("items", newListES, 'es');
                          handleContentChange("items", newListEN, 'en');
                        }}
                      >
                        <option value="Factory">Fábrica</option>
                        <option value="Sprout">Planta</option>
                        <option value="Building2">Edificio</option>
                        <option value="Fish">Pez</option>
                        <option value="Apple">Manzana</option>
                        <option value="HeartPulse">Corazón</option>
                        <option value="Shirt">Camisa</option>
                        <option value="Warehouse">Almacén</option>
                      </select>
                    </div>

                    <Input
                      placeholder="Nombre del Sector"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].title : sectionEN.content.items[idx].title) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].title = e.target.value;
                        handleContentChange("items", newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción del Sector"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].description : sectionEN.content.items[idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].description = val;
                        handleContentChange("items", newList, lang);
                      }}
                      minHeight="60px"
                    />
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.items || [];
                const currentEN = sectionEN.content.items || [];
                const newItem = { icon: "Factory", title: "", description: "" };
                handleContentChange("items", [...currentES, { ...newItem }], 'es');
                handleContentChange("items", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Sector
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Stats */}
      {sectionES.type === "stats" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="stats-title" label="Título Principal" />
              <Input
                value={(getFieldLang('stats-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('stats-title'))}
                placeholder="Nuestros Resultados"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="stats-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('stats-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('stats-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">ESTADÍSTICAS</Label>
            {(sectionES.content.stats || []).map((_: any, idx: number) => {
              const fKey = `stat-${idx}`;

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.stats || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.stats || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("stats", newListES, 'es');
                      handleContentChange("stats", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Estadística #${idx + 1}`} />

                  <div className="grid gap-3">
                    <Input
                      placeholder="Valor (Ej: 95%)"
                      value={sectionES.content.stats[idx].value || ""}
                      onChange={(e) => {
                        const newListES = [...(sectionES.content.stats || [])];
                        const newListEN = [...(sectionEN.content.stats || [])];
                        newListES[idx].value = e.target.value;
                        newListEN[idx].value = e.target.value;
                        handleContentChange("stats", newListES, 'es');
                        handleContentChange("stats", newListEN, 'en');
                      }}
                      className="text-xs h-9"
                    />

                    <Input
                      placeholder="Etiqueta (Ej: Satisfacción del Cliente)"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.stats[idx].label : sectionEN.content.stats[idx].label) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.stats];
                        newList[idx].label = e.target.value;
                        handleContentChange("stats", newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción (Opcional)"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.stats[idx].description : sectionEN.content.stats[idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.stats];
                        newList[idx].description = val;
                        handleContentChange("stats", newList, lang);
                      }}
                      minHeight="60px"
                    />
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.stats || [];
                const currentEN = sectionEN.content.stats || [];
                const newItem = { value: "", label: "", description: "" };
                handleContentChange("stats", [...currentES, { ...newItem }], 'es');
                handleContentChange("stats", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Estadística
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Certifications */}
      {sectionES.type === "certifications" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="certifications-title" label="Título Principal" />
              <Input
                value={(getFieldLang('certifications-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('certifications-title'))}
                placeholder="Certificaciones y Reconocimientos"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="certifications-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('certifications-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('certifications-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">CERTIFICACIONES</Label>
            {(sectionES.content.items || []).map((_: any, idx: number) => {
              const fKey = `certification-${idx}`;

              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("items", newListES, 'es');
                      handleContentChange("items", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Certificación #${idx + 1}`} />

                  <div className="grid gap-3">
                    <Input
                      placeholder="Acrónimo (Ej: ISO 9001)"
                      value={sectionES.content.items[idx].acronym || ""}
                      onChange={(e) => {
                        const newListES = [...(sectionES.content.items || [])];
                        const newListEN = [...(sectionEN.content.items || [])];
                        newListES[idx].acronym = e.target.value;
                        newListEN[idx].acronym = e.target.value;
                        handleContentChange("items", newListES, 'es');
                        handleContentChange("items", newListEN, 'en');
                      }}
                      className="text-xs h-9"
                    />

                    <Input
                      placeholder="Nombre Completo"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].name : sectionEN.content.items[idx].name) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].name = e.target.value;
                        handleContentChange("items", newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción de la Certificación"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].description : sectionEN.content.items[idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].description = val;
                        handleContentChange("items", newList, lang);
                      }}
                      minHeight="60px"
                    />

                    <div>
                      <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Año de Obtención</Label>
                      <Input
                        placeholder="Ej: 2023"
                        value={sectionES.content.items[idx].year || ""}
                        onChange={(e) => {
                          const newListES = [...(sectionES.content.items || [])];
                          const newListEN = [...(sectionEN.content.items || [])];
                          newListES[idx].year = e.target.value;
                          newListEN[idx].year = e.target.value;
                          handleContentChange("items", newListES, 'es');
                          handleContentChange("items", newListEN, 'en');
                        }}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.items || [];
                const currentEN = sectionEN.content.items || [];
                const newItem = { acronym: "", name: "", description: "", year: "" };
                handleContentChange("items", [...currentES, { ...newItem }], 'es');
                handleContentChange("items", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Certificación
            </Button>
          </div>
        </div>
      )}


      {/* Tipo CTA */}
      {sectionES.type === "cta" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
              <select
                value={sectionES.content.icon || 'FlaskConical'}
                onChange={(e) => handleContentChange('icon', e.target.value, 'both')}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-[#1C5D15]"
              >
                {CTA_ICON_OPTIONS.map((iconName) => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
            </div>
            <div>
              <LanguageToggle fieldKey="cta-title" label="Título Principal" />
              <Input
                value={(getFieldLang('cta-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange("title", e.target.value, getFieldLang('cta-title'))}
                placeholder="¡Comienza Tu Transformación!"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="cta-subtitle" label="Subtítulo" />
              <RichTextEditor
                value={(getFieldLang('cta-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(val) => handleContentChange("subtitle", val, getFieldLang('cta-subtitle'))}
                minHeight="80px"
              />
            </div>
          </div>

          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div className="pt-4 border-t border-[#1C5D15]/10 space-y-4">
              <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest pb-2">Botones de Acción</h4>
              <div>
                <LanguageToggle fieldKey="cta-primary" label="Botón Primario" />
                <Input
                  placeholder="Texto del Botón"
                  value={(getFieldLang('cta-primary') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ""}
                  onChange={(e) => handleContentChange('ctaText', e.target.value, getFieldLang('cta-primary'))}
                  className="text-xs h-9 mb-2"
                />
                <ActionSelector 
                  label="Acción del Botón Primario"
                  value={sectionES.content.ctaLink || ''}
                  actionType={sectionES.content.ctaActionType}
                  fieldPrefix="cta"
                />
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <LanguageToggle fieldKey="cta-secondary" label="Botón Secundario" />
                <Input
                  placeholder="Texto del Botón"
                  value={(getFieldLang('cta-secondary') === 'es' ? sectionES.content.secondaryCtaText : sectionEN.content.secondaryCtaText) || ""}
                  onChange={(e) => handleContentChange('secondaryCtaText', e.target.value, getFieldLang('cta-secondary'))}
                  className="text-xs h-9 mb-2"
                />
                <ActionSelector 
                  label="Acción del Botón Secundario"
                  value={sectionES.content.secondaryCtaLink || ''}
                  actionType={sectionES.content.secondaryCtaActionType}
                  fieldPrefix="secondaryCta"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tipo FlipCards */}
      {sectionES.type === "flipcards" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">Tarjetas Informativas (Sincronizadas)</Label>
            {(sectionES.content.items || []).map((_: any, idx: number) => {
              const fKey = `flipcard-${idx}`;
              return (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm relative group space-y-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border"
                    onClick={() => {
                      const newListES = (sectionES.content.items || []).filter((_: any, i: number) => i !== idx);
                      const newListEN = (sectionEN.content.items || []).filter((_: any, i: number) => i !== idx);
                      handleContentChange("items", newListES, 'es');
                      handleContentChange("items", newListEN, 'en');
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <LanguageToggle fieldKey={fKey} label={`Tarjeta #${idx + 1}`} />

                  <div className="grid gap-3">
                    <div>
                      <Label className="text-[9px] font-bold text-[#1C5D15] uppercase mb-1 block">Icono</Label>
                      <select
                        className="w-full text-[10px] h-8 border rounded-md bg-white px-2"
                        value={sectionES.content.items[idx].icon || 'Shield'}
                        onChange={(e) => {
                          const newListES = [...(sectionES.content.items || [])];
                          const newListEN = [...(sectionEN.content.items || [])];
                          newListES[idx].icon = e.target.value;
                          newListEN[idx].icon = e.target.value;
                          handleContentChange("items", newListES, 'es');
                          handleContentChange("items", newListEN, 'en');
                        }}
                      >
                        <option value="Shield">Escudo (Shield)</option>
                        <option value="Truck">Camión (Truck)</option>
                        <option value="CheckCircle">Check</option>
                        <option value="Users">Personas</option>
                        <option value="Package">Paquete</option>
                        <option value="Award">Premio</option>
                        <option value="Zap">Rayo</option>
                        <option value="Sprout">Planta</option>
                      </select>
                    </div>

                    <Input
                      placeholder="Título"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].title : sectionEN.content.items[idx].title) || ""}
                      onChange={(e) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].title = e.target.value;
                        handleContentChange("items", newList, lang);
                      }}
                      className="text-xs h-9"
                    />

                    <RichTextEditor
                      placeholder="Descripción"
                      value={(getFieldLang(fKey) === 'es' ? sectionES.content.items[idx].description : sectionEN.content.items[idx].description) || ""}
                      onChange={(val) => {
                        const lang = getFieldLang(fKey);
                        const target = lang === 'es' ? sectionES : sectionEN;
                        const newList = [...target.content.items];
                        newList[idx].description = val;
                        handleContentChange("items", newList, lang);
                      }}
                      minHeight="60px"
                    />
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs py-5 border-dashed bg-white shadow-sm"
              onClick={() => {
                const currentES = sectionES.content.items || [];
                const currentEN = sectionEN.content.items || [];
                const newItem = { icon: "Shield", title: "", description: "" };
                handleContentChange("items", [...currentES, { ...newItem }], 'es');
                handleContentChange("items", [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Tarjeta
            </Button>
          </div>
        </div>
      )}

      {/* Tipo Category Filter */}
      {sectionES.type === "category-filter" && (
        <div className="space-y-6">
          <div className="p-4 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm">
            <div className="bg-[#1C5D15]/5 rounded-lg p-3">
              <p className="text-[10px] text-[#1C5D15] font-medium leading-relaxed">
                ✅ Este componente carga automáticamente las categorías del sistema. No requiere configuración manual de contenido.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tipo Hero / Blog Posts - Botones adicionales */}
      {sectionES.type === "hero" && (
         <div className="mt-8 pt-6 border-t border-[#1C5D15]/10 space-y-4">
            <h4 className="font-extrabold text-[#1C5D15] text-xs uppercase tracking-widest px-1">Botón Secundario Hero</h4>
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
              <div>
                <LanguageToggle fieldKey="hero-secondary-cta" label="Botón Secundario" />
                <Input
                  placeholder="Texto (Ej. Ver Catálogo)"
                  value={(getFieldLang('hero-secondary-cta') === 'es' ? sectionES.content.secondaryCtaText : sectionEN.content.secondaryCtaText) || ""}
                  onChange={(e) => handleContentChange('secondaryCtaText', e.target.value, getFieldLang('hero-secondary-cta'))}
                  className="text-xs h-9 mb-2"
                />
                <ActionSelector 
                  label="Acción del Botón Secundario"
                  value={sectionES.content.secondaryCtaLink || ''}
                  actionType={sectionES.content.secondaryCtaActionType}
                  fieldPrefix="secondaryCta"
                />
              </div>
            </div>
         </div>
      )}

      {/* Configuración Genérica de CTA Button para otras secciones */}
      {!["hero", "ecosystem", "news", "products", "featured", "flipcards", "category-filter", "clientes", "certifications", "stats", "cta", "custom", "footer-settings", "rich-text", "page-metadata"].includes(sectionES.type) && (
        <div className="mt-8 pt-6 border-t border-[#1C5D15]/10 space-y-4">
          <h4 className="font-extrabold text-[#1C5D15] text-xs uppercase tracking-widest px-1">Botón de Acción Final (CTA) - Opcional</h4>
          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
             <div>
                <LanguageToggle fieldKey="generic-cta-text" label="Texto del Botón" />
                <Input
                  value={(getFieldLang('generic-cta-text') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ""}
                  onChange={(e) => handleContentChange("ctaText", e.target.value, getFieldLang('generic-cta-text'))}
                  placeholder="Ej: Ver más"
                  className="text-xs h-9"
                />
             </div>
             <ActionSelector
                 label="Acción del Botón"
                 value={sectionES.content.ctaLink || ''}
                 actionType={sectionES.content.ctaActionType}
                 fieldPrefix="cta"
             />
          </div>
        </div>
      )}

      {/* Tipo Clientes / Sectores */}
      {sectionES.type === "clientes" && (
        <div className="space-y-6">
          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <div>
              <LanguageToggle fieldKey="clientes-title" label="Título Principal" />
              <Input
                value={(getFieldLang('clientes-title') === 'es' ? sectionES.content.title : sectionEN.content.title) || ""}
                onChange={(e) => handleContentChange('title', e.target.value, getFieldLang('clientes-title'))}
                placeholder="Nuestros Clientes Confian"
                className="focus:ring-[#19FF00]/30"
              />
            </div>
            <div>
              <LanguageToggle fieldKey="clientes-subtitle" label="Subtítulo" />
              <Input
                value={(getFieldLang('clientes-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                onChange={(e) => handleContentChange('subtitle', e.target.value, getFieldLang('clientes-subtitle'))}
                placeholder="Empresas y agricultores que confian en nosotros"
                className="focus:ring-[#19FF00]/30"
              />
            </div>
          </div>

          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-[#19FF00]" />
              Miembros del Ecosistema Disponibles
            </Label>
            
            <p className="text-[10px] text-[#629960] px-1 leading-tight">
              Selecciona los miembros que quieres mostrar. El orden de selección es el orden de aparición.
            </p>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {(availableEcosystemMembers || []).map((member) => {
                const isSelected = (sectionES.content.selectedMemberIds || []).includes(member.id);
                
                return (
                  <div 
                    key={member.id} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#19FF00]/5 border-[#19FF00]/30 shadow-sm' 
                        : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-[#1C5D15]/20'
                    }`}
                    onClick={() => {
                      const currentIds = sectionES.content.selectedMemberIds || [];
                      let newIds;
                      
                      if (isSelected) {
                        newIds = currentIds.filter((id: string) => id !== member.id);
                      } else {
                        newIds = [...currentIds, member.id];
                      }

                      handleContentChange('selectedMemberIds', newIds, 'both');
                    }}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#1C5D15] border-[#1C5D15]' 
                        : 'border-gray-200 bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-[#1C5D15]' : 'text-gray-700'}`}>
                        {member.translation?.name || member.name}
                      </p>
                    </div>
                  </div>
                );
              })}

              {availableEcosystemMembers.length === 0 && (
                <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed">
                  <p className="text-[10px] text-gray-400">No hay miembros disponibles para seleccionar.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[10px] font-bold text-[#1C5D15]">
                {(sectionES.content.selectedMemberIds || []).length} seleccionados
              </span>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
