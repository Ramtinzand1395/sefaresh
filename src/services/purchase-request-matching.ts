import "server-only";

import type { ObjectId } from "mongodb";
import { objectIdSchema } from "@/domain/schemas/common";
import type { PurchaseRequest, SupplierRequest } from "@/domain/types";
import {
  claimPurchaseRequestForMatching,
  findPurchaseRequestMatchability,
  finishPurchaseRequestMatching,
  markPurchaseRequestExpired,
} from "@/repositories/purchase-request-repository";
import { findMatchableOffersByProductIds } from "@/repositories/supplier-offer-repository";
import { findEligibleSupplierIds } from "@/repositories/supplier-repository";
import {
  upsertSupplierRequests,
  type SupplierRequestSeed,
} from "@/repositories/supplier-request-repository";

export type PurchaseRequestMatchingErrorCode =
  | "PURCHASE_REQUEST_NOT_FOUND"
  | "PURCHASE_REQUEST_EXPIRED"
  | "PURCHASE_REQUEST_NOT_MATCHABLE";

export class PurchaseRequestMatchingError extends Error {
  constructor(
    public readonly code: PurchaseRequestMatchingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PurchaseRequestMatchingError";
  }
}

export type PurchaseRequestMatchingResult = {
  purchaseRequestId: ObjectId;
  candidateCount: number;
  createdCount: number;
  existingCount: number;
};

function uniqueObjectIds(ids: ObjectId[]): ObjectId[] {
  return [...new Map(ids.map((id) => [id.toHexString(), id])).values()];
}

function groupItemsByProduct(
  items: PurchaseRequest["items"],
): Map<string, PurchaseRequest["items"]> {
  const itemsByProduct = new Map<string, PurchaseRequest["items"]>();

  for (const item of items) {
    const key = item.productId.toHexString();
    const productItems = itemsByProduct.get(key) ?? [];
    productItems.push(item);
    itemsByProduct.set(key, productItems);
  }

  return itemsByProduct;
}

async function throwMatchingClaimError(
  purchaseRequestId: ObjectId,
  now: Date,
): Promise<never> {
  const existingRequest = await findPurchaseRequestMatchability(purchaseRequestId);

  if (!existingRequest) {
    throw new PurchaseRequestMatchingError(
      "PURCHASE_REQUEST_NOT_FOUND",
      "Purchase request was not found.",
    );
  }

  if (existingRequest.status === "expired") {
    throw new PurchaseRequestMatchingError(
      "PURCHASE_REQUEST_EXPIRED",
      "Expired purchase requests cannot be matched.",
    );
  }

  if (existingRequest.status === "completed" || existingRequest.status === "cancelled") {
    throw new PurchaseRequestMatchingError(
      "PURCHASE_REQUEST_NOT_MATCHABLE",
      `Purchase request with status "${existingRequest.status}" cannot be matched.`,
    );
  }

  if (existingRequest.expiresAt !== undefined && existingRequest.expiresAt <= now) {
    await markPurchaseRequestExpired(purchaseRequestId, now);
    throw new PurchaseRequestMatchingError(
      "PURCHASE_REQUEST_EXPIRED",
      "Expired purchase requests cannot be matched.",
    );
  }

  throw new PurchaseRequestMatchingError(
    "PURCHASE_REQUEST_NOT_MATCHABLE",
    `Purchase request with status "${existingRequest.status}" cannot be matched.`,
  );
}

export async function matchPurchaseRequest(
  purchaseRequestIdInput: string | ObjectId,
): Promise<PurchaseRequestMatchingResult> {
  const purchaseRequestId = objectIdSchema.parse(purchaseRequestIdInput);
  const now = new Date();
  const purchaseRequest = await claimPurchaseRequestForMatching(purchaseRequestId, now);

  if (!purchaseRequest) {
    return throwMatchingClaimError(purchaseRequestId, now);
  }

  const productIds = uniqueObjectIds(purchaseRequest.items.map((item) => item.productId));
  const offers = await findMatchableOffersByProductIds(productIds);
  const eligibleSupplierIds = await findEligibleSupplierIds(
    uniqueObjectIds(offers.map((offer) => offer.supplierId)),
  );
  const itemsByProduct = groupItemsByProduct(purchaseRequest.items);
  const seeds: SupplierRequestSeed[] = [];

  for (const offer of offers) {
    if (!eligibleSupplierIds.has(offer.supplierId.toHexString())) {
      continue;
    }

    const matchingItems = itemsByProduct.get(offer.productId.toHexString()) ?? [];

    for (const item of matchingItems) {
      const seed: SupplierRequestSeed = {
        purchaseRequestId,
        requestItemId: item.id,
        productId: item.productId,
        supplierId: offer.supplierId,
        requestedQuantity: item.quantity,
      } satisfies Pick<
        SupplierRequest,
        | "purchaseRequestId"
        | "requestItemId"
        | "productId"
        | "supplierId"
        | "requestedQuantity"
      >;
      seeds.push(seed);
    }
  }

  const result = await upsertSupplierRequests(seeds, now);
  await finishPurchaseRequestMatching(purchaseRequestId, new Date());

  return { purchaseRequestId, ...result };
}
