import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ImageIcon } from "lucide-react";
import { Syringe, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PetsTable = ({ pets, handleEdit, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-md rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground uppercase text-xs tracking-wide">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Foto</th>
                <th className="p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Especie</th>
                <th className="p-4 text-left">Raza</th>
                <th className="p-4 text-left">Edad</th>
                <th className="p-4 text-left">Sexo</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pets.map((pet) => (
                <tr
                  key={pet.id}
                  className="border-b last:border-none hover:bg-muted/40 transition-colors"
                >
                  <td className="p-4 font-medium">{pet.id}</td>

                  {/* FOTO */}
                  <td className="p-4">
                    {pet.foto ? (
                      <img
                        src={pet.foto}
                        alt={pet.nombre}
                        onError={(e) => (e.target.style.display = "none")}
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-semibold">{pet.nombre}</td>
                  <td className="p-4">{pet.especie}</td>
                  <td className="p-4 text-muted-foreground">{pet.raza}</td>
                  <td className="p-4">{pet.edad}</td>
                  <td className="p-4">{pet.sexo}</td>

                  <td className="p-4">
                    <Badge
                      className="px-3 py-1 text-xs"
                      variant={
                        pet.estado_adopcion === "Disponible"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {pet.estado_adopcion}
                    </Badge>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* VER DETALLES */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-green-100 hover:text-green-600 transition"
                        onClick={() => navigate(`/mascotas/${pet.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* VACUNAS */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-purple-100 hover:text-purple-600 transition"
                        onClick={() => navigate(`/mascotas/${pet.id}/vacunas`)}
                      >
                        <Syringe className="w-4 h-4" />
                      </Button>

                      {/* EDITAR */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-blue-100 hover:text-blue-600 transition"
                        onClick={() => handleEdit(pet)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* ELIMINAR */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-100 hover:text-red-600 transition"
                        onClick={() => handleDelete(pet)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pets.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No hay mascotas registradas 
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PetsTable;
