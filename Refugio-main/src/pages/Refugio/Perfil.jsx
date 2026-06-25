import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Phone, Building } from "lucide-react";
import { toast } from "sonner";
import SubscriptionCard from "@/components/Shelter/SubscriptionCard";

const PerfilRefugio = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/auth");

    try {
      setLoading(true);
      // 1. Obtener datos del usuario logueado
      const resMe = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resMe.ok) throw new Error("Sesión expirada");
      const userData = await resMe.json();
      setUser(userData);

      // 2. Obtener datos específicos del refugio
      if (userData.refugio_id) {
        const resProf = await fetch(
          `${API_URL}/refugios/${userData.refugio_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!resProf.ok) throw new Error("No se pudo obtener el perfil");
        const profData = await resProf.json();
        setProfileData(profData);
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // VALIDACIÓN TELÉFONO
    if (name === "telefono") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 10) {
        setProfileData((prev) => ({ ...prev, telefono: onlyNumbers }));
      }

      return;
    }

    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    setIsSaving(true);

    // Validación teléfono
    if (profileData.telefono && profileData.telefono.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos");
      setIsSaving(false);
      return;
    }

    try {
      const profileId = profileData.id;
      const formData = new FormData();

      if (profileData.nombre) formData.append("nombre", profileData.nombre);

      if (profileData.direccion)
        formData.append("direccion", profileData.direccion);

      if (profileData.telefono)
        formData.append("telefono", profileData.telefono);

      if (selectedFile) {
        formData.append("foto", selectedFile);
      }

      const res = await fetch(`${API_URL}/refugios/${profileId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al actualizar el perfil");
      }

      const updatedData = await res.json();

      setProfileData(updatedData);

      const currentStoredUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentStoredUser) {
        currentStoredUser.nombre = updatedData.nombre;
        localStorage.setItem("currentUser", JSON.stringify(currentStoredUser));
        window.dispatchEvent(new Event("storage"));
      }

      toast.success("¡Perfil actualizado correctamente!");
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150?text=Sin+Foto";
    return `${path}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Cargando perfil...</span>
      </div>
    );
  }

  if (!profileData)
    return <div className="p-20 text-center">No se encontró el perfil.</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
        {/* Header Visual */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Panel de Control del Refugio
          </h1>
        </div>

        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end gap-6">
            {/* Foto de Perfil / Logo */}
            <div className="relative group mx-auto md:mx-0">
              <div className="w-40 h-40 rounded-2xl border-8 border-card bg-muted overflow-hidden shadow-lg">
                <img
                  src={previewUrl || getImageUrl(profileData.foto_url)}
                  className="w-full h-full object-cover"
                  alt="Logo del refugio"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <Camera className="h-8 w-8 mb-1" />
                  <span className="text-xs font-bold uppercase">Cambiar</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left pb-2">
              <h2 className="text-3xl font-extrabold text-foreground">
                {profileData.nombre}
              </h2>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                <Building className="h-4 w-4" /> Refugio Verificado
              </p>
            </div>

            <div className="flex gap-2 mx-auto md:mx-0">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl px-6"
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 rounded-xl px-6"
                  >
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewUrl(null);
                    }}
                    className="rounded-xl"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Sección Izquierda: Información de Contacto */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                  Información de Contacto
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Nombre Público
                    </label>
                    {isEditing ? (
                      <input
                        name="nombre"
                        value={profileData.nombre || ""}
                        onChange={handleChange}
                        className="w-full bg-background border border-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        {profileData.nombre}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        name="telefono"
                        value={profileData.telefono || ""}
                        onChange={handleChange}
                        className="w-full bg-background border border-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Phone className="h-4 w-4 text-primary" />{" "}
                        {profileData.telefono || "Sin asignar"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Correo Electrónico (Solo lectura)
                    </label>
                    <div className="text-foreground font-medium opacity-70">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección Derecha: Ubicación */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                  Ubicación del Refugio
                </h3>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Dirección Física
                  </label>
                  {isEditing ? (
                    <textarea
                      name="direccion"
                      value={profileData.direccion || ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  ) : (
                    <div className="flex items-start gap-2 text-foreground font-medium">
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <span>
                        {profileData.direccion ||
                          "No se ha especificado una dirección física."}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <SubscriptionCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilRefugio;
