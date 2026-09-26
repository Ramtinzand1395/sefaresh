import "server-only";

import type {
  CafeRequestDetailItemView,
  CafeRequestDetailView,
  CafeRequestListItemView,
} from "@/components/cafe/requests/cafe-request-types";
import type {
  InternalPurchaseRequestDetail,
  InternalPurchaseRequestDetailItem,
  InternalPurchaseRequestListItem,
} from "@/repositories/internal-purchase-request-repository";

export function toCafeRequestListItemView(
  item: InternalPurchaseRequestListItem,
): CafeRequestListItemView {
  return {
    id: item._id.toHexString(),
    status: item.status,
    priority: item.priority,
    reason: item.reason,
    createdAt: item.createdAt.toISOString(),
    itemCount: item.itemCount,
    requesterName: item.requesterName,
  };
}

function toCafeRequestDetailItemView(
  item: InternalPurchaseRequestDetailItem,
): CafeRequestDetailItemView {
  return {
    id: item.id.toHexString(),
    productId: item.productId?.toHexString(),
    productTitle: item.productTitle,
    productBrand: item.productBrand,
    productUnit: item.productUnit,
    customTitle: item.customTitle,
    quantity: item.quantity,
    note: item.note,
    approvalStatus: item.approvalStatus,
    approvedQuantity: item.approvedQuantity,
  };
}

export function toCafeRequestDetailView(
  detail: InternalPurchaseRequestDetail,
): CafeRequestDetailView {
  return {
    id: detail._id.toHexString(),
    requesterName: detail.requesterName,
    reason: detail.reason,
    priority: detail.priority,
    status: detail.status,
    createdAt: detail.createdAt.toISOString(),
    reviewerName: detail.reviewerName,
    reviewedAt: detail.reviewedAt?.toISOString(),
    reviewNote: detail.reviewNote,
    items: detail.items.map(toCafeRequestDetailItemView),
  };
}

export function toRfqListItemView(
  item: {
    _id: { toHexString: () => string };
    title: string;
    status: "draft" | "matching" | "collecting_offers" | "completed" | "cancelled" | "expired";
    itemCount: number;
    neededAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
  },
): {
  id: string;
  title: string;
  status: "draft" | "matching" | "collecting_offers" | "completed" | "cancelled" | "expired";
  itemCount: number;
  neededAt?: string;
  expiresAt?: string;
  createdAt: string;
} {
  return {
    id: item._id.toHexString(),
    title: item.title,
    status: item.status,
    itemCount: item.itemCount,
    neededAt: item.neededAt?.toISOString(),
    expiresAt: item.expiresAt?.toISOString(),
    createdAt: item.createdAt.toISOString(),
  };
}

