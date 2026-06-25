import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Heart, FileText, Calendar, MessageSquare, User, Menu } from "lucide-react";

const AdopterSidebar = () => {
  const location = useLocation();

  const sidebarLinks = [
    { href: "/perfil", label: "Mi Perfil", icon: User },
    { href: "/mis-adopciones", label: "Mis Adopciones", icon: Heart },
    { href: "/mis-solicitudes", label: "Mis Solicitudes", icon: FileText },
    { href: "/Eventos", label: "Eventos", icon: Calendar },
    { href: "/comentarios", label: "Comentarios", icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="group w-16 hover:w-64 bg-card border-r border-orange-200 transition-all duration-300 ease-in-out hidden lg:flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden z-40 shadow-sm">
      
      {/* HEADER DEL SIDEBAR */}
      <div className="flex items-center h-16 px-4 cursor-pointer border-b border-transparent group-hover:border-orange-100 transition-colors">
        <Menu className="h-7 w-7 text-orange-500 shrink-0" />
        <span className="ml-4 font-extrabold text-orange-500 uppercase tracking-wider whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Mi Panel
        </span>
      </div>

      {/* ENLACES DEL MENÚ */}
      <nav className="flex-1 p-2 space-y-2 mt-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center px-2 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-orange-100 hover:text-orange-600"
              )}
            >
              <Icon className={cn("h-6 w-6 shrink-0", active ? "text-white" : "text-orange-500")} />
              <span className="ml-4 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdopterSidebar;