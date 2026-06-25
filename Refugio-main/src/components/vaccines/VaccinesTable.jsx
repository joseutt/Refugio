import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const VaccinesTable = ({ vacunas, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Fecha dosis</th>
            <th className="p-3 text-left">Próxima dosis</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {vacunas.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-3">{v.nombre_vacuna}</td>
              <td className="p-3">{formatDate(v.fecha_vacunacion)}</td>
              <td className="p-3">{formatDate(v.proxima_dosis)}</td>

              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(v)}>
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(v.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vacunas.length === 0 && (
        <p className="text-center py-6 text-muted-foreground">
          No hay vacunas registradas
        </p>
      )}
    </div>
  );
};

export default VaccinesTable;
