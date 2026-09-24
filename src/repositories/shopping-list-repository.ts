import "server-only";

import {
  MongoServerError,
  ObjectId,
  type AnyBulkWriteOperation,
} from "mongodb";
import type { ShoppingList, ShoppingListItem } from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

export type AppendShoppingListItemsResult = {
  shoppingList: ShoppingList | null;
  addedCount: number;
};

export async function findShoppingListById(
  shoppingListId: ObjectId,
): Promise<ShoppingList | null> {
  const collection = await getDomainCollection("shoppingLists");
  return collection.findOne({ _id: shoppingListId });
}

export async function findActiveShoppingList(
  cafeId: ObjectId,
): Promise<ShoppingList | null> {
  const collection = await getDomainCollection("shoppingLists");
  return collection.findOne({ cafeId, status: "active" });
}

export async function findOrCreateActiveShoppingList(
  cafeId: ObjectId,
  createdBy: ObjectId,
  name: string,
  now: Date,
): Promise<ShoppingList> {
  const existingList = await findActiveShoppingList(cafeId);

  if (existingList) {
    return existingList;
  }

  const collection = await getDomainCollection("shoppingLists");
  const newList: ShoppingList = {
    _id: new ObjectId(),
    cafeId,
    name,
    status: "active",
    items: [],
    createdBy,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await collection.insertOne(newList);
    return newList;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      const concurrentList = await findActiveShoppingList(cafeId);

      if (concurrentList) {
        return concurrentList;
      }
    }

    throw error;
  }
}

export async function appendInternalRequestItemsIfMissing(
  shoppingListId: ObjectId,
  cafeId: ObjectId,
  items: ShoppingListItem[],
  now: Date,
): Promise<AppendShoppingListItemsResult> {
  const collection = await getDomainCollection("shoppingLists");
  const uniqueItems = new Map<string, ShoppingListItem>();

  for (const item of items) {
    if (item.source.type !== "internal_request") {
      continue;
    }

    const key = [
      item.source.internalPurchaseRequestId.toHexString(),
      item.source.requestItemId.toHexString(),
    ].join(":");
    uniqueItems.set(key, item);
  }

  const operations: AnyBulkWriteOperation<ShoppingList>[] = [...uniqueItems.values()].map(
    (item) => {
      if (item.source.type !== "internal_request") {
        throw new Error("Expected internal request provenance.");
      }

      return {
        updateOne: {
          filter: {
            _id: shoppingListId,
            cafeId,
            status: "active",
            items: {
              $not: {
                $elemMatch: {
                  "source.type": "internal_request",
                  "source.internalPurchaseRequestId":
                    item.source.internalPurchaseRequestId,
                  "source.requestItemId": item.source.requestItemId,
                },
              },
            },
          },
          update: {
            $push: { items: item },
            $set: { updatedAt: now },
          },
        },
      };
    },
  );

  const result =
    operations.length > 0
      ? await collection.bulkWrite(operations, { ordered: false })
      : null;
  const shoppingList = await findShoppingListById(shoppingListId);

  return {
    shoppingList,
    addedCount: result?.modifiedCount ?? 0,
  };
}
