import { useEffect, useState } from 'react';

export function useExitIntent() {
  const [showPopupId, setShowPopupId] = useState<string | null>(null);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // 1. LISTENER PARA APERTURA MANUAL DESDE BOTONES (Siempre activo)
    const handleManualOpen = (e: any) => {
      const id = e.detail?.popupId || 'exit-intent';
      console.log('🔘 [POPUP] Apertura manual solicitada:', id);
      setShowPopupId(id);
      // Opcional: Podrías querer permitir aperturas infinitas si es manual
    };
    window.addEventListener('popup:open', handleManualOpen);

    // 2. TRÍGERS AUTOMÁTICOS (Solo si no se ha mostrado)
    if (sessionStorage.getItem('exit_intent_shown')) {
      console.log('🔒 [EXIT INTENT] Triggers automáticos desactivados (ya mostrado)');
      return () => {
        window.removeEventListener('popup:open', handleManualOpen);
      };
    }

    console.log('🔄 [EXIT INTENT] Triggers automáticos instalados');
    
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
      window.removeEventListener('popup:open', handleManualOpen);
      console.log('🔚 [POPUP] Listeners eliminados');
    };
  }, [hasShown]);

  console.log('🎯 [POPUP] Estado actual:', showPopupId);

  return {
    showPopupId,
    setShowPopupId
  };
}
