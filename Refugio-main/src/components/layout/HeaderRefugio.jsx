import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import { refugioPages } from "../../config/navigation";

const HeaderRefugio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    setCurrentUser(null);
    navigate("/");
  };

  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { href: "/", label: "Inicio" },
        { href: "/pets", label: "Mascotas" },
        { href: "/how-it-works", label: "Cómo funciona" },
        { href: "/shelters", label: "Refugios" },
      ];
    }

    return [
      { href: "/", label: "Inicio" },
      ...refugioPages
        .filter((page) => page.name !== "Perfil")
        .map((page) => ({
          href: page.path,
          label: page.name,
        })),
    ];
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              Patitas<span className="text-primary">Felices</span>
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ACCIONES DESKTOP */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/perfil-refugio">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium border border-transparent hover:border-primary/20"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Hola, {currentUser.nombre?.split(" ")[0] || "Refugio"}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* BOTÓN MOBILE */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {currentUser && (
              <Link
                to="/perfil-refugio"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-primary font-bold"
              >
                <User className="h-5 w-5 mr-2" /> Mi Perfil
              </Link>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-md text-base font-medium",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2 border-border" />

            {currentUser ? (
              <Button
                variant="outline"
                className="w-full text-red-500"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Ingresar</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderRefugio;
