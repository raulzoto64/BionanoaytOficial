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
    // Si ya estamos en la home, hacer scroll directamente
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Si no, navegar a home y luego hacer scroll
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
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