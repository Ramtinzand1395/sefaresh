import { Card } from "@/components/ui/card";
import { expenseCategories } from "@/data/spend";

export function ExpenseBreakdown() {
  const segments = expenseCategories.reduce<Array<{ start: number; end: number; color: string }>>((acc, category) => {
    const start = acc.at(-1)?.end ?? 0;
    acc.push({ start, end: start + category.percentage, color: category.color });
    return acc;
  }, []);
  const background = `conic-gradient(${segments.map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`).join(", ")})`;

  return (
    <Card className="min-h-[20rem] p-4 shadow-none sm:p-5 lg:min-h-[21.5rem]">
      <h2 className="text-base font-black text-ink md:text-lg">تفکیک هزینه‌ها</h2>
      <div className="mt-4 grid items-center gap-6 sm:grid-cols-[minmax(12rem,.9fr)_minmax(14rem,1.1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(11rem,.88fr)_minmax(13rem,1.12fr)]">
        <div
          className="relative mx-auto aspect-square w-full max-w-[14.5rem] rounded-full"
          style={{ background }}
          role="img"
          aria-label="نمودار حلقه‌ای تفکیک هزینه‌ها: ۵۲ درصد مواد اولیه، ۲۱ درصد نوشیدنی، ۱۵ درصد بسته‌بندی و ۱۲ درصد سایر"
        >
          <div className="absolute inset-[18%] grid place-items-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgb(217_225_238_/_0.6)]">
            <div>
              <p className="text-lg font-black tracking-tight text-ink sm:text-xl">۱۲۳٬۴۵۰٬۰۰۰</p>
              <p className="mt-1 text-xs font-bold text-ink-muted">تومان</p>
              <p className="mt-1 text-[10px] text-ink-muted">مجموع هزینه‌ها</p>
            </div>
          </div>
        </div>

        <ul className="space-y-3" aria-label="راهنمای دسته‌بندی هزینه‌ها">
          {expenseCategories.map((category) => (
            <li key={category.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
              <span className="size-3.5 rounded-full" style={{ backgroundColor: category.color }} aria-hidden="true" />
              <span className="text-sm font-black text-ink">{category.label}</span>
              <span className="row-span-2 text-sm font-black text-ink-muted">{category.percentage.toLocaleString("fa-IR")}٪</span>
              <span className="col-start-2 text-[10px] text-ink-muted">{category.amount} تومان</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
