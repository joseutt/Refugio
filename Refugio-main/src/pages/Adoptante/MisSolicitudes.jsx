import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, Trash2, Loader2, AlertCircle, AlertTriangle, CheckCircle, X } from "lucide-react";
import { API_URL } from "@/config/api";

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para las notificaciones (Toast) y el Modal de Confirmación
  const [notificacion, setNotificacion] = useState(null);
  const [solicitudACancelar, setSolicitudACancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  const mostrarNotificacion = (texto, tipo = "success") => {
    setNotificacion({ texto, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    const token = localStorage.getItem("access_token");
    
    // VALIDACIÓN 1: Verificar que el usuario tenga sesión
    if (!token) {
      mostrarNotificacion("Tu sesión ha expirado o no estás logueado.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/solicitudes/mis-solicitudes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data);
      } else {
        throw new Error("No pudimos cargar tus solicitudes.");
      }
    } catch (error) {
      console.error("Error cargando solicitudes", error);
      mostrarNotificacion("Problema de conexión al cargar las solicitudes.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función que solo abre el modal
  const confirmarCancelacion = (solicitud) => {
    setSolicitudACancelar(solicitud);
  };

  // VALIDACIÓN 2: Lógica de cancelación con feedback de carga y cierre de modal
  const ejecutarCancelacion = async () => {
    if (!solicitudACancelar) return;
    
    const token = localStorage.getItem("access_token");
    setCancelando(true);

    try {
      const response = await fetch(`${API_URL}/solicitudes/${solicitudACancelar.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        mostrarNotificacion("Solicitud cancelada correctamente.", "success");
        setSolicitudes((prev) => prev.filter((sol) => sol.id !== solicitudACancelar.id));
        setSolicitudACancelar(null); // Cierra el modal
      } else {
        const errorData = await response.json();
        mostrarNotificacion(`No se pudo cancelar: ${errorData.detail || "Error desconocido"}`, "error");
      }
    } catch (error) {
      console.error("Error cancelando solicitud:", error);
      mostrarNotificacion("Hubo un error de conexión al cancelar.", "error");
    } finally {
      setCancelando(false);
    }
  };

  // VALIDACIÓN 3: Protección si status viene nulo
  const getStatusIcon = (status) => {
    const estadoLimpio = (status || "desconocido").toLowerCase();
    if (estadoLimpio === "pendiente") return <Clock className="h-5 w-5 text-yellow-500" />;
    if (estadoLimpio === "aceptada") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (estadoLimpio === "rechazada") return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    const estadoLimpio = (status || "desconocido").toLowerCase();
    if (estadoLimpio === "pendiente") return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    if (estadoLimpio === "aceptada") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"; 
    if (estadoLimpio === "rechazada") return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // VALIDACIÓN 4: Protección de parseo de fecha
  const formatFecha = (fechaString) => {
    if (!fechaString) return "Fecha desconocida";
    const date = new Date(fechaString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-indigo-500 min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando tus solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl relative">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">Mis Solicitudes de Adopción</h1>

      {solicitudes.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-20 text-center flex flex-col items-center justify-center">
          <Clock className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Aún no hay solicitudes</h3>
          <p className="text-gray-500">Cuando pidas adoptar una mascota, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {solicitudes.map((sol) => {
            const estadoSeguro = sol.estado || "desconocido";
            const esPendiente = estadoSeguro.toLowerCase() === "pendiente";

            return (
              <Card key={sol.id} className="p-5 flex flex-col sm:flex-row items-center justify-between hover:shadow-lg transition-all duration-200 border-gray-100 gap-6">
                
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  {sol.mascota?.foto_mascota?.url_foto ? (
                    <img 
                      src={sol.mascota.foto_mascota.url_foto} 
                      alt={sol.mascota.nombre || "Mascota"} 
                      className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-gray-100"
                    />
                  ) : (
                    <div className="bg-gray-100 p-5 rounded-full flex items-center justify-center">
                      {getStatusIcon(sol.estado)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-800">
                        {sol.mascota?.nombre ? sol.mascota.nombre : `Mascota ID: ${sol.mascota_id}`}
                      </h3>
                      {getStatusIcon(sol.estado)}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-500">
                      Enviada el: {formatFecha(sol.fecha_solicitud)}
                    </p>
                    {sol.comentario && (
                      <p className="text-gray-600 italic text-sm mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                        "{sol.comentario}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end sm:flex-col lg:flex-row">
                  <Badge className={`px-3 py-1 border ${getStatusColor(sol.estado)}`}>
                    {estadoSeguro.toUpperCase()}
                  </Badge>

                  {esPendiente && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => confirmarCancelacion(sol)}
                      className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none"
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN PERSONALIZADO --- */}
      {solicitudACancelar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center mx-auto mb-4 bg-red-100 h-12 w-12 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">¿Cancelar Solicitud?</h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              Estás a punto de cancelar tu solicitud para adoptar a <span className="font-bold text-gray-800">{solicitudACancelar.mascota?.nombre || "esta mascota"}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSolicitudACancelar(null)}
                className="w-full"
                disabled={cancelando}
              >
                Volver
              </Button>
              <Button 
                variant="destructive" 
                onClick={ejecutarCancelacion}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={cancelando}
              >
                {cancelando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, cancelar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {notificacion && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 animate-in slide-in-from-bottom-5 z-50 border-l-4 ${
          notificacion.tipo === "success" 
            ? "bg-white text-gray-800 border-green-500" 
            : "bg-white text-gray-800 border-red-500"
        }`}>
          {notificacion.tipo === "success" ? (
            <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
          )}
          <p className="font-medium text-sm">{notificacion.texto}</p>
          <button onClick={() => setNotificacion(null)} className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MisSolicitudes;