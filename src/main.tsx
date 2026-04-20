// Agresiva purga de sesión zombie 'user-demo-001' (incompatible con Supabase)
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser.includes('user-demo-001')) {
    console.warn('Limpieza profunda detectada: eliminando sesión zombie');
    localStorage.removeItem('user');
  }
}

import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
  
