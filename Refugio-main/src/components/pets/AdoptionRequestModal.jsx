import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import { API_URL } from "@/config/api";

const AdoptionRequestModal = ({ open, onClose, pet, onSuccess }) => {
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Protección: si no hay mascota, no renderiza nada para evitar errores
  if (!pet) return null;

  const mostrarNotificacion = (texto, tipo = "success") => {
    setNotificacion({ texto, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  };

  const enviarSolicitud = async () => {
    const token = localStorage.getItem("access_token");

    // VALIDACIÓN 1: Sesión activa
    if (!token) {
      mostrarNotificacion("Debes iniciar sesión para solicitar una adopción.", "error");
      return;
    }

    // VALIDACIÓN 2: Validación del comentario
    const textoLimpio = comentario.trim();
    if (textoLimpio.length > 0 && textoLimpio.length < 10) {
      mostrarNotificacion("Si dejas un mensaje, ¡cuéntale un poco más al refugio! (Mínimo 10 caracteres)", "error");
      return;
    }

    // Si el usuario no escribió nada, armamos un mensaje automático bonito
    const comentarioFinal = textoLimpio || `Me encantaría darle un hogar lleno de amor a ${pet.name || "esta mascota"}.`;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/solicitudes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mascota_id: pet.id,
          comentario: comentarioFinal,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Motivo del bloqueo:", errorData);
        throw new Error(errorData.detail || "Error desconocido del servidor");
      }

      // ÉXITO
      mostrarNotificacion("¡Solicitud enviada al refugio con éxito!", "success");
      setComentario("");
      
      // Le avisamos a la PetCard que actualice su botón en vivo
      if (onSuccess) onSuccess(); 
      
      // Retrasamos el cierre 1.5 segundos para que el usuario alcance a leer el Toast de éxito
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      mostrarNotificacion(`No se pudo enviar: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-orange-700">
             
              Solicitar Adopción
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <img
                // Fallback de imagen por si acaso
                src={pet.imageUrl || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=60"}
                alt={pet.name || "Mascota"}
                className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white mb-3"
              />
              <p className="text-center font-bold text-lg text-gray-800">
                Estás a un paso de cambiar la vida de <span className="text-orange-600">{pet.name || "esta mascota"}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Mensaje para el refugio (Opcional)</label>
              <Textarea
                placeholder="¿Por qué te gustaría adoptar? Cuéntales sobre ti y tu hogar..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="resize-none h-24 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-400 ml-1">
                Si lo dejas en blanco, enviaremos un mensaje automático por ti.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className="w-full sm:w-auto text-gray-600"
              >
                Cancelar
              </Button>
              <Button 
                onClick={enviarSolicitud} 
                disabled={loading}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                  </span>
                ) : (
                  "Enviar solicitud"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- NOTIFICACIÓN FLOTANTE (TOAST) --- 
          Nota: z-[100] asegura que se muestre por encima del fondo oscuro del Modal */}
      {notificacion && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 animate-in slide-in-from-bottom-5 z-[100] border-l-4 ${
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
          
          <button 
            onClick={() => setNotificacion(null)} 
            className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default AdoptionRequestModal;