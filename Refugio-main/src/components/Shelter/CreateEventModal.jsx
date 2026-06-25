import { useState } from "react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CreateEventModal = ({ open, onClose, onSuccess }) => {
  const token = localStorage.getItem("access_token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const hasMembership = currentUser?.suscripcion_actual?.estado !== "Ninguna";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    fecha_fin: "",
    ubicacion: "",
    imagen: null,
  });

  if (!open || !hasMembership) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasMembership) {
      toast.error("Necesitas una membresía para crear eventos");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const res = await fetch(`${API_URL}/eventos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Evento creado 🎉");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al crear evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3">
        <h2 className="text-xl font-bold">Crear Evento</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="nombre" placeholder="Nombre" onChange={handleChange} />

          <select
            name="descripcion"
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona el tipo de evento
            </option>
            <option value="Campaña">Campaña</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Donación">Donación</option>
            <option value="Adopción">Adopción</option>
          </select>

          <Input type="datetime-local" name="fecha" onChange={handleChange} />
          <Input
            type="datetime-local"
            name="fecha_fin"
            onChange={handleChange}
          />

          <Input
            name="ubicacion"
            placeholder="Ubicación"
            onChange={handleChange}
          />

          <Input type="file" name="imagen" onChange={handleChange} />

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear"}
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

export default CreateEventModal;
