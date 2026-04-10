import React, { useState } from 'react';
import { Section } from '../../../data/supabase';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { ImageUpload } from '../../ImageUpload';
import { Trash2, Plus, X, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '../RichTextEditor';

interface VisualEditorSidebarProps {
  sectionES: Section;
  sectionEN: Section;
  onUpdateSection: (sectionId: string, content: any, lang: 'es' | 'en' | 'both') => void;
  onUpdateSeo?: (sectionId: string, seo: any) => void;
  availableProducts?: any[];
}

export function VisualEditorSidebar({ sectionES, sectionEN, onUpdateSection, onUpdateSeo, availableProducts = [] }: VisualEditorSidebarProps) {
  const [fieldLangs, setFieldLangs] = useState<Record<string, 'es' | 'en'>>({});

  if (!sectionES || !sectionEN) {
    return null;
  }

  const handleContentChange = (field: string, value: any, lang: 'es' | 'en' | 'both') => {
    if (lang === 'both') {
      onUpdateSection(sectionES.id, { ...sectionES.content, [field]: value }, 'es');
      onUpdateSection(sectionEN.id, { ...sectionEN.content, [field]: value }, 'en');
    } else {
      const target = lang === 'es' ? sectionES : sectionEN;
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
            className={`px-2 py-0.5 text-[9px] font-black rounded-sm transition-all ${
              current === 'es' ? 'bg-[#1C5D15] text-white shadow-sm scale-110' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setFieldLang(fieldKey, 'en')}
            className={`px-2 py-0.5 text-[9px] font-black rounded-sm transition-all ${
              current === 'en' ? 'bg-[#1C5D15] text-white shadow-sm scale-110' : 'text-gray-400 hover:text-gray-600'
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
      <div className="bg-[#1C5D15]/5 rounded-lg p-3 border border-[#1C5D15]/20">
        <h3 className="font-bold text-[#1C5D15] uppercase tracking-wider text-xs flex items-center gap-2">
          <Globe className="w-3 h-3 text-[#19FF00]" />
          Componente: {sectionES.type}
        </h3>
        <p className="text-[10px] text-[#629960] mt-1 font-medium">Edición Pro: Multi-idioma Inline activo</p>
      </div>

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

          <div className="p-3 bg-white border border-[#1C5D15]/10 rounded-xl shadow-sm space-y-5">
            <div className="grid gap-4">
              <div className="space-y-3">
                <LanguageToggle fieldKey="hero-cta" label="Botón Primario" />
                <Input 
                  placeholder="Texto"
                  value={(getFieldLang('hero-cta') === 'es' ? sectionES.content.ctaText : sectionEN.content.ctaText) || ''} 
                  onChange={(e) => handleContentChange('ctaText', e.target.value, getFieldLang('hero-cta'))}
                />
                <Input 
                  placeholder="Enlace URL"
                  value={(getFieldLang('hero-cta') === 'es' ? sectionES.content.ctaLink : sectionEN.content.ctaLink) || ''} 
                  onChange={(e) => handleContentChange('ctaLink', e.target.value, getFieldLang('hero-cta'))}
                />
              </div>

              <div className="h-px bg-gray-100" />

              <div className="space-y-3">
                <LanguageToggle fieldKey="hero-cta2" label="Botón Secundario" />
                <Input 
                  placeholder="Texto"
                  value={(getFieldLang('hero-cta2') === 'es' ? sectionES.content.secondaryCtaText : sectionEN.content.secondaryCtaText) || ''} 
                  onChange={(e) => handleContentChange('secondaryCtaText', e.target.value, getFieldLang('hero-cta2'))}
                />
                <Input 
                  placeholder="Enlace URL"
                  value={(getFieldLang('hero-cta2') === 'es' ? sectionES.content.secondaryCtaLink : sectionEN.content.secondaryCtaLink) || ''} 
                  onChange={(e) => handleContentChange('secondaryCtaLink', e.target.value, getFieldLang('hero-cta2'))}
                />
              </div>
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
            {(sectionES.content.milestones || []).map((ms: any, idx: number) => {
              const fKey = `milestone-${idx}`;
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
            {sectionES.content.subtitle !== undefined && (
              <div>
                <LanguageToggle fieldKey="list-subtitle" label="Subtítulo" />
                <RichTextEditor
                  value={(getFieldLang('list-subtitle') === 'es' ? sectionES.content.subtitle : sectionEN.content.subtitle) || ""}
                  onChange={(val) => handleContentChange("subtitle", val, getFieldLang('list-subtitle'))}
                  minHeight="80px"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-[#1C5D15] font-bold px-1 uppercase tracking-tight">
              {sectionES.type === "trust" ? "Aliados Sincronizados" : "Características Sincronizadas"}
            </Label>
            {(sectionES.content.items || sectionES.content.partners || []).map((item: any, idx: number) => {
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

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#1C5D15] text-[9px] uppercase font-bold mb-1 block">Abreviatura / Especie</Label>
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
                  : { title: "", description: "", icon: "Users" };
                handleContentChange(arrayKey, [...currentES, { ...newItem }], 'es');
                handleContentChange(arrayKey, [...currentEN, { ...newItem }], 'en');
              }}
            >
              <Plus className="w-3 h-3 mr-2" /> Agregar Item Sincronizado
            </Button>
          </div>
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
            <div>
              <Label className="text-[#1C5D15] font-bold text-[10px] uppercase mb-1.5 block">Enlace del Botón (Global)</Label>
              <Input
                value={sectionES.content.ctaLink || ""}
                onChange={(e) => handleContentChange("ctaLink", e.target.value, 'both')}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest border-b pb-2">Características Clave</h4>
            <div className="space-y-4">
              {(sectionES.content.features || []).map((feat: any, idx: number) => {
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
            {(sectionES.content.members || []).map((member: any, idx: number) => {
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

      {/* Tipo Ecosystem / News / Products */}
      {(sectionES.type === "ecosystem" || sectionES.type === "news" || sectionES.type === "products") && (
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

          {sectionES.type === "products" && (
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <h4 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest">Selección de Productos (Máx 3)</h4>
                <span className="text-[9px] bg-[#1C5D15]/10 text-[#1C5D15] px-2 py-0.5 rounded-full font-bold">
                  {(sectionES.content.selectedProductIds || []).length} / 3
                </span>
              </div>
              
              <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {availableProducts.filter(p => p.featured).map((prod) => {
                  const isSelected = (sectionES.content.selectedProductIds || []).includes(prod.id);
                  return (
                    <div 
                      key={prod.id} 
                      onClick={() => {
                        const current = sectionES.content.selectedProductIds || [];
                        let newList;
                        if (isSelected) {
                          newList = current.filter((id: string) => id !== prod.id);
                        } else {
                          if (current.length >= 3) {
                             toast.error('Solo puedes seleccionar un máximo de 3 productos');
                             return;
                          }
                          newList = [...current, prod.id];
                        }
                        handleContentChange("selectedProductIds", newList, 'both');
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected ? 'bg-[#1C5D15]/5 border-[#1C5D15] shadow-sm' : 'hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={prod.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#1C5D15] truncate">{prod.translation?.name || prod.slug}</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{prod.category}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#1C5D15] border-[#1C5D15]' : 'border-gray-200'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {(sectionES.content.selectedProductIds || []).length === 0 && (
                <div className="p-3 bg-amber-50 rounded-lg flex gap-2 items-start">
                   <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-amber-700 leading-tight">
                     Si no seleccionas productos aquí, se mostrarán automáticamente los productos marcados como "Destacados" en el inventario.
                   </p>
                </div>
              )}
            </div>
          )}
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
                } catch(e) {}
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
                  handleContentChange('seo', {...target.content.seo, metaTitle: e.target.value}, lang);
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
                  handleContentChange('seo', {...target.content.seo, metaDescription: e.target.value}, lang);
                }}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
