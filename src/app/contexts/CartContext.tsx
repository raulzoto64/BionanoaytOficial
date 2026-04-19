import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabaseAPI, CartItemWithProduct } from '../data/supabase';
import { useAuthContext } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, guestId, isAuthenticated } = useAuthContext();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      if (isAuthenticated && user) {
        const cartItems = await supabaseAPI.getCartItems(user.id);
        setItems(cartItems);
      } else if (guestId) {
        const cartItems = await supabaseAPI.getCartItemsByGuest(guestId);
        setItems(cartItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      // Failed to refresh cart - fail silently or handle in UI
    } finally {
      setIsLoading(false);
    }
  }, [user, guestId, isAuthenticated]);

  useEffect(() => {
    refreshCart();

    const handleCartUpdate = () => {
      refreshCart();
    };

    const handleFocus = () => {
      refreshCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshCart]);

  // Recalcular el conteo total de items (suma de cantidades)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    items,
    itemCount,
    isLoading,
    refreshCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
