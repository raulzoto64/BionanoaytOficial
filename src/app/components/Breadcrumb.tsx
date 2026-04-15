import { Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";

interface BreadcrumbLink {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  links: BreadcrumbLink[];
}

export function Breadcrumb({ links }: BreadcrumbProps) {
  const { language } = useLanguage();

  return (
    <nav className="flex items-center gap-2 text-sm">
      {links.map((link, index) => (
        <span key={index}>
          {link.href ? (
            <Link to={link.href} className="text-[#1C5D15] hover:text-[#629960] transition-colors font-medium">
              {link.name}
            </Link>
          ) : (
            <span className="text-[#629960]">{link.name}</span>
          )}
          {index < links.length - 1 && (
            <span className="text-[#629960] mx-1">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}