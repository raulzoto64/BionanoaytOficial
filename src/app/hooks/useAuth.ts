import { useAuthContext } from '../contexts/AuthContext';

/**
 * Hook de compatibilidad que consume el AuthContext global.
 * Centraliza la sesión del usuario (Auth O Invitado) para toda la aplicación.
 */
export const useAuth = () => {
  return useAuthContext();
};
