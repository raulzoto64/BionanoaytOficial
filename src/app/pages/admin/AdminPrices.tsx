import { useState, useEffect } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { supabaseAPI, PriceByQuantity, Product, ProductTranslation } from '../../data/supabase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export function AdminPrices() {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productTranslations, setProductTranslations] = useState<Record<string, ProductTranslation>>({});
  const [prices, setPrices] = useState<PriceByQuantity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<PriceByQuantity | null>(null);
  const [isNewPrice, setIsNewPrice] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      loadPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await supabaseAPI.getProducts();
      setProducts(productsData);

      // Load translations for all products
      const translations: Record<string, ProductTranslation> = {};
      for (const product of productsData) {
        const translation = await supabaseAPI.getProductTranslation(product.id, 'es');
        if (translation) {
          translations[product.id] = translation;
        }
      }
      setProductTranslations(translations);

      if (productsData.length > 0) {
        setSelectedProductId(productsData[0].id);
      }
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    try {
      const pricesData = await supabaseAPI.getPricesByProduct(selectedProductId);
      setPrices(pricesData.sort((a, b) => a.min_quantity - b.min_quantity));
    } catch (error) {
      toast.error('Error al cargar precios');
    }
  };

  const handleAddNew = () => {
    setEditingPrice({
      id: '',
      product_id: selectedProductId,
      min_quantity: 1,
      max_quantity: null,
      price_per_unit: 0,
      currency: 'COP',
    });
    setIsNewPrice(true);
    setDialogOpen(true);
  };

  const handleEdit = (price: PriceByQuantity) => {
    setEditingPrice(price);
    setIsNewPrice(false);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPrice) return;

    try {
      if (isNewPrice) {
        await supabaseAPI.createPrice({
          product_id: editingPrice.product_id,
          min_quantity: editingPrice.min_quantity,
          max_quantity: editingPrice.max_quantity,
          price_per_unit: editingPrice.price_per_unit,
          currency: editingPrice.currency,
        });
        toast.success('Precio agregado correctamente');
      } else {
        await supabaseAPI.updatePrice(editingPrice.id, editingPrice);
        toast.success('Precio actualizado correctamente');
      }
      setDialogOpen(false);
      loadPrices();
    } catch (error) {
      toast.error('Error al guardar precio');
    }
  };

  const handleDelete = async (priceId: string) => {
    if (!confirm('¿Estás seguro de eliminar este precio?')) return;

    try {
      await supabaseAPI.deletePrice(priceId);
      toast.success('Precio eliminado');
      loadPrices();
    } catch (error) {
      toast.error('Error al eliminar precio');
    }
  };

  const formatPrice = (price: number | undefined, currency: string | undefined) => {
    if (price === undefined || currency === undefined) {
      return '$0 COP';
    }
    
    if (currency === 'COP') {
      return `$${price.toLocaleString('es-CO')} COP`;
    }
    return `$${price.toLocaleString('en-US')} ${currency}`;
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  const selectedProductTranslation = selectedProductId
    ? productTranslations[selectedProductId]
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Precios</h2>
          <p className="text-[#629960]">Configura precios por cantidad para cada producto</p>
        </div>
      </div>

      {/* Product Selector */}
      <Card className="p-6 bg-white border-2 border-[#629960]/20 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>Seleccionar Producto</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {productTranslations[product.id]?.name || product.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-[#1C5D15] text-white hover:bg-[#629960] mt-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Precio
          </Button>
        </div>
      </Card>

      {/* Selected Product Info */}
      {selectedProductTranslation && (
        <Card className="p-6 bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white mb-6">
          <h3 className="text-2xl mb-2">{selectedProductTranslation.name}</h3>
          <p className="opacity-90">{selectedProductTranslation.short_description}</p>
        </Card>
      )}

      {/* Prices Table */}
      <Card className="p-6 bg-white border-2 border-[#629960]/20">
        <h3 className="text-xl text-[#1C5D15] mb-4">Tabla de Precios por Cantidad</h3>

        {prices.length === 0 ? (
          <div className="text-center py-12 text-[#629960]">
            <p>No hay precios configurados para este producto</p>
            <Button
              onClick={handleAddNew}
              variant="outline"
              className="mt-4 border-[#1C5D15] text-[#1C5D15]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Precio
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {prices.map((price) => (
              <div
                key={price.id}
                className="flex items-center justify-between p-4 bg-[#F7F9CE]/50 rounded-lg border border-[#629960]/20"
              >
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-[#629960]">Cantidad</span>
                    <p className="text-lg text-[#1C5D15] font-semibold">
                      {price.min_quantity} - {price.max_quantity || '∞'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[#629960]">Precio por unidad</span>
                    <p className="text-lg text-[#1C5D15] font-semibold">
                      {formatPrice(price.price_per_unit, price.currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[#629960]">Moneda</span>
                    <p className="text-lg text-[#1C5D15] font-semibold">{price.currency}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#1C5D15] text-[#1C5D15]"
                    onClick={() => handleEdit(price)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => handleDelete(price.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewPrice ? 'Agregar Precio' : 'Editar Precio'}</DialogTitle>
          </DialogHeader>

          {editingPrice && (
            <div className="space-y-4">
              <div>
                <Label>Cantidad Mínima</Label>
                <Input
                  type="number"
                  value={editingPrice.min_quantity}
                  onChange={(e) =>
                    setEditingPrice({
                      ...editingPrice,
                      min_quantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Cantidad Máxima (vacío = infinito)</Label>
                <Input
                  type="number"
                  value={editingPrice.max_quantity || ''}
                  onChange={(e) =>
                    setEditingPrice({
                      ...editingPrice,
                      max_quantity: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="Dejar vacío para infinito"
                />
              </div>

              <div>
                <Label>Precio por Unidad</Label>
                <Input
                  type="number"
                  value={editingPrice.price_per_unit}
                  onChange={(e) =>
                    setEditingPrice({
                      ...editingPrice,
                      price_per_unit: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Moneda</Label>
                <Select
                  value={editingPrice.currency}
                  onValueChange={(val: 'COP' | 'USD') =>
                    setEditingPrice({ ...editingPrice, currency: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP (Peso Colombiano)</SelectItem>
                    <SelectItem value="USD">USD (Dólar)</SelectItem>
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
              {isNewPrice ? 'Agregar' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
