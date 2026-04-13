import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, supabaseAPI } from '../data/supabase';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestId: string;
  login: (userData: User) => Promise<User>;
  logout: () => void;
  getGuestId: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getGuestId = useCallback(() => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
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
        await supabaseAPI.upsertGuest(guestId);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Sincronizar entre pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'guest_id') {
        initializeAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (userData: User) => {
    // Fusionar carrito si existe un Id de invitado
    const guestId = localStorage.getItem('guest_id');
    if (guestId && userData.id) {
      try {
        await supabaseAPI.mergeGuestCart(userData.id, guestId);
        // Limpiar guest_id de forma segura tras fusionar con éxito (purga del local)
        localStorage.removeItem('guest_id'); 
      } catch (error) {
        console.error("Error al fusionar carritos durante el login:", error);
        throw error;
      }
    }
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isGuest: !user,
    guestId: getGuestId(),
    login,
    logout,
    getGuestId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
