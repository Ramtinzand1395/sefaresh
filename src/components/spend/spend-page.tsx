"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ExpenseBreakdown } from "@/components/spend/expense-breakdown";
import { RecentExpenses } from "@/components/spend/recent-expenses";
import { SpendingTrend } from "@/components/spend/spending-trend";
import { SpendSummary } from "@/components/spend/spend-summary";
import type { SpendPeriod } from "@/data/spend";

export function SpendPage() {
  const [period, setPeriod] = useState<SpendPeriod>("six-months");
  const [expensesExpanded, setExpensesExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        title="هزینه خرید"
        description="هزینه‌های خرید و روند مصرف کسب‌وکار خود را بررسی کنید."
      />

      <SpendSummary />

      <section aria-label="گزارش‌های تصویری هزینه" className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,1fr)]">
        <SpendingTrend period={period} onPeriodChange={setPeriod} />
        <ExpenseBreakdown />
      </section>

      <RecentExpenses expanded={expensesExpanded} onToggleExpanded={() => setExpensesExpanded((current) => !current)} />
    </div>
  );
}
