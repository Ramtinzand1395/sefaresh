"use client";

import { cn } from "@/lib/cn";
import { normalizeNumericInput } from "@/lib/supplier-proposal";

type MoneyInputProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  invalid?: boolean;
  ariaDescribedBy?: string;
  className?: string;
};

export function MoneyInput({
  id,
  value,
  onChange,
  disabled,
  invalid,
  ariaDescribedBy,
  className,
}: MoneyInputProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        value={value ? new Intl.NumberFormat("en-US").format(value) : ""}
        onChange={(event) => onChange(normalizeNumericInput(event.target.value))}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "h-11 w-full rounded-control border bg-white pr-3 pl-14 text-left text-sm font-bold text-ink outline-none transition",
          "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-ink-muted",
          invalid ? "border-danger focus:border-danger" : "border-line focus:border-primary",
        )}
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-muted">
        تومان
      </span>
    </div>
  );
}
