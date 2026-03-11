import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../data/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Verificar si se requiere un permiso específico
      if (requiredPermission && user) {
        const hasRequiredPermission = hasPermission(user.role as any, requiredPermission);
        if (!hasRequiredPermission) {
          navigate('/admin'); // Redirigir a dashboard si no tiene permiso
        }
      }
    }
  }, [user, isAuthenticated, isLoading, navigate, requiredPermission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
}