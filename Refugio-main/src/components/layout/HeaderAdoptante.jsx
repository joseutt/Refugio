import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, PawPrint, Heart, FileText, Calendar, MessageSquare, HandCoins } from "lucide-react"; // Importé HandCoins
import { cn } from "@/lib/utils";

const HeaderAdoptante = ({ currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    navigate("/");
    window.location.reload(); 
  };

  const topNavLinks = [ 
    { href: "/how-it-works", label: "Cómo funciona" },
    { href: "/pets", label: "Mascotas" },
    { href: "/shelters", label: "Refugios" },
    { href: "/compatibility-test", label: "Test de compatibilidad" },
    { href: "/mis-donaciones", label: "Donaciones" }, // Nueva opción arriba
  ];

  const adopterSidebarLinks = [
    { href: "/mis-adopciones", label: "Mis Adopciones", icon: Heart },
    { href: "/MisSolicitudes", label: "Mis Solicitudes", icon: FileText },
    { href: "/mis-donaciones", label: "Mis Donaciones", icon: HandCoins }, // Añadido también al panel
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/comentarios", label: "Comentarios", icon: MessageSquare },
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
            {topNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/perfil">
              <Button variant="ghost" size="sm" className="font-medium hover:border-primary/20">
                <User className="h-4 w-4 mr-2" />
                Hola, {currentUser?.nombre?.split(" ")[0] || "Adoptante"}
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
              Cerrar sesión
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 animate-in slide-in-from-top duration-300 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-2">
            {topNavLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className={cn("px-4 py-3 rounded-md text-base font-medium", isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground")}>
                {link.label}
              </Link>
            ))}
            
            <hr className="my-2 border-border" />
            <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Mi Panel</p>
            <Link to="/perfil" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-primary font-bold">
              <User className="h-5 w-5 mr-3" /> Mi Perfil
            </Link>
            
            {adopterSidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className={cn("flex items-center px-4 py-3 font-medium", isActive(link.href) ? "text-primary" : "text-foreground")}>
                  <Icon className="h-5 w-5 mr-3 text-muted-foreground" /> {link.label}
                </Link>
              );
            })}

            <hr className="my-2 border-border" />
            <Button variant="outline" className="w-full text-red-500 border-red-200" onClick={handleLogout}>Cerrar sesión</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderAdoptante;