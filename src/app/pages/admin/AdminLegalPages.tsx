import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { DatabaseManager } from '../../data/DatabaseManager';
import { LegalPage } from '../../data/supabase';
import { Plus, Trash2, Edit } from 'lucide-react';

export function AdminLegalPages() {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title_es: '',
    title_en: '',
    content_es: '',
    content_en: '',
    is_active: true
  });

  useEffect(() => {
    loadLegalPages();
  }, []);

  const loadLegalPages = async () => {
    setIsLoading(true);
    try {
      const pages = await DatabaseManager.getLegalPages();
      setLegalPages(pages);
    } catch (error) {
      console.error('Error loading legal pages:', error);
      toast.error('Error al cargar las páginas legales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPage) {
        await DatabaseManager.updateLegalPage(editingPage.id, formData);
        toast.success('Página legal actualizada exitosamente');
      } else {
        await DatabaseManager.createLegalPage(formData);
        toast.success('Página legal creada exitosamente');
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadLegalPages();
    } catch (error) {
      console.error('Error saving legal page:', error);
      toast.error('Error al guardar la página legal');
    }
  };

  const handleEdit = (page: LegalPage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title_es: page.title_es,
      title_en: page.title_en,
      content_es: page.content_es,
      content_en: page.content_en,
      is_active: page.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar esta página legal?')) {
      try {
        await DatabaseManager.deleteLegalPage(id);
        toast.success('Página legal eliminada exitosamente');
        loadLegalPages();
      } catch (error) {
        console.error('Error deleting legal page:', error);
        toast.error('Error al eliminar la página legal');
      }
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title_es: '',
      title_en: '',
      content_es: '',
      content_en: '',
      is_active: true
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1C5D15]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C5D15]">Páginas Legales</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Página
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Editar Página Legal' : 'Nueva Página Legal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="slug-de-la-pagina"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Activa</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <span>{formData.is_active ? 'Activa' : 'Inactiva'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_es">Título (ES)</Label>
                  <Input
                    id="title_es"
                    value={formData.title_es}
                    onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                    placeholder="Título en español"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">Título (EN)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Title in English"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content_es">Contenido (ES)</Label>
                  <Textarea
                    id="content_es"
                    value={formData.content_es}
                    onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
                    placeholder="Contenido en español (puede incluir HTML)"
                    rows={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content_en">Contenido (EN)</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    placeholder="Content in English (can include HTML)"
                    rows={8}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white">
                  {editingPage ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {legalPages.map((page) => (
          <Card key={page.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{page.title_es}</h3>
                  {!page.is_active && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {page.title_en}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Slug: /legal/{page.slug}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(page)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(page.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}