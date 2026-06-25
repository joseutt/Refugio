import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const DeleteConfirmModal = ({ open, onClose, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>

          <h2 className="text-lg font-semibold">Eliminar evento</h2>
        </div>

        <p className="text-sm text-gray-600">
          Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este
          evento?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
