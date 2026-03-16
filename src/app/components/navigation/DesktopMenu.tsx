import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useLanguage } from "../../contexts/LanguageContext";
import { supabaseAPI, Category } from "../../data/supabase";
import { LoginButton } from "./LoginButton";
import { LanguageSelector } from "./LanguageSelector";
import { CartIndicator } from "./CartIndicator";

interface DesktopMenuProps {
  scrollToSection: (sectionId: string) => void;
}

export function DesktopMenu({ scrollToSection }: DesktopMenuProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();
  const { language, t } = useLanguage();

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
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, [language]);

  return (
    <div className="hidden md:flex items-center gap-6">
      {/* Conócenos Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
          {t("nav.about")} <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem onClick={() => scrollToSection("purpose")}>
            {language === "es" ? "Propósito empresarial" : "Business purpose"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("featured")}>
            {language === "es" ? "Producto estrella: Bionanoaxus" : "Star product: Bionanoaxus"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("products")}>
            {t("nav.products_catalog")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("timeline")}>
            {language === "es" ? "Trayectoria" : "Timeline"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("team")}>
            {language === "es" ? "Equipo de trabajo" : "Work team"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("allies")}>
            {language === "es" ? "Empresas aliadas" : "Allied companies"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("ecosystem")}>
            {language === "es" ? "Ecosistema colaborativo" : "Collaborative ecosystem"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => scrollToSection("contact")}>
            {t("footer.contact")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tecnología Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
          {t("nav.technology")} <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem onClick={() => navigate("/technology")}>
            {language === "es" ? "Nuestra tecnología" : "Our technology"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/process")}>
            {language === "es" ? "Nuestro proceso" : "Our process"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Productos Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#19FF00] transition-colors">
          {t("nav.products")} <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem onClick={() => navigate("/store")}>
            {language === "es" ? "Todos los productos" : "All products"}
          </DropdownMenuItem>
          {categories.map((cat) => (
            <DropdownMenuItem key={cat.id} onClick={() => {
              navigate(`/store?category=${cat.id}`);
              // Forzar scroll al inicio
              setTimeout(() => {
                window.scrollTo(0, 0);
              }, 100);
            }}>
              {cat.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to="/blog" className="hover:text-[#19FF00] transition-colors">
        {t("nav.blog")}
      </Link>

      <Link to="/store" className="hover:text-[#19FF00] transition-colors">
        {t("nav.store")}
      </Link>

      <LanguageSelector />

      {/* Contenedor de Carrito y Login con mayor separación */}
      <div className="flex items-center gap-4 ml-2">
        <CartIndicator />
        
        {/* Usamos ml-6 para dar una separación clara hacia la derecha */}
        <div className="ml-6">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}