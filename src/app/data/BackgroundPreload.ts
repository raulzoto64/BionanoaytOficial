import { supabaseAPI } from "./supabase";

// Referencia al caché global del componente Ecosystem.tsx
// (se declara aquí para poder llenarlo desde el preloader)
export let ecosystemPreloadCache: {
  members: any[];
  translations: Record<string, any>;
  language: string;
} | null = null;

export let newsPreloadCache: {
  posts: any[];
  language: string;
} | null = null;

export const setEcosystemPreloadCache = (data: typeof ecosystemPreloadCache) => {
  ecosystemPreloadCache = data;
};

export const setNewsPreloadCache = (data: typeof newsPreloadCache) => {
  newsPreloadCache = data;
};

/**
 * Motor de precarga en segundo plano.
 * Descarga y guarda en caché los datos de las secciones dinámicas de la Home
 * para que no haya esperas al regresar de una página de detalle.
 */
export const BackgroundPreload = {
  _started: false,

  start: (language: string = 'es') => {
    if (BackgroundPreload._started) return;
    BackgroundPreload._started = true;

    // Esperar 2 segundos para no interferir con la carga inicial crítica
    setTimeout(() => {
      BackgroundPreload._performPreload(language);
    }, 2000);
  },

  _performPreload: async (language: string) => {
    console.log("[CACHE] Iniciando precarga de traducciones críticas en segundo plano...");
    
    try {
      // 1. Traducciones y settings (ya existía)
      await supabaseAPI.getTranslations();
      await supabaseAPI.getSiteSettings();

      console.log("[CACHE] Precarga crítica completada.");

      // 2. Precarga del Ecosistema (para scroll inmediato al regresar)
      console.log("[CACHE] Precargando miembros del Ecosistema...");
      const members = await supabaseAPI.getEcosystemMembers();
      const translationPromises = members.map(async (member: any) => {
        const translation = await supabaseAPI.getEcosystemMemberTranslation(member.id, language);
        return { id: member.id, translation };
      });
      const translationsResult = await Promise.all(translationPromises);
      const translationMap: Record<string, any> = {};
      translationsResult.forEach(({ id, translation }: any) => {
        translationMap[id] = translation;
      });
      // Escribir al caché global del componente Ecosystem
      ecosystemPreloadCache = { members, translations: translationMap, language };
      console.log("[CACHE] Ecosistema precargado:", members.length, "miembros.");

      // 3. Precarga de Productos
      console.log("[CACHE] Precargando productos...");
      await supabaseAPI.getProducts();
      console.log("[CACHE] Productos precargados.");

      // 4. Precarga de Blog/Noticias (con todos los detalles que necesita NewsSection)
      console.log("[CACHE] Precargando artículos y noticias del blog...");
      const allPosts = await supabaseAPI.getBlogPosts('published');
      const allCategories = await supabaseAPI.getBlogCategories('active');

      const categoryNames: Record<string, string> = {};
      for (const category of allCategories) {
        const translation = await supabaseAPI.getBlogCategoryTranslation(category.id, language);
        categoryNames[category.id] = translation.name || category.slug;
      }

      const postsWithTranslations = [];
      const featured = allPosts.filter((p: any) => p.featured).slice(0, 5);
      for (const post of featured) {
        const translation = await supabaseAPI.getBlogPostTranslation(post.id, language);
        const relations = await supabaseAPI.getBlogPostCategories(post.id);
        const category_id = relations.length > 0 ? relations[0].category_id : undefined;
        
        postsWithTranslations.push({
          ...post,
          translation,
          category_id,
          category_name: category_id ? categoryNames[category_id] || 'Sin categoría' : 'Sin categoría'
        });
      }

      newsPreloadCache = { posts: postsWithTranslations, language };
      console.log("[CACHE] Blog y noticias precargados:", featured.length, "artículos.");

    } catch (error) {
      console.warn("[CACHE] Error durante la precarga:", error);
    }
  }
};

