import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, User, Building2, Loader2 } from "lucide-react";
import { API_URL } from "../config/api";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el botón
  const [error, setError] = useState("");
  const [role, setRole] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Filtrado de entradas en vivo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanValue = value;

    if (name === "email") {
      // No permitir espacios en el email
      cleanValue = value.replace(/\s/g, "");
    }

    setFormData({ ...formData, [name]: cleanValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones básicas antes de disparar el fetch
    const emailTrimmed = formData.email.trim();
    const passwordTrimmed = formData.password.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      setError("Por favor rellena todos los campos.");
      return;
    }

    if (!isLogin && passwordTrimmed.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const formBody = new URLSearchParams();
        formBody.append("username", emailTrimmed);
        formBody.append("password", formData.password); // Aquí mandamos la pass original

        const response = await fetch(`${API_URL}/usuarios/login/access-token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Credenciales incorrectas");

        localStorage.setItem("access_token", data.access_token);

        const userResponse = await fetch(`${API_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        let userData = await userResponse.json();

        // Mapeo seguro del rol
        const rolMap = {
          "Admin": { id: 1, nombre: "Admin" },
          "Refugio": { id: 2, nombre: "Refugio" },
          "Adoptante": { id: 3, nombre: "Adoptante" }
        };
        
        const nombreRol = typeof userData.rol === 'string' ? userData.rol : userData.rol?.nombre;
        userData.rol = rolMap[nombreRol] || { id: 3, nombre: "Adoptante" }; // Adoptante por defecto si falla

        localStorage.setItem("currentUser", JSON.stringify(userData));
        navigate("/");
      } else {
        if (!role) throw new Error("Selecciona si eres un Adoptante o un Refugio");

        const response = await fetch(`${API_URL}/usuarios/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailTrimmed,
            password: formData.password,
            activo: true,
            rol_id: role,
            created_at: new Date().toISOString(),
          }),
        });

        const userData = await response.json();
        if (!response.ok) throw new Error(userData.detail || "Este correo ya está registrado");

        // Guardamos datos temporales para el siguiente paso del registro
        localStorage.setItem("register_user_id", userData.id);
        localStorage.setItem("temp_email", emailTrimmed);
        localStorage.setItem("temp_pass", formData.password);

        if (role === 3) navigate("/register/adoptante");
        if (role === 2) navigate("/register/refugio");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="p-8 shadow-card border-orange-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isLogin ? "¡Hola de nuevo!" : "Crea tu cuenta"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="focus:ring-orange-500"
                />
              </div>
              <div>
                <Label>Contraseña</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-3 pt-2">
                  <Label className="text-center block text-gray-600">¿Qué quieres hacer?</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={role === 3 ? "default" : "outline"}
                      className={cn("w-full transition-all", role === 3 && "bg-orange-600")}
                      onClick={() => setRole(3)}
                    >
                      <User className="h-4 w-4 mr-2" /> Adoptar
                    </Button>
                    <Button
                      type="button"
                      variant={role === 2 ? "default" : "outline"}
                      className={cn("w-full transition-all", role === 2 && "bg-orange-600")}
                      onClick={() => setRole(2)}
                    >
                      <Building2 className="h-4 w-4 mr-2" /> Refugio
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-pulse">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-11" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? "Iniciar sesión" : "Siguiente paso")}
              </Button>
            </form>

            <div className="mt-6 text-center border-t pt-6 border-gray-100">
              <button
                type="button"
                className="text-orange-600 font-medium hover:underline text-sm"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
              >
                {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Pequeño helper para clases si no tienes instalado clsx
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Auth;