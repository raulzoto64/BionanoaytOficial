import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Toaster } from "./ui/sonner";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Footer } from "./Footer";

// Default contact information in case page content doesn't provide it
const defaultContactInfo = {
  phone: "+1 (123) 456-7890",
  email: "info@bionanoaxus.com",
  location: "123 Biotech Avenue, Science City, ST 12345"
};

export function Layout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Navigation />
        <Outlet />
        <Footer contactInfo={defaultContactInfo} />
        <Toaster />
      </div>
    </LanguageProvider>
  );
}
