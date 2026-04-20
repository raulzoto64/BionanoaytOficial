import { Link } from "react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
      <img 
        src="/images/logo png.png" 
        alt="Bionano A&T" 
        className="h-14 md:h-16 w-auto object-contain"
      />
    </Link>
  );
}
