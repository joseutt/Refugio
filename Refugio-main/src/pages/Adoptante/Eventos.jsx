import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { CalendarDays, Home, MapPin, Search, Clock, AlertCircle, Loader2 } from "lucide-react";

// --- FUNCIÓN AUXILIAR PARA VALIDAR FECHAS ---
const formatFecha = (fechaString) => {
  if (!fechaString) return "Fecha por confirmar";
  const date = new Date(fechaString);
  // Validamos si la fecha es inválida (NaN)
  if (isNaN(date.getTime())) return "Fecha inválida";
  
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const EventoCard = ({ evento }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [refugio, setRefugio] = useState(null);
  const [loadingRefugio, setLoadingRefugio] = useState(false);
  const [errorRefugio, setErrorRefugio] = useState("");

  const handleVerDetalles = async () => {
    if (mostrarDetalles) {
      setMostrarDetalles(false);
      return;
    }

    setMostrarDetalles(true);
    if (!refugio) {
      setLoadingRefugio(true);
      setErrorRefugio(""); // Limpiamos errores previos
      try {
        const response = await fetch(`${API_URL}/refugios/${evento.refugio_id}`);
        
        if (!response.ok) {
          throw new Error("No se pudo cargar la información del refugio.");
        }
        
        const data = await response.json();
        setRefugio(data);
      } catch (err) {
        console.error(err);
        setErrorRefugio("Refugio no disponible temporalmente.");
      } finally {
        setLoadingRefugio(false);
      }
    }
  };

  // Validaciones de entradas principales
  const imagenUrl = evento.imagen_url || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=60";
  const nombreEvento = evento.nombre || "Evento sin nombre";
  const tipoEvento = evento.descripcion || "General";

  return (
    <div className="bg-white shadow-lg rounded-xl flex flex-col transition-all hover:shadow-xl overflow-hidden border border-gray-100">
      
      <div className="relative h-48 w-full bg-gray-200">
        <img 
          src={imagenUrl} 
          alt={nombreEvento} 
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm bg-opacity-90">
          {tipoEvento}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 line-clamp-2">{nombreEvento}</h2>
        
        <div className="space-y-3 mb-6 flex-1">
          {/* Ubicación validada */}
          <div className="flex items-start text-gray-600 text-sm font-medium">
            <MapPin className="h-4 w-4 mr-2 text-orange-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{evento.ubicacion || "Ubicación por confirmar"}</span>
          </div>

          {/* Fecha Inicio validada */}
          <div className="flex items-center text-gray-600 text-sm font-medium">
            <CalendarDays className="h-4 w-4 mr-2 text-orange-500 shrink-0" />
            Inicio: {formatFecha(evento.fecha)}
          </div>

          {/* Fecha Fin validada */}
          {evento.fecha_fin && (
            <div className="flex items-center text-gray-600 text-sm font-medium">
              <Clock className="h-4 w-4 mr-2 text-orange-500 shrink-0" />
              Fin: {formatFecha(evento.fecha_fin)}
            </div>
          )}
        </div>

        {/* BOTÓN Y DETALLES DEL REFUGIO */}
        <button
          onClick={handleVerDetalles}
          disabled={!evento.refugio_id}
          className="w-full bg-orange-50 text-orange-600 hover:bg-orange-100 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!evento.refugio_id 
            ? "Sin refugio asignado" 
            : mostrarDetalles ? "Ocultar detalles" : "Ver detalles del refugio"}
        </button>

        {/* Notificaciones integradas y personalizadas para la tarjeta */}
        {mostrarDetalles && evento.refugio_id && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {loadingRefugio ? (
              <div className="flex items-center justify-center gap-2 text-orange-500 font-medium text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cargando información...</span>
              </div>
            ) : errorRefugio ? (
              <div className="flex items-center justify-center gap-2 text-red-500 font-medium text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errorRefugio}</span>
              </div>
            ) : refugio ? (
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-bold text-gray-900 flex items-center gap-2">
                   <Home className="h-4 w-4 text-orange-500 shrink-0" />
                   {refugio.nombre || "Nombre no disponible"}
                </p>
                <p className="flex items-start gap-2">
                   <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                   <span>{refugio.direccion || "Dirección no disponible"}</span>
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const categorias = ["Todos", "Campaña", "Vacunación", "Donación", "Adopción"];

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(`${API_URL}/eventos/`);
        if (!response.ok) {
          throw new Error("No pudimos conectar con el servidor para obtener los eventos.");
        }
        const data = await response.json();
        
        // Validación segura al ordenar (si no hay fecha, lo manda al final)
        data.sort((a, b) => {
          const dateA = a.fecha ? new Date(a.fecha).getTime() : Infinity;
          const dateB = b.fecha ? new Date(b.fecha).getTime() : Infinity;
          return dateA - dateB;
        });
        
        setEventos(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const eventosFiltrados = eventos.filter((evento) => {
    // Validamos que nombre y ubicación existan antes de buscar
    const nombreFiltro = evento.nombre || "";
    const ubicacionFiltro = evento.ubicacion || "";
    const textoBusqueda = `${nombreFiltro} ${ubicacionFiltro}`.toLowerCase();
    
    const coincideBusqueda = textoBusqueda.includes(searchTerm.toLowerCase());
    
    // Filtramos usando la categoría
    const categoriaEvento = evento.descripcion || "General";
    const coincideCategoria = 
      categoriaActiva === "Todos" || 
      categoriaEvento === categoriaActiva;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl min-h-[80vh] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight">Próximos Eventos</h1>
        <p className="text-gray-500">Descubre campañas, vacunaciones y más eventos cerca de ti.</p>
      </div>

      {/* --- NOTIFICACIONES PRINCIPALES PERSONALIZADAS (Estado de Carga y Error) --- */}
      {loading && (
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
          <p className="text-lg text-gray-600 font-medium">Preparando el calendario de eventos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm mb-8 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">Uy, algo salió mal</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800 underline"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      )}

      {/* --- SECCIÓN DE BÚSQUEDA Y RENDERIZADO (Solo si no hay carga ni error fatal) --- */}
      {!loading && !error && (
        <>
          <div className="mb-8 flex flex-col xl:flex-row xl:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="relative w-full xl:w-96 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all outline-none"
              />
            </div>

            <div className="hidden xl:block h-8 w-px bg-gray-200 mx-2"></div>

            <div className="flex flex-wrap items-center gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    categoriaActiva === cat
                      ? "bg-orange-500 text-white shadow-md transform scale-105"
                      : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {eventosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosFiltrados.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <CalendarDays className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No encontramos coincidencias</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                No hay eventos que coincidan con tu búsqueda actual en la categoría <span className="font-semibold">"{categoriaActiva}"</span>.
              </p>
              <button 
                onClick={() => { setSearchTerm(""); setCategoriaActiva("Todos"); }}
                className="mt-6 px-6 py-2 bg-orange-100 text-orange-600 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Eventos;