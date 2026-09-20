import { IconChevronDown, IconTrendingUp } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { dashboardSummary, spendingData } from "@/data/dashboard";

export function SpendingChart() {
  return (
    <Card className="flex min-h-[18rem] flex-col p-5 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-ink">روند هزینه خرید</h2>
          <p className="mt-1 text-2xl font-black text-ink">
            {dashboardSummary.spending}
            <span className="mr-1 text-xs font-bold text-ink-muted">تومان</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-success">
            <IconTrendingUp size={15} aria-hidden="true" />
            ۱۲٪ نسبت به دوره مشابه قبل
          </p>
        </div>
        <button type="button" className="flex min-h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-xs font-bold text-ink">
          ۶ ماه اخیر
          <IconChevronDown size={15} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 gap-3" aria-label="نمودار هزینه خرید شش ماه اخیر">
        <div className="flex flex-col justify-between pb-7 text-[10px] text-ink-muted" aria-hidden="true">
          <span>۲۰۰ م</span>
          <span>۱۵۰ م</span>
          <span>۱۰۰ م</span>
          <span>۵۰ م</span>
          <span>۰</span>
        </div>
        <div className="relative flex flex-1 items-end justify-around gap-2 border-b border-line pb-7 before:absolute before:inset-x-0 before:top-0 before:h-[calc(100%-1.75rem)] before:bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(25%-1px),var(--line)_25%)] before:opacity-75">
          {spendingData.map((item) => (
            <div key={item.month} className="relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              {item.active ? (
                <span className="mb-1 rounded-lg border border-line bg-white px-2 py-1 text-[10px] font-black text-ink shadow-card">
                  {item.value} م
                </span>
              ) : null}
              <div
                className={`w-full max-w-10 rounded-t-md ${item.active ? "bg-primary" : "bg-primary/20"}`}
                style={{ height: `${Math.max(20, item.value / 2)}%` }}
                title={`${item.month}: ${item.value} میلیون تومان`}
              />
              <span className={`absolute top-full mt-2 truncate text-[10px] ${item.active ? "font-black text-ink" : "text-ink-muted"}`}>
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
