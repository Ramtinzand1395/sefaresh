import { ActionCenter } from "@/components/dashboard/action-center";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { dashboardStats } from "@/data/dashboard";

export function DashboardOverview() {
  return (
    <section aria-label="نمای کلی داشبورد" className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22.5rem]">
      <div className="min-w-0 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(18rem,.86fr)_minmax(0,1.14fr)]">
          <ActionCenter />
          <SpendingChart />
        </div>
      </div>
      <WelcomeCard />
    </section>
  );
}
