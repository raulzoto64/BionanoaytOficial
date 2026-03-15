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
import { Hero } from '../../components/Hero';
import { TrustBar } from '../../components/TrustBar';
import { Purpose } from '../../components/Purpose';
import { FeaturedProduct } from '../../components/FeaturedProduct';
import { Products } from '../../components/Products';
import { Timeline } from '../../components/Timeline';
import { Leadership } from '../../components/Leadership';
import { Ecosystem } from '../../components/Ecosystem';
import { Footer } from '../../components/Footer';

interface PageWithContent extends Page {
  contentES: PageContent | null;
  contentEN: PageContent | null;
}

export function AdminContentEditor() {
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
      const updatedSectionsES = contentES?.sections?.map(sec => 
        sec.id === section.id ? sectionES : sec
      ) || [];
      if (!updatedSectionsES.some(sec => sec.id === section.id)) {
        updatedSectionsES.push(sectionES);
      }

      // Actualizar la sección específica en inglés
      const updatedSectionsEN = contentEN?.sections?.map(sec => 
        sec.id === section.id ? sectionEN : sec
      ) || [];
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
      throw error;
    }
  };

  const renderPreview = () => {
    if (!editingPage) return null;

    return (
      <div className="h-full overflow-y-auto bg-white border-l-2 border-[#629960]/20 preview-container">
        <div className="sticky top-0 z-10 bg-white border-b border-[#629960]/20 p-4">
          <h3 className="text-xl font-semibold text-[#1C5D15] mb-2">
            Vista Previa: {editingPage.slug.replace(/-/g, ' ')}
          </h3>
          <p className="text-sm text-[#629960]">
            Idioma: {editingLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
          </p>
        </div>

        <div className="p-4">
          {sections.filter(sec => sec.visible).map((section) => {
            const content = editingLanguage === 'es' ? section.content : (section as any).contentEN;
            
            switch (section.type) {
              case 'hero':
                return (
                  <div key={section.id} className="mb-12">
                    <Hero content={content} />
                  </div>
                );
              case 'trust':
                return (
                  <div key={section.id} className="mb-12">
                    <TrustBar partners={content.partners} />
                  </div>
                );
              case 'features':
                return (
                  <div key={section.id} className="mb-12">
                    <Purpose purposes={content.items} />
                  </div>
                );
              case 'featured':
                return (
                  <div key={section.id} className="mb-12">
                    <FeaturedProduct content={content} />
                  </div>
                );
              case 'products':
                // Datos mock para el visor previo de productos
                const mockProducts = [
                  {
                    id: '1',
                    slug: 'producto-mock-1',
                    category: 'Categoría 1',
                    image: 'https://picsum.photos/seed/product1/400/300',
                    featured: true,
                    translation: {
                      product_id: '1',
                      language: editingLanguage,
                      name: 'Producto Mock 1',
                      short_description: 'Descripción corta del producto mock 1',
                      description: 'Descripción detallada del producto mock 1',
                      features: ['Característica 1', 'Característica 2', 'Característica 3'],
                      benefits: ['Beneficio 1', 'Beneficio 2'],
                      technical_specs: {},
                      meta_title: '',
                      meta_description: '',
                    }
                  },
                  {
                    id: '2',
                    slug: 'producto-mock-2',
                    category: 'Categoría 2',
                    image: 'https://picsum.photos/seed/product2/400/300',
                    featured: false,
                    translation: {
                      product_id: '2',
                      language: editingLanguage,
                      name: 'Producto Mock 2',
                      short_description: 'Descripción corta del producto mock 2',
                      description: 'Descripción detallada del producto mock 2',
                      features: ['Característica A', 'Característica B'],
                      benefits: ['Beneficio A', 'Beneficio B'],
                      technical_specs: {},
                      meta_title: '',
                      meta_description: '',
                    }
                  }
                ];
                
                return (
                  <div key={section.id} className="mb-12">
                    <Products 
                      products={mockProducts} 
                      title={content.title || 'Productos'} 
                      subtitle={content.subtitle || 'Conoce nuestra variedad de productos'} 
                    />
                  </div>
                );
              case 'timeline':
                return (
                  <div key={section.id} className="mb-12">
                    <Timeline milestones={content.milestones} />
                  </div>
                );
              case 'team':
                return (
                  <div key={section.id} className="mb-12">
                    <Leadership 
                      members={content.members} 
                      title={content.title} 
                      subtitle={content.subtitle} 
                    />
                  </div>
                );
              case 'ecosystem':
                return (
                  <div key={section.id} className="mb-12">
                    <Ecosystem />
                  </div>
                );
              case 'contact':
                return (
                  <div key={section.id} className="mb-12">
                    <Footer contactInfo={content.contactInfo} />
                  </div>
                );
              case 'text':
                return (
                  <div key={section.id} className="mb-12">
                    <div className="max-w-full mx-auto px-6 py-12 bg-white">
                      <h2 className="text-3xl font-bold text-[#1C5D15] mb-6">
                        {content.title}
                      </h2>
                      {content.subtitle && (
                        <p className="text-xl text-[#629960] mb-8">
                          {content.subtitle}
                        </p>
                      )}
                      {content.text && (
                        <div className="prose prose-green max-w-none text-[#1C5D15]">
                          <div dangerouslySetInnerHTML={{ __html: content.text }} />
                        </div>
                      )}
                      {!content.title && !content.subtitle && !content.text && (
                        <p className="text-[#629960] italic">Esta sección está vacía. Añade contenido para ver la vista previa.</p>
                      )}
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#629960]">Cargando páginas...</p>
      </div>
    );
  }

  // Vista de edición con split layout
  if (editingPage) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Editor Section (50%) */}
        <div className="w-1/2 h-full overflow-y-auto p-4 bg-[#F7F9CE]/50">
          <div className="max-w-full">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#1C5D15] mb-1">
                  Editar: {editingPage.slug} ({editingLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'})
                </h2>
                <p className="text-[#629960] text-sm">
                  Gestiona las secciones de la página
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] text-sm px-3 py-1"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="text-sm px-3 py-1">
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>

            {/* Botón agregar sección */}
            <Button
              onClick={addSection}
              className="mb-4 bg-[#629960] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] text-sm px-3 py-1"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Sección
            </Button>

            {/* Lista de secciones */}
            <div className="space-y-3">
              {sections.length === 0 ? (
                <Card className="p-8 bg-white border-2 border-[#629960]/20 text-center">
                  <FileText className="w-12 h-12 text-[#1C5D15] mx-auto mb-3" />
                  <h3 className="text-xl text-[#1C5D15] mb-2">No hay secciones</h3>
                  <p className="text-[#629960] mb-3">Agrega tu primera sección para comenzar</p>
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
        </div>

        {/* Preview Section (50%) */}
        <div className="w-1/2 h-full overflow-hidden">
          {renderPreview()}
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
    <Card className={`p-3 bg-white border-2 ${section.visible ? 'border-[#629960]/20' : 'border-gray-300'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="p-0 h-6 w-6"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <div>
            <h3 className="text-sm text-[#1C5D15]">
              Sección {index + 1}: {sectionTypes.find(t => t.value === section.type)?.label}
            </h3>
            <p className="text-xs text-[#629960]">ID: {section.id}</p>
          </div>
          <Badge className={section.visible ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-400 text-white'}>
            {section.visible ? 'Visible' : 'Oculta'}
          </Badge>
        </div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ visible: !section.visible })}
            className="border-[#629960] text-[#629960] h-6 px-2 text-xs"
          >
            {section.visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={index === 0}
            className="border-[#1C5D15] text-[#1C5D15] h-6 px-2"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="border-[#1C5D15] text-[#1C5D15] h-6 px-2"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="border-red-500 text-red-500 hover:bg-red-50 h-6 px-2"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSection}
            className="border-[#19FF00] text-[#1C5D15] h-6 px-2"
          >
            <Save className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-[#1C5D15] text-sm">Tipo de Sección</Label>
              <select
                value={section.type}
                onChange={(e) => onUpdate({ type: e.target.value as Section['type'] })}
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              >
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-[#1C5D15] text-sm">Orden</Label>
              <Input
                type="number"
                value={section.order}
                onChange={(e) => onUpdate({ order: parseInt(e.target.value) })}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          {/* Campos de contenido según el tipo */}
          <div className="space-y-3">
            <h4 className="text-sm text-[#1C5D15] font-semibold">Contenido</h4>
            
            {/* Campos comunes a múltiples secciones */}
            {(section.type === 'hero' || section.type === 'text' || section.type === 'features' || 
              section.type === 'team' || section.type === 'products' || section.type === 'featured' ||
              section.type === 'trust' || section.type === 'ecosystem' || section.type === 'timeline') && (
              <>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Título (Español)</Label>
                    <Input
                      type="text"
                      value={section.content.title || ''}
                      onChange={(e) => {
                        const currentContent = section.content || {};
                        onUpdateContent('title', e.target.value);
                      }}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1C5D15] text-sm">Título (English)</Label>
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
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                {(section.type === 'hero' || section.type === 'text') && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#1C5D15] text-sm">
                        {section.type === 'hero' ? 'Subtítulo' : 'Texto'} (Español)
                      </Label>
                      <textarea
                        value={section.content.subtitle || section.content.text || ''}
                        onChange={(e) => onUpdateContent(section.type === 'hero' ? 'subtitle' : 'text', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-[#1C5D15] text-sm">
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
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {section.type === 'hero' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Texto del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaText || ''}
                          onChange={(e) => onUpdateContent('ctaText', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Texto del Botón (English)</Label>
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
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Enlace del Botón (Español)</Label>
                        <Input
                          type="text"
                          value={section.content.ctaLink || ''}
                          onChange={(e) => onUpdateContent('ctaLink', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-[#1C5D15] text-sm">Enlace del Botón (English)</Label>
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
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#1C5D15] text-sm">Imagen de Fondo</Label>
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
                    <Label className="text-[#1C5D15] text-sm">Imagen del Producto</Label>
                    <ImageUpload
                      currentImage={section.content.productImage}
                      onImageUpload={(url) => onUpdateContent('productImage', url)}
                      type="banner"
                    />
                  </div>
                )}

                {/* Campos de SEO */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-xs font-semibold text-[#1C5D15] mb-2">SEO - Meta Tags</h5>
                  <div>
                    <Label className="text-[#1C5D15] text-xs">Título Meta</Label>
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
                      className="mt-1 text-xs"
                      placeholder="Título para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-1">
                    <Label className="text-[#1C5D15] text-xs">Descripción Meta</Label>
                    <textarea
                      value={section.content.seo?.metaDescription || ''}
                      onChange={(e) => {
                        const currentSEO = section.content.seo || {};
                        onUpdateContent('seo', {
                          ...currentSEO,
                          metaDescription: e.target.value
                        });
                      }}
                      className="w-full mt-1 px-2 py-1 border rounded text-xs"
                      rows={2}
                      placeholder="Descripción para motores de búsqueda"
                    />
                  </div>
                  <div className="mt-1">
                    <Label className="text-[#1C5D15] text-xs">Palabras Clave</Label>
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
                      className="mt-1 text-xs"
                      placeholder="palabra1, palabra2, palabra3"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}