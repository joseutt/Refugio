import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { API_URL } from "../../config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AddPetDialog from "../../components/pets/AddPetDialog";
import EditPetDialog from "../../components/pets/EditPetDialog";
import PetsTable from "../../components/pets/PetsTable";
import { useNavigate } from "react-router-dom";

const ShelterPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const navigate = useNavigate();

  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    sexo: "",
    descripcion: "",
  });

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const token = localStorage.getItem("access_token");

  const resetForm = () => {
    setFormData({
      nombre: "",
      especie: "",
      raza: "",
      edad: "",
      sexo: "",
      descripcion: "",
    });

    setImageFiles([]);
    setImagePreviews([]);

    setSelectedPet(null);
  };

  const fetchPets = async () => {
    if (!user.refugio_id) return;

    try {
      setLoading(true);

      const petsRes = await fetch(
        `${API_URL}/mascotas/refugio/${user.refugio_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!petsRes.ok) throw new Error("No se pudieron cargar las mascotas");

      const petsData = await petsRes.json();

      const photosRes = await fetch(`${API_URL}/fotos_mascotas/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const photosData = await photosRes.json();

      const petsWithPhotos = petsData.map((pet) => {
        const photo = photosData.find((p) => p.mascota_id === pet.id);

        return {
          ...pet,
          foto: photo ? `${photo.url_foto}` : null,
          foto_id: photo ? photo.id : null,
        };
      });

      setPets(petsWithPhotos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleEdit = (pet) => {
    setSelectedPet(pet);

    setFormData({
      nombre: pet.nombre,
      especie: pet.especie,
      raza: pet.raza,
      edad: pet.edad.toString(),
      sexo: pet.sexo,
      descripcion: pet.descripcion,
    });

    setShowEditModal(true);
  };

  const handleDelete = (pet) => {
    setPetToDelete(pet);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!petToDelete) return;

    try {
      const res = await fetch(`${API_URL}/mascotas/${petToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        let errorMessage = "Error al eliminar";

        try {
          const data = await res.json();
          errorMessage = data.detail || errorMessage;
        } catch {}

        throw new Error(errorMessage);
      }

      if (petToDelete.foto_id) {
        await fetch(`${API_URL}/fotos_mascotas/${petToDelete.foto_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setConfirmOpen(false);
      setPetToDelete(null);
      fetchPets();
    } catch (error) {
      setConfirmOpen(false);

      setErrorModal({
        open: true,
        message: error.message,
      });
    }
  };

  const filteredPets = pets.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground text-lg">
        Cargando mascotas...
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mascotas del Refugio
          </h1>
          <p className="text-muted-foreground text-sm">
            Administra las mascotas registradas en tu refugio
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Mascota
        </Button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mascota..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredPets.length} mascota(s)
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => navigate("/historial-adopciones")}
      >
        Ver historial de adopciones
      </Button>

      <PetsTable
        pets={filteredPets}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <AddPetDialog
        open={showAddModal}
        setOpen={setShowAddModal}
        formData={formData}
        setFormData={setFormData}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        currentUser={user}
        token={token}
        resetForm={resetForm}
        fetchPets={fetchPets}
        setErrorModal={setErrorModal}
      />

      <EditPetDialog
        open={showEditModal}
        setOpen={setShowEditModal}
        formData={formData}
        setFormData={setFormData}
        selectedPet={selectedPet}
        token={token}
        resetForm={resetForm}
        fetchPets={fetchPets}
        currentUser={user}
        imageFile={null}
        setImageFile={() => {}}
        imagePreview={null}
        setImagePreview={() => {}}
        setErrorModal={setErrorModal}
      />

      {/* MODAL CONFIRM */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              ¿Eliminar mascota?
            </DialogTitle>
          </DialogHeader>

          <div className="text-center text-sm text-muted-foreground">
            Esta acción no se puede deshacer.
          </div>

          <DialogFooter className="flex justify-center gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ERROR */}
      <Dialog
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal({ ...errorModal, open })}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">
              🚫 Acción no permitida
            </DialogTitle>
          </DialogHeader>

          <div className="text-center text-sm">{errorModal.message}</div>

          <DialogFooter className="flex justify-center mt-4">
            <Button onClick={() => setErrorModal({ open: false, message: "" })}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShelterPets;
