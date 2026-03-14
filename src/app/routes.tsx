import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Store } from "./pages/Store";
import { Login } from "./pages/Login";
import { Technology } from "./pages/Technology";
import { Process } from "./pages/Process";
import { Cart } from "./pages/Cart";
import { NotFound } from "./pages/NotFound";
import { ProductDetail } from "./pages/ProductDetail";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { AdminLayout } from "./pages/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminPrices } from "./pages/admin/AdminPrices";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminTranslations } from "./pages/admin/AdminTranslations";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminBlogPosts } from "./pages/admin/AdminBlogPosts";
import { AdminBlogCategories } from "./pages/admin/AdminBlogCategories";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminEcosystem } from "./pages/admin/AdminEcosystem";
import { AdminLegalPages } from "./pages/admin/AdminLegalPages";
import { AdminFooterSettings } from "./pages/admin/AdminFooterSettings";
import { EcosystemMemberDetail } from "./pages/EcosystemMemberDetail";
import { EcosystemPage } from "./pages/Ecosystem";
import { LegalPage } from "./pages/LegalPage";
import { LanguageProvider } from "./contexts/LanguageContext";

// Wrapper component for Login to include LanguageProvider
function LoginWrapper() {
  return (
    <LanguageProvider>
      <Login />
    </LanguageProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "products/:slug",
        element: <ProductDetail />,
      },
      {
        path: "technology",
        element: <Technology />,
      },
      {
        path: "process",
        element: <Process />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:slug",
        element: <BlogPost />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "ecosystem",
        element: <EcosystemPage />,
      },
      {
        path: "ecosystem/:slug",
        element: <EcosystemMemberDetail />,
      },
      {
        path: "legal/:slug",
        element: <LegalPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginWrapper />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "prices",
        element: <AdminPrices />,
      },
      {
        path: "content",
        element: <AdminContent />,
      },
      {
        path: "categories",
        element: <AdminCategories />,
      },
      {
        path: "translations",
        element: <AdminTranslations />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
      {
        path: "blog/posts",
        element: <AdminBlogPosts />,
      },
      {
        path: "blog/categories",
        element: <AdminBlogCategories />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "ecosystem",
        element: <AdminEcosystem />,
      },
      {
        path: "legal",
        element: <AdminLegalPages />,
      },
      {
        path: "footer",
        element: <AdminFooterSettings />,
      },
    ],
  },
]);
