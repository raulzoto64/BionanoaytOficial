import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";

// Carga perezosa de páginas (Code Splitting)
const Home = () => import("./pages/Home").then(m => ({ Component: m.Home }));
const Store = () => import("./pages/Store").then(m => ({ Component: m.Store }));
const Login = () => import("./pages/Login").then(m => ({ Component: m.Login }));
const Technology = () => import("./pages/Technology").then(m => ({ Component: m.Technology }));
const Process = () => import("./pages/Process").then(m => ({ Component: m.Process }));
const Cart = () => import("./pages/Cart").then(m => ({ Component: m.Cart }));
const NotFound = () => import("./pages/NotFound").then(m => ({ Component: m.NotFound }));
const ProductDetail = () => import("./pages/ProductDetail").then(m => ({ Component: m.ProductDetail }));
const Blog = () => import("./pages/Blog").then(m => ({ Component: m.Blog }));
const BlogPost = () => import("./pages/BlogPost").then(m => ({ Component: m.BlogPost }));
const AdminLayout = () => import("./pages/AdminLayout").then(m => ({ Component: m.AdminLayout }));
const AdminDashboard = () => import("./pages/admin/AdminDashboard").then(m => ({ Component: m.AdminDashboard }));
const AdminProducts = () => import("./pages/admin/AdminProducts").then(m => ({ Component: m.AdminProducts }));
const AdminPrices = () => import("./pages/admin/AdminPrices").then(m => ({ Component: m.AdminPrices }));
const AdminContent = () => import("./pages/admin/content-management").then(m => ({ Component: m.AdminContent }));
const AdminSections = () => import("./pages/admin/sections").then(m => ({ Component: m.AdminSections }));
const AdminVisualEditor = () => import("./pages/admin/visual-editor-pro").then(m => ({ Component: m.AdminVisualEditor }));
const AdminCategories = () => import("./pages/admin/AdminCategories").then(m => ({ Component: m.AdminCategories }));
const AdminTranslations = () => import("./pages/admin/AdminTranslations").then(m => ({ Component: m.AdminTranslations }));
const AdminSettings = () => import("./pages/admin/AdminSettings").then(m => ({ Component: m.AdminSettings }));
const AdminBlogPosts = () => import("./pages/admin/AdminBlogPosts").then(m => ({ Component: m.AdminBlogPosts }));
const AdminBlogCategories = () => import("./pages/admin/AdminBlogCategories").then(m => ({ Component: m.AdminBlogCategories }));
const AdminUsers = () => import("./pages/admin/AdminUsers").then(m => ({ Component: m.AdminUsers }));
const AdminEcosystem = () => import("./pages/admin/AdminEcosystem").then(m => ({ Component: m.AdminEcosystem }));
const AdminLegalPages = () => import("./pages/admin/AdminLegalPages").then(m => ({ Component: m.AdminLegalPages }));
const AdminFooterSettings = () => import("./pages/admin/AdminFooterSettings").then(m => ({ Component: m.AdminFooterSettings }));
const AdminLeads = () => import("./pages/admin/leads").then(m => ({ Component: m.default }));
const AdminForms = () => import("./pages/admin/AdminForms").then(m => ({ Component: m.AdminForms }));
const AdminChats = () => import("./pages/admin/AdminChats").then(m => ({ Component: m.default }));
const EcosystemMemberDetail = () => import("./pages/EcosystemMemberDetail").then(m => ({ Component: m.EcosystemMemberDetail }));
const EcosystemPage = () => import("./pages/Ecosystem").then(m => ({ Component: m.EcosystemPage }));
const LegalPage = () => import("./pages/LegalPage").then(m => ({ Component: m.LegalPage }));

const AdminFormEditor = () => import("./pages/admin/AdminFormEditor").then(m => ({ Component: m.AdminFormEditor }));
const AdminActiveCarts = () => import("./pages/admin/sales/ActiveCarts").then(m => ({ Component: m.ActiveCarts }));
const AdminCheckoutLeads = () => import("./pages/admin/sales/CheckoutLeads").then(m => ({ Component: m.CheckoutLeads }));
const AdminAnalytics = () => import("./pages/admin/sales/AnalyticsDashboard").then(m => ({ Component: m.AnalyticsDashboard }));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    HydrateFallback: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F7F9CE]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C5D15]"></div>
      </div>
    ),
    children: [
      {
        index: true,
        lazy: Home,
      },
      {
        path: "store",
        lazy: Store,
      },
      {
        path: "products/:slug",
        lazy: ProductDetail,
      },
      {
        path: "technology",
        lazy: Technology,
      },
      {
        path: "process",
        lazy: Process,
      },
      {
        path: "blog",
        lazy: Blog,
      },
      {
        path: "blog/:slug",
        lazy: BlogPost,
      },
      {
        path: "cart",
        lazy: Cart,
      },
      {
        path: "ecosystem",
        lazy: EcosystemPage,
      },
      {
        path: "ecosystem/:slug",
        lazy: EcosystemMemberDetail,
      },
      {
        path: "legal/:slug",
        lazy: LegalPage,
      },
      {
        path: "*",
        lazy: NotFound,
      },
    ],
  },
  {
    path: "login",
    lazy: Login,
  },
  {
    path: "admin/visual-editor/:id",
    lazy: AdminVisualEditor,
  },
  {
    path: "admin/visual-editor/:type/:id",
    lazy: AdminVisualEditor,
  },
  {
    path: "admin/forms/edit/:id",
    lazy: AdminFormEditor,
  },
  {
    path: "admin",
    lazy: AdminLayout,
    HydrateFallback: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C5D15]"></div>
      </div>
    ),
    children: [
      {
        index: true,
        lazy: AdminDashboard,
      },
      {
        path: "products",
        lazy: AdminProducts,
      },
      {
        path: "prices",
        lazy: AdminPrices,
      },
      {
        path: "content",
        lazy: AdminContent,
      },
      {
        path: "sections",
        lazy: AdminSections,
      },
      {
        path: "categories",
        lazy: AdminCategories,
      },
      {
        path: "translations",
        lazy: AdminTranslations,
      },
      {
        path: "settings",
        lazy: AdminSettings,
      },
      {
        path: "blog/posts",
        lazy: AdminBlogPosts,
      },
      {
        path: "blog/categories",
        lazy: AdminBlogCategories,
      },
      {
        path: "users",
        lazy: AdminUsers,
      },
      {
        path: "legal",
        lazy: AdminLegalPages,
      },
      {
        path: "footer",
        lazy: AdminFooterSettings,
      },
      {
        path: "leads",
        lazy: AdminLeads,
      },
      {
        path: "forms",
        lazy: AdminForms,
      },
      {
        path: "chats",
        lazy: AdminChats,
      },
      {
        path: "sales/active-carts",
        lazy: AdminActiveCarts,
      },
      {
        path: "sales/checkout-leads",
        lazy: AdminCheckoutLeads,
      },
      {
        path: "sales/analytics",
        lazy: AdminAnalytics,
      },
    ],
  },
]);
