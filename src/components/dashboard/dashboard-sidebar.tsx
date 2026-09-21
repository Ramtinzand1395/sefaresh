import Image from "next/image";
import Link from "next/link";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconX,
} from "@tabler/icons-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DashboardNavItem } from "@/components/dashboard/dashboard-nav-item";
import { RoshaAssistantCard } from "@/components/dashboard/rosha-assistant-card";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import {
  dashboardAccountByRole,
  dashboardNavigationByRole,
  type DashboardRole,
} from "@/config/dashboard";
import { cn } from "@/lib/cn";

type DashboardSidebarProps = {
  activePath: string;
  role?: DashboardRole;
  mobile?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
  onToggleCollapsed?: () => void;
};

export function DashboardSidebar({
  activePath,
  role = "buyer",
  mobile = false,
  collapsed = false,
  onClose,
  onToggleCollapsed,
}: DashboardSidebarProps) {
  const navigation = dashboardNavigationByRole[role];
  const account = dashboardAccountByRole[role];
  const verificationLabel = "verificationLabel" in account ? account.verificationLabel : null;

  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className={cn(
          "flex min-h-[5.5rem] items-center justify-between gap-2 px-4",
          collapsed && "flex-col justify-center px-2",
        )}
      >
        <Link href="/" aria-label="بازگشت به صفحه اصلی سفارش" onClick={onClose}>
          {collapsed ? (
            <Image
              src="/brand/mark-sefaresh.png"
              alt="سفارش"
              width={48}
              height={48}
              priority
              className="size-10 object-contain"
            />
          ) : (
            <BrandLogo className="w-[132px]" priority />
          )}
        </Link>
        {mobile ? (
          <IconButton label="بستن منو" className="border-0" onClick={onClose}>
            <IconX size={22} aria-hidden="true" />
          </IconButton>
        ) : onToggleCollapsed ? (
          <IconButton
            label={collapsed ? "باز کردن نوار کناری" : "جمع کردن نوار کناری"}
            className={cn("size-9 border-0", collapsed && "absolute left-1 top-3")}
            onClick={onToggleCollapsed}
          >
            {collapsed ? (
              <IconChevronLeft size={18} aria-hidden="true" />
            ) : (
              <IconChevronRight size={18} aria-hidden="true" />
            )}
          </IconButton>
        ) : null}
      </div>

      {role === "supplier" ? (
        <div className={cn("mx-3 mb-2 rounded-card border border-line bg-surface-subtle p-3", collapsed && "mx-2 p-2")}>
          <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-white ring-2 ring-primary-soft">
              {account.initials}
            </span>
            <div className={cn("min-w-0", collapsed && "sr-only")}>
              <p className="truncate text-xs font-black text-ink">{account.businessName}</p>
              <p className="mt-0.5 text-[10px] text-ink-muted">{account.role}</p>
            </div>
          </div>
          {verificationLabel && !collapsed ? (
            <Badge variant="success" className="mt-2 min-h-6 w-full justify-center gap-1 px-2 text-[10px]">
              <IconCircleCheckFilled size={14} aria-hidden="true" />
              {verificationLabel}
            </Badge>
          ) : null}
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-2.5 py-2" aria-label="ناوبری داشبورد">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              activePath === item.href ||
              (item.href !== (role === "supplier" ? "/supplier" : "/dashboard") &&
                activePath.startsWith(`${item.href}/`));

            return (
              <li key={item.href}>
                <DashboardNavItem
                  item={item}
                  active={isActive}
                  collapsed={collapsed}
                  onNavigate={onClose}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <RoshaAssistantCard role={role} collapsed={collapsed} />
      </div>
    </div>
  );
}
