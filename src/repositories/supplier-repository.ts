import "server-only";

import type { ObjectId } from "mongodb";
import { getDomainCollection } from "@/repositories/domain-collections";

export async function findEligibleSupplierIds(supplierIds: ObjectId[]): Promise<Set<string>> {
  if (supplierIds.length === 0) {
    return new Set();
  }

  const collection = await getDomainCollection("suppliers");
  const suppliers = await collection
    .find(
      {
        _id: { $in: supplierIds },
        status: "active",
        isVerified: true,
      },
      { projection: { _id: 1 } },
    )
    .toArray();

  return new Set(suppliers.map((supplier) => supplier._id.toHexString()));
}

export type SupplierSummary = {
  _id: ObjectId;
  name: string;
  isVerified: boolean;
  rating: number;
  status: string;
};

export async function findSuppliersByIds(
  supplierIds: ObjectId[],
): Promise<SupplierSummary[]> {
  if (supplierIds.length === 0) {
    return [];
  }

  const collection = await getDomainCollection("suppliers");
  return collection
    .find(
      { _id: { $in: supplierIds } },
      { projection: { _id: 1, name: 1, isVerified: 1, rating: 1, status: 1 } },
    )
    .toArray() as Promise<SupplierSummary[]>;
}

