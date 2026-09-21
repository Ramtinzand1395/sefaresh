import Link from "next/link";
import type { DashboardNavigationItem } from "@/config/dashboard";
import { cn } from "@/lib/cn";

type DashboardNavItemProps = {
  item: DashboardNavigationItem;
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function DashboardNavItem({
  item,
  active,
  collapsed = false,
  onNavigate,
}: DashboardNavItemProps) {
  const Icon = item.icon;
  const content = (
    <>
      <Icon size={22} stroke={1.8} aria-hidden="true" />
      <span className={cn("min-w-0 flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            "grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[11px] font-black",
            collapsed && "absolute -left-1 -top-1 min-w-5 px-1",
            active ? "bg-white text-primary" : "bg-primary-soft text-primary",
          )}
          aria-label={`${item.badge} مورد جدید`}
        >
          {item.badge}
        </span>
      ) : null}
    </>
  );

  if (!item.implemented) {
    return (
      <span
        aria-disabled="true"
        title="این بخش در مرحله بعد ساخته می‌شود"
        className={cn(
          "relative flex min-h-12 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-bold text-ink-muted/75",
          collapsed && "justify-center px-0",
        )}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary-soft text-primary after:absolute after:inset-y-1.5 after:right-0 after:w-1 after:rounded-l-full after:bg-primary"
          : "text-ink-muted hover:bg-surface-subtle hover:text-ink",
      )}
    >
      {content}
    </Link>
  );
}
