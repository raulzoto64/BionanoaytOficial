import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { supabaseAPI, CartItemWithProduct } from "../data/supabase";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

// Interface para cart items con información de precio
interface CartItemWithPrice extends CartItemWithProduct {
  pricePerUnit: number;
  totalPrice: number;
  currency: string;
}

export function Cart() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithPrice[]>([]);
  
  // Iniciamos en true para que el Skeleton sea lo primero en renderizarse
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Solo ejecutamos la carga si el estado de auth está definido
    // Si no hay usuario ni autenticación, dejamos de cargar para mostrar el estado "Login"
    if (isAuthenticated === false) {
      setLoading(false);
      return;
    }

    if (isAuthenticated && user) {
      loadCartItems();
    }
  }, [user, isAuthenticated]);

  const loadCartItems = async () => {
    try {
      setLoading(true); // Bloqueamos la vista con el Skeleton
      
      const items = await supabaseAPI.getCartItems(user!.id);
      
      if (!items || items.length === 0) {
        setCartItems([]);
        setSubtotal(0);
        return;
      }
      
      // Obtener información de precio para cada item
      const itemsWithPrices = await Promise.all(
        items.map(async (item) => {
          const priceInfo = await supabaseAPI.calculatePrice(item.product_id, item.quantity);
          return {
            ...item,
            pricePerUnit: priceInfo?.pricePerUnit || 0,
            totalPrice: priceInfo?.total || 0,
            currency: priceInfo?.currency || 'COP'
          };
        })
      );
      
      setCartItems(itemsWithPrices);
      const total = itemsWithPrices.reduce((sum, item) => sum + item.totalPrice, 0);
      setSubtotal(total);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      toast.error('Error al conectar con la base de datos');
    } finally {
      // Un pequeño delay para que la transición sea visualmente suave
      setTimeout(() => setLoading(false), 500);
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    try {
      const item = cartItems.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);
      await supabaseAPI.updateCartItemQuantity(itemId, newQuantity);
      
      const priceInfo = await supabaseAPI.calculatePrice(item.product_id, newQuantity);
      
      setCartItems(items =>
        items.map(i =>
          i.id === itemId
            ? {
                ...i,
                quantity: newQuantity,
                pricePerUnit: priceInfo?.pricePerUnit || 0,
                totalPrice: priceInfo?.total || 0,
                currency: priceInfo?.currency || 'COP'
              }
            : i
        )
      );
      
      // Recalcular subtotal directamente desde el nuevo estado para mayor precisión
      setCartItems(currentItems => {
        const total = currentItems.reduce((sum, i) => sum + i.totalPrice, 0);
        setSubtotal(total);
        return currentItems;
      });

    } catch (error) {
      toast.error('Error al actualizar cantidad');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await supabaseAPI.removeFromCart(itemId);
      const itemToRemove = cartItems.find(i => i.id === itemId);
      setCartItems(items => items.filter(i => i.id !== itemId));
      if (itemToRemove) {
        setSubtotal(prev => prev - itemToRemove.totalPrice);
      }
      toast.success("Producto eliminado");
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const shipping = 15000;
  const total = subtotal + shipping;

  const renderCart = () => {
    // 1. Prioridad: Mostrar Skeleton mientras carga o mientras se valida el usuario
    if (loading) {
      return (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md flex gap-4 items-center animate-pulse border border-gray-100">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md animate-pulse h-64"></div>
          </div>
        </div>
      );
    }

    // 2. Si no está cargando y no hay sesión
    if (!isAuthenticated || !user) {
      return (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-24 h-24 text-[#629960] mx-auto mb-6 opacity-30" />
          <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">Inicia sesión para ver tu carrito</h2>
          <Button onClick={() => navigate("/login")} className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] px-8 py-6 text-lg">
            Iniciar sesión
          </Button>
        </div>
      );
    }

    // 3. Si no está cargando y el carrito está realmente vacío tras consultar la DB
    if (cartItems.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-24 h-24 text-[#629960] mx-auto mb-6 opacity-30" />
          <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">Tu carrito está vacío</h2>
          <Button onClick={() => navigate("/store")} className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] px-8 py-6 text-lg">
            Ir a la tienda
          </Button>
        </div>
      );
    }

    // 4. Mostrar el contenido real del carrito
    return (
      <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg flex gap-4 items-center border border-gray-50 hover:border-[#629960]/30 transition-all">
              <img
                src={item.product.images?.[0] || item.product.image || `https://via.placeholder.com/150`}
                alt={item.translation.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#1C5D15] mb-1">{item.translation.name}</h3>
                <p className="text-[#629960] text-lg">
                  ${item.pricePerUnit.toLocaleString('es-CO')}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-full">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-[#19FF00] transition-colors flex items-center justify-center">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-[#1C5D15] w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-[#19FF00] transition-colors flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-xl sticky top-24 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1C5D15] mb-6">Resumen del Pedido</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#629960] text-lg">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-[#629960] text-lg">
                <span>Envío</span>
                <span>${shipping.toLocaleString('es-CO')}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-2xl font-bold text-[#1C5D15]">
                <span>Total</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
            </div>
            <Button className="w-full bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] py-7 text-xl font-bold mb-4 shadow-lg shadow-[#1C5D15]/20">
              Proceder al Pago
            </Button>
            <Button variant="outline" className="w-full border-[#1C5D15] text-[#1C5D15] py-6" onClick={() => navigate("/store")}>
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#1C5D15] mb-10 flex items-center gap-4">
           <ShoppingBag className="w-10 h-10" /> Carrito de Compras
        </h1>
        {renderCart()}
      </div>
    </div>
  );
}