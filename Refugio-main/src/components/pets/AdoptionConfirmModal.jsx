import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const AdoptionConfirmModal = ({ open, onClose, onConfirm, pet }) => {

  if (!pet) return null;

  return (

    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="max-w-md text-center">

        <DialogHeader>
          <DialogTitle>
            ¿Quieres enviar una solicitud?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-32 h-32 object-cover rounded-xl mx-auto"
          />

          <p className="text-lg font-semibold">
            {pet.name}
          </p>

          <p className="text-muted-foreground text-sm">
            El refugio revisará tu solicitud antes de aprobar la adopción.
          </p>

          <div className="flex gap-3 justify-center">

            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              onClick={onConfirm}
            >
              Enviar solicitud
            </Button>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

};

export default AdoptionConfirmModal;