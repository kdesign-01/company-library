import React from "react";
import { PRIMARY_COLOR } from "../../config/constants";

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  size = "md",
  className = "",
}) {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "text-white hover:opacity-90 active:opacity-80",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const style = variant === "primary" ? { backgroundColor: PRIMARY_COLOR } : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
