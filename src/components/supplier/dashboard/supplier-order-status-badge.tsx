import { Badge } from "@/components/ui/badge";
import type { SupplierOrderStatus } from "@/data/supplier-dashboard";

const statusConfig = {
  new: { label: "جدید", variant: "info" },
  processing: { label: "در حال آماده‌سازی", variant: "warning" },
  ready_to_ship: { label: "آماده ارسال", variant: "violet" },
  shipped: { label: "ارسال شده", variant: "info" },
  delivered: { label: "تحویل شده", variant: "success" },
  cancelled: { label: "لغو شده", variant: "danger" },
} as const satisfies Record<SupplierOrderStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }>;

type SupplierOrderStatusBadgeProps = {
  status: SupplierOrderStatus;
};

export function SupplierOrderStatusBadge({ status }: SupplierOrderStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant} className="whitespace-nowrap">{config.label}</Badge>;
}
