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
  packaging?: string;
}

export function Cart() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithPrice[]>([]);

  // Iniciamos en true para que el Skeleton sea lo primero en renderizarse
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Cargar carrito tanto para usuarios autenticados como para visitantes
    loadCartItems();
  }, [user, isAuthenticated]);

  const loadCartItems = async () => {
    try {
      setLoading(true); // Bloqueamos la vista con el Skeleton

      let items: CartItemWithProduct[] = [];
      if (isAuthenticated && user) {
        items = await supabaseAPI.getCartItems(user.id);
      } else {
        // Para visitantes, necesitamos obtener el guestId
        const guestId = localStorage.getItem("guest_id");
        if (guestId) {
          items = await supabaseAPI.getCartItemsByGuest(guestId);
        }
      }

      // Si no hay items, mostrar carrito vacío
      if (!items || items.length === 0) {
        
        setCartItems([]);
        setSubtotal(0);
        return;
      }

      // Calcular precios para cada item del carrito
      const itemsWithPrices = await Promise.all(
        items.map(async (item) => {
          const priceInfo = await supabaseAPI.calculatePrice(
            item.product_id,
            item.quantity,
            item.packaging,
          );
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
      const total = itemsWithPrices.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      setSubtotal(total);
    } catch (error) {
      toast.error("Error al conectar con la base de datos");
    } finally {
      // Un pequeño delay para que la transición sea visualmente suave
      setTimeout(() => setLoading(false), 500);
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    try {
      const item = cartItems.find((i) => i.id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);
      const updatedItem = await supabaseAPI.updateCartItemQuantity(
        itemId,
        newQuantity,
      );

      // Calcular precios para el item actualizado
      const priceInfo = await supabaseAPI.calculatePrice(
        updatedItem.product_id,
        updatedItem.quantity,
        updatedItem.packaging,
      );

      setCartItems((items) =>
        items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: updatedItem.quantity,
                pricePerUnit: priceInfo?.pricePerUnit || 0,
                totalPrice: priceInfo?.total || 0,
                currency: priceInfo?.currency || "COP",
              }
            : i,
        ),
      );

      // Recalcular subtotal directamente desde el nuevo estado para mayor precisión
      setCartItems((currentItems) => {
        const total = currentItems.reduce((sum, i) => sum + i.totalPrice, 0);
        setSubtotal(total);
        return currentItems;
      });
    } catch (error) {
      toast.error("Error al actualizar cantidad");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await supabaseAPI.removeFromCart(itemId);
      const itemToRemove = cartItems.find((i) => i.id === itemId);
      setCartItems((items) => items.filter((i) => i.id !== itemId));
      if (itemToRemove) {
        setSubtotal((prev) => prev - itemToRemove.totalPrice);
      }
      toast.success("Producto eliminado");
    } catch (error) {
      toast.error("Error al eliminar el producto");
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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md flex gap-4 items-center animate-pulse border border-gray-100"
              >
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

    // 2. Si no está cargando y el carrito está vacío (ya sea usuario o visitante)
    if (cartItems.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-24 h-24 text-[#629960] mx-auto mb-6 opacity-30" />
          <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">
            Tu carrito está vacío
          </h2>
          <Button
            onClick={() => navigate("/store")}
            className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] px-8 py-6 text-lg"
          >
            Ir a la tienda
          </Button>

          {/* Opcional: Mostrar invitación a loguearse solo si no está autenticado */}
          {!isAuthenticated && (
            <p className="mt-6 text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#1C5D15] underline"
              >
                Inicia sesión
              </button>{" "}
              para ver tus productos guardados.
            </p>
          )}
        </div>
      );
    }

    // 3. Si no está cargando y el carrito está realmente vacío tras consultar la DB
    if (cartItems.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-24 h-24 text-[#629960] mx-auto mb-6 opacity-30" />
          <h2 className="text-2xl font-bold text-[#1C5D15] mb-4">
            Tu carrito está vacío
          </h2>
          <Button
            onClick={() => navigate("/store")}
            className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] px-8 py-6 text-lg"
          >
            Ir a la tienda
          </Button>
        </div>
      );
    }

    // Agrupar items por producto
    const productsByProductId = cartItems.reduce(
      (acc, item) => {
        if (!acc[item.product_id]) {
          acc[item.product_id] = [];
        }
        acc[item.product_id].push(item);
        return acc;
      },
      {} as Record<string, CartItemWithPrice[]>,
    );

    // 4. Mostrar el contenido real del carrito
    return (
      <div className="grid md:grid-cols-3 gap-8 animate-in fade-in duration-500">
        <div className="md:col-span-2 space-y-6">
          {Object.values(productsByProductId).map((productItems) => (
            <div
              key={productItems[0].product_id}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-50 hover:border-[#629960]/30 transition-all"
            >
              <div className="flex gap-4 mb-4">
                <img
                  src={
                    productItems[0].product.images?.[0] ||
                    productItems[0].product.image ||
                    `https://via.placeholder.com/150`
                  }
                  alt={productItems[0].translation.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1C5D15] mb-1">
                    {productItems[0].translation.name}
                  </h3>
                  <p className="text-sm text-[#629960] mb-2">
                    {productItems[0].translation.short_description}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>★</span>
                    ))}
                    <span className="text-sm text-[#629960] ml-2">(5.0)</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="text-sm font-semibold text-[#1C5D15] mb-2">
                  Embase(s) Seleccionada(s):
                </h4>
                {productItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center mb-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-[#629960]">
                        Embase: {item.packaging}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-sm text-[#1C5D15]">
                          Costo por unidad: $
                          {item.pricePerUnit.toLocaleString("es-CO")}
                        </span>
                        <span className="text-sm text-[#1C5D15]">
                          Costo total: $
                          {item.totalPrice.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-[#19FF00] transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-[#1C5D15] w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-[#19FF00] transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-[#1C5D15]">
                  Total del Producto:
                </span>
                <span className="text-xl font-bold text-[#1C5D15]">
                  $
                  {productItems
                    .reduce((sum, item) => sum + item.totalPrice, 0)
                    .toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-xl sticky top-24 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1C5D15] mb-6">
              Resumen del Pedido
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1C5D15] mb-4">
                Lista de productos seleccionados
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between items-start text-sm">
                      <span className="text-[#629960] flex-1 pr-10">
                        ({item.quantity}) {item.packaging || "Sin embase"} de{" "}
                        {item.translation.name}
                      </span>
                      <span className="font-semibold text-[#1C5D15] whitespace-nowrap">
                        ${item.totalPrice.toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className="text-xs text-[#629960]/70">
                      {item.pricePerUnit.toLocaleString("es-CO")} COP x{" "}
                      {item.quantity} unidades
                    </div>
                    {index < cartItems.length - 1 && (
                      <div className="border-t border-gray-100 my-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[#629960] text-lg">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-[#629960] text-lg">
                  <span>Envío</span>
                  <span>${shipping.toLocaleString("es-CO")}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-2xl font-bold text-[#1C5D15]">
                  <span>Total</span>
                  <span>${total.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] py-7 text-xl font-bold mb-4 shadow-lg shadow-[#1C5D15]/20">
              Proceder al Pago
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#1C5D15] text-[#1C5D15] py-6"
              onClick={() => navigate("/store")}
            >
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
