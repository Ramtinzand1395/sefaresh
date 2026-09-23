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
