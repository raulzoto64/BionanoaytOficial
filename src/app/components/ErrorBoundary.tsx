import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router";
import { AlertTriangle, RefreshCcw, Home, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Log error logic (can be extended to Sentry/LogRocket)
  useEffect(() => {
    console.error("ErrorBoundary caught an error:", error);
  }, [error]);

  const getErrorMessage = () => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) return "La página que buscas no existe.";
      if (error.status === 401) return "No tienes permiso para ver este contenido.";
      return error.statusText || "Error de navegación.";
    }

    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch dynamically imported module")) {
        return "Hubo un problema cargando los recursos del sistema. Esto suele solucionarse con una recarga rápida.";
      }
      return error.message;
    }

    return "Ha ocurrido un error inesperado en la plataforma.";
  };

  const handleReload = () => {
    // Hard reload to clear potential chunk loading issues
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F7F9CE] flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1C5D15] via-[#19FF00] to-[#1C5D15]" />
        
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#1C5D15]/10 relative">
          <div className="p-8 md:p-12 text-center">
            {/* Icon Circle */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#1C5D15]/5 mb-8 animate-pulse">
              <AlertTriangle className="w-12 h-12 text-[#1C5D15]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#1C5D15] mb-4 tracking-tight">
              ¡Ups! Algo no salió como esperábamos
            </h1>
            
            <p className="text-lg text-[#1C5D15]/70 mb-10 leading-relaxed max-w-md mx-auto">
              {getErrorMessage()}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleReload}
                className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white px-8 py-6 h-auto text-lg rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group shadow-lg shadow-[#1C5D15]/20"
              >
                <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Recargar Sistema
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-[#1C5D15]/20 text-[#1C5D15] hover:bg-[#1C5D15]/5 px-8 py-6 h-auto text-lg rounded-xl transition-all flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Ir al Inicio
              </Button>
            </div>
          </div>

          {/* Footer Details (Subtle) */}
          <div className="bg-[#1C5D15]/5 p-4 border-t border-[#1C5D15]/10 flex justify-between items-center px-8">
            <span className="text-xs font-mono text-[#1C5D15]/40 tracking-widest uppercase">
              Bionano Diagnostics Core
            </span>
            <div className="flex items-center gap-1 text-[#1C5D15]/60 hover:text-[#1C5D15] cursor-pointer transition-colors group">
              <span className="text-xs font-medium">Ver detalles técnicos</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Support Message */}
        <p className="text-center mt-8 text-[#1C5D15]/50 text-sm">
          Si el problema persiste, contacta a nuestro equipo de soporte técnico.
        </p>
      </div>
    </div>
  );
}
