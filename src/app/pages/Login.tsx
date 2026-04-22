import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

// ✅ BASE URL CORRECTA (usa index.php router)
const API_URL = "https://api.bionano-ayt.com/api";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

      try {
        if (isLogin) {
          if (!formData.email || !formData.password) {
            toast.error("Por favor complete todos los campos");
            setIsLoading(false);
            return;
          }

          console.log('📤 Enviando solicitud de login:', {
            email: formData.email
          });

          console.log('📡 URL del API:', `${API_URL}/auth?action=login`);

          const response = await fetch(`${API_URL}/auth?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          });

          console.log('📥 Respuesta del servidor recibida');
          console.log('⏱️ Estado HTTP:', response.status, response.statusText);

          const rawText = await response.text();
          console.log('📝 RESPUESTA CRUDA DEL SERVIDOR:', rawText);

          // ✅ evitar crash si viene vacío
          if (!rawText) {
            throw new Error('El servidor no devolvió respuesta');
          }

          let result;
          try {
            result = JSON.parse(rawText);
          } catch (e) {
            console.error('❌ ERROR AL PARSEAR JSON:', e);
            console.error('❌ CONTENIDO RECIBIDO:', rawText);
            throw new Error('Respuesta invalida del servidor: ' + rawText);
          }

          console.log('📦 Respuesta JSON:', result);

          // ✅ validar HTTP status
          if (!response.ok) {
            throw new Error(result.message || 'Error del servidor');
          }

          if (result.status === 'success') {
            toast.success(`¡Bienvenido ${result.user.name}!`);
            console.log('✅ Login exitoso:', result);

            // ✅ Guardar en contexto de autenticacion
            await login(result.user, result.token);

            setTimeout(() => {
              if (result.user.role === 'admin' || result.user.role === 'editor' || result.user.role === 'manager' || result.user.role === 'viewer') {
                navigate('/admin');
              } else {
                navigate('/');
              }
            }, 1500);
          } else {
            throw new Error(result.message);
          }

        } else {

        if (!formData.email || !formData.password || !formData.name) {
          toast.error("Por favor complete todos los campos");
          setIsLoading(false);
          return;
        }

        console.log('📤 Enviando solicitud de registro:', {
          email: formData.email,
          name: formData.name
        });

        console.log('📡 URL del API:', `${API_URL}/auth?action=register`);

        const response = await fetch(`${API_URL}/auth?action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            nombre: formData.name,
            password: formData.password
          })
        });

        console.log('📥 Respuesta del servidor recibida');
        console.log('⏱️ Estado HTTP:', response.status, response.statusText);

        const rawText = await response.text();
        console.log('📝 RESPUESTA CRUDA DEL SERVIDOR:', rawText);

        // ✅ evitar crash si viene vacío
        if (!rawText) {
          throw new Error('El servidor no devolvió respuesta');
        }

        let result;
        try {
          result = JSON.parse(rawText);
        } catch (e) {
          console.error('❌ ERROR AL PARSEAR JSON:', e);
          console.error('❌ CONTENIDO RECIBIDO:', rawText);
          throw new Error('Respuesta invalida del servidor: ' + rawText);
        }

        console.log('📦 Respuesta JSON:', result);

        // ✅ validar HTTP status
        if (!response.ok) {
          throw new Error(result.message || 'Error del servidor');
        }

        if (result.status === 'success') {
          toast.success("¡Cuenta creada exitosamente!");
          console.log('✅ Registro exitoso:', result);

          setTimeout(() => {
            window.location.href = result.redirect;
          }, 1000);
        } else {
          throw new Error(result.message);
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error inesperado al intentar procesar tu solicitud.";

      console.error('🚨 Error capturado:', errorMessage);

      setErrorDialog({
        open: true,
        title: isLogin ? "Error al Iniciar Sesión" : "Error al Crear Cuenta",
        message: errorMessage
      });

      toast.error(errorMessage);

    } finally {
      console.log('🏁 Finalizando envío');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/images/logo png (2).png"
              alt="Bionano A&T"
              className="h-24 md:h-28 w-auto object-contain"
            />
          </div>
          <p className="text-[#F7F9CE] font-medium">
            {isLogin ? "Accede a tu cuenta" : "Crea tu cuenta"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg ${isLogin ? "bg-[#1C5D15] text-white" : "bg-gray-100"}`}
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg ${!isLogin ? "bg-[#1C5D15] text-white" : "bg-gray-100"}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <Input
                placeholder="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            )}

            <Input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button disabled={isLoading} className="w-full">
              {isLoading ? "Cargando..." : (isLogin ? "Login" : "Registro")}
            </Button>

          </form>

        </div>
      </div>

      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{errorDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}