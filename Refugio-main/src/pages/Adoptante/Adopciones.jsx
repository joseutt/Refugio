import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Syringe, 
  Info, 
  Calendar, 
  MapPin, 
  Heart,
  ShieldCheck,
  CheckCircle2,
  Camera
} from "lucide-react";

const MisAdopciones = () => {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal y la galería
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    cargarAdopciones();
  }, []);

  const cargarAdopciones = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/auth"); return; }

    try {
      const resMe = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await resMe.json();

      const resProf = await fetch(`${API_URL}/adoptantes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let adoptanteId = null;
      if (resProf.ok) {
        const todosLosAdoptantes = await resProf.json();
        const miPerfil = todosLosAdoptantes.find(
          (p) => p.usuario_id === userData.id || p.usuario?.id === userData.id
        );
        if (miPerfil) adoptanteId = miPerfil.id;
      }

      if (adoptanteId) {
        const response = await fetch(`${API_URL}/mascotas/adoptante/${adoptanteId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setMascotas(data);
        }
      }
    } catch (error) {
      console.error("Error al cargar adopciones:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Adopciones</h1>
        <p className="text-gray-500 mt-2">Gestiona y visualiza el perfil de tus compañeros de vida.</p>
      </div>

      {mascotas.length === 0 ? (
        <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[2rem] p-20 text-center">
          <Heart className="h-16 w-16 text-orange-200 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-bold">Aún no tienes mascotas registradas.</p>
          <Button variant="link" onClick={() => navigate("/pets")} className="text-orange-600">Ir a buscar un amigo</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mascotas.map((pet) => {
            const imagenPrincipal = (pet.fotos && pet.fotos.length > 0) 
              ? pet.fotos[0].url_foto 
              : "https://via.placeholder.com/400x500?text=Sin+Foto";

            return (
              <Card key={pet.id} className="overflow-hidden border-none shadow-soft hover:shadow-2xl transition-all duration-500 rounded-[2rem] group bg-white">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={imagenPrincipal} alt={pet.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-sm">
                    {pet.especie}
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="font-black text-2xl text-gray-800 mb-1">{pet.nombre}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-500" /> Adoptado legalmente
                  </p>
                  
                  <Button 
                    onClick={() => { setSelectedPet(pet); setCurrentPhotoIndex(0); }}
                    className="w-full bg-gray-900 hover:bg-orange-600 text-white rounded-2xl py-6 font-bold transition-colors"
                  >
                    Ver Perfil Detallado
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* --- MODAL DE PERFIL COMPLETO --- */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => setSelectedPet(null)}
              className="absolute top-6 right-6 z-30 p-3 bg-white hover:bg-gray-100 text-gray-900 rounded-full shadow-xl transition-transform hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>

            {/* SECCIÓN IZQUIERDA: GALERÍA VISUAL */}
            <div className="w-full md:w-1/2 flex flex-col bg-gray-50 border-r border-gray-100">
              {/* Visor Principal */}
              <div className="flex-1 relative overflow-hidden bg-gray-200 aspect-square md:aspect-auto">
                {selectedPet.fotos && selectedPet.fotos.length > 0 ? (
                  <img 
                    src={selectedPet.fotos[currentPhotoIndex].url_foto} 
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" 
                    alt={selectedPet.nombre} 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Camera className="h-12 w-12 mb-2 opacity-20" />
                    <p>Sin fotografías</p>
                  </div>
                )}
              </div>

              {/* Galería de Miniaturas Inferior */}
              {selectedPet.fotos && selectedPet.fotos.length > 1 && (
                <div className="p-6 bg-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                    <Camera className="h-3 w-3" /> Galería de fotos
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {selectedPet.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                          index === currentPhotoIndex 
                            ? "border-orange-500 scale-105 shadow-lg" 
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img 
                          src={foto.url_foto} 
                          className="w-full h-full object-cover" 
                          alt={`Miniatura ${index + 1}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN DERECHA: INFORMACIÓN */}
            <div className="w-full md:w-1/2 p-8 md:p-14 overflow-y-auto bg-white">
              <div className="mb-8">
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase">
                    {selectedPet.especie}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase">
                    {selectedPet.estado_adopcion}
                  </Badge>
                </div>
                <h2 className="text-6xl font-black text-gray-900 leading-none">{selectedPet.nombre}</h2>
                <p className="text-gray-500 mt-6 text-xl leading-relaxed italic">
                  "{selectedPet.descripcion || 'Una mascota increíble esperando compartir momentos contigo.'}"
                </p>
              </div>

              {/* Dueño Legal */}
              <div className="mb-10 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-xl shadow-blue-100 flex items-center gap-5">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Propietario Registrado</p>
                  <p className="text-2xl font-bold">
                    {selectedPet.adoptante?.nombre_completo || "Usuario Identificado"}
                  </p>
                </div>
              </div>

              {/* Ficha Técnica */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Raza / Linaje</p>
                  <p className="font-bold text-gray-800 text-lg">{selectedPet.raza || 'Mixta'}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Edad Actual</p>
                  <p className="font-bold text-gray-800 text-lg">{selectedPet.edad} años</p>
                </div>
              </div>

              {/* Registro Médico (Vacunas) */}
              <div className="mb-10">
                <h4 className="font-black text-gray-900 mb-5 flex items-center gap-2 uppercase text-xs tracking-[0.2em]">
                  <Syringe className="h-4 w-4 text-orange-500" /> Registro de Vacunación
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.vacunas && selectedPet.vacunas.length > 0 ? (
                    selectedPet.vacunas.map((v, i) => (
                      <span key={i} className="bg-orange-50 text-orange-700 px-5 py-2.5 rounded-2xl text-xs font-black border border-orange-100 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> {v.nombre_vacuna || v}
                      </span>
                    ))
                  ) : (
                    <div className="bg-gray-50 w-full p-6 rounded-[2rem] border border-dashed border-gray-200 text-center">
                      <p className="text-gray-400 text-sm italic">No hay vacunas registradas en el sistema todavía.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Refugio */}
              {selectedPet.refugio && (
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">Refugio de procedencia</p>
                  <div className="flex items-center gap-5 bg-gray-50 p-5 rounded-3xl">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{selectedPet.refugio.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedPet.refugio.direccion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisAdopciones;