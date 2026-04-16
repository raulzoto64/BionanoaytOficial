"use client";

import { Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  FileText, 
  FolderTree, 
  Settings, 
  Languages,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileEdit,
  Users,
  Globe,
  Scale,
  Footprints,
  Home,
  LogOut,
  Bell,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
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

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(
    location.pathname.startsWith('/admin/content') ||
    location.pathname.startsWith('/admin/blog') ||
    location.pathname.startsWith('/admin/legal') ||
    location.pathname.startsWith('/admin/footer')
  );

  const handleLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
    navigate("/");
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Usuarios y Roles' },
    { path: '/admin/products', icon: Package, label: 'Productos' },
    { path: '/admin/prices', icon: DollarSign, label: 'Precios' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categorías' },
    { path: '/admin/leads', icon: UserPlus, label: 'Leads / Contactos' },
    { path: '/admin/translations', icon: Languages, label: 'Traducciones' },
    { path: '/admin/settings', icon: Settings, label: 'Configuración' },
  ];

  const cmsSubItems = [
    { path: '/admin/content', icon: Globe, label: 'Páginas' },
    { path: '/admin/blog/posts', icon: FileEdit, label: 'Blog' },
    { path: '/admin/legal', icon: Scale, label: 'Páginas Legales' },
    { path: '/admin/footer', icon: Footprints, label: 'Footer' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isCmsActive = cmsSubItems.some(item => location.pathname.startsWith(item.path));

  return (
    <>
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-[#1C5D15] text-white transition-all duration-300 flex flex-col h-screen sticky top-0 left-0 z-50`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#629960]/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-xl font-bold text-[#19FF00]">Admin Panel</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-[#629960]/30 hover:text-[#19FF00]"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Menu Items - Scroll Invisible */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-[#19FF00] text-[#1C5D15]'
                        : 'text-white hover:bg-[#629960]/30 hover:text-[#19FF00]'
                    }`}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}

            {/* Contenido CMS con submenú */}
            <li>
              <button
                onClick={() => !collapsed && setCmsOpen(!cmsOpen)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isCmsActive
                    ? 'bg-[#19FF00] text-[#1C5D15]'
                    : 'text-white hover:bg-[#629960]/30 hover:text-[#19FF00]'
                }`}
                title={collapsed ? 'Contenido CMS' : ''}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">Contenido CMS</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${cmsOpen ? 'rotate-180' : ''}`}
                    />
                  </>
                )}
              </button>

              {/* Submenú */}
              {!collapsed && cmsOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l-2 border-[#629960]/40 pl-3">
                  {cmsSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = isActive(sub.path);
                    return (
                      <li key={sub.path}>
                        <Link
                          to={sub.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            subActive
                              ? 'bg-[#19FF00]/80 text-[#1C5D15] font-semibold'
                              : 'text-white/80 hover:bg-[#629960]/30 hover:text-[#19FF00]'
                          }`}
                        >
                          <SubIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Footer - Horizontal Icon Bar - Separados en partes iguales (Vertical si está cerrado) */}
        <div className={`py-4 border-t border-[#629960]/30 flex-shrink-0 flex items-center w-full px-2 ${collapsed ? 'flex-col space-y-4 justify-center' : 'flex-row justify-evenly'}`}>
          <Link
            to="/"
            className="text-white hover:text-[#19FF00] p-2 transition-colors rounded-lg hover:bg-white/10"
            title="Ir al inicio"
          >
            <Home className="w-5 h-5" />
          </Link>
          <button
            className="text-white hover:text-[#19FF00] p-2 transition-colors rounded-lg hover:bg-white/10 relative"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-2 w-2 h-2 bg-[#19FF00] rounded-full shadow-sm border border-[#1C5D15]"></span>
          </button>
          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="text-red-400 hover:text-red-300 p-2 transition-colors rounded-lg hover:bg-red-500/20"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
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
    </>
  );
}