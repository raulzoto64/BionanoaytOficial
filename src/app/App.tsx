import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}