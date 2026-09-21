import {
  IconCategory,
  IconStarFilled,
  IconTruckDelivery,
  IconUsersGroup,
} from "@tabler/icons-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { supplierPageStats } from "@/data/suppliers";

/**
 * Four KPI cards matching the design's stats row.
 * Reuses the existing StatCard component from the design system.
 */
export function SupplierStats() {
  return (
    <section aria-label="آمار تأمین‌کنندگان" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="تأمین‌کننده فعال"
        value={new Intl.NumberFormat("fa-IR").format(supplierPageStats.activeCount)}
        hint="همکاری در حال انجام"
        icon={IconUsersGroup}
        tone="blue"
      />
      <StatCard
        label="میانگین امتیاز"
        value={new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1 }).format(supplierPageStats.averageScore)}
        hint="از ۵"
        icon={IconStarFilled}
        tone="orange"
      />
      <StatCard
        label="دسته‌بندی کالا"
        value={new Intl.NumberFormat("fa-IR").format(supplierPageStats.categoryCount)}
        hint="در دسترس"
        icon={IconCategory}
        tone="green"
      />
      <StatCard
        label="ارسال به‌موقع"
        value={supplierPageStats.onTimeDeliveryPercent}
        hint="از کل سفارش‌ها"
        icon={IconTruckDelivery}
        tone="violet"
      />
    </section>
  );
}
