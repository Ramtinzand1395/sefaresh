import type { ButtonHTMLAttributes } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-hover disabled:bg-slate-300",
  secondary:
    "border border-line bg-white text-primary hover:border-primary/30 hover:bg-primary-soft",
  ghost: "text-ink-muted hover:bg-primary-soft hover:text-primary",
  danger: "bg-danger text-white hover:bg-red-700 disabled:bg-slate-300",
} as const;

const sizes = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-control font-bold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:opacity-70",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <IconLoader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
