// ==========================================
// MOCK DATABASE - Sistema de base de datos simulada
// CON PERSISTENCIA COMPLETA EN LOCALSTORAGE
// ==========================================

import { loadFromStorage, saveToStorage } from '../hooks/useDatabase';

// ==========================================
// INTERFACES Y TIPOS
// ==========================================

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTranslation {
  productId: string;
  language: 'es' | 'en';
  name: string;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  technicalSpecs: Record<string, string>;
  metaTitle: string;
  metaDescription: string;
}

export interface PriceByQuantity {
  id: string;
  productId: string;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  currency: 'COP' | 'USD';
}

export interface Category {
  id: string;
  slug: string;
  parentId: string | null;
  icon?: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface CategoryTranslation {
  categoryId: string;
  language: 'es' | 'en';
  name: string;
  description: string;
}

export interface Page {
  id: string;
  slug: string;
  type: 'system' | 'custom' | 'product';
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  pageId: string;
  language: 'es' | 'en';
  sections: Section[];
}

export interface Section {
  id: string;
  type: 'hero' | 'text' | 'features' | 'products' | 'team' | 'timeline' | 'contact' | 'custom';
  order: number;
  visible: boolean;
  content: Record<string, any>;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface Translation {
  id: string;
  key: string;
  category: 'ui' | 'messages' | 'navigation' | 'forms';
  es: string;
  en: string;
}

// ==========================================
// DATOS POR DEFECTO
// ==========================================

const DEFAULT_USERS: User[] = [
  {
    id: 'user-001',
    email: 'admin@atbionano.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    slug: 'bionanoaxus-bnx',
    category: 'cat-001',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'prod-002',
    slug: 'z-klean-limpiador',
    category: 'cat-002',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'prod-003',
    slug: 'nanofert-plus',
    category: 'cat-003',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'prod-004',
    slug: 'bioshield-spray',
    category: 'cat-001',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
];

const DEFAULT_PRODUCT_TRANSLATIONS: ProductTranslation[] = [
  {
    productId: 'prod-001',
    language: 'es',
    name: 'Bionanoaxus (BNX)',
    shortDescription: 'Antimicrobiano de amplio espectro con nanotecnología avanzada',
    description: 'Bionanoaxus es nuestro producto estrella, un antimicrobiano revolucionario que utiliza nanotecnología de última generación para eliminar bacterias, virus y hongos. Su fórmula única ofrece protección duradera y es completamente segura para el medio ambiente.',
    features: [
      'Tecnología de nanopartículas de plata',
      'Eficacia 99.9% contra microorganismos',
      'Biodegradable y eco-friendly',
      'Sin residuos tóxicos',
      'Protección de larga duración',
    ],
    benefits: [
      'Reduce enfermedades transmitidas por microorganismos',
      'Seguro para uso en contacto con alimentos',
      'No genera resistencia microbiana',
      'Aplicación versátil en múltiples superficies',
      'Contribuye a la sostenibilidad ambiental',
    ],
    technicalSpecs: {
      'Composición': 'Nanopartículas de plata coloidal',
      'Concentración': '20-50 ppm',
      'pH': '6.5 - 7.5',
      'Densidad': '1.01 g/ml',
      'Vida útil': '24 meses',
      'Almacenamiento': 'Temperatura ambiente, protegido de luz directa',
    },
    metaTitle: 'Bionanoaxus - Antimicrobiano Nanotecnológico | A&T BioNano',
    metaDescription: 'Descubre Bionanoaxus, el antimicrobiano más avanzado con nanotecnología. Eficacia 99.9%, biodegradable y seguro.',
  },
  {
    productId: 'prod-001',
    language: 'en',
    name: 'Bionanoaxus (BNX)',
    shortDescription: 'Broad-spectrum antimicrobial with advanced nanotechnology',
    description: 'Bionanoaxus is our flagship product, a revolutionary antimicrobial that uses state-of-the-art nanotechnology to eliminate bacteria, viruses, and fungi. Its unique formula offers long-lasting protection and is completely safe for the environment.',
    features: [
      'Silver nanoparticle technology',
      '99.9% efficacy against microorganisms',
      'Biodegradable and eco-friendly',
      'No toxic residues',
      'Long-lasting protection',
    ],
    benefits: [
      'Reduces microorganism-transmitted diseases',
      'Safe for food contact use',
      'Does not generate microbial resistance',
      'Versatile application on multiple surfaces',
      'Contributes to environmental sustainability',
    ],
    technicalSpecs: {
      'Composition': 'Colloidal silver nanoparticles',
      'Concentration': '20-50 ppm',
      'pH': '6.5 - 7.5',
      'Density': '1.01 g/ml',
      'Shelf life': '24 months',
      'Storage': 'Room temperature, protected from direct light',
    },
    metaTitle: 'Bionanoaxus - Nanotechnological Antimicrobial | A&T BioNano',
    metaDescription: 'Discover Bionanoaxus, the most advanced antimicrobial with nanotechnology. 99.9% efficacy, biodegradable and safe.',
  },
  {
    productId: 'prod-002',
    language: 'es',
    name: 'Z-Klean Limpiador Industrial',
    shortDescription: 'Limpiador de alto rendimiento con nanotecnología',
    description: 'Z-Klean es un limpiador industrial revolucionario que combina el poder de la nanotecnología con ingredientes biodegradables para ofrecer una limpieza profunda y efectiva sin dañar el medio ambiente.',
    features: [
      'Formulación con nanotecnología',
      'Desengrasante de alta potencia',
      'Biodegradable 100%',
      'No corrosivo',
      'Libre de fosfatos',
    ],
    benefits: [
      'Limpieza profunda en superficies industriales',
      'Reduce tiempo de limpieza en 40%',
      'Seguro para operarios',
      'Versatilidad en múltiples aplicaciones',
      'Reduce costos operativos',
    ],
    technicalSpecs: {
      'Tipo': 'Limpiador alcalino',
      'pH': '11.5 - 12.5',
      'Dilución': '1:10 a 1:50',
      'Temperatura aplicación': '20-40°C',
      'Vida útil': '18 meses',
      'Presentación': '1L, 5L, 20L',
    },
    metaTitle: 'Z-Klean - Limpiador Industrial Nanotecnológico | A&T BioNano',
    metaDescription: 'Z-Klean, limpiador industrial con nanotecnología. Biodegradable, alta potencia y seguro.',
  },
  {
    productId: 'prod-002',
    language: 'en',
    name: 'Z-Klean Industrial Cleaner',
    shortDescription: 'High-performance cleaner with nanotechnology',
    description: 'Z-Klean is a revolutionary industrial cleaner that combines the power of nanotechnology with biodegradable ingredients to offer deep and effective cleaning without harming the environment.',
    features: [
      'Nanotechnology formulation',
      'High-power degreaser',
      '100% biodegradable',
      'Non-corrosive',
      'Phosphate-free',
    ],
    benefits: [
      'Deep cleaning on industrial surfaces',
      'Reduces cleaning time by 40%',
      'Safe for operators',
      'Versatility in multiple applications',
      'Reduces operating costs',
    ],
    technicalSpecs: {
      'Type': 'Alkaline cleaner',
      'pH': '11.5 - 12.5',
      'Dilution': '1:10 to 1:50',
      'Application temperature': '20-40°C',
      'Shelf life': '18 months',
      'Presentation': '1L, 5L, 20L',
    },
    metaTitle: 'Z-Klean - Nanotechnological Industrial Cleaner | A&T BioNano',
    metaDescription: 'Z-Klean, industrial cleaner with nanotechnology. Biodegradable, high power and safe.',
  },
  {
    productId: 'prod-003',
    language: 'es',
    name: 'NanoFert Plus',
    shortDescription: 'Fertilizante nanométrico de liberación controlada',
    description: 'NanoFert Plus es un fertilizante de nueva generación que utiliza nanotecnología para optimizar la absorción de nutrientes por las plantas. Su sistema de liberación controlada garantiza un suministro constante y eficiente.',
    features: [
      'Nanoencapsulación de nutrientes',
      'Liberación controlada',
      'Mayor absorción foliar',
      'Mejora la salud del suelo',
      'Compatible con agricultura orgánica',
    ],
    benefits: [
      'Aumenta rendimiento de cultivos hasta 35%',
      'Reduce consumo de fertilizantes en 50%',
      'Mejora calidad de frutos',
      'Menor impacto ambiental',
      'Resultados visibles en 7 días',
    ],
    technicalSpecs: {
      'NPK': '12-10-8 + Micronutrientes',
      'Tamaño partícula': '20-100 nm',
      'Solubilidad': 'Alta',
      'Aplicación': 'Foliar o radicular',
      'Dosis': '2-5 ml/L',
      'Compatibilidad': 'pH 5.5-7.5',
    },
    metaTitle: 'NanoFert Plus - Fertilizante Nanotecnológico | A&T BioNano',
    metaDescription: 'NanoFert Plus, fertilizante con nanotecnología de liberación controlada. Aumenta rendimiento hasta 35%.',
  },
  {
    productId: 'prod-003',
    language: 'en',
    name: 'NanoFert Plus',
    shortDescription: 'Controlled-release nanometric fertilizer',
    description: 'NanoFert Plus is a next-generation fertilizer that uses nanotechnology to optimize nutrient absorption by plants. Its controlled release system ensures a constant and efficient supply.',
    features: [
      'Nutrient nanoencapsulation',
      'Controlled release',
      'Enhanced foliar absorption',
      'Improves soil health',
      'Compatible with organic farming',
    ],
    benefits: [
      'Increases crop yield up to 35%',
      'Reduces fertilizer consumption by 50%',
      'Improves fruit quality',
      'Lower environmental impact',
      'Visible results in 7 days',
    ],
    technicalSpecs: {
      'NPK': '12-10-8 + Micronutrients',
      'Particle size': '20-100 nm',
      'Solubility': 'High',
      'Application': 'Foliar or root',
      'Dosage': '2-5 ml/L',
      'Compatibility': 'pH 5.5-7.5',
    },
    metaTitle: 'NanoFert Plus - Nanotechnological Fertilizer | A&T BioNano',
    metaDescription: 'NanoFert Plus, fertilizer with controlled-release nanotechnology. Increases yield up to 35%.',
  },
  {
    productId: 'prod-004',
    language: 'es',
    name: 'BioShield Spray',
    shortDescription: 'Protección antimicrobiana en aerosol',
    description: 'BioShield Spray es la solución perfecta para protección inmediata contra microorganismos. Su formato en spray permite aplicación rápida y uniforme en cualquier superficie.',
    features: [
      'Aplicación en aerosol',
      'Secado rápido',
      'Sin olor residual',
      'Efecto antimicrobiano inmediato',
      'Portátil y práctico',
    ],
    benefits: [
      'Ideal para uso doméstico y profesional',
      'Protege superficies de alto contacto',
      'Fácil aplicación',
      'No mancha ni deja residuos',
      'Seguro para toda la familia',
    ],
    technicalSpecs: {
      'Volumen': '250 ml, 500 ml',
      'Tiempo de acción': '30 segundos',
      'Cobertura': '2 m² por segundo',
      'Durabilidad': 'Hasta 24 horas',
      'Ingrediente activo': 'Nanopartículas de plata',
      'Tipo': 'Aerosol no inflamable',
    },
    metaTitle: 'BioShield Spray - Protección Antimicrobiana Rápida | A&T BioNano',
    metaDescription: 'BioShield Spray, protección antimicrobiana instantánea en formato aerosol. Seguro y efectivo.',
  },
  {
    productId: 'prod-004',
    language: 'en',
    name: 'BioShield Spray',
    shortDescription: 'Antimicrobial protection spray',
    description: 'BioShield Spray is the perfect solution for immediate protection against microorganisms. Its spray format allows quick and uniform application on any surface.',
    features: [
      'Spray application',
      'Fast drying',
      'No residual odor',
      'Immediate antimicrobial effect',
      'Portable and practical',
    ],
    benefits: [
      'Ideal for domestic and professional use',
      'Protects high-touch surfaces',
      'Easy application',
      'Does not stain or leave residues',
      'Safe for the whole family',
    ],
    technicalSpecs: {
      'Volume': '250 ml, 500 ml',
      'Action time': '30 seconds',
      'Coverage': '2 m² per second',
      'Durability': 'Up to 24 hours',
      'Active ingredient': 'Silver nanoparticles',
      'Type': 'Non-flammable aerosol',
    },
    metaTitle: 'BioShield Spray - Fast Antimicrobial Protection | A&T BioNano',
    metaDescription: 'BioShield Spray, instant antimicrobial protection in aerosol format. Safe and effective.',
  },
];

const DEFAULT_PRICES: PriceByQuantity[] = [
  { id: 'price-001', productId: 'prod-001', minQuantity: 1, maxQuantity: 5, pricePerUnit: 45000, currency: 'COP' },
  { id: 'price-002', productId: 'prod-001', minQuantity: 6, maxQuantity: 20, pricePerUnit: 40000, currency: 'COP' },
  { id: 'price-003', productId: 'prod-001', minQuantity: 21, maxQuantity: 50, pricePerUnit: 35000, currency: 'COP' },
  { id: 'price-004', productId: 'prod-001', minQuantity: 51, maxQuantity: null, pricePerUnit: 30000, currency: 'COP' },
  { id: 'price-005', productId: 'prod-002', minQuantity: 1, maxQuantity: 10, pricePerUnit: 35000, currency: 'COP' },
  { id: 'price-006', productId: 'prod-002', minQuantity: 11, maxQuantity: 30, pricePerUnit: 32000, currency: 'COP' },
  { id: 'price-007', productId: 'prod-002', minQuantity: 31, maxQuantity: null, pricePerUnit: 28000, currency: 'COP' },
  { id: 'price-008', productId: 'prod-003', minQuantity: 1, maxQuantity: 10, pricePerUnit: 55000, currency: 'COP' },
  { id: 'price-009', productId: 'prod-003', minQuantity: 11, maxQuantity: 25, pricePerUnit: 50000, currency: 'COP' },
  { id: 'price-010', productId: 'prod-003', minQuantity: 26, maxQuantity: null, pricePerUnit: 45000, currency: 'COP' },
  { id: 'price-011', productId: 'prod-004', minQuantity: 1, maxQuantity: 12, pricePerUnit: 25000, currency: 'COP' },
  { id: 'price-012', productId: 'prod-004', minQuantity: 13, maxQuantity: 50, pricePerUnit: 22000, currency: 'COP' },
  { id: 'price-013', productId: 'prod-004', minQuantity: 51, maxQuantity: null, pricePerUnit: 18000, currency: 'COP' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-001', slug: 'antimicrobianos', parentId: null, icon: 'Shield', order: 1, status: 'active' },
  { id: 'cat-002', slug: 'limpieza-industrial', parentId: null, icon: 'Sparkles', order: 2, status: 'active' },
  { id: 'cat-003', slug: 'fertilizantes', parentId: null, icon: 'Leaf', order: 3, status: 'active' },
  { id: 'cat-004', slug: 'fungicidas', parentId: null, icon: 'Bug', order: 4, status: 'active' },
];

const DEFAULT_CATEGORY_TRANSLATIONS: CategoryTranslation[] = [
  { categoryId: 'cat-001', language: 'es', name: 'Antimicrobianos', description: 'Productos antimicrobianos de amplio espectro' },
  { categoryId: 'cat-001', language: 'en', name: 'Antimicrobials', description: 'Broad-spectrum antimicrobial products' },
  { categoryId: 'cat-002', language: 'es', name: 'Limpieza Industrial', description: 'Limpiadores de alto rendimiento' },
  { categoryId: 'cat-002', language: 'en', name: 'Industrial Cleaning', description: 'High-performance cleaners' },
  { categoryId: 'cat-003', language: 'es', name: 'Fertilizantes', description: 'Fertilizantes nanotecnológicos' },
  { categoryId: 'cat-003', language: 'en', name: 'Fertilizers', description: 'Nanotechnological fertilizers' },
  { categoryId: 'cat-004', language: 'es', name: 'Fungicidas', description: 'Soluciones contra hongos' },
  { categoryId: 'cat-004', language: 'en', name: 'Fungicides', description: 'Solutions against fungi' },
];

const DEFAULT_PAGES: Page[] = [
  { id: 'page-home', slug: 'home', type: 'system', status: 'published', createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-02-20T14:30:00Z' },
  { id: 'page-technology', slug: 'technology', type: 'system', status: 'published', createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-02-20T14:30:00Z' },
  { id: 'page-process', slug: 'process', type: 'system', status: 'published', createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-02-20T14:30:00Z' },
];

const DEFAULT_PAGE_CONTENTS: PageContent[] = [
  {
    pageId: 'page-home',
    language: 'es',
    sections: [
      {
        id: 'sec-hero',
        type: 'hero',
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
      {
        id: 'sec-purpose',
        type: 'features',
        order: 3,
        visible: true,
        content: {
          title: 'Nuestro Propósito',
          items: [
            { icon: 'Users', title: 'Innovación', description: 'Desarrollamos tecnología de punta' },
            { icon: 'Target', title: 'Sostenibilidad', description: 'Comprometidos con el medio ambiente' },
            { icon: 'Lightbulb', title: 'Excelencia', description: 'Calidad en cada producto' },
          ],
        },
      },
    ],
  },
  {
    pageId: 'page-home',
    language: 'en',
    sections: [
      {
        id: 'sec-hero',
        type: 'hero',
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
      {
        id: 'sec-purpose',
        type: 'features',
        order: 3,
        visible: true,
        content: {
          title: 'Our Purpose',
          items: [
            { icon: 'Users', title: 'Innovation', description: 'We develop cutting-edge technology' },
            { icon: 'Target', title: 'Sustainability', description: 'Committed to the environment' },
            { icon: 'Lightbulb', title: 'Excellence', description: 'Quality in every product' },
          ],
        },
      },
    ],
  },
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
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
};

const DEFAULT_TRANSLATIONS: Translation[] = [
  { id: 'trans-001', key: 'nav.home', category: 'navigation', es: 'Inicio', en: 'Home' },
  { id: 'trans-002', key: 'nav.technology', category: 'navigation', es: 'Tecnología', en: 'Technology' },
  { id: 'trans-003', key: 'nav.process', category: 'navigation', es: 'Proceso', en: 'Process' },
  { id: 'trans-004', key: 'nav.store', category: 'navigation', es: 'Tienda', en: 'Store' },
  { id: 'trans-005', key: 'nav.contact', category: 'navigation', es: 'Contacto', en: 'Contact' },
  { id: 'trans-006', key: 'ui.search', category: 'ui', es: 'Buscar', en: 'Search' },
  { id: 'trans-007', key: 'ui.filter', category: 'ui', es: 'Filtrar', en: 'Filter' },
  { id: 'trans-008', key: 'ui.addToCart', category: 'ui', es: 'Agregar al carrito', en: 'Add to cart' },
  { id: 'trans-009', key: 'ui.viewDetails', category: 'ui', es: 'Ver detalles', en: 'View details' },
  { id: 'trans-010', key: 'ui.learnMore', category: 'ui', es: 'Conocer más', en: 'Learn more' },
  { id: 'trans-011', key: 'msg.success', category: 'messages', es: '¡Operación exitosa!', en: 'Operation successful!' },
  { id: 'trans-012', key: 'msg.error', category: 'messages', es: 'Ha ocurrido un error', en: 'An error occurred' },
  { id: 'trans-013', key: 'form.name', category: 'forms', es: 'Nombre', en: 'Name' },
  { id: 'trans-014', key: 'form.email', category: 'forms', es: 'Correo electrónico', en: 'Email' },
  { id: 'trans-015', key: 'form.password', category: 'forms', es: 'Contraseña', en: 'Password' },
  { id: 'trans-016', key: 'form.submit', category: 'forms', es: 'Enviar', en: 'Submit' },
];

// ==========================================
// FUNCIONES DE PERSISTENCIA
// ==========================================

function getUsers(): User[] {
  return loadFromStorage('users', DEFAULT_USERS);
}

function saveUsersData(users: User[]): void {
  saveToStorage('users', users);
}

function getProducts(): Product[] {
  return loadFromStorage('products', DEFAULT_PRODUCTS);
}

function saveProductsData(products: Product[]): void {
  saveToStorage('products', products);
}

function getProductTranslations(): ProductTranslation[] {
  return loadFromStorage('productTranslations', DEFAULT_PRODUCT_TRANSLATIONS);
}

function saveProductTranslations(translations: ProductTranslation[]): void {
  saveToStorage('productTranslations', translations);
}

function getPrices(): PriceByQuantity[] {
  return loadFromStorage('prices', DEFAULT_PRICES);
}

function savePrices(prices: PriceByQuantity[]): void {
  saveToStorage('prices', prices);
}

function getCategories(): Category[] {
  return loadFromStorage('categories', DEFAULT_CATEGORIES);
}

function saveCategoriesData(categories: Category[]): void {
  saveToStorage('categories', categories);
}

function getCategoryTranslations(): CategoryTranslation[] {
  return loadFromStorage('categoryTranslations', DEFAULT_CATEGORY_TRANSLATIONS);
}

function saveCategoryTranslations(translations: CategoryTranslation[]): void {
  saveToStorage('categoryTranslations', translations);
}

function getPages(): Page[] {
  return loadFromStorage('pages', DEFAULT_PAGES);
}

function savePagesData(pages: Page[]): void {
  saveToStorage('pages', pages);
}

function getPageContents(): PageContent[] {
  return loadFromStorage('pageContents', DEFAULT_PAGE_CONTENTS);
}

function savePageContents(contents: PageContent[]): void {
  saveToStorage('pageContents', contents);
}

function getSiteSettings(): SiteSettings {
  return loadFromStorage('siteSettings', DEFAULT_SITE_SETTINGS);
}

function saveSiteSettings(settings: SiteSettings): void {
  saveToStorage('siteSettings', settings);
}

function getTranslations(): Translation[] {
  return loadFromStorage('translations', DEFAULT_TRANSLATIONS);
}

function saveTranslationsData(translations: Translation[]): void {
  saveToStorage('translations', translations);
}

// ==========================================
// FUNCIONES API CON PERSISTENCIA
// ==========================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockAPI = {
  // ==========================================
  // USUARIOS
  // ==========================================
  
  registerUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    await delay(500);
    
    const allUsers = getUsers();
    const existingUser = allUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    allUsers.push(newUser);
    saveUsersData(allUsers);
    return newUser;
  },

  loginUser: async (email: string, password: string): Promise<User> => {
    await delay(500);
    
    const allUsers = getUsers();
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }
    
    return user;
  },

  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return getUsers();
  },

  // ==========================================
  // CATEGORÍAS
  // ==========================================
  
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    await delay(400);
    const allCategories = getCategories();
    const index = allCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      allCategories[index] = { ...allCategories[index], ...data };
      saveCategoriesData(allCategories);
      return allCategories[index];
    }
    throw new Error('Category not found');
  },

  updateCategoryTranslation: async (categoryId: string, language: 'es' | 'en', data: Partial<CategoryTranslation>): Promise<CategoryTranslation> => {
    await delay(400);
    const allTranslations = getCategoryTranslations();
    const index = allTranslations.findIndex(ct => ct.categoryId === categoryId && ct.language === language);
    if (index !== -1) {
      allTranslations[index] = { ...allTranslations[index], ...data };
      saveCategoryTranslations(allTranslations);
      return allTranslations[index];
    }
    throw new Error('Category translation not found');
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(400);
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      ...data,
    };
    const allCategories = getCategories();
    allCategories.push(newCategory);
    saveCategoriesData(allCategories);
    return newCategory;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await delay(300);
    const allCategories = getCategories();
    const index = allCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      allCategories.splice(index, 1);
      saveCategoriesData(allCategories);
      
      // También eliminar traducciones
      const allTranslations = getCategoryTranslations();
      const filteredTranslations = allTranslations.filter(ct => ct.categoryId !== id);
      saveCategoryTranslations(filteredTranslations);
    }
  },

  // ==========================================
  // PÁGINAS Y CONTENIDO
  // ==========================================
  
  updatePageContent: async (pageId: string, language: 'es' | 'en', sections: Section[]): Promise<PageContent> => {
    await delay(500);
    const allContents = getPageContents();
    const index = allContents.findIndex(pc => pc.pageId === pageId && pc.language === language);
    
    const newContent: PageContent = { pageId, language, sections };
    
    if (index !== -1) {
      allContents[index] = newContent;
    } else {
      allContents.push(newContent);
    }
    
    savePageContents(allContents);
    return newContent;
  },

  updatePage: async (id: string, data: Partial<Page>): Promise<Page> => {
    await delay(400);
    const allPages = getPages();
    const index = allPages.findIndex(p => p.id === id);
    if (index !== -1) {
      allPages[index] = { ...allPages[index], ...data, updatedAt: new Date().toISOString() };
      savePagesData(allPages);
      return allPages[index];
    }
    throw new Error('Page not found');
  },

  // ==========================================
  // TRADUCCIONES
  // ==========================================
  
  getTranslations: async (): Promise<Translation[]> => {
    await delay(200);
    return getTranslations();
  },

  updateTranslation: async (id: string, data: Partial<Translation>): Promise<Translation> => {
    await delay(400);
    const allTranslations = getTranslations();
    const index = allTranslations.findIndex(t => t.id === id);
    if (index !== -1) {
      allTranslations[index] = { ...allTranslations[index], ...data };
      saveTranslationsData(allTranslations);
      return allTranslations[index];
    }
    throw new Error('Translation not found');
  },

  createTranslation: async (data: Omit<Translation, 'id'>): Promise<Translation> => {
    await delay(400);
    const newTranslation: Translation = {
      id: `trans-${Date.now()}`,
      ...data,
    };
    const allTranslations = getTranslations();
    allTranslations.push(newTranslation);
    saveTranslationsData(allTranslations);
    return newTranslation;
  },

  deleteTranslation: async (id: string): Promise<void> => {
    await delay(300);
    const allTranslations = getTranslations();
    const index = allTranslations.findIndex(t => t.id === id);
    if (index !== -1) {
      allTranslations.splice(index, 1);
      saveTranslationsData(allTranslations);
    }
  },

  // ==========================================
  // CONFIGURACIÓN DEL SITIO
  // ==========================================
  
  getSiteSettings: async (): Promise<SiteSettings> => {
    await delay(200);
    return getSiteSettings();
  },

  updateSiteSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    await delay(500);
    const currentSettings = getSiteSettings();
    const updatedSettings = { ...currentSettings, ...data };
    saveSiteSettings(updatedSettings);
    return updatedSettings;
  },

  // ==========================================
  // PRODUCTOS
  // ==========================================
  
  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return getProducts().filter(p => p.status === 'active');
  },

  getAllProducts: async (): Promise<Product[]> => {
    await delay(300);
    return getProducts();
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await delay(200);
    return getProducts().find(p => p.id === id) || null;
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    await delay(200);
    return getProducts().find(p => p.slug === slug) || null;
  },

  getProductTranslation: async (productId: string, language: 'es' | 'en'): Promise<ProductTranslation | null> => {
    await delay(200);
    return getProductTranslations().find(pt => pt.productId === productId && pt.language === language) || null;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(400);
    const allProducts = getProducts();
    const index = allProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      allProducts[index] = { ...allProducts[index], ...data, updatedAt: new Date().toISOString() };
      saveProductsData(allProducts);
      return allProducts[index];
    }
    throw new Error('Product not found');
  },

  updateProductTranslation: async (productId: string, language: 'es' | 'en', data: Partial<ProductTranslation>): Promise<ProductTranslation> => {
    await delay(400);
    const allTranslations = getProductTranslations();
    const index = allTranslations.findIndex(pt => pt.productId === productId && pt.language === language);
    if (index !== -1) {
      allTranslations[index] = { ...allTranslations[index], ...data };
      saveProductTranslations(allTranslations);
      return allTranslations[index];
    }
    throw new Error('Translation not found');
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(400);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const allProducts = getProducts();
    allProducts.push(newProduct);
    saveProductsData(allProducts);
    return newProduct;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(300);
    const allProducts = getProducts();
    const index = allProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      allProducts.splice(index, 1);
      saveProductsData(allProducts);
      
      // También eliminar traducciones y precios
      const allTranslations = getProductTranslations();
      const filteredTranslations = allTranslations.filter(pt => pt.productId !== id);
      saveProductTranslations(filteredTranslations);
      
      const allPrices = getPrices();
      const filteredPrices = allPrices.filter(p => p.productId !== id);
      savePrices(filteredPrices);
    }
  },

  // ==========================================
  // PRECIOS
  // ==========================================
  
  getPricesByProduct: async (productId: string): Promise<PriceByQuantity[]> => {
    await delay(200);
    return getPrices().filter(p => p.productId === productId);
  },

  calculatePrice: async (productId: string, quantity: number): Promise<{ pricePerUnit: number; total: number; currency: string } | null> => {
    await delay(150);
    const prices = getPrices().filter(p => p.productId === productId);
    const applicablePrice = prices.find(p => 
      quantity >= p.minQuantity && (p.maxQuantity === null || quantity <= p.maxQuantity)
    );
    
    if (!applicablePrice) return null;
    
    return {
      pricePerUnit: applicablePrice.pricePerUnit,
      total: applicablePrice.pricePerUnit * quantity,
      currency: applicablePrice.currency,
    };
  },

  updatePrice: async (id: string, data: Partial<PriceByQuantity>): Promise<PriceByQuantity> => {
    await delay(400);
    const allPrices = getPrices();
    const index = allPrices.findIndex(p => p.id === id);
    if (index !== -1) {
      allPrices[index] = { ...allPrices[index], ...data };
      savePrices(allPrices);
      return allPrices[index];
    }
    throw new Error('Price not found');
  },

  createPrice: async (data: Omit<PriceByQuantity, 'id'>): Promise<PriceByQuantity> => {
    await delay(400);
    const newPrice: PriceByQuantity = {
      id: `price-${Date.now()}`,
      ...data,
    };
    const allPrices = getPrices();
    allPrices.push(newPrice);
    savePrices(allPrices);
    return newPrice;
  },

  deletePrice: async (id: string): Promise<void> => {
    await delay(300);
    const allPrices = getPrices();
    const index = allPrices.findIndex(p => p.id === id);
    if (index !== -1) {
      allPrices.splice(index, 1);
      savePrices(allPrices);
    }
  },

  // ==========================================
  // CATEGORÍAS (PÚBLICO)
  // ==========================================
  
  getCategories: async (): Promise<Category[]> => {
    await delay(200);
    return getCategories().filter(c => c.status === 'active');
  },

  getAllCategories: async (): Promise<Category[]> => {
    await delay(200);
    return getCategories();
  },

  getCategoryTranslation: async (categoryId: string, language: 'es' | 'en'): Promise<CategoryTranslation | null> => {
    await delay(150);
    return getCategoryTranslations().find(ct => ct.categoryId === categoryId && ct.language === language) || null;
  },

  // ==========================================
  // PÁGINAS (PÚBLICO)
  // ==========================================
  
  getPageBySlug: async (slug: string): Promise<Page | null> => {
    await delay(200);
    return getPages().find(p => p.slug === slug) || null;
  },

  getPageContent: async (pageId: string, language: 'es' | 'en'): Promise<PageContent | null> => {
    await delay(200);
    return getPageContents().find(pc => pc.pageId === pageId && pc.language === language) || null;
  },

  getAllPages: async (): Promise<Page[]> => {
    await delay(200);
    return getPages();
  },
};

// Exports para compatibilidad con código existente
export const products = getProducts();
export const productTranslations = getProductTranslations();
export const pricesByQuantity = getPrices();
export const categories = getCategories();
export const categoryTranslations = getCategoryTranslations();
export const pages = getPages();
export const pageContents = getPageContents();
export const siteSettings = getSiteSettings();
export const translations = getTranslations();
