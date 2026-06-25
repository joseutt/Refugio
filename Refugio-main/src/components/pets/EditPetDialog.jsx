import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { API_URL } from "../../config/api";

const EditPetDialog = ({
  open,
  setOpen,
  formData,
  setFormData,
  selectedPet,
  token,
  resetForm,
  fetchPets,
  setErrorModal,
  currentUser,
}) => {
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const hasMembership = currentUser?.suscripcion_actual?.estado !== "Ninguna";
  const maxImages = hasMembership ? 5 : 1;

  useEffect(() => {
    if (selectedPet) {
      setFormData({
        nombre: selectedPet.nombre || "",
        especie: selectedPet.especie || "",
        raza: selectedPet.raza || "",
        edad: selectedPet.edad || "",
        sexo: selectedPet.sexo || "",
        estado_adopcion: selectedPet.estado_adopcion || "Disponible",
        descripcion: selectedPet.descripcion || "",
      });

      loadPhotos();
    }
  }, [selectedPet]);

  const loadPhotos = async () => {
    try {
      const res = await fetch(`${API_URL}/fotos_mascotas/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const petPhotos = data.filter((p) => p.mascota_id === selectedPet.id);

      setExistingPhotos(petPhotos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalImages = existingPhotos.length + files.length;

    if (totalImages > maxImages) {
      setErrorModal({
        open: true,
        message: hasMembership
          ? `Máximo puedes tener ${maxImages} imágenes en total.`
          : "Tu plan gratuito solo permite 1 imagen. Elimina la actual o mejora tu plan.",
      });
      return;
    }

    setNewImages(files);

    const previews = files.map((f) => URL.createObjectURL(f));
    setNewPreviews(previews);
  };

  const uploadNewImages = async (petId) => {
    if (newImages.length === 0) return;

    const formDataUpload = new FormData();
    formDataUpload.append("mascota_id", petId);

    newImages.forEach((file, i) => {
      formDataUpload.append("files", file);
      formDataUpload.append("descripciones", `Nueva ${i + 1}`);
    });

    const res = await fetch(`${API_URL}/fotos_mascotas/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formDataUpload,
    });

    if (!res.ok) {
      let message = "Error al subir imágenes";

      try {
        const data = await res.json();

        // Detectar límite del plan
        if (data.detail?.includes("Galería llena")) {
          message =
            "Has alcanzado el límite de fotos de tu plan actual. Mejora tu plan para subir más imágenes.";
        } else {
          message = data.detail || message;
        }
      } catch {}

      throw new Error(message);
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      const res = await fetch(`${API_URL}/fotos_mascotas/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
      } else {
        alert("Error al eliminar foto");
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar foto");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const totalImages = existingPhotos.length + newImages.length;

    if (totalImages > maxImages) {
      setErrorModal({
        open: true,
        message: hasMembership
          ? `Máximo ${maxImages} imágenes permitidas.`
          : "Tu plan gratuito solo permite 1 imagen.",
      });
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        edad: Number(formData.edad),
        sexo: formData.sexo,
        descripcion: formData.descripcion,
        estado_adopcion: formData.estado_adopcion || "Disponible",
      };

      const res = await fetch(`${API_URL}/mascotas/${selectedPet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error actualizando mascota");

      await uploadNewImages(selectedPet.id);

      setOpen(false);
      resetForm();
      fetchPets();
    } catch (error) {
      console.error(error);
      setErrorModal({
        open: true,
        message: error.message,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Mascota</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            placeholder="Nombre"
            value={formData.nombre || ""}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />

          <Select
            value={formData.especie || ""}
            onValueChange={(v) => setFormData({ ...formData, especie: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Especie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Perro">Perro</SelectItem>
              <SelectItem value="Gato">Gato</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Raza"
            value={formData.raza || ""}
            onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Edad"
            value={formData.edad || ""}
            onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
          />

          <Select
            value={formData.sexo || ""}
            onValueChange={(v) => setFormData({ ...formData, sexo: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Descripción"
            value={formData.descripcion || ""}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />

          {/* FOTOS EXISTENTES */}
          <div>
            <p className="text-sm font-medium mb-2">Fotos actuales</p>
            <div className="grid grid-cols-3 gap-2">
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url_foto}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => deletePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* NUEVAS FOTOS */}
          <Input
            type="file"
            multiple={hasMembership}
            accept="image/*"
            onChange={handleImageChange}
          />

          <p className="text-xs text-muted-foreground">
            {hasMembership
              ? `Puedes tener hasta ${maxImages} imágenes en total.`
              : "Plan gratuito: solo 1 imagen en total."}
          </p>

          {newPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {newPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-full h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPetDialog;
