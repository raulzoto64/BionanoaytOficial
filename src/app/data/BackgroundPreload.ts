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

      // 4. Precarga de Blog/Noticias (Optimizado con Carga Masiva)
      console.log("[CACHE] Precargando artículos y noticias del blog...");
      const postsWithTranslationsRaw = await supabaseAPI.getAllBlogPostTranslations(language);

      const processedPosts = postsWithTranslationsRaw.map((post: any) => ({
        ...post,
        translation: post.title ? {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content
        } : (post.translation || { title: post.slug.replace(/-/g, ' ').toUpperCase(), excerpt: "..." }),
        category_name: post.category_name || 'General'
      }));

      // Seleccionar hasta 5 dándo prioridad a destacados
      const featuredPosts = processedPosts.filter((p: any) => p.featured);
      const recentPosts = processedPosts.filter((p: any) => !p.featured);
      const finalDisplay = [...featuredPosts, ...recentPosts].slice(0, 5);

      newsPreloadCache = { posts: finalDisplay, language };
      console.log("[CACHE] Blog y noticias precargados:", finalDisplay.length, "artículos.");

    } catch (error) {
      console.warn("[CACHE] Error durante la precarga:", error);
    }
  }
};

