import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Phone } from "lucide-react";

const ScanPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/qr_codes/scan/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.detail || "Error al obtener datos");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error ScanPet:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // REDIRECCIÓN SI ES DUEÑO
  useEffect(() => {
    if (data?.es_dueno) {
      navigate(`/mascotas/${id}`);
    }
  }, [data, id, navigate]);

  if (loading) {
    return <p className="p-6 text-center">Cargando información...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!data || !data.mascota) {
    return (
      <div className="p-6 text-center">
        <p>No se encontró información de la mascota</p>
      </div>
    );
  }

  // Evita parpadeo si redirige
  if (data.es_dueno) return null;

  const mascota = data.mascota;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-6 space-y-5">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{mascota.nombre}</h1>
          <p className="text-muted-foreground text-sm">
            {mascota.raza} • {mascota.edad} años
          </p>
        </div>

        {/* ALERTA */}
        <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-xl text-center">
          🐾 Esta mascota tiene dueño. Si la encontraste, por favor contacta.
        </div>

        {/* CONTACTO */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Contacto del dueño
          </p>

          {data.contacto_del_dueño ? (
            <a
              href={`tel:${data.contacto_del_dueño}`}
              className="flex items-center justify-center gap-2 text-lg font-semibold text-blue-600"
            >
              <Phone size={18} />
              {data.contacto_del_dueño}
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">No disponible</p>
          )}
        </div>

        {/* WHATSAPP */}
        {data.contacto_del_dueño && (
          <a
            href={`https://wa.me/52${data.contacto_del_dueño}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-500 text-white py-3 rounded-xl font-semibold hover:opacity-90"
          >
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default ScanPet;
