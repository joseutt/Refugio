import { Link } from "react-router-dom";
import { Heart, PawPrint, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <PawPrint className="h-8 w-8 text-primary" />
                <Heart className="absolute -top-1 -right-1 h-3 w-3 text-coral fill-coral" />
              </div>
              <span className="text-xl font-bold font-display text-foreground">
                Patitas<span className="text-primary">Felices</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Conectamos refugios con familias amorosas. Cada mascota merece un
              hogar feliz.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links: Adoptar */}
          <div>
            <h4 className="font-bold font-display mb-4">Adoptar</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pets"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Ver mascotas
                </Link>
              </li>
             
              <li>
                <Link
                  to="/compatibility-test"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Test de compatibilidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Refugios */}
          <div>
            <h4 className="font-bold font-display mb-4">Refugios</h4>
            <ul className="space-y-2">
      
              <li>
                <Link
                  to="/auth?mode=shelter"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Registrar refugio
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Planes Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Ayuda */}
          <div>
            <h4 className="font-bold font-display mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  to="/donaciones"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                >
                  Hacer una donación 
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} PatitasFelices. Hecho con{" "}
            <Heart className="inline h-4 w-4 text-coral fill-coral" /> para las
            mascotas.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacidad
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;