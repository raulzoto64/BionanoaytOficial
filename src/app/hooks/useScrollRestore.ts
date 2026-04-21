import { useEffect, useLayoutEffect, useState } from 'react';

export function useScrollRestore(pageContent: any, navigationType: string) {
  const [restoredAnchor, setRestoredAnchor] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    
    // Priorizamos sessionStorage y history.state
    const sessionAnchor = sessionStorage.getItem('bx_return_section');
    const historyAnchor = window.history.state?.returnSection;
    return sessionAnchor || historyAnchor || null;
  });

  // Escuchar a React Router adicionalmente (POP navigation tardío)
  useEffect(() => {
    if (navigationType === 'POP') {
      const anchorFromSession = sessionStorage.getItem('bx_return_section');
      const anchorFromHistory = window.history.state?.returnSection;
      const target = anchorFromSession || anchorFromHistory;
      if (target) setRestoredAnchor(target);
    }
  }, [navigationType]);

  // Eliminado el detector fraudulento de F5 que mataba el estado en SPAs

  // Motor Tracker de Restauración de 2.5 Segundos
  useLayoutEffect(() => {
    if (!restoredAnchor) {
      return;
    }
    
    if (!pageContent) {
      return;
    }

    let activeScrollLocker: NodeJS.Timeout | null = null;
    let attempts = 0;

    const breakLock = () => {
      if (activeScrollLocker) clearInterval(activeScrollLocker);
      setRestoredAnchor(null);
      window.removeEventListener('wheel', breakLock);
      window.removeEventListener('touchstart', breakLock);
    };

    const scrollToTarget = () => {
      const cleanType = restoredAnchor.replace(/^home-/, '').replace(/^store-/, '');
      const element = 
        document.getElementById(restoredAnchor) || 
        document.querySelector(`[data-section-type="${cleanType}"]`) ||
        document.querySelector(`[data-section-id="${restoredAnchor}"]`);

      if (element) {
        // Limpiamos los rastros para no caer en loops
        sessionStorage.removeItem('bx_return_section');
        sessionStorage.removeItem('bx_return_from');
        if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
        
        let trackTime = 0;
        const maxTrackTime = 2500; // 2.5 Segundos de escudo adaptable a Layout Shifts
        const intervalMs = 150; 
        let lastTargetTop = -1;

        window.addEventListener('wheel', breakLock, { passive: true });
        window.addEventListener('touchstart', breakLock, { passive: true });

        activeScrollLocker = setInterval(() => {
          trackTime += intervalMs;
          const freshRect = element.getBoundingClientRect();
          const freshTop = Math.max(0, freshRect.top + window.pageYOffset - 80);
          
          if (Math.abs(freshTop - lastTargetTop) > 10) {
            lastTargetTop = freshTop;
            window.scrollTo({ top: freshTop, behavior: 'instant' as ScrollBehavior });
          }
          
          if (trackTime >= maxTrackTime) {
             breakLock();
          }
        }, intervalMs);

        return true;
      }
      return false;
    };

    // Poll rápido para encontrar el elemento inicial mientras se renderiza
    const interval = setInterval(() => {
      attempts++;
      if (scrollToTarget() || attempts >= 60) {
        if (attempts >= 60) {
          sessionStorage.removeItem('bx_return_section');
          sessionStorage.removeItem('bx_return_from');
        }
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (activeScrollLocker) clearInterval(activeScrollLocker);
      window.removeEventListener('wheel', breakLock);
      window.removeEventListener('touchstart', breakLock);
    };
  }, [pageContent, restoredAnchor]);

  return restoredAnchor;
}

