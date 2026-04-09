import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { supabaseAPI } from "../data/supabase";
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

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
        // Login con BD simulada
        if (!formData.email || !formData.password) {
          toast.error("Por favor complete todos los campos");
          setIsLoading(false);
          return;
        }

        const user = await supabaseAPI.loginUser(formData.email, formData.password);

        // Guardar sesión usando el hook (Ahora esperamos que termine la migración del carrito)
        await login(user);

        toast.success(`¡Bienvenido ${user.name}!`);

        // Redirigir según el rol
        setTimeout(() => {
          if (user.role === 'admin' || user.role === 'editor' || user.role === 'manager' || user.role === 'viewer') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        // Registro con BD simulada
        if (!formData.email || !formData.password || !formData.name) {
          toast.error("Por favor complete todos los campos");
          setIsLoading(false);
          return;
        }

        await supabaseAPI.registerUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: 'customer',
        });

        toast.success("¡Cuenta creada exitosamente!");

        setTimeout(() => {
          setIsLogin(true);
          setFormData({ email: formData.email, password: "", name: "" });
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error inesperado al intentar procesar tu solicitud.";

      // Mostrar modal de error detallado
      setErrorDialog({
        open: true,
        title: isLogin ? "Error al Iniciar Sesión" : "Error al Crear Cuenta",
        message: errorMessage
      });

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
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

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-colors ${isLogin
                  ? "bg-[#1C5D15] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${!isLogin
                  ? "bg-[#1C5D15] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-[#1C5D15]">Nombre completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#629960] w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-[#1C5D15]">Correo electrónico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#629960] w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#1C5D15]">Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#629960] w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#629960]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#629960]">
                  <input type="checkbox" className="rounded" />
                  Recordarme
                </label>
                <button type="button" className="text-[#1C5D15] hover:text-[#19FF00]">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#629960]">
            {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#1C5D15] font-semibold hover:text-[#19FF00]"
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </div>
        </div>

      </div>

      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <AlertDialogContent className="bg-white border-2 border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700 font-bold flex items-center gap-2">
              <span className="p-1 bg-red-100 rounded-full">⚠️</span>
              {errorDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-base py-4">
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#1C5D15] hover:bg-[#629960] text-white">
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
