import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import VaccinesTable from "@/components/vaccines/VaccinesTable";
import AddVaccineDialog from "@/components/vaccines/AddVaccineDialog";

const PetVaccines = () => {
  const { id } = useParams();
  const token = localStorage.getItem("access_token");

  const [pet, setPet] = useState(null);
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingVacuna, setEditingVacuna] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [petRes, vacunasRes] = await Promise.all([
        fetch(`${API_URL}/mascotas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/vacunas/mascota/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const petData = await petRes.json();
      const vacunasData = await vacunasRes.json();

      setPet(petData);
      setVacunas(vacunasData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/vacunas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchData();
  };

  const sortedVacunas = [...vacunas].sort((a, b) => {
    const dateA = new Date(a.fecha_vacunacion);
    const dateB = new Date(b.fecha_vacunacion);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex gap-6 items-center">
        <img
          src={pet.fotos?.[0]?.url_foto || "https://via.placeholder.com/150"}
          className="w-48 h-48 object-cover rounded-2xl border"
        />

        <div>
          <h1 className="text-2xl font-bold">{pet.nombre}</h1>
          <p className="text-muted-foreground">
            {pet.especie} {pet.raza}
          </p>
          <p className="text-muted-foreground">
            {pet.edad} años {pet.sexo}
          </p>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva vacuna
        </Button>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-lg px-3 py-1"
        >
          <option value="desc">Más reciente</option>
          <option value="asc">Más antiguo</option>
        </select>
      </div>

      {/* TABLA */}
      <VaccinesTable
        vacunas={sortedVacunas}
        onEdit={(v) => {
          setEditingVacuna(v);
          setOpenDialog(true);
        }}
        onDelete={handleDelete}
      />

      {/* DIALOG */}
      <AddVaccineDialog
        open={openDialog}
        setOpen={setOpenDialog}
        petId={id}
        token={token}
        onSuccess={fetchData}
        editingVacuna={editingVacuna}
        setEditingVacuna={setEditingVacuna}
      />
    </div>
  );
};

export default PetVaccines;
