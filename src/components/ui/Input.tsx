import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, type, className = "", label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-xs font-black uppercase tracking-widest text-slate-500">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent-2 transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            type={inputType}
            ref={ref}
            className={`w-full h-14 rounded-2xl border border-slate-200 bg-slate-50/50 text-primary font-bold placeholder:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all ${
              leftIcon ? "pl-12" : "pl-4"
            } ${rightIcon || isPassword ? "pr-12" : "pr-4"} ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent-2 transition-colors">
              {rightIcon}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
