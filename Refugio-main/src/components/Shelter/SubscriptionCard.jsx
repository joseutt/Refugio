import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_URL } from "@/config/api";

const SubscriptionCard = () => {
  const token = localStorage.getItem("access_token");

  const [sub, setSub] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showModal = (title, message) => {
    setModal({ open: true, title, message });
  };

  const formatDate = (date) => {
    if (!date) return "Sin fecha";
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchData = async () => {
    try {
      const subRes = await fetch(`${API_URL}/suscripciones/mi-suscripcion`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (subRes.status !== 404 && subRes.ok) {
        const subData = await subRes.json();
        setSub(subData);
      }

      const plansRes = await fetch(`${API_URL}/planes/`);
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPlanName = () => {
    const plan = plans.find((p) => p.id === sub?.plan_id);
    return plan ? plan.nombre : "Desconocido";
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(`${API_URL}/suscripciones/cancelar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cancelar");

      setConfirmCancel(false);
      showModal("✅ Cancelada", "Tu suscripción fue cancelada");

      fetchData();
    } catch (err) {
      showModal("Error", err.message);
    }
  };

  if (loading) return <p>Cargando suscripción...</p>;

  return (
    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
        Suscripción
      </h3>

      {sub ? (
        <div className="space-y-3">
          <p>
            <strong>Plan:</strong> {getPlanName()}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={
                sub.estado === "Cancelada" ? "text-red-500" : "text-green-500"
              }
            >
              {sub.estado}
            </span>
          </p>

          <p>
            <strong>Vence el:</strong> {formatDate(sub.fecha_fin)}
          </p>

          <p>
            <strong>Auto renovación:</strong>{" "}
            {sub.auto_renovacion ? "Sí" : "No"}
          </p>

          {sub.estado !== "Cancelada" && (
            <Button
              variant="destructive"
              onClick={() => setConfirmCancel(true)}
            >
              Cancelar suscripción
            </Button>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No tienes una suscripción activa.
        </p>
      )}

      {/* Modal confirmación */}
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar suscripción?</DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">
            Seguirás teniendo acceso hasta la fecha de vencimiento.
          </p>

          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setConfirmCancel(false)}
            >
              Volver
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
            >
              Sí, cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal info */}
      <Dialog
        open={modal.open}
        onOpenChange={(v) => setModal({ ...modal, open: v })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal.title}</DialogTitle>
          </DialogHeader>
          <p>{modal.message}</p>
          <Button
            className="mt-4"
            onClick={() => setModal({ ...modal, open: false })}
          >
            Aceptar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionCard;
