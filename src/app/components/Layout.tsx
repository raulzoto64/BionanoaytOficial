import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Toaster } from "./ui/sonner";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";
import { BackgroundPreload } from "../data/BackgroundPreload";

// Default contact information in case page content doesn't provide it
const defaultContactInfo = {
  phone: "+57 (300) 123-4567",
  email: "contacto@bionanoayt.com",
  location: "Bogotá, Colombia"
};

function LayoutInner() {
  const { language } = useLanguage();
  
  useEffect(() => {
    BackgroundPreload.start(language);
  }, [language]);

  return (
    <div className="min-h-screen overflow-x-hidden max-w-[100vw] text-pretty">
      <Navigation />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer contactInfo={defaultContactInfo} />
      <Toaster />
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
