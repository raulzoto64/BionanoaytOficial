import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Save, X, Eye, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useDatabase } from '../../hooks/useDatabase';
import { BlogCategory, BlogCategoryTranslation, supabaseAPI } from '../../data/supabase';
import { toast } from 'sonner';

export function AdminBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoriesNames, setCategoriesNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<BlogCategoryTranslation>({
    category_id: '',
    language: 'es',
    name: '',
    description: '',
  });
  const { updateTrigger } = useDatabase();

  useEffect(() => {
    loadCategories();
  }, [updateTrigger]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getBlogCategories();
      setCategories(data);

      const names: Record<string, string> = {};
      for (const category of data) {
        const translation = await supabaseAPI.getBlogCategoryTranslation(category.id, currentLang);
        names[category.id] = translation.name || category.slug;
      }
      setCategoriesNames(names);
    } catch (error) {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategory = () => {
    const newCategory: BlogCategory = {
      id: '',
      slug: '',
      order: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const newTranslation: BlogCategoryTranslation = {
      category_id: '',
      language: currentLang,
      name: '',
      description: '',
    };
    
    setEditingCategory(newCategory);
    setEditingTranslation(newTranslation);
    setDialogOpen(true);
  };

  const handleEdit = async (category: BlogCategory) => {
    setEditingCategory(category);
    const translation = await supabaseAPI.getBlogCategoryTranslation(category.id, currentLang);
    setEditingTranslation(translation);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory || !editingTranslation) return;

    const finalSlug = editingCategory.slug || 
                      editingTranslation.name.toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '');

    if (!finalSlug) {
      toast.error('El nombre o el slug son obligatorios');
      return;
    }

    setLoading(true);

    try {
      let categoryId = editingCategory.id;

      const categoryData = {
        slug: finalSlug,
        order: editingCategory.order,
        status: editingCategory.status,
      };

      if (!categoryId) {
        const createdCategory = await supabaseAPI.createBlogCategory(categoryData);
        categoryId = createdCategory.id;
      } else {
        await supabaseAPI.updateBlogCategory(categoryId, categoryData);
      }

      await supabaseAPI.updateBlogCategoryTranslation(categoryId, currentLang, {
        ...editingTranslation,
        category_id: categoryId,
        language: currentLang,
      });

      toast.success(editingCategory.id ? 'Categoría actualizada' : 'Categoría creada');
      setDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      
      if (error.message?.includes('duplicate key')) {
        toast.error('El slug ya existe. Por favor usa un nombre diferente.');
      } else {
        toast.error('Error al guardar: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await supabaseAPI.deleteBlogCategory(categoryToDelete);
      toast.success('Categoría eliminada correctamente');
      loadCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Categorías</h2>
          <p className="text-[#629960]">Administra las categorías del blog</p>
        </div>
        <Button className="bg-[#1C5D15] text-white hover:bg-[#629960]" onClick={handleNewCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-6 bg-white border-2 border-[#629960]/20">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-xl text-[#1C5D15] mb-1">{categoriesNames[category.id] || category.slug}</h3>
                  <p className="text-sm text-[#629960]">ID: {category.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={
                    category.status === 'active'
                      ? 'bg-[#19FF00] text-[#1C5D15]'
                      : 'bg-[#629960] text-white'
                  }
                >
                  {category.status}
                </Badge>

                <Badge className="bg-[#629960] text-white">
                  Orden: {category.order}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1C5D15] text-[#1C5D15]"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory?.id ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
          </DialogHeader>

          {editingCategory && editingTranslation && (
            <div className="space-y-6">
              <div>
                <Label>Idioma</Label>
                <Select
                  value={currentLang}
                  onValueChange={async (val: 'es' | 'en') => {
                    setCurrentLang(val);
                    if (editingCategory) {
                      const translation = await supabaseAPI.getBlogCategoryTranslation(editingCategory.id, val);
                      setEditingTranslation(translation);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Slug</Label>
                <Input
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  placeholder="slug-de-la-categoria"
                />
              </div>

              <div>
                <Label>Nombre</Label>
                <Input
                  value={editingTranslation.name}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={editingTranslation.description}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={editingCategory.order}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  value={editingCategory.status}
                  onValueChange={(val: 'active' | 'inactive') =>
                    setEditingCategory({ ...editingCategory, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-[#1C5D15] text-white">
              {editingCategory?.id ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}