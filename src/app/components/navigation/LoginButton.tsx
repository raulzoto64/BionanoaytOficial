import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { User as UserType } from "../../data/supabase";
export function LoginButton() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const isAdmin = user?.role === 'admin';
  console.log('LoginButton - user:', user);
  console.log('LoginButton - isAuthenticated:', isAuthenticated);
  console.log('LoginButton - isAdmin:', isAdmin);

const handleLoginClick = () => {
  console.log('LoginButton - handleLoginClick - isAdmin:', isAdmin);
  console.log('LoginButton - handleLoginClick - isAuthenticated:', isAuthenticated);
  if (isAdmin) {
    console.log('LoginButton - redirecting to /admin (admin user)');
    navigate("/admin");
  } else if (isAuthenticated) {
    console.log('LoginButton - redirecting to /admin (authenticated user)');
    navigate("/admin"); // For non-admin authenticated users, could redirect to a different page
  } else {
    console.log('LoginButton - redirecting to /login (unauthenticated user)');
    navigate("/login");
  }
};

return (
  <Button
    size="sm"
    className="bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
    onClick={handleLoginClick}
  >
    <User className="w-4 h-4 mr-2" />
    {isAdmin ? t('nav.adminPanel') : (isAuthenticated ? t('nav.admin') : t('nav.login'))}
  </Button>
);
}
