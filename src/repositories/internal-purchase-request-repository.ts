import "server-only";

import type { ObjectId, UpdateFilter } from "mongodb";
import type {
  InternalPurchaseRequest,
  InternalPurchaseRequestItem,
  InternalPurchaseRequestStatus,
} from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

export async function findActiveProductIds(
  productIds: ObjectId[],
): Promise<Set<string>> {
  if (productIds.length === 0) {
    return new Set();
  }

  const collection = await getDomainCollection("products");
  const products = await collection
    .find(
      { _id: { $in: productIds }, status: "active" },
      { projection: { _id: 1 } },
    )
    .toArray();

  return new Set(products.map((product) => product._id.toHexString()));
}

export async function insertInternalPurchaseRequest(
  request: InternalPurchaseRequest,
): Promise<InternalPurchaseRequest> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  await collection.insertOne(request);
  return request;
}

export async function findInternalPurchaseRequestById(
  requestId: ObjectId,
): Promise<InternalPurchaseRequest | null> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  return collection.findOne({ _id: requestId });
}

export async function reviewPendingInternalPurchaseRequest(
  requestId: ObjectId,
  items: InternalPurchaseRequestItem[],
  status: Exclude<InternalPurchaseRequestStatus, "pending" | "cancelled">,
  reviewedBy: ObjectId,
  reviewedAt: Date,
  reviewNote?: string,
): Promise<InternalPurchaseRequest | null> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  const update: UpdateFilter<InternalPurchaseRequest> = {
    $set: {
      items,
      status,
      reviewedBy,
      reviewedAt,
      updatedAt: reviewedAt,
      ...(reviewNote !== undefined ? { reviewNote } : {}),
    },
    ...(reviewNote === undefined
      ? { $unset: { reviewNote: "" as const } }
      : {}),
  };

  return collection.findOneAndUpdate(
    { _id: requestId, status: "pending" },
    update,
    { returnDocument: "after" },
  );
}
