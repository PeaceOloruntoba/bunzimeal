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
    "rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary to-[#163137] text-white hover:from-primary/90 hover:to-[#163137]/90 shadow-primary/10",
    secondary:
      "bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-slate-100",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-red-100",
    ghost:
      "bg-transparent text-primary hover:bg-slate-50 border border-transparent",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} p-2`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Spinner size={20} color={variant === "primary" ? "#fff" : "#1f444c"} /> : children}
    </button>
  );
}
