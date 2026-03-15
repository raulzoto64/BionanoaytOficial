import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../hooks/useAuth";

export function LoginButton() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const isAdmin = user?.role === 'admin';

  const handleLoginClick = () => {

    if (isAdmin) {
      navigate("/admin");
    } else if (isAuthenticated) {
      navigate("/admin"); 
    } else {
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
      {isAdmin ? t('adminPanel') : (isAuthenticated ? t('admin') : t('login'))}
    </Button>
  );
}