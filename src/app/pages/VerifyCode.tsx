import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const API_URL = "https://api.bionano-ayt.com/api";

const VerifyCode: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const { login } = useAuthContext();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/registro");
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((c) => c) && value) {
      verifyCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newCode = [...code];

    paste.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });

    setCode(newCode);

    if (paste.length === 6) {
      verifyCode(paste);
    }
  };

  // 🔥 AQUÍ ESTÁ EL FIX REAL DEL LOGIN INSTANTÁNEO
  const verifyCode = async (codeValue: string) => {
    console.log("📩 Verificando código:", codeValue, "para email:", email);

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth?action=verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codeValue }),
      });

      const result = await response.json();
      console.log("✅ Respuesta verificación:", result);

      if (result.status === "success") {
        setSuccess(true);

        // 🔥 1. Guardar sesión INMEDIATA
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("auth_token", result.token);

        // 🔥 2. FORZAR UPDATE GLOBAL DEL AUTH CONTEXT (ESTO ES LO QUE TE FALTABA)
        window.dispatchEvent(
          new CustomEvent("auth-updated", {
            detail: result.user,
          })
        );

        // 🔥 3. Login global del contexto (si existe lógica adicional)
        try {
          await login(result.user.email, ""); 
        } catch (e) {
          console.log("Login context skip (no password required)");
        }

        // 🔥 4. Redirección inmediata
        setTimeout(() => {
          navigate(result.redirect || "/", { replace: true });
        }, 800);
      } else {
        setError(result.message);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Error de conexión, por favor intenta nuevamente");
    }

    setLoading(false);
  };

  const resendCode = async () => {
    if (countdown > 0) return;

    try {
      await fetch(`${API_URL}/auth?action=resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setCountdown(60);
    } catch {
      setError("Error al reenviar el código");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Cuenta verificada!
          </h2>

          <p className="text-gray-600 mb-6">
            Iniciando sesión automáticamente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-gradient-to-br from-green-700 to-green-900 p-8 text-center">
          <h1 className="text-white text-3xl font-bold mb-2">BioNano A&T</h1>
          <p className="text-white/80">Verifica tu correo electrónico</p>
        </div>

        <div className="p-8">

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Introduce el código
            </h2>

            <p className="text-gray-600">
              Hemos enviado un código de 6 dígitos a
              <span className="font-semibold text-green-700 block mt-1">
                {email}
              </span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-6">
              <div className="inline-block w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Verificando...</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="flex justify-center gap-3 mb-6">
                {code.map((char, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    autoFocus={index === 0}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-700/20 outline-none"
                  />
                ))}
              </div>

              <button
                onClick={() => verifyCode(code.join(""))}
                disabled={code.some((c) => !c)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Verificar Código
              </button>

              <div className="mt-6 text-center">
                <button
                  onClick={resendCode}
                  disabled={countdown > 0}
                  className="text-green-700 font-semibold"
                >
                  {countdown > 0
                    ? `Reenviar en ${countdown}s`
                    : "Reenviar código"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;