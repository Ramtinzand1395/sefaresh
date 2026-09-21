import {
  IconClipboardList,
  IconFileText,
  IconTrendingUp,
  IconWallet,
  type TablerIcon,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SupplierActionCenter } from "@/components/supplier/dashboard/supplier-action-center";
import { SupplierRecentOrders } from "@/components/supplier/dashboard/supplier-recent-orders";
import { SupplierRequests } from "@/components/supplier/dashboard/supplier-requests";
import { SupplierSalesChart } from "@/components/supplier/dashboard/supplier-sales-chart";
import { supplierAccount } from "@/config/dashboard";
import type {
  SupplierDashboardData,
  SupplierDashboardStatKind,
} from "@/data/supplier-dashboard";

const numberFormatter = new Intl.NumberFormat("fa-IR");

const statIcons: Record<SupplierDashboardStatKind, TablerIcon> = {
  monthly_sales: IconTrendingUp,
  new_orders: IconClipboardList,
  new_requests: IconFileText,
  settlement: IconWallet,
};

type SupplierDashboardProps = {
  data: SupplierDashboardData;
};

export function SupplierDashboard({ data }: SupplierDashboardProps) {
  const stats = data.stats ?? [];
  const actions = data.actions ?? [];
  const requests = data.purchaseRequests ?? [];
  const orders = data.recentOrders ?? [];

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title={`سلام، ${supplierAccount.userName} 👋`}
        description="خوش آمدید! اینجا می‌توانید وضعیت فروش و سفارش‌های امروز را مدیریت کنید."
      />

      <section aria-labelledby="supplier-kpi-heading">
        <h2 id="supplier-kpi-heading" className="sr-only">خلاصه عملکرد فروش</h2>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.kind}
              label={stat.title}
              value={`${numberFormatter.format(stat.value)} ${stat.unit}`}
              hint={stat.description}
              trend={stat.trend}
              icon={statIcons[stat.kind]}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      <section
        aria-label="فروش و اقدامات فوری"
        className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,1fr)]"
      >
        <SupplierSalesChart data={data.sales} />
        <SupplierActionCenter items={actions} />
      </section>

      <SupplierRequests requests={requests} />
      <SupplierRecentOrders orders={orders} />
    </div>
  );
}
