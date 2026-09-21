import { IconChevronDown } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { spendSeries, type SpendPeriod } from "@/data/spend";

type SpendingTrendProps = {
  period: SpendPeriod;
  onPeriodChange: (period: SpendPeriod) => void;
};

const periodLabels: Record<SpendPeriod, string> = {
  "three-months": "۳ ماه اخیر",
  "six-months": "۶ ماه اخیر",
  year: "یک سال اخیر",
};

export function SpendingTrend({ period, onPeriodChange }: SpendingTrendProps) {
  const data = spendSeries[period];
  const maxValue = 200;

  return (
    <Card className="min-h-[20rem] p-4 shadow-none sm:p-5 lg:min-h-[21.5rem]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-black text-ink md:text-lg">روند هزینه خرید</h2>
        <label className="relative block shrink-0">
          <span className="sr-only">بازه زمانی نمودار هزینه خرید</span>
          <select
            value={period}
            onChange={(event) => onPeriodChange(event.target.value as SpendPeriod)}
            className="h-10 appearance-none rounded-lg border border-line bg-white pr-3 pl-9 text-xs font-bold text-ink focus:border-primary focus:outline-none"
          >
            {Object.entries(periodLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink" size={16} aria-hidden="true" />
        </label>
      </div>

      <div className="mt-6 flex h-[14.6rem] gap-3" aria-label={`نمودار هزینه خرید در ${periodLabels[period]}`}>
        <div className="flex w-9 shrink-0 flex-col justify-between pb-7 text-left text-[10px] text-ink-muted" aria-hidden="true">
          <span>۲۰۰ م</span>
          <span>۱۵۰ م</span>
          <span>۱۰۰ م</span>
          <span>۵۰ م</span>
          <span>۰</span>
        </div>
        <div className="relative flex min-w-0 flex-1 items-end justify-around gap-2 border-b border-line pb-7 before:absolute before:inset-x-0 before:top-0 before:h-[calc(100%-1.75rem)] before:bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(25%-1px),var(--line)_25%)] before:opacity-70">
          {data.map((item) => (
            <div key={item.month} className="group relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              <output
                className={`mb-2 whitespace-nowrap rounded-lg border border-line bg-white px-2 py-1 text-[10px] font-black text-ink shadow-card transition-opacity ${item.active ? "opacity-100" : "pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}
                aria-label={`${item.month}، ${item.label} تومان`}
              >
                {item.label}
                <span className="mr-1 font-bold text-ink-muted">تومان</span>
              </output>
              <button
                type="button"
                className={`w-full max-w-[3.85rem] rounded-t-md transition hover:brightness-95 focus-visible:outline-offset-2 ${item.active ? "bg-primary shadow-[0_8px_22px_rgb(36_87_214_/_0.2)]" : "bg-[#bcd5fb]"}`}
                style={{ height: `${Math.max(17, (item.value / maxValue) * 100)}%` }}
                aria-label={`${item.month}، ${item.label} تومان`}
                title={`${item.label} تومان`}
              />
              <span className={`absolute top-full mt-2 max-w-full truncate text-[10px] sm:text-xs ${item.active ? "font-black text-ink" : "text-ink-muted"}`}>
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
