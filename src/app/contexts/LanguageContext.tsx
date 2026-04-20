import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseAPI } from '../data/supabase';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Tipo para las traducciones con signatura de índice
type Translations = {
  [key: string]: string;
};

// Traducciones predeterminadas en caso de que la base de datos no responda
const defaultTranslations: { [key in Language]: Translations } = {
  es: {
    // Navegación
    'nav.about': 'Conócenos',
    'nav.technology': 'Tecnología',
    'nav.products': 'Productos',
    'nav.store': 'Tienda',
    'nav.cart': 'Carrito',
    'nav.login': 'Ingresar',
    'nav.products_catalog': 'Catálogo de productos',
    'nav.blog': 'Blog',
    
    // Botones
    'btn.learn_more': 'Conocer más',
    'btn.contact': 'Contactar',
    'btn.buy': 'Comprar',
    'btn.add_to_cart': 'Agregar al carrito',
    'btn.quote': 'Solicitar cotización',
    'btn.view_details': 'Ver detalles',
    'btn.view_details_prices': 'Ver detalles y precios',
    'btn.view_full_catalog': 'Ver Catálogo Completo',
    'btn.send_message': 'Enviar Mensaje',
    
    // Productos
    'products.title': 'Nuestros Productos',
    'products.featured': 'Producto Estrella',
    'products.category': 'Categoría',
    'products.quantity': 'Cantidad',
    'products.price': 'Precio',
    'products.features': 'Características',
    'products.benefits': 'Beneficios',
    'products.specs': 'Especificaciones Técnicas',
    'products.catalog': 'Catálogo',
    'products.most_popular': 'Más Popular',
    
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
    'footer.information': 'Información',
    
    // Formularios
    'form.name': 'Nombre',
    'form.email': 'Email',
    'form.message': 'Mensaje',
    'form.submit': 'Enviar',
    
    // Timeline
    'timeline.title': 'Nuestra Trayectoria',
    
    // Ecosystem
    'ecosystem.title': 'Ecosistema y Aliados',
    
    // Leadership
    'leadership.title': 'Liderazgo Femenino',
    
    // Trust Bar
    'trustbar.title': 'Respaldados por',
    
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
    'nav.products_catalog': 'Products Catalog',
    'nav.blog': 'Blog',
    
    // Buttons
    'btn.learn_more': 'Learn more',
    'btn.contact': 'Contact',
    'btn.buy': 'Buy',
    'btn.add_to_cart': 'Add to cart',
    'btn.quote': 'Request quote',
    'btn.view_details': 'View details',
    'btn.view_details_prices': 'View details and prices',
    'btn.view_full_catalog': 'View Full Catalog',
    'btn.send_message': 'Send Message',
    
    // Products
    'products.title': 'Our Products',
    'products.featured': 'Featured Product',
    'products.category': 'Category',
    'products.quantity': 'Quantity',
    'products.price': 'Price',
    'products.features': 'Features',
    'products.benefits': 'Benefits',
    'products.specs': 'Technical Specifications',
    'products.catalog': 'Catalog',
    'products.most_popular': 'Most Popular',
    
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
    'footer.information': 'Information',
    
    // Formularios
    'form.name': 'Name',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.submit': 'Submit',
    
    // Timeline
    'timeline.title': 'Our Journey',
    
    // Ecosystem
    'ecosystem.title': 'Ecosystem and Allies',
    
    // Leadership
    'leadership.title': 'Female Leadership',
    
    // Trust Bar
    'trustbar.title': 'Backed by',
    
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
  const [language, setLanguageState] = useState<Language>('es'); // Volver a idioma predeterminado español
  const [translations, setTranslations] = useState(defaultTranslations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar idioma desde localStorage solo en el cliente
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
    }

    // Cargar traducciones desde la base de datos
    const loadTranslations = async () => {
      try {
        const translationsData = await supabaseAPI.getTranslations();
        
        // Convertir las traducciones a la estructura necesaria
        const newTranslations = {
          es: { ...defaultTranslations.es },
          en: { ...defaultTranslations.en },
        };

        translationsData.forEach((translation: any) => {
          if (newTranslations.es[translation.key]) {
            newTranslations.es[translation.key] = translation.es;
          }
          if (newTranslations.en[translation.key]) {
            newTranslations.en[translation.key] = translation.en;
          }
        });

        setTranslations(newTranslations);
      } catch (error) {
        // En caso de error de red o base de datos, las traducciones predeterminadas se mantienen.
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
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
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: (key: string) => defaultTranslations.es[key] || key,
      isLoading: false
    };
  }
  return context;
}
