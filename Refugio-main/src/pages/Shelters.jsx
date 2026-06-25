import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Phone,
  Heart,
  CheckCircle2,
  Loader2,
  HandCoins,
} from "lucide-react";
import { API_URL } from "@/config/api";

const Shelters = () => {
  const [shelters, setShelters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [donando, setDonando] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const paypalRenderedRef = useRef(false);
  const [modalFeedback, setModalFeedback] = useState({ open: false, title: "", message: "", success: false });

  const NO_IMAGE_URL = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop";

  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AWaKkdrsS4sRY7VDlONHHWPv9eLgydOh8VLY_0la50StdHuhmwA-UuQ6zIbxhG2OYc220UFxQSgyJppO&currency=MXN"; 
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await fetch(`${API_URL}/refugios/`);
        const data = await response.json();
        const formatted = data.map((s) => ({
          id: s.id,
          name: s.nombre,
          location: s.direccion || "Dirección no disponible",
          phone: s.telefono || "Sin teléfono",
          image: s.foto_url && s.foto_url !== "null" ? s.foto_url : NO_IMAGE_URL,
        }));
        setShelters(formatted);
      } catch (error) {
        console.error("Error cargando refugios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  const iniciarPagoDonacion = () => {
    if (!monto || parseFloat(monto) <= 0 || !nombre) {
      setModalFeedback({ open: true, title: "Datos incompletos", message: "Por favor ingresa tu nombre y monto.", success: false });
      return;
    }
    if (!window.paypal || !sdkReady || paypalRenderedRef.current) return;

    paypalRenderedRef.current = true;

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect' },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            description: `Donación para ${selectedShelter.name}`,
            amount: { 
              currency_code: "MXN", 
              value: parseFloat(monto).toFixed(2) 
            },
          }],
        });
      },
      onApprove: async (data, actions) => {
        setDonando(true);
        try {
          const details = await actions.order.capture();
          
          const res = await fetch(`${API_URL}/donaciones/`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}` 
            },
            body: JSON.stringify({
              refugio_id: selectedShelter.id,
              donante_nombre: nombre,
              mensaje: mensaje,
              monto: parseFloat(monto),
              fecha_donacion: new Date().toISOString(),
              paypal_order_id: details.id, 
            }),
          });

          if (res.ok) {
            setModalFeedback({ 
                open: true, 
                title: "¡Transacción Exitosa!", 
                message: `Muchas gracias ${nombre}, tu donativo de $${parseFloat(monto).toFixed(2)} MXN ha sido procesado correctamente para ${selectedShelter.name}.`,
                success: true 
            });
            cerrarYLimpiar();
          } else {
            throw new Error("Error al guardar en la base de datos");
          }
        } catch (error) {
          console.error("Error en el proceso:", error);
          setModalFeedback({ open: true, title: "Error", message: "El pago se hizo pero no se pudo registrar en el sistema.", success: false });
        } finally {
          setDonando(false);
        }
      },
      onCancel: () => { paypalRenderedRef.current = false; },
      onError: (err) => {
        console.error("PayPal Error:", err);
        paypalRenderedRef.current = false;
        const container = document.getElementById("paypal-button-container");
        if (container) container.innerHTML = "";
      }
    }).render("#paypal-button-container");
  };

  const cerrarYLimpiar = () => {
    setSelectedShelter(null);
    setMonto("");
    setNombre("");
    setMensaje("");
    paypalRenderedRef.current = false;
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";
  };

  const filteredShelters = shelters.filter((s) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-orange-50 to-white py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6 shadow-sm border border-orange-200">
              <Heart className="h-4 w-4 fill-orange-700" />
              <span className="text-sm font-bold">Apoya a los refugios locales</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 tracking-tight">
              Nuestros <span className="text-orange-600">Refugios</span>
            </h1>
            <p className="text-gray-500 mb-8 text-lg">Encuentra el lugar donde comenzará tu nueva historia.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-16 text-lg rounded-[2rem] border-none bg-white shadow-xl focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20 text-orange-500">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredShelters.map((shelter) => (
                  <Card key={shelter.id} className="overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 border-none shadow-soft group rounded-[2.5rem] bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <img src={shelter.image} alt={shelter.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-orange-600 border-none shadow-md backdrop-blur-md px-4 py-1.5 rounded-full font-bold">
                          <CheckCircle2 className="h-3 w-3 mr-1.5" /> Verificado
                        </Badge>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-black mb-3 text-gray-800">{shelter.name}</h3>
                      <div className="space-y-3 mb-8 text-gray-500 text-sm">
                        <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-orange-500" /> {shelter.location}</p>
                        <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-orange-500" /> {shelter.phone}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <Button onClick={() => setSelectedShelter(shelter)} variant="outline" className="rounded-2xl border-orange-100 text-orange-700 font-bold h-12">
                          Donar
                        </Button>
                        <Button className="rounded-2xl bg-gray-900 shadow-lg h-12 font-bold" asChild>
                          <Link to={`/pets?shelter=${shelter.id}`}>Mascotas</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!selectedShelter} onOpenChange={(open) => !open && cerrarYLimpiar()}>
        <DialogContent 
          className="max-w-md rounded-[2.5rem] p-8"
          onOpenAutoFocus={(e) => e.preventDefault()} 
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-gray-800 flex items-center gap-3">
              Donar a {selectedShelter?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-base mt-2">
              Ingresa tus datos para habilitar PayPal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-6">
            <Input type="number" placeholder="Monto (MXN)" value={monto} onChange={(e) => setMonto(e.target.value)} disabled={paypalRenderedRef.current} className="rounded-xl" />
            <Input placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={paypalRenderedRef.current} className="rounded-xl" />
            <Textarea placeholder="Mensaje (opcional)" value={mensaje} onChange={(e) => setMensaje(e.target.value)} disabled={paypalRenderedRef.current} className="rounded-xl" />

            {!paypalRenderedRef.current ? (
              <Button className="w-full h-14 rounded-2xl bg-orange-600 font-bold text-lg" onClick={iniciarPagoDonacion}>
                Confirmar y Pagar
              </Button>
            ) : (
              <Button variant="ghost" className="text-xs w-full" onClick={() => {
                paypalRenderedRef.current = false;
                const container = document.getElementById("paypal-button-container");
                if (container) container.innerHTML = "";
              }}>
                Haga clic aquí para corregir datos
              </Button>
            )}

            <div id="paypal-button-container" className="mt-4 min-h-[150px]"></div>
            {donando && <p className="text-center text-orange-600 animate-pulse font-bold">Procesando...</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* ALERT DE DONACIÓN DISEÑADO */}
      <Dialog open={modalFeedback.open} onOpenChange={(v) => setModalFeedback({...modalFeedback, open: v})}>
        <DialogContent className="text-center rounded-[2.5rem] max-w-sm p-8 border-none shadow-2xl">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${modalFeedback.success ? "bg-green-100" : "bg-red-100"}`}>
            {modalFeedback.success ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <div className="text-3xl font-bold text-red-600">!</div>
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-gray-900">
              {modalFeedback.title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 text-base mt-3 leading-relaxed">
              {modalFeedback.message}
            </DialogDescription>
          </DialogHeader>
          <Button 
            className="w-full mt-8 h-12 rounded-2xl bg-gray-900 hover:bg-orange-600 text-white font-bold transition-all" 
            onClick={() => setModalFeedback({...modalFeedback, open: false})}
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shelters;