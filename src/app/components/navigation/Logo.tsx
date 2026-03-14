import { Link } from "react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img 
        src="/images/logo png.png" 
        alt="BioNano A&T" 
        className="h-18 w-auto"
      />
    </Link>
  );
}