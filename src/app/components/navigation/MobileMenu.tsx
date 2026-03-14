import { Link } from "react-router";
import { useLanguage } from "../../contexts/LanguageContext";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToSection: (sectionId: string) => void;
}

export function MobileMenu({ isOpen, onClose, scrollToSection }: MobileMenuProps) {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden py-4 border-t border-[#629960]">
      <div className="flex flex-col gap-4">
        <Link 
          to="/" 
          className="hover:text-[#19FF00] transition-colors"
          onClick={onClose}
        >
          {language === 'es' ? 'Inicio' : 'Home'}
        </Link>
        <button 
          className="hover:text-[#19FF00] transition-colors text-left"
          onClick={() => {
            scrollToSection("purpose");
            onClose();
          }}
        >
          {language === 'es' ? 'Propósito empresarial' : 'Business purpose'}
        </button>
        <button 
          className="hover:text-[#19FF00] transition-colors text-left"
          onClick={() => {
            scrollToSection("team");
            onClose();
          }}
        >
          {language === 'es' ? 'Equipo de trabajo' : 'Work team'}
        </button>
        <button 
          className="hover:text-[#19FF00] transition-colors text-left"
          onClick={() => {
            scrollToSection("products");
            onClose();
          }}
        >
          {t("nav.products")}
        </button>
        <Link 
          to="/technology" 
          className="hover:text-[#19FF00] transition-colors"
          onClick={onClose}
        >
          {t("nav.technology")}
        </Link>
        <Link 
          to="/blog" 
          className="hover:text-[#19FF00] transition-colors"
          onClick={onClose}
        >
          {t("nav.blog")}
        </Link>
        <Link 
          to="/store" 
          className="hover:text-[#19FF00] transition-colors"
          onClick={onClose}
        >
          {t("nav.store")}
        </Link>
        <Link 
          to="/cart" 
          className="hover:text-[#19FF00] transition-colors flex items-center gap-2"
          onClick={onClose}
        >
          <ShoppingCart className="w-5 h-5" />
          {language === 'es' ? 'Carrito' : 'Cart'}
        </Link>
        <Link 
          to={isAuthenticated ? "/admin" : "/login"} 
          className="hover:text-[#19FF00] transition-colors"
          onClick={onClose}
        >
          {isAuthenticated ? t("nav.admin") : t("nav.login")}
        </Link>
      </div>
    </div>
  );
}
