import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingCart, Check, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../hooks/useDatabase';
import { supabaseAPI, Product, ProductTranslation, PriceByQuantity } from '../data/supabase';
import { toast } from 'sonner';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { updateTrigger } = useDatabase();

  const [product, setProduct] = useState<Product | null>(null);
  const [translation, setTranslation] = useState<ProductTranslation | null>(null);
  const [prices, setPrices] = useState<PriceByQuantity[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState<{
    pricePerUnit: number;
    total: number;
    currency: string;
  } | null>(null);
  const [selectedPackagingType, setSelectedPackagingType] = useState<string>('');

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug, language, updateTrigger]); // Re-cargar cuando cambie el slug, idioma o base de datos

  useEffect(() => {
    if (product && quantity > 0) {
      calculatePricing();
    }
  }, [quantity, product]); // Recalcular precio cuando cambie la cantidad

  const loadProduct = async () => {
    setLoading(true);
    try {
      const productData = await supabaseAPI.getProductBySlug(slug!);
      if (!productData) {
        toast.error('Producto no encontrado');
        navigate('/store');
        return;
      }

      const translationData = await supabaseAPI.getProductTranslation(productData.id, language);
      const pricesData = await supabaseAPI.getPricesByProduct(productData.id);

      setProduct(productData);
      setTranslation(translationData);
      setPrices(pricesData);
      
      // Obtener tipos de embase disponibles para el producto
      const availablePackagingTypes = Array.from(
        new Set(pricesData.map(price => {
          const packaging = price.packaging || 'Sin embase';
          return packaging.includes(' ') 
            ? (() => {
                const parts = packaging.split(' ');
                if (!isNaN(Number(parts[0]))) {
                  return `${parts[1]} de ${parts[0]} litros`;
                }
                return `${parts[0]} de ${parts[1]} litros`;
              })()
            : packaging;
        }))
      );
      
      // Seleccionar el primer tipo de embase disponible si no hay uno seleccionado
      if (availablePackagingTypes.length > 0 && !selectedPackagingType) {
        setSelectedPackagingType(availablePackagingTypes[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!product) return;
    
    const pricing = await supabaseAPI.calculatePrice(product.id, quantity);
    setCalculatedPrice(pricing);
  };

  const handleAddToCart = () => {
    if (!product || !translation || !calculatedPrice) return;

    // Aquí conectarás con tu sistema de carrito
    toast.success(`${translation.name} agregado al carrito (${quantity} unidades)`);
  };

  const handleRequestQuote = () => {
    if (!translation) return;
    // Aquí conectarás con tu sistema de cotizaciones
    toast.success(`Cotización solicitada para ${translation.name}`);
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'COP') {
      return `$${price.toLocaleString('es-CO')} COP`;
    }
    return `$${price.toLocaleString('en-US')} ${currency}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9CE]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1C5D15] mx-auto"></div>
          <p className="mt-4 text-[#1C5D15]">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product || !translation) {
    return null;
  }

  // Obtener tipos de embase disponibles para el producto
  const availablePackagingTypes = Array.from(
    new Set(prices.map(price => {
      const packaging = price.packaging || 'Sin embase';
      return packaging.includes(' ') 
        ? (() => {
            const parts = packaging.split(' ');
            if (!isNaN(Number(parts[0]))) {
              return `${parts[1]} de ${parts[0]} litros`;
            }
            return `${parts[0]} de ${parts[1]} litros`;
          })()
        : packaging;
    }))
  );

  // Filtrar precios por tipo de embase seleccionado
  const filteredPrices = prices.filter(price => {
    const packaging = price.packaging || 'Sin embase';
    const packagingType = packaging.includes(' ') 
      ? (() => {
          const parts = packaging.split(' ');
          if (!isNaN(Number(parts[0]))) {
            return `${parts[1]} de ${parts[0]} litros`;
          }
          return `${parts[0]} de ${parts[1]} litros`;
        })()
      : packaging;
    return packagingType === selectedPackagingType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9CE] to-white">
      {/* Back Button */}
      <div className="bg-[#1C5D15] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:text-[#19FF00] hover:bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Volver' : 'Back'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Imagen del producto */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#629960]/20">
              <img
                src={product.image || `https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800`}
                alt={translation.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.status === 'active' && (
              <Badge className="absolute top-4 right-4 bg-[#19FF00] text-[#1C5D15] text-lg px-4 py-2">
                {language === 'es' ? 'Disponible' : 'Available'}
              </Badge>
            )}
          </div>

          {/* Información y precios */}
          <div>
            <h1 className="text-5xl mb-4 text-[#1C5D15]">{translation.name}</h1>
            <p className="text-xl text-[#629960] mb-8">{translation.short_description}</p>

            {/* Card de precios */}
            <Card className="bg-white border-2 border-[#629960] p-6 mb-6">
              <h3 className="text-2xl mb-4 text-[#1C5D15]">{t('price.volume_pricing')}</h3>
              
              {/* Selector de tipo de embase */}
              {availablePackagingTypes.length > 1 && (
                <div className="mb-6">
                  <Label>Tipo de Embase</Label>
                  <Select value={selectedPackagingType} onValueChange={setSelectedPackagingType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePackagingTypes.map((packagingType) => (
                        <SelectItem key={packagingType} value={packagingType}>
                          {packagingType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Precios para el tipo de embase seleccionado */}
              <div className="space-y-2 mb-6">
                {filteredPrices.length === 0 ? (
                  <div className="text-center py-12 text-[#629960]">
                    <p>No hay precios configurados para este tipo de embase</p>
                  </div>
                ) : (
                  filteredPrices.map((price) => (
                    <div
                      key={price.id}
                      className={`flex justify-between items-center p-2 rounded-lg ${
                        calculatedPrice?.pricePerUnit === price.price_per_unit
                          ? 'bg-[#19FF00]/20 border-2 border-[#19FF00]'
                          : 'bg-[#F7F9CE]/50'
                      }`}
                    >
                      <span className="text-[#1C5D15]">
                        {price.min_quantity} - {price.max_quantity || '∞'} {t('price.unit')}
                      </span>
                      <span className="font-bold text-[#1C5D15]">
                        {formatPrice(price.price_per_unit, price.currency)}/{t('price.unit')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Selector de cantidad */}
              <div className="mb-4">
                <label className="block text-sm mb-2 text-[#1C5D15]">
                  {t('products.quantity')}
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-[#629960] text-[#1C5D15] hover:bg-[#629960] hover:text-white"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center border-[#629960] text-[#1C5D15]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-[#629960] text-[#1C5D15] hover:bg-[#629960] hover:text-white"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Precio calculado */}
              {calculatedPrice && (
                <div className="bg-[#1C5D15] text-white p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{t('products.price')} por unidad:</span>
                    <span className="text-2xl font-bold text-[#19FF00]">
                      {formatPrice(calculatedPrice.pricePerUnit, calculatedPrice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total ({quantity} {t('price.unit')}):</span>
                    <span className="text-2xl font-bold text-[#19FF00]">
                      {formatPrice(calculatedPrice.total, calculatedPrice.currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1C5D15] hover:bg-[#629960] text-white"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {t('btn.add_to_cart')}
                </Button>
                <Button
                  onClick={handleRequestQuote}
                  variant="outline"
                  className="flex-1 border-[#1C5D15] text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white"
                >
                  <Package className="w-5 h-5 mr-2" />
                  {t('btn.quote')}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs de información */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-4 bg-[#629960]/20">
            <TabsTrigger value="description" className="data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white">
              {language === 'es' ? 'Descripción' : 'Description'}
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white">
              {t('products.features')}
            </TabsTrigger>
            <TabsTrigger value="benefits" className="data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white">
              {t('products.benefits')}
            </TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white">
              {t('products.specs')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="p-6 bg-white">
              {/* Separar descripción en parrafos de 4 líneas */}
              <div className="space-y-4">
                {translation.description.split(/\n\n|(?<=\.{3})|(?<=\.)(?=\s[A-Z])/).map((paragraph, index) => {
                  if (paragraph.trim()) {
                    return <p key={index} className="text-lg leading-relaxed text-[#1C5D15]">{paragraph.trim()}</p>;
                  }
                  return null;
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card className="p-6 bg-white">
              <h3 className="text-2xl mb-4 text-[#1C5D15]">{t('products.features')}</h3>
              <ul className="space-y-3">
                {translation.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#19FF00] flex-shrink-0 mt-1" />
                    <span className="text-[#1C5D15]">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="mt-6">
            <Card className="p-6 bg-white">
              <h3 className="text-2xl mb-4 text-[#1C5D15]">{t('products.benefits')}</h3>
              <ul className="space-y-3">
                {translation.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#19FF00] flex-shrink-0 mt-1" />
                    <span className="text-[#1C5D15]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card className="p-6 bg-white">
              <h3 className="text-2xl mb-4 text-[#1C5D15]">{t('products.specs')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(translation.technical_specs).map(([key, value]) => (
                  <div key={key} className="border-b border-[#629960]/20 pb-3">
                    <dt className="font-bold text-[#629960] mb-1">{key}</dt>
                    <dd className="text-[#1C5D15]">{value as string}</dd>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action Final */}
        <Card className="bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white p-8 text-center">
          <h2 className="text-3xl mb-4">{language === 'es' ? '¿Listo para ordenar?' : 'Ready to order?'}</h2>
          <p className="text-xl mb-6 opacity-90">
            {language === 'es' 
              ? 'Contáctanos para más información o realiza tu pedido ahora' 
              : 'Contact us for more information or place your order now'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('btn.add_to_cart')}
            </Button>
            <Button
              onClick={handleRequestQuote}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#1C5D15]"
            >
              {t('btn.contact')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}