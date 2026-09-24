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
