import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Se agregó 'Heart' a las importaciones
import { Loader2, HandCoins, Calendar, Building2, TicketCheck, Heart } from "lucide-react";
import { API_URL } from "@/config/api";

const MisDonaciones = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const response = await fetch(`${API_URL}/donaciones/`);
        const data = await response.json();
        setDonaciones(data);
      } catch (error) {
        console.error("Error al obtener donaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonaciones();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-orange-500">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="font-medium animate-pulse">Cargando tu historial de ayuda...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-orange-100 p-3 rounded-2xl">
          <HandCoins className="h-8 w-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Mis Donaciones</h1>
          <p className="text-gray-500">Historial de apoyo a los refugios</p>
        </div>
      </div>

      {donaciones.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 rounded-[2rem]">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">Aún no hay donaciones</h3>
          <p className="text-gray-500 mt-2">Tu generosidad aparecerá aquí cuando apoyes a un refugio.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {donaciones.map((donacion) => (
            <Card key={donacion.id} className="p-6 rounded-[2rem] border-none shadow-soft hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-50 p-4 rounded-2xl hidden sm:block">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-800">
                    {donacion.refugio?.nombre || "Refugio Patitas"}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(donacion.fecha_donacion).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TicketCheck className="h-4 w-4 text-green-500" />
                      ID: {donacion.paypal_order_id?.substring(0, 12)}...
                    </span>
                  </div>
                  {donacion.mensaje && (
                    <p className="text-sm italic text-gray-400 mt-2">"{donacion.mensaje}"</p>
                  )}
                </div>
              </div>

              <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                <span className="text-2xl font-black text-orange-600">
                  ${parseFloat(donacion.monto).toFixed(2)} <span className="text-sm font-normal text-gray-400">MXN</span>
                </span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 rounded-full">
                  Completado
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisDonaciones;