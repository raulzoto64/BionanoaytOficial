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
  ChevronRight,
  BookOpen,
  FileEdit,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
    { path: '/admin/settings', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-[#1C5D15] text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#629960]/30">
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

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
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
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#629960]/30">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#629960]/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {!collapsed && <span>Volver al sitio</span>}
        </Link>
      </div>
    </aside>
  );
}
