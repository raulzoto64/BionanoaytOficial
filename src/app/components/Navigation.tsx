import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./navigation/Logo";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { useNavigate } from "react-router";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const isHome = window.location.pathname === "/";
    
    // ✅ Eliminar el carácter '#' si viene incluido
    const cleanId = sectionId.replace('#', '');
    
    if (isHome) {
      // ✅ Simplemente actualizamos el hash para que Home.tsx (el motor inteligente) tome el control
      window.location.hash = cleanId;
      
      // Forzar actualización si el hash ya era el mismo (para repetir el scroll si el usuario está perdido)
      if (window.location.hash === '#' + cleanId) {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    } else {
      // ✅ Si no estamos en Home, guardamos el destino y navegamos.
      // Al llegar a Home, el useEffect de targetAnchor lo detectará.
      sessionStorage.setItem('bx_return_section', cleanId);
      navigate("/");
    }
    
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#1C5D15] text-white fixed top-0 w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-5 min-[1000px]:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <DesktopMenu scrollToSection={scrollToSection} />

          {/* Mobile Menu Button */}
          <button
            className="min-[1000px]:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-300 hover:bg-[#19FF00] hover:text-[#1C5D15] hover:border-[#19FF00] hover:scale-110 active:scale-90 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 transition-transform duration-300 rotate-90" /> : <Menu className="w-5 h-5 transition-transform duration-300" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          scrollToSection={scrollToSection}
        />
      </div>
    </nav>
  );
}