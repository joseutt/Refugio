import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddVaccineDialog = ({
  open,
  setOpen,
  petId,
  token,
  onSuccess,
  editingVacuna,
  setEditingVacuna,
}) => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [proxima, setProxima] = useState("");

  useEffect(() => {
    if (editingVacuna) {
      setNombre(editingVacuna.nombre_vacuna);
      setFecha(editingVacuna.fecha_vacunacion?.split("T")[0] || "");
      setProxima(editingVacuna.proxima_dosis?.split("T")[0] || "");
    } else {
      setNombre("");
      setFecha("");
      setProxima("");
    }
  }, [editingVacuna]);

  const handleSubmit = async () => {
    const url = editingVacuna
      ? `${API_URL}/vacunas/${editingVacuna.id}`
      : `${API_URL}/vacunas/`;

    const method = editingVacuna ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mascota_id: petId,
        nombre_vacuna: nombre,
        fecha_vacunacion: fecha,
        proxima_dosis: proxima || null,
      }),
    });

    setOpen(false);
    setEditingVacuna(null);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingVacuna ? "Editar vacuna" : "Nueva vacuna"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <Input
            type="date"
            value={proxima}
            onChange={(e) => setProxima(e.target.value)}
          />

          <Button onClick={handleSubmit}>
            {editingVacuna ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVaccineDialog;
