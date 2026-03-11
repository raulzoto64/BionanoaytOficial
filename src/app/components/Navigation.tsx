import { useState, useEffect } from "react";
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
import { supabaseAPI, Category } from "../data/supabase";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  // Load categories on component mount and when language changes
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await supabaseAPI.getCategories();
        const categoriesWithTranslations = await Promise.all(
          categoriesData.map(async (cat: Category) => {
            const translation = await supabaseAPI.getCategoryTranslation(cat.id, language);
            return {
              id: cat.id,
              name: translation?.name || cat.slug,
            };
          })
        );
        setCategories(categoriesWithTranslations);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, [language]);

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
                {t('nav.about')} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => scrollToSection("purpose")}>
                  {language === 'es' ? 'Propósito empresarial' : 'Business purpose'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("featured")}>
                  {language === 'es' ? 'Producto estrella: Bionanoaxus' : 'Star product: Bionanoaxus'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("products")}>
                  {t('nav.products_catalog')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("team")}>
                  {language === 'es' ? 'Equipo de trabajo' : 'Work team'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("allies")}>
                  {language === 'es' ? 'Empresas aliadas' : 'Allied companies'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("ecosystem")}>
                  {language === 'es' ? 'Ecosistema colaborativo' : 'Collaborative ecosystem'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/process")}>
                  {language === 'es' ? 'Nuestro proceso' : 'Our process'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("contact")}>
                  {t('footer.contact')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tecnología Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
                {t('nav.technology')} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => navigate("/technology")}>
                  {language === 'es' ? 'Nuestra tecnología' : 'Our technology'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => scrollToSection("timeline")}>
                  {language === 'es' ? 'Trayectoria' : 'Timeline'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Productos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
                {t('nav.products')} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => navigate("/store")}>
                  {language === 'es' ? 'Todos los productos' : 'All products'}
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={() => navigate(`/store?category=${cat.id}`)}>
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Blog */}
            <Link 
              to="/blog" 
              className="hover:text-[#19FF00] transition-colors"
            >
              {t('nav.blog')}
            </Link>

            {/* Tienda */}
            <Link 
              to="/store" 
              className="hover:text-[#19FF00] transition-colors"
            >
              {t('nav.store')}
            </Link>

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

            {/* Cart & Login */}
            <div className="flex items-center gap-3">
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
                {t('nav.login')}
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
                {language === 'es' ? 'Inicio' : 'Home'}
              </Link>
              <button 
                className="hover:text-[#19FF00] transition-colors text-left"
                onClick={() => {
                  scrollToSection("purpose");
                  setMobileMenuOpen(false);
                }}
              >
                {language === 'es' ? 'Propósito empresarial' : 'Business purpose'}
              </button>
              <button 
                className="hover:text-[#19FF00] transition-colors text-left"
                onClick={() => {
                  scrollToSection("team");
                  setMobileMenuOpen(false);
                }}
              >
                {language === 'es' ? 'Equipo de trabajo' : 'Work team'}
              </button>
              <button 
                className="hover:text-[#19FF00] transition-colors text-left"
                onClick={() => {
                  scrollToSection("products");
                  setMobileMenuOpen(false);
                }}
              >
                {t('nav.products')}
              </button>
              <Link 
                to="/technology" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.technology')}
              </Link>
              <Link 
                to="/blog" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link 
                to="/store" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.store')}
              </Link>
              <Link 
                to="/login" 
                className="hover:text-[#19FF00] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}