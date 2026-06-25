// Archivo: src/components/layout/MainLayout.jsx
import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import HeaderPrincipal from "./HeaderPrincipal";
import HeaderAdoptante from "./HeaderAdoptante";
import AdopterSidebar from "./AdopterSidebar";
import Footer from "./Footer"; // Asegúrate de que la ruta sea correcta según tus carpetas
import HeaderRefugio from "./HeaderRefugio";

const MainLayout = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const isRefugio = currentUser?.rol_id === 2;

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  const isAdopter =
    currentUser &&
    (Number(currentUser.rol_id) === 3 ||
      Number(currentUser.rolId) === 3 ||
      Number(currentUser.id_rol) === 3 ||
      Number(currentUser.role_id) === 3 ||
      (currentUser.rol && Number(currentUser.rol.id) === 3) || // Por si viene como objeto anidado
      (currentUser.role && Number(currentUser.role.id) === 3));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Condicionamos cuál Header se muestra */}
      {isAdopter ? (
        <HeaderAdoptante currentUser={currentUser} />
      ) : isRefugio ? (
        <HeaderRefugio />
      ) : (
        <HeaderPrincipal />
      )}

      <div className="flex flex-1 w-full bg-muted/20">
        {/*  Solo mostramos el Sidebar si es Adoptante */}
        {isAdopter && <AdopterSidebar />}

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
