import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, User, Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "../contexts/LanguageContext";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    // Si ya estamos en la home, hacer scroll directamente
    if (location.pathname === "/") {
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
      }, 100);
    }
  };

  return (
    <nav className="bg-[#1C5D15] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#19FF00] rounded-full flex items-center justify-center">
              <span className="text-[#1C5D15] font-bold text-xl">A&T</span>
            </div>
            <span className="text-xl hidden sm:block">A&T BioNano</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Conócenos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
                Conócenos <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => scrollToSection("purpose")}>
                  Propósito empresarial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("team")}>
                  Equipo de trabajo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("allies")}>
                  Empresas aliadas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("ecosystem")}>
                  Ecosistema colaborativo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/process")}>
                  Nuestro proceso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("contact")}>
                  Contáctanos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tecnología Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
                Tecnología <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => navigate("/technology")}>
                  Nuestra tecnología
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("timeline")}>
                  Trayectoria
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Productos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
                Productos <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => scrollToSection("products")}>
                  Catálogo de productos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("featured")}>
                  Producto estrella: Bionanoaxus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tienda */}
            <Link 
              to="/store" 
              className="hover:text-[#19FF00] transition-colors"
            >
              Tienda
            </Link>

            {/* Cart & Login */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
                  <Globe className="w-4 h-4" />
                  {language.toUpperCase()}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem onClick={() => setLanguage('es')}>
                    🇪🇸 Español
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    🇺🇸 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-[#19FF00] hover:bg-[#19FF00]/10"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              
              <Button
                size="sm"
                className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
                onClick={() => navigate("/login")}
              >
                <User className="w-4 h-4 mr-2" />
                Ingresar
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#629960]">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <button 
                className="hover:text-[#19FF00] transition-colors text-left"
                onClick={() => {
                  scrollToSection("purpose");
                  setMobileMenuOpen(false);
                }}
              >
                Propósito empresarial
              </button>
              <button 
                className="hover:text-[#19FF00] transition-colors text-left"
                onClick={() => {
                  scrollToSection("team");
                  setMobileMenuOpen(false);
                }}
              >
                Equipo de trabajo
              </button>
              <button 
                className="hover:text-[#19FF00] transition-colors text-left"
                onClick={() => {
                  scrollToSection("products");
                  setMobileMenuOpen(false);
                }}
              >
                Productos
              </button>
              <Link 
                to="/technology" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tecnología
              </Link>
              <Link 
                to="/store" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tienda
              </Link>
              <Link 
                to="/login" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}