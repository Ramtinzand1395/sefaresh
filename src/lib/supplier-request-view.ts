import "server-only";

import type { SupplierRequestView } from "@/components/supplier/requests/supplier-request-types";
import type {
  SupplierRequestDetailItem,
  SupplierRequestInboxItem,
} from "@/repositories/supplier-request-repository";

export function toSupplierRequestView(
  request: SupplierRequestInboxItem | SupplierRequestDetailItem,
): SupplierRequestView {
  return {
    supplierRequestId: request.supplierRequestId.toHexString(),
    requestItemId: request.requestItemId.toHexString(),
    product: {
      id: request.product._id.toHexString(),
      title: request.product.title,
      slug: request.product.slug,
      brand: request.product.brand,
      image: request.product.image,
      unit: request.product.unit,
      unitValue: request.product.unitValue,
    },
    requestedQuantity: request.requestedQuantity,
    status: request.status,
    offeredPrice: request.offeredPrice,
    availableQuantity: request.availableQuantity,
    deliveryDays: request.deliveryDays,
    note: request.note,
    respondedAt: request.respondedAt?.toISOString(),
    createdAt: request.createdAt.toISOString(),
    ...(Object.hasOwn(request, "updatedAt")
      ? { updatedAt: (request as SupplierRequestDetailItem).updatedAt.toISOString() }
      : {}),
  };
}
