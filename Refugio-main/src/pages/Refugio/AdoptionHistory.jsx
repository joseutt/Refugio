import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdoptionHistory = () => {
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const token = localStorage.getItem("access_token");

  const fetchAdopciones = async () => {
    try {
      const res = await fetch(
        `${API_URL}/adopciones/refugio/${user.refugio_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      setAdopciones(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.refugio_id) {
      fetchAdopciones();
    }
  }, []);

  const filtered = adopciones.filter((a) =>
    a.mascota?.nombre?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Cargando historial...
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Historial de Adopciones</h1>
        <p className="text-muted-foreground text-sm">
          Consulta todas las mascotas adoptadas
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mascota..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="text-sm text-muted-foreground">
          {filtered.length} resultado(s)
        </span>
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Foto</th>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Especie</th>
              <th className="text-left p-3">Adoptante</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t hover:bg-muted/50 transition">
                <td className="p-3">
                  <img
                    src={
                      a.mascota?.foto_mascota?.url_foto ||
                      "https://via.placeholder.com/100?text=Sin+foto"
                    }
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                </td>

                <td className="p-3 font-medium">{a.mascota?.nombre}</td>

                <td className="p-3">{a.mascota?.especie}</td>

                <td className="p-3">{a.adoptante?.nombre_completo}</td>

                <td className="p-3">
                  {new Date(a.fecha_adopcion).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => navigate(`/mascotas/${a.mascota.id}`)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-6 text-muted-foreground">
            No se encontraron resultados
          </p>
        )}
      </div>
    </div>
  );
};

export default AdoptionHistory;
