import type { ReactNode } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

type SettingChoiceProps = {
  name: string;
  value: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  hideVisibleLabel?: boolean;
};

export function SettingChoice({
  name,
  value,
  label,
  selected,
  onSelect,
  children,
  className,
  contentClassName,
  hideVisibleLabel = false,
}: SettingChoiceProps) {
  return (
    <label className={cn("group block min-w-0 cursor-pointer", className)}>
      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
      />
      <span
        className={cn(
          "relative flex min-h-[5.5rem] items-center justify-center overflow-hidden rounded-xl border bg-surface-subtle p-2 transition",
          selected
            ? "border-primary shadow-[0_0_0_1px_rgb(36_87_214_/_0.18)]"
            : "border-line group-hover:border-primary/40",
          contentClassName,
        )}
      >
        {children}
        {selected ? (
          <IconCircleCheckFilled
            size={22}
            className="absolute right-2 top-2 text-primary drop-shadow-sm"
            aria-hidden="true"
          />
        ) : null}
      </span>
      <span className={cn("mt-2 items-center justify-center gap-2 text-sm font-bold text-ink", hideVisibleLabel ? "sr-only" : "flex")}>
        <span
          aria-hidden="true"
          className={cn(
            "grid size-5 place-items-center rounded-full border-2",
            selected ? "border-primary" : "border-line",
          )}
        >
          {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
        </span>
        {label}
      </span>
    </label>
  );
}
