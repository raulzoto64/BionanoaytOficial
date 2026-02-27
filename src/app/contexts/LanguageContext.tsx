import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Navegación
    'nav.about': 'Conócenos',
    'nav.technology': 'Tecnología',
    'nav.products': 'Productos',
    'nav.store': 'Tienda',
    'nav.cart': 'Carrito',
    'nav.login': 'Ingresar',
    
    // Botones
    'btn.learn_more': 'Conocer más',
    'btn.contact': 'Contactar',
    'btn.buy': 'Comprar',
    'btn.add_to_cart': 'Agregar al carrito',
    'btn.quote': 'Solicitar cotización',
    'btn.view_details': 'Ver detalles',
    
    // Productos
    'products.title': 'Nuestros Productos',
    'products.featured': 'Producto Estrella',
    'products.category': 'Categoría',
    'products.quantity': 'Cantidad',
    'products.price': 'Precio',
    'products.features': 'Características',
    'products.benefits': 'Beneficios',
    'products.specs': 'Especificaciones Técnicas',
    
    // Precios
    'price.from': 'Desde',
    'price.volume_pricing': 'Precios por volumen',
    'price.unit': 'unidad',
    'price.or_more': 'o más',
    
    // Footer
    'footer.contact': 'Contáctanos',
    'footer.email': 'Correo electrónico',
    'footer.phone': 'Teléfono',
    'footer.address': 'Dirección',
    
    // Admin
    'admin.dashboard': 'Panel de Control',
    'admin.products': 'Productos',
    'admin.prices': 'Precios',
    'admin.content': 'Contenido',
    'admin.categories': 'Categorías',
    'admin.settings': 'Configuración',
  },
  en: {
    // Navigation
    'nav.about': 'About Us',
    'nav.technology': 'Technology',
    'nav.products': 'Products',
    'nav.store': 'Store',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    
    // Buttons
    'btn.learn_more': 'Learn more',
    'btn.contact': 'Contact',
    'btn.buy': 'Buy',
    'btn.add_to_cart': 'Add to cart',
    'btn.quote': 'Request quote',
    'btn.view_details': 'View details',
    
    // Products
    'products.title': 'Our Products',
    'products.featured': 'Featured Product',
    'products.category': 'Category',
    'products.quantity': 'Quantity',
    'products.price': 'Price',
    'products.features': 'Features',
    'products.benefits': 'Benefits',
    'products.specs': 'Technical Specifications',
    
    // Prices
    'price.from': 'From',
    'price.volume_pricing': 'Volume pricing',
    'price.unit': 'unit',
    'price.or_more': 'or more',
    
    // Footer
    'footer.contact': 'Contact Us',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.address': 'Address',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.prices': 'Prices',
    'admin.content': 'Content',
    'admin.categories': 'Categories',
    'admin.settings': 'Settings',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Cargar idioma desde localStorage solo en el cliente
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}