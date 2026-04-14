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
    console.log("[CACHE] Iniciando precarga de traducciones críticas en segundo plano...");
    
    try {
      // SOLO cargar traducciones generales y settings en background para proteger el rendimiento general
      await supabaseAPI.getTranslations();
      await supabaseAPI.getSiteSettings();
      // SE SUPRIMIÓ la precarga agresiva de todas las páginas de la base de datos a petición del usuario
      // para evitar bloqueos masivos y saturación.

      console.log("[CACHE] Precarga crítica completada.");
    } catch (error) {
      console.warn("[CACHE] Error durante la precarga:", error);
    }
  }
};
