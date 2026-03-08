import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// API para interactuar con Supabase
export const supabaseAPI = {
  // ==========================================
  // BLOG - CATEGORÍAS
  // ==========================================

  createBlogCategory: async (data) => {
    const { data: category, error } = await supabase
      .from("blog_categories")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return category;
  },

  updateBlogCategoryTranslation: async (categoryId, lang, data) => {
    const { data: translations, error } = await supabase
      .from("blog_category_translations")
      .upsert(
        {
          category_id: categoryId,
          language: lang,
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

  // ==========================================
  // BLOG - ARTÍCULOS
  // ==========================================

  createBlogPost: async (data) => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert([{ ...data, views: 0 }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return post;
  },

  updateBlogPostTranslation: async (postId, lang, data) => {
    const { data: translations, error } = await supabase
      .from("blog_post_translations")
      .upsert(
        {
          post_id: postId,
          language: lang,
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

  addBlogPostCategory: async (postId, categoryId) => {
    const { data: relation, error } = await supabase
      .from("blog_post_categories")
      .insert([{ post_id: postId, category_id: categoryId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return relation;
  }
};