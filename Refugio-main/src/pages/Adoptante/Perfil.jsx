import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Loader2, CheckCircle, AlertCircle, X, User } from "lucide-react";

const PerfilAdoptante = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = (texto, tipo = "success") => {
    setNotificacion({ texto, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const resMe = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!resMe.ok) throw new Error("Sesión inválida");
      
      const userData = await resMe.json();
      setUser(userData);

      if (userData?.id) {
        const resProf = await fetch(`${API_URL}/adoptantes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (resProf.ok) {
          const todosLosAdoptantes = await resProf.json();
          const miPerfil = todosLosAdoptantes.find(
            (p) => p.usuario_id === userData.id || p.usuario?.id === userData.id
          );
          if (miPerfil) setProfileData(miPerfil);
        }
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
      mostrarNotificacion("Tu sesión expiró o hubo un error de conexión.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // VALIDACIÓN EN VIVO: Filtra lo que el usuario puede teclear
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Solo letras, espacios y acentos para nombres y apellidos
    if (["nombre", "apellido_paterno", "apellido_materno"].includes(name)) {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    }

    // Solo números para el teléfono y cortamos en 10 caracteres
    if (name === "telefono") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    // Para la dirección simplemente limitamos la longitud a 150 para que no sea infinita
    if (name === "direccion") {
      value = value.slice(0, 150);
    }

    setProfileData({ ...(profileData || {}), [name]: value });
  };

  const handleSave = async () => {
    const { nombre, apellido_paterno, apellido_materno, telefono, direccion } = profileData || {};
    
    // Limpiamos espacios para contar bien
    const n = nombre?.trim() || "";
    const ap = apellido_paterno?.trim() || "";
    const am = apellido_materno?.trim() || "";
    const tel = telefono?.trim() || "";
    const dir = direccion?.trim() || "";

    // VALIDACIÓN AL GUARDAR: Comprobamos los márgenes y reglas
    if (!n || !ap || !tel || !dir) {
      mostrarNotificacion("Nombre, Apellido Paterno, Teléfono y Dirección son obligatorios.", "error");
      return;
    }

    if (n.length < 2 || ap.length < 2) {
      mostrarNotificacion("El nombre y apellido deben tener al menos 2 letras.", "error");
      return;
    }

    if (am && am.length < 2) {
      mostrarNotificacion("Si ingresas apellido materno, debe tener al menos 2 letras.", "error");
      return;
    }

    if (tel.length !== 10) {
      mostrarNotificacion("El número de teléfono debe tener exactamente 10 dígitos.", "error");
      return;
    }

    if (dir.length < 10) {
      mostrarNotificacion("Por favor ingresa una dirección más detallada (mínimo 10 caracteres).", "error");
      return;
    }

    const token = localStorage.getItem("access_token");
    setIsSaving(true);
    
    try {
      const { id, usuario_id, usuario, created_at, updated_at, nombre_completo, ...payload } = profileData || {};
      if (!id) throw new Error("No hay un ID de perfil válido para actualizar.");

      // Enviamos la data limpia
      payload.nombre = n;
      payload.apellido_paterno = ap;
      payload.apellido_materno = am;
      payload.telefono = tel;
      payload.direccion = dir;

      const res = await fetch(`${API_URL}/adoptantes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al actualizar los datos en el servidor");
      
      mostrarNotificacion("¡Perfil actualizado con éxito!", "success");
      setIsEditing(false);
      fetchData(); 
    } catch (err) {
      console.error(err);
      mostrarNotificacion(err.message || "Ocurrió un error inesperado.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-orange-500 min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando tu información...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-3 rounded-full">
          <User className="h-6 w-6 text-orange-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Mi Perfil Adoptante
        </h1>
      </div>
      
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>

        <div className="mb-8 pb-6 border-b border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Email de cuenta
          </label>
          <p className="text-gray-800 font-medium mt-1">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Nombre", name: "nombre", max: 50 },
            { label: "Apellido Paterno", name: "apellido_paterno", max: 50 },
            { label: "Apellido Materno", name: "apellido_materno", max: 50 },
            { label: "Teléfono (10 dígitos)", name: "telefono", max: 10 },
            { label: "Dirección", name: "direccion", isFull: true, max: 150 },
          ].map((field) => (
            <div key={field.name} className={field.isFull ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {field.label} {field.name !== "apellido_materno" && <span className="text-orange-500">*</span>}
              </label>
              {isEditing ? (
                <input
                  name={field.name}
                  value={profileData?.[field.name] || ""}
                  onChange={handleChange}
                  maxLength={field.max}
                  placeholder={`Tu ${field.name.replace('_', ' ')}`}
                  className="w-full border-gray-300 border p-2.5 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-transparent">
                  <p className="text-gray-900 font-medium">
                    {profileData?.[field.name] || <span className="text-gray-400 italic">No especificado</span>}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4 pt-4">
          {isEditing ? (
            <div className="flex gap-3 w-full animate-in fade-in duration-200">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 py-2.5 rounded-xl font-semibold transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold shadow-md transition-colors flex justify-center items-center gap-2"
              >
                {isSaving ? <><Loader2 className="h-5 w-5 animate-spin" /> Guardando</> : "Guardar Cambios"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-700 hover:shadow-lg transition-all flex justify-center items-center gap-2"
            >
              Editar Información
            </button>
          )}
        </div>
      </div>

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

export default PerfilAdoptante;