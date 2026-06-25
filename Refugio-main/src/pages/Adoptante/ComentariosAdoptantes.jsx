import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Search, 
  User, 
  Edit2, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2
} from "lucide-react";
import { API_URL } from "@/config/api";

const ComentariosAdoptantes = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  
  const [miAdoptanteId, setMiAdoptanteId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");

  // NUEVOS ESTADOS
  const [notificacion, setNotificacion] = useState(null);
  const [nombresAdoptantes, setNombresAdoptantes] = useState({}); // Diccionario para guardar ID -> Nombre

  // Función para mostrar las alertas personalizadas
  const mostrarNotificacion = (texto, tipo = "success") => {
    setNotificacion({ texto, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  };

  useEffect(() => {
    cargarComentarios();
    obtenerMiAdoptanteId();
  }, []);

  // EFECTO NUEVO: Cuando cambian los comentarios, busca los nombres de los adoptantes
  useEffect(() => {
    const obtenerNombres = async () => {
      const idsUnicos = [...new Set(comentarios.map(c => c.adoptante_id))];
      const nuevosNombres = { ...nombresAdoptantes };
      let huboCambios = false;

      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      for (const id of idsUnicos) {
        if (!nuevosNombres[id]) {
          try {
            const res = await fetch(`${API_URL}/adoptantes/${id}`, { headers });
            if (res.ok) {
              const data = await res.json();
              // Tomamos el nombre, asumiendo que tu modelo tiene "nombre" o "nombre_completo"
              nuevosNombres[id] = data.nombre_completo || data.nombre || `Adoptante #${id}`;
              huboCambios = true;
            }
          } catch (err) {
            console.error(`Error al obtener nombre del adoptante ${id}:`, err);
            nuevosNombres[id] = `Adoptante #${id}`; // Fallback si falla
            huboCambios = true;
          }
        }
      }

      if (huboCambios) {
        setNombresAdoptantes(nuevosNombres);
      }
    };

    if (comentarios.length > 0) {
      obtenerNombres();
    }
  }, [comentarios]);

  const obtenerMiAdoptanteId = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const resMe = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resMe.ok) return;
      const userData = await resMe.json();

      const resProf = await fetch(`${API_URL}/adoptantes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (resProf.ok) {
        const todosLosAdoptantes = await resProf.json();
        const miPerfil = todosLosAdoptantes.find(
          (p) => p.usuario_id === userData.id || p.usuario?.id === userData.id
        );
        if (miPerfil) setMiAdoptanteId(miPerfil.id);
      }
    } catch (error) {
      console.error("Error obteniendo mi ID de adoptante:", error);
    }
  };

  const cargarComentarios = async (termino = "") => {
    setLoading(true);
    try {
      const url = termino 
        ? `${API_URL}/comentarios_adoptantes/?contiene=${termino}`
        : `${API_URL}/comentarios_adoptantes/`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setComentarios(data);
      }
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      mostrarNotificacion("Error al conectar con el servidor para cargar las historias.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarComentarios(busqueda);
  };

  const enviarComentario = async () => {
    // VALIDACIÓN DE ENTRADAS
    if (!miAdoptanteId) {
      mostrarNotificacion("Debes completar tu perfil de adoptante antes de comentar.", "error");
      return;
    }

    const textoLimpio = nuevoComentario.trim();
    if (!textoLimpio) {
      mostrarNotificacion("El comentario no puede estar vacío.", "error");
      return;
    }

    if (textoLimpio.length < 10) {
      mostrarNotificacion("¡Cuéntanos un poco más! Tu comentario es muy corto.", "error");
      return;
    }

    const token = localStorage.getItem("access_token");
    setEnviando(true);
    
    try {
      const response = await fetch(`${API_URL}/comentarios_adoptantes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          adoptante_id: miAdoptanteId,
          comentario: textoLimpio,
          fecha_comentario: new Date().toISOString()
        })
      });

      if (response.ok) {
        setNuevoComentario("");
        cargarComentarios(); 
        mostrarNotificacion("¡Gracias por compartir tu experiencia!", "success");
      } else {
        const errorData = await response.json();
        mostrarNotificacion(`Error: ${errorData.detail || "No se pudo enviar el comentario"}`, "error");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      mostrarNotificacion("Hubo un problema de conexión. Intenta nuevamente.", "error");
    } finally {
      setEnviando(false);
    }
  };

  const iniciarEdicion = (comentario) => {
    setEditandoId(comentario.id);
    setTextoEditado(comentario.comentario);
  };

  const guardarEdicion = async (comentarioId) => {
    const textoValidado = textoEditado.trim();
    if (!textoValidado) {
      mostrarNotificacion("El comentario no puede quedar vacío.", "error");
      return;
    }

    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/comentarios_adoptantes/${comentarioId}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          comentario: textoValidado
        })
      });

      if (response.ok) {
        setEditandoId(null);
        cargarComentarios(); 
        mostrarNotificacion("Comentario actualizado con éxito.", "success");
      } else {
        mostrarNotificacion("Error al actualizar el comentario.", "error");
      }
    } catch (error) {
      console.error("Error al editar:", error);
      mostrarNotificacion("Problema de conexión al actualizar.", "error");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl relative">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-orange-700">Experiencias de Adopción</h1>
        <p className="text-gray-600 text-lg">Descubre lo que nuestra comunidad dice sobre sus nuevos mejores amigos.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="p-6 md:col-span-2 shadow-sm border border-gray-100">
          <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            Comparte tu historia
          </h3>
          <Textarea 
            placeholder={miAdoptanteId ? "¿Cómo ha sido tu experiencia adoptando con nosotros?" : "Inicia sesión y completa tu perfil para comentar."}
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            disabled={!miAdoptanteId}
            className="mb-4 resize-none h-24 focus:ring-orange-500 focus:border-orange-500"
          />
          <Button 
            onClick={enviarComentario} 
            disabled={!nuevoComentario.trim() || enviando || !miAdoptanteId}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            {enviando ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Publicando...
              </span>
            ) : "Publicar testimonio"}
          </Button>
        </Card>

        <Card className="p-6 shadow-sm bg-gray-50 flex flex-col justify-center border border-gray-100">
          <h3 className="font-bold mb-4 text-gray-800">Buscar experiencias</h3>
          <form onSubmit={handleBuscar} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ej. Cachorro, rápido..." 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Button type="submit" variant="secondary" size="icon" className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-orange-500">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Cargando historias de la comunidad...</p>
        </div>
      ) : comentarios.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium text-gray-700">No encontramos comentarios.</p>
          <p>¡Sé el primero en escribir uno!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comentarios.map((com) => {
            const esMiComentario = miAdoptanteId === com.adoptante_id;
            const estaEditando = editandoId === com.id;
            
            // Obtenemos el nombre del diccionario, si aún está cargando mostramos un texto por defecto
            const nombreAdoptante = nombresAdoptantes[com.adoptante_id] || "Cargando nombre...";

            return (
              <Card key={com.id} className={`p-6 transition-all ${esMiComentario ? 'border-indigo-300 bg-indigo-50/50 shadow-sm' : 'hover:shadow-md border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${esMiComentario ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'} p-2 rounded-full`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                        {nombreAdoptante}
                        {esMiComentario && <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-full tracking-wider">Tú</span>}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(com.fecha_comentario).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {esMiComentario && !estaEditando && (
                    <button onClick={() => iniciarEdicion(com)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {estaEditando ? (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <Textarea 
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="min-h-[100px] text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditandoId(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700" 
                        onClick={() => guardarEdicion(com.id)}
                      >
                        Guardar cambios
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{com.comentario}"
                  </p>
                )}
              </Card>
            );
          })}
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
          
          <button 
            onClick={() => setNotificacion(null)} 
            className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ComentariosAdoptantes;