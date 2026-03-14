import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabaseAPI } from "../data/supabase";
import { toast } from "sonner";

export function AddToCartButton({ productId, packaging, onSuccess }) {
  const { user, guestId, isAuthenticated, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsAdded(false);

    try {
      const userId = isAuthenticated ? user!.id : (isGuest ? guestId! : null);

      if (!userId) {
        toast.error('No se pudo obtener la sesión de usuario');
        setIsLoading(false);
        return;
      }

      await supabaseAPI.addToCart(userId, productId, 1, packaging);
      setIsAdded(true);

      // Mostrar
  const handleCartRedirect = () => {
    navigate("/cart");
  };

  if (isAdded) {
    return (
      <button 
        onClick={handleCartRedirect}
        className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] px-6 py-3 text-lg font-bold transition-colors"
      >
        <Check className="w-5 h-5 mr-2" />
        Ver Carrito
      </button>
    );
  }

  return (
    <button 
      onClick={addToCart}
      disabled={isLoading}
      className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] px-6 py-3 text-lg font-bold transition-colors"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 mr-2 animate-spin" />
          Agregando...
        </span>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Agregar al Carrito
        </>
      )}
    </button>
  );
}