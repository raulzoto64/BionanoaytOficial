import { Outlet } from 'react-router';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Bell, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LanguageProvider } from '../contexts/LanguageContext';

export function AdminLayout() {
  return (
    <LanguageProvider>
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
                  <span className="text-sm text-[#1C5D15]">Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}