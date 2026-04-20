"use client";

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { API_BASE_URL, getApiHeaders } from '../../data/apiConfig';
import { supabaseAPI } from '../../data/supabase';
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
  ListTodo,
  Users,
  Globe,
  Scale,
  Footprints,
  Home,
  LogOut,
  UserPlus,
  Megaphone,
  ShoppingCart,
  Target,
  LineChart,
  MessageCircle,
  Database,
  ShoppingCart as CartIcon
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
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
  const [unreadLeads, setUnreadLeads] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);
  
  // States para submenús
  const [cmsOpen, setCmsOpen] = useState(
    location.pathname.startsWith('/admin/content') ||
    location.pathname.startsWith('/admin/blog') ||
    location.pathname.startsWith('/admin/legal') ||
    location.pathname.startsWith('/admin/footer')
  );
  
  const [marketingOpen, setMarketingOpen] = useState(
    location.pathname.startsWith('/admin/leads') ||
    location.pathname.startsWith('/admin/forms') ||
    location.pathname.startsWith('/admin/chats')
  );

  const [salesOpen, setSalesOpen] = useState(
    location.pathname.startsWith('/admin/sales')
  );

  const [productsOpen, setProductsOpen] = useState(
    location.pathname.startsWith('/admin/products') ||
    location.pathname.startsWith('/admin/prices') ||
    location.pathname.startsWith('/admin/categories')
  );
  
  // ✅ Sistema de Notificaciones en Tiempo Real
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [leads, chats] = await Promise.all([
          fetch(`${API_BASE_URL}/leads`, { headers: getApiHeaders() }).then(r => r.json()),
          supabaseAPI.getChats()
        ]);

        const newLeadsCount = Array.isArray(leads) ? leads.filter((l: any) => l.status === 'new').length : 0;
        const pendingChatsCount = Array.isArray(chats) ? chats.filter((c: any) => c.unread_count_admin > 0).length : 0;
        
        setUnreadLeads(newLeadsCount);
        setUnreadChats(pendingChatsCount);
      } catch (e) {
        console.warn('[SIDEBAR] Error fetching counts:', e);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Cada 30 seg
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
    navigate("/");
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Usuarios y Roles' },
  ];

  const productsSubItems = [
    { path: '/admin/products', icon: Package, label: 'Listado Productos' },
    { path: '/admin/prices', icon: DollarSign, label: 'Precios y Ofertas' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categorías' },
  ];

  const marketingSubItems = [
    { path: '/admin/leads', icon: UserPlus, label: 'Leads / Contactos' },
    { path: '/admin/chats', icon: MessageCircle, label: 'Chat de Usuarios' },
    { path: '/admin/forms', icon: ListTodo, label: 'Formularios' },
  ];

  const salesSubItems = [
    { path: '/admin/sales/active-carts', icon: ShoppingCart, label: 'Relación de Carritos' },
    { path: '/admin/sales/checkout-leads', icon: CartIcon, label: 'Leads de Pago' },
    { path: '/admin/sales/analytics', icon: LineChart, label: 'Motor de Crecimiento' },
  ];

  const cmsSubItems = [
    { path: '/admin/content', icon: Globe, label: 'Páginas' },
    { path: '/admin/sections', icon: Database, label: 'Secciones' },
    { path: '/admin/blog/posts', icon: FileEdit, label: 'Blog' },
    { path: '/admin/legal', icon: Scale, label: 'Páginas Legales' },
    { path: '/admin/visual-editor/footer/global', icon: Footprints, label: 'Footer' },
  ];

  const mainFooterItems = [
    { path: '/admin/translations', icon: Languages, label: 'Traducciones' },
    { path: '/admin/settings', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

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
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white p-2"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Items - Scroll Invisible Custom HTML approach */}
        <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                        : 'text-white hover:bg-[#629960]/30'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}

            {/* PRODUCTOS */}
            <li>
              <button
                onClick={() => !collapsed && setProductsOpen(!productsOpen)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  productsSubItems.some(i => isActive(i.path))
                    ? 'bg-[#19FF00] text-[#1C5D15]'
                    : 'text-white hover:bg-[#629960]/30'
                }`}
              >
                <Package className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">Productos</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              {!collapsed && productsOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l-2 border-[#629960]/40 pl-3">
                  {productsSubItems.map((sub) => (
                    <li key={sub.path}>
                      <Link to={sub.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive(sub.path) ? 'bg-[#19FF00]/80 text-[#1C5D15] font-semibold' : 'text-white'}`}>
                        <sub.icon className="w-4 h-4" /> <span>{sub.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* MARKETING */}
            <li>
              <button
                onClick={() => !collapsed && setMarketingOpen(!marketingOpen)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${
                    marketingSubItems.some(i => isActive(i.path))
                    ? 'bg-[#19FF00] text-[#1C5D15]'
                    : 'text-white hover:bg-[#629960]/30'
                }`}
              >
                <Megaphone className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">Marketing</span>
                    {(unreadLeads + unreadChats > 0) && !marketingOpen && (
                      <span className="bg-[#19FF00] text-[#1C5D15] text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-pulse border-2 border-[#1C5D15]">
                        {unreadLeads + unreadChats}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${marketingOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
                {collapsed && (unreadLeads + unreadChats > 0) && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#19FF00] rounded-full border-2 border-[#1C5D15] animate-pulse"></span>
                )}
              </button>
              {!collapsed && marketingOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l-2 border-[#629960]/40 pl-3">
                  {marketingSubItems.map((sub) => {
                    const count = sub.path.includes('leads') ? unreadLeads : (sub.path.includes('chats') ? unreadChats : 0);
                    return (
                      <li key={sub.path}>
                        <Link to={sub.path} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${isActive(sub.path) ? 'bg-[#19FF00]/80 text-[#1C5D15] font-semibold' : 'text-white'}`}>
                          <div className="flex items-center gap-3">
                            <sub.icon className="w-4 h-4" /> <span>{sub.label}</span>
                          </div>
                          {count > 0 && (
                            <span className="bg-[#19FF00] text-[#1C5D15] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#1C5D15]/20">
                              {count}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {/* VENTAS */}
            <li>
              <button
                onClick={() => !collapsed && setSalesOpen(!salesOpen)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    salesSubItems.some(i => isActive(i.path))
                    ? 'bg-[#19FF00] text-[#1C5D15]'
                    : 'text-white hover:bg-[#629960]/30'
                }`}
              >
                <Target className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">Ventas</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${salesOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              {!collapsed && salesOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l-2 border-[#629960]/40 pl-3">
                  {salesSubItems.map((sub) => (
                    <li key={sub.path}>
                      <Link to={sub.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive(sub.path) ? 'bg-[#19FF00]/80 text-[#1C5D15] font-semibold' : 'text-white'}`}>
                        <sub.icon className="w-4 h-4" /> <span>{sub.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* CMS */}
            <li>
              <button
                onClick={() => !collapsed && setCmsOpen(!cmsOpen)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  cmsSubItems.some(i => isActive(i.path))
                    ? 'bg-[#19FF00] text-[#1C5D15]'
                    : 'text-white hover:bg-[#629960]/30'
                }`}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">Contenido CMS</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${cmsOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              {!collapsed && cmsOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l-2 border-[#629960]/40 pl-3">
                  {cmsSubItems.map((sub) => (
                    <li key={sub.path}>
                      <Link to={sub.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive(sub.path) ? 'bg-[#19FF00]/80 text-[#1C5D15] font-semibold' : 'text-white'}`}>
                        <sub.icon className="w-4 h-4" /> <span>{sub.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* FOOTER ITEMS */}
            {mainFooterItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-[#19FF00] text-[#1C5D15]'
                        : 'text-white hover:bg-[#629960]/30'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Bar */}
        <div className={`py-4 border-t border-[#629960]/30 flex items-center px-4 ${collapsed ? 'flex-col gap-4' : 'justify-around overflow-visible'}`}>
          <Link to="/" className="text-white"><Home size={20}/></Link>
          <NotificationCenter />
          <button onClick={() => setLogoutConfirmOpen(true)} className="text-red-400 hover:text-red-300"><LogOut size={20}/></button>
        </div>
      </aside>

      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>¿Estás seguro de que deseas salir del panel?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white">Cerrar Sesión</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
