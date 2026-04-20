import { useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../contexts/CartContext";
import { toast } from "sonner";

export function CartIndicator() {
  const { isAuthenticated, isGuest } = useAuth();
  const { itemCount, isLoading } = useCart();
  const navigate = useNavigate();

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
        <span className="absolute -top-1 -right-1 bg-[#1C5D15] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse border border-white">
          ...
        </span>
      </button>
    );
  }

  return (
    <button className="group relative" onClick={handleCartClick}>
      <ShoppingCart className="w-6 h-6 text-[#629960]" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#1C5D15] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center group-hover:bg-[#19FF00] group-hover:text-[#1C5D15] transition-all duration-300 border border-white shadow-sm">
          {itemCount}
        </span>
      )}
    </button>
  );
}
