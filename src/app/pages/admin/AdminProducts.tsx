import { useState, useEffect } from 'react';
import { Trash2, Plus, X, Eye, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
  Card,
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
import { Product, ProductTranslation, supabaseAPI, Category } from '../../data/supabase';
import { toast } from 'sonner';
import { ImageUpload } from '../../components/ImageUpload';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productsNames, setProductsNames] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<ProductTranslation>({
    product_id: '',
    language: 'es',
    name: '',
    description: '',
    short_description: '',
    features: [],
    benefits: [],
    technical_specs: {},
    meta_title: '',
    meta_description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { updateTrigger } = useDatabase();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [updateTrigger]); // Re-cargar cuando cambie la base de datos

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, productsNames]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getAllProducts(); // Obtener todos los productos (active, inactive, draft)
      setProducts(data);

      // Cargar nombres de productos en el idioma actual
      const names: Record<string, string> = {};
      for (const product of data) {
        const translation = await supabaseAPI.getProductTranslation(product.id, currentLang);
        names[product.id] = translation.name || product.slug;
      }
      setProductsNames(names);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await supabaseAPI.getAllCategories();
      setCategories(data);

      // Cargar nombres de categorías en el idioma actual
      const names: Record<string, string> = {};
      for (const category of data) {
        const translation = await supabaseAPI.getCategoryTranslation(category.id, currentLang);
        names[category.id] = translation?.name || category.slug;
      }
      setCategoryNames(names);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        productsNames[product.id]?.toLowerCase().includes(term) ||
        product.slug.toLowerCase().includes(term)
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleNewProduct = () => {
    const newProduct: Product = {
      id: '',
      slug: '',
      category: 'cat-001',
      status: 'draft',
      image: '',
      images: [],
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const newTranslation: ProductTranslation = {
      product_id: '',
      language: currentLang,
      name: '',
      description: '',
      short_description: '',
      features: [],
      benefits: [],
      technical_specs: {},
      meta_title: '',
      meta_description: '',
    };
    
    setEditingProduct(newProduct);
    setEditingTranslation(newTranslation);
    setDialogOpen(true);
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    const translation = await supabaseAPI.getProductTranslation(product.id, currentLang);
    setEditingTranslation(translation);
    setDialogOpen(true);
  };

  const handleSave = async () => {
  if (!editingProduct || !editingTranslation) return;

  // Validación: Evitar slugs vacíos si no se escribieron manualmente
  const finalSlug = editingProduct.slug || 
                    editingTranslation.name.toLowerCase()
                      .trim()
                      .replace(/\s+/g, '-')
                      .replace(/[^\w-]+/g, ''); // Limpia caracteres especiales

  if (!finalSlug) {
    toast.error('El nombre o el slug son obligatorios');
    return;
  }

  setLoading(true); // Bloquear UI mientras guarda

  try {
    let productId = editingProduct.id;

    // 1. PREPARAR DATOS DEL PRODUCTO
    const productData = {
      slug: finalSlug,
      category: editingProduct.category || 'cat-001',
      status: editingProduct.status,
      image: editingProduct.image, // URL ya subida por Cloudinary
      images: Array.isArray(editingProduct.images) ? editingProduct.images : [], // Asegurar que sea array
      featured: editingProduct.featured || false,
    };

    if (!productId) {
      // --- CREAR NUEVO PRODUCTO ---
      const createdProduct = await supabaseAPI.createProduct(productData);
      productId = createdProduct.id;
    } else {
      // --- ACTUALIZAR PRODUCTO EXISTENTE ---
      // Solo enviamos los campos necesarios, no el objeto completo con fechas
      await supabaseAPI.updateProduct(productId, productData);
    }

    // 2. GUARDAR TRADUCCIÓN (UPSERT)
    // Usamos updateProductTranslation que internamente usa .upsert() 
    // Esto evita el error 406 si la traducción para ese idioma no existía
    await supabaseAPI.updateProductTranslation(productId, currentLang, {
      ...editingTranslation,
      product_id: productId,
      language: currentLang,
    });

    toast.success(editingProduct.id ? 'Producto actualizado' : 'Producto creado');
    setDialogOpen(false);
    loadProducts(); // Recargar la lista completa
  } catch (error: any) {
    console.error('Error detallado:', error);
    
    // Manejo de errores específicos
    if (error.message?.includes('duplicate key')) {
      toast.error('El slug ya existe. Por favor usa un nombre diferente.');
    } else {
      toast.error('Error al guardar: ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await supabaseAPI.deleteProduct(productToDelete);
      toast.success('Producto eliminado correctamente');
      loadProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Productos</h2>
          <p className="text-[#629960]">Administra el catálogo de productos</p>
        </div>
        <Button className="bg-[#1C5D15] text-white hover:bg-[#629960]" onClick={handleNewProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Label htmlFor="search">Buscar Producto</Label>
          <Input
            id="search"
            placeholder="Buscar por nombre o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-64">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {categoryNames[category.id] || category.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-6 bg-white border-2 border-[#629960]/20">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.slug}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1C5D15] to-[#629960]"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl text-[#1C5D15] mb-1">{productsNames[product.id] || product.slug}</h3>
                  <p className="text-sm text-[#629960]">Categoría: {categoryNames[product.category] || product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={
                    product.status === 'active'
                      ? 'bg-[#19FF00] text-[#1C5D15]'
                      : 'bg-[#629960] text-white'
                  }
                >
                  {product.status}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#629960] text-[#629960]"
                  onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1C5D15] text-[#1C5D15]"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          </DialogHeader>

          {editingProduct && editingTranslation && (
            <div className="space-y-6">
              {/* Language Selector */}
              <div>
                <Label>Idioma</Label>
                <Select
                  value={currentLang}
                  onValueChange={async (val: 'es' | 'en') => {
                    setCurrentLang(val);
                    if (editingProduct) {
                      const translation = await supabaseAPI.getProductTranslation(editingProduct.id, val);
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

              {/* Product Slug */}
              <div>
                <Label>Slug</Label>
                <Input
                  value={editingProduct.slug}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, slug: e.target.value })
                  }
                  placeholder="slug-del-producto"
                />
              </div>

              {/* Product Images */}
              <div>
                <Label>Imágenes</Label>
                <ImageUpload
                  currentImages={Array.isArray(editingProduct.images) ? editingProduct.images : []}
                  onImageUpload={(urls) => setEditingProduct({ 
                    ...editingProduct, 
                    images: Array.isArray(urls) ? urls : [urls]
                  })}
                  type="product"
                />
              </div>

              {/* Product Name */}
              <div>
                <Label>Nombre del Producto</Label>
                <Input
                  value={editingTranslation.name}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, name: e.target.value })
                  }
                />
              </div>

              {/* Short Description */}
              <div>
                <Label>Descripción Corta</Label>
                <Input
                  value={editingTranslation.short_description}
                  onChange={(e) =>
                    setEditingTranslation({
                      ...editingTranslation,
                      short_description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Description */}
              <div>
                <Label>Descripción Completa</Label>
                <Textarea
                  value={editingTranslation.description}
                  onChange={(e) =>
                    setEditingTranslation({
                      ...editingTranslation,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              {/* Status */}
              <div>
                <Label>Estado</Label>
                <Select
                  value={editingProduct.status}
                  onValueChange={(val: 'active' | 'inactive' | 'draft') =>
                    setEditingProduct({ ...editingProduct, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Features */}
              <div>
                <Label>Características</Label>
                <div className="space-y-2">
                  {editingTranslation.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editingTranslation.features];
                          newFeatures[index] = e.target.value;
                          setEditingTranslation({ ...editingTranslation, features: newFeatures });
                        }}
                        placeholder="Característica"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          const newFeatures = editingTranslation.features.filter((_, i) => i !== index);
                          setEditingTranslation({ ...editingTranslation, features: newFeatures });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#629960] text-[#629960]"
                    onClick={() => {
                      setEditingTranslation({ ...editingTranslation, features: [...editingTranslation.features, ''] });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Característica
                  </Button>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <Label>Beneficios</Label>
                <div className="space-y-2">
                  {editingTranslation.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...editingTranslation.benefits];
                          newBenefits[index] = e.target.value;
                          setEditingTranslation({ ...editingTranslation, benefits: newBenefits });
                        }}
                        placeholder="Beneficio"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          const newBenefits = editingTranslation.benefits.filter((_, i) => i !== index);
                          setEditingTranslation({ ...editingTranslation, benefits: newBenefits });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#629960] text-[#629960]"
                    onClick={() => {
                      setEditingTranslation({ ...editingTranslation, benefits: [...editingTranslation.benefits, ''] });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Beneficio
                  </Button>
                </div>
              </div>

              {/* Technical Specs */}
              <div>
                <Label>Especificaciones Técnicas</Label>
                <div className="space-y-2">
                  {Object.entries(editingTranslation.technical_specs).map(([key, value], index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...editingTranslation.technical_specs };
                          delete newSpecs[key];
                          newSpecs[e.target.value] = value;
                          setEditingTranslation({ ...editingTranslation, technical_specs: newSpecs });
                        }}
                        placeholder="Nombre"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          const newSpecs = { ...editingTranslation.technical_specs };
                          newSpecs[key] = e.target.value;
                          setEditingTranslation({ ...editingTranslation, technical_specs: newSpecs });
                        }}
                        placeholder="Valor"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          const newSpecs = { ...editingTranslation.technical_specs };
                          delete newSpecs[key];
                          setEditingTranslation({ ...editingTranslation, technical_specs: newSpecs });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#629960] text-[#629960]"
                    onClick={() => {
                      setEditingTranslation({
                        ...editingTranslation,
                        technical_specs: { ...editingTranslation.technical_specs, 'Nueva Especificación': '' },
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Especificación
                  </Button>
                </div>
              </div>

              {/* Meta Title */}
              <div>
                <Label>Título Meta (SEO)</Label>
                <Input
                  value={editingTranslation.meta_title}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, meta_title: e.target.value })
                  }
                  placeholder="Título para motores de búsqueda"
                />
              </div>

              {/* Meta Description */}
              <div>
                <Label>Descripción Meta (SEO)</Label>
                <Input
                  value={editingTranslation.meta_description}
                  onChange={(e) =>
                    setEditingTranslation({ ...editingTranslation, meta_description: e.target.value })
                  }
                  placeholder="Descripción para motores de búsqueda"
                />
              </div>

              {/* Status */}
              <div>
                <Label>Estado</Label>
                <Select
                  value={editingProduct.status}
                  onValueChange={(val: 'active' | 'inactive' | 'draft') =>
                    setEditingProduct({ ...editingProduct, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured */}
              <div>
                <Label>Destacado</Label>
                <Select
                  value={editingProduct.featured ? '1' : '0'}
                  onValueChange={(val: '1' | '0') =>
                    setEditingProduct({ ...editingProduct, featured: val === '1' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Sí</SelectItem>
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
              {editingProduct?.id ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.
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
