import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

const HeaderPrincipal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { href: "/pets", label: "Mascotas" },
    { href: "/shelters", label: "Refugios" },
    { href: "/how-it-works", label: "Cómo funciona" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              Patitas<span className="text-primary">Felices</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm">Iniciar Sesión</Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border p-4">
          <nav className="flex flex-col gap-2">
            {publicLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-md text-base font-medium">
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Iniciar Sesión</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderPrincipal;