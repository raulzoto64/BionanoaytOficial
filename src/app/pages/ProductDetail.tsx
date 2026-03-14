import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingCart, Check, ChevronDown, ChevronUp, Package, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
import { ProductTabs } from '../components/ProductTabs';
import { useAuth } from '../hooks/useAuth';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { updateTrigger } = useDatabase();
  const { user, isAuthenticated } = useAuth();

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  // Manejar cambio de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug, language, updateTrigger]); // Re-cargar cuando cambie el slug, idioma o base de datos

  useEffect(() => {
    if (product && quantity > 0 && selectedPackagingType) {
      calculatePricing();
    }
  }, [quantity, product, selectedPackagingType]); // Recalcular precio cuando cambie la cantidad o la embase

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
    
    // Obtener el valor original de packaging (sin formatear) para pasar a la API
    const originalPackaging = prices.find(price => {
      const formatted = price.packaging?.includes(' ') 
        ? (() => {
            const parts = price.packaging.split(' ');
            if (!isNaN(Number(parts[0]))) {
              return `${parts[1]} de ${parts[0]} litros`;
            }
            return `${parts[0]} de ${parts[1]} litros`;
          })()
        : price.packaging || 'Sin embase';
      return formatted === selectedPackagingType;
    })?.packaging;

    const pricing = await supabaseAPI.calculatePrice(product.id, quantity, originalPackaging);
    setCalculatedPrice(pricing);
  };

  const handleAddToCart = async () => {
    if (!product || !translation || !calculatedPrice) return;

    try {
      // Verificar que el usuario esté autenticado
      if (!isAuthenticated || !user) {
        toast.error('Debes iniciar sesión para agregar productos al carrito');
        navigate('/login');
        return;
      }
      
      // Obtener el valor original de packaging (sin formatear) para pasar a la API
      const originalPackaging = prices.find(price => {
        const formatted = price.packaging?.includes(' ') 
          ? (() => {
              const parts = price.packaging.split(' ');
              if (!isNaN(Number(parts[0]))) {
                return `${parts[1]} de ${parts[0]} litros`;
              }
              return `${parts[0]} de ${parts[1]} litros`;
            })()
          : price.packaging || 'Sin embase';
        return formatted === selectedPackagingType;
      })?.packaging;

      // Log de información enviada al carrito
      console.log("Enviando al carrito:", {
        userId: user.id,
        productId: product.id,
        productName: translation.name,
        quantity: quantity,
        packaging: originalPackaging,
        calculatedPrice: calculatedPrice,
        selectedPackagingType: selectedPackagingType
      });

      const cartItem = await supabaseAPI.addToCart(user.id, product.id, quantity, originalPackaging);
      
      // Log de información recibida del carrito
      console.log("Item agregado al carrito:", cartItem);
      
      toast.success(`${translation.name} agregado al carrito (${quantity} unidades)`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('Error al agregar el producto al carrito');
    }
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
        <div className="mb-16">
          {/* Título y subtítulo */}
          <div className="mb-8">
            <h1 className="text-5xl mb-4 text-[#1C5D15]">{translation.name}</h1>
            <p className="text-xl text-[#629960]">{translation.short_description}</p>
          </div>
          
          {/* Imagen y precios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Galería de imágenes */}
            <div className="flex gap-6">
              {/* Miniaturas a la izquierda */}
              {product.images && product.images.length > 1 && (
                <div className="flex flex-col gap-4 w-20">
                  {/* Imágenes visibles (5 para desktop, 4 para mobile) */}
                    {product.images?.slice(0, 5).map((image, index) => {
                    // Determinar si es la última miniatura visible
                    const isLastVisibleThumbnail = (!isMobile && index === 4) || (isMobile && index === 3);
                    // Determinar si hay más imágenes que las visibles
                    const hasMoreImages = (product.images?.length || 0) > (!isMobile ? 5 : 4);
                    
                    return (
                      <div
                        key={index}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer relative ${
                          index === selectedImageIndex ? 'border-[#1C5D15]' : 'border-gray-300 hover:border-[#629960]'
                        } ${index >= 4 ? 'hidden sm:block' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${translation.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Indicador de más imágenes sobrepuesto */}
                        {isLastVisibleThumbnail && hasMoreImages && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                            +{(product.images?.length || 0) - (!isMobile ? 5 : 4)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Imagen principal */}
              <div className="relative flex-1">
                <div 
                  className="aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#629960]/20 group"
                  style={{ cursor: 'zoom-in' }}
                >
                  <img
                    src={(product.images && product.images[selectedImageIndex]) || product.image || `https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800`}
                    alt={translation.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                    style={{ 
                      transformOrigin: 'center center',
                      transform: 'scale(1)' 
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left) / rect.width;
                      const y = (e.clientY - rect.top) / rect.height;
                      e.currentTarget.style.transform = `scale(1.5)`;
                      e.currentTarget.style.transformOrigin = `${x * 100}% ${y * 100}%`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.transformOrigin = 'center center';
                    }}
                  />
                </div>
                {product.status === 'active' && (
                  <Badge className="absolute top-4 right-4 bg-[#19FF00] text-[#1C5D15] text-lg px-4 py-2">
                    {language === 'es' ? 'Disponible' : 'Available'}
                  </Badge>
                )}
                
                {/* Botones de navegación */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => {
                        const images = product.images || [];
                        return (prev > 0 ? prev - 1 : images.length - 1);
                      })}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1C5D15] rounded-full p-2 shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => {
                        const images = product.images || [];
                        return (prev < images.length - 1 ? prev + 1 : 0);
                      })}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1C5D15] rounded-full p-2 shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Botón de lupa que aparece al pasar el mouse */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/80 hover:bg-white text-[#1C5D15] rounded-full p-2 shadow-lg">
                    <Search className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tablero de precios */}
            <div>
              {/* Card de precios */}
              <Card className="bg-white border-2 border-[#629960] p-6">
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
        </div>

        {/* Tabs de información */}
        <ProductTabs
          translation={translation}
          language={language}
          t={t}
        />

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