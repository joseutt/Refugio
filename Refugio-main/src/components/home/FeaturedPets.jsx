import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import PetCard from "@/components/pets/PetCard";
import { API_URL } from "@/config/api";

const FeaturedPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        setLoading(true);

        const [petsRes, photosRes] = await Promise.all([
          fetch(`${API_URL}/mascotas/`),
          fetch(`${API_URL}/fotos_mascotas/`),
        ]);

        const petsData = await petsRes.json();
        const photosData = await photosRes.json();

        // Mapear fotos
        const photosMap = {};
        photosData.forEach((photo) => {
          if (photo.url_foto) {
            if (!photosMap[photo.mascota_id]) {
              photosMap[photo.mascota_id] = [];
            }
            photosMap[photo.mascota_id].push(photo.url_foto);
          }
        });

        // Filtrar solo disponibles
        const disponibles = petsData.filter(
          (pet) => pet.estado_adopcion === "Disponible",
        );

        // Tomar solo 4 (puedes randomizar si quieres)
        const selected = disponibles.slice(0, 4);

        const formatted = selected.map((pet) => {
          let images = [];

          if (pet.fotos && pet.fotos.length > 0) {
            images = pet.fotos.map((f) => f.url_foto);
          } else if (photosMap[Number(pet.id)]) {
            images = photosMap[Number(pet.id)];
          }

          const ageText =
            pet.edad === 0
              ? "Cachorro"
              : pet.edad === 1
                ? "1 año"
                : `${pet.edad} años`;

          return {
            id: pet.id,
            name: pet.nombre,
            type: pet.especie === "Perro" ? "dog" : "cat",
            breed: pet.raza || "Mestizo",
            age: ageText,
            gender: pet.sexo || "Desconocido",
            images,
            location: pet.refugio?.nombre || "Refugio",
          };
        });

        setPets(formatted);
      } catch (error) {
        console.error("Error cargando destacadas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-2 text-gray-800">
              Mascotas destacadas
            </h2>
            <p className="text-muted-foreground text-lg">
              Conoce a algunos de nuestros amigos que buscan hogar
            </p>
          </div>

          <Link to="/pets">
            <Button
              variant="outline"
              className="group border-orange-200 hover:bg-orange-50 text-orange-700"
            >
              Ver todas
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pets.map((pet, index) => (
              <div
                key={pet.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PetCard {...pet} isStatic={true} showButton={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPets;
