import "server-only";

import type { ObjectId } from "mongodb";
import type { PurchaseRequest, PurchaseRequestStatus } from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

const matchableStatuses: PurchaseRequestStatus[] = [
  "draft",
  "matching",
  "collecting_offers",
];

export type PurchaseRequestMatchability = Pick<
  PurchaseRequest,
  "_id" | "status" | "expiresAt"
>;

export async function claimPurchaseRequestForMatching(
  purchaseRequestId: ObjectId,
  now: Date,
): Promise<PurchaseRequest | null> {
  const collection = await getDomainCollection("purchaseRequests");

  return collection.findOneAndUpdate(
    {
      _id: purchaseRequestId,
      status: { $in: matchableStatuses },
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }],
    },
    { $set: { status: "matching", updatedAt: now } },
    { returnDocument: "after" },
  );
}

export async function findPurchaseRequestMatchability(
  purchaseRequestId: ObjectId,
): Promise<PurchaseRequestMatchability | null> {
  const collection = await getDomainCollection("purchaseRequests");
  const request = await collection.findOne(
    { _id: purchaseRequestId },
    { projection: { _id: 1, status: 1, expiresAt: 1 } },
  );

  if (!request) {
    return null;
  }

  return {
    _id: request._id,
    status: request.status,
    expiresAt: request.expiresAt,
  };
}

export async function markPurchaseRequestExpired(
  purchaseRequestId: ObjectId,
  now: Date,
): Promise<void> {
  const collection = await getDomainCollection("purchaseRequests");
  await collection.updateOne(
    {
      _id: purchaseRequestId,
      status: { $nin: ["completed", "cancelled", "expired"] },
      expiresAt: { $lte: now },
    },
    { $set: { status: "expired", updatedAt: now } },
  );
}

export async function finishPurchaseRequestMatching(
  purchaseRequestId: ObjectId,
  now: Date,
): Promise<void> {
  const collection = await getDomainCollection("purchaseRequests");
  await collection.updateOne(
    {
      _id: purchaseRequestId,
      status: { $in: ["matching", "collecting_offers"] },
    },
    { $set: { status: "collecting_offers", updatedAt: now } },
  );
}
