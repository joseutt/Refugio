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

const AddPetDialog = ({
  open,
  setOpen,
  formData,
  setFormData,
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
  currentUser,
  token,
  resetForm,
  fetchPets,
  setErrorModal,
}) => {
  const hasMembership = currentUser?.suscripcion_actual?.estado !== "Ninguna";
  const maxImages = hasMembership ? 5 : 1;

  // Manejo de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length > maxImages) {
      setErrorModal({
        open: true,
        message: hasMembership
          ? `Máximo puedes subir ${maxImages} imágenes.`
          : "Tu plan gratuito solo permite 1 imagen. Mejora tu plan para subir más.",
      });
      return;
    }

    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Crear mascota
  const createPet = async () => {
    const payload = {
      nombre: formData.nombre,
      especie: formData.especie,
      raza: formData.raza,
      edad: Number(formData.edad),
      sexo: formData.sexo,
      descripcion: formData.descripcion,
      estado_adopcion: formData.estado_adopcion || "Disponible",
      refugio_id: currentUser?.refugio_id,
    };

    const res = await fetch(`${API_URL}/mascotas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorMessage = "Error al crear mascota";

      if (res.status === 403) {
        errorMessage = "Has alcanzado el límite de mascotas de tu plan actual.";
      } else {
        try {
          const data = await res.json();
          errorMessage = data.detail || errorMessage;
        } catch {}
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  // Subir imágenes
  const uploadPetImages = async (petId) => {
    const formDataUpload = new FormData();

    formDataUpload.append("mascota_id", petId);

    imageFiles.forEach((file, index) => {
      formDataUpload.append("files", file);
      formDataUpload.append(
        "descripciones",
        index === 0 ? "Foto principal" : `Foto ${index + 1}`,
      );
    });

    const res = await fetch(`${API_URL}/fotos_mascotas/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataUpload,
    });

    if (!res.ok) throw new Error("Error al subir imágenes");
  };

  // Submit completo
  const handleAddPet = async (e) => {
    e.preventDefault();

    if (!imageFiles || imageFiles.length === 0) {
      setErrorModal({
        open: true,
        message: "Debes subir al menos una foto de la mascota.",
      });
      return;
    }

    // VALIDACIÓN FINAL
    if (imageFiles.length > maxImages) {
      setErrorModal({
        open: true,
        message: hasMembership
          ? `Máximo ${maxImages} imágenes permitidas.`
          : "Tu plan gratuito solo permite 1 imagen.",
      });
      return;
    }

    try {
      const pet = await createPet();
      await uploadPetImages(pet.id);

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
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Mascota</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddPet} className="space-y-4">
          <Input
            placeholder="Nombre"
            required
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />

          <Select
            value={formData.especie}
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
            value={formData.raza}
            onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Edad"
            value={formData.edad}
            onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
          />

          <Select
            value={formData.sexo}
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
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />

          <Select
            value={formData.estado_adopcion || ""}
            onValueChange={(v) =>
              setFormData({ ...formData, estado_adopcion: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado de adopción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="En proceso">No Disponible</SelectItem>
            </SelectContent>
          </Select>

          {/* INPUT IMÁGENES */}
          <Input
            type="file"
            accept="image/*"
            multiple={hasMembership}
            onChange={handleImageChange}
          />

          {/* MENSAJE UX */}
          <p className="text-xs text-muted-foreground">
            {hasMembership
              ? "Puedes subir hasta 5 imágenes."
              : "Plan gratuito: solo 1 imagen. Mejora tu plan para subir más."}
          </p>

          {/* PREVIEWS */}
          {imagePreviews?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          <Button type="submit" className="w-full">
            Guardar Mascota
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;
