import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCircleCheck,
  IconClock,
  IconFileText,
  IconTruck,
  type TablerIcon,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type {
  SupplierActionItem,
  SupplierActionVariant,
} from "@/data/supplier-dashboard";
import { cn } from "@/lib/cn";

const variantStyles: Record<
  SupplierActionVariant,
  { icon: TablerIcon; iconClassName: string; countClassName: string }
> = {
  urgent: {
    icon: IconFileText,
    iconClassName: "bg-danger-soft text-danger",
    countClassName: "bg-danger text-white",
  },
  warning: {
    icon: IconClock,
    iconClassName: "bg-warning-soft text-warning",
    countClassName: "bg-warning text-white",
  },
  info: {
    icon: IconTruck,
    iconClassName: "bg-primary-soft text-primary",
    countClassName: "bg-primary text-white",
  },
  success: {
    icon: IconCircleCheck,
    iconClassName: "bg-success-soft text-success",
    countClassName: "bg-success text-white",
  },
};

type SupplierActionCenterProps = {
  items: SupplierActionItem[];
};

export function SupplierActionCenter({ items }: SupplierActionCenterProps) {
  return (
    <Card className="h-full overflow-hidden shadow-none">
      <div className="flex items-center gap-2 border-b border-line px-4 py-4 sm:px-5">
        <span className="grid size-9 place-items-center rounded-xl bg-warning-soft text-warning">
          <IconAlertTriangle size={20} stroke={1.8} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-black text-ink">نیاز به اقدام</h2>
          <p className="mt-0.5 text-[11px] text-ink-muted">موارد مهمی که بهتر است امروز پیگیری شوند</p>
        </div>
      </div>

      {items.length ? (
        <ul className="divide-y divide-line px-4 sm:px-5">
          {items.map((item) => {
            const styles = variantStyles[item.variant];
            const Icon = styles.icon;

            return (
              <li key={item.id} className="flex items-center gap-3 py-3.5">
                <span className={cn("relative grid size-10 shrink-0 place-items-center rounded-xl", styles.iconClassName)}>
                  <Icon size={21} stroke={1.8} aria-hidden="true" />
                  <span
                    className={cn(
                      "absolute -left-1.5 -top-1.5 grid size-5 place-items-center rounded-full text-[10px] font-black ring-2 ring-white",
                      styles.countClassName,
                    )}
                    aria-label={`${item.count} مورد`}
                  >
                    {new Intl.NumberFormat("fa-IR").format(item.count)}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black leading-6 text-ink">
                    {new Intl.NumberFormat("fa-IR").format(item.count)} {item.title}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-1 inline-flex min-h-8 items-center gap-1 rounded-md text-[11px] font-black text-primary transition hover:text-primary-hover"
                  >
                    {item.cta}
                    <IconArrowLeft size={14} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={IconCircleCheck}
          title="فعلاً کاری نیاز به اقدام شما ندارد."
          description="همه چیز مرتب است؛ موارد تازه همین‌جا نمایش داده می‌شوند."
          className="min-h-72"
        />
      )}
    </Card>
  );
}
