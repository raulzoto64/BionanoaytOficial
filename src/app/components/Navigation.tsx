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
            className="min-[1000px]:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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