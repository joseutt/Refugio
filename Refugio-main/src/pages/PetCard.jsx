import { useState } from "react";
import { PawPrint } from "lucide-react";

const PetCard = ({ imageUrl, name, breed, age, location }) => {

  const [imgError, setImgError] = useState(false);

  return (

    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">

      <div className="aspect-square bg-muted flex items-center justify-center">

        {imgError || !imageUrl ? (

          <div className="flex flex-col items-center text-muted-foreground">
            <PawPrint className="h-12 w-12 opacity-20" />
            <span className="text-xs mt-2 italic">Sin foto</span>
          </div>

        ) : (

          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
            onError={() => setImgError(true)}
          />

        )}

      </div>

      <div className="p-4">

        <h3 className="font-bold text-lg">
          {name}
        </h3>

        <p className="text-sm text-muted-foreground">
          {breed} • {age}
        </p>

        <p className="text-xs text-primary mt-2">
          {location}
        </p>

      </div>

    </div>

  );

};

export default PetCard;