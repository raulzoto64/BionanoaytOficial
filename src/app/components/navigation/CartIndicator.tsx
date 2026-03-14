import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabaseAPI } from "../../data/supabase";
import { toast } from "sonner";

export function CartIndicator() {
  const { user, guestId, isAuthenticated, isGuest } = useAuth();
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartCount();
  }, [user, guestId, isAuthenticated, isGuest]);

  const loadCartCount = async () => {
    try {
      if (isAuthenticated && user) {
        const items = await supabaseAPI.getCartItems(user.id);
        setItemCount(items.reduce((total, item) => total + item.quantity, 0));
      } else if (isGuest && guestId) {
        const items = await supabaseAPI.getCartItems(guestId);
        setItemCount(items.reduce((total, item) => total + item.quantity, 0));
      } else {
        setItemCount(0);
      }
    } catch (error) {
      toast.error('Error al cargar el carrito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated || isGuest) {
      navigate("/cart");
    } else {
      toast.info('Inicia sesión o agrega productos para ver tu carrito');
    }
  };

  if (isLoading) {
    return (
      <button className="group relative" onClick={handleCartClick}>
        <ShoppingCart className="w-6 h-6 text-[#629960]" />
        <span className="absolute -top-1 -right-1 bg-[#1C5D15] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          ?
        </span>
      </button>
    );
  }

  return (
    <button className="group relative" onClick={handleCartClick}>
      <ShoppingCart className="w-6 h-6 text-[#629960]" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#1C5D15] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center group-hover:bg-[#19FF00] group-hover:text-[#1C5D15] transition-colors">
          {itemCount}
        </span>
      )}
    </button>
  );
}