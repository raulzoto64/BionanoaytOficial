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
    
    let canShowPopup = false;
    console.log('⏳ [EXIT INTENT] BLOQUEADO los primeros 10 segundos, no saldrá NADA');

    // ✅ MÍNIMO 10 SEGUNDOS DE BLOQUEO ABSOLUTO
    const unlockTimer = setTimeout(() => {
      canShowPopup = true;
      console.log('✅ [EXIT INTENT] Ya pasaron 10s - Ahora SI puede aparecer');
    }, 10 * 1000);

    // ✅ TEMPORIZADOR: 30 SEGUNDOS AUTOMÁTICO
    const autoShowTimer = setTimeout(() => {
      if (!hasShown) {
        console.log('⏱️ [EXIT INTENT] Tiempo cumplido (30s) - Mostrando popup automaticamente');
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    }, 30 * 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShown && canShowPopup) {
        console.log('👋 [EXIT INTENT] Intento de SALIDA detectado! Mostrando popup', e.clientY);
        clearTimeout(autoShowTimer);
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }

      if (e.clientY < 10 && !canShowPopup) {
        console.log('❌ [EXIT INTENT] Intento de salida detectado PERO TODAVÍA NO PASARON 10s - BLOQUEADO');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(unlockTimer);
      clearTimeout(autoShowTimer);
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
