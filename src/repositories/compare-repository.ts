import "server-only";

import { ObjectId } from "mongodb";
import { collectionNames } from "@/domain/collections";
import type { Product, Supplier, SupplierOffer } from "@/domain/types";
import { getDatabase } from "@/lib/mongodb";

export type CompareProductRecord = Pick<
  Product,
  "_id" | "title" | "brand" | "unit" | "status"
>;

export type CompareOfferRecord = Pick<
  SupplierOffer,
  | "_id"
  | "productId"
  | "supplierId"
  | "price"
  | "stock"
  | "minOrderQuantity"
  | "maxOrderQuantity"
  | "deliveryDays"
  | "isActive"
>;

export type CompareSupplierRecord = Pick<
  Supplier,
  "_id" | "name" | "status" | "isVerified"
>;

export type CompareCatalogData = {
  products: CompareProductRecord[];
  offers: CompareOfferRecord[];
  suppliers: CompareSupplierRecord[];
};

export async function fetchCompareCatalogData(
  productIds: ObjectId[],
): Promise<CompareCatalogData> {
  if (productIds.length === 0) {
    return { products: [], offers: [], suppliers: [] };
  }

  const database = await getDatabase();

  // Query 1: Batch fetch all requested products
  const products = await database
    .collection<Product>(collectionNames.products)
    .find(
      { _id: { $in: productIds } },
      {
        projection: {
          _id: 1,
          title: 1,
          brand: 1,
          unit: 1,
          status: 1,
        },
      },
    )
    .toArray();

  // Query 2: Batch fetch all offers associated with these products
  const offers = await database
    .collection<SupplierOffer>(collectionNames.supplierOffers)
    .find(
      { productId: { $in: productIds } },
      {
        projection: {
          _id: 1,
          productId: 1,
          supplierId: 1,
          price: 1,
          stock: 1,
          minOrderQuantity: 1,
          maxOrderQuantity: 1,
          deliveryDays: 1,
          isActive: 1,
        },
      },
    )
    .toArray();

  // Query 3: Batch fetch suppliers for all offers (safe buyer-facing fields only)
  const supplierIdHexes = new Set<string>();
  for (const offer of offers) {
    supplierIdHexes.add(offer.supplierId.toHexString());
  }

  const supplierObjectIds = Array.from(supplierIdHexes).map(
    (hex) => new ObjectId(hex),
  );

  const suppliers = supplierObjectIds.length > 0
    ? await database
        .collection<Supplier>(collectionNames.suppliers)
        .find(
          { _id: { $in: supplierObjectIds } },
          {
            projection: {
              _id: 1,
              name: 1,
              status: 1,
              isVerified: 1,
            },
          },
        )
        .toArray()
    : [];

  return {
    products,
    offers,
    suppliers,
  };
}
