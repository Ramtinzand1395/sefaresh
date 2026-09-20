import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  neutral: "bg-surface-subtle text-ink-muted",
  info: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  violet: "bg-violet-soft text-violet",
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-bold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
