import { useState, useEffect } from 'react';
import { User } from '../data/supabase';
import { v4 as uuidv4 } from 'uuid';

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
        localStorage.removeItem('user');
      }
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
  };
};
