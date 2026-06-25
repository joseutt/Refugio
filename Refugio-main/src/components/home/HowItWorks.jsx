import { Search, Heart, ClipboardCheck, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    title: "Busca",
    description:
      "Explora mascotas disponibles cerca de ti usando filtros por tipo, edad, tamaño y más.",
    color: "bg-coral-light text-coral-dark",
  },
  {
    icon: Heart,
    title: "Conecta",
    description:
      "Completa el test de compatibilidad y encuentra tu match perfecto con recomendaciones personalizadas.",
    color: "bg-sage-light text-sage-dark",
  },
  {
    icon: ClipboardCheck,
    title: "Solicita",
    description:
      "Envía tu solicitud de adopción al refugio. Ellos revisarán tu perfil y te contactarán.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Home,
    title: "Adopta",
    description:
      "¡Dale la bienvenida a tu nuevo compañero! Te acompañamos con seguimiento post-adopción.",
    color: "bg-accent/20 text-accent-foreground",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-muted-foreground text-lg">
            Adoptar nunca fue tan fácil. En cuatro simples pasos puedes cambiar
            una vida para siempre.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              variant="elevated"
              className="p-6 text-center relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-card">
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6`}
              >
                <step.icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="font-bold font-display text-xl mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>

              {/* Connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-border" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
