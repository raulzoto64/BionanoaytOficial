import { Outlet } from 'react-router';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { SEO } from '../components/SEO';
import { useState } from 'react';
import { NotificationCenter } from '../components/admin/NotificationCenter';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <SEO title="Panel de Administración | Bionano A&T" />
      <ProtectedRoute>
        <div className="h-screen flex bg-[#F7F9CE] overflow-hidden">
          {/* Global Floating Actions Target for Save Buttons */}
          <div 
            id="admin-header-actions" 
            className="fixed top-4 right-4 md:top-6 md:right-8 z-[70] flex items-center gap-3 pointer-events-auto"
          ></div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[60] md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative z-[61] h-full w-20">
                <AdminSidebar />
              </div>
            </div>
          )}
          
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Mobile Nav Top Bar (Only visible on mobile) */}
            <div className="md:hidden flex items-center justify-between p-4 bg-transparent absolute top-0 left-0 right-0 z-40 pointer-events-none">
              <div className="flex items-center gap-4 pointer-events-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 backdrop-blur shadow-sm hover:bg-white text-[#1C5D15] rounded-xl"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="relative bg-[#1C5D15] rounded-xl flex items-center justify-center pointer-events-auto">
                  <NotificationCenter collapsed={true} />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            {/* on Mobile: padding-top to account for the floating hamburger. on Desktop: flush to the top but with generic padding */}
            <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[#F7F9CE] pt-24 md:pt-6 pb-12 w-full">
              <Outlet />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </LanguageProvider>
  );
}
