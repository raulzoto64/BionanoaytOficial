import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export function LoginButton() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const handleAction = () => {
    if (isAdmin) {
      navigate("/admin");
    } else if (isAuthenticated) {
      // Si ya está autenticado pero no es admin (ej: cliente), 
      // por ahora simplemente cerramos sesión para limpiar el estado
      logout();
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <Button
      size="sm"
      className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
      onClick={handleAction}
    >
      <User className="w-4 h-4 mr-2" />
      {isAdmin ? t('adminPanel') : (isAuthenticated ? "Cerrar Sesión" : t('login'))}
    </Button>
  );
}