import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // ✅ SOLO SALTEAR SCROLL SI VOLVEMOS A LA HOME CON ANCLA GUARDADA
    // En TODOS los demas casos SIEMPRE subir hasta arriba
    const isHome = pathname === '/' || pathname === '';
    const hasReturnAnchor = sessionStorage.getItem('bx_return_section') || window.location.hash;
    
    if (navigationType === 'POP' && isHome && hasReturnAnchor) {
      console.log(`[SCROLL] ScrollToTop SKIPPED (Reason: Volviendo a Home con ancla: ${hasReturnAnchor})`);
      return;
    }

    console.log(`[SCROLL] ScrollToTop EXECUTING (TO TOP)`);

    // Scroll inmediato al tope en navegaciones nuevas (PUSH/REPLACE)
    window.scrollTo(0, 0);
    
    // Forzado con pequeño delay para contrarrestar autofocus de otros componentes
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [pathname, navigationType]);

  return null;
}
