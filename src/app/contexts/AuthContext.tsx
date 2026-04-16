import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, supabase, supabaseAPI } from '../data/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useVisitor } from '../hooks/useVisitor';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setVisitorId } = useVisitor(); // Asegúrate de que useVisitor también provee setVisitorId

  const getGuestId = useCallback(() => {
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  }, []);

  useEffect(() => {
    // ✅ PRIMERO: Verificar si hay usuario guardado MANUALMENTE en localStorage (FUNCIONA SIEMPRE)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        console.log('🔄 [AuthContext] Usuario recuperado de localStorage:', parsedUser.email);
        setUser(parsedUser);
        setIsLoading(false);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    // ✅ SEGUNDO: Intentar recuperar sesion Supabase Auth (opcional)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        console.log('🔄 [AuthContext] Sesión existente recuperada al iniciar:', session.user.id);
        
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          password: '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          role: (session.user.user_metadata?.role as any) || 'customer',
          created_at: session.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(mappedUser);
        localStorage.removeItem('user');
      }
      
      if (!savedUser) {
        setIsLoading(false);
        getGuestId();
      }
    });

    // ✅ Luego suscribirse a cambios futuros
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        console.log('🔄 [AuthContext] Sesión Supabase detectada:', session.user.id);
        
        // ✅ Mapear objeto User de Supabase Auth a la interfaz local User
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          // Campos requeridos por la interfaz local que no vienen en session.user
          password: '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          role: (session.user.user_metadata?.role as any) || 'customer',
          created_at: session.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(mappedUser);
        // Si hay una sesión activa de Supabase, limpia el user manual de localStorage
        localStorage.removeItem('user');

        // Sincronizar visitante con el user autenticado si es necesario
        const currentGuestId = localStorage.getItem('guest_id');
        if (currentGuestId && session.user.id) {
          console.log(`🔄 [AuthContext] Fusionando leads de visitante ${currentGuestId} a user ${session.user.id}`);
          try {
            await supabaseAPI.mergeVisitorLeadsWithUser(currentGuestId, session.user.id);
            // Opcional: limpiar guest_id después de fusionar si ya no es necesario
            localStorage.removeItem('guest_id'); 
            if (typeof setVisitorId === 'function') {
              setVisitorId(null);
            }
          } catch (error) {
            console.error("Error al sincronizar leads de visitante a usuario durante authStateChange:", error);
          }
        }

      } else {
        // ✅ PROTECCIÓN: NO BORRAMOS al usuario si hay uno guardado manualmente en localStorage
        // Solo lo borramos si el evento es explícitamente un LOGOUT
        const savedUser = localStorage.getItem('user');
        
        if (_event === 'SIGNED_OUT' || !savedUser) {
          console.log('🔄 [AuthContext] No hay sesión Supabase activa.');
          setUser(null);
          localStorage.removeItem('user');
          getGuestId();
        } else {
          console.log('🔒 [AuthContext] Manteniendo sesión manual activa:', JSON.parse(savedUser).email);
          // Mantenemos el usuario que ya esta logueado
        }
      }
      setIsLoading(false);
    });

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [getGuestId, setVisitorId]); // Añadir setVisitorId a las dependencias si se usa

  const login = async (emailOrUser: string | User, password?: string) => {
    // ✅ LOGIN HIBRIDO: PRIMERO intentamos login contra TU TABLA users, luego si existe creamos sesion manual
    let email: string;
    let pass: string;
    let userFromDb: User | null = null;

    if (typeof emailOrUser === 'object') {
      email = emailOrUser.email;
      pass = emailOrUser.password;
      userFromDb = emailOrUser;
    } else {
      email = emailOrUser;
      pass = password!;
    }

    console.log('🔵 [AuthContext] Login iniciado:', email);

    try {
      // 1. PRIMERO: Verificar usuario en TU TABLA PUBLICA users (como siempre tuviste)
      if (!userFromDb) {
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password', pass)
          .single();

        if (dbError) {
          console.error('❌ Usuario no encontrado en BD:', email);
          throw new Error('Email o contraseña incorrectos');
        }

        userFromDb = userData as User;
      }

      console.log('✅ Usuario encontrado en BD:', userFromDb.name);

      // ⚠️ OMITIDO LOGIN SUPABASE AUTH PARA EVITAR ERRORES EN CONSOLA
      // Si en el futuro necesitas usar las funciones de Auth oficiales, descomenta esto
      // try {
      //   const { data, error } = await supabase.auth.signInWithPassword({
      //     email,
      //     password: pass
      //   });
      //
      //   if (!error && data.user) {
      //     console.log('✅ Sesión Supabase Auth creada correctamente');
      //   }
      // } catch (supabaseError) {}

      // 3. ✅ ACTUALIZAMOS EL ESTADO LOCAL MANUALMENTE, ESTO FUNCIONARA SIEMPRE
      setUser(userFromDb);
      localStorage.setItem('user', JSON.stringify(userFromDb));

      // Fusionar carrito
      const guestId = localStorage.getItem("guest_id");
      if (guestId && userFromDb.id) {
        try {
          await supabaseAPI.mergeGuestCart(userFromDb.id, guestId);
          localStorage.removeItem("guest_id"); 
          if (typeof setVisitorId === 'function') {
            setVisitorId(null);
          }
        } catch (error) {
          console.error("Error al fusionar carritos durante el login:", error);
        }
      }

      window.dispatchEvent(new CustomEvent("cart-updated"));
      console.log('✅ LOGIN COMPLETADO EXITOSAMENTE');
      
      return userFromDb;

    } catch (error: any) {
      console.error('❌ Error en login:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🔵 [AuthContext] Iniciando logout...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ [AuthContext] Sesión Supabase cerrada. Limpiando estado local.');
      setUser(null);
      localStorage.removeItem("user"); // Limpiar cualquier residuo
      getGuestId(); // Generar un nuevo guestId para futuras visitas no autenticadas
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (error) {
      console.error("❌ [AuthContext] Error durante el logout:", error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isGuest: !user,
    guestId: getGuestId(),
    login,
    logout,
    getGuestId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
