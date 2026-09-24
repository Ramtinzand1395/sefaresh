import "server-only";

import { MongoServerError, ObjectId } from "mongodb";
import { collectionNames } from "@/domain/collections";
import type { Product, SupplierOffer, UpdateSupplierOfferInput } from "@/domain/types";
import { getDatabase } from "@/lib/mongodb";
import { getDomainCollection } from "@/repositories/domain-collections";

export type MatchableSupplierOffer = Pick<
  SupplierOffer,
  "_id" | "supplierId" | "productId"
>;

export type SupplierOfferProduct = Pick<
  Product,
  "_id" | "title" | "slug" | "brand" | "image" | "unit" | "unitValue"
>;

export type SupplierOfferListItem = {
  offerId: ObjectId;
  productId: ObjectId;
  product: SupplierOfferProduct;
  price: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  deliveryDays: number;
  isActive: boolean;
  updatedAt: Date;
};

export type CatalogProductItem = SupplierOfferProduct;

export type SupplierOfferCreateFields = Omit<
  SupplierOffer,
  "_id" | "supplierId" | "createdAt" | "updatedAt"
>;

export class DuplicateSupplierOfferError extends Error {
  constructor() {
    super("A supplier offer already exists for this product.");
    this.name = "DuplicateSupplierOfferError";
  }
}

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

export async function getSupplierOffers(
  supplierId: ObjectId,
): Promise<SupplierOfferListItem[]> {
  const database = await getDatabase();

  return database
    .collection<SupplierOffer>(collectionNames.supplierOffers)
    .aggregate<SupplierOfferListItem>([
      { $match: { supplierId } },
      { $sort: { updatedAt: -1 } },
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
          offerId: "$_id",
          productId: 1,
          product: {
            _id: "$product._id",
            title: "$product.title",
            slug: "$product.slug",
            brand: "$product.brand",
            image: "$product.image",
            unit: "$product.unit",
            unitValue: "$product.unitValue",
          },
          price: 1,
          stock: 1,
          minOrderQuantity: 1,
          maxOrderQuantity: 1,
          deliveryDays: 1,
          isActive: 1,
          updatedAt: 1,
        },
      },
    ])
    .toArray();
}

export async function getSupplierOfferDetail(
  supplierId: ObjectId,
  offerId: ObjectId,
): Promise<SupplierOfferListItem | null> {
  const database = await getDatabase();
  const results = await database
    .collection<SupplierOffer>(collectionNames.supplierOffers)
    .aggregate<SupplierOfferListItem>([
      { $match: { _id: offerId, supplierId } },
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
          offerId: "$_id",
          productId: 1,
          product: {
            _id: "$product._id",
            title: "$product.title",
            slug: "$product.slug",
            brand: "$product.brand",
            image: "$product.image",
            unit: "$product.unit",
            unitValue: "$product.unitValue",
          },
          price: 1,
          stock: 1,
          minOrderQuantity: 1,
          maxOrderQuantity: 1,
          deliveryDays: 1,
          isActive: 1,
          updatedAt: 1,
        },
      },
    ])
    .toArray();

  return results[0] ?? null;
}

export async function findSupplierOfferByProduct(
  supplierId: ObjectId,
  productId: ObjectId,
): Promise<Pick<SupplierOffer, "_id"> | null> {
  const collection = await getDomainCollection("supplierOffers");
  return collection.findOne({ supplierId, productId }, { projection: { _id: 1 } });
}

export async function findActiveCatalogProductById(
  productId: ObjectId,
): Promise<Pick<Product, "_id"> | null> {
  const collection = await getDomainCollection("products");
  return collection.findOne({ _id: productId, status: "active" }, { projection: { _id: 1 } });
}

export async function searchActiveCatalogProducts(
  query: string,
  limit = 20,
): Promise<CatalogProductItem[]> {
  const collection = await getDomainCollection("products");
  const normalizedQuery = query.trim();
  const safeLimit = Math.min(Math.max(limit, 1), 30);
  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return collection
    .find(
      {
        status: "active",
        ...(escapedQuery
          ? {
              $or: [
                { title: { $regex: escapedQuery, $options: "i" } },
                { brand: { $regex: escapedQuery, $options: "i" } },
              ],
            }
          : {}),
      },
      {
        projection: {
          _id: 1,
          title: 1,
          slug: 1,
          brand: 1,
          image: 1,
          unit: 1,
          unitValue: 1,
        },
      },
    )
    .sort({ title: 1 })
    .limit(safeLimit)
    .toArray();
}

export async function createSupplierOffer(
  supplierId: ObjectId,
  input: SupplierOfferCreateFields,
): Promise<SupplierOffer> {
  const collection = await getDomainCollection("supplierOffers");
  const now = new Date();
  const offer: SupplierOffer = {
    _id: new ObjectId(),
    supplierId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await collection.insertOne(offer);
    return offer;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new DuplicateSupplierOfferError();
    }

    throw error;
  }
}

export async function updateSupplierOffer(
  supplierId: ObjectId,
  offerId: ObjectId,
  input: UpdateSupplierOfferInput,
): Promise<SupplierOffer | null> {
  const collection = await getDomainCollection("supplierOffers");
  return collection.findOneAndUpdate(
    { _id: offerId, supplierId },
    { $set: { ...input, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function toggleSupplierOfferStatus(
  supplierId: ObjectId,
  offerId: ObjectId,
): Promise<SupplierOffer | null> {
  const collection = await getDomainCollection("supplierOffers");
  const existing = await collection.findOne(
    { _id: offerId, supplierId },
    { projection: { isActive: 1 } },
  );

  if (!existing) {
    return null;
  }

  return collection.findOneAndUpdate(
    { _id: offerId, supplierId, isActive: existing.isActive },
    { $set: { isActive: !existing.isActive, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}
