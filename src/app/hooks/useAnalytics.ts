import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { supabaseAPI } from '../data/supabase';
import { useAuth } from './useAuth';

export function useAnalytics() {
  const location = useLocation();
  const { user } = useAuth();
  const startTimeRef = useRef<number>(Date.now());
  const currentUrlRef = useRef<string>(window.location.href);
  const isEnabled = true;

  // Track Page Views
  useEffect(() => {
    if (!isEnabled) return;
    
    // Al cambiar la página: enviamos el tiempo de estancia de la página anterior
    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    
    if (timeSpentSeconds > 2) {
      trackEvent('time_on_page', { session_duration_seconds: timeSpentSeconds }, currentUrlRef.current);
    }

    // Actualizamos referencias para la nueva página
    startTimeRef.current = Date.now();
    currentUrlRef.current = window.location.href;

    // Registramos la nueva visita
    trackEvent('page_view', {}, currentUrlRef.current);

  }, [location.pathname]);

  // Trackear tiempo cuando el usuario cierra la pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpentSeconds > 2) {
        trackEvent('time_on_page', { session_duration_seconds: timeSpentSeconds }, currentUrlRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const trackEvent = async (
    eventType: 'page_view' | 'add_to_cart' | 'time_on_page' | 'checkout_step', 
    extraData: any = {},
    urlOverride?: string
  ) => {
    try {
      if (window.location.pathname.startsWith('/admin')) {
         return; // We do not track admin actions in the funnel telemetry
      }

      let guestId = localStorage.getItem('guest_id');
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('guest_id', guestId);
      }

      console.log(`📊 [Analytics] Tracking ${eventType}:`, {
        visitor_id: guestId,
        user_id: user?.id,
        url: urlOverride || window.location.href,
        ...extraData
      });

      await supabaseAPI.trackAnalyticsEvent({
        visitor_id: guestId,
        user_id: user?.id,
        event_type: eventType,
        page_url: urlOverride || window.location.href,
        session_duration_seconds: extraData.session_duration_seconds || 0,
        metadata: {
          ...extraData,
          referrer: document.referrer || null
        }
      });
    } catch (e) {
      console.warn('Tracker silencioso ignorado', e);
    }
  };

  return { trackEvent };
}
