export type CafeRequestStatus =
  | "pending"
  | "approved"
  | "partially_approved"
  | "rejected"
  | "cancelled";

export type CafeRequestPriority = "low" | "normal" | "high" | "urgent";

export type CafeRequestItemApprovalStatus = "pending" | "approved" | "rejected";

export type CafeRequestListItemView = {
  id: string;
  status: CafeRequestStatus;
  priority: CafeRequestPriority;
  reason?: string;
  createdAt: string;
  itemCount: number;
  requesterName?: string;
};

export type RfqListItemView = {
  id: string;
  title: string;
  status:
    | "draft"
    | "matching"
    | "collecting_offers"
    | "completed"
    | "cancelled"
    | "expired";
  itemCount: number;
  neededAt?: string;
  expiresAt?: string;
  createdAt: string;
};


export type CafeRequestDetailItemView = {
  id: string;
  productId?: string;
  productTitle?: string;
  productBrand?: string;
  productUnit?: string;
  customTitle?: string;
  quantity: number;
  note?: string;
  approvalStatus: CafeRequestItemApprovalStatus;
  approvedQuantity: number;
};

export type CafeRequestDetailView = {
  id: string;
  requesterName?: string;
  reason?: string;
  priority: CafeRequestPriority;
  status: CafeRequestStatus;
  createdAt: string;
  reviewerName?: string;
  reviewedAt?: string;
  reviewNote?: string;
  items: CafeRequestDetailItemView[];
};

export type CatalogProductSearchView = {
  productId: string;
  title: string;
  brand?: string;
  unit: string;
};

export const cafeRequestStatusConfig: Record<
  CafeRequestStatus,
  {
    label: string;
    variant: "info" | "neutral" | "success" | "warning" | "danger";
  }
> = {
  pending: { label: "در انتظار بررسی", variant: "warning" },
  approved: { label: "تأیید شده", variant: "success" },
  partially_approved: { label: "تأیید جزئی", variant: "info" },
  rejected: { label: "رد شده", variant: "danger" },
  cancelled: { label: "لغو شده", variant: "neutral" },
};

export const cafeRequestPriorityConfig: Record<
  CafeRequestPriority,
  {
    label: string;
    variant: "neutral" | "info" | "warning" | "danger";
  }
> = {
  low: { label: "کم", variant: "neutral" },
  normal: { label: "عادی", variant: "info" },
  high: { label: "بالا", variant: "warning" },
  urgent: { label: "فوری", variant: "danger" },
};

export const cafeRequestItemApprovalConfig: Record<
  CafeRequestItemApprovalStatus,
  {
    label: string;
    variant: "neutral" | "warning" | "success" | "danger";
  }
> = {
  pending: { label: "در انتظار", variant: "warning" },
  approved: { label: "تأیید شده", variant: "success" },
  rejected: { label: "رد شده", variant: "danger" },
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

export function formatPersianNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPersianDate(value: string): string {
  return dateFormatter.format(new Date(value));
}
