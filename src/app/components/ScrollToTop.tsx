import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isHome = pathname === '/' || pathname === '';
    
    // ✅ Leer ancla de todas las fuentes posibles
    const sessionAnchor = sessionStorage.getItem('bx_return_section');
    const hashAnchor = window.location.hash.replace('#', '');
    const hasAnyAnchor = sessionAnchor || hashAnchor;

    console.debug(`[SCROLL] global.ScrollToTop -> Path: ${pathname}, Nav: ${navigationType}, Ancla: ${hasAnyAnchor || 'N/A'}`);

    // 🔥 REGLA DE ORO: Si es Home y hay ancla, NO SUBIR. Home se encarga de bajar.
    if (isHome && hasAnyAnchor) {
      console.log(`[SCROLL] global.ScrollToTop SKIPPED (Motivo: Home con ancla: #${hasAnyAnchor})`);
      return;
    }

    // ✅ SUBIR EN TODOS LOS DEMÁS CASOS (Navegación limpia, cambio de página, etc.)
    requestAnimationFrame(() => {
      console.info(`[SCROLL] global.ScrollToTop EXECUTING (A TOPE 0,0). Path: ${pathname}`);
      window.scrollTo(0, 0);
      
      // Refuerzo para asegurar el tope tras el renderizado de la nueva página
      setTimeout(() => {
        if (window.pageYOffset < 10 && !hasAnyAnchor) {
          window.scrollTo(0, 0);
        }
      }, 50);
    });
  }, [pathname, navigationType]);

  return null;
}
