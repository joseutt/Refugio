import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";
import { API_URL } from "@/config/api";

const statusConfig = {
  Pendiente: {
    label: "Pendiente",
    style: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    icon: Clock,
  },
  Aceptada: {
    label: "Aceptada",
    style: "bg-green-100 text-green-800 border border-green-300",
    icon: CheckCircle2,
  },
  Rechazada: {
    label: "Rechazada",
    style: "bg-red-100 text-red-800 border border-red-300",
    icon: XCircle,
  },
};

const ShelterRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("Todas");

  // Estado para modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/solicitudes/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const data = await res.json();

      const formatted = data.map((item) => ({
        id: item.id,
        userName: item.adoptante?.nombre_completo || "Sin nombre",
        petName: item.mascota?.nombre || "Mascota",
        petImage: item.mascota?.foto_mascota?.url_foto
          ? `${item.mascota.foto_mascota.url_foto}`
          : "SIN FOTO",
        petBreed: item.mascota?.raza || "",
        date: item.fecha_solicitud,
        status: item.estado,
        message: item.comentario,
      }));

      setRequests(formatted);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests =
    filter === "Todas" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    Todas: requests.length,
    Pendiente: requests.filter((r) => r.status === "Pendiente").length,
    Aceptada: requests.filter((r) => r.status === "Aceptada").length,
    Rechazada: requests.filter((r) => r.status === "Rechazada").length,
  };

  // Abrir modal
  const openConfirm = (id, action) => {
    setSelectedId(id);
    setSelectedAction(action);
    setDialogOpen(true);
  };

  // Confirmar acción
  const handleConfirm = async () => {
    try {
      await fetch(`${API_URL}/solicitudes/${selectedId}/responder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ estado: selectedAction }),
      });

      setDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error("Error respondiendo solicitud:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Solicitudes de Adopción
        </h1>
        <p className="text-muted-foreground text-sm">
          Gestiona las solicitudes recibidas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {["Todas", "Pendiente", "Aceptada", "Rechazada"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter(f)}
          >
            {f} ({counts[f]})
          </Button>
        ))}
      </div>

      {/* Lista */}
      <div className="grid gap-4">
        {filteredRequests.map((req) => {
          const cfg = statusConfig[req.status] || statusConfig["Pendiente"];
          const Icon = cfg.icon;

          return (
            <Card
              key={req.id}
              className="hover:shadow-md transition-all border border-border/50"
            >
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img
                      src={req.petImage}
                      className="w-16 h-16 rounded-xl object-cover border"
                    />

                    <div className="space-y-1">
                      <p className="font-semibold text-base">{req.userName}</p>

                      <Badge className={`${cfg.style} px-2 py-1 text-xs`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </Badge>

                      <p className="text-sm text-muted-foreground">
                        Quiere adoptar a
                        <span className="font-medium text-foreground ml-1">
                          {req.petName}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        {new Date(req.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {req.status === "Pendiente" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => openConfirm(req.id, "Aceptada")}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openConfirm(req.id, "Rechazada")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>

                {req.message && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm italic text-muted-foreground">
                    “{req.message}”
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Confirmación */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAction === "Aceptada"
                ? "Confirmar aprobación"
                : "Confirmar rechazo"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction === "Aceptada"
                ? "¿Seguro que deseas aprobar esta solicitud? Esta acción no se puede deshacer fácilmente."
                : "¿Seguro que deseas rechazar esta solicitud?"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={
                selectedAction === "Aceptada"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              onClick={handleConfirm}
            >
              {selectedAction === "Aceptada" ? "Sí, aprobar" : "Sí, rechazar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShelterRequests;
