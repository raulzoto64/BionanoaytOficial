import { supabaseAPI } from "./supabase";

/**
 * Motor de precarga en segundo plano.
 * Descarga y guarda en caché persistente los datos de las páginas principales
 * una vez que el usuario ya está interactuando con la web.
 */
export const BackgroundPreload = {
  _started: false,

  start: () => {
    if (BackgroundPreload._started) return;
    BackgroundPreload._started = true;

    // Esperar unos segundos para no interferir con la carga inicial crítica
    setTimeout(() => {
      BackgroundPreload._performPreload();
    }, 3000);
  },

  _performPreload: async () => {
    console.log("[CACHE] Iniciando precarga de datos en segundo plano...");
    
    try {
      // 1. Cargar traducciones generales (necesarias para el menú y traducciones estáticas)
      await supabaseAPI.getTranslations();
      
      // 2. Cargar configuraciones del sitio
      await supabaseAPI.getSiteSettings();

      // 3. Cargar datos de páginas comunes (para que la navegación sea instantánea)
      const commonPages = ["page-store", "page-technology", "page-process", "page-ecosystem"];
      
      for (const pageId of commonPages) {
        // Precargar en ambos idiomas si es posible, o al menos en el actual
        await supabaseAPI.getPageContent(pageId, "es");
        await supabaseAPI.getPageContent(pageId, "en");
      }

      // 4. Cargar lista de productos y categorías
      await supabaseAPI.getProducts();
      await supabaseAPI.getCategories();

      console.log("[CACHE] Precarga completada exitosamente.");
    } catch (error) {
      console.warn("[CACHE] Error durante la precarga:", error);
    }
  }
};
