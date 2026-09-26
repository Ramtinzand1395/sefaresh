import "server-only";

import { ObjectId } from "mongodb";
import { purchaseRequestSelectionSchema } from "@/domain/schemas/purchasing";
import type {
  PurchaseRequest,
  PurchaseRequestSelection,
  SupplierRequest,
} from "@/domain/types";
import { findActiveCafeMember } from "@/repositories/cafe-membership-repository";
import { getDomainCollection } from "@/repositories/domain-collections";
import { findPurchaseRequestByIdForCafe } from "@/repositories/purchase-request-repository";
import {
  findSelectionByPurchaseRequestId,
  upsertSelection,
} from "@/repositories/purchase-request-selection-repository";
import {
  findSuppliersByIds,
  type SupplierSummary,
} from "@/repositories/supplier-repository";
import { findSupplierRequestsByPurchaseRequestId } from "@/repositories/supplier-request-repository";

export type PurchaseRequestSelectionServiceErrorCode =
  | "NOT_CAFE_MEMBER"
  | "PURCHASE_REQUEST_NOT_FOUND"
  | "PURCHASE_REQUEST_CANCELLED"
  | "SUPPLIER_REQUEST_CHANGED"
  | "INVALID_SELECTION"
  | "MISSING_ITEM_SELECTION"
  | "NO_VALID_RESPONSES";

export class PurchaseRequestSelectionServiceError extends Error {
  constructor(
    public readonly code: PurchaseRequestSelectionServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PurchaseRequestSelectionServiceError";
  }
}

export type RfqSupplierOfferItem = {
  supplierRequestId: ObjectId;
  supplierId: ObjectId;
  supplierName: string;
  isVerified: boolean;
  supplierRating: number;
  status: SupplierRequest["status"];
  offeredPrice?: number;
  availableQuantity?: number;
  deliveryDays?: number;
  note?: string;
  respondedAt?: Date;
  isCommercial: boolean;
  isFullSupply: boolean;
  totalPrice?: number;
};

export type RfqComparisonRequestedItem = {
  requestItemId: ObjectId;
  productId: ObjectId;
  productTitle: string;
  productBrand?: string;
  productUnit?: string;
  requestedQuantity: number;
  note?: string;
  offers: RfqSupplierOfferItem[];
  selectedSupplierRequestId?: ObjectId;
  commercialOffersCount: number;
  pendingOffersCount: number;
  unavailableOffersCount: number;
};

export type RfqComparisonDetail = {
  purchaseRequest: {
    _id: ObjectId;
    cafeId: ObjectId;
    title: string;
    status: PurchaseRequest["status"];
    createdAt: Date;
    neededAt?: Date;
    expiresAt?: Date;
    isExpired: boolean;
  };
  metrics: {
    itemCount: number;
    invitedSuppliersCount: number;
    totalResponsesCount: number;
    pendingResponsesCount: number;
    commercialOffersCount: number;
  };
  items: RfqComparisonRequestedItem[];
  selection?: {
    _id: ObjectId;
    items: Array<{
      requestItemId: ObjectId;
      supplierRequestId: ObjectId;
      supplierId: ObjectId;
      quantity: number;
      unitPriceSnapshot: number;
      deliveryDaysSnapshot?: number;
    }>;
    updatedAt: Date;
  };
};

export type SavePurchaseRequestSelectionServiceInput = {
  cafeId: ObjectId;
  userId: ObjectId;
  purchaseRequestId: ObjectId;
  items: Array<{
    requestItemId: ObjectId;
    supplierRequestId: ObjectId;
  }>;
};

export type SavePurchaseRequestSelectionResult = {
  selection: PurchaseRequestSelection;
  selectedItemCount: number;
  estimatedTotal: number;
};

export async function getPurchaseRequestComparisonForCafe(
  purchaseRequestId: ObjectId,
  cafeId: ObjectId,
): Promise<RfqComparisonDetail | null> {
  const purchaseRequest = await findPurchaseRequestByIdForCafe(
    purchaseRequestId,
    cafeId,
  );

  if (!purchaseRequest) {
    return null;
  }

  const now = new Date();
  const isExpired =
    purchaseRequest.status === "expired" ||
    (purchaseRequest.expiresAt !== undefined && purchaseRequest.expiresAt <= now);

  const [supplierRequests, existingSelection] = await Promise.all([
    findSupplierRequestsByPurchaseRequestId(purchaseRequestId),
    findSelectionByPurchaseRequestId(purchaseRequestId, cafeId),
  ]);

  const productIds = purchaseRequest.items.map((i) => i.productId);
  const supplierIds = [
    ...new Set(supplierRequests.map((sr) => sr.supplierId.toHexString())),
  ].map((id) => new ObjectId(id));

  const productsCollection = await getDomainCollection("products");
  const [products, suppliers] = await Promise.all([
    productIds.length > 0
      ? productsCollection
          .find(
            { _id: { $in: productIds } },
            { projection: { _id: 1, title: 1, brand: 1, unit: 1 } },
          )
          .toArray()
      : Promise.resolve([]),
    findSuppliersByIds(supplierIds),
  ]);

  const productMap = new Map(
    products.map((p) => [
      p._id.toHexString(),
      { title: p.title, brand: p.brand, unit: p.unit },
    ]),
  );

  const supplierMap = new Map<string, SupplierSummary>(
    suppliers.map((s) => [s._id.toHexString(), s]),
  );

  const selectionMap = new Map<string, ObjectId>();
  if (existingSelection) {
    for (const item of existingSelection.items) {
      selectionMap.set(item.requestItemId.toHexString(), item.supplierRequestId);
    }
  }

  const supplierRequestsByItem = new Map<string, SupplierRequest[]>();
  for (const sr of supplierRequests) {
    const key = sr.requestItemId.toHexString();
    const list = supplierRequestsByItem.get(key) ?? [];
    list.push(sr);
    supplierRequestsByItem.set(key, list);
  }

  let totalCommercialOffers = 0;
  let totalPendingResponses = 0;
  let totalReceivedResponses = 0;

  for (const sr of supplierRequests) {
    if (["available", "partially_available", "unavailable", "declined"].includes(sr.status)) {
      totalReceivedResponses++;
    }
    if (["pending", "viewed"].includes(sr.status)) {
      totalPendingResponses++;
    }
    if (
      ["available", "partially_available"].includes(sr.status) &&
      sr.offeredPrice !== undefined &&
      sr.offeredPrice > 0
    ) {
      totalCommercialOffers++;
    }
  }

  const requestedItems: RfqComparisonRequestedItem[] = purchaseRequest.items.map((item) => {
    const itemKey = item.id.toHexString();
    const productInfo = productMap.get(item.productId.toHexString());
    const rawOffers = supplierRequestsByItem.get(itemKey) ?? [];

    let itemCommercialCount = 0;
    let itemPendingCount = 0;
    let itemUnavailableCount = 0;

    const offers: RfqSupplierOfferItem[] = rawOffers.map((sr) => {
      const supplier = supplierMap.get(sr.supplierId.toHexString());
      const isCommercial =
        ["available", "partially_available"].includes(sr.status) &&
        sr.offeredPrice !== undefined &&
        sr.offeredPrice > 0;

      const isFullSupply =
        sr.status === "available" ||
        (sr.availableQuantity !== undefined && sr.availableQuantity >= item.quantity);

      if (isCommercial) itemCommercialCount++;
      if (["pending", "viewed"].includes(sr.status)) itemPendingCount++;
      if (["unavailable", "declined"].includes(sr.status)) itemUnavailableCount++;

      const effectiveQty = isCommercial
        ? sr.status === "partially_available"
          ? sr.availableQuantity ?? item.quantity
          : item.quantity
        : undefined;

      const totalPrice =
        isCommercial && sr.offeredPrice !== undefined && effectiveQty !== undefined
          ? sr.offeredPrice * effectiveQty
          : undefined;

      return {
        supplierRequestId: sr._id,
        supplierId: sr.supplierId,
        supplierName: supplier?.name ?? "تأمین‌کننده ناشناس",
        isVerified: supplier?.isVerified ?? false,
        supplierRating: supplier?.rating ?? 0,
        status: sr.status,
        offeredPrice: sr.offeredPrice,
        availableQuantity: sr.availableQuantity,
        deliveryDays: sr.deliveryDays,
        note: sr.note,
        respondedAt: sr.respondedAt,
        isCommercial,
        isFullSupply,
        totalPrice,
      };
    });

    return {
      requestItemId: item.id,
      productId: item.productId,
      productTitle: productInfo?.title ?? "کالای بدون عنوان",
      productBrand: productInfo?.brand,
      productUnit: productInfo?.unit ?? "عدد",
      requestedQuantity: item.quantity,
      note: item.note,
      offers,
      selectedSupplierRequestId: selectionMap.get(itemKey),
      commercialOffersCount: itemCommercialCount,
      pendingOffersCount: itemPendingCount,
      unavailableOffersCount: itemUnavailableCount,
    };
  });

  const uniqueInvitedSuppliers = new Set(
    supplierRequests.map((sr) => sr.supplierId.toHexString()),
  ).size;

  return {
    purchaseRequest: {
      _id: purchaseRequest._id,
      cafeId: purchaseRequest.cafeId,
      title: purchaseRequest.title,
      status: purchaseRequest.status,
      createdAt: purchaseRequest.createdAt,
      neededAt: purchaseRequest.neededAt,
      expiresAt: purchaseRequest.expiresAt,
      isExpired,
    },
    metrics: {
      itemCount: purchaseRequest.items.length,
      invitedSuppliersCount: uniqueInvitedSuppliers,
      totalResponsesCount: totalReceivedResponses,
      pendingResponsesCount: totalPendingResponses,
      commercialOffersCount: totalCommercialOffers,
    },
    items: requestedItems,
    selection: existingSelection
      ? {
          _id: existingSelection._id,
          items: existingSelection.items,
          updatedAt: existingSelection.updatedAt,
        }
      : undefined,
  };
}

export async function savePurchaseRequestSelection(
  input: SavePurchaseRequestSelectionServiceInput,
): Promise<SavePurchaseRequestSelectionResult> {
  const { cafeId, userId, purchaseRequestId, items } = input;

  const membership = await findActiveCafeMember(cafeId, userId);
  if (!membership) {
    throw new PurchaseRequestSelectionServiceError(
      "NOT_CAFE_MEMBER",
      "شما عضو فعال این مجموعه نیستید.",
    );
  }

  const purchaseRequest = await findPurchaseRequestByIdForCafe(
    purchaseRequestId,
    cafeId,
  );
  if (!purchaseRequest) {
    throw new PurchaseRequestSelectionServiceError(
      "PURCHASE_REQUEST_NOT_FOUND",
      "استعلام مورد نظر یافت نشد یا دسترسی به آن مجاز نیست.",
    );
  }

  if (purchaseRequest.status === "cancelled") {
    throw new PurchaseRequestSelectionServiceError(
      "PURCHASE_REQUEST_CANCELLED",
      "این استعلام لغو شده است و امکان انتخاب پیشنهاد ندارد.",
    );
  }

  // Reload fresh supplier requests from DB to guarantee freshness & eliminate TOCTOU
  const freshSupplierRequests = await findSupplierRequestsByPurchaseRequestId(
    purchaseRequestId,
  );
  const supplierRequestMap = new Map<string, SupplierRequest>(
    freshSupplierRequests.map((sr) => [sr._id.toHexString(), sr]),
  );

  const requestItemMap = new Map(
    purchaseRequest.items.map((item) => [item.id.toHexString(), item]),
  );

  // Group fresh supplier requests by request item to find which items have commercial offers
  const commercialOffersByItem = new Map<string, SupplierRequest[]>();
  for (const sr of freshSupplierRequests) {
    if (
      ["available", "partially_available"].includes(sr.status) &&
      sr.offeredPrice !== undefined &&
      sr.offeredPrice > 0
    ) {
      const itemKey = sr.requestItemId.toHexString();
      const list = commercialOffersByItem.get(itemKey) ?? [];
      list.push(sr);
      commercialOffersByItem.set(itemKey, list);
    }
  }

  const selectionItems: Array<{
    requestItemId: ObjectId;
    supplierRequestId: ObjectId;
    supplierId: ObjectId;
    quantity: number;
    unitPriceSnapshot: number;
    deliveryDaysSnapshot?: number;
  }> = [];

  const processedItemIds = new Set<string>();

  for (const selectionInput of items) {
    const itemKey = selectionInput.requestItemId.toHexString();
    const requestItem = requestItemMap.get(itemKey);

    if (!requestItem) {
      throw new PurchaseRequestSelectionServiceError(
        "INVALID_SELECTION",
        "یکی از اقلام انتخابی به این استعلام تعلق ندارد.",
      );
    }

    if (processedItemIds.has(itemKey)) {
      throw new PurchaseRequestSelectionServiceError(
        "INVALID_SELECTION",
        "برای هر قلم کالا تنها می‌توانید یک تأمین‌کننده را انتخاب کنید.",
      );
    }
    processedItemIds.add(itemKey);

    const supplierRequest = supplierRequestMap.get(
      selectionInput.supplierRequestId.toHexString(),
    );

    if (!supplierRequest) {
      throw new PurchaseRequestSelectionServiceError(
        "SUPPLIER_REQUEST_CHANGED",
        "پیشنهاد تأمین‌کننده انتخاب‌شده در سیستم یافت نشد.",
      );
    }

    // Security & tenant checks
    if (!supplierRequest.purchaseRequestId.equals(purchaseRequestId)) {
      throw new PurchaseRequestSelectionServiceError(
        "INVALID_SELECTION",
        "شناسه استعلام پیشنهاد تأمین‌کننده با استعلام جاری مطابقت ندارد.",
      );
    }

    if (!supplierRequest.requestItemId.equals(requestItem.id)) {
      throw new PurchaseRequestSelectionServiceError(
        "INVALID_SELECTION",
        "پیشنهاد انتخاب‌شده مربوط به قلم کالای دیگری است.",
      );
    }

    // Freshness check: must be available or partially_available with valid price
    if (!["available", "partially_available"].includes(supplierRequest.status)) {
      throw new PurchaseRequestSelectionServiceError(
        "SUPPLIER_REQUEST_CHANGED",
        "یکی از پیشنهادهای انتخاب‌شده تغییر کرده است. لطفاً پیشنهادها را دوباره بررسی کنید.",
      );
    }

    if (
      supplierRequest.offeredPrice === undefined ||
      supplierRequest.offeredPrice <= 0
    ) {
      throw new PurchaseRequestSelectionServiceError(
        "SUPPLIER_REQUEST_CHANGED",
        "قیمت پیشنهادی تأمین‌کننده تغییر کرده یا نامعتبر است.",
      );
    }

    let selectedQuantity = requestItem.quantity;
    if (supplierRequest.status === "partially_available") {
      const avail = supplierRequest.availableQuantity ?? requestItem.quantity;
      selectedQuantity = Math.min(avail, requestItem.quantity);
      if (selectedQuantity <= 0) {
        throw new PurchaseRequestSelectionServiceError(
          "SUPPLIER_REQUEST_CHANGED",
          "موجودی اعلام‌شده توسط تأمین‌کننده برای این قلم معتبر نیست.",
        );
      }
    }

    selectionItems.push({
      requestItemId: requestItem.id,
      supplierRequestId: supplierRequest._id,
      supplierId: supplierRequest.supplierId,
      quantity: selectedQuantity,
      unitPriceSnapshot: supplierRequest.offeredPrice,
      deliveryDaysSnapshot: supplierRequest.deliveryDays,
    });
  }

  // Completeness check: all items with commercial offers must have a selected offer
  for (const [itemKey, offers] of commercialOffersByItem.entries()) {
    if (offers.length > 0 && !processedItemIds.has(itemKey)) {
      throw new PurchaseRequestSelectionServiceError(
        "MISSING_ITEM_SELECTION",
        "لطفاً برای تمام اقلامی که پیشنهاد قیمت دارند، تأمین‌کننده مورد نظر را انتخاب کنید.",
      );
    }
  }

  if (selectionItems.length === 0) {
    throw new PurchaseRequestSelectionServiceError(
      "NO_VALID_RESPONSES",
      "هیچ پیشنهاد معتبری برای انتخاب و ذخیره وجود ندارد.",
    );
  }

  const now = new Date();
  const selectionCandidate = {
    _id: new ObjectId(),
    cafeId,
    purchaseRequestId,
    items: selectionItems,
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };

  const parsedSelection = purchaseRequestSelectionSchema.parse(selectionCandidate);
  const savedSelection = await upsertSelection(parsedSelection);

  const estimatedTotal = selectionItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceSnapshot,
    0,
  );

  return {
    selection: savedSelection,
    selectedItemCount: selectionItems.length,
    estimatedTotal,
  };
}
