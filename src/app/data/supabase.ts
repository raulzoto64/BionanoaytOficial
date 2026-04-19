import { API_BASE_URL, getApiHeaders, handleApiResponse } from './apiConfig';

// El cliente de Supabase ha sido eliminado definitivamente. 
// Usar supabaseAPI para todas las operaciones de datos.

// Tipos para las tablas
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'manager' | 'viewer' | 'customer';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  status: "active" | "inactive" | "draft";
  image: string;
  images?: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductTranslation {
  product_id: string;
  language: "es" | "en";
  name: string;
  description: string;
  short_description: string;
  features: string[];
  benefits: string[];
  technical_specs: Record<string, string>;
  meta_title: string;
  meta_description: string;
}

export interface PriceByQuantity {
  id: string;
  product_id: string;
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: number;
  currency: "COP" | "USD";
  packaging?: string;
}

export interface Category {
  id: string;
  slug: string;
  parent_id: string | null;
  icon?: string;
  order: number;
  status: "active" | "inactive";
}

export interface CategoryTranslation {
  category_id: string;
  language: "es" | "en";
  name: string;
  description: string;
}

export interface Page {
  id: string;
  slug: string;
  type: "system" | "custom" | "product";
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  page_id: string;
  language: "es" | "en";
  sections: Section[];
}

export type PageWithContent = Page & {
  contentES?: PageContent;
  contentEN?: PageContent;
};

export interface Section {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  content: Record<string, any>;
  page_id?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  social_media: any;
  seo: any;
  colors: any;
}

export interface BlogPost {
  id: string;
  slug: string;
  author: string;
  cover_image: string;
  status: "draft" | "published";
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  type: "article" | "news";
}

export interface BlogPostTranslation {
  post_id: string;
  language: "es" | "en";
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export interface Translation {
  id: string;
  key: string;
  category: string;
  es: string;
  en: string;
}

export interface Form {
  id: string;
  name: string;
  title_es?: string;
  title_en?: string;
  fields: any[];
  is_active: boolean;
}

export interface LegalPage {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  content_es: string;
  content_en: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterSettings {
  id: string;
  columns: any[];
  contact_info: any;
  social_media: any;
  copyright_text_es: string;
  copyright_text_en: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  guest_id?: string | null;
  product_id: string;
  quantity: number;
  packaging?: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  translation: ProductTranslation;
}

export interface EcosystemMember {
  id: string;
  slug: string;
  status: "active" | "inactive" | "draft";
  image: string;
  sector: string;
  social_media: Record<string, string>;
  youtube_videos: string[];
  short_videos: string[];
}

export interface EcosystemMemberTranslation {
  member_id: string;
  language: "es" | "en";
  name: string;
  description: string;
}

export const supabaseAPI = {
  _cache: {} as Record<string, { data: any; timestamp: number }>,
  _cacheTTL: 24 * 60 * 60 * 1000,
  _persistPrefix: "bionano_cache_",

  _getFromCache: (key: string, persist: boolean = true) => {
    const cached = supabaseAPI._cache[key];
    if (cached && Date.now() - cached.timestamp < supabaseAPI._cacheTTL) return cached.data;
    if (persist && typeof window !== "undefined") {
      try {
        const persisted = localStorage.getItem(supabaseAPI._persistPrefix + key);
        if (persisted) {
          const parsed = JSON.parse(persisted);
          supabaseAPI._cache[key] = parsed;
          return parsed.data;
        }
      } catch (e) {}
    }
    return null;
  },

  _saveToCache: (key: string, data: any, persist: boolean = false) => {
    const cacheEntry = { data, timestamp: Date.now() };
    supabaseAPI._cache[key] = cacheEntry;
    if (persist && typeof window !== "undefined") {
      try {
        localStorage.setItem(supabaseAPI._persistPrefix + key, JSON.stringify(cacheEntry));
      } catch (e) {}
    }
  },

  clearCache: () => {
    supabaseAPI._cache = {};
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(supabaseAPI._persistPrefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 [CACHE] Caché local de BionanoAYT limpiada completamente.');
    }
  },

  _invalidateCache: (key: string) => {
    delete supabaseAPI._cache[key];
    if (typeof window !== "undefined") localStorage.removeItem(supabaseAPI._persistPrefix + key);
  },

  _fetchWithCache: async <T>(key: string, fetchFn: () => Promise<T>, persist: boolean = true): Promise<T> => {
    const cached = supabaseAPI._getFromCache(key, persist);
    if (cached) return cached as T;
    const data = await fetchFn();
    supabaseAPI._saveToCache(key, data, persist);
    return data;
  },

  isValidUUID: (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },

  getCachedData: (key: string) => supabaseAPI._getFromCache(key),

  // USERS
  registerUser: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  loginUser: async (email: string, pass: string) => {
    console.log(`🚀 [API] Intentando login para: ${email} (Pass length: ${pass?.length || 0})`);
    const body = JSON.stringify({ 
      email: email, 
      password: pass 
    });
    const res = await fetch(`${API_BASE_URL}/auth/login`, { 
      method: 'POST', 
      headers: getApiHeaders(), 
      body: body 
    });
    const { user, token } = await handleApiResponse(res);
    if (token) localStorage.setItem('auth_token', token);
    return user;
  },
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },

  // PRODUCTS
  getProducts: async () => {
    return supabaseAPI._fetchWithCache("products", async () => {
      const res = await fetch(`${API_BASE_URL}/products`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getAllProducts: async () => {
    // Para el admin, no usamos cache y pedimos todos
    const res = await fetch(`${API_BASE_URL}/products?all=true`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getProductById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getProductBySlug: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getProductTranslation: async (productId: string, lang: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/translation/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getAllProductTranslations: async (lang: string) => {
    const res = await fetch(`${API_BASE_URL}/products/translations/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  createProduct: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/products`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    supabaseAPI._invalidateCache("products");
    return handleApiResponse(res);
  },
  updateProduct: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'PUT', headers: getApiHeaders(), body: JSON.stringify(data) });
    supabaseAPI._invalidateCache("products");
    return handleApiResponse(res);
  },
  updateProductTranslation: async (productId: string, lang: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/translation/${lang}`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE', headers: getApiHeaders() });
    supabaseAPI._invalidateCache("products");
    return handleApiResponse(res);
  },

  // CATEGORIES
  getCategories: async () => {
    return supabaseAPI._fetchWithCache("categories", async () => {
      const res = await fetch(`${API_BASE_URL}/categories`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getAllCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/categories?all=true`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getCategoryTranslation: async (catId: string, lang: string) => {
    const res = await fetch(`${API_BASE_URL}/categories/${catId}/translation/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getAllCategoryTranslations: async (lang: string) => {
    const res = await fetch(`${API_BASE_URL}/categories/translations/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },

  // PAGES
  getAllPages: async () => {
    const res = await fetch(`${API_BASE_URL}/pages`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getPageContent: async (id: string, lang: string) => {
    return supabaseAPI._fetchWithCache(`page-content-${id}-${lang}`, async () => {
      const res = await fetch(`${API_BASE_URL}/pages/${id}/content/${lang}`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  updatePageContent: async (id: string, lang: string, sections: any[]) => {
    const res = await fetch(`${API_BASE_URL}/pages/${id}/content/${lang}`, { method: 'PUT', headers: getApiHeaders(), body: JSON.stringify({ sections }) });
    const content = await handleApiResponse(res);
    supabaseAPI._invalidateCache(`page-content-${id}-${lang}`);
    return content;
  },

  // CART
  mergeGuestCart: async (userId: string, guestId: string) => {
    const res = await fetch(`${API_BASE_URL}/cart/merge`, { 
      method: 'POST', 
      headers: getApiHeaders(), 
      body: JSON.stringify({ user_id: userId, guest_id: guestId }) 
    });
    return handleApiResponse(res);
  },
  addToCart: async (productId: string, quantity: number, userId: string | null, guestId: string | null, packaging: string) => {
    const res = await fetch(`${API_BASE_URL}/cart`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify({ product_id: productId, quantity, user_id: userId, guest_id: guestId, packaging }) });
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
    return handleApiResponse(res);
  },
  getCartItems: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/cart/${id}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getCartItemsByGuest: async (id: string) => supabaseAPI.getCartItems(id),
  
  getActiveCarts: async () => {
    const res = await fetch(`${API_BASE_URL}/analytics/carts`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getCartByIdentifier: async (identifier: string) => {
    const res = await fetch(`${API_BASE_URL}/analytics/carts/${identifier}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  updateCartItemQuantity: async (id: string, quantity: number) => {
    const res = await fetch(`${API_BASE_URL}/cart/${id}`, { method: 'PUT', headers: getApiHeaders(), body: JSON.stringify({ quantity }) });
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
    return handleApiResponse(res);
  },
  removeFromCart: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/cart/${id}`, { method: 'DELETE', headers: getApiHeaders() });
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
    return handleApiResponse(res);
  },

  // SETTINGS & TRANSLATIONS
  getSiteSettings: async () => {
    return supabaseAPI._fetchWithCache("site-settings", async () => {
      const res = await fetch(`${API_BASE_URL}/settings/site`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getFooterSettings: async () => {
    return supabaseAPI._fetchWithCache("footer-settings", async () => {
      const res = await fetch(`${API_BASE_URL}/settings/footer`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getTranslations: async () => {
    return supabaseAPI._fetchWithCache("translations", async () => {
      const res = await fetch(`${API_BASE_URL}/settings/translations`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },

  // LEADS
  createLead: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/leads`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  getAllLeads: async () => {
    const res = await fetch(`${API_BASE_URL}/leads`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getLeadById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  updateLead: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, { method: 'PUT', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  deleteLead: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, { method: 'DELETE', headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  syncLead: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/leads/sync`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  createNotification: async (data: {
    target_role: string;
    title: string;
    message: string;
    notification_type: string;
    action_url?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(data)
      });
      // Leer el texto primero para evitar crash en respuesta vacía
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      console.warn('⚠️ [NOTIFICATION] No se pudo crear notificación:', e);
      return null;
    }
  },
  getLeadByIdentifier: async (identifier: string) => {
    const res = await fetch(`${API_BASE_URL}/leads/search?identifier=${identifier}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },

  // ECOSYSTEM
  getEcosystemMembers: async () => {
    return supabaseAPI._fetchWithCache("ecosystem-members", async () => {
      const res = await fetch(`${API_BASE_URL}/ecosystem/members`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getAllEcosystemMembers: async () => {
    // Admin version: no cache
    const res = await fetch(`${API_BASE_URL}/ecosystem/members?all=true`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getEcosystemMemberTranslation: async (memberId: string, lang: string) => {
    const res = await fetch(`${API_BASE_URL}/ecosystem/${memberId}/translation/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getAllEcosystemMemberTranslations: async (lang: string) => {
    const res = await fetch(`${API_BASE_URL}/ecosystem/translations/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },

  // BLOG
  getBlogPosts: async (status?: string) => {
    return supabaseAPI._fetchWithCache(`blog-posts-${status || 'all'}`, async () => {
      const url = status ? `${API_BASE_URL}/blog/posts?status=${status}` : `${API_BASE_URL}/blog/posts`;
      const res = await fetch(url, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getBlogPostById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/blog/${id}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getBlogPostBySlug: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/blog/${slug}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getBlogPostTranslation: async (id: string, lang: string) => {
    const res = await fetch(`${API_BASE_URL}/blog/${id}/translation/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  getAllBlogPostTranslations: async (lang: string) => {
    const res = await fetch(`${API_BASE_URL}/blog/translations/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getBlogCategories: async () => {
    return supabaseAPI._fetchWithCache("blog-categories", async () => {
      const res = await fetch(`${API_BASE_URL}/blog/categories`, { headers: getApiHeaders() });
      return handleApiResponse(res);
    });
  },
  getBlogCategoryTranslation: async (id: string, lang: string) => {
    const res = await fetch(`${API_BASE_URL}/blog/categories/${id}/translation/${lang}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => ({ name: '', description: '' }));
  },
  getBlogPostCategories: async (postId: string) => {
    const res = await fetch(`${API_BASE_URL}/blog/${postId}/categories`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => []);
  },

  // PRICES
  getPricesByProduct: async (productId: string) => {
    // El backend espera /api/prices/prod-ID
    const res = await fetch(`${API_BASE_URL}/prices/${productId}`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  calculatePrice: async (productId: string, quantity: number, packaging: string) => {
    const pricesData = await supabaseAPI.getPricesByProduct(productId);
    const prices = Array.isArray(pricesData) ? pricesData : [];
    
    // Normalizar embase para comparación
    const targetPkg = packaging || 'standard';
    const filteredPrices = prices.filter((p: any) => {
      const pPkg = p.packaging || 'standard';
      return pPkg.trim().toLowerCase() === targetPkg.trim().toLowerCase();
    });
    
    // Buscar el rango correcto
    const tier = filteredPrices.find((p: any) => 
      quantity >= p.min_quantity && (p.max_quantity === null || quantity <= p.max_quantity)
    );
    
    // Fallback al precio más bajo si no hay rango (o el primero disponible)
    const priceToUse = tier || filteredPrices[0] || { price_per_unit: 0, currency: 'USD' };
    const unitPrice = Number(priceToUse.price_per_unit);
    
    return {
      pricePerUnit: unitPrice,
      total: unitPrice * quantity,
      currency: priceToUse.currency
    };
  },
  createPrice: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/prices`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  updatePrice: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/prices/${id}`, { method: 'PUT', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  deletePrice: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/prices/${id}`, { method: 'DELETE', headers: getApiHeaders() });
    return handleApiResponse(res);
  },

  // FORMS
  getForms: async () => {
    const res = await fetch(`${API_BASE_URL}/forms`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getFormById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/forms/${id}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },
  createForm: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/forms`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  updateForm: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/forms/${id}`, { method: 'PUT', headers: getApiHeaders(), body: JSON.stringify(data) });
    return handleApiResponse(res);
  },
  deleteForm: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/forms/${id}`, { method: 'DELETE', headers: getApiHeaders() });
    return handleApiResponse(res);
  },

  // ANALYTICS
  trackEvent: async (data: any) => {
    fetch(`${API_BASE_URL}/analytics/track`, { method: 'POST', headers: getApiHeaders(), body: JSON.stringify(data) }).catch(() => {});
  },
  trackAnalyticsEvent: async (data: any) => supabaseAPI.trackEvent(data),

  // LEGAL
  getLegalPages: async () => {
    const res = await fetch(`${API_BASE_URL}/legal`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  getLegalPageBySlug: async (slug: string) => {
    const res = await fetch(`${API_BASE_URL}/legal/${slug}`, { headers: getApiHeaders() });
    return handleApiResponse(res).catch(() => null);
  },

  // NOTIFICATIONS
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, { headers: getApiHeaders() });
    return handleApiResponse(res);
  },
  markNotificationAsRead: async (id: string, readBy: string[]) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, { 
      method: 'PUT', 
      headers: getApiHeaders(), 
      body: JSON.stringify({ read_by: readBy }) 
    });
    return handleApiResponse(res);
  },
};
