import { useEffect, useState } from 'react';

export function useExitIntent() {
  const [showPopupId, setShowPopupId] = useState<string | null>(null);
  const [hasShown, setHasShown] = useState(false);

  // 1. LISTENER PARA APERTURA MANUAL DESDE BOTONES (Siempre activo)
  useEffect(() => {
    const handleManualOpen = (e: any) => {
      const id = e.detail?.popupId || 'exit-intent';

      setShowPopupId(id);
    };
    window.addEventListener('popup:open', handleManualOpen);
    return () => window.removeEventListener('popup:open', handleManualOpen);
  }, []);

  // 2. TRÍGERS AUTOMÁTICOS (Mouseleave / Timers)
  useEffect(() => {
    if (sessionStorage.getItem('exit_intent_shown')) {
      // console.log('🔒 [EXIT INTENT] Triggers automáticos desactivados (ya mostrado)');
      return;
    }


    
    let canShowPopup = false;
    const unlockTimer = setTimeout(() => {
      canShowPopup = true;
    }, 10 * 1000);

    const autoShowTimer = setTimeout(() => {
      if (!hasShown) {
        setShowPopupId('exit-intent');
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    }, 30 * 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShown && canShowPopup) {
        setShowPopupId('exit-intent');
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
        clearTimeout(autoShowTimer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(unlockTimer);
      clearTimeout(autoShowTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      // console.log('🔚 [EXIT INTENT] Triggers automáticos eliminados');
    };
  }, [hasShown]);

  // console.log('🎯 [POPUP] Estado actual:', showPopupId);

  return {
    showPopupId,
    setShowPopupId
  };
}
