import "server-only";

import type { ObjectId } from "mongodb";
import type { PurchaseRequestSelection } from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

export async function findSelectionByPurchaseRequestId(
  purchaseRequestId: ObjectId,
  cafeId: ObjectId,
): Promise<PurchaseRequestSelection | null> {
  const collection = await getDomainCollection("purchaseRequestSelections");
  return collection.findOne({ purchaseRequestId, cafeId });
}

export async function upsertSelection(
  selection: PurchaseRequestSelection,
): Promise<PurchaseRequestSelection> {
  const collection = await getDomainCollection("purchaseRequestSelections");

  await collection.updateOne(
    {
      cafeId: selection.cafeId,
      purchaseRequestId: selection.purchaseRequestId,
    },
    {
      $set: {
        items: selection.items,
        createdBy: selection.createdBy,
        updatedAt: selection.updatedAt,
      },
      $setOnInsert: {
        _id: selection._id,
        createdAt: selection.createdAt,
      },
    },
    { upsert: true },
  );

  return selection;
}
