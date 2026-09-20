import {
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { orderStats } from "@/data/orders";

export function OrderStats() {
  return (
    <section aria-label="آمار سفارش‌ها" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="همه سفارش‌ها"
        value={new Intl.NumberFormat("fa-IR").format(orderStats.all)}
        hint="در ۳ ماه گذشته"
        icon={IconChecklist}
        tone="blue"
      />
      <StatCard
        label="در انتظار تأیید"
        value={new Intl.NumberFormat("fa-IR").format(orderStats.pending)}
        hint="نیاز به اقدام"
        icon={IconClockHour4}
        tone="orange"
      />
      <StatCard
        label="در حال ارسال"
        value={new Intl.NumberFormat("fa-IR").format(orderStats.shipping)}
        hint="در مسیر تحویل"
        icon={IconTruckDelivery}
        tone="violet"
      />
      <StatCard
        label="تحویل‌شده این ماه"
        value={new Intl.NumberFormat("fa-IR").format(orderStats.deliveredThisMonth)}
        hint="بیشتر از ماه قبل"
        trend="۲۵٪"
        icon={IconCircleCheck}
        tone="green"
      />
    </section>
  );
}
