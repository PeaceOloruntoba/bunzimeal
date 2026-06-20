import React from "react";
import { Spinner } from "../Spinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(31,68,76,0.2)]",
    secondary:
      "bg-white border border-slate-200 text-primary hover:bg-slate-50 hover:-translate-y-0.5 hover:border-slate-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(239,68,68,0.2)]",
    ghost:
      "bg-transparent text-primary hover:bg-slate-50 border border-transparent",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} px-6 py-3`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Spinner size={20} color={variant === "primary" ? "#fff" : "#1f444c"} /> : children}
    </button>
  );
}
