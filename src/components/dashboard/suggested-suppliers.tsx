import { IconArrowLeft, IconPlus, IconStarFilled } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { suggestedSuppliers } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const markTones: Record<string, string> = {
  green: "bg-success-soft text-success",
  orange: "bg-accent-soft text-warning",
  blue: "bg-primary-soft text-primary",
};

export function SuggestedSuppliers() {
  return (
    <Card className="p-4 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-ink">تأمین‌کنندگان پیشنهادی</h2>
        <button type="button" className="flex items-center gap-1 text-[11px] font-black text-primary">مشاهده همه <IconArrowLeft size={14} /></button>
      </div>
      <div className="mt-2 divide-y divide-line">
        {suggestedSuppliers.map((supplier) => (
          <div key={supplier.name} className="flex items-center gap-3 py-3">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-sm font-black", markTones[supplier.color])}>{supplier.mark}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <strong className="truncate text-xs font-black text-ink">{supplier.name}</strong>
                <span className="flex items-center gap-0.5 text-[10px] text-ink-muted"><IconStarFilled className="text-accent" size={12} /> {supplier.score}</span>
              </div>
              <p className="mt-1 text-[10px] text-ink-muted">{supplier.reviews}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {supplier.tags.map((tag) => <span key={tag} className="rounded-md bg-surface-subtle px-1.5 py-1 text-[9px] text-ink-muted">{tag}</span>)}
              </div>
            </div>
            <button type="button" aria-label={`افزودن ${supplier.name}`} className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-white">
              <IconPlus size={17} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
