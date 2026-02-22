import React, { useEffect, useRef } from "react";
import { Check, AlertCircle } from "lucide-react";
import { TOAST_DURATION } from "../../config/constants";

export default function Toast({ message, type = "success", onClose }) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [message]);

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
