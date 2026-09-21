import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

type CartStepperProps = {
  step: 1 | 2 | 3;
};

const steps = [
  { id: 1, label: "سبد خرید", hint: "اقلام انتخاب‌شده" },
  { id: 2, label: "تأیید اطلاعات", hint: "تحویل و جزئیات" },
  { id: 3, label: "پرداخت", hint: "تکمیل سفارش" },
] as const;

export function CartStepper({ step }: CartStepperProps) {
  return (
    <ol className="mb-5 grid grid-cols-3 gap-2 rounded-card border border-line bg-white p-3 shadow-card sm:gap-4 sm:p-4" aria-label="مراحل ثبت سفارش">
      {steps.map((item, index) => {
        const complete = item.id < step;
        const active = item.id === step;

        return (
          <li key={item.id} className="relative flex min-w-0 items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-black sm:size-10 sm:text-sm",
                complete || active
                  ? "border-primary bg-primary text-white shadow-[0_5px_18px_rgb(36_87_214_/_0.22)]"
                  : "border-line bg-surface-subtle text-ink-muted",
              )}
              aria-current={active ? "step" : undefined}
            >
              {complete ? <IconCheck size={18} stroke={2.4} aria-hidden="true" /> : item.id.toLocaleString("fa-IR")}
            </span>
            <span className="min-w-0">
              <strong className={cn("block truncate text-[11px] font-black sm:text-sm", active ? "text-primary" : "text-ink")}>{item.label}</strong>
              <span className="mt-0.5 hidden truncate text-[11px] text-ink-muted md:block">{item.hint}</span>
            </span>
            {index < steps.length - 1 ? (
              <span className={cn("absolute top-1/2 right-[calc(100%-0.5rem)] hidden h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2 rounded-full sm:block", item.id < step ? "bg-primary" : "bg-line")} aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
