import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import { createPortal } from "react-dom";
import PetQR from "@/components/pets/PetQR";

const formatDate = (date) => {
  if (!date) return "Sin fecha";
  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [adoptanteDetalle, setAdoptanteDetalle] = useState(null);

  const token = localStorage.getItem("access_token");

  const fetchPet = async () => {
    try {
      const res = await fetch(`${API_URL}/mascotas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPet(data);

      if (data.adoptante?.id) {
        const resAdoptante = await fetch(
          `${API_URL}/adoptantes/${data.adoptante.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (resAdoptante.ok) {
          const adoptanteData = await resAdoptante.json();
          setAdoptanteDetalle(adoptanteData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (!galleryOpen || !pet?.fotos?.length) return;

      if (e.key === "ArrowRight") {
        setCurrentImg((prev) => (prev === pet.fotos.length - 1 ? 0 : prev + 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrentImg((prev) => (prev === 0 ? pet.fotos.length - 1 : prev - 1));
      }
      if (e.key === "Escape") setGalleryOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryOpen, pet]);

  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [galleryOpen]);

  if (loading) return <p className="p-6">Cargando mascota...</p>;
  if (!pet) return <p className="p-6">Mascota no encontrada</p>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* FOTO */}
        <div className="md:col-span-1">
          <img
            src={
              pet.fotos?.[0]?.url_foto ||
              "https://via.placeholder.com/300?text=Sin+foto"
            }
            alt={pet.nombre}
            className="w-full h-[300px] object-cover rounded-3xl shadow-md"
          />
        </div>

        {/* INFO */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">{pet.nombre}</h1>

          <div className="mt-2 text-muted-foreground space-y-1">
            <p>
              {pet.especie} • {pet.raza}
            </p>
            <p>Edad: {pet.edad} años</p>
            <p>Estado: {pet.estado_adopcion}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Sexo:</strong> {pet.sexo || "No disponible"}
            </p>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {pet.descripcion || "Sin descripción disponible"}
          </p>
        </div>
      </div>

      {/* GRID DE INFO */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* REFUGIO */}
        {pet.refugio && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-4">Refugio</h2>

            <div className="flex items-center gap-4">
              {/* FOTO */}
              <img
                src={
                  pet.refugio.foto_url ||
                  "https://via.placeholder.com/80?text=Refugio"
                }
                alt={pet.refugio.nombre}
                className="w-16 h-16 rounded-xl object-cover shadow-sm"
              />

              {/* INFO */}
              <div className="flex-1">
                <p className="font-medium">{pet.refugio.nombre}</p>

                <p className="text-sm text-muted-foreground">
                  {pet.refugio.direccion || "Sin dirección"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {pet.refugio.telefono || "Sin teléfono"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ADOPTANTE */}
        {pet.adoptante && (
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-2">Adoptante</h2>

            <p>{pet.adoptante.nombre_completo}</p>

            {adoptanteDetalle && (
              <>
                <p className="text-sm text-muted-foreground mt-2">
                  {adoptanteDetalle.telefono || "No disponible"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {adoptanteDetalle.direccion || "No disponible"}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* VACUNAS */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-3">Vacunas</h2>

        {pet.vacunas?.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {pet.vacunas.map((v) => (
              <li key={v.id} className="border-b pb-2">
                <p>{v.nombre_vacuna}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(v.fecha_vacunacion)} • Próxima:{" "}
                  {formatDate(v.proxima_dosis)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            No hay vacunas registradas
          </p>
        )}
      </div>

      {/* QR */}
      {pet.adoptante && (
        <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-2xl shadow-sm text-center">
          <div className="flex justify-center">
            <PetQR petId={pet.id} petName={pet.nombre} />
          </div>
        </div>
      )}

      {/* GALERÍA */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-3">Fotos</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pet.fotos?.map((f, index) => (
            <img
              key={f.id}
              src={f.url_foto}
              onClick={() => {
                setCurrentImg(index);
                setGalleryOpen(true);
              }}
              className="h-32 w-full object-cover rounded-xl cursor-pointer hover:scale-105 transition"
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      {galleryOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/95 z-[999999] flex items-center justify-center"
            onClick={() => setGalleryOpen(false)}
          >
            <button className="absolute top-5 right-5 text-white text-3xl">
              ✕
            </button>

            <img
              src={pet.fotos[currentImg].url_foto}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default PetDetail;
