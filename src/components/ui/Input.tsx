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
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold tracking-tight text-slate-700">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
              {leftIcon}
            </div>
          )}
          <input
            type={inputType}
            ref={ref}
            className={`w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 ${
              leftIcon ? "pl-12" : "pl-4"
            } ${rightIcon || isPassword ? "pr-12" : "pr-4"} ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors duration-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
              {rightIcon}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
