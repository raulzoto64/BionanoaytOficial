import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, supabaseAPI } from '../data/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useVisitor } from '../hooks/useVisitor';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestId: string;
  login: (emailOrUser: string | User, password?: string) => Promise<any>;
  logout: () => Promise<void>;
  getGuestId: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setVisitorId } = useVisitor(); // Asegúrate de que useVisitor también provee setVisitorId

  const getGuestId = useCallback(() => {
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  }, []);

  useEffect(() => {
    // ✅ PRIMERO: Verificar si hay usuario guardado MANUALMENTE en localStorage (FUNCIONA SIEMPRE)
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    } else {
      getGuestId();
    }
    
    setIsLoading(false);
  }, [getGuestId]);

  const login = async (emailOrUser: string | User, password?: string) => {
    let email: string;
    let pass: string;

    if (typeof emailOrUser === 'object') {
      email = emailOrUser.email;
      pass = emailOrUser.password;
    } else {
      email = emailOrUser;
      pass = password!;
    }

    if (!pass) {
      throw new Error('La contraseña es requerida para autenticar');
    }

    try {
      // 1. Usar el nuevo método de login que se conecta a la API MySQL
      const userData = await supabaseAPI.loginUser(email, pass);

      // 2. Actualizamos el estado local
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // 3. Fusionar carrito
      const guestId = localStorage.getItem("guest_id");
      if (guestId && userData.id) {
        try {
          await supabaseAPI.mergeGuestCart(userData.id, guestId);
          localStorage.removeItem("guest_id"); 
          if (typeof setVisitorId === 'function') {
            setVisitorId(null);
          }
        } catch (error) {

        }
      }

      window.dispatchEvent(new CustomEvent("cart-updated"));
      
      return userData;

    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      getGuestId(); 
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (error) {

    }
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
