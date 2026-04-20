import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Si la navegación es 'POP' (botón atrás/adelante del navegador), 
    // o si detectamos que la Home va a manejar su propio scroll de retorno,
    // dejamos que la página maneje su propia restauración de scroll.
    const hasReturnAnchor = sessionStorage.getItem('bx_return_section') || window.location.hash;
    if (navigationType === 'POP' || hasReturnAnchor) {
      console.log(`[SCROLL] ScrollToTop SKIPPED (Reason: ${navigationType === 'POP' ? 'POP' : 'Anchor found: ' + hasReturnAnchor})`);
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
