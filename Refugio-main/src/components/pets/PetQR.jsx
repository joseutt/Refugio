import { useRef, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

const PetQR = ({ petId, petName }) => {
  const qrRef = useRef();
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    if (!petId) return;

    const url = `${window.location.origin}/scan/${petId}`;
    setQrData(url);
  }, [petId]);

  if (!qrData) return <p>Cargando QR...</p>;

  const handleDownload = () => {
    try {
      const svg = qrRef.current.querySelector("svg");
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = 300;
      canvas.width = size;
      canvas.height = size;

      const img = new Image();

      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });

      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `qr-${petName || "mascota"}.png`;
        link.click();

        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (err) {
      console.error("Error descargando QR:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 border rounded-xl bg-white shadow-sm">
      <p className="font-semibold text-sm text-center">
        QR de {petName || "Mascota"}
      </p>

      <div ref={qrRef} className="bg-white p-3 rounded-lg">
        <QRCode value={qrData} size={180} />
      </div>

      <Button onClick={handleDownload} variant="outline" className="w-full">
        Descargar QR (PNG)
      </Button>
    </div>
  );
};

export default PetQR;
