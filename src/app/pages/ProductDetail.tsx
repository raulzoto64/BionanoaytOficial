import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, ShoppingCart, Package, ChevronLeft, ChevronRight, Search, Mail } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../hooks/useDatabase';
import { supabaseAPI, Product, ProductTranslation, PriceByQuantity } from '../data/supabase';
import { toast } from 'sonner';
import { ProductTabs } from '../components/ProductTabs';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { DynamicSection } from '../components/DynamicSection';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  const { updateTrigger } = useDatabase();
  const { user, isAuthenticated, guestId: hookGuestId } = useAuth();
  const { trackEvent } = useAnalytics();

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
  const [packagingOptions, setPackagingOptions] = useState<{original: string, formatted: string}[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  
  const [quoteForm, setQuoteForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });

  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });

  // Efecto para pre-cargar datos del usuario si cambia el estado de auth
  useEffect(() => {
    if (user) {
      setQuoteForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
      setContactForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const handleBack = () => {
    const from = (location.state as any)?.from;
    const sectionId = (location.state as any)?.sectionId;
    navigate("/store", { state: { from, sectionId } });
  };

  // Manejar el guardado del contexto para el botón atrás del navegador
  useEffect(() => {
    const from = (location.state as any)?.from;
    const sectionId = (location.state as any)?.sectionId;
    
    if (from) {
      sessionStorage.setItem('bx_return_from', from);
    }
    if (sectionId) {
      sessionStorage.setItem('bx_return_section', sectionId);
    }
  }, [location.state]);

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

  const formatPackaging = (pkg: string) => {
    if (!pkg) return 'Sin embase';
    const cleanPkg = pkg.trim();
    if (!cleanPkg.includes(' ')) return cleanPkg;
    
    const parts = cleanPkg.split(/\s+/);
    if (parts.length < 2) return cleanPkg;
    
    const hasVolumeUnit = cleanPkg.toLowerCase().includes('litro') || cleanPkg.toLowerCase().includes(' l') || / \d+[Ll]$/.test(cleanPkg);
    const suffix = hasVolumeUnit ? '' : ' litros';
    
    if (!isNaN(Number(parts[0]))) {
      return `${parts[1]} de ${parts[0]}${suffix}`;
    }
    return `${parts[0]} de ${parts[1]}${suffix}`;
  };

  const loadProduct = async () => {
    if (!product) setLoading(true);
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
      
      const pkgMap = new Map<string, string>();
      pricesData.forEach((p: any) => {
        const raw = p.packaging || 'Sin embase';
        if (!pkgMap.has(raw)) {
          pkgMap.set(raw, formatPackaging(raw));
        }
      });

      const options = Array.from(pkgMap.entries()).map(([original, formatted]) => ({ original, formatted }));
      setPackagingOptions(options);
      
      if (options.length > 0 && !selectedPackagingType) {
        setSelectedPackagingType(options[0].original);
      }
    } catch (error) {
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!product || !selectedPackagingType) {
      console.log('⚠️ [PRICING] Skip calculation: missing product or packaging');
      return;
    }
    
    console.log(`💰 [PRICING] Starting for product: ${product.slug}`, {
      quantity,
      packaging: selectedPackagingType
    });

    try {
      const pricing = await supabaseAPI.calculatePrice(product.id, quantity, selectedPackagingType);
      console.log('✅ [PRICING] Calculation success:', pricing);
      setCalculatedPrice(pricing);
    } catch (err) {
      console.error('❌ [PRICING] Calculation error:', err);
    }
  };

  const handleAddToCart = async () => {
    console.log('🛒 [ACTION] handleAddToCart triggered');
    
    if (!product || !translation) {
      console.log('⚠️ [ACTION] Aborted: missing core data', { 
        hasProduct: !!product, 
        hasTranslation: !!translation
      });
      return;
    }

    if (!calculatedPrice) {
      console.log('ℹ️ [ACTION] Proceeding without calculated price (possibly quantity below minimum)');
    }

    try {
      const userId = isAuthenticated && user ? user.id : null;
      const guestId = !isAuthenticated ? hookGuestId : null;

      console.log('👤 [SESSION] Context:', { userId, guestId, isAuth: isAuthenticated });

      if (!userId && !guestId) {
        console.error('❌ [SESSION] No valid identifiers found');
        toast.error('No se pudo obtener la sesión de usuario');
        return;
      }

      console.log('🚀 [API] Sending to addToCart:', {
        productId: product.id,
        quantity,
        packaging: selectedPackagingType
      });

      const result = await supabaseAPI.addToCart(product.id, quantity, userId, guestId, selectedPackagingType);
      console.log('✨ [API] addToCart Succesful result:', result);
      
      // Lanzar rastreador de telemetría de negocio
      await trackEvent('add_to_cart', {
        product_slug: product.slug,
        product_name: translation.name,
        quantity: quantity,
        packaging: selectedPackagingType,
        total_estimate: calculatedPrice?.total || 0
      });
      
      toast.success(`${translation.name} agregado al carrito (${quantity} unidades)`);
    } catch (error: any) {
      console.error('🔥 [FATAL] Error in handleAddToCart:', error);
      toast.error(`Error: ${error.message || 'No se pudo agregar al carrito'}`);
    }
  };

  const handleLeadSubmit = async (type: 'Quote' | 'Contact') => {
    if (!product || !translation) return;
    
    const currentForm = type === 'Quote' ? quoteForm : contactForm;

    if (!currentForm.name || !currentForm.email) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setIsSubmittingLead(true);
      const result = await supabaseAPI.syncLead({
        name: currentForm.name,
        email: currentForm.email,
        phone: type === 'Quote' ? (currentForm as any).phone : '',
        lead_type: type === 'Quote' ? 'Quotation' : 'Contact',
        page_url: window.location.href,
        status: 'new',
        visitor_id: hookGuestId,
        user_id: isAuthenticated && user ? user.id : undefined,
        metadata: {
          product_id: product.id,
          product_name: translation.name,
          packaging: selectedPackagingType,
          quantity: quantity,
          message: currentForm.message,
          source: 'ProductDetail'
        }
      });

      toast.success(type === 'Quote' 
        ? 'Solicitud de cotización enviada correctamente' 
        : 'Mensaje de contacto enviado. Te responderemos pronto.'
      );
      
      if (type === 'Quote') {
        setIsQuoteModalOpen(false);
        setQuoteForm(prev => ({ ...prev, message: '' }));
      } else {
        setIsContactModalOpen(false);
        setContactForm(prev => ({ ...prev, message: '' }));
      }
    } catch (error) {
      console.error('Lead submission failed:', error);
      toast.error('Ocurrió un error al enviar tus datos');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleRequestQuote = () => {
    setIsQuoteModalOpen(true);
  };

  const handleContact = () => {
    setIsContactModalOpen(true);
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

  // Filtrar precios por tipo de embase seleccionado
  const filteredPrices = prices.filter(price => (price.packaging || 'Sin embase') === selectedPackagingType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9CE] to-white">
      {/* Back Button */}
      <div className="bg-[#1C5D15] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-[#19FF00] text-[#1C5D15] hover:bg-white hover:text-[#1C5D15]"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todos los productos
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="bg-white/10 text-white hover:bg-white hover:text-[#1C5D15]"
            >
              Volver a la Home
            </Button>
          </div>
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
                {packagingOptions.length > 1 && (
                  <div className="mb-6">
                    <Label>Tipo de Embase</Label>
                    <Select value={selectedPackagingType} onValueChange={setSelectedPackagingType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {packagingOptions.map((opt) => (
                          <SelectItem key={opt.original} value={opt.original}>
                            {opt.formatted}
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

        {/* SECCIONES DINÁMICAS (EDITOR VISUAL) */}
        <div className="space-y-0 mb-16">
          {(() => {
            let sections = translation.sections || [];
            if (typeof sections === 'string') {
              try { sections = JSON.parse(sections); } catch(e) { sections = []; }
            }
            return (Array.isArray(sections) ? sections : []).map((section: any, index: number) => (
              <DynamicSection 
                key={section.id || index}
                section={section}
                isEditor={false}
                language={language}
              />
            ));
          })()}
        </div>

        {/* Call to Action Final */}
        <Card className="bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white p-8 text-center">
          <h2 className="text-3xl mb-4 text-white">{language === 'es' ? '¿Listo para ordenar?' : 'Ready to order?'}</h2>
          <p className="text-xl mb-6 opacity-90 text-white">
            {language === 'es' 
              ? 'Contáctanos para más información o realiza tu pedido ahora' 
              : 'Contact us for more information or place your order now'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="bg-white text-[#1C5D15] hover:bg-white/90"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('btn.add_to_cart')}
            </Button>
            <Button
              onClick={handleContact}
              size="lg"
              variant="outline"
              className="border-white text-[#1C5D15] hover:bg-white hover:text-[#1C5D15]"
            >
              {t('btn.contact')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Modales de Captura de Leads */}
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#F7F9CE] border-2 border-[#1C5D15]/20 rounded-3xl p-0 overflow-hidden">
          <div className="p-6 bg-[#1C5D15] text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-[#19FF00] uppercase italic tracking-tighter">Solicitar Cotización</DialogTitle>
              <DialogDescription className="font-bold text-[#F7F9CE]/80 text-xs uppercase tracking-widest">
                Recibirás una propuesta formal para {translation.name} ({selectedPackagingType}).
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 grid gap-4">
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Nombre Completo</Label>
              <Input 
                value={quoteForm.name} 
                onChange={e => setQuoteForm({...quoteForm, name: e.target.value})}
                placeholder="Ej: Juan Pérez" 
                className="rounded-xl border-[#629960]/20 bg-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Correo Electrónico</Label>
              <Input 
                value={quoteForm.email}
                onChange={e => setQuoteForm({...quoteForm, email: e.target.value})}
                type="email" 
                placeholder="juan@empresa.com" 
                className="rounded-xl border-[#629960]/20 bg-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Teléfono / WhatsApp</Label>
              <Input 
                value={quoteForm.phone}
                onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})}
                placeholder="+57..." 
                className="rounded-xl border-[#629960]/20 bg-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Requerimiento Especial</Label>
              <textarea 
                value={quoteForm.message}
                onChange={e => setQuoteForm({...quoteForm, message: e.target.value})}
                className="w-full rounded-xl border-[#629960]/20 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C5D15]/20 min-h-[80px]"
                placeholder="¿Tienes alguna solicitud específica?"
              />
            </div>

            <Button 
              onClick={() => handleLeadSubmit('Quote')} 
              disabled={isSubmittingLead}
              className="w-full bg-[#1C5D15] text-[#19FF00] hover:bg-[#1C5D15] font-black uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl shadow-[#1C5D15]/20 mt-2"
            >
              {isSubmittingLead ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border-2 border-[#1C5D15]/20 rounded-3xl p-0 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#19FF00]" />
                Contactar Experto
              </DialogTitle>
              <DialogDescription className="font-bold text-white/70 text-xs uppercase tracking-widest">
                Resolvemos tus dudas técnicas sobre {translation.name}.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 grid gap-4">
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Tu Nombre</Label>
              <Input 
                value={contactForm.name}
                onChange={e => setContactForm({...contactForm, name: e.target.value})}
                className="rounded-xl border-[#629960]/20 bg-[#F7F9CE]/30"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Correo de Respuesta</Label>
              <Input 
                value={contactForm.email}
                onChange={e => setContactForm({...contactForm, email: e.target.value})}
                type="email"
                className="rounded-xl border-[#629960]/20 bg-[#F7F9CE]/30"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-[9px] font-black text-[#1C5D15] tracking-[0.2em]">Consulta</Label>
              <textarea 
                value={contactForm.message}
                onChange={e => setContactForm({...contactForm, message: e.target.value})}
                className="w-full rounded-xl border-[#629960]/20 bg-[#F7F9CE]/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C5D15]/20 min-h-[100px]"
                placeholder="Escribe tu consulta aquí..."
              />
            </div>

            <Button 
              onClick={() => handleLeadSubmit('Contact')} 
              disabled={isSubmittingLead}
              className="w-full bg-[#1C5D15] text-white hover:bg-[#629960] font-black uppercase tracking-[0.2em] py-6 rounded-2xl"
            >
              {isSubmittingLead ? 'Enviando...' : 'Enviar Consulta'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}