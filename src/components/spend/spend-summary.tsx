import {
  IconChartLine,
  IconClipboardText,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { spendSummary, type SpendSummaryItem, type SpendTone } from "@/data/spend";

const toneStyles: Record<SpendTone, string> = {
  blue: "bg-primary-soft text-primary",
  green: "bg-success-soft text-success",
  orange: "bg-accent-soft text-[#e87500]",
  violet: "bg-violet-soft text-violet",
};

const summaryIcons = {
  monthly: IconWallet,
  budget: IconWallet,
  average: IconClipboardText,
  savings: IconChartLine,
} as const;

function SummaryCard({ item }: { item: SpendSummaryItem }) {
  const Icon = summaryIcons[item.id];

  return (
    <Card className="flex min-h-[11.4rem] flex-col p-4 shadow-none sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-ink">{item.label}</p>
          <p className="mt-3 whitespace-nowrap text-[1.45rem] font-black tracking-tight text-ink md:text-[1.6rem]">
            {item.value}
          </p>
          <p className="mt-1 text-xs font-bold text-ink-muted">{item.suffix}</p>
        </div>
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${toneStyles[item.tone]}`}>
          <Icon size={29} stroke={1.8} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-auto pt-4">
        {typeof item.progress === "number" ? (
          <>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-[#e8eef8]"
              role="progressbar"
              aria-label="درصد مصرف بودجه ماهانه"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={item.progress}
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
            </div>
            <p className="mt-2 text-xs leading-6 text-ink-muted">{item.hint}</p>
          </>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            {item.trend ? (
              <span className="inline-flex items-center gap-1 text-base font-black text-success">
                <IconTrendingUp size={18} aria-hidden="true" />
                {item.trend}
              </span>
            ) : null}
            <span>{item.hint}</span>
          </p>
        )}
      </div>
    </Card>
  );
}

export function SpendSummary() {
  return (
    <section aria-label="خلاصه هزینه خرید" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {spendSummary.map((item) => (
        <SummaryCard key={item.id} item={item} />
      ))}
    </section>
  );
}
