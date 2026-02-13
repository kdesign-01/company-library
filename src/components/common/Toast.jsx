import React, { useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${types[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50`}
    >
      {type === "success" && <Check size={20} />}
      {type === "error" && <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
}
