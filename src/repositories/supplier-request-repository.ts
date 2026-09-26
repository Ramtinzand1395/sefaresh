import "server-only";

import {
  MongoBulkWriteError,
  ObjectId,
  type AnyBulkWriteOperation,
  type UpdateFilter,
} from "mongodb";
import { collectionNames } from "@/domain/collections";
import type {
  Product,
  SupplierRequest,
  SupplierRequestResponseStatus,
} from "@/domain/types";
import { getDatabase } from "@/lib/mongodb";
import { getDomainCollection } from "@/repositories/domain-collections";

export type SupplierRequestSeed = Pick<
  SupplierRequest,
  | "purchaseRequestId"
  | "requestItemId"
  | "productId"
  | "supplierId"
  | "requestedQuantity"
>;

export type SupplierRequestUpsertResult = {
  candidateCount: number;
  createdCount: number;
  existingCount: number;
};

export type SupplierRequestInboxProduct = Pick<
  Product,
  "_id" | "title" | "slug" | "brand" | "image" | "unit" | "unitValue"
>;

export type SupplierRequestInboxItem = {
  supplierRequestId: ObjectId;
  requestItemId: ObjectId;
  product: SupplierRequestInboxProduct;
  requestedQuantity: number;
  status: SupplierRequest["status"];
  offeredPrice?: number;
  availableQuantity?: number;
  deliveryDays?: number;
  note?: string;
  respondedAt?: Date;
  createdAt: Date;
};

export type SupplierRequestDetailItem = SupplierRequestInboxItem & {
  updatedAt: Date;
};

export type SupplierRequestResponseUpdate = {
  status: SupplierRequestResponseStatus;
  offeredPrice?: number;
  availableQuantity?: number;
  deliveryDays?: number;
  note?: string;
};

function deduplicateSeeds(seeds: SupplierRequestSeed[]): SupplierRequestSeed[] {
  const uniqueSeeds = new Map<string, SupplierRequestSeed>();

  for (const seed of seeds) {
    const key = [
      seed.purchaseRequestId.toHexString(),
      seed.requestItemId.toHexString(),
      seed.supplierId.toHexString(),
    ].join(":");
    uniqueSeeds.set(key, seed);
  }

  return [...uniqueSeeds.values()];
}

export async function upsertSupplierRequests(
  seeds: SupplierRequestSeed[],
  now: Date,
): Promise<SupplierRequestUpsertResult> {
  const uniqueSeeds = deduplicateSeeds(seeds);

  if (uniqueSeeds.length === 0) {
    return { candidateCount: 0, createdCount: 0, existingCount: 0 };
  }

  const collection = await getDomainCollection("supplierRequests");
  const operations: AnyBulkWriteOperation<SupplierRequest>[] = uniqueSeeds.map((seed) => ({
    updateOne: {
      filter: {
        purchaseRequestId: seed.purchaseRequestId,
        requestItemId: seed.requestItemId,
        supplierId: seed.supplierId,
      },
      update: {
        $setOnInsert: {
          _id: new ObjectId(),
          ...seed,
          status: "pending",
          createdAt: now,
          updatedAt: now,
        },
      },
      upsert: true,
    },
  }));

  try {
    const result = await collection.bulkWrite(operations, { ordered: false });
    return {
      candidateCount: uniqueSeeds.length,
      createdCount: result.upsertedCount,
      existingCount: uniqueSeeds.length - result.upsertedCount,
    };
  } catch (error) {
    if (error instanceof MongoBulkWriteError) {
      const writeErrors = Array.isArray(error.writeErrors)
        ? error.writeErrors
        : [error.writeErrors];

      if (
        writeErrors.length === 0 ||
        !writeErrors.every((writeError) => writeError.code === 11000)
      ) {
        throw error;
      }

      return {
        candidateCount: uniqueSeeds.length,
        createdCount: error.result.upsertedCount,
        existingCount: uniqueSeeds.length - error.result.upsertedCount,
      };
    }

    throw error;
  }
}

export async function getSupplierRequestInbox(
  supplierId: ObjectId,
): Promise<SupplierRequestInboxItem[]> {
  const database = await getDatabase();

  return database
    .collection<SupplierRequest>(collectionNames.supplierRequests)
    .aggregate<SupplierRequestInboxItem>([
      { $match: { supplierId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: collectionNames.products,
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          supplierRequestId: "$_id",
          requestItemId: 1,
          product: {
            _id: "$product._id",
            title: "$product.title",
            slug: "$product.slug",
            brand: "$product.brand",
            image: "$product.image",
            unit: "$product.unit",
            unitValue: "$product.unitValue",
          },
          requestedQuantity: 1,
          status: 1,
          offeredPrice: 1,
          availableQuantity: 1,
          deliveryDays: 1,
          note: 1,
          respondedAt: 1,
          createdAt: 1,
        },
      },
    ])
    .toArray();
}

export async function getSupplierRequestDetailForSupplier(
  supplierRequestId: ObjectId,
  supplierId: ObjectId,
): Promise<SupplierRequestDetailItem | null> {
  const database = await getDatabase();
  const results = await database
    .collection<SupplierRequest>(collectionNames.supplierRequests)
    .aggregate<SupplierRequestDetailItem>([
      { $match: { _id: supplierRequestId, supplierId } },
      { $limit: 1 },
      {
        $lookup: {
          from: collectionNames.products,
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          supplierRequestId: "$_id",
          requestItemId: 1,
          product: {
            _id: "$product._id",
            title: "$product.title",
            slug: "$product.slug",
            brand: "$product.brand",
            image: "$product.image",
            unit: "$product.unit",
            unitValue: "$product.unitValue",
          },
          requestedQuantity: 1,
          status: 1,
          offeredPrice: 1,
          availableQuantity: 1,
          deliveryDays: 1,
          note: 1,
          respondedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])
    .toArray();

  return results[0] ?? null;
}

export async function findSupplierRequestForSupplier(
  supplierRequestId: ObjectId,
  supplierId: ObjectId,
): Promise<SupplierRequest | null> {
  const collection = await getDomainCollection("supplierRequests");
  return collection.findOne({ _id: supplierRequestId, supplierId });
}

export async function updateSupplierRequestResponse(
  supplierRequestId: ObjectId,
  supplierId: ObjectId,
  expectedRequestedQuantity: number,
  response: SupplierRequestResponseUpdate,
  now: Date,
): Promise<SupplierRequest | null> {
  const collection = await getDomainCollection("supplierRequests");
  const update: UpdateFilter<SupplierRequest> = {
    $set: {
      status: response.status,
      respondedAt: now,
      updatedAt: now,
      ...(response.offeredPrice !== undefined
        ? { offeredPrice: response.offeredPrice }
        : {}),
      ...(response.availableQuantity !== undefined
        ? { availableQuantity: response.availableQuantity }
        : {}),
      ...(response.deliveryDays !== undefined
        ? { deliveryDays: response.deliveryDays }
        : {}),
      ...(response.note !== undefined ? { note: response.note } : {}),
    },
    $unset: {
      ...(response.offeredPrice === undefined ? { offeredPrice: "" as const } : {}),
      ...(response.availableQuantity === undefined
        ? { availableQuantity: "" as const }
        : {}),
      ...(response.deliveryDays === undefined ? { deliveryDays: "" as const } : {}),
      ...(response.note === undefined ? { note: "" as const } : {}),
    },
  };

  return collection.findOneAndUpdate(
    {
      _id: supplierRequestId,
      supplierId,
      requestedQuantity: expectedRequestedQuantity,
      status: { $ne: "expired" },
    },
    update,
    { returnDocument: "after" },
  );
}

export async function findSupplierRequestsByPurchaseRequestId(
  purchaseRequestId: ObjectId,
): Promise<SupplierRequest[]> {
  const collection = await getDomainCollection("supplierRequests");
  return collection.find({ purchaseRequestId }).toArray();
}

