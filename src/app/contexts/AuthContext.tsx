import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, supabaseAPI } from "../data/supabase";
import { v4 as uuidv4 } from "uuid";
import { useVisitor } from "../hooks/useVisitor";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestId: string;
  login: (emailOrUser: string | User, password?: string) => Promise<any>;
  logout: () => Promise<void>;
  getGuestId: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setVisitorId } = useVisitor();

  const getGuestId = useCallback(() => {
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  }, []);

  // 🔥 FIX PRINCIPAL: ESCUCHAR LOGIN DESDE VERIFYCODE (SIN REFRESH)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
      }
    } else {
      getGuestId();
    }

    setIsLoading(false);

    // 🔥 NUEVO: escuchar login inmediato
    const handleAuthUpdate = (e: any) => {
      if (e?.detail) {
        setUser(e.detail);
        localStorage.setItem("user", JSON.stringify(e.detail));
      }
    };

    window.addEventListener("auth-updated", handleAuthUpdate);

    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdate);
    };
  }, [getGuestId]);

  const login = async (
    emailOrUser: string | User,
    password?: string
  ) => {
    let email: string;
    let pass: string;

    if (typeof emailOrUser === "object") {
      email = emailOrUser.email;
      pass = emailOrUser.password;
    } else {
      email = emailOrUser;
      pass = password!;
    }

    if (!pass) {
      throw new Error("La contraseña es requerida para autenticar");
    }

    try {
      const userData = await supabaseAPI.loginUser(email, pass);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      const guestId = localStorage.getItem("guest_id");

      if (guestId && userData.id) {
        try {
          await supabaseAPI.mergeGuestCart(userData.id, guestId);
          localStorage.removeItem("guest_id");

          if (typeof setVisitorId === "function") {
            setVisitorId(null);
          }
        } catch {}
      }

      window.dispatchEvent(new CustomEvent("cart-updated"));

      return userData;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      getGuestId();

      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch {}
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isGuest: !user,
    guestId: getGuestId(),
    login,
    logout,
    getGuestId,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};