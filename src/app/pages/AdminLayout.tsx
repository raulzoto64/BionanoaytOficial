import { Outlet, useNavigate } from 'react-router';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { SEO } from '../components/SEO';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useState } from 'react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
    navigate("/");
  };

  return (
    <LanguageProvider>
      <SEO title="Panel de Administración | Bionano A&T" />
      <ProtectedRoute>
        <div className="min-h-screen flex bg-[#F7F9CE]">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-[#629960]/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-[#1C5D15]">Sistema de Administración</h1>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5 text-[#1C5D15]" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#19FF00] rounded-full"></span>
                  </Button>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F9CE] rounded-lg">
                    <User className="w-5 h-5 text-[#1C5D15]" />
                    <span className="text-sm text-[#1C5D15]">{user?.name}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLogoutConfirmOpen(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>

        <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#1C5D15]">¿Cerrar sesión?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas cerrar tu sesión administrativa?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cerrar Sesión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ProtectedRoute>
    </LanguageProvider>
  );
}
