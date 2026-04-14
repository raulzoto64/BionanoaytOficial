import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Scroll inmediato al tope en cualquier navegación (incluyendo botón atrás)
    window.scrollTo(0, 0);
    
    // Forzado con pequeño delay para contrarrestar autofocus de otros componentes
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [pathname, navigationType]);

  return null;
}
