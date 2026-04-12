import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos para las tablas de Supabase
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
  packaging?: string; // Ej: "1L", "5L", "20L", "Galón", "Cilindro 10kg"
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
  type:
    | "hero"
    | "text"
    | "features"
    | "products"
    | "team"
    | "timeline"
    | "contact"
    | "custom"
    | "trust"
    | "featured"
    | "ecosystem"
    | "news"
    | "stats"
    | "bento"
    | "quote"
    | "faq"
    | "history"
    | "problems"
    | "sectors"
    | "certifications"
    | "cta";
  order: number;
  visible: boolean;
  content: Record<string, any>;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    default_title: string;
    default_description: string;
    default_keywords: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
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

export interface BlogCategory {
  id: string;
  slug: string;
  order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface BlogCategoryTranslation {
  category_id: string;
  language: "es" | "en";
  name: string;
  description: string;
}

export interface BlogPostCategory {
  post_id: string;
  category_id: string;
}

export interface Translation {
  id: string;
  key: string;
  category: "ui" | "messages" | "navigation" | "forms";
  es: string;
  en: string;
}

// ==========================================
// LEGAL PAGES
// ==========================================

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

// ==========================================
// FOOTER SETTINGS
// ==========================================

export interface FooterLink {
  id: string;
  label_es: string;
  label_en: string;
  url: string;
  type: 'link' | 'category_dropdown'; // Nuevo tipo para dropdown de categorías
  category_id?: string; // ID de categoría si es un dropdown
}

export interface FooterColumn {
  id: string;
  title_es: string;
  title_en: string;
  links: FooterLink[];
}

export interface FooterSettings {
  id: string;
  columns: FooterColumn[];
  contact_info: {
    phone: string;
    email: string;
    location: string;
  };
  social_media: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  copyright_text_es: string;
  copyright_text_en: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// CART ITEMS
// ==========================================

export interface Guest {
  id: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  user_agent?: string;
  ip_address?: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  guest_id?: string | null;
  product_id: string;
  quantity: number;
  packaging?: string; // Tipo de embase
  created_at: string;
  updated_at: string;
}

// Interfaz para el resultado de getCartItems con datos de producto
export interface CartItemWithProduct {
  id: string;
  user_id: string | null;
  guest_id?: string | null;
  product_id: string;
  quantity: number;
  packaging?: string; // Tipo de embase
  created_at: string;
  updated_at: string;
  product: Product;
  translation: ProductTranslation;
}

// ==========================================
// ECOSYSTEM MEMBERS
// ==========================================

export interface EcosystemMember {
  id: string;
  slug: string;
  status: "active" | "inactive" | "draft";
  image: string;
  sector: string;
  social_media: Record<string, string>;
  youtube_videos: string[];
  short_videos: string[];
  created_at: string;
  updated_at: string;
}

export interface EcosystemMemberTranslation {
  member_id: string;
  language: "es" | "en";
  name: string;
  description: string;
}

// API para interactuar con Supabase
export const supabaseAPI = {
  // ==========================================
  // CACHÉ DE DATOS (Para navegación instantánea)
  // ==========================================
  _cache: {} as Record<string, { data: any; timestamp: number }>,
  _cacheTTL: 10 * 60 * 1000, // 10 minutos para considerar datos "frescos"
  _persistPrefix: "bionano_cache_",

  _getFromCache: (key: string, persist: boolean = true) => {
    // 1. Intentar desde memoria (más rápido)
    const cached = supabaseAPI._cache[key];
    if (cached && Date.now() - cached.timestamp < supabaseAPI._cacheTTL) {
      return cached.data;
    }

    // 2. Intentar desde localStorage si se permite persistencia
    if (persist && typeof window !== "undefined") {
      try {
        const persisted = localStorage.getItem(supabaseAPI._persistPrefix + key);
        if (persisted) {
          const parsed = JSON.parse(persisted);
          // Actualizar caché en memoria para la próxima vez
          supabaseAPI._cache[key] = parsed;
          return parsed.data;
        }
      } catch (e) {
        console.warn("Error leyendo caché persistente:", e);
      }
    }
    return null;
  },

  _saveToCache: (key: string, data: any, persist: boolean = true) => {
    const cacheEntry = { data, timestamp: Date.now() };
    supabaseAPI._cache[key] = cacheEntry;

    if (persist && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          supabaseAPI._persistPrefix + key,
          JSON.stringify(cacheEntry),
        );
      } catch (e) {
        console.warn("Error guardando caché persistente:", e);
      }
    }
  },

  _invalidateCache: (key: string) => {
    delete supabaseAPI._cache[key];
    if (typeof window !== "undefined") {
      localStorage.removeItem(supabaseAPI._persistPrefix + key);
    }
  },

  /**
   * Helper genérico para peticiones con caché y revalidación en segundo plano (SWR)
   */
  _fetchWithCache: async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    persist: boolean = true,
  ): Promise<T> => {
    const cachedData = supabaseAPI._getFromCache(key, persist);

    // Si hay datos en caché, devolverlos inmediatamente y revalidar en segundo plano
    if (cachedData) {
      // Revalidación asíncrona (no bloqueante)
      fetchFn()
        .then((freshData) => {
          supabaseAPI._saveToCache(key, freshData, persist);
          // Disparar evento para que los componentes se enteren si los datos cambiaron significativamente
          window.dispatchEvent(
            new CustomEvent("cache-updated", { detail: { key, data: freshData } }),
          );
        })
        .catch((err) => console.warn(`Revalidación fallida para ${key}:`, err));

      return cachedData as T;
    }

    // Si no hay caché, esperar a la petición inicial
    const data = await fetchFn();
    supabaseAPI._saveToCache(key, data, persist);
    return data;
  },

  // ==========================================
  // USUARIOS
  // ==========================================

  registerUser: async (
    data: Omit<User, "id" | "created_at" | "updated_at">,
  ): Promise<User> => {
    const { data: user, error } = await supabase
      .from("users")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return user;
  },

  loginUser: async (email: string, password: string): Promise<User> => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) throw new Error("Email o contraseña incorrectos");
    return user;
  },

  getUsers: async (): Promise<User[]> => {
    return supabaseAPI._fetchWithCache("users", async () => {
      const { data: users, error } = await supabase.from("users").select("*");
      if (error) throw new Error(error.message);
      return users || [];
    }, false); // No persistir usuarios en localStorage por seguridad
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const { data: user, error } = await supabase
      .from("users")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return user;
  },

  deleteUser: async (id: string): Promise<void> => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // CATEGORÍAS
  // ==========================================

  updateCategory: async (
    id: string,
    data: Partial<Category>,
  ): Promise<Category> => {
    const { data: category, error } = await supabase
      .from("categories")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return category;
  },

  async updateCategoryTranslation(
    categoryId: string,
    lang: string,
    data: Partial<CategoryTranslation>,
  ) {
    const { data: result, error } = await supabase
      .from("category_translations")
      .upsert(
        {
          ...data,
          category_id: categoryId,
          language: lang,
        },
        {
          onConflict: "category_id,language", // Esto es vital para que sepa cuándo sobrescribir
        },
      )
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  createCategory: async (data: Omit<Category, "id">): Promise<Category> => {
    const { data: category, error } = await supabase
      .from("categories")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // PÁGINAS Y CONTENIDO
  // ==========================================

  updatePageContent: async (
  pageId: string,
  language: "es" | "en",
  sections: Section[],
): Promise<PageContent> => {
  const { data: content, error } = await supabase
    .from("page_contents")
    .upsert(
      {
        page_id: pageId,
        language,
        sections,
      },
      { onConflict: "page_id, language" } // ESTO ES CLAVE
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Invalidar caché para asegurar que la próxima carga obtenga datos frescos
  supabaseAPI._invalidateCache(`page-content-${pageId}-${language}`);
  
  // Si estamos en el navegador, disparar eventos para notificar a los componentes
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('database-updated', { detail: { key: `page-content-${pageId}-${language}` } }));
    window.dispatchEvent(new CustomEvent('cache-updated', { detail: { key: `page-content-${pageId}-${language}`, data: content } }));
  }

  return content;
},

  updatePage: async (id: string, data: Partial<Page>): Promise<Page> => {
    const { data: page, error } = await supabase
      .from("pages")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return page;
  },

  // ==========================================
  // TRADUCCIONES
  // ==========================================

  getTranslations: async (): Promise<Translation[]> => {
    return supabaseAPI._fetchWithCache("translations", async () => {
      const { data: translations, error } = await supabase
        .from("translations")
        .select("*");
      if (error) throw new Error(error.message);
      return translations || [];
    });
  },

  updateTranslation: async (
    id: string,
    data: Partial<Translation>,
  ): Promise<Translation> => {
    const { data: translation, error } = await supabase
      .from("translations")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return translation;
  },

  createTranslation: async (
    data: Omit<Translation, "id">,
  ): Promise<Translation> => {
    const { data: translation, error } = await supabase
      .from("translations")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return translation;
  },

  deleteTranslation: async (id: string): Promise<void> => {
    const { error } = await supabase.from("translations").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // CONFIGURACIÓN DEL SITIO
  // ==========================================

  getSiteSettings: async (): Promise<SiteSettings> => {
    return supabaseAPI._fetchWithCache("site-settings", async () => {
      const { data: settings, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        // Devolver configuración predeterminada si no existe o hay error
        return {
          id: "settings-001",
          site_name: "BionanoAyt",
          site_email: "contacto@bionanoayt.com",
          site_phone: "+51 999 123 456",
          site_address: "Av. El Sol 123, Lima, Perú",
          social_media: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
          },
          seo: {
            default_title: "BionanoAyt - Soluciones Sostenibles",
            default_description: "BionanoAyt ofrece soluciones sostenibles para el cuidado del medio ambiente y la salud humana.",
            default_keywords: "bionanoayt, sostenibilidad, medio ambiente, salud",
          },
          colors: {
            primary: "#1C5D15",
            secondary: "#629960",
            accent: "#19FF00",
            background: "#F7F9CE",
          },
        };
      }

      // Asegurar que las propiedades anidadas existan
      return {
        ...settings,
        social_media: settings.social_media || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        seo: settings.seo || {
          default_title: "BionanoAyt - Soluciones Sostenibles",
          default_description: "BionanoAyt ofrece soluciones sostenibles para el cuidado del medio ambiente y la salud humana.",
          default_keywords: "bionanoayt, sostenibilidad, medio ambiente, salud",
        },
        colors: settings.colors || {
          primary: "#1C5D15",
          secondary: "#629960",
          accent: "#19FF00",
          background: "#F7F9CE",
        },
      };
    });
  },

  updateSiteSettings: async (
    data: Partial<SiteSettings>,
  ): Promise<SiteSettings> => {
    // La tabla site_settings solo tiene una fila (id = settings-001)
    const { data: settings, error } = await supabase
      .from("site_settings")
      .update(data)
      .eq("id", "settings-001") // Especificamos la fila a actualizar
      .select()
      .single();

    if (error) {
      // Si la fila no existe, intentamos crearla
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase
          .from("site_settings")
          .insert([{ id: "settings-001", ...data }])
          .select()
          .single();
        
        if (insertError) {
          throw new Error(insertError.message);
        }
        
        return newSettings;
      }
      throw new Error(error.message);
    }

    return settings;
  },

  // ==========================================
  // PRODUCTOS
  // ==========================================

  getProducts: async (): Promise<Product[]> => {
    return supabaseAPI._fetchWithCache("products", async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return products || [];
    });
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return products || [];
  },

  getAllProducts: async (): Promise<Product[]> => {
    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw new Error(error.message);
    return products;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const cacheKey = `product-${id}`;
    return supabaseAPI._fetchWithCache(cacheKey, async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error && error.code !== "PGRST116") throw new Error(error.message);
      return product || null;
    });
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);

    return product || null;
  },

  getProductTranslation: async (
    productId: string,
    language: "es" | "en",
  ): Promise<ProductTranslation> => {
    const { data: translation, error } = await supabase
      .from("product_translations")
      .select("*")
      .eq("product_id", productId)
      .eq("language", language)
      .single();

    if (error) {
      // Si el error es de que no se encontró la fila, devolvemos una traducción vacía
      if (error.code === "PGRST116" || error.code === "406") {
        return {
          product_id: productId,
          language: language,
          name: "",
          description: "",
          short_description: "",
          features: [],
          benefits: [],
          technical_specs: {},
          meta_title: "",
          meta_description: "",
        };
      }
      throw new Error(error.message);
    }

    return translation;
  },

  updateProduct: async (
    id: string,
    data: Partial<Product>,
  ): Promise<Product> => {
    const { data: product, error } = await supabase
      .from("products")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    supabaseAPI._invalidateCache("products");
    supabaseAPI._invalidateCache(`product-${id}`);
    return product;
  },

  updateProductTranslation: async (
    productId: string,
    language: "es" | "en",
    data: Partial<ProductTranslation>,
  ): Promise<ProductTranslation> => {
    const { data: translations, error } = await supabase
      .from("product_translations")
      .upsert(
        {
          product_id: productId,
          language: language,
          ...data,
        },
        {
          onConflict: "product_id,language", // Evita el error 409 y 406
        },
      )
      .select();

    if (error) throw new Error(error.message);
    return translations[0];
  },

  createProduct: async (
    data: Omit<Product, "id" | "created_at" | "updated_at">,
  ): Promise<Product> => {
    const { data: product, error } = await supabase
      .from("products")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    supabaseAPI._invalidateCache("products");
    supabaseAPI._invalidateCache(`product-${product.id}`);
    return product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // PRECIOS
  // ==========================================

  getPricesByProduct: async (productId: string): Promise<PriceByQuantity[]> => {
    const { data: prices, error } = await supabase
      .from("prices_by_quantity")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      throw new Error(error.message);
    }

    return prices || [];
  },

  calculatePrice: async (
    productId: string,
    quantity: number,
    packaging?: string,
  ): Promise<{
    pricePerUnit: number;
    total: number;
    currency: string;
  } | null> => {
    let query = supabase
      .from("prices_by_quantity")
      .select("*")
      .eq("product_id", productId)
      .lte("min_quantity", quantity)
      .or(`max_quantity.is.null,max_quantity.gte.${quantity}`);

    if (packaging) {
      query = query.eq("packaging", packaging);
    }

    const { data: prices, error } = await query;

    if (error) throw new Error(error.message);

    const applicablePrice = prices.find(
      (p) =>
        quantity >= p.min_quantity &&
        (p.max_quantity === null || quantity <= p.max_quantity),
    );

    if (!applicablePrice) {
      return null;
    }

    return {
      pricePerUnit: applicablePrice.price_per_unit,
      total: applicablePrice.price_per_unit * quantity,
      currency: applicablePrice.currency,
    };
  },

  updatePrice: async (
    id: string,
    data: Partial<PriceByQuantity>,
  ): Promise<PriceByQuantity> => {
    const { data: price, error } = await supabase
      .from("prices_by_quantity")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return price;
  },

  createPrice: async (
    data: Omit<PriceByQuantity, "id">,
  ): Promise<PriceByQuantity> => {
    const { data: price, error } = await supabase
      .from("prices_by_quantity")
      .insert([
        {
          product_id: data.product_id,
          min_quantity: data.min_quantity,
          max_quantity: data.max_quantity,
          price_per_unit: data.price_per_unit,
          currency: data.currency,
          packaging: data.packaging,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return price;
  },

  deletePrice: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("prices_by_quantity")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // CATEGORÍAS (PÚBLICO)
  // ==========================================

  getCategories: async (): Promise<Category[]> => {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("status", "active");

    if (error) {
      throw new Error(error.message);
    }

    return categories || [];
  },

  getAllCategories: async (): Promise<Category[]> => {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");

    if (error) throw new Error(error.message);
    return categories;
  },

  getCategoryTranslation: async (
    categoryId: string,
    language: "es" | "en",
  ): Promise<CategoryTranslation | null> => {
    const cacheKey = `cat-trans-${categoryId}-${language}`;
    const cached = supabaseAPI._getFromCache(cacheKey);
    if (cached) return cached;

    const { data: translations, error } = await supabase
      .from("category_translations")
      .select("*")
      .eq("category_id", categoryId)
      .eq("language", language);

    if (error) {
      throw new Error(error.message);
    }

    const translation =
      translations && translations.length > 0 ? translations[0] : null;

    if (translation) supabaseAPI._saveToCache(cacheKey, translation);
    return translation || null;
  },

  // ==========================================
  // BLOG - ARTÍCULOS
  // ==========================================

  getBlogPosts: async (status?: "draft" | "published", type?: "article" | "news"): Promise<BlogPost[]> => {
    const cacheKey = `blog-${status || 'all'}-${type || 'all'}`;
    const cached = supabaseAPI._getFromCache(cacheKey);
    if (cached) return cached;

    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    
    if (status) {
      query = query.eq("status", status);
    }
    
    if (type) {
      query = query.eq("type", type);
    }
    
    const { data: posts, error } = await query;
    
    if (error) throw new Error(error.message);
    
    supabaseAPI._saveToCache(cacheKey, posts);
    return posts || [];
  },

  getBlogPostById: async (id: string): Promise<BlogPost | null> => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return post || null;
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return post || null;
  },

  getBlogPostTranslation: async (
    postId: string,
    language: "es" | "en",
  ): Promise<BlogPostTranslation> => {
    const { data: translation, error } = await supabase
      .from("blog_post_translations")
      .select("*")
      .eq("post_id", postId)
      .eq("language", language)
      .single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "406") {
        return {
          post_id: postId,
          language: language,
          title: "",
          excerpt: "",
          content: "",
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
        };
      }
      throw new Error(error.message);
    }

    return translation;
  },

  createBlogPost: async (data: Omit<BlogPost, "id" | "created_at" | "updated_at" | "views">): Promise<BlogPost> => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert([{ ...data, views: 0 }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return post;
  },

  updateBlogPost: async (
    id: string,
    data: Partial<BlogPost>,
  ): Promise<BlogPost> => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return post;
  },

  updateBlogPostTranslation: async (
    postId: string,
    language: "es" | "en",
    data: Partial<BlogPostTranslation>,
  ): Promise<BlogPostTranslation> => {
    const { data: translations, error } = await supabase
      .from("blog_post_translations")
      .upsert(
        {
          post_id: postId,
          language: language,
          ...data,
        },
        {
          onConflict: "post_id,language",
        },
      )
      .select();

    if (error) throw new Error(error.message);
    return translations[0];
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // BLOG - CATEGORÍAS
  // ==========================================

  getBlogCategories: async (status?: "active" | "inactive"): Promise<BlogCategory[]> => {
    let query = supabase.from("blog_categories").select("*").order("order", { ascending: true });
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data: categories, error } = await query;
    
    if (error) throw new Error(error.message);
    return categories || [];
  },

  getBlogCategoryById: async (id: string): Promise<BlogCategory | null> => {
    const { data: category, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return category || null;
  },

  getBlogCategoryBySlug: async (slug: string): Promise<BlogCategory | null> => {
    const { data: category, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return category || null;
  },

  getBlogCategoryTranslation: async (
    categoryId: string,
    language: "es" | "en",
  ): Promise<BlogCategoryTranslation> => {
    const { data: translation, error } = await supabase
      .from("blog_category_translations")
      .select("*")
      .eq("category_id", categoryId)
      .eq("language", language)
      .single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "406") {
        return {
          category_id: categoryId,
          language: language,
          name: "",
          description: "",
        };
      }
      throw new Error(error.message);
    }

    return translation;
  },

  createBlogCategory: async (data: Omit<BlogCategory, "id" | "created_at" | "updated_at">): Promise<BlogCategory> => {
    const { data: category, error } = await supabase
      .from("blog_categories")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return category;
  },

  updateBlogCategory: async (
    id: string,
    data: Partial<BlogCategory>,
  ): Promise<BlogCategory> => {
    const { data: category, error } = await supabase
      .from("blog_categories")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return category;
  },

  updateBlogCategoryTranslation: async (
    categoryId: string,
    language: "es" | "en",
    data: Partial<BlogCategoryTranslation>,
  ): Promise<BlogCategoryTranslation> => {
    const { data: translations, error } = await supabase
      .from("blog_category_translations")
      .upsert(
        {
          category_id: categoryId,
          language: language,
          ...data,
        },
        {
          onConflict: "category_id,language",
        },
      )
      .select();

    if (error) throw new Error(error.message);
    return translations[0];
  },

  deleteBlogCategory: async (id: string): Promise<void> => {
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // BLOG - RELACIONES
  // ==========================================

  getBlogPostCategories: async (postId: string): Promise<BlogPostCategory[]> => {
    const { data: relations, error } = await supabase
      .from("blog_post_categories")
      .select("*")
      .eq("post_id", postId);

    if (error) throw new Error(error.message);
    return relations || [];
  },

  addBlogPostCategory: async (postId: string, categoryId: string): Promise<BlogPostCategory> => {
    const { data: relation, error } = await supabase
      .from("blog_post_categories")
      .insert([{ post_id: postId, category_id: categoryId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return relation;
  },

  removeBlogPostCategory: async (postId: string, categoryId: string): Promise<void> => {
    const { error } = await supabase
      .from("blog_post_categories")
      .delete()
      .eq("post_id", postId)
      .eq("category_id", categoryId);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // PÁGINAS (PÚBLICO)
  // ==========================================

  getPageBySlug: async (slug: string): Promise<Page | null> => {
    const { data: page, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return page;
  },

  getAllPages: async (): Promise<Page[]> => {
    return supabaseAPI._fetchWithCache("pages", async () => {
      const { data: pages, error } = await supabase.from("pages").select("*");
      if (error) throw new Error(error.message);
      return pages || [];
    });
  },

  getPageContent: async (
    pageId: string,
    language: "es" | "en",
  ): Promise<PageContent | null> => {
    const cacheKey = `page-content-${pageId}-${language}`;
    return supabaseAPI._fetchWithCache(cacheKey, async () => {
      const { data: content, error } = await supabase
        .from("page_contents")
        .select("*")
        .eq("page_id", pageId)
        .eq("language", language)
        .single();

      if (error || !content) {
        return null;
      }

      // Si el idioma es inglés, usar las imágenes del contenido en español
      if (language === "en") {
        const { data: contentES, error: errorES } = await supabase
          .from("page_contents")
          .select("*")
          .eq("page_id", pageId)
          .eq("language", "es")
          .single();

        if (!errorES && contentES) {
          content.sections = content.sections.map((sectionEN: Section) => {
            const sectionES = contentES.sections.find((sec: Section) => sec.id === sectionEN.id);
            if (sectionES) {
              const updatedSection = { ...sectionEN };
              
              if (sectionEN.content.backgroundImage) {
                updatedSection.content.backgroundImage = sectionES.content.backgroundImage || sectionEN.content.backgroundImage;
              }
              if (sectionEN.content.productImage) {
                updatedSection.content.productImage = sectionES.content.productImage || sectionEN.content.productImage;
              }
              if (sectionEN.content.members) {
                updatedSection.content.members = sectionEN.content.members.map((memberEN: any, idx: number) => {
                  const memberES = sectionES.content.members?.[idx];
                  if (memberES && memberES.image) {
                    return { ...memberEN, image: memberES.image };
                  }
                  return memberEN;
                });
              }
              if (sectionEN.content.products) {
                updatedSection.content.products = sectionEN.content.products.map((productEN: any, idx: number) => {
                  const productES = sectionES.content.products?.[idx];
                  if (productES && productES.image) {
                    return { ...productEN, image: productES.image };
                  }
                  return productEN;
                });
              }
              if (sectionEN.content.partners) {
                updatedSection.content.partners = sectionEN.content.partners.map((partnerEN: any, idx: number) => {
                  const partnerES = sectionES.content.partners?.[idx];
                  if (partnerES && partnerES.image) {
                    return { ...partnerEN, image: partnerES.image };
                  }
                  return partnerEN;
                });
              }
              if (sectionEN.content.allies) {
                updatedSection.content.allies = sectionEN.content.allies.map((allyEN: any, idx: number) => {
                  const allyES = sectionES.content.allies?.[idx];
                  if (allyES && allyES.image) {
                    return { ...allyEN, image: allyES.image };
                  }
                  return allyEN;
                });
              }
              if (sectionEN.content.items) {
                updatedSection.content.items = sectionEN.content.items.map((itemEN: any, idx: number) => {
                  const itemES = sectionES.content.items?.[idx];
                  if (itemES && itemES.image) {
                    return { ...itemEN, image: itemES.image };
                  }
                  return itemEN;
                });
              }
              if (sectionEN.content.features) {
                updatedSection.content.features = sectionEN.content.features.map((featureEN: any, idx: number) => {
                  const featureES = sectionES.content.features?.[idx];
                  if (featureES && featureES.image) {
                    return { ...featureEN, image: featureES.image };
                  }
                  return featureEN;
                });
              }

              return updatedSection;
            }
            return sectionEN;
          });
        }
      }
      return content;
    });
  },

  // ==========================================
  // ECOSYSTEM MEMBERS
  // ==========================================

  getEcosystemMembers: async (): Promise<EcosystemMember[]> => {
    const { data: members, error } = await supabase
      .from("ecosystem_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return members || [];
  },

  getEcosystemMemberById: async (id: string): Promise<EcosystemMember | null> => {
    const { data: member, error } = await supabase
      .from("ecosystem_members")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return member || null;
  },

  getEcosystemMemberBySlug: async (slug: string): Promise<EcosystemMember | null> => {
    const { data: member, error } = await supabase
      .from("ecosystem_members")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return member || null;
  },

  getEcosystemMemberTranslation: async (
    memberId: string,
    language: "es" | "en",
  ): Promise<EcosystemMemberTranslation> => {
    const { data: translation, error } = await supabase
      .from("ecosystem_member_translations")
      .select("*")
      .eq("member_id", memberId)
      .eq("language", language)
      .single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "406") {
        return {
          member_id: memberId,
          language: language,
          name: "",
          description: "",
        };
      }
      throw new Error(error.message);
    }

    return translation;
  },

  updateEcosystemMember: async (
    id: string,
    data: Partial<EcosystemMember>,
  ): Promise<EcosystemMember> => {
    const { data: updateResult, error: updateError } = await supabase
      .from("ecosystem_members")
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select();

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Si la actualización no encontró el registro, intenta obtenerlo directamente
    if (!updateResult || updateResult.length === 0) {
      const { data: getResult, error: getError } = await supabase
        .from("ecosystem_members")
        .select("*")
        .eq("id", id)
        .single();

      if (getError) {
        throw new Error(`Miembro con ID ${id} no encontrado`);
      }
      
      return getResult;
    }

    return updateResult[0];
  },

  updateEcosystemMemberTranslation: async (
    memberId: string,
    language: "es" | "en",
    data: Partial<EcosystemMemberTranslation>,
  ): Promise<EcosystemMemberTranslation> => {
    const { data: translations, error } = await supabase
      .from("ecosystem_member_translations")
      .upsert(
        {
          member_id: memberId,
          language: language,
          ...data,
        },
        {
          onConflict: "member_id,language",
        },
      )
      .select();

    if (error) throw new Error(error.message);
    return translations[0];
  },

  createEcosystemMember: async (
    data: Omit<EcosystemMember, "id" | "created_at" | "updated_at">,
  ): Promise<EcosystemMember> => {
    const { data: member, error } = await supabase
      .from("ecosystem_members")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return member;
  },

  deleteEcosystemMember: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("ecosystem_members")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // CART OPERATIONS
  // ==========================================

  // Auxiliar para validar UUIDs antes de enviar a Supabase
  // Auxiliar para validar IDs (UUID estándar o IDs de prueba estilo user-001)
  isValidUUID: (id: string | null): boolean => {
    if (!id) return false;
    // Regex flexible que acepta UUID estándar O IDs de prueba alfanuméricos con guiones
    const flexibleIdRegex = /^[0-9a-f-]{8,36}$/i;
    return flexibleIdRegex.test(id) || /^(user|guest|footer|prod|cat)-[0-9]+$/i.test(id);
  },

  // Sincronizar visitante con la base de datos
  upsertGuest: async (guestId: string): Promise<void> => {
    // Solo sincronizar si es un UUID válido
    if (!supabaseAPI.isValidUUID(guestId)) return;
    const { error } = await supabase
      .from("guests")
      .upsert({
        id: guestId,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('No se pudo sincronizar el visitante:', error.message);
    }
  },

  // Fusionar carrito de invitado con el de usuario al iniciar sesión
  mergeGuestCart: async (userId: string, guestId: string): Promise<void> => {
    if (!supabaseAPI.isValidUUID(userId) || !supabaseAPI.isValidUUID(guestId)) return;

    try {
      // 1. Obtener items del invitado
      const { data: guestItems, error: fetchError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("guest_id", guestId);

      if (fetchError) {
        console.error("Error fetching guest items:", fetchError);
        return;
      }
      
      if (!guestItems || guestItems.length === 0) return;

      // 2. Por cada item del invitado, intentar moverlo o fusionarlo
      for (const item of guestItems) {
        // Verificar si el usuario ya tiene ese producto con el mismo empaque
        const { data: existingUserItem, error: existError } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", userId)
          .eq("product_id", item.product_id)
          .eq("packaging", item.packaging || 'Sin embase')
          .maybeSingle();

        if (existingUserItem) {
          // Fusionar cantidades y borrar el de invitado
          await supabase
            .from("cart_items")
            .update({ quantity: existingUserItem.quantity + item.quantity })
            .eq("id", existingUserItem.id);
          
          await supabase.from("cart_items").delete().eq("id", item.id);
        } else {
          // Migrar el item al usuario manteniendo el guest_id como null para satisfacer chk_user_or_guest_id
          const { error: updateError } = await supabase
            .from("cart_items")
            .update({ user_id: userId, guest_id: null })
            .eq("id", item.id);
            
          if (updateError) {
            console.error("Error updating cart item to user ID:", updateError);
          }
        }
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated'));
        window.dispatchEvent(new CustomEvent('database-updated')); // Asegurar sync
      }
    } catch (err) {
      console.error("Critical error in mergeGuestCart:", err);
    }
  },

  // Agregar o actualizar un item en el carrito
  addToCart: async (userId: string | null, guestId: string | null, productId: string, quantity: number = 1, packaging?: string): Promise<CartItem> => {
    // Verificar si el item ya existe en el carrito con la misma embase
    let query = supabase.from("cart_items").select("*");
    
    if (userId && supabaseAPI.isValidUUID(userId)) {
      query = query.eq("user_id", userId);
    } else if (guestId && supabaseAPI.isValidUUID(guestId)) {
      query = query.eq("guest_id", guestId);
    } else {
      console.warn("Se ignoró petición al carrito por ID inválido:", { userId, guestId });
      throw new Error("Sesión inválida. Por favor recarga la página.");
    }

    // Valor de packaging para la consulta (limpio de espacios extra)
    const packagingValue = (packaging || 'Sin embase').trim();
    
    // Usamos .maybeSingle() en lugar de .single() para evitar errores 406
    // cuando la consulta no devuelve nada con carácteres especiales.
    const { data: existingItem, error: fetchError } = await query
      .eq("product_id", productId)
      .eq("packaging", packagingValue)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(fetchError.message);
    }

    if (existingItem) {
      // Actualizar cantidad si el item ya existe
      const newQuantity = existingItem.quantity + quantity;
      
      const { data: updatedItem, error: updateError } = await supabase
        .from("cart_items")
        .update({ 
          quantity: newQuantity
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
      return updatedItem;
    } else {
      // Agregar nuevo item al carrito
      const insertData: any = {
        product_id: productId,
        quantity,
        packaging: packagingValue
      };

      if (userId) {
        insertData.user_id = userId;
      } else if (guestId) {
        insertData.guest_id = guestId;
      }

      const { data: newItem, error: insertError } = await supabase
        .from("cart_items")
        .insert([insertData])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
      return newItem;
    }
  },

  // Obtener todos los items del carrito de un usuario o visitante
  getCartItems: async (userId: string): Promise<CartItemWithProduct[]> => {
    if (!supabaseAPI.isValidUUID(userId)) return [];
    
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (cartError) throw new Error(cartError.message);

    // Obtener datos de productos y traducciones para cada item del carrito
    const cartItemsWithProducts = await Promise.all(
      (cartItems || []).map(async (item) => {
        const product = await supabaseAPI.getProductById(item.product_id);
        const translation = await supabaseAPI.getProductTranslation(item.product_id, "es"); // Default to Spanish

        return {
          ...item,
          product: product!,
          translation: translation,
        };
      })
    );

    // Ordenar items por tipo de embase
    const sortedItems = cartItemsWithProducts.sort((a, b) => {
      const packagingA = a.packaging || 'Sin embase';
      const packagingB = b.packaging || 'Sin embase';
      return packagingA.localeCompare(packagingB);
    });

    return sortedItems.filter(item => item.product !== null);
  },

  // Obtener items por ID de invitado
  getCartItemsByGuest: async (guestId: string): Promise<CartItemWithProduct[]> => {
    if (!supabaseAPI.isValidUUID(guestId)) return [];
    
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("guest_id", guestId);

    if (cartError) throw new Error(cartError.message);

    // Obtener datos de productos y traducciones para cada item del carrito
    const cartItemsWithProducts = await Promise.all(
      (cartItems || []).map(async (item) => {
        const product = await supabaseAPI.getProductById(item.product_id);
        const translation = await supabaseAPI.getProductTranslation(item.product_id, "es"); // Default to Spanish

        return {
          ...item,
          product: product!,
          translation: translation,
        };
      })
    );

    // Ordenar items por tipo de embase
    const sortedItems = cartItemsWithProducts.sort((a, b) => {
      const packagingA = a.packaging || 'Sin embase';
      const packagingB = b.packaging || 'Sin embase';
      return packagingA.localeCompare(packagingB);
    });

    return sortedItems.filter(item => item.product !== null);
  },

  // Actualizar cantidad de un item en el carrito
  updateCartItemQuantity: async (itemId: string, quantity: number): Promise<CartItem> => {
    // Actualizar item con nueva cantidad
    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({ 
        quantity
      })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }
    
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
    return updatedItem;
  },

  // Eliminar un item del carrito
  removeFromCart: async (itemId: string): Promise<void> => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) throw new Error(error.message);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
  },

  // Vaciar el carrito de un usuario
  clearCart: async (userId: string): Promise<void> => {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);

    if (error) throw new Error(error.message);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
  },

  // ==========================================
  // LEGAL PAGES
  // ==========================================

  getLegalPages: async (): Promise<LegalPage[]> => {
    const { data: pages, error } = await supabase
      .from("legal_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return pages || [];
  },

  getLegalPageById: async (id: string): Promise<LegalPage | null> => {
    const { data: page, error } = await supabase
      .from("legal_pages")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return page || null;
  },

  getLegalPageBySlug: async (slug: string): Promise<LegalPage | null> => {
    const { data: page, error } = await supabase
      .from("legal_pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return page || null;
  },

  createLegalPage: async (
    data: Omit<LegalPage, "id" | "created_at" | "updated_at">,
  ): Promise<LegalPage> => {
    const { data: page, error } = await supabase
      .from("legal_pages")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return page;
  },

  updateLegalPage: async (
    id: string,
    data: Partial<LegalPage>,
  ): Promise<LegalPage> => {
    const { data: page, error } = await supabase
      .from("legal_pages")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return page;
  },

  deleteLegalPage: async (id: string): Promise<void> => {
    const { error } = await supabase.from("legal_pages").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  // ==========================================
  // FOOTER SETTINGS
  // ==========================================

  getFooterSettings: async (): Promise<FooterSettings> => {
    const { data: settings, error } = await supabase
      .from("footer_settings")
      .select("*")
      .single();

    if (error) {
      // Devolver configuración predeterminada si no existe o hay error
      return {
        id: "footer-001",
        columns: [
          {
            id: "col-1",
            title_es: "Empresa",
            title_en: "Company",
            links: [
              { id: "link-1", label_es: "Sobre Nosotros", label_en: "About Us", url: "/about", type: "link" },
              { id: "link-2", label_es: "Nuestra Tecnología", label_en: "Our Technology", url: "/technology", type: "link" },
              { id: "link-3", label_es: "Proceso", label_en: "Process", url: "/process", type: "link" },
              { id: "link-4", label_es: "Ecosistema", label_en: "Ecosystem", url: "/ecosystem", type: "link" }
            ]
          },
          {
            id: "col-2",
            title_es: "Productos",
            title_en: "Products",
            links: [
              { id: "link-5", label_es: "Antimicrobianos", label_en: "Antimicrobials", url: "/store?category=antimicrobianos", type: "link" },
              { id: "link-6", label_es: "Limpieza Industrial", label_en: "Industrial Cleaning", url: "/store?category=limpieza-industrial", type: "link" },
              { id: "link-7", label_es: "Fertilizantes", label_en: "Fertilizers", url: "/store?category=fertilizantes", type: "link" },
              { id: "link-8", label_es: "Fungicidas", label_en: "Fungicides", url: "/store?category=fungicidas", type: "link" }
            ]
          },
          {
            id: "col-3",
            title_es: "Legal",
            title_en: "Legal",
            links: [
              { id: "link-9", label_es: "Política de Privacidad", label_en: "Privacy Policy", url: "/legal/privacy-policy", type: "link" },
              { id: "link-10", label_es: "Términos y Condiciones", label_en: "Terms and Conditions", url: "/legal/terms-conditions", type: "link" },
              { id: "link-11", label_es: "Política de Cookies", label_en: "Cookie Policy", url: "/legal/cookie-policy", type: "link" },
              { id: "link-12", label_es: "Aviso Legal", label_en: "Legal Notice", url: "/legal/legal-notice", type: "link" }
            ]
          },
          {
            id: "col-4",
            title_es: "Contacto",
            title_en: "Contact",
            links: [
              { id: "link-13", label_es: "Contáctanos", label_en: "Contact Us", url: "/#contact", type: "link" },
              { id: "link-14", label_es: "Preguntas Frecuentes", label_en: "FAQ", url: "/faq", type: "link" },
              { id: "link-15", label_es: "Blog", label_en: "Blog", url: "/blog", type: "link" }
            ]
          }
        ],
        contact_info: {
          phone: "",
          email: "",
          location: ""
        },
        social_media: {
          facebook: "https://facebook.com/atbionano",
          twitter: "https://twitter.com/atbionano",
          instagram: "https://instagram.com/atbionano",
          linkedin: "https://linkedin.com/company/atbionano"
        },
        copyright_text_es: "© {{year}} BionanoAyT. Todos los derechos reservados.",
        copyright_text_en: "© {{year}} BionanoAyT. All rights reserved.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    return {
      ...settings,
      contact_info: settings.contact_info || {
        phone: "",
        email: "",
        location: ""
      },
      social_media: settings.social_media || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      },
      columns: settings.columns || []
    };
  },

  updateFooterSettings: async (
    data: Partial<FooterSettings>,
  ): Promise<FooterSettings> => {
    // La tabla footer_settings solo tiene una fila (id = footer-001)
    const { data: settings, error } = await supabase
      .from("footer_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", "footer-001")
      .select()
      .single();

    if (error) {
      // Si la fila no existe, intentamos crearla
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase
          .from("footer_settings")
          .insert([{ id: "footer-001", ...data }])
          .select()
          .single();
        
        if (insertError) {
          throw new Error(insertError.message);
        }
        
        return newSettings;
      }
      throw new Error(error.message);
    }

    return settings;
  },

};
