import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Page, 
  PageContent, 
  Section, 
  supabaseAPI 
} from '../../../data/supabase';
import { PageList } from './PageList';
import { EditorView } from './EditorView';

interface PageWithContent extends Page {
  contentES: PageContent | null;
  contentEN: PageContent | null;
}

export function AdminContentEditor() {
  const [pagesData, setPagesData] = useState<PageWithContent[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
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
        subtitle: '',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#629960]">Cargando páginas...</p>
      </div>
    );
  }

  if (editingPage) {
    return (
      <EditorView
        editingPage={editingPage}
        sections={sections}
        expandedSections={expandedSections}
        onSave={handleSave}
        onCancel={handleCancel}
        onAddSection={addSection}
        onToggleSectionExpanded={toggleSectionExpanded}
        onUpdateSection={updateSection}
        onUpdateSectionContent={updateSectionContent}
        onDeleteSection={deleteSection}
        onMoveSectionUp={moveSectionUp}
        onMoveSectionDown={moveSectionDown}
        onSaveIndividualSection={handleSaveSection}
      />
    );
  }

  return <PageList pagesData={pagesData} onEditPage={handleEditPage} />;
}
