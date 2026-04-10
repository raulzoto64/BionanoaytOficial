import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  FileText, 
  Globe, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Page, 
  PageContent, 
  Section, 
  supabaseAPI 
} from '../../data/supabase';
import { ImageUpload } from '../../components/ImageUpload';
import { AdminEcosystem } from './AdminEcosystem';

interface PageWithContent extends Page {
  contentES: PageContent | null;
  contentEN: PageContent | null;
}

export function AdminContent() {
  const [pagesData, setPagesData] = useState<PageWithContent[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const ecosystemRefs = useRef<Record<string, { save: () => Promise<void> }>>({});
  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const allPages = await supabaseAPI.getAllPages();
      const pagesWithContent = await Promise.all(
        allPages.map(async (page) => {
          const contentES = await supabaseAPI.getPageContent(page.id, 'es');
          const contentEN = await supabaseAPI.getPageContent(page.id, 'en');
          
          return {
            ...page,
            contentES,
            contentEN,
          };
        })
      );

      setPagesData(pagesWithContent);
    } catch (error) {
      toast.error('Error al cargar páginas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPage = (page: PageWithContent) => {
    setEditingPage(page);
    
    // Cargar secciones en español y english para edición simultánea
    const sectionsES = page.contentES?.sections || [];
    const sectionsEN = page.contentEN?.sections || [];
    
    // Combina las secciones de ambos idiomas, manteniendo el orden
    const combinedSections = sectionsES.map(sectionES => {
      const sectionEN = sectionsEN.find(sec => sec.id === sectionES.id);
      return {
        ...sectionES,
        contentEN: sectionEN?.content || {}
      };
    });
    
    // Agrega secciones que solo existan en inglés
    const englishOnlySections = sectionsEN.filter(sectionEN => 
      !sectionsES.some(sectionES => sectionES.id === sectionEN.id)
    ).map(sectionEN => ({
      ...sectionEN,
      contentEN: sectionEN.content
    }));
    
    setSections([...combinedSections, ...englishOnlySections]);
  };

  const handleSave = async () => {
    if (!editingPage) return;

    setIsSaving(true);
    try {
      // Separar secciones para español y inglés
      const sectionsES = sections.map(section => ({
        ...section,
        content: section.content // Contenido en español
      }));

      const sectionsEN = sections.map(section => ({
        ...section,
        content: (section as any).contentEN || {} // Contenido en inglés
      }));

      // Guardar ambos idiomas
      await Promise.all([
        supabaseAPI.updatePageContent(editingPage.id, 'es', sectionsES),
        supabaseAPI.updatePageContent(editingPage.id, 'en', sectionsEN)
      ]);

      // Guardar ecosistema si existe
      for (const ref of Object.values(ecosystemRefs.current)) {
        if (ref) {
          try {
            await ref.save();
          } catch(e) {}
        }
      }

      toast.success('Contenido guardado exitosamente en ambos idiomas');
      setEditingPage(null);
      setSections([]);
      loadPages();
    } catch (error) {
      toast.error('Error al guardar el contenido');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setSections([]);
  };

  const addSection = () => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      type: 'text',
      order: sections.length + 1,
      visible: true,
      content: {
        title: '',
        text: '',
        subtitle: '',
        ctaText: '',
        ctaLink: '',
        backgroundImage: ''
      },
    };
    setSections(prev => [...prev, newSection]);
  };


  const updateSection = (index: number, updates: Partial<Section>) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[index] = { ...newSections[index], ...updates };
      return newSections;
    });
  };

  const updateSectionContent = (index: number, field: string, value: any) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        content: {
          ...newSections[index].content,
          [field]: value,
        },
      };
      return newSections;
    });
  };

  const deleteSection = (index: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    setSections(prev => {
      const newSections = [...prev];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      newSections[index - 1] = { ...newSections[index - 1], order: index };
      newSections[index] = { ...newSections[index], order: index + 1 };
      return newSections;
    });
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    setSections(prev => {
      const newSections = [...prev];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      newSections[index] = { ...newSections[index], order: index + 1 };
      newSections[index + 1] = { ...newSections[index + 1], order: index + 2 };
      return newSections;
    });
  };

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSaveSection = async () => {
    if (!editingPage) return;

    try {
      // Usar el estado actual de todas las secciones como fuente de verdad
      // para evitar perder cambios pendientes en otras secciones
      const allSectionsES = sections.map(sec => ({
        ...sec,
        content: sec.content // Contenido en su idioma original (ES)
      }));

      const allSectionsEN = sections.map(sec => ({
        ...sec,
        content: (sec as any).contentEN || {} // Contenido traducido (EN)
      }));

      // Guardar todo el contenido de la página para asegurar consistencia total
      await Promise.all([
        supabaseAPI.updatePageContent(editingPage.id, 'es', allSectionsES),
        supabaseAPI.updatePageContent(editingPage.id, 'en', allSectionsEN)
      ]);

      // Guardar ecosistema si hay refs asociadas
      for (const ref of Object.values(ecosystemRefs.current)) {
        if (ref) {
          try {
            await ref.save();
          } catch(e) {}
        }
      }

      toast.success('Cambios guardados exitosamente en la página');
      
      // Opcionalmente recargar para sincronizar con ID asignados por DB si fuera necesario
      // loadPages(); 
    } catch (error) {
      console.error('Error saving section:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#629960]">Cargando páginas...</p>
      </div>
    );
  }

  // Vista de edición
  if (editingPage) {
    const headerActions = document.getElementById('admin-header-actions');

    return (
      <div className="flex flex-col min-h-full">
        {/* Usamos un Portal para enviar los botones a la barra superior global */}
        {headerActions && createPortal(
          <>
            <div className="w-px h-6 bg-[#1C5D15]/20 mx-2"></div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] shadow-sm transform active:scale-95 transition-transform"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Guardar Cambios' : 'Guardar Todo'}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="border-[#1C5D15] text-[#1C5D15] hover:bg-[#F7F9CE]">
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
          </>,
          headerActions
        )}

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 p-6 bg-white rounded-xl border-2 border-[#1C5D15]/10 shadow-sm">
              <h2 className="text-3xl font-bold text-[#1C5D15] mb-2 flex items-center gap-3">
                <Globe className="w-8 h-8" />
                Editando Página: <span className="text-[#629960]">{editingPage.slug}</span>
              </h2>
              <p className="text-[#629960]">
                Gestiona las secciones y el contenido dinámico de esta página. Los cambios se aplicarán globalmente al guardar.
              </p>
            </div>

            {/* Botón agregar sección */}
            <Button
              onClick={addSection}
              className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#629960] hover:text-white mb-6 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Sección
            </Button>

            {/* Lista de secciones */}
            <div className="space-y-4">
              {sections.length === 0 ? (
                <Card className="p-12 bg-white border-2 border-[#629960]/20 text-center">
                  <FileText className="w-16 h-16 text-[#1C5D15] mx-auto mb-4" />
                  <h3 className="text-2xl text-[#1C5D15] mb-2">No hay secciones</h3>
                  <p className="text-[#629960] mb-4">Agrega tu primera sección para comenzar</p>
                </Card>
              ) : (
                sections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    totalSections={sections.length}
                    isExpanded={expandedSections.has(section.id)}
                    onToggleExpanded={() => toggleSectionExpanded(section.id)}
                    onUpdate={(updates) => updateSection(index, updates)}
                    onUpdateContent={(field, value) => updateSectionContent(index, field, value)}
                    onDelete={() => deleteSection(index)}
                    onMoveUp={() => moveSectionUp(index)}
                    onMoveDown={() => moveSectionDown(index)}
                    onSaveSection={handleSaveSection}
                    ecosystemRefs={ecosystemRefs}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de páginas
  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Contenido</h2>
        <p className="text-[#629960]">Administra el contenido de todas las páginas del sitio</p>
      </div>

      {/* Pages Grid */}
      <div className="grid gap-4">
        {pagesData.map((page) => (
          <Card key={page.id} className="p-6 bg-white border-2 border-[#629960]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1C5D15] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-[#1C5D15] mb-1 capitalize">
                    {page.slug.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-sm text-[#629960]">
                    {page.contentES?.sections.length || 0} secciones
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={
                    page.status === 'published'
                      ? 'bg-[#19FF00] text-[#1C5D15]'
                      : 'bg-[#629960] text-white'
                  }
                >
                  {page.status === 'published' ? 'Publicado' : 'Borrador'}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1C5D15] text-[#1C5D15]"
                  onClick={() => handleEditPage(page)}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Editar Contenido
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white">
        <h3 className="text-2xl mb-3">💡 Editor de Contenido</h3>
        <p className="mb-4 opacity-90">
          Desde aquí podrás editar el contenido de cada sección de las páginas. Cada página tiene
          múltiples secciones que puedes personalizar en español e inglés.
        </p>
        <ul className="list-disc list-inside space-y-2 opacity-90">
          <li>Edita títulos, subtítulos y descripciones</li>
          <li>Cambia imágenes y videos</li>
          <li>Modifica textos de botones y enlaces</li>
          <li>Gestiona el contenido en ambos idiomas</li>
          <li>Reordena y administra secciones</li>
        </ul>
      </Card>
    </div>
  );
}

function SectionEditor({
  section,
  index,
  totalSections,
  isExpanded,
  onToggleExpanded,
  onUpdate,
  onUpdateContent,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSaveSection,
  ecosystemRefs,
}: {
  section: Section;
  index: number;
  totalSections: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onUpdate: (updates: Partial<Section>) => void;
  onUpdateContent: (field: string, value: any) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSaveSection: (section: Section) => void;
  ecosystemRefs?: React.MutableRefObject<Record<string, { save: () => Promise<void> }>>;
}) {
  const sectionTypes = [
    { value: 'hero', label: 'Hero (Banner Principal)' },
    { value: 'text', label: 'Texto' },
    { value: 'features', label: 'Características' },
    { value: 'products', label: 'Productos' },
    { value: 'team', label: 'Equipo' },
    { value: 'timeline', label: 'Línea de Tiempo' },
    { value: 'contact', label: 'Contacto' },
    { value: 'custom', label: 'Personalizado' },
    { value: 'trust', label: 'Confianza' },
    { value: 'featured', label: 'Destacado' },
    { value: 'ecosystem', label: 'Ecosistema' },
    { value: 'news', label: 'Noticias Destacadas' },
  ];

  const handleSaveSection = async () => {
    try {
      await onSaveSection(section);
      toast.success('Sección guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la sección');
    }
  };

  return (
    <Card className={`p-6 bg-white border-2 ${section.visible ? 'border-[#629960]/20' : 'border-gray-300'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="p-0 h-8 w-8"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
          <div>
            <h3 className="text-lg text-[#1C5D15]">
              Sección {index + 1}: {sectionTypes.find(t => t.value === section.type)?.label}
            </h3>
            <p className="text-sm text-[#629960]">ID: {section.id}</p>
          </div>
          <Badge className={section.visible ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-400 text-white'}>
            {section.visible ? 'Visible' : 'Oculta'}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ visible: !section.visible })}
            className="border-[#629960] text-[#629960]"
          >
            {section.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={index === 0}
            className="border-[#1C5D15] text-[#1C5D15]"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="border-[#1C5D15] text-[#1C5D15]"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSection}
            className="border-[#19FF00] text-[#1C5D15]"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#1C5D15]">Tipo de Sección</Label>
              <select
                value={section.type}
                onChange={(e) => onUpdate({ type: e.target.value as Section['type'] })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-[#1C5D15]">Orden</Label>
              <Input
                type="number"
                value={section.order}
                onChange={(e) => onUpdate({ order: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Campos de contenido según el tipo */}
          <div className="space-y-4">
            <h4 className="text-md text-[#1C5D15] font-semibold">Contenido</h4>
            
            {/* Campos comunes a múltiples secciones */}
            {(section.type === 'hero' || section.type === 'text' || section.type === 'features' || 
              section.type === 'team' || section.type === 'products' || section.type === 'featured' ||
              section.type === 'trust') && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Título (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.title || ''}
                      onChange={(e) => {
                        onUpdateContent('title', e.target.value);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Título (English)</Label>
                    <Input
                      type="text"
                      value={(section as any).contentEN?.title || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        onUpdate({
                          contentEN: {
                            ...currentContentEN,
                            title: e.target.value
                          }
                        } as any);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>

                {(section.type === 'hero' || section.type === 'text') && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#1C5D15]">
                        {section.type === 'hero' ? 'Subtítulo' : 'Texto'} (Español)
                      </Label>
                      <textarea
                        value={section.content.subtitle || section.content.text || ''}
                        onChange={(e) => onUpdateContent(section.type === 'hero' ? 'subtitle' : 'text', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-[#1C5D15]">
                        {section.type === 'hero' ? 'Subtítulo' : 'Texto'} (English)
                      </Label>
                      <textarea
                        value={(section as any).contentEN?.subtitle || (section as any).contentEN?.text || ''}
                        onChange={(e) => {
                          const currentContentEN = (section as any).contentEN || {};
                          onUpdate({
                            contentEN: {
                              ...currentContentEN,
                              [section.type === 'hero' ? 'subtitle' : 'text']: e.target.value
                            }
                          } as any);
                        }}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {section.type === 'hero' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#1C5D15]">Texto del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaText || ''}
                          onChange={(e) => onUpdateContent('ctaText', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15]">Texto del Botón (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.ctaText || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            onUpdate({
                              contentEN: {
                                ...currentContentEN,
                                ctaText: e.target.value
                              }
                            } as any);
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#1C5D15]">Enlace del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaLink || ''}
                          onChange={(e) => onUpdateContent('ctaLink', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15]">Enlace del Botón (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.ctaLink || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            (section as any).contentEN = {
                              ...currentContentEN,
                              ctaLink: e.target.value
                            };
                            onUpdate(section);
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#1C5D15]">Imagen de Fondo</Label>
                      <ImageUpload
                        currentImage={section.content.backgroundImage}
                        onImageUpload={(url) => onUpdateContent('backgroundImage', url)}
                        type="banner"
                      />
                    </div>
                  </>
                )}

                {/* Campos de imágenes para otras secciones */}
                {section.type === 'featured' && (
                  <div>
                    <Label className="text-[#1C5D15]">Imagen del Producto</Label>
                    <ImageUpload
                      currentImage={section.content.productImage}
                      onImageUpload={(url) => onUpdateContent('productImage', url)}
                      type="banner"
                    />
                  </div>
                )}

                {section.type === 'team' && (
                  <div>
                    <Label className="text-[#1C5D15]">Miembros del Equipo</Label>
                    {section.content.members && section.content.members.length > 0 ? (
                      (section.content.members as any[]).map((member: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Nombre</Label>
                              <Input
                                type="text"
                                value={member.name || ''}
                                onChange={(e) => {
                                  const newMembers = [...section.content.members];
                                  newMembers[idx].name = e.target.value;
                                  onUpdateContent('members', newMembers);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Rol</Label>
                              <Input
                                type="text"
                                value={member.role || ''}
                                onChange={(e) => {
                                  const newMembers = [...section.content.members];
                                  newMembers[idx].role = e.target.value;
                                  onUpdateContent('members', newMembers);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">LinkedIn URL</Label>
                              <Input
                                type="text"
                                value={member.linkedin || ''}
                                onChange={(e) => {
                                  const newMembers = [...section.content.members];
                                  newMembers[idx].linkedin = e.target.value;
                                  onUpdateContent('members', newMembers);
                                }}
                                className="mt-1"
                                placeholder="https://linkedin.com/in/..."
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Imagen</Label>
                            <ImageUpload
                              currentImage={member.image}
                              onImageUpload={(url) => {
                                const newMembers = [...section.content.members];
                                newMembers[idx].image = url;
                                onUpdateContent('members', newMembers);
                              }}
                              type="avatar"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              const newMembers = section.content.members.filter((_: any, i: number) => i !== idx);
                              onUpdateContent('members', newMembers);
                            }}
                          >
                            Eliminar Miembro
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm mb-4">
                        No hay miembros del equipo definidos
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMembers = [...(section.content.members || [])];
                        newMembers.push({ name: '', role: '', image: '', linkedin: '' });
                        onUpdateContent('members', newMembers);
                      }}
                      className="mt-2 border-[#1C5D15] text-[#1C5D15]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Miembro
                    </Button>
                  </div>
                )}

                {section.type === 'products' && (
                  <div>
                    <Label className="text-[#1C5D15]">Productos</Label>
                    {section.content.products && section.content.products.length > 0 ? (
                      (section.content.products as any[]).map((product: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Nombre</Label>
                              <Input
                                type="text"
                                value={product.name || ''}
                                onChange={(e) => {
                                  const newProducts = [...section.content.products];
                                  newProducts[idx].name = e.target.value;
                                  onUpdateContent('products', newProducts);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Categoría</Label>
                              <Input
                                type="text"
                                value={product.category || ''}
                                onChange={(e) => {
                                  const newProducts = [...section.content.products];
                                  newProducts[idx].category = e.target.value;
                                  onUpdateContent('products', newProducts);
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Descripción</Label>
                            <textarea
                              value={product.description || ''}
                              onChange={(e) => {
                                const newProducts = [...section.content.products];
                                newProducts[idx].description = e.target.value;
                                onUpdateContent('products', newProducts);
                              }}
                              className="w-full mt-1 px-3 py-2 border rounded-lg"
                              rows={2}
                            />
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Imagen</Label>
                            <ImageUpload
                              currentImage={product.image}
                              onImageUpload={(url) => {
                                const newProducts = [...section.content.products];
                                newProducts[idx].image = url;
                                onUpdateContent('products', newProducts);
                              }}
                              type="banner"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay productos definidos
                      </div>
                    )}
                  </div>
                )}

                {section.type === 'trust' && (
                  <div>
                    <Label className="text-[#1C5D15]">Logos de Aliados</Label>
                    {section.content.partners && section.content.partners.length > 0 ? (
                      (section.content.partners as any[]).map((partner: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4 relative group/partner">
                          <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover/partner:opacity-100 transition-opacity z-10">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newPartnersES = section.content.partners.filter((_: any, i: number) => i !== idx);
                                const currentContentEN = (section as any).contentEN || {};
                                const newPartnersEN = (currentContentEN.partners || []).filter((_: any, i: number) => i !== idx);
                                onUpdate({
                                  content: { ...section.content, partners: newPartnersES },
                                  contentEN: { ...currentContentEN, partners: newPartnersEN }
                                } as any);
                              }}
                              className="h-8 w-8 p-0 bg-white text-red-500 hover:text-red-700 shadow-sm border rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Nombre (Español)</Label>
                              <Input
                                type="text"
                                value={partner.name || ''}
                                onChange={(e) => {
                                  const newPartners = [...section.content.partners];
                                  newPartners[idx] = { ...newPartners[idx], name: e.target.value };
                                  onUpdateContent('partners', newPartners);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Nombre (English)</Label>
                              <Input
                                type="text"
                                value={(section as any).contentEN?.partners?.[idx]?.name || ''}
                                onChange={(e) => {
                                    const currentContentEN = (section as any).contentEN || {};
                                    const currentPartnersEN = [...(currentContentEN.partners || [])];
                                    currentPartnersEN[idx] = { ...(currentPartnersEN[idx] || {}), name: e.target.value };
                                    onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                                  }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Abreviatura (Español)</Label>
                              <Input
                                type="text"
                                value={partner.placeholder || ''}
                                onChange={(e) => {
                                  const newPartners = [...section.content.partners];
                                  newPartners[idx] = { ...newPartners[idx], placeholder: e.target.value };
                                  onUpdateContent('partners', newPartners);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Abreviatura (English)</Label>
                              <Input
                                type="text"
                                value={(section as any).contentEN?.partners?.[idx]?.placeholder || ''}
                                onChange={(e) => {
                                    const currentContentEN = (section as any).contentEN || {};
                                    const currentPartnersEN = [...(currentContentEN.partners || [])];
                                    currentPartnersEN[idx] = { ...(currentPartnersEN[idx] || {}), placeholder: e.target.value };
                                    onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                                  }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Imagen</Label>
                            <ImageUpload
                              currentImage={partner.image}
                              onImageUpload={(url) => {
                                const newPartners = [...section.content.partners];
                                newPartners[idx] = { ...newPartners[idx], image: url };
                                onUpdateContent('partners', newPartners);
                              }}
                              type="avatar"
                            />
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Enlace (URL)</Label>
                            <Input
                              type="text"
                              value={partner.link || ''}
                              onChange={(e) => {
                                const newPartners = [...section.content.partners];
                                newPartners[idx] = { ...newPartners[idx], link: e.target.value };
                                onUpdateContent('partners', newPartners);
                              }}
                              placeholder="https://ejemplo.com"
                              className="mt-1"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Descripción (Español)</Label>
                              <textarea
                                value={partner.description || ''}
                                onChange={(e) => {
                                  const newPartners = [...section.content.partners];
                                  newPartners[idx] = { ...newPartners[idx], description: e.target.value };
                                  onUpdateContent('partners', newPartners);
                                }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                                rows={3}
                                placeholder="Breve descripción de la organización..."
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Descripción (English)</Label>
                              <textarea
                                value={(section as any).contentEN?.partners?.[idx]?.description || ''}
                                onChange={(e) => {
                                    const currentContentEN = (section as any).contentEN || {};
                                    const currentPartnersEN = [...(currentContentEN.partners || [])];
                                    currentPartnersEN[idx] = { ...(currentPartnersEN[idx] || {}), description: e.target.value };
                                    onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                                  }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                                rows={3}
                                placeholder="Short organization description..."
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <Label className="text-[#1C5D15] mb-2 block">Detalles Importantes (Bloques de Traducción)</Label>
                            <div className="space-y-4 border-l-2 border-[#19FF00]/30 pl-4 py-2">
                              {(() => {
                                const esDetails = partner.details || [];
                                const enDetails = (section as any).contentEN?.partners?.[idx]?.details || [];
                                const maxLen = Math.max(esDetails.length, enDetails.length);
                                
                                return Array.from({ length: maxLen }).map((_, dIdx) => (
                                  <div key={dIdx} className="bg-white/50 p-3 rounded-lg border border-[#1C5D15]/10 space-y-3 relative group">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedPartnersES = [...section.content.partners];
                                        updatedPartnersES[idx] = {
                                          ...updatedPartnersES[idx],
                                          details: (updatedPartnersES[idx].details || []).filter((_: any, i: number) => i !== dIdx)
                                        };

                                        const currentContentEN = (section as any).contentEN || {};
                                        const updatedPartnersEN = [...(currentContentEN.partners || [])];
                                        if (updatedPartnersEN[idx]) {
                                          updatedPartnersEN[idx] = {
                                            ...updatedPartnersEN[idx],
                                            details: (updatedPartnersEN[idx].details || []).filter((_: any, i: number) => i !== dIdx)
                                          };
                                        }

                                        onUpdate({
                                          content: { ...section.content, partners: updatedPartnersES },
                                          contentEN: { ...currentContentEN, partners: updatedPartnersEN }
                                        } as any);
                                      }}
                                      className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 h-8 w-8 p-0 bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-[#629960]">Detalle (Español)</Label>
                                        <Input
                                          value={esDetails[dIdx] || ''}
                                          onChange={(e) => {
                                            const newPartners = [...section.content.partners];
                                            const newDetails = [...(newPartners[idx].details || [])];
                                            newDetails[dIdx] = e.target.value;
                                            newPartners[idx] = { ...newPartners[idx], details: newDetails };
                                            onUpdateContent('partners', newPartners);
                                          }}
                                          className="text-sm h-9 border-[#1C5D15]/20 focus:border-[#19FF00]"
                                          placeholder="Ej: Aliado estratégico"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-[#629960]">Detail (English)</Label>
                                        <Input
                                          value={enDetails[dIdx] || ''}
                                          onChange={(e) => {
                                            const currentContentEN = (section as any).contentEN || {};
                                            const currentPartnersEN = [...(currentContentEN.partners || [])];
                                            if (!currentPartnersEN[idx]) currentPartnersEN[idx] = {};
                                            const newDetailsEN = [...(currentPartnersEN[idx].details || [])];
                                            newDetailsEN[dIdx] = e.target.value;
                                            currentPartnersEN[idx] = { ...currentPartnersEN[idx], details: newDetailsEN };
                                            onUpdate({ contentEN: { ...currentContentEN, partners: currentPartnersEN } } as any);
                                          }}
                                          className="text-sm h-9 border-[#1C5D15]/20 focus:border-[#19FF00]"
                                          placeholder="Ex: Strategic partner"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedPartnersES = [...section.content.partners];
                                  const currentDetailsES = [...(updatedPartnersES[idx].details || [])];
                                  currentDetailsES.push("");
                                  updatedPartnersES[idx] = { ...updatedPartnersES[idx], details: currentDetailsES };

                                  const currentContentEN = (section as any).contentEN || {};
                                  const updatedPartnersEN = [...(currentContentEN.partners || [])];
                                  if (!updatedPartnersEN[idx]) updatedPartnersEN[idx] = { details: [] };
                                  const currentDetailsEN = [...(updatedPartnersEN[idx].details || [])];
                                  currentDetailsEN.push("");
                                  updatedPartnersEN[idx] = { ...updatedPartnersEN[idx], details: currentDetailsEN };

                                  onUpdate({
                                    content: { ...section.content, partners: updatedPartnersES },
                                    contentEN: { ...currentContentEN, partners: updatedPartnersEN }
                                  } as any);
                                }}
                                className="mt-2 w-full py-6 border-dashed border-2 border-[#1C5D15]/20 text-[#1C5D15] hover:bg-[#19FF00]/5 hover:border-[#19FF00] transition-all"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Añadir Nuevo Bloque de Detalle (ES / EN)
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay aliados definidos
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newPartner = { name: "", image: "", link: "", details: [], description: "" };
                        const updatedPartnersES = [...(section.content.partners || []), newPartner];
                        
                        const currentContentEN = (section as any).contentEN || {};
                        const updatedPartnersEN = [...(currentContentEN.partners || []), { ...newPartner }];
                        
                        onUpdate({
                          content: { ...section.content, partners: updatedPartnersES },
                           contentEN: { ...currentContentEN, partners: updatedPartnersEN }
                        } as any);
                      }}
                      className="w-full mt-4 py-8 border-dashed border-2 border-[#1C5D15]/30 text-[#1C5D15] hover:bg-[#1C5D15]/5 hover:border-[#1C5D15] transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Añadir Nuevo Aliado / Logo
                    </Button>

                  </div>
                )}

                {section.type === 'featured' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#1C5D15]">Nombre del Producto (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.productName || ''}
                          onChange={(e) => onUpdateContent('productName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15]">Nombre del Producto (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.productName || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            onUpdate({
                              contentEN: {
                                ...currentContentEN,
                                productName: e.target.value
                              }
                            } as any);
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#1C5D15]">Descripción del Producto (Español)</Label>
                        <textarea
                          value={section.content.productDescription || ''}
                          onChange={(e) => onUpdateContent('productDescription', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15]">Descripción del Producto (English)</Label>
                        <textarea
                          value={(section as any).contentEN?.productDescription || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            onUpdate({
                              contentEN: {
                                ...currentContentEN,
                                productDescription: e.target.value
                              }
                            } as any);
                          }}
                          className="w-full mt-1 px-3 py-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#1C5D15]">Imagen del Producto</Label>
                      <ImageUpload
                        currentImage={section.content.productImage}
                        onImageUpload={(url) => onUpdateContent('productImage', url)}
                        type="banner"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#1C5D15]">Texto del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaText || ''}
                          onChange={(e) => onUpdateContent('ctaText', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15]">Texto del Botón (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.ctaText || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            (section as any).contentEN = {
                              ...currentContentEN,
                              ctaText: e.target.value
                            };
                            onUpdate(section);
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#1C5D15]">Enlace del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaLink || ''}
                          onChange={(e) => onUpdateContent('ctaLink', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15]">Enlace del Botón (English)</Label>
                        <Input
                          type="text"
                          value={(section as any).contentEN?.ctaLink || ''}
                          onChange={(e) => {
                            const currentContentEN = (section as any).contentEN || {};
                            (section as any).contentEN = {
                              ...currentContentEN,
                              ctaLink: e.target.value
                            };
                            onUpdate(section);
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#1C5D15]">Características del Producto</Label>
                      {section.content.features && section.content.features.length > 0 ? (
                        (section.content.features as any[]).map((feature: any, idx: number) => (
                          <div key={idx} className="border p-4 rounded-lg mb-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#1C5D15]">Icono</Label>
                                <Input
                                  type="text"
                                  value={feature.icon || ''}
                                  onChange={(e) => {
                                    const newFeatures = [...section.content.features];
                                    newFeatures[idx].icon = e.target.value;
                                    onUpdateContent('features', newFeatures);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-[#1C5D15]">Título (Español)</Label>
                                <Input
                                  type="text"
                                  value={feature.title || ''}
                                  onChange={(e) => {
                                    const newFeatures = [...section.content.features];
                                    newFeatures[idx].title = e.target.value;
                                    onUpdateContent('features', newFeatures);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label className="text-[#1C5D15]">Título (English)</Label>
                                <Input
                                  type="text"
                                  value={(section as any).contentEN?.features?.[idx]?.title || ''}
                                  onChange={(e) => {
                                    const currentContentEN = (section as any).contentEN || {};
                                    const currentFeaturesEN = currentContentEN.features || [];
                                    if (!currentFeaturesEN[idx]) {
                                      currentFeaturesEN[idx] = {};
                                    }
                                    currentFeaturesEN[idx].title = e.target.value;
                                    (section as any).contentEN = {
                                      ...currentContentEN,
                                      features: currentFeaturesEN
                                    };
                                    onUpdate(section);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label className="text-[#1C5D15]">Descripción (Español)</Label>
                                <textarea
                                  value={feature.description || ''}
                                  onChange={(e) => {
                                    const newFeatures = [...section.content.features];
                                    newFeatures[idx].description = e.target.value;
                                    onUpdateContent('features', newFeatures);
                                  }}
                                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label className="text-[#1C5D15]">Descripción (English)</Label>
                                <textarea
                                  value={(section as any).contentEN?.features?.[idx]?.description || ''}
                                  onChange={(e) => {
                                    const currentContentEN = (section as any).contentEN || {};
                                    const currentFeaturesEN = currentContentEN.features || [];
                                    if (!currentFeaturesEN[idx]) {
                                      currentFeaturesEN[idx] = {};
                                    }
                                    currentFeaturesEN[idx].description = e.target.value;
                                    (section as any).contentEN = {
                                      ...currentContentEN,
                                      features: currentFeaturesEN
                                    };
                                    onUpdate(section);
                                  }}
                                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[#629960] text-sm">
                          No hay características definidas
                        </div>
                      )}
                    </div>
                  </>
                )}

                {section.type === 'features' && (
                  <div>
                    <Label className="text-[#1C5D15]">Items de Características</Label>
                    {section.content.items && section.content.items.length > 0 ? (
                      (section.content.items as any[]).map((item: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Icono</Label>
                              <Input
                                type="text"
                                value={item.icon || ''}
                                onChange={(e) => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].icon = e.target.value;
                                  onUpdateContent('items', newItems);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Imagen</Label>
                              <ImageUpload
                                currentImage={item.image}
                                onImageUpload={(url) => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].image = url;
                                  onUpdateContent('items', newItems);
                                }}
                                type="avatar"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Título (Español)</Label>
                              <Input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].title = e.target.value;
                                  onUpdateContent('items', newItems);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Título (English)</Label>
                              <Input
                                type="text"
                                value={(section as any).contentEN?.items?.[idx]?.title || ''}
                                onChange={(e) => {
                                  const currentContentEN = (section as any).contentEN || {};
                                  const currentItemsEN = currentContentEN.items || [];
                                  if (!currentItemsEN[idx]) {
                                    currentItemsEN[idx] = {};
                                  }
                                  currentItemsEN[idx].title = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    items: currentItemsEN
                                  };
                                  onUpdate(section);
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Descripción (Español)</Label>
                              <textarea
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...section.content.items];
                                  newItems[idx].description = e.target.value;
                                  onUpdateContent('items', newItems);
                                }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Descripción (English)</Label>
                              <textarea
                                value={(section as any).contentEN?.items?.[idx]?.description || ''}
                                onChange={(e) => {
                                  const currentContentEN = (section as any).contentEN || {};
                                  const currentItemsEN = currentContentEN.items || [];
                                  if (!currentItemsEN[idx]) {
                                    currentItemsEN[idx] = {};
                                  }
                                  currentItemsEN[idx].description = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    items: currentItemsEN
                                  };
                                  onUpdate(section);
                                }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                                rows={2}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Detalles (Español)</Label>
                            {item.details && item.details.length > 0 ? (
                              item.details.map((detail: string, detailIdx: number) => (
                                <div key={detailIdx} className="flex gap-2 mt-2">
                                  <Input
                                    type="text"
                                    value={detail || ''}
                                    onChange={(e) => {
                                      const newItems = [...section.content.items];
                                      newItems[idx].details[detailIdx] = e.target.value;
                                      onUpdateContent('items', newItems);
                                    }}
                                    className="flex-1"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="text-[#629960] text-sm">
                                No hay detalles definidos
                              </div>
                            )}
                          </div>
                          <div className="mt-4">
                            <Label className="text-[#1C5D15]">Detalles (English)</Label>
                            {((section as any).contentEN?.items?.[idx]?.details) && (section as any).contentEN.items[idx].details.length > 0 ? (
                              (section as any).contentEN.items[idx].details.map((detail: string, detailIdx: number) => (
                                <div key={detailIdx} className="flex gap-2 mt-2">
                                  <Input
                                    type="text"
                                    value={detail || ''}
                                    onChange={(e) => {
                                      const currentContentEN = (section as any).contentEN || {};
                                      const currentItemsEN = currentContentEN.items || [];
                                      if (!currentItemsEN[idx]) {
                                        currentItemsEN[idx] = {};
                                      }
                                      if (!currentItemsEN[idx].details) {
                                        currentItemsEN[idx].details = [];
                                      }
                                      currentItemsEN[idx].details[detailIdx] = e.target.value;
                                      (section as any).contentEN = {
                                        ...currentContentEN,
                                        items: currentItemsEN
                                      };
                                      onUpdate(section);
                                    }}
                                    className="flex-1"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="text-[#629960] text-sm">
                                No hay detalles definidos
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay items de características definidos
                      </div>
                    )}
                  </div>
                )}

                {/* Campos de SEO */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-semibold text-[#1C5D15] mb-3">SEO - Meta Tags</h5>
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Título Meta</Label>
                    <Input
                      type="text"
                      value={section.content.seo?.metaTitle || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaTitle: e.target.value
                        });
                      }}
                      className="mt-1 text-sm"
                      placeholder="Título para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-[#1C5D15] text-sm">Descripción Meta</Label>
                    <textarea
                      value={section.content.seo?.metaDescription || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaDescription: e.target.value
                        });
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                      rows={2}
                      placeholder="Descripción para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-[#1C5D15] text-sm">Palabras Clave</Label>
                    <Input
                      type="text"
                      value={section.content.seo?.metaKeywords || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaKeywords: e.target.value
                        });
                      }}
                      className="mt-1 text-sm"
                      placeholder="palabra1, palabra2, palabra3"
                    />
                  </div>
                </div>
              </>
            )}

            {section.type === 'timeline' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Título (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.title || ''}
                      onChange={(e) => {
                        onUpdateContent('title', e.target.value);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Título (English)</Label>
                    <Input
                      type="text"
                      value={(section as any).contentEN?.title || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          title: e.target.value
                        };
                        onUpdate(section);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Subtítulo (Español)</Label>
                    <textarea
                      value={section.content.subtitle || ''}
                      onChange={(e) => onUpdateContent('subtitle', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Subtítulo (English)</Label>
                    <textarea
                      value={(section as any).contentEN?.subtitle || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          subtitle: e.target.value
                        };
                        onUpdate(section);
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                      rows={2}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[#1C5D15]">Hitos de la Línea de Tiempo</Label>
                  {section.content.milestones && section.content.milestones.length > 0 ? (
                    (section.content.milestones as any[]).map((milestone: any, idx: number) => (
                      <div key={idx} className="border p-4 rounded-lg mb-4 relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newMilestones = section.content.milestones.filter((_: any, i: number) => i !== idx);
                            onUpdateContent('milestones', newMilestones);
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[#1C5D15]">Fase (Español)</Label>
                            <Input
                              type="text"
                              value={milestone.phase || ''}
                              onChange={(e) => {
                                const newMilestones = [...section.content.milestones];
                                newMilestones[idx].phase = e.target.value;
                                onUpdateContent('milestones', newMilestones);
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[#1C5D15]">Fase (English)</Label>
                            <Input
                              type="text"
                              value={(section as any).contentEN?.milestones?.[idx]?.phase || ''}
                              onChange={(e) => {
                                const currentContentEN = (section as any).contentEN || {};
                                const currentMilestonesEN = currentContentEN.milestones || [];
                                if (!currentMilestonesEN[idx]) {
                                  currentMilestonesEN[idx] = {};
                                }
                                currentMilestonesEN[idx].phase = e.target.value;
                                (section as any).contentEN = {
                                  ...currentContentEN,
                                  milestones: currentMilestonesEN
                                };
                                onUpdate(section);
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label className="text-[#1C5D15]">Tiempo (Español)</Label>
                            <Input
                              type="text"
                              value={milestone.time || ''}
                              onChange={(e) => {
                                const newMilestones = [...section.content.milestones];
                                newMilestones[idx].time = e.target.value;
                                onUpdateContent('milestones', newMilestones);
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[#1C5D15]">Tiempo (English)</Label>
                            <Input
                              type="text"
                              value={(section as any).contentEN?.milestones?.[idx]?.time || ''}
                              onChange={(e) => {
                                const currentContentEN = (section as any).contentEN || {};
                                const currentMilestonesEN = currentContentEN.milestones || [];
                                if (!currentMilestonesEN[idx]) {
                                  currentMilestonesEN[idx] = {};
                                }
                                currentMilestonesEN[idx].time = e.target.value;
                                (section as any).contentEN = {
                                  ...currentContentEN,
                                  milestones: currentMilestonesEN
                                };
                                onUpdate(section);
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[#629960] text-sm mb-4">
                      No hay hitos definidos
                    </div>
                  )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMilestones = [...(section.content.milestones || [])];
                        newMilestones.push({ phase: '', time: '' });
                        onUpdateContent('milestones', newMilestones);
                      }}
                      className="mt-2 border-[#1C5D15] text-[#1C5D15]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Hito
                    </Button>
                  </div>

                {/* Campos de SEO */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-semibold text-[#1C5D15] mb-3">SEO - Meta Tags</h5>
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Título Meta</Label>
                    <Input
                      type="text"
                      value={section.content.seo?.metaTitle || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaTitle: e.target.value
                        });
                      }}
                      className="mt-1 text-sm"
                      placeholder="Título para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-[#1C5D15] text-sm">Descripción Meta</Label>
                    <textarea
                      value={section.content.seo?.metaDescription || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaDescription: e.target.value
                        });
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                      rows={2}
                      placeholder="Descripción para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-[#1C5D15] text-sm">Palabras Clave</Label>
                    <Input
                      type="text"
                      value={section.content.seo?.metaKeywords || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaKeywords: e.target.value
                        });
                      }}
                      className="mt-1 text-sm"
                      placeholder="palabra1, palabra2, palabra3"
                    />
                  </div>
                </div>
              </>
            )}

            {section.type === 'contact' && (
              <div className="text-[#629960] text-sm">
                <p>La sección de contacto no requiere contenido adicional.</p>
                <p>Configura el tipo de sección y el orden en el formulario superior.</p>
                <p>La información de contacto se carga automáticamente desde la configuración del footer.</p>
              </div>
            )}

            {(section.type === 'ecosystem' || section.type === 'news') && (
              <div className="space-y-4">
                <p className="text-sm text-[#629960] italic">
                  Esta sección muestra contenido dinámico (Aliados o Noticias). Puedes editar el título y subtítulo aquí.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Título (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.title || ''}
                      onChange={(e) => onUpdateContent('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Título (English)</Label>
                    <Input
                      type="text"
                      value={(section as any).contentEN?.title || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          title: e.target.value
                        };
                        onUpdate(section);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Subtítulo (Español)</Label>
                    <textarea
                      value={section.content.subtitle || ''}
                      onChange={(e) => onUpdateContent('subtitle', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Subtítulo (English)</Label>
                    <textarea
                      value={(section as any).contentEN?.subtitle || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          subtitle: e.target.value
                        };
                        onUpdate(section);
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Editor de Items para Ecosistema */}
                <div className="mt-6">
                  <Label className="text-[#1C5D15] font-bold">Items Destacados del Ecosistema</Label>
                  <div className="space-y-4 mt-2">
                    {(section.content.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="border p-4 rounded-lg bg-gray-50/50">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[#1C5D15]">Título (Español)</Label>
                            <Input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const newItems = [...(section.content.items || [])];
                                newItems[idx].title = e.target.value;
                                onUpdateContent('items', newItems);
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[#1C5D15]">Título (English)</Label>
                            <Input
                              type="text"
                              value={(section as any).contentEN?.items?.[idx]?.title || ''}
                              onChange={(e) => {
                                const currentContentEN = (section as any).contentEN || {};
                                const currentItemsEN = [...(currentContentEN.items || [])];
                                if (!currentItemsEN[idx]) currentItemsEN[idx] = {};
                                currentItemsEN[idx].title = e.target.value;
                                (section as any).contentEN = { ...currentContentEN, items: currentItemsEN };
                                onUpdate(section);
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className="text-[#1C5D15]">Descripción (Español)</Label>
                            <textarea
                              value={item.description || ''}
                              onChange={(e) => {
                                const newItems = [...(section.content.items || [])];
                                newItems[idx].description = e.target.value;
                                onUpdateContent('items', newItems);
                              }}
                              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label className="text-[#1C5D15]">Descripción (English)</Label>
                            <textarea
                              value={(section as any).contentEN?.items?.[idx]?.description || ''}
                              onChange={(e) => {
                                const currentContentEN = (section as any).contentEN || {};
                                const currentItemsEN = [...(currentContentEN.items || [])];
                                if (!currentItemsEN[idx]) currentItemsEN[idx] = {};
                                currentItemsEN[idx].description = e.target.value;
                                (section as any).contentEN = { ...currentContentEN, items: currentItemsEN };
                                onUpdate(section);
                              }}
                              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label className="text-[#1C5D15 text-xs]">SVG Icon Path (Opcional)</Label>
                          <Input
                            type="text"
                            value={item.iconPath || ''}
                            onChange={(e) => {
                              const newItems = [...(section.content.items || [])];
                              newItems[idx].iconPath = e.target.value;
                              onUpdateContent('items', newItems);
                            }}
                            className="mt-1 text-xs"
                            placeholder="M13 10V3L4 14..."
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = (section.content.items || []).filter((_: any, i: number) => i !== idx);
                            onUpdateContent('items', newItems);
                          }}
                          className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar Item
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItems = [...(section.content.items || [])];
                        newItems.push({ title: '', description: '', iconPath: '' });
                        onUpdateContent('items', newItems);
                      }}
                      className="w-full border-dashed border-[#1C5D15] text-[#1C5D15] hover:bg-[#1C5D15]/5"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Agregar Item Destacado
                    </Button>
                  </div>
                </div>

                {section.type === 'ecosystem' && ecosystemRefs && (
                  <div className="mt-8 pt-8 border-t border-[#1C5D15]/20">
                    <AdminEcosystem 
                      ref={(el: any) => {
                        if (el) ecosystemRefs.current[section.id] = el;
                      }} 
                    />
                  </div>
                )}
              </div>
            )}

            {section.type === 'custom' && (
              <div>
                <Label className="text-[#1C5D15]">Contenido Personalizado (JSON)</Label>
                <textarea
                  value={JSON.stringify(section.content, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      onUpdate({ content: parsed });
                    } catch (err) {
                      // Ignorar errores de parsing mientras se escribe
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-lg font-mono text-sm"
                  rows={8}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}