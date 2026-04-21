import { useEffect, useState } from 'react';

export function useMenuNavigation(pageContent: any, navigationType: string) {
  const [activeHash, setActiveHash] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    
    // Ignorar por completo si es un viaje al pasado (Botón Atrás) para evitar choques con useScrollRestore
    if (navigationType === 'POP') return null;
    
    const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries.length > 0 && navEntries[0].type === 'reload') return null;
    return window.location.hash.replace('#', '') || null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveHash(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!activeHash || !pageContent) return;

    let attempts = 0;
    const interval = setInterval(() => {
      const cleanType = activeHash.replace(/^home-/, '').replace(/^store-/, '');
      const element = 
        document.getElementById(activeHash) || 
        document.querySelector(`[data-section-type="${cleanType}"]`) ||
        document.querySelector(`[data-section-id="${activeHash}"]`);
      
      if (element) {
        clearInterval(interval);
        const rect = element.getBoundingClientRect();
        const top = Math.max(0, rect.top + window.pageYOffset - 80); // 80px del header
        window.scrollTo({ top, behavior: 'smooth' });
        
        // Limpiamos rastro histórico
        window.history.replaceState(null, '', window.location.pathname);
        setTimeout(() => setActiveHash(null), 500);
      } else if (attempts > 40) { // 2 segundos máximo si el hash no existe
        clearInterval(interval);
        setActiveHash(null);
      }
      attempts++;
    }, 50);

    return () => clearInterval(interval);
  }, [activeHash, pageContent]);

  return activeHash;
}
