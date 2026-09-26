export type OfferSortOption =
  | "lowest_price"
  | "fastest_delivery"
  | "highest_rating"
  | "availability";

export type RfqSupplierOfferView = {
  supplierRequestId: string;
  supplierId: string;
  supplierName: string;
  isVerified: boolean;
  supplierRating: number;
  status:
    | "pending"
    | "viewed"
    | "available"
    | "partially_available"
    | "unavailable"
    | "declined"
    | "expired";
  offeredPrice?: number;
  availableQuantity?: number;
  deliveryDays?: number;
  note?: string;
  respondedAt?: string;
  isCommercial: boolean;
  isFullSupply: boolean;
  totalPrice?: number;
};

export type RfqRequestedItemView = {
  requestItemId: string;
  productId: string;
  productTitle: string;
  productBrand?: string;
  productUnit: string;
  requestedQuantity: number;
  note?: string;
  offers: RfqSupplierOfferView[];
  selectedSupplierRequestId?: string;
  commercialOffersCount: number;
  pendingOffersCount: number;
  unavailableOffersCount: number;
};

export type RfqComparisonDetailView = {
  purchaseRequest: {
    id: string;
    title: string;
    status:
      | "draft"
      | "matching"
      | "collecting_offers"
      | "completed"
      | "cancelled"
      | "expired";
    createdAt: string;
    neededAt?: string;
    expiresAt?: string;
    isExpired: boolean;
  };
  metrics: {
    itemCount: number;
    invitedSuppliersCount: number;
    totalResponsesCount: number;
    pendingResponsesCount: number;
    commercialOffersCount: number;
  };
  items: RfqRequestedItemView[];
  selection?: {
    id: string;
    items: Array<{
      requestItemId: string;
      supplierRequestId: string;
      supplierId: string;
      quantity: number;
      unitPriceSnapshot: number;
      deliveryDaysSnapshot?: number;
    }>;
    updatedAt: string;
  };
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const currencyFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
});

export function formatPersianNumber(val: number): string {
  return numberFormatter.format(val);
}

export function formatToman(val: number): string {
  return `${currencyFormatter.format(val)} تومان`;
}

export function formatPersianDate(dateStr?: string): string {
  if (!dateStr) return "تعیین نشده";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "تعیین نشده";
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeZone: "Asia/Tehran",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function sortSupplierOffers(
  offers: RfqSupplierOfferView[],
  sortBy: OfferSortOption,
): RfqSupplierOfferView[] {
  // Commercial offers come first, then non-commercial
  return [...offers].sort((a, b) => {
    if (a.isCommercial && !b.isCommercial) return -1;
    if (!a.isCommercial && b.isCommercial) return 1;

    if (!a.isCommercial && !b.isCommercial) {
      return a.supplierName.localeCompare(b.supplierName, "fa");
    }

    const priceA = a.offeredPrice ?? Infinity;
    const priceB = b.offeredPrice ?? Infinity;
    const deliveryA = a.deliveryDays ?? Infinity;
    const deliveryB = b.deliveryDays ?? Infinity;
    const ratingA = a.supplierRating ?? 0;
    const ratingB = b.supplierRating ?? 0;

    if (sortBy === "lowest_price") {
      if (priceA !== priceB) return priceA - priceB;
      if (deliveryA !== deliveryB) return deliveryA - deliveryB;
      if (ratingA !== ratingB) return ratingB - ratingA;
      return a.supplierId.localeCompare(b.supplierId);
    }

    if (sortBy === "fastest_delivery") {
      if (deliveryA !== deliveryB) return deliveryA - deliveryB;
      if (priceA !== priceB) return priceA - priceB;
      if (ratingA !== ratingB) return ratingB - ratingA;
      return a.supplierId.localeCompare(b.supplierId);
    }

    if (sortBy === "highest_rating") {
      if (ratingA !== ratingB) return ratingB - ratingA;
      if (priceA !== priceB) return priceA - priceB;
      if (deliveryA !== deliveryB) return deliveryA - deliveryB;
      return a.supplierId.localeCompare(b.supplierId);
    }

    if (sortBy === "availability") {
      if (a.isFullSupply && !b.isFullSupply) return -1;
      if (!a.isFullSupply && b.isFullSupply) return 1;
      const qtyA = a.availableQuantity ?? 0;
      const qtyB = b.availableQuantity ?? 0;
      if (qtyA !== qtyB) return qtyB - qtyA;
      if (priceA !== priceB) return priceA - priceB;
      if (deliveryA !== deliveryB) return deliveryA - deliveryB;
      return a.supplierId.localeCompare(b.supplierId);
    }

    return 0;
  });
}

export function findBestOffersHighlights(offers: RfqSupplierOfferView[]): {
  lowestPriceId: string | null;
  fastestDeliveryId: string | null;
} {
  const commercial = offers.filter((o) => o.isCommercial && o.offeredPrice !== undefined);
  if (commercial.length === 0) {
    return { lowestPriceId: null, fastestDeliveryId: null };
  }

  let minPrice = Infinity;
  let lowestPriceId: string | null = null;

  let minDelivery = Infinity;
  let fastestDeliveryId: string | null = null;

  for (const o of commercial) {
    if (o.offeredPrice !== undefined && o.offeredPrice < minPrice) {
      minPrice = o.offeredPrice;
      lowestPriceId = o.supplierRequestId;
    }
    if (o.deliveryDays !== undefined && o.deliveryDays < minDelivery) {
      minDelivery = o.deliveryDays;
      fastestDeliveryId = o.supplierRequestId;
    }
  }

  return { lowestPriceId, fastestDeliveryId };
}
