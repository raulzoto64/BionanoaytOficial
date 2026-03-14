"use client";

import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  FileText, 
  FolderTree, 
  Settings, 
  Languages,
  ChevronLeft,
  BookOpen,
  FileEdit,
  Users,
  UsersRound,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export function MobileAdminMenu() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Usuarios y Roles' },
    { path: '/admin/products', icon: Package, label: 'Productos' },
    { path: '/admin/prices', icon: DollarSign, label: 'Precios' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categorías' },
    { path: '/admin/content', icon: FileText, label: 'Contenido CMS' },
    { path: '/admin/translations', icon: Languages, label: 'Traducciones' },
    { path: '/admin/blog/posts', icon: FileEdit, label: 'Artículos del Blog' },
    { path: '/admin/blog/categories', icon: BookOpen, label: 'Categorías del Blog' },
    { path: '/admin/ecosystem', icon: UsersRound, label: 'Ecosistema' },
    { path: '/admin/legal', icon: FileText, label: 'Páginas Legales' },
    { path: '/admin/footer', icon: FileText, label: 'Footer' },
    { path: '/admin/settings', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#1C5D15]"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#1C5D15] text-white shadow-lg z-50">
          <div className="p-4 border-b border-[#629960]/30">
            <h2 className="text-xl font-bold text-[#19FF00]">Admin Panel</h2>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
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
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-[#629960]/30">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#629960]/30 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span>Volver al sitio</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}