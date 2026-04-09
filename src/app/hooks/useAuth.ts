import { useState, useEffect } from 'react';
import { User, supabaseAPI } from '../data/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Purgar sesión zombie de demo si existe
        if (parsedUser.id === 'user-demo-001') {
          console.warn('Sesión demo detectada y purgada para compatibilidad con Supabase');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    
    // Sincronizar visitante con la BD si no está autenticado
    const guestId = localStorage.getItem('guest_id');
    if (guestId) {
      supabaseAPI.upsertGuest(guestId);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (userData: User) => {
    // Fusionar carrito si existe un Id de invitado
    const guestId = localStorage.getItem('guest_id');
    if (guestId && userData.id) {
      try {
        await supabaseAPI.mergeGuestCart(userData.id, guestId);
        // Opcional: limpiar guest_id después de fusionar para empezar de cero
        // localStorage.removeItem('guest_id'); 
      } catch (error) {
        console.error("Error al fusionar carritos:", error);
      }
    }
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;

  // Generar o obtener guest_id
  const getGuestId = () => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  };

  const isGuest = !isAuthenticated;

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    getGuestId,
    isGuest,
    guestId: getGuestId(),
  };
};
