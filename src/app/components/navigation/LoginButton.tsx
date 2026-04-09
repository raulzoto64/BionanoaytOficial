import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";

export function LoginButton() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleAction = () => {
    if (isAdmin) {
      navigate("/admin");
    } else if (isAuthenticated) {
      // Pedir confirmación antes de cerrar sesión
      setLogoutConfirmOpen(true);
    } else {
      navigate("/login");
    }
  };

  const confirmLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
    setLogoutConfirmOpen(false);
  };

  return (
    <>
      <Button
        size="sm"
        className="bg-[#19FF00] text-[#1C5D15] rounded-full px-6 transition-all duration-300 hover:bg-white hover:text-[#1C5D15] hover:shadow-lg hover:shadow-[#19FF00]/20 active:scale-95 hover:-translate-y-0.5 font-bold tracking-wide uppercase text-[11px] h-9 cursor-pointer"
        onClick={handleAction}
      >
        <User className="w-3.5 h-3.5 mr-2" />
        {isAdmin ? t('adminPanel') : (isAuthenticated ? "Cerrar Sesión" : t('login'))}
      </Button>

      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1C5D15]">¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas salir de tu cuenta?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}