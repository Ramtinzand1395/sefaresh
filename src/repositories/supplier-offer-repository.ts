import "server-only";

import type { ObjectId } from "mongodb";
import type { SupplierOffer } from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

export type MatchableSupplierOffer = Pick<
  SupplierOffer,
  "_id" | "supplierId" | "productId"
>;

export async function findMatchableOffersByProductIds(
  productIds: ObjectId[],
): Promise<MatchableSupplierOffer[]> {
  if (productIds.length === 0) {
    return [];
  }

  const collection = await getDomainCollection("supplierOffers");

  // Minimum order is intentionally not an eligibility filter; suppliers may still make an offer.
  const offers = await collection
    .find(
      {
        productId: { $in: productIds },
        isActive: true,
        stock: { $gt: 0 },
      },
      { projection: { _id: 1, supplierId: 1, productId: 1 } },
    )
    .toArray();

  return offers.map(({ _id, supplierId, productId }) => ({
    _id,
    supplierId,
    productId,
  }));
}
