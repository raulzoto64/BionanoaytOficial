import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  FileText, 
  Globe, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Page, 
  PageContent, 
  Section, 
  supabaseAPI 
} from '../../data/supabase';
import { ImageUpload } from '../../components/ImageUpload';

interface PageWithContent extends Page {
  contentES: PageContent | null;
  contentEN: PageContent | null;
}

export function AdminContent() {
  const [pagesData, setPagesData] = useState<PageWithContent[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<'es' | 'en'>('es');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

      toast.success('Contenido guardado exitosamente en ambos idiomas');
      setEditingPage(null);
      setSections([]);
      loadPages();
    } catch (error) {
      toast.error('Error al guardar el contenido');
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
      subtitle: '', // Agrega esto por si acaso
      ctaText: '',
      ctaLink: '',
      backgroundImage: ''
    },
  };
  setSections([...sections, newSection]);
};


  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    setSections(newSections);
  };

  const updateSectionContent = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      content: {
        ...newSections[index].content,
        [field]: value,
      },
    };
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections[index - 1].order = index;
    newSections[index].order = index + 1;
    setSections(newSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections[index].order = index + 1;
    newSections[index + 1].order = index + 2;
    setSections(newSections);
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

  const handleSaveSection = async (section: Section) => {
    if (!editingPage) return;

    try {
      // Separar contenido para español y inglés
      const sectionES = {
        ...section,
        content: section.content // Contenido en español
      };

      const sectionEN = {
        ...section,
        content: (section as any).contentEN || {} // Contenido en inglés
      };

      // Obtener contenido actual de la página
      const contentES = await supabaseAPI.getPageContent(editingPage.id, 'es');
      const contentEN = await supabaseAPI.getPageContent(editingPage.id, 'en');

      // Actualizar la sección específica en español
      const updatedSectionsES = contentES.sections.map(sec => 
        sec.id === section.id ? sectionES : sec
      );
      if (!updatedSectionsES.some(sec => sec.id === section.id)) {
        updatedSectionsES.push(sectionES);
      }

      // Actualizar la sección específica en inglés
      const updatedSectionsEN = contentEN.sections.map(sec => 
        sec.id === section.id ? sectionEN : sec
      );
      if (!updatedSectionsEN.some(sec => sec.id === section.id)) {
        updatedSectionsEN.push(sectionEN);
      }

      // Guardar cambios
      await Promise.all([
        supabaseAPI.updatePageContent(editingPage.id, 'es', updatedSectionsES),
        supabaseAPI.updatePageContent(editingPage.id, 'en', updatedSectionsEN)
      ]);

      // Actualizar datos locales
      loadPages();
    } catch (error) {
      console.error('Error al guardar la sección:', error);
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
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-[#1C5D15] mb-2">
              Editar: {editingPage.slug} ({editingLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'})
            </h2>
            <p className="text-[#629960]">
              Gestiona las secciones de la página
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>

        {/* Botón agregar sección */}
        <Button
          onClick={addSection}
          className="mb-6 bg-[#629960] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
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
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // Vista de lista de páginas
  return (
    <div>
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

// Componente Editor de Sección
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
    { value: 'ecosystem', label: 'Ecosistema' },
    { value: 'featured', label: 'Destacado' },
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
              section.type === 'trust' || section.type === 'ecosystem' || section.type === 'timeline') && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Título (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.title || ''}
                      onChange={(e) => {
                        const currentContent = section.content || {};
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
                          (section as any).contentEN = {
                            ...currentContentEN,
                            [section.type === 'hero' ? 'subtitle' : 'text']: e.target.value
                          };
                          onUpdate(section);
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
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay miembros del equipo definidos
                      </div>
                    )}
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
                    <Label className="text-[#1C5D15]">Aliados</Label>
                    {section.content.partners && section.content.partners.length > 0 ? (
                      (section.content.partners as any[]).map((partner: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Nombre (Español)</Label>
                              <Input
                                type="text"
                                value={partner.name || ''}
                                onChange={(e) => {
                                  const newPartners = [...section.content.partners];
                                  newPartners[idx].name = e.target.value;
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
                                  const currentPartnersEN = currentContentEN.partners || [];
                                  if (!currentPartnersEN[idx]) {
                                    currentPartnersEN[idx] = {};
                                  }
                                  currentPartnersEN[idx].name = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    partners: currentPartnersEN
                                  };
                                  onUpdate(section);
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
                                  newPartners[idx].placeholder = e.target.value;
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
                                  const currentPartnersEN = currentContentEN.partners || [];
                                  if (!currentPartnersEN[idx]) {
                                    currentPartnersEN[idx] = {};
                                  }
                                  currentPartnersEN[idx].placeholder = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    partners: currentPartnersEN
                                  };
                                  onUpdate(section);
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
                                newPartners[idx].image = url;
                                onUpdateContent('partners', newPartners);
                              }}
                              type="avatar"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay aliados definidos
                      </div>
                    )}
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
                            (section as any).contentEN = {
                              ...currentContentEN,
                              productName: e.target.value
                            };
                            onUpdate(section);
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
                            (section as any).contentEN = {
                              ...currentContentEN,
                              productDescription: e.target.value
                            };
                            onUpdate(section);
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
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
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
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay items de características definidos
                      </div>
                    )}
                  </div>
                )}

                {section.type === 'ecosystem' && (
                  <div>
                    <Label className="text-[#1C5D15]">Ecosistema de Aliados</Label>
                    {section.content.allies && section.content.allies.length > 0 ? (
                      (section.content.allies as any[]).map((ally: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Nombre (Español)</Label>
                              <Input
                                type="text"
                                value={ally.name || ''}
                                onChange={(e) => {
                                  const newAllies = [...section.content.allies];
                                  newAllies[idx].name = e.target.value;
                                  onUpdateContent('allies', newAllies);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Nombre (English)</Label>
                              <Input
                                type="text"
                                value={(section as any).contentEN?.allies?.[idx]?.name || ''}
                                onChange={(e) => {
                                  const currentContentEN = (section as any).contentEN || {};
                                  const currentAlliesEN = currentContentEN.allies || [];
                                  if (!currentAlliesEN[idx]) {
                                    currentAlliesEN[idx] = {};
                                  }
                                  currentAlliesEN[idx].name = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    allies: currentAlliesEN
                                  };
                                  onUpdate(section);
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Sector (Español)</Label>
                              <Input
                                type="text"
                                value={ally.sector || ''}
                                onChange={(e) => {
                                  const newAllies = [...section.content.allies];
                                  newAllies[idx].sector = e.target.value;
                                  onUpdateContent('allies', newAllies);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Sector (English)</Label>
                              <Input
                                type="text"
                                value={(section as any).contentEN?.allies?.[idx]?.sector || ''}
                                onChange={(e) => {
                                  const currentContentEN = (section as any).contentEN || {};
                                  const currentAlliesEN = currentContentEN.allies || [];
                                  if (!currentAlliesEN[idx]) {
                                    currentAlliesEN[idx] = {};
                                  }
                                  currentAlliesEN[idx].sector = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    allies: currentAlliesEN
                                  };
                                  onUpdate(section);
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Iniciales</Label>
                              <Input
                                type="text"
                                value={ally.initials || ''}
                                onChange={(e) => {
                                  const newAllies = [...section.content.allies];
                                  newAllies[idx].initials = e.target.value;
                                  onUpdateContent('allies', newAllies);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Imagen</Label>
                              <ImageUpload
                                currentImage={ally.image}
                                onImageUpload={(url) => {
                                  const newAllies = [...section.content.allies];
                                  newAllies[idx].image = url;
                                  onUpdateContent('allies', newAllies);
                                }}
                                type="avatar"
                                userId={`ally_${idx}_${ally.name || 'unknown'}`}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay aliados definidos
                      </div>
                    )}
                  </div>
                )}

                {section.type === 'timeline' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-[#1C5D15]">Momentos Clave</Label>
                      <Button
                        onClick={() => {
                          const newMilestone = {
                            year: '',
                            icon: 'Lightbulb',
                            title: '',
                            description: '',
                            step: '',
                            desc: ''
                          };
                          
                          // Actualizar la sección con el nuevo milestone en español e inglés
                          const updatedSection = {
                            ...section,
                            content: {
                              ...section.content,
                              milestones: [...(section.content.milestones || []), newMilestone]
                            },
                            contentEN: {
                              ...(section as any).contentEN || {},
                              milestones: [...((section as any).contentEN?.milestones || []), newMilestone]
                            }
                          };
                          
                          onUpdate(updatedSection as any);
                        }}
                        className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/80"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Momento
                      </Button>
                    </div>
                    {section.content.milestones && section.content.milestones.length > 0 ? (
                      (section.content.milestones as any[]).map((milestone: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="text-sm font-semibold text-[#1C5D15]">Moment {idx + 1}</h6>
                            <Button
                              onClick={() => {
                                // Eliminar el milestone en español
                                const newMilestones = section.content.milestones.filter((_: any, i: number) => i !== idx);
                                
                                // Eliminar el milestone correspondiente en inglés
                                const currentContentEN = (section as any).contentEN || {};
                                const currentMilestonesEN = currentContentEN.milestones || [];
                                const newMilestonesEN = currentMilestonesEN.filter((_: any, i: number) => i !== idx);
                                
                                // Actualizar la sección con ambos cambios
                                const updatedSection = {
                                  ...section,
                                  content: {
                                    ...section.content,
                                    milestones: newMilestones
                                  },
                                  contentEN: {
                                    ...currentContentEN,
                                    milestones: newMilestonesEN
                                  }
                                };
                                
                                onUpdate(updatedSection as any);
                              }}
                              className="bg-red-500 text-white hover:bg-red-600"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-[#1C5D15]">Año</Label>
                              <Input
                                type="text"
                                value={milestone.year || ''}
                                onChange={(e) => {
                                  const newMilestones = [...section.content.milestones];
                                  newMilestones[idx].year = e.target.value;
                                  onUpdateContent('milestones', newMilestones);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Ícono</Label>
                              <select
                                value={milestone.icon || 'Lightbulb'}
                                onChange={(e) => {
                                  const newMilestones = [...section.content.milestones];
                                  newMilestones[idx].icon = e.target.value;
                                  onUpdateContent('milestones', newMilestones);
                                }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                              >
                                <option value="Lightbulb">Idea / Innovación</option>
                                <option value="FileCheck">Logro / Certificación</option>
                                <option value="TrendingUp">Crecimiento / Expansión</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label className="text-[#1C5D15]">Título (Español)</Label>
                              <Input
                                type="text"
                                value={milestone.title || ''}
                                onChange={(e) => {
                                  const newMilestones = [...section.content.milestones];
                                  newMilestones[idx].title = e.target.value;
                                  onUpdateContent('milestones', newMilestones);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Título (English)</Label>
                              <Input
                                type="text"
                                value={(section as any).contentEN?.milestones?.[idx]?.title || ''}
                                onChange={(e) => {
                                  const currentContentEN = (section as any).contentEN || {};
                                  const currentMilestonesEN = currentContentEN.milestones || [];
                                  if (!currentMilestonesEN[idx]) {
                                    currentMilestonesEN[idx] = {};
                                  }
                                  currentMilestonesEN[idx].title = e.target.value;
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
                              <Label className="text-[#1C5D15]">Descripción (Español)</Label>
                              <textarea
                                value={milestone.description || ''}
                                onChange={(e) => {
                                  const newMilestones = [...section.content.milestones];
                                  newMilestones[idx].description = e.target.value;
                                  onUpdateContent('milestones', newMilestones);
                                }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label className="text-[#1C5D15]">Descripción (English)</Label>
                              <textarea
                                value={(section as any).contentEN?.milestones?.[idx]?.description || ''}
                                onChange={(e) => {
                                  const currentContentEN = (section as any).contentEN || {};
                                  const currentMilestonesEN = currentContentEN.milestones || [];
                                  if (!currentMilestonesEN[idx]) {
                                    currentMilestonesEN[idx] = {};
                                  }
                                  currentMilestonesEN[idx].description = e.target.value;
                                  (section as any).contentEN = {
                                    ...currentContentEN,
                                    milestones: currentMilestonesEN
                                  };
                                  onUpdate(section);
                                }}
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                                rows={2}
                              />
                            </div>
                          </div>
                          {/* Campos para la timeline de Technology page (grilla) */}
                          <div className="mt-4 pt-4 border-t">
                            <h6 className="text-sm font-semibold text-[#1C5D15] mb-3">Para Timeline de Technology</h6>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#1C5D15] text-sm">Paso</Label>
                                <Input
                                  type="text"
                                  value={milestone.step || ''}
                                  onChange={(e) => {
                                    const newMilestones = [...section.content.milestones];
                                    newMilestones[idx].step = e.target.value;
                                    onUpdateContent('milestones', newMilestones);
                                  }}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-[#1C5D15] text-sm">Descripción Corta</Label>
                                <Input
                                  type="text"
                                  value={milestone.desc || ''}
                                  onChange={(e) => {
                                    const newMilestones = [...section.content.milestones];
                                    newMilestones[idx].desc = e.target.value;
                                    onUpdateContent('milestones', newMilestones);
                                  }}
                                  className="mt-1 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[#629960] text-sm">
                        No hay momentos clave definidos
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

            {section.type === 'contact' && (
              <div>
                <Label className="text-[#1C5D15]">Información de Contacto</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1C5D15]">Teléfono (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.contactInfo?.phone || ''}
                      onChange={(e) => {
                        const currentContactInfo = section.content.contactInfo || {};
                        onUpdateContent('contactInfo', {
                          ...currentContactInfo,
                          phone: e.target.value
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Teléfono (English)</Label>
                    <Input
                      type="text"
                      value={(section as any).contentEN?.contactInfo?.phone || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        const currentContactInfoEN = currentContentEN.contactInfo || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          contactInfo: {
                            ...currentContactInfoEN,
                            phone: e.target.value
                          }
                        };
                        onUpdate(section);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-[#1C5D15]">Email (Español)</Label>
                    <Input
                      type="email"
                      value={section.content.contactInfo?.email || ''}
                      onChange={(e) => {
                        const currentContactInfo = section.content.contactInfo || {};
                        onUpdateContent('contactInfo', {
                          ...currentContactInfo,
                          email: e.target.value
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Email (English)</Label>
                    <Input
                      type="email"
                      value={(section as any).contentEN?.contactInfo?.email || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        const currentContactInfoEN = currentContentEN.contactInfo || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          contactInfo: {
                            ...currentContactInfoEN,
                            email: e.target.value
                          }
                        };
                        onUpdate(section);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-[#1C5D15]">Ubicación (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.contactInfo?.location || ''}
                      onChange={(e) => {
                        const currentContactInfo = section.content.contactInfo || {};
                        onUpdateContent('contactInfo', {
                          ...currentContactInfo,
                          location: e.target.value
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15]">Ubicación (English)</Label>
                    <Input
                      type="text"
                      value={(section as any).contentEN?.contactInfo?.location || ''}
                      onChange={(e) => {
                        const currentContentEN = (section as any).contentEN || {};
                        const currentContactInfoEN = currentContentEN.contactInfo || {};
                        (section as any).contentEN = {
                          ...currentContentEN,
                          contactInfo: {
                            ...currentContactInfoEN,
                            location: e.target.value
                          }
                        };
                        onUpdate(section);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
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