import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../hooks/useAuth";

export function LoginButton() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const isAdmin = user?.role === 'admin';

  const handleLoginClick = () => {
    // LOGS DE VERIFICACIÓN
    console.log("--- Verificación de Autenticación ---");
    console.log("¿Está autenticado?:", isAuthenticated);
    console.log("Datos del usuario:", user);
    console.log("Rol del usuario:", user?.role);
    console.log("¿Es Admin (check interno)?:", isAdmin);

    if (isAdmin) {
      console.log("Resultado: Es Admin. Redirigiendo a /admin");
      navigate("/admin");
    } else if (isAuthenticated) {
      console.log("Resultado: Usuario autenticado (no admin). Redirigiendo a /admin");
      navigate("/admin"); 
    } else {
      console.log("Resultado: No autenticado. Redirigiendo a /login");
      navigate("/login");
    }
    console.log("-------------------------------------");
  };

  return (
    <Button
      size="sm"
      className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
      onClick={handleLoginClick}
    >
      <User className="w-4 h-4 mr-2" />
      {isAdmin ? t('nav.adminPanel') : (isAuthenticated ? t('nav.admin') : t('nav.login'))}
    </Button>
  );
}