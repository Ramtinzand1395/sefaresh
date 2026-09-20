import { IconAlertTriangleFilled, IconArrowLeft, IconChevronUp } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { attentionItems, dashboardSummary } from "@/data/dashboard";

export function ActionCenter() {
  return (
    <Card className="overflow-hidden p-3 shadow-none">
      <div className="rounded-xl border border-warning/20 bg-warning-soft p-4">
        <div className="flex items-center justify-between gap-3 text-warning">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-white/75">
              <IconAlertTriangleFilled size={18} aria-hidden="true" />
            </span>
            <h2 className="text-sm font-black">نیازمند اقدام</h2>
          </div>
          <IconChevronUp size={18} aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-black text-ink">{dashboardSummary.alert}</p>
        <p className="mt-1 text-xs leading-6 text-ink-muted">{dashboardSummary.alertDescription}</p>
        <button type="button" className="mt-3 min-h-10 rounded-lg border border-primary/30 bg-white px-4 text-xs font-black text-primary shadow-sm">
          بررسی تغییرات
        </button>
      </div>

      <div className="divide-y divide-line px-1">
        {attentionItems.map((item) => (
          <button key={item.title} type="button" className="flex w-full items-center gap-3 py-3 text-right transition hover:text-primary">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-subtle text-ink-muted">
              <IconArrowLeft size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-xs font-black text-ink">{item.title}</strong>
              <span className="mt-1 block truncate text-[11px] text-ink-muted">{item.description}</span>
            </span>
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">‹</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
