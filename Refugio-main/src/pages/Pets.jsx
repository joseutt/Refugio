import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import PetCard from "@/components/pets/PetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, Loader2, PawPrint, X } from "lucide-react";

import { API_URL } from "@/config/api";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const shelterId = searchParams.get("shelter");


const [activeFilters, setActiveFilters] = useState({
    type: searchParams.get("type") || "Todos", // ¡Aquí está la magia! Lee la URL.
    gender: "Todos",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const endpointMascotas = shelterId 
          ? `${API_URL}/mascotas/refugio/${shelterId}` 
          : `${API_URL}/mascotas/`;

        const [petsRes, photosRes] = await Promise.all([
          fetch(endpointMascotas),
          fetch(`${API_URL}/fotos_mascotas/`)
        ]);

        const petsData = await petsRes.json();
        const photosData = await photosRes.json();

        // Mapa de respaldo por si el backend no manda las fotos anidadas
        const photosMap = {};
        photosData.forEach(photo => {
          if (photo.url_foto) {
            if (!photosMap[photo.mascota_id]) photosMap[photo.mascota_id] = [];
            photosMap[photo.mascota_id].push(photo.url_foto);
          }
        });

        const disponibles = petsData.filter(pet => pet.estado_adopcion === "Disponible");

        const formattedPets = disponibles.map(pet => {
          // 1. Extraer todas las fotos para que NO TRUENE y mandarlas al carrusel
          let petImages = [];
          if (pet.fotos && pet.fotos.length > 0) {
            petImages = pet.fotos.map(f => f.url_foto);
          } else if (photosMap[Number(pet.id)]) {
            petImages = photosMap[Number(pet.id)];
          }

          // 2. Dar formato humano a la edad
          const ageText = pet.edad === 0 ? "Cachorro" : (pet.edad === 1 ? "1 año" : `${pet.edad} años`);

          return {
            id: pet.id,
            name: pet.nombre,
            type: pet.especie === "Perro" ? "dog" : "cat",
            breed: pet.raza || "Mestizo",
            age: ageText,
            gender: pet.sexo || "Desconocido", // Pasamos sexo exacto
            images: petImages, // Pasamos el arreglo completo al PetCard
            location: pet.refugio?.nombre || "Refugio Patitas"
          };
        });

        setPets(formattedPets);
      } catch (error) {
        console.error("Error cargando mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [shelterId]);

  // Lógica de filtrado en tiempo real
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = activeFilters.type === "Todos" || 
                        (activeFilters.type === "Perros" && pet.type === "dog") || 
                        (activeFilters.type === "Gatos" && pet.type === "cat");
    
    const matchesGender = activeFilters.gender === "Todos" || pet.gender === activeFilters.gender;

    return matchesSearch && matchesType && matchesGender;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <section className="bg-gradient-to-b from-orange-50 to-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              {shelterId ? "Mascotas del Refugio" : "Encuentra a tu mejor amigo"}
            </h1>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Busca por nombre o raza..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 shadow-sm border-gray-200"
                />
              </div>

              <Button
                variant={showFilters ? "default" : "outline"}
                className={cn("h-12 border-gray-200 shadow-sm", showFilters && "bg-orange-600 hover:bg-orange-700 text-white")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filtros
              </Button>
            </div>

            {/* --- PANEL DE FILTROS DESPLEGABLE --- */}
            {showFilters && (
              <div className="mt-4 p-5 bg-white border border-gray-100 rounded-xl shadow-md flex flex-wrap gap-6 animate-in slide-in-from-top-2 max-w-4xl">
                
                {/* Filtro: Especie */}
                <div className="space-y-2 min-w-[150px]">
                  <label className="text-sm font-semibold text-gray-700">Especie</label>
                  <select 
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    value={activeFilters.type}
                    onChange={(e) => setActiveFilters({ ...activeFilters, type: e.target.value })}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Perros">Perros</option>
                    <option value="Gatos">Gatos</option>
                  </select>
                </div>

                {/* Filtro: Sexo */}
                <div className="space-y-2 min-w-[150px]">
                  <label className="text-sm font-semibold text-gray-700">Sexo</label>
                  <select 
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    value={activeFilters.gender}
                    onChange={(e) => setActiveFilters({ ...activeFilters, gender: e.target.value })}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>

                {/* Botón limpiar filtros */}
                {(activeFilters.type !== "Todos" || activeFilters.gender !== "Todos") && (
                  <div className="flex items-end ml-auto">
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveFilters({ type: "Todos", gender: "Todos" })}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" /> Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        <section className="py-12 bg-gray-50/50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-orange-500 mb-4" />
                <p className="text-gray-500 font-medium">Cargando peluditos...</p>
              </div>
            ) : filteredPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.map(pet => (
                  <PetCard key={pet.id} {...pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 max-w-2xl mx-auto">
                <PawPrint className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">No encontramos mascotas</h3>
                <p className="text-gray-500 mt-2">Intenta ajustar los filtros o la barra de búsqueda para ver más resultados.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pets;