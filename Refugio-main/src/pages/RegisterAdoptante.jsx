import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/config/api";

const RegisterAdoptante = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    direccion: "",
    telefono: ""
  });

  // MANEJADOR CON FILTRADO DE CARACTERES
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Solo letras y espacios para nombres
    if (["nombre", "apellido_paterno", "apellido_materno"].includes(name)) {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    }

    // Solo números para teléfono (máximo 10)
    if (name === "telefono") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación rápida antes de enviar
    if (formData.telefono.length !== 10) {
      setError("El teléfono debe tener 10 dígitos.");
      return;
    }

    const userId = localStorage.getItem("register_user_id");
    const email = localStorage.getItem("temp_email");
    const password = localStorage.getItem("temp_pass");

    try {
      const response = await fetch(`${API_URL}/adoptantes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, usuario_id: parseInt(userId) })
      });
      if (!response.ok) throw new Error("Error creando adoptante");

      const formBody = new URLSearchParams();
      formBody.append("username", email);
      formBody.append("password", password);

      const loginRes = await fetch(`${API_URL}/usuarios/login/access-token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody
      });
      const loginData = await loginRes.json();

      const userRes = await fetch(`${API_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${loginData.access_token}` }
      });
      const userData = await userRes.json();

      localStorage.setItem("access_token", loginData.access_token);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.removeItem("register_user_id");
      localStorage.removeItem("temp_email");
      localStorage.removeItem("temp_pass");

      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6 text-center">Registro de Adoptante</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input name="nombre" required value={formData.nombre} onChange={handleChange} />
              </div>
              <div>
                <Label>Apellido Paterno</Label>
                <Input name="apellido_paterno" required value={formData.apellido_paterno} onChange={handleChange} />
              </div>
              <div>
                <Label>Apellido Materno</Label>
                <Input name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input name="direccion" required value={formData.direccion} onChange={handleChange} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input name="telefono" required placeholder="10 dígitos" value={formData.telefono} onChange={handleChange} />
              </div>
              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Finalizar registro</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdoptante;