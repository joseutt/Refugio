import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Syringe,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AdoptionRequestModal from "./AdoptionRequestModal";
import { API_URL } from "@/config/api";

const PetCard = ({
  id,
  name,
  type,
  breed,
  age,
  gender,
  images,
  location,
  isStatic = false,
  showButton = true,
}) => {
  const [solicitudEstado, setSolicitudEstado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(true);
  const [notificacion, setNotificacion] = useState(null);
  const [vacunasFetch, setVacunasFetch] = useState([]);
  const [loadingVacunas, setLoadingVacunas] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photoArray =
    Array.isArray(images) && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=60",
        ];

  const mostrarNotificacion = (texto, tipo = "error") => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 4000);
  };

  useEffect(() => {
    // Si es estática, no hacemos llamadas al backend
    if (isStatic) {
      setLoadingEstado(false);
      setLoadingVacunas(false);
      return;
    }

    const cargarEstadoDesdeServidor = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoadingEstado(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/solicitudes/mis-solicitudes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const misSolicitudes = await response.json();
          const solicitud = misSolicitudes.find(
            (s) =>
              String(s.mascota_id) === String(id) ||
              String(s.mascota?.id) === String(id),
          );
          if (solicitud) setSolicitudEstado(solicitud.estado.toLowerCase());
        }
      } catch (error) {
        console.error("Error al sincronizar:", error);
      } finally {
        setLoadingEstado(false);
      }
    };

    const cargarVacunas = async () => {
      try {
        const res = await fetch(`${API_URL}/vacunas/mascota/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setVacunasFetch(data);
        }
      } catch (error) {
        console.error("Error al obtener vacunas:", error);
      } finally {
        setLoadingVacunas(false);
      }
    };

    cargarEstadoDesdeServidor();
    cargarVacunas();
  }, [id, isStatic]);

  const abrirModal = (e) => {
    e.stopPropagation();
    if (isStatic) return; // No permitir abrir modal en tarjetas estáticas
    if (!localStorage.getItem("access_token")) {
      mostrarNotificacion("Debes iniciar sesión para adoptar a esta mascota.");
      return;
    }
    setShowModal(true);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % photoArray.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + photoArray.length) % photoArray.length,
    );
  };

  return (
    <>
      <Card
        variant="pet"
        className="group flex flex-col h-full cursor-pointer border-transparent hover:border-orange-200 transition-colors shadow-sm hover:shadow-md relative overflow-hidden"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={photoArray[currentImageIndex]}
            alt={`${name} - foto ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {photoArray.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <Badge
            className={cn(
              "absolute top-3 left-3 shadow-sm",
              type === "dog" ? "bg-orange-500" : "bg-amber-500",
            )}
          >
            {type === "dog" ? "Perro" : "Gato"}
          </Badge>

          {/* Badge de solicitud: Solo si NO es estática */}
  {!isStatic && solicitudEstado && (
  <Badge className={cn(
    "absolute top-3 right-3 shadow-md border-0 text-white font-semibold",
    // Verificamos múltiples términos de éxito
    solicitudEstado.includes("pendiente") ? "bg-yellow-500" :
    (solicitudEstado.includes("aprobada") || solicitudEstado.includes("aceptada")) ? "bg-green-500" : 
    "bg-red-500"
  )}>
    {solicitudEstado.includes("pendiente") ? "Pendiente" :
     (solicitudEstado.includes("aprobada") || solicitudEstado.includes("aceptada")) ? "Aceptada" : 
     "Rechazada"}
  </Badge>
)}
        </div>

        <div className="p-5 flex flex-col flex-1 space-y-4">
          <div>
            <h3 className="font-extrabold text-xl text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm font-medium">{breed}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-orange-50 border-orange-100 text-orange-700"
            >
              <Calendar className="h-3 w-3 mr-1.5" /> {age}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 border-blue-100 text-blue-700"
            >
              <Info className="h-3 w-3 mr-1.5" /> {gender}
            </Badge>

            {/* Vacunas: Solo si NO es estática */}
            {!isStatic &&
              !loadingVacunas &&
              (vacunasFetch.length > 0 ? (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 border-green-100 text-green-700"
                >
                  <Syringe className="h-3 w-3 mr-1.5" /> Vacunado
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs bg-red-50 border-red-100 text-red-700"
                >
                  <ShieldAlert className="h-3 w-3 mr-1.5" /> Sin vacunas
                </Badge>
              ))}
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium mt-auto pb-2">
            <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {showButton && (
            <Button
              onClick={abrirModal}
              className={cn(
                "w-full font-bold transition-all shadow-sm mt-auto",
                isStatic
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : solicitudEstado === "pendiente" ||
                      solicitudEstado === "aprobada"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white",
              )}
              disabled={
                !isStatic &&
                (loadingEstado ||
                  solicitudEstado === "pendiente" ||
                  solicitudEstado === "aprobada")
              }
            >
              {isStatic ? (
                "Conocer más"
              ) : loadingEstado ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : solicitudEstado === "pendiente" ? (
                "Solicitud enviada"
              ) : solicitudEstado === "aprobada" ? (
                "¡Felicidades!"
              ) : (
                "Enviar solicitud"
              )}
            </Button>
          )}
        </div>
      </Card>

      {!isStatic && (
        <AdoptionRequestModal
          open={showModal}
          onClose={() => setShowModal(false)}
          pet={{ id, name, imageUrl: photoArray[0] }}
          onSuccess={() => setSolicitudEstado("pendiente")}
        />
      )}

      {notificacion && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-[100] border-l-4 bg-white ${notificacion.tipo === "success" ? "border-green-500" : "border-red-500"}`}
        >
          <AlertCircle
            className={cn(
              "h-6 w-6 shrink-0",
              notificacion.tipo === "success"
                ? "text-green-500"
                : "text-red-500",
            )}
          />
          <p className="font-medium text-sm text-gray-800">
            {notificacion.texto}
          </p>
        </div>
      )}
    </>
  );
};

export default PetCard;
