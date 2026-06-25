import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const ShelterHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // Función para determinar si el enlace actual está activo
  const isActive = (path) => {
    // Para la ruta raíz del refugio ("/refugio"), queremos coincidencia exacta
    if (path === "/refugio") {
      return location.pathname === "/refugio";
    }
    // Para las demás, si la ruta empieza con el path (ej. /refugio/pets)
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-card border-b p-4 shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* NAVEGACIÓN DEL REFUGIO */}
        <nav className="flex gap-4 md:gap-6 items-center overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Link 
            to="/refugio" 
            className={cn("whitespace-nowrap font-bold", isActive("/refugio") ? "text-primary" : "text-foreground")}
          >
            Dashboard
          </Link>
          <Link 
            to="/refugio/pets" 
            className={cn("whitespace-nowrap transition-colors", isActive("/refugio/pets") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
          >
            Mascotas
          </Link>
          <Link 
            to="/refugio/requests" 
            className={cn("whitespace-nowrap transition-colors", isActive("/refugio/requests") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
          >
            Solicitudes
          </Link>
          <Link 
            to="/refugio/messages" 
            className={cn("whitespace-nowrap transition-colors", isActive("/refugio/messages") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
          >
            Mensajes
          </Link>
          <Link 
            to="/refugio/stats" 
            className={cn("whitespace-nowrap transition-colors", isActive("/refugio/stats") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
          >
            Estadísticas
          </Link>
          <Link 
            to="/refugio/settings" 
            className={cn("whitespace-nowrap transition-colors", isActive("/refugio/settings") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
          >
            Configuración
          </Link>
        </nav>

        {/* ACCIONES EXTRAS */}
        <div className="flex gap-4 items-center shrink-0">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Sitio público
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </header>
  );
};

export default ShelterHeader;