import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600",
  secondary:
    "bg-white/10 hover:bg-white/15 text-white border border-white/10",
  ghost:
    "bg-transparent hover:bg-white/10 text-white border border-transparent",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white border border-rose-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        leftIcon
      )}

      <span className="whitespace-nowrap">{children}</span>

      {!loading && rightIcon}
    </button>
  );
}