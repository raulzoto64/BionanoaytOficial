import { useEffect, useState } from 'react';

export function useExitIntent() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Solo se muestra 1 vez por sesion
    if (sessionStorage.getItem('exit_intent_shown')) {
      console.log('🔒 [EXIT INTENT] Popup ya mostrado en esta sesión, saltando');
      return;
    }

    console.log('🔄 [EXIT INTENT] Listener instalado correctamente');

    // ✅ TEMPORIZADOR: 10 SEGUNDOS AUTOMÁTICO
    const timerId = setTimeout(() => {
      if (!hasShown) {
        console.log('⏱️ [EXIT INTENT] Tiempo cumplido (10s) - Mostrando popup automaticamente');
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    }, 10 * 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShown) {
        console.log('👋 [EXIT INTENT] Intento de SALIDA detectado! Mostrando popup', e.clientY);
        clearTimeout(timerId);
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      console.log('🔚 [EXIT INTENT] Listeners eliminados');
    };
  }, [hasShown]);

  console.log('🎯 [EXIT INTENT] Estado actual showPopup:', showPopup);

  return {
    showPopup,
    setShowPopup
  };
}
