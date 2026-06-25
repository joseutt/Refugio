import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Search, PawPrint, ArrowRight } from "lucide-react";
import heroImage from "@/assets/gatos-y-perros.webp";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-warm">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 animate-float">
          <PawPrint className="h-24 w-24 text-primary rotate-12" />
        </div>
        <div
          className="absolute top-40 right-20 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <PawPrint className="h-16 w-16 text-sage rotate-[-20deg]" />
        </div>
        <div
          className="absolute bottom-32 left-1/4 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Heart className="h-20 w-20 text-coral" />
        </div>
        <div
          className="absolute bottom-20 right-1/3 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <PawPrint className="h-12 w-12 text-primary rotate-45" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-light text-coral-dark text-sm font-medium">
              <Heart className="h-4 w-4 fill-current" />
              +2,500 mascotas encontraron hogar este año
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              Encuentra a tu{" "}
              <span className="text-gradient">compañero perfecto</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Conectamos refugios con familias amorosas. Usa nuestro test de
              compatibilidad para encontrar la mascota ideal para tu estilo de
              vida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/pets">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Ver mascotas
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Test de compatibilidad
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold font-display text-primary">
                  150+
                </p>
                <p className="text-muted-foreground text-sm">
                  Refugios activos
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display text-primary">
                  3,000+
                </p>
                <p className="text-muted-foreground text-sm">
                  Mascotas disponibles
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display text-primary">
                  98%
                </p>
                <p className="text-muted-foreground text-sm">
                  Adopciones exitosas
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            className="relative animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Perro y gato felices esperando ser adoptados"
                className="w-full h-auto object-cover"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-card/90 backdrop-blur-md rounded-2xl shadow-card">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-lg">
                      🐕
                    </div>
                    <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-lg">
                      🐱
                    </div>
                  </div>
                  <div>
                    <p className="font-bold font-display text-foreground">
                      Ellos te están esperando
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Adopta, no compres ❤️
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 p-4 bg-card rounded-2xl shadow-card animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center">
                  <PawPrint className="h-4 w-4 text-sage-dark" />
                </div>
                <span className="font-bold text-foreground">
                  Match perfecto
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
