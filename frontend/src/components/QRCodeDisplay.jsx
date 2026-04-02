import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function QRCodeDisplay({ restaurantId }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/swaad/dishes/restaurant/${restaurantId}/qr`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      setQrUrl(url);
    } catch {
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `menu-${restaurantId}.png`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col items-center gap-4">
      <h3 className="font-bold text-lg">Menu QR Code</h3>
      {qrUrl && <img src={qrUrl} alt="Menu QR" className="w-44 h-44 sm:w-48 sm:h-48 object-contain" />}
      <div className="flex gap-3">
        <button
          onClick={generate}
          disabled={loading}
          className="bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Generating..." : qrUrl ? "Regenerate" : "Generate QR"}
        </button>
        {qrUrl && (
          <button
            onClick={download}
            className="border border-gray-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
}
