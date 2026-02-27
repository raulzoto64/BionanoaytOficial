import { useNavigate } from "react-router";
import { Home } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-[#19FF00] text-9xl mb-8">404</div>
        <h1 className="text-4xl text-white mb-4">Página no encontrada</h1>
        <p className="text-xl text-[#F7F9CE] mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
          size="lg"
        >
          <Home className="w-5 h-5 mr-2" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}
