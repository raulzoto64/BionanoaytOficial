import { useState, useEffect } from 'react';
import { User } from '../data/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
      }
    } else {
      // Usuario admin por defecto para pruebas
      const defaultUser: User = {
        id: 'user-001',
        email: 'admin@atbionano.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };
};
