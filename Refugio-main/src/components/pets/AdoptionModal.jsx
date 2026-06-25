import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PawPrint } from "lucide-react";

const AdoptionModal = ({ open, onClose, pet, vaccines }) => {

  if (!pet) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            🎉 ¡Adopción Exitosa!
          </DialogTitle>
        </DialogHeader>

        {/* Imagen */}
        <div className="aspect-square overflow-hidden rounded-xl">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">

          <h3 className="text-xl font-bold text-center">
            {pet.name}
          </h3>

          <p className="text-center text-muted-foreground">
            {pet.breed} • {pet.age}
          </p>

          <p className="text-center text-sm">
            📍 {pet.location}
          </p>

        </div>

        {/* Vacunas */}
        <div>
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-sm">

  <p className="font-semibold mb-2">
    Recordatorio de adopción responsable
  </p>

  <ul className="space-y-1 text-muted-foreground">

    <li>• Proporciónale alimento y agua diariamente</li>
    <li>• Llévalo al veterinario regularmente</li>
    <li>• Dale amor, atención y ejercicio</li>
    <li>• Recuerda que es un compromiso de por vida</li>

  </ul>

</div>

          <h4 className="font-semibold mb-2">
            Vacunas
          </h4>

          {vaccines.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {vaccines.map((vac) => (
                <Badge key={vac.id}>
                  {vac.nombre_vacuna}
                </Badge>
              ))}
            </div>
            
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <PawPrint className="h-4 w-4 mr-2"/>
              Sin vacunas registradas
            </div>
          )}

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default AdoptionModal;