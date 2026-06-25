import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PawPrint,
  Home,
  Clock,
  Users,
  Heart,
  ArrowLeft,
  ArrowRight,
  Dog,
  Cat,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================
   Preguntas del test
========================= */
const questions = [
  {
    id: "pet_type",
    title: "¿Qué tipo de mascota buscas?",
    subtitle: "Puedes seleccionar una o ambas opciones",
    icon: PawPrint,
    multiSelect: true,
    options: [
      { id: "dog", label: "Perro", description: "Compañero leal y activo", icon: Dog, value: "dog" },
      { id: "cat", label: "Gato", description: "Independiente y cariñoso", icon: Cat, value: "cat" },
    ],
  },
  {
    id: "living_space",
    title: "¿Cómo es tu vivienda?",
    subtitle: "Esto nos ayuda a recomendarte mascotas adecuadas a tu espacio",
    icon: Home,
    options: [
      { id: "apartment_small", label: "Departamento pequeño", description: "Menos de 60 m²", value: "apartment_small" },
      { id: "apartment_large", label: "Departamento grande", description: "Más de 60 m²", value: "apartment_large" },
      { id: "house_no_yard", label: "Casa sin jardín", description: "Espacio interior amplio", value: "house_no_yard" },
      { id: "house_yard", label: "Casa con jardín", description: "Espacio exterior disponible", value: "house_yard" },
    ],
  },
  {
    id: "time_available",
    title: "¿Cuánto tiempo puedes dedicar al día?",
    subtitle: "Considera paseos, juegos y atención general",
    icon: Clock,
    options: [
      { id: "time_low", label: "1 a 2 horas", description: "Horario ocupado pero constante", value: "low" },
      { id: "time_medium", label: "2 a 4 horas", description: "Tiempo moderado disponible", value: "medium" },
      { id: "time_high", label: "Más de 4 horas", description: "Mucho tiempo para compartir", value: "high" },
      { id: "time_home", label: "Trabajo desde casa", description: "Casi siempre disponible", value: "home" },
    ],
  },
  {
    id: "household",
    title: "¿Quiénes viven en tu hogar?",
    subtitle: "Selecciona todas las opciones que apliquen",
    icon: Users,
    multiSelect: true,
    options: [
      { id: "alone", label: "Vivo solo/a", description: "Sin otras personas", value: "alone" },
      { id: "partner", label: "Con pareja", description: "Hogar de adultos", value: "partner" },
      { id: "children_young", label: "Niños pequeños", description: "Menores de 10 años", value: "children_young" },
      { id: "children_older", label: "Niños mayores", description: "10 años o más", value: "children_older" },
    ],
  },
  {
    id: "other_pets",
    title: "¿Tienes otras mascotas?",
    subtitle: "Importante para la socialización",
    icon: Heart,
    multiSelect: true,
    options: [
      { id: "no_pets", label: "No tengo mascotas", description: "Será mi primera mascota", value: "none" },
      { id: "has_dog", label: "Tengo perro(s)", description: "Ya convivo con perros", value: "dog" },
      { id: "has_cat", label: "Tengo gato(s)", description: "Ya convivo con gatos", value: "cat" },
      { id: "has_other", label: "Otras mascotas", description: "Aves, roedores, etc.", value: "other" },
    ],
  },
  {
    id: "activity_level",
    title: "¿Cuál es tu nivel de actividad?",
    subtitle: "Buscamos una mascota compatible con tu ritmo",
    icon: Sparkles,
    options: [
      { id: "sedentary", label: "Tranquilo", description: "Prefiero actividades relajadas", value: "sedentary" },
      { id: "moderate", label: "Moderado", description: "Caminatas ocasionales y juegos", value: "moderate" },
      { id: "active", label: "Activo", description: "Ejercicio regular y aire libre", value: "active" },
      { id: "very_active", label: "Muy activo", description: "Deportes, correr, senderismo", value: "very_active" },
    ],
  },
];

/* =========================
   Componente principal
========================= */
const CompatibilityTest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value) => {
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];

    if (currentQuestion.multiSelect) {
      if (currentAnswers.includes(value)) {
        setAnswers({ ...answers, [questionId]: currentAnswers.filter((v) => v !== value) });
      } else {
        setAnswers({ ...answers, [questionId]: [...currentAnswers, value] });
      }
    } else {
      setAnswers({ ...answers, [questionId]: [value] });
    }
  };

  const isSelected = (value) => (answers[currentQuestion.id] || []).includes(value);
  const canProceed = () => (answers[currentQuestion.id] || []).length > 0;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Función para armar la URL en base a lo que contestó
  const generarUrlRecomendaciones = () => {
    const params = new URLSearchParams();
    
    // Filtro principal: ¿Perro o Gato?
    const petType = answers.pet_type || [];
    if (petType.includes("dog") && !petType.includes("cat")) {
      params.append("type", "Perros");
    } else if (petType.includes("cat") && !petType.includes("dog")) {
      params.append("type", "Gatos");
    }
    // Si eligió ambos, no ponemos el filtro 'type' para que muestre "Todos"
    
    return `/pets?${params.toString()}`;
  };

  /* =========================
     Pantalla final
  ========================= */
  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gradient-warm">
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>

              <h1 className="text-3xl font-bold mb-4">¡Test completado!</h1>

              <p className="text-muted-foreground text-lg mb-8">
                Hemos analizado tus respuestas y tenemos recomendaciones
                personalizadas para ti.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  {/* Aquí conectamos con la función que arma la URL */}
                  <Link to={generarUrlRecomendaciones()}>
                    Ver mascotas recomendadas
                    <Sparkles className="h-5 w-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentStep(0);
                    setAnswers({});
                  }}
                >
                  Repetir test
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  /* =========================
     Test paso a paso
  ========================= */
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-warm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between mb-2 text-sm">
              <span>
                Pregunta {currentStep + 1} de {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <currentQuestion.icon className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {currentQuestion.title}
              </h2>
              <p className="text-muted-foreground">
                {currentQuestion.subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition",
                    isSelected(option.value)
                      ? "border-primary bg-primary/5"
                      : "border-border",
                  )}
                >
                  <div className="flex gap-3">
                    {option.icon && (
                      <option.icon className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <span className="font-semibold">{option.label}</span>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <Button onClick={handleNext} disabled={!canProceed()}>
                {currentStep === questions.length - 1
                  ? "Finalizar"
                  : "Siguiente"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>

          <div className="text-center mt-6">
            <Link
              to="/pets"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Saltar test y explorar todas las mascotas
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompatibilityTest;
