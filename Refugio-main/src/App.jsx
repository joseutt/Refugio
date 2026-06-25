import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Pets from "./pages/Pets";
import Auth from "./pages/Auth";
import MisAdopciones from "./pages/Adoptante/Adopciones";
import PerfilRefugio from "./pages/Refugio/Perfil";
import PerfilAdoptante from "./pages/Adoptante/Perfil";
import Shelters from "./pages/Shelters";
import HowItWorks from "./pages/HowItWorks";
import CompatibilityTest from "./pages/CompatibilityTest";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Plans from "./pages/Refugio/Plans";
import RegisterAdoptante from "./pages/RegisterAdoptante";
import RegisterRefugio from "./pages/RegisterRefugio";
import ShelterPets from "./pages/Refugio/ShelterPets";
import ShelterRequests from "./pages/Refugio/ShelterRequests";
import ShelterEvents from "./pages/Refugio/ShelterEvents";
import PetDetail from "./pages/PetDetail";
import AdoptionHistory from "./pages/Refugio/AdoptionHistory";
import PetVaccines from "./pages/PetVaccines";
import Eventos from "./pages/Adoptante/Eventos";
import MisSolicitudes from "./pages/Adoptante/MisSolicitudes";
import ComentariosAdoptantes from "./pages/Adoptante/ComentariosAdoptantes";
import ScanPet from "./pages/ScanPet";
import MisDonaciones from "./pages/Adoptante/MisDonaciones";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/shelters" element={<Shelters />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/compatibility-test" element={<CompatibilityTest />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/plans" element={<Plans />} />

            {/* RUTAS DE MASCOTAS */}
            <Route path="/mascotas/:id" element={<PetDetail />} />
            <Route path="/mascotas/:id/vacunas" element={<PetVaccines />} />
            <Route path="/scan/:id" element={<ScanPet />} />

            {/* RUTAS DE ADOPTANTE */}
            <Route path="/register/adoptante" element={<RegisterAdoptante />} />
            <Route path="/mis-adopciones" element={<MisAdopciones />} />
            <Route path="/perfil" element={<PerfilAdoptante />} />
            <Route path="/Eventos" element={<Eventos />} />
            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
            <Route path="/comentarios" element={<ComentariosAdoptantes />} />
            <Route path="/mis-donaciones" element={<MisDonaciones />} />
            {/* RUTAS DE REFUGIO */}
            <Route path="/register/refugio" element={<RegisterRefugio />} />
            <Route path="/perfil-refugio" element={<PerfilRefugio />} />
            <Route path="/Refugio/ShelterPets" element={<ShelterPets />} />
            <Route
              path="/Refugio/ShelterRequests"
              element={<ShelterRequests />}
            />
            <Route path="/Refugio/ShelterEvents" element={<ShelterEvents />} />
            <Route path="/historial-adopciones" element={<AdoptionHistory />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
