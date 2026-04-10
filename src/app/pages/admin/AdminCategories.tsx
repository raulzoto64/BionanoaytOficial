import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FolderTree,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Category,
  CategoryTranslation,
  supabaseAPI,
} from "../../data/supabase";

interface CategoryWithTranslations extends Category {
  translations: {
    es: CategoryTranslation | null;
    en: CategoryTranslation | null;
  };
}

export function AdminCategories() {
  const [categoriesData, setCategoriesData] = useState<
    CategoryWithTranslations[]
  >([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    icon: "Folder",
    order: 1,
    status: "active" as "active" | "inactive",
    nameES: "",
    descriptionES: "",
    nameEN: "",
    descriptionEN: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // Combinar categorías con sus traducciones
      const allCategories = await supabaseAPI.getAllCategories();
      const categoriesWithTranslations = await Promise.all(
        allCategories.map(async (cat) => {
          const transES = await supabaseAPI.getCategoryTranslation(
            cat.id,
            "es",
          );
          const transEN = await supabaseAPI.getCategoryTranslation(
            cat.id,
            "en",
          );

          return {
            ...cat,
            translations: {
              es: transES,
              en: transEN,
            },
          };
        }),
      );

      setCategoriesData(categoriesWithTranslations);
    } catch (error) {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryWithTranslations) => {
    setEditingId(category.id);
    setFormData({
      slug: category.slug,
      icon: category.icon || "Folder",
      order: category.order,
      status: category.status,
      nameES: category.translations.es?.name || "",
      descriptionES: category.translations.es?.description || "",
      nameEN: category.translations.en?.name || "",
      descriptionEN: category.translations.en?.description || "",
    });
  };

  const handleSave = async () => {
    // 1. Validación y Limpieza del Slug
    const finalSlug =
      formData.slug.trim() ||
      formData.nameES
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    if (!finalSlug) {
      toast.error("El nombre o el slug son obligatorios");
      return;
    }

    setLoading(true);
    try {
      let categoryId = editingId;

      // 2. DATOS BÁSICOS DE LA CATEGORÍA
      const categoryData = {
        slug: finalSlug,
        icon: formData.icon || "Folder",
        order: formData.order || 0,
        status: formData.status,
        parent_id: null,
      };

      if (isCreating && !editingId) {
        // --- CREAR NUEVA CATEGORÍA ---
        const newCategory = await supabaseAPI.createCategory(categoryData);
        categoryId = newCategory.id;
      } else if (editingId) {
        // --- ACTUALIZAR EXISTENTE ---
        await supabaseAPI.updateCategory(editingId, categoryData);
      }

      if (!categoryId)
        throw new Error("No se pudo obtener el ID de la categoría");

      // 3. GUARDAR TRADUCCIONES (USANDO UPSERT)
      // Se ejecutan en paralelo para mayor velocidad
      await Promise.all([
        supabaseAPI.updateCategoryTranslation(categoryId, "es", {
          category_id: categoryId,
          language: "es",
          name: formData.nameES,
          description: formData.descriptionES,
        }),
        supabaseAPI.updateCategoryTranslation(categoryId, "en", {
          category_id: categoryId,
          language: "en",
          name: formData.nameEN,
          description: formData.descriptionEN,
        }),
      ]);

      toast.success(editingId ? "Categoría actualizada" : "Categoría creada");

      // 4. LIMPIEZA DE ESTADO
      setEditingId(null);
      setIsCreating(false);
      resetForm();
      await loadCategories(); // Recargamos la lista para ver los cambios
    } catch (error: any) {
      console.error("Error al guardar categoría:", error);

      // MANEJO ESPECÍFICO DE SLUG DUPLICADO
      // Verificamos el código 23505 (Unique Violation en Postgres) o el mensaje
      if (
        error.code === "23505" ||
        error.message?.includes("duplicate key") ||
        error.message?.includes("categories_slug_key")
      ) {
        toast.error(
          "El Slug ya está en uso. Por favor, elige un nombre o slug diferente.",
        );
      } else {
        toast.error(
          "Error al guardar: " + (error.message || "Error desconocido"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setCategoryIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryIdToDelete) return;

    try {
      await supabaseAPI.deleteCategory(categoryIdToDelete);
      toast.success("Categoría eliminada exitosamente");
      await loadCategories();
    } catch (error) {
      toast.error("Error al eliminar la categoría");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryIdToDelete(null);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await supabaseAPI.updateCategory(category.id, {
        status: category.status === "active" ? "inactive" : "active",
      });
      toast.success("Estado actualizado");
      loadCategories();
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      icon: "Folder",
      order: 1,
      status: "active",
      nameES: "",
      descriptionES: "",
      nameEN: "",
      descriptionEN: "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const isSlugDuplicate = categoriesData.some(
    (cat) => cat.slug === formData.slug && cat.id !== editingId,
  );

  const startCreating = () => {
    setIsCreating(true);
    resetForm();
    setFormData((prev) => ({ ...prev, order: categoriesData.length + 1 }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#629960]">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">
            Gestión de Categorías
          </h2>
          <p className="text-[#629960]">Organiza productos por categorías</p>
        </div>
        <Button
          onClick={startCreating}
          className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
          disabled={isCreating || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="p-6 mb-6 bg-white border-2 border-[#19FF00]">
          <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Categoría
          </h3>
          <CategoryForm formData={formData} setFormData={setFormData} />
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              disabled={isSlugDuplicate || !formData.slug}
              className="bg-[#1C5D15] ..."
            >
              {isSlugDuplicate ? "Slug duplicado" : "Guardar"}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categoriesData.length === 0 ? (
          <Card className="p-12 bg-white border-2 border-[#629960]/20 text-center">
            <FolderTree className="w-16 h-16 text-[#1C5D15] mx-auto mb-4" />
            <h3 className="text-2xl text-[#1C5D15] mb-2">No hay categorías</h3>
            <p className="text-[#629960] mb-4">
              Crea tu primera categoría para comenzar
            </p>
          </Card>
        ) : (
          categoriesData.map((category) => (
            <Card
              key={category.id}
              className={`p-6 bg-white border-2 ${
                editingId === category.id
                  ? "border-[#19FF00]"
                  : "border-[#629960]/20"
              }`}
            >
              {editingId === category.id ? (
                <>
                  <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Editar Categoría
                  </h3>
                  <CategoryForm formData={formData} setFormData={setFormData} />
                  <div className="flex gap-3 mt-6">
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
                </>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#1C5D15] rounded-lg flex items-center justify-center">
                        <FolderTree className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl text-[#1C5D15]">
                          {category.translations.es?.name || category.slug}
                        </h3>
                        <p className="text-sm text-[#629960]">
                          Slug: {category.slug}
                        </p>
                      </div>
                      <Badge
                        className={
                          category.status === "active"
                            ? "bg-[#19FF00] text-[#1C5D15]"
                            : "bg-gray-400 text-white"
                        }
                      >
                        {category.status === "active" ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <p className="text-sm text-[#629960]">
                          <strong>🇪🇸 Español:</strong>
                        </p>
                        <p className="text-sm">
                          {category.translations.es?.description ||
                            "Sin descripción"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-[#629960]">
                          <strong>🇬🇧 English:</strong>
                        </p>
                        <p className="text-sm">
                          {category.translations.en?.description ||
                            "No description"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(category)}
                      className="border-[#629960] text-[#629960]"
                    >
                      {category.status === "active" ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="border-[#1C5D15] text-[#1C5D15]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1C5D15]">¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer y podría afectar a los productos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Componente de formulario reutilizable
function CategoryForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="slug" className="text-[#1C5D15]">
          Slug (URL)
        </Label>
        <Input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="categoria-ejemplo"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="order" className="text-[#1C5D15]">
          Orden
        </Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="icon" className="text-[#1C5D15]">
          Icono (Lucide)
        </Label>
        <Input
          id="icon"
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="Shield"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="status" className="text-[#1C5D15]">
          Estado
        </Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as "active" | "inactive",
            })
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        >
          <option value="active">Activa</option>
          <option value="inactive">Inactiva</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-lg text-[#1C5D15] mb-3 border-b pb-2">
          🇪🇸 Traducción Español
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nameES" className="text-[#1C5D15]">
              Nombre
            </Label>
            <Input
              id="nameES"
              type="text"
              value={formData.nameES}
              onChange={(e) =>
                setFormData({ ...formData, nameES: e.target.value })
              }
              placeholder="Nombre en español"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="descriptionES" className="text-[#1C5D15]">
              Descripción
            </Label>
            <Input
              id="descriptionES"
              type="text"
              value={formData.descriptionES}
              onChange={(e) =>
                setFormData({ ...formData, descriptionES: e.target.value })
              }
              placeholder="Descripción en español"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <h4 className="text-lg text-[#1C5D15] mb-3 border-b pb-2">
          🇬🇧 Traducción English
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nameEN" className="text-[#1C5D15]">
              Name
            </Label>
            <Input
              id="nameEN"
              type="text"
              value={formData.nameEN}
              onChange={(e) =>
                setFormData({ ...formData, nameEN: e.target.value })
              }
              placeholder="Name in English"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="descriptionEN" className="text-[#1C5D15]">
              Description
            </Label>
            <Input
              id="descriptionEN"
              type="text"
              value={formData.descriptionEN}
              onChange={(e) =>
                setFormData({ ...formData, descriptionEN: e.target.value })
              }
              placeholder="Description in English"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
