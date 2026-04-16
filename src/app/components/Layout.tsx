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

// Default contact information in case page content doesn't provide it
const defaultContactInfo = {
  phone: "+57 (300) 123-4567",
  email: "contacto@bionanoayt.com",
  location: "Bogotá, Colombia"
};

function LayoutInner() {
  const { language } = useLanguage();
  const { showPopup, setShowPopup } = useExitIntent();
  
  useEffect(() => {
    BackgroundPreload.start(language);
  }, [language]);

  const handleSubmitPopup = async (data: any) => {
    console.log('📩 Popup formulario enviado:', data);
    const { error } = await supabase
      .from('leads')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_anonymous: true,
        page_url: window.location.href,
        referrer: document.referrer,
        visitor_id: localStorage.getItem('guest_id')
      });
    
    if (error) {
      console.error('❌ Error guardando lead:', error);
    } else {
      console.log('✅ Lead guardado correctamente en BD');
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
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)}
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
