import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll inmediato
    window.scrollTo(0, 0);
    
    // Forzado con pequeño delay para contrarrestar autofocus de otros componentes
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
