import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-control border border-line bg-white text-ink",
        "transition-colors hover:border-primary/30 hover:bg-primary-soft hover:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
