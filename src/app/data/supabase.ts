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
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  status: "active" | "inactive" | "draft";
  image: string;
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
    | "ecosystem";
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

// API para interactuar con Supabase
export const supabaseAPI = {
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
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) throw new Error(error.message);
    return users;
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
    console.error("Error detallado:", error);
    throw new Error(error.message);
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
    const { data: translations, error } = await supabase
      .from("translations")
      .select("*");

    if (error) throw new Error(error.message);
    return translations;
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
    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return settings;
  },

  updateSiteSettings: async (
    data: Partial<SiteSettings>,
  ): Promise<SiteSettings> => {
    const { data: settings, error } = await supabase
      .from("site_settings")
      .update(data)
      .single();

    if (error) throw new Error(error.message);
    return settings;
  },

  // ==========================================
  // PRODUCTOS
  // ==========================================

  getProducts: async (): Promise<Product[]> => {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      // Eliminamos el .eq('status', 'active') para que traiga TODO
      .order("created_at", { ascending: false }); // Opcional: para ver los más nuevos primero

    if (error) {
      throw new Error(error.message);
    }

    return products || [];
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

    console.log("Todos los productos:", products);
    if (error) throw new Error(error.message);
    return products;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);

    return product || null;
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
  ): Promise<{
    pricePerUnit: number;
    total: number;
    currency: string;
  } | null> => {
    const { data: prices, error } = await supabase
      .from("prices_by_quantity")
      .select("*")
      .eq("product_id", productId)
      .lte("min_quantity", quantity)
      .or(`max_quantity.is.null,max_quantity.gte.${quantity}`);

    if (error) throw new Error(error.message);

    const applicablePrice = prices.find(
      (p) =>
        quantity >= p.min_quantity &&
        (p.max_quantity === null || quantity <= p.max_quantity),
    );

    if (!applicablePrice) {
      // Si no hay precio aplicable, devolver un precio mock
      console.warn("No applicable price found, returning mock data");
      const mockPrices: Record<string, number> = {
        "prod-001": 45000,
        "prod-002": 35000,
        "prod-003": 55000,
        "prod-004": 25000,
      };

      const mockPrice = mockPrices[productId] || 0;
      return {
        pricePerUnit: mockPrice,
        total: mockPrice * quantity,
        currency: "COP",
      };
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

    return translation || null;
  },

  // ==========================================
  // BLOG - ARTÍCULOS
  // ==========================================

  getBlogPosts: async (status?: "draft" | "published"): Promise<BlogPost[]> => {
    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data: posts, error } = await query;
    
    if (error) throw new Error(error.message);
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
    const { data: pages, error } = await supabase.from("pages").select("*");
    
    if (error) {
      console.error("Error al obtener páginas:", error);
      return [];
    }
    
    return pages || [];
  },

  getPageContent: async (
    pageId: string,
    language: "es" | "en",
  ): Promise<PageContent | null> => {
    const { data: content, error } = await supabase
      .from("page_contents")
      .select("*")
      .eq("page_id", pageId)
      .eq("language", language)
      .single();

    if (error || !content) {
      if (error && error.code !== "PGRST116" && error.code !== "406") {
        console.warn("Error al obtener contenido de página:", error);
      }
      return null;
    }
    
    return content;
  },

};
