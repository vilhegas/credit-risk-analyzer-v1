import React from "react";

type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">

      {label && (
        <label className="block text-xs text-white/60 mb-1">
          {label}
        </label>
      )}

      <div className="relative">

        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-blue-500 transition
          
          ${leftIcon ? "pl-9" : ""}
          ${rightIcon ? "pr-9" : ""}
          ${error ? "border-red-500" : ""}
          ${className}
          
          `}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {rightIcon}
          </div>
        )}

      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-white/40 mt-1">
          {helperText}
        </p>
      )}

    </div>
  );
}