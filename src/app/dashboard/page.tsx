import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PopularProducts } from "@/components/dashboard/popular-products";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { SuggestedSuppliers } from "@/components/dashboard/suggested-suppliers";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <DashboardOverview />
      <QuickActions />
      <section aria-label="اطلاعات تکمیلی داشبورد" className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(16rem,.78fr)_minmax(31rem,1.38fr)_minmax(16rem,.78fr)]">
        <SuggestedSuppliers />
        <RecentOrders />
        <PopularProducts />
      </section>
    </div>
  );
}
