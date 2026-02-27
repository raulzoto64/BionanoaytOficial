import { useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";

export function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bionanoaxus (BNX) 500ml",
      price: 45000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=200"
    },
    {
      id: 2,
      name: "Z-Klean 1L",
      price: 35000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=200"
    }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl text-[#1C5D15] mb-8">Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-[#629960] mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl text-[#629960] mb-4">Tu carrito está vacío</h2>
            <Button
              onClick={() => navigate("/store")}
              className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
            >
              Ir a la tienda
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-lg flex gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl text-[#1C5D15] mb-2">{item.name}</h3>
                    <p className="text-[#629960] text-lg">
                      ${item.price.toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-[#19FF00] transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl text-[#1C5D15] w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-[#19FF00] transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h2 className="text-2xl text-[#1C5D15] mb-6">Resumen del Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#629960]">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-[#629960]">
                    <span>Envío</span>
                    <span>${shipping.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl text-[#1C5D15]">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] py-6 text-lg mb-3"
                >
                  Proceder al Pago
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-[#1C5D15] text-[#1C5D15] hover:bg-gray-50"
                  onClick={() => navigate("/store")}
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
