import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Toaster } from "./ui/sonner";
import { LanguageProvider } from "../contexts/LanguageContext";

export function Layout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Navigation />
        <Outlet />
        <Toaster />
      </div>
    </LanguageProvider>
  );
}