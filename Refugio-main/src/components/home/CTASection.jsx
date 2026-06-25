import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, UserPlus, ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Adopters */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-8 md:p-10 rounded-3xl border border-primary/20 bg-card">
              <div className="w-14 h-14 rounded-2xl bg-coral-light flex items-center justify-center mb-6">
                <UserPlus className="h-7 w-7 text-coral-dark" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                ¿Quieres adoptar?
              </h3>

              <p className="text-muted-foreground mb-6">
                Crea tu cuenta gratis y accede a miles de mascotas que buscan un
                hogar amoroso. Envia tu solicitud y encuentra
                tu compañero perfecto.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Test de compatibilidad</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Match inmediato</span>
                </li>
              </ul>

              <Link to="/auth">
                <Button variant="hero" size="lg" className="group/btn">
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* For Shelters */}
          <div className="relative group">
            <div className="absolute inset-0 bg-sage rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-8 md:p-10 rounded-3xl border border-sage/20 bg-card">
              <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-sage-dark" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                ¿Tienes un refugio?
              </h3>

              <p className="text-muted-foreground mb-6">
                Registra tu refugio y publica tus mascotas para que miles de
                familias las conozcan. Gestiona solicitudes y encuentra los
                mejores hogares.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Sparkles className="h-4 w-4 text-sage" />
                  <span>Panel de gestión completo</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Sparkles className="h-4 w-4 text-sage" />
                  <span>Busca un Plan Premium adecuado a ti!</span>
                </li>
              
            
              </ul>

              <Link to="/auth?mode=shelter">
                <Button variant="sage" size="lg" className="group/btn">
                  Registrar refugio
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
