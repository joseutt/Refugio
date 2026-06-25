import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Heart,
  ClipboardCheck,
  Home,
  PawPrint,
  Shield,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Busca tu mascota ideal",
    description:
      "Explora nuestro catálogo de mascotas usando filtros por nombre. Cada perfil tiene fotos, historia y características.",
    color: "bg-coral-light text-coral-dark",
  },
  {
    icon: Sparkles,
    title: "2. Realiza el test de compatibilidad",
    description:
      "Responde algunas preguntas sobre tu estilo de vida, hogar y preferencias. Nuestro algoritmo te sugerirá las mascotas más compatibles contigo.",
    color: "bg-primary/10 text-primary",
  }
];

const benefits = [
  {
    icon: Shield,
    title: "Refugios verificados",
    description:
      "Todos los refugios pasan por un proceso de verificación para garantizar el bienestar animal.",
  }
];

const faqs = [
  {
    question: "¿Cuánto cuesta adoptar una mascota?",
    answer:
      "La adopción a través de nuestra plataforma es gratuita. Algunos refugios pueden solicitar una donación voluntaria para cubrir gastos de esterilización, vacunas y cuidados previos.",
  },
  {
    question: "¿Cuánto tiempo tarda el proceso de adopción?",
    answer:
      "Depende del refugio, pero generalmente toma entre 3 a 7 días hábiles desde que envías tu solicitud hasta la aprobación.",
  },
  {
    question: "¿Qué requisitos debo cumplir para adoptar?",
    answer:
      "Los requisitos varían por refugio, pero generalmente solicitan: ser mayor de edad, identificación oficial, comprobante de domicilio y en algunos casos una visita al hogar.",
  },
  {
    question: "¿Las mascotas vienen vacunadas y esterilizadas?",
    answer:
      "La mayoría de los refugios entregan a las mascotas vacunadas, desparasitadas y esterilizadas. Esta información aparece en cada perfil de mascota.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-warm py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-coral-light text-coral-dark px-4 py-2 rounded-full mb-6">
                <PawPrint className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Proceso simple y seguro
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                ¿Cómo funciona la <span className="text-primary">adopción</span>
                ?
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Te guiamos paso a paso para encontrar a tu compañero ideal. El
                proceso es simple, transparente y completamente digital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/compatibility-test">
                    Hacer test de compatibilidad
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pets">Ver mascotas disponibles</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                El camino hacia tu nueva mascota
              </h2>
              <p className="text-muted-foreground text-lg">
                Sigue estos pasos para darle un hogar lleno de amor a quien más
                lo necesita.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  className="p-6 animate-fade-in-up relative overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className="h-7 w-7" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold font-display text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                ¿Por qué adoptar con nosotros?
              </h2>
              <p className="text-muted-foreground text-lg">
                Te brindamos las herramientas para una adopción responsable y
                exitosa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold font-display text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Preguntas frecuentes
              </h2>
              <p className="text-muted-foreground text-lg">
                Resolvemos tus dudas sobre el proceso de adopción.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} variant="elevated" className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold font-display text-lg mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <Users className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              ¿Listo para encontrar a tu compañero?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Miles de mascotas esperan por un hogar. Haz el test de
              compatibilidad y descubre cuál es perfecta para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to="/compatibility-test">
                  Hacer test de compatibilidad
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-primary hover:bg-white/10"
                asChild
              >
                <Link to="/pets">Explorar mascotas</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorks;
