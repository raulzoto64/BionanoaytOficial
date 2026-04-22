import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Toaster } from "./ui/sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { BackgroundPreload } from "../data/BackgroundPreload";
import { ExitIntentPopup } from "./popups/ExitIntentPopup";
import { useExitIntent } from "./popups/hooks/useExitIntent";
import { ChatBubble } from "./popups/ChatBubble";
import { supabaseAPI } from "../data/supabase";
import { useAnalytics } from "../hooks/useAnalytics";

// Default contact information in case page content doesn't provide it
const defaultContactInfo = {
  phone: "+57 (300) 123-4567",
  email: "contacto@bionanoayt.com",
  location: "Bogotá, Colombia"
};

function LayoutInner() {
  const { language } = useLanguage();
  const { showPopupId, setShowPopupId } = useExitIntent();
  useAnalytics(); // 🚀 Silently tracks page_views and session durations


  
  useEffect(() => {
    // Limpieza de rastro antiguo de Supabase (Solo una vez)
    const hasCleaned = localStorage.getItem('bionano_auth_cleaned');
    if (!hasCleaned && localStorage.getItem('supabase.auth.token')) {
      supabaseAPI.clearCache();
      localStorage.removeItem('supabase.auth.token');
      localStorage.setItem('bionano_auth_cleaned', 'true');

      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    BackgroundPreload.start(language);
  }, [language]);

  // ✅ INTERCEPTADOR GLOBAL: Cualquier enlace a /chat abre el chat directamente SIN NAVEGAR
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Buscar el elemento <a> mas cercano al click
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link) {
        const href = link.getAttribute('href');
        
        // ✅ Detectar CUALQUIER variante de chat, absoluta o relativa
        if (href && (
          href === '/chat' || 
          href === '#chat' || 
          href.includes('/chat') || 
          href === 'chat' ||
          href === 'https://chat/' ||
          link.dataset.chat !== undefined
        )) {
          console.log('✅ CHAT DETECTADO - Cancelando navegación y abriendo chat directamente', href);
          
          e.preventDefault();
          e.stopImmediatePropagation();
          
          // Abrir el chat globalmente
          window.dispatchEvent(new Event('chat:open'));
          
          return false;
        }
      }
    };

    // Agregar listener al documento con capture true para atrapar ANTES que cualquier otro evento
    document.addEventListener('click', handleGlobalClick, { capture: true, passive: false });

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
    
    console.log('✅ Interceptador de chat instalado globalmente');
  }, []);

  const handleSubmitPopup = async (data: any) => {


    // ─── Todas las columnas reales de la tabla `leads` ───────────────────────
    const KNOWN_LEAD_COLUMNS = [
      'name', 'last_name', 'email', 'phone', 'message',
      'city', 'country', 'district',
      'lead_type', 'status', 'notes', 'assigned_to',
      'user_id', 'visitor_id',
    ];

    // Separar campos conocidos de campos custom del formulario
    const knownFields: Record<string, any> = {};
    const extraFields: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (KNOWN_LEAD_COLUMNS.includes(key)) {
        knownFields[key] = val;
      } else {
        extraFields[key] = val;
      }
    }

    // ─── Enriquecimiento automático con datos del navegador ──────────────────
    const guestId = localStorage.getItem('guest_id');
    const enrichedMetadata = {
      ...extraFields,
      form_source: 'popup',
      // Contexto de sesión adicional útil para el CRM
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      language_browser: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
      await supabaseAPI.createLead({
        // Campos de identidad
        ...knownFields,
        // Enriquecimiento automático
        is_anonymous: !knownFields.user_id,
        lead_type: knownFields.lead_type || 'Popup',
        status: knownFields.status || 'new',
        visitor_id: knownFields.visitor_id || guestId,
        // Trazabilidad web
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        // Campos custom del formulario + telemetría básica en JSONB
        metadata: enrichedMetadata,
        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    } catch (err) {

    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden max-w-[100vw] text-pretty">
      <Navigation />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer contactInfo={defaultContactInfo} />
      <Toaster />
      {!window.location.pathname.startsWith('/admin') && <ChatBubble />}

      {/* ✅ Exit Intent Popup GLOBAL - Ahora SI sale en TODAS las páginas */}
      <ExitIntentPopup 
        popupId={showPopupId} 
        onClose={() => setShowPopupId(null)}
        onSubmit={handleSubmitPopup}
      />
    </div>
  );
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <LayoutInner />
    </>
  );
}
