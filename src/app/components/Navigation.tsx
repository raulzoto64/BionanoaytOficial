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
    const handleScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        // En Home usamos el desplazamiento profundo que le gusta al usuario (-600)
        // En otras páginas usamos el ajuste estándar al ras del menú (80)
        const isHome = window.location.pathname === "/";
        const headerOffset = isHome ? -600 : 80; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };

    if (window.location.pathname === "/") {
      handleScroll();
    } else {
      navigate("/");
      setTimeout(handleScroll, 600); // 600ms para asegurar carga de secciones en Home
    }
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