// ==========================================
// DATABASE MANAGER - Sistema de gestión de BD con persistencia
// ==========================================

import { loadFromStorage, saveToStorage } from '../hooks/useDatabase';
import {
  User,
  Product,
  ProductTranslation,
  PriceByQuantity,
  Category,
  CategoryTranslation,
  Page,
  PageContent,
  SiteSettings,
  Translation,
} from './mockDatabase';

// ==========================================
// GETTERS CON PERSISTENCIA
// ==========================================

export class DatabaseManager {
  // Usuarios
  static getUsers(): User[] {
    return loadFromStorage('users', [
      {
        id: 'user-001',
        email: 'admin@atbionano.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin' as const,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ]);
  }

  static saveUsers(users: User[]): void {
    saveToStorage('users', users);
  }

  // Productos
  static getProducts(): Product[] {
    return loadFromStorage('products', [
      {
        id: 'prod-001',
        slug: 'bionanoaxus-bnx',
        category: 'cat-001',
        status: 'active' as const,
        image: 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
      },
      {
        id: 'prod-002',
        slug: 'z-klean-limpiador',
        category: 'cat-002',
        status: 'active' as const,
        image: 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
      },
      {
        id: 'prod-003',
        slug: 'nanofert-plus',
        category: 'cat-003',
        status: 'active' as const,
        image: 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
      },
      {
        id: 'prod-004',
        slug: 'bioshield-spray',
        category: 'cat-001',
        status: 'active' as const,
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800',
        createdAt: '2024-02-05T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
      },
    ]);
  }

  static saveProducts(products: Product[]): void {
    saveToStorage('products', products);
  }

  // Categorías
  static getCategories(): Category[] {
    return loadFromStorage('categories', [
      { id: 'cat-001', slug: 'antimicrobianos', parentId: null, icon: 'Shield', order: 1, status: 'active' as const },
      { id: 'cat-002', slug: 'limpieza-industrial', parentId: null, icon: 'Sparkles', order: 2, status: 'active' as const },
      { id: 'cat-003', slug: 'fertilizantes', parentId: null, icon: 'Leaf', order: 3, status: 'active' as const },
      { id: 'cat-004', slug: 'fungicidas', parentId: null, icon: 'Bug', order: 4, status: 'active' as const },
    ]);
  }

  static saveCategories(categories: Category[]): void {
    saveToStorage('categories', categories);
  }

  // Traducciones de categorías
  static getCategoryTranslations(): CategoryTranslation[] {
    return loadFromStorage('categoryTranslations', [
      { categoryId: 'cat-001', language: 'es' as const, name: 'Antimicrobianos', description: 'Productos antimicrobianos de amplio espectro' },
      { categoryId: 'cat-001', language: 'en' as const, name: 'Antimicrobials', description: 'Broad-spectrum antimicrobial products' },
      { categoryId: 'cat-002', language: 'es' as const, name: 'Limpieza Industrial', description: 'Limpiadores de alto rendimiento' },
      { categoryId: 'cat-002', language: 'en' as const, name: 'Industrial Cleaning', description: 'High-performance cleaners' },
      { categoryId: 'cat-003', language: 'es' as const, name: 'Fertilizantes', description: 'Fertilizantes nanotecnológicos' },
      { categoryId: 'cat-003', language: 'en' as const, name: 'Fertilizers', description: 'Nanotechnological fertilizers' },
      { categoryId: 'cat-004', language: 'es' as const, name: 'Fungicidas', description: 'Soluciones contra hongos' },
      { categoryId: 'cat-004', language: 'en' as const, name: 'Fungicides', description: 'Solutions against fungi' },
    ]);
  }

  static saveCategoryTranslations(translations: CategoryTranslation[]): void {
    saveToStorage('categoryTranslations', translations);
  }

  // Páginas
  static getPages(): Page[] {
    return loadFromStorage('pages', [
      { id: 'page-home', slug: 'home', type: 'system' as const, status: 'published' as const, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-02-20T14:30:00Z' },
      { id: 'page-technology', slug: 'technology', type: 'system' as const, status: 'published' as const, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-02-20T14:30:00Z' },
      { id: 'page-process', slug: 'process', type: 'system' as const, status: 'published' as const, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-02-20T14:30:00Z' },
    ]);
  }

  static savePages(pages: Page[]): void {
    saveToStorage('pages', pages);
  }

  // Contenido de páginas
  static getPageContents(): PageContent[] {
    return loadFromStorage('pageContents', [
      {
        pageId: 'page-home',
        language: 'es' as const,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero' as const,
            order: 1,
            visible: true,
            content: {
              title: 'Innovación en Bionanotecnología',
              subtitle: 'Desarrollamos soluciones antimicrobianas y fungicidas sostenibles',
              ctaText: 'Conocer más',
              ctaLink: '#purpose',
              backgroundImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920',
            },
          },
        ],
      },
      {
        pageId: 'page-home',
        language: 'en' as const,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero' as const,
            order: 1,
            visible: true,
            content: {
              title: 'Innovation in Bionanotechnology',
              subtitle: 'We develop sustainable antimicrobial and fungicidal solutions',
              ctaText: 'Learn more',
              ctaLink: '#purpose',
              backgroundImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920',
            },
          },
        ],
      },
    ]);
  }

  static savePageContents(contents: PageContent[]): void {
    saveToStorage('pageContents', contents);
  }

  // Settings
  static getSiteSettings(): SiteSettings {
    return loadFromStorage('siteSettings', {
      id: 'settings-001',
      siteName: 'A&T BioNano',
      siteEmail: 'contacto@atbionano.com',
      sitePhone: '+57 300 123 4567',
      siteAddress: 'Calle 123 #45-67, Bogotá, Colombia',
      socialMedia: {
        facebook: 'https://facebook.com/atbionano',
        twitter: 'https://twitter.com/atbionano',
        instagram: 'https://instagram.com/atbionano',
        linkedin: 'https://linkedin.com/company/atbionano',
      },
      seo: {
        defaultTitle: 'A&T BioNano - Innovación en Bionanotecnología',
        defaultDescription: 'Desarrollamos soluciones antimicrobianas y fungicidas sostenibles con nanotecnología avanzada',
        defaultKeywords: 'bionanotecnología, antimicrobianos, fungicidas, nanotecnología, sostenibilidad',
      },
      colors: {
        primary: '#1C5D15',
        secondary: '#629960',
        accent: '#19FF00',
        background: '#F7F9CE',
      },
    });
  }

  static saveSiteSettings(settings: SiteSettings): void {
    saveToStorage('siteSettings', settings);
  }

  // Traducciones
  static getTranslations(): Translation[] {
    return loadFromStorage('translations', [
      { id: 'trans-001', key: 'nav.home', category: 'navigation' as const, es: 'Inicio', en: 'Home' },
      { id: 'trans-002', key: 'nav.technology', category: 'navigation' as const, es: 'Tecnología', en: 'Technology' },
      { id: 'trans-003', key: 'nav.process', category: 'navigation' as const, es: 'Proceso', en: 'Process' },
      { id: 'trans-004', key: 'nav.store', category: 'navigation' as const, es: 'Tienda', en: 'Store' },
      { id: 'trans-005', key: 'nav.contact', category: 'navigation' as const, es: 'Contacto', en: 'Contact' },
      { id: 'trans-006', key: 'ui.search', category: 'ui' as const, es: 'Buscar', en: 'Search' },
      { id: 'trans-007', key: 'ui.filter', category: 'ui' as const, es: 'Filtrar', en: 'Filter' },
      { id: 'trans-008', key: 'ui.addToCart', category: 'ui' as const, es: 'Agregar al carrito', en: 'Add to cart' },
      { id: 'trans-009', key: 'ui.viewDetails', category: 'ui' as const, es: 'Ver detalles', en: 'View details' },
      { id: 'trans-010', key: 'ui.learnMore', category: 'ui' as const, es: 'Conocer más', en: 'Learn more' },
    ]);
  }

  static saveTranslations(translations: Translation[]): void {
    saveToStorage('translations', translations);
  }
}
