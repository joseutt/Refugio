import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  const paypalRenderedRef = useRef({});
  const [currentSub, setCurrentSub] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showModal = (title, message) => {
    setModal({ open: true, title, message });
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_URL}/planes/`);
        if (!res.ok) throw new Error("Error al obtener planes");

        const data = await res.json();

        setPlans(
          data.map((p) => ({
            id: p.id,
            name: p.nombre,
            description: p.descripcion || "",
            price: Number(p.precio) || 0,
            duration: p.duracion_dias || "Indefinida",
            benefits: p.beneficios || [],
          })),
        );
      } catch (err) {
        console.error(err);
        showModal("Error", "No se pudieron cargar los planes");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchSub = async () => {
      try {
        const res = await fetch(`${API_URL}/suscripciones/mi-suscripcion`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          setCurrentSub(null);
          return;
        }

        if (!res.ok) throw new Error("Error al obtener suscripción");

        const data = await res.json();
        setCurrentSub(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSub();
  }, [token]);

  const isCurrentPlan = (planId) => {
    return currentSub?.plan_id === planId;
  };

  const hasActiveSubscription = !!currentSub;

  useEffect(() => {
    if (window.paypal) return;

    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AWaKkdrsS4sRY7VDlONHHWPv9eLgydOh8VLY_0la50StdHuhmwA-UuQ6zIbxhG2OYc220UFxQSgyJppO&currency=MXN";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const handlePaypalPayment = (plan) => {
    if (!token) {
      showModal("Error", "Debes iniciar sesión para continuar");
      return;
    }

    if (isCurrentPlan(plan.id)) {
      showModal("Aviso", "Ya tienes este plan activo");
      return;
    }

    if (hasActiveSubscription) {
      showModal("Aviso", "Primero cancela tu suscripción actual");
      return;
    }

    const containerId = `paypal-button-container-${plan.id}`;
    const container = document.getElementById(containerId);

    if (paypalRenderedRef.current[plan.id]) {
      showModal("Aviso", "El botón ya está activo abajo 👇");
      return;
    }

    if (!window.paypal) {
      showModal("Error", "PayPal no cargó correctamente");
      return;
    }

    paypalRenderedRef.current[plan.id] = true;

    if (container) container.innerHTML = "";

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: plan.name,
                amount: {
                  value: plan.price.toString(),
                },
              },
            ],
          });
        },

        onApprove: async (data) => {
          try {
            const res = await fetch(`${API_URL}/suscripciones/suscribir`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                plan_id: plan.id,
                paypal_order_id: data.orderID,
              }),
            });

            if (!res.ok) {
              let msg = "Error al registrar suscripción";
              try {
                const err = await res.json();
                msg = err.detail || msg;
              } catch {}
              throw new Error(msg);
            }

            // Obtener usuario actualizado
            const userRes = await fetch(`${API_URL}/usuarios/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const updatedUser = await userRes.json();

            // Guardar en localStorage
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            // Actualizar estado local
            setCurrentSub({
              plan_id: plan.id,
            });

            // Feedback
            showModal("🎉 Éxito", "Suscripción activada correctamente");

            // Recargar UI
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } catch (error) {
            console.error(error);
            showModal("Error", error.message);
            paypalRenderedRef.current[plan.id] = false;
          }
        },

        onError: () => {
          showModal("Error", "Error con PayPal");
          paypalRenderedRef.current[plan.id] = false;
        },
      })
      .render(`#${containerId}`);
  };

  // UI
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes</h1>
          <p className="text-muted-foreground text-lg">
            Elige el mejor plan para tu refugio 🐾
          </p>
        </div>

        {loading ? (
          <p className="text-center">Cargando planes...</p>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`p-6 flex flex-col justify-between border-2 ${
                  index === 1 ? "border-primary scale-105 shadow-xl" : ""
                }`}
              >
                <div>
                  {isCurrentPlan(plan.id) && (
                    <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded mb-2">
                      Plan actual
                    </span>
                  )}

                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">
                      / {plan.duration} días
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="text-green-500 w-4 h-4" />
                        <span>
                          {b.clave}: {b.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.price > 0 ? (
                  <div>
                    <Button
                      className="w-full mb-3"
                      disabled={
                        paypalRenderedRef.current[plan.id] ||
                        isCurrentPlan(plan.id) ||
                        hasActiveSubscription
                      }
                      onClick={() => handlePaypalPayment(plan)}
                    >
                      {isCurrentPlan(plan.id)
                        ? "Plan actual ✅"
                        : hasActiveSubscription
                          ? "Ya tienes una suscripción"
                          : paypalRenderedRef.current[plan.id]
                            ? "PayPal activo ↓"
                            : "Cambiar a este plan"}
                    </Button>

                    <div id={`paypal-button-container-${plan.id}`}></div>
                  </div>
                ) : (
                  <Button className="w-full" variant="secondary">
                    Plan gratuito
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center">
            No hay planes disponibles en este momento.
          </p>
        )}
      </main>

      {/* MODAL */}
      <Dialog
        open={modal.open}
        onOpenChange={(v) => setModal({ ...modal, open: v })}
      >
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>{modal.title}</DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">{modal.message}</p>

          <Button
            className="mt-4 w-full"
            onClick={() => setModal({ ...modal, open: false })}
          >
            Aceptar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plans;
