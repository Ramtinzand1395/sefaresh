import Image from "next/image";
import { IconBox, IconBottle, IconChevronLeft, IconDots } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { recentExpenses, type RecentExpense } from "@/data/spend";

type RecentExpensesProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
};

const categoryIcon = {
  blue: IconBox,
  orange: IconBottle,
  violet: IconBox,
} as const;

const categoryStyle = {
  blue: "bg-primary-soft text-primary",
  orange: "bg-accent-soft text-[#e87500]",
  violet: "bg-violet-soft text-violet",
} as const;

function CategoryCell({ expense }: { expense: RecentExpense }) {
  const Icon = categoryIcon[expense.categoryTone];
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${categoryStyle[expense.categoryTone]}`}>
        <Icon size={20} stroke={1.8} aria-hidden="true" />
      </span>
      <span className="font-bold text-ink">{expense.category}</span>
    </div>
  );
}

export function RecentExpenses({ expanded, onToggleExpanded }: RecentExpensesProps) {
  const visibleExpenses = expanded ? recentExpenses : recentExpenses.slice(0, 3);

  return (
    <Card className="overflow-hidden shadow-none">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <h2 className="text-base font-black text-ink md:text-lg">هزینه‌های اخیر</h2>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-black text-primary transition hover:bg-primary-soft"
          aria-expanded={expanded}
        >
          {expanded ? "نمایش کمتر" : "مشاهده همه"}
          <IconChevronLeft size={17} className={expanded ? "rotate-90" : ""} aria-hidden="true" />
        </button>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[780px] table-fixed border-collapse text-right text-xs">
          <thead className="bg-[linear-gradient(90deg,#f7faff,#eef5ff)] text-ink-muted">
            <tr>
              <th className="w-[29%] px-5 py-3 font-bold">تأمین‌کننده</th>
              <th className="w-[22%] px-4 py-3 font-bold">دسته‌بندی</th>
              <th className="w-[19%] px-4 py-3 font-bold">مبلغ</th>
              <th className="w-[13%] px-4 py-3 font-bold">تاریخ</th>
              <th className="w-[13%] px-4 py-3 font-bold">وضعیت</th>
              <th className="w-[4%] px-3 py-3"><span className="sr-only">عملیات</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleExpenses.map((expense) => (
              <tr key={expense.id} className="border-b border-line/70 last:border-b-0 hover:bg-surface-subtle/65">
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-subtle">
                      <Image src={expense.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="font-black text-ink">{expense.supplier}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5"><CategoryCell expense={expense} /></td>
                <td className="px-4 py-2.5 font-black text-ink">{expense.amount} <span className="font-bold text-ink-muted">تومان</span></td>
                <td className="px-4 py-2.5 font-bold text-ink-muted">{expense.date}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={expense.status === "paid" ? "success" : "warning"}>{expense.statusLabel}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  <button type="button" className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary transition hover:bg-primary/15" aria-label={`عملیات هزینه ${expense.supplier}`}>
                    <IconDots size={18} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-line md:hidden">
        {visibleExpenses.map((expense) => (
          <article key={expense.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-subtle">
                  <Image src={expense.image} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black text-ink">{expense.supplier}</h3>
                  <p className="mt-1 text-[11px] text-ink-muted">{expense.date}</p>
                </div>
              </div>
              <Badge variant={expense.status === "paid" ? "success" : "warning"}>{expense.statusLabel}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 pt-3">
              <CategoryCell expense={expense} />
              <p className="text-xs font-black text-ink">{expense.amount} <span className="font-bold text-ink-muted">تومان</span></p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
