import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import CreateEventModal from "@/components/Shelter/CreateEventModal";
import ManageEventModal from "@/components/Shelter/ManageEventModal";
import DeleteConfirmModal from "@/components/Shelter/DeleteConfirmModal";

import { Plus, Calendar, Clock, MapPin, Edit, Trash2 } from "lucide-react";

const ShelterEvents = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("access_token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const hasMembership = currentUser?.suscripcion_actual?.estado !== "Ninguna";

  const fetchEventos = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/eventos/mis-eventos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setEventos(Array.isArray(data) ? data : data.data || []);
    } catch {
      toast.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Confirmar eliminación
  const handleDelete = async () => {
    if (!deleteEventId) return;

    setDeleting(true);

    try {
      const res = await fetch(`${API_URL}/eventos/${deleteEventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      toast.success("Evento eliminado");
      setDeleteEventId(null);
      fetchEventos();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Eventos</h2>

        <Button
          disabled={!hasMembership}
          onClick={() => {
            if (!hasMembership) {
              toast.error(
                "Solo los refugios con membresía pueden crear eventos",
              );
              return;
            }
            setShowCreate(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Evento
        </Button>
      </div>

      {/* AVISO */}
      {!hasMembership && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm">
          ⚠️ Necesitas una membresía para publicar eventos.
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-gray-500 text-center">Cargando...</p>}

      {/* Sin eventos */}
      {!loading && eventos.length === 0 && (
        <p className="text-gray-500 text-center">No hay eventos aún</p>
      )}

      {/* Lista */}
      {eventos.map((evento) => (
        <div key={evento.id} className="border p-4 rounded-xl space-y-2">
          <h3 className="font-bold">{evento.nombre}</h3>
          <p>{evento.descripcion}</p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {new Date(evento.fecha).toLocaleString()}
          </div>

          {evento.fecha_fin && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {new Date(evento.fecha_fin).toLocaleString()}
            </div>
          )}

          {evento.ubicacion && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {evento.ubicacion}
            </div>
          )}

          {evento.imagen_url && (
            <img
              src={evento.imagen_url}
              alt="evento"
              className="w-full h-40 object-cover rounded"
            />
          )}

          <div className="flex gap-2">
            <Button onClick={() => setSelectedEvent(evento)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>

            <Button
              variant="destructive"
              onClick={() => setDeleteEventId(evento.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      ))}

      {/* MODALES */}

      <CreateEventModal
        open={showCreate && hasMembership}
        onClose={() => setShowCreate(false)}
        onSuccess={fetchEventos}
      />

      <ManageEventModal
        open={!!selectedEvent}
        evento={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSuccess={fetchEventos}
      />

      <DeleteConfirmModal
        open={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default ShelterEvents;
