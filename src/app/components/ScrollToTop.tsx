import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Si el usuario navegó hacia atrás/adelante, no forzar scroll al top,
    // dejar que el navegador o el motor de restauración de cada página lo haga.
    if (navigationType === 'POP') return;

    const isHome = pathname === '/' || pathname === '';
    const historyStateAnchor = window.history.state?.returnSection || null;
    const sessionAnchor = sessionStorage.getItem('bx_return_section');
    const hashAnchor = hash.replace('#', '');
    const hasAnyAnchor = historyStateAnchor || sessionAnchor || hashAnchor;

    if (isHome && hasAnyAnchor) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        if (window.pageYOffset < 10 && !hasAnyAnchor) {
          window.scrollTo(0, 0);
        }
      }, 50);
    });
  }, [pathname, hash]);

  return null;
}
