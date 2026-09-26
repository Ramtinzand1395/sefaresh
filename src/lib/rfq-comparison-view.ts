import "server-only";

import type { RfqComparisonDetailView } from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import type { RfqComparisonDetail } from "@/services/purchase-request-selection-service";

export function toRfqComparisonDetailView(
  detail: RfqComparisonDetail,
): RfqComparisonDetailView {
  return {
    purchaseRequest: {
      id: detail.purchaseRequest._id.toHexString(),
      title: detail.purchaseRequest.title,
      status: detail.purchaseRequest.status,
      createdAt: detail.purchaseRequest.createdAt.toISOString(),
      neededAt: detail.purchaseRequest.neededAt?.toISOString(),
      expiresAt: detail.purchaseRequest.expiresAt?.toISOString(),
      isExpired: detail.purchaseRequest.isExpired,
    },
    metrics: detail.metrics,
    items: detail.items.map((item) => ({
      requestItemId: item.requestItemId.toHexString(),
      productId: item.productId.toHexString(),
      productTitle: item.productTitle,
      productBrand: item.productBrand,
      productUnit: item.productUnit ?? "عدد",
      requestedQuantity: item.requestedQuantity,
      note: item.note,
      offers: item.offers.map((offer) => ({
        supplierRequestId: offer.supplierRequestId.toHexString(),
        supplierId: offer.supplierId.toHexString(),
        supplierName: offer.supplierName,
        isVerified: offer.isVerified,
        supplierRating: offer.supplierRating,
        status: offer.status,
        offeredPrice: offer.offeredPrice,
        availableQuantity: offer.availableQuantity,
        deliveryDays: offer.deliveryDays,
        note: offer.note,
        respondedAt: offer.respondedAt?.toISOString(),
        isCommercial: offer.isCommercial,
        isFullSupply: offer.isFullSupply,
        totalPrice: offer.totalPrice,
      })),
      selectedSupplierRequestId: item.selectedSupplierRequestId?.toHexString(),
      commercialOffersCount: item.commercialOffersCount,
      pendingOffersCount: item.pendingOffersCount,
      unavailableOffersCount: item.unavailableOffersCount,
    })),
    selection: detail.selection
      ? {
          id: detail.selection._id.toHexString(),
          items: detail.selection.items.map((i) => ({
            requestItemId: i.requestItemId.toHexString(),
            supplierRequestId: i.supplierRequestId.toHexString(),
            supplierId: i.supplierId.toHexString(),
            quantity: i.quantity,
            unitPriceSnapshot: i.unitPriceSnapshot,
            deliveryDaysSnapshot: i.deliveryDaysSnapshot,
          })),
          updatedAt: detail.selection.updatedAt.toISOString(),
        }
      : undefined,
  };
}
