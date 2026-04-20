import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Plus, Minus, ShoppingBag, Truck, User, Mail, Phone, MapPin, Globe, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { supabaseAPI, CartItemWithProduct } from "../data/supabase";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

interface CartItemWithPrice extends CartItemWithProduct {
  pricePerUnit: number;
  totalPrice: number;
  currency: string;
  packaging?: string;
}

const COUNTRIES = [
  { code: 'CO', name: 'Colombia' },
  { code: 'MX', name: 'México' },
  { code: 'US', name: 'USA' },
  { code: 'ES', name: 'España' },
];

export function Cart() {
  const navigate = useNavigate();
  const { user, guestId, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Formulario de Pago / Envío
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Colombia",
    city: "",
    district: "",
  });
  const [isSavingLead, setIsSavingLead] = useState(false);
  const leadRef = useRef<string | null>(null);

  useEffect(() => {
    loadCartItems();
    // Recuperar datos parciales si existen
    const saved = localStorage.getItem('checkout_draft');
    if (saved) setCheckoutData(JSON.parse(saved));
  }, [user, isAuthenticated]);

  // "Shadow Lead": Guardar datos mientras escribe localmente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...checkoutData, [name]: value };
    setCheckoutData(newData);
    localStorage.setItem('checkout_draft', JSON.stringify(newData));
  };

  // Sincronizar automáticamente a la base de datos tras 1.5s de inactividad al escribir
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      // Evitar llamadas innecesresarias si no hay un email válido todavía
      if (checkoutData.email && checkoutData.email.length >= 5) {
        syncLead(false);
      }
    }, 1500);

    return () => clearTimeout(debounceTimeout);
  }, [checkoutData, cartItems, subtotal]);

  const syncLead = async (isCheckout = false) => {
    console.log(`🚀 [CART/LEAD] Starting syncLead. isCheckout: ${isCheckout}`);
    console.log(`📧 [CART/LEAD] Email: "${checkoutData.email}", Length: ${checkoutData.email?.length || 0}`);
    
    if (!checkoutData.email || checkoutData.email.length < 5) {
      console.warn(`🛑 [CART/LEAD] Aborting: Email invalid or empty.`);
      return;
    }
    
    try {
      setIsSavingLead(true);
      console.log(`💾 [CART/LEAD] Preparing leadData payload...`);
      const leadData = {
        name: checkoutData.name,
        email: checkoutData.email,
        phone: checkoutData.phone,
        country: checkoutData.country,
        city: checkoutData.city,
        district: checkoutData.district,
        lead_type: isCheckout ? 'Checkout Lead' : 'Cart Progress',
        status: isCheckout ? 'checkout_started' : 'in_progress',
        visitor_id: guestId,
        user_id: isAuthenticated && user ? user.id : undefined,
        metadata: {
          cart_total: subtotal,
          items_count: cartItems.length,
          items_list: cartItems.map(i => ({
            name: i.translation?.name || (i as any).name || 'Producto',
            quantity: i.quantity,
            packaging: i.packaging
          })),
          last_pushed: new Date().toISOString()
        }
      };

      console.log(`📡 [CART/LEAD] Sending Payload:`, leadData);
      const result = await supabaseAPI.syncLead(leadData);
      console.log(`✅ [CART/LEAD] Sync success! Lead ID:`, result?.id);
      
      if (result?.id) leadRef.current = result.id;

      // 🔔 Dispatch Realtime Sales Notification only on explicit Checkout request
      if (isCheckout) {
        await supabaseAPI.createNotification({
          target_role: 'sales',
          title: '🔥 Nuevo Intento de Pago!',
          message: `${checkoutData.name} (${checkoutData.email}) ha iniciado el checkout con ${cartItems.length} artículos por un valor de $${subtotal.toLocaleString()} COP.`,
          notification_type: 'lead_alert',
          action_url: '/admin/sales/checkout-leads'
        });
      }
    } catch (err) {
      console.error('❌ [CART/LEAD] Lead sync failed:', err);
    } finally {
      setIsSavingLead(false);
    }
  };

  const loadCartItems = async () => {
    try {
      setLoading(true);
      let items: CartItemWithProduct[] = [];
      if (isAuthenticated && user) {
        items = await supabaseAPI.getCartItems(user.id);
        if (user.name) setCheckoutData(prev => ({ ...prev, name: user.name, email: user.email }));
      } else {
        const guestId = localStorage.getItem("guest_id");
        if (guestId) items = await supabaseAPI.getCartItemsByGuest(guestId);
      }

      if (!items || items.length === 0) {
        setCartItems([]);
        setSubtotal(0);
        return;
      }

      const itemsWithPrices = await Promise.all(
        items.map(async (item) => {
          const priceInfo = await supabaseAPI.calculatePrice(item.product_id, item.quantity, item.packaging ?? '');
          return {
            ...item,
            pricePerUnit: priceInfo?.pricePerUnit || 0,
            totalPrice: priceInfo?.total || 0,
            currency: priceInfo?.currency || "COP",
            packaging: item.packaging,
          };
        }),
      );

      setCartItems(itemsWithPrices);
      setSubtotal(itemsWithPrices.reduce((sum, item) => sum + item.totalPrice, 0));
    } catch (error) {
      toast.error("Error al cargar carrito");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    try {
      const item = cartItems.find((i) => i.id === itemId);
      if (!item) return;
      const newQuantity = Math.max(1, item.quantity + delta);
      await supabaseAPI.updateCartItemQuantity(itemId, newQuantity);
      
      const priceInfo = await supabaseAPI.calculatePrice(item.product_id, newQuantity, item.packaging ?? '');

      setCartItems((items) => {
        const mapped = items.map((i) => i.id === itemId ? {
          ...i,
          quantity: newQuantity,
          pricePerUnit: priceInfo?.pricePerUnit || 0,
          totalPrice: priceInfo?.total || 0,
        } : i);
        setSubtotal(mapped.reduce((sum, current) => sum + current.totalPrice, 0));
        return mapped;
      });
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (error) {
      toast.error("Error al actualizar cantidad");
    }
  };

  const removeItem = async (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (!itemToDelete) return;
    try {
      await supabaseAPI.removeFromCart(itemToDelete);
      const itemToRemove = cartItems.find((i) => i.id === itemToDelete);
      setCartItems((items) => items.filter((i) => i.id !== itemToDelete));
      if (itemToRemove) setSubtotal((prev) => prev - itemToRemove.totalPrice);
      window.dispatchEvent(new CustomEvent('cart-updated'));
      toast.success("Producto eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const shipping = 15000;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#1C5D15] animate-spin" />
            <p className="text-[#1C5D15] font-black uppercase tracking-widest text-xs">Preparando tu carrito...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-[#1C5D15] flex items-center gap-4 tracking-tighter uppercase italic">
            <ShoppingBag className="w-10 h-10 text-[#19FF00]" /> Carrito de Compras
          </h1>
          <p className="text-[#629960] font-bold mt-2 uppercase tracking-widest text-xs">Sostenibilidad y Ciencia a un clic</p>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-[#1C5D15] mb-4 uppercase tracking-tighter">Tu carrito está vacío</h2>
            <Button onClick={() => navigate("/store")} className="bg-[#1C5D15] hover:text-[#1C5D15] px-10 py-7 text-lg font-black uppercase rounded-2xl shadow-2xl">
              Explorar Catálogo
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* LISTA DE PRODUCTOS Y FORMULARIO */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Productos */}
              <div className="space-y-4">
                <h3 className="text-[#1C5D15] font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-[#19FF00] rounded-full"></div> Artículos en tu pedido
                </h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-transparent hover:border-[#19FF00]/20 transition-all flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
                      <img src={item.product?.images?.[0] || item.product?.image || (item as any).image_url || ''} className="w-full h-full object-cover" alt={(item.translation?.name || (item as any).name || 'Producto')} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-black text-[#1C5D15] text-lg uppercase tracking-tight">{item.translation?.name || (item as any).name || 'Producto'}</h4>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                        <span className="text-[10px] font-black bg-[#19FF00]/10 text-[#1C5D15] px-3 py-1 rounded-full uppercase">{item.packaging}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${item.pricePerUnit.toLocaleString()} COP / un.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                       <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-white hover:bg-[#1C5D15] hover:text-white flex items-center justify-center transition-all shadow-sm"><Minus size={14}/></button>
                       <span className="w-8 text-center font-black text-[#1C5D15]">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-white hover:bg-[#1C5D15] hover:text-white flex items-center justify-center transition-all shadow-sm"><Plus size={14}/></button>
                    </div>
                    <div className="text-right min-w-[120px]">
                       <p className="text-lg font-black text-[#1C5D15]">${item.totalPrice.toLocaleString()} COP</p>
                       <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 text-[10px] font-black uppercase mt-1 transition-colors">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulario de Información Pro */}
              <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-[#19FF00]/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#19FF00]/5 rounded-bl-full -z-0"></div>
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                          <h3 className="text-2xl font-black text-[#1C5D15] uppercase tracking-tighter italic">Información de Envío</h3>
                          <p className="text-[10px] text-[#629960] font-bold uppercase tracking-[0.2em] mt-1">Completa tus datos para calcular impuestos y envío final</p>
                       </div>
                       <Truck className="w-10 h-10 text-[#19FF00]/40" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-4">Nombre Completo</label>
                          <div className="relative">
                             <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C5D15]/30" />
                             <input 
                                name="name"
                                type="text" 
                                value={checkoutData.name}
                                onChange={handleInputChange}
                                onBlur={() => syncLead(false)}
                                placeholder="Ej: Juan Pérez"
                                className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 text-sm font-bold text-[#1C5D15] focus:ring-2 focus:ring-[#19FF00]/30 transition-all shadow-inner"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-4">Correo Electrónico</label>
                          <div className="relative">
                             <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C5D15]/30" />
                             <input 
                                name="email"
                                type="email" 
                                value={checkoutData.email}
                                onChange={handleInputChange}
                                onBlur={() => syncLead(false)}
                                placeholder="tu@email.com"
                                className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 text-sm font-bold text-[#1C5D15] focus:ring-2 focus:ring-[#19FF00]/30 transition-all shadow-inner"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-4">Teléfono Móvil</label>
                          <div className="relative">
                             <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C5D15]/30" />
                             <input 
                                name="phone"
                                type="tel" 
                                value={checkoutData.phone}
                                onChange={handleInputChange}
                                onBlur={() => syncLead(false)}
                                placeholder="+57 --- --- -- --"
                                className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 text-sm font-bold text-[#1C5D15] focus:ring-2 focus:ring-[#19FF00]/30 transition-all shadow-inner"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-4">País de Envío</label>
                          <div className="relative">
                             <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C5D15]/30" />
                             <select 
                                name="country"
                                value={checkoutData.country}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 border-none rounded-2xl px-12 h-[52px] text-sm font-bold text-[#1C5D15] focus:ring-2 focus:ring-[#19FF00]/30 shadow-inner appearance-none"
                             >
                                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-4">Ciudad / Municipio</label>
                          <div className="relative">
                             <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C5D15]/30" />
                             <input 
                                name="city"
                                type="text" 
                                value={checkoutData.city}
                                onChange={handleInputChange}
                                onBlur={() => syncLead(false)}
                                placeholder="Ej: Bogotá"
                                className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 text-sm font-bold text-[#1C5D15] focus:ring-2 focus:ring-[#19FF00]/30 shadow-inner"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-4">Distrito / Barrio / Dirección</label>
                          <input 
                            name="district"
                            type="text" 
                            value={checkoutData.district}
                            onChange={handleInputChange}
                            onBlur={() => syncLead(false)}
                            placeholder="Calle 123 #45-67..."
                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1C5D15] focus:ring-2 focus:ring-[#19FF00]/30 shadow-inner"
                          />
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* RESUMEN FLOTANTE */}
            <div className="lg:col-span-4">
              <div className="bg-[#1C5D15] text-white rounded-[3rem] p-8 lg:p-10 shadow-2xl sticky top-24 overflow-hidden border-4 border-[#19FF00]/20">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#19FF00]/5 rounded-full blur-3xl -z-0"></div>
                 
                 <div className="relative z-10">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8 border-b border-white/10 pb-4">Resumen</h2>
                    
                    <div className="space-y-4 mb-10 max-h-48 overflow-y-auto custom-scrollbar-light pr-2">
                       {cartItems.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-start text-xs border-b border-white/5 pb-2">
                            <span className="opacity-70 font-bold">({item.quantity}) {item.translation?.name || (item as any).name || 'Producto'}</span>
                            <span className="font-black text-[#19FF00]">${item.totalPrice.toLocaleString()}</span>
                         </div>
                       ))}
                    </div>

                    <div className="space-y-6 mb-12">
                       <div className="flex justify-between items-center opacity-60">
                          <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                          <span className="font-bold">${subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center opacity-60">
                          <span className="text-xs font-black uppercase tracking-widest">Envío Nacional</span>
                          <span className="font-bold">${shipping.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center pt-6 border-t border-white/10 scale-110 origin-right transition-transform">
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-[#19FF00]">Total Final</span>
                          <span className="text-3xl font-black italic tracking-tighter">${total.toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <Button 
                         onClick={async () => {
                           console.log('🛒 [CART/ACTION] Checkout button clicked!');
                           await syncLead(true);
                           console.log('🛒 [CART/ACTION] Navigating to /checkout...');
                           navigate('/checkout'); 
                         }}
                         className="w-full bg-[#19FF00] text-[#1C5D15] hover:bg-white hover:scale-105 py-8 rounded-[2.5rem] text-lg font-black uppercase tracking-widest transition-all shadow-xl shadow-[#19FF00]/20"
                       >
                          Proceder al Pago <ChevronRight className="ml-2 w-6 h-6" />
                       </Button>
                       <button 
                        onClick={() => navigate('/store')}
                        className="w-full text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                       >
                          Continuar Comprando
                       </button>
                    </div>

                    {isSavingLead && (
                      <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
                        <Loader2 className="w-3 h-3 animate-spin text-[#19FF00]" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Sincronizando lead de seguimiento...</span>
                      </div>
                    )}
                 </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100">
                 <CreditCard className="w-5 h-5 text-[#1C5D15]" />
                 <span className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest leading-none">Pago 100% Seguro <br/> <span className="opacity-40 italic">Cifrado de grado militar</span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white rounded-[2rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[#1C5D15] uppercase tracking-tighter italic">¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#629960] font-medium">
              Estás a punto de quitar este elemento de tu selección sostenible. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-xl border-none bg-gray-100 font-bold uppercase text-[10px] tracking-widest text-gray-500">Volver</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveItem} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest px-8">Confirmar Eliminación</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        .custom-scrollbar-light::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: rgba(25, 255, 0, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}
