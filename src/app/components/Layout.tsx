import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Toaster } from "./ui/sonner";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { BackgroundPreload } from "../data/BackgroundPreload";
import { ExitIntentPopup } from "./popups/ExitIntentPopup";
import { useExitIntent } from "./popups/hooks/useExitIntent";
import { supabase, supabaseAPI } from "../data/supabase";
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
  const { trackEvent } = useAnalytics(); // 🚀 Silently tracks page_views and session durations
  
  useEffect(() => {
    BackgroundPreload.start(language);
  }, [language]);

  const handleSubmitPopup = async (data: any) => {
    console.log('📩 Popup formulario enviado:', data);

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

    const { error } = await supabase
      .from('leads')
      .insert({
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

    if (error) {
      console.error('❌ Error guardando lead del popup:', error);
    } else {
      console.log('✅ Lead CRM guardado correctamente');
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
    <LanguageProvider>
      <ScrollToTop />
      <LayoutInner />
    </LanguageProvider>
  );
}
