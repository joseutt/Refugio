import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ManageEventModal = ({ open, onClose, evento, onSuccess }) => {
  const token = localStorage.getItem("access_token");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    fecha_fin: "",
    ubicacion: "",
    imagen: null,
  });

  useEffect(() => {
    if (evento) {
      setForm({
        nombre: evento.nombre || "",
        descripcion: evento.descripcion || "",
        fecha: evento.fecha?.slice(0, 16) || "",
        fecha_fin: evento.fecha_fin?.slice(0, 16) || "",
        ubicacion: evento.ubicacion || "",
        imagen: null,
      });
    }
  }, [evento]);

  if (!open || !evento) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // EDITAR
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const res = await fetch(`${API_URL}/eventos/${evento.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Evento actualizado");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR
  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este evento?")) return;

    try {
      const res = await fetch(`${API_URL}/eventos/${evento.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      toast.success("Evento eliminado");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3">
        <h2 className="text-xl font-bold">Editar Evento</h2>

        <form onSubmit={handleUpdate} className="space-y-3">
          <Input name="nombre" value={form.nombre} onChange={handleChange} />
          <Textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />

          <Input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
          />
          <Input
            type="datetime-local"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
          />

          <Input
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
          />
          <Input type="file" name="imagen" onChange={handleChange} />

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Actualizar"}
            </Button>

            <Button variant="destructive" type="button" onClick={handleDelete}>
              Eliminar
            </Button>

            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageEventModal;
