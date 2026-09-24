import "server-only";

import type { Document, ObjectId } from "mongodb";
import { collectionNames } from "@/domain/collections";
import type { Category, Product } from "@/domain/types";
import { getDatabase } from "@/lib/mongodb";
import { getDomainCollection } from "@/repositories/domain-collections";

export type MarketplaceSort = "default" | "price_asc" | "price_desc";

export type MarketplaceProductItem = {
  productId: ObjectId;
  title: string;
  slug: string;
  brand?: string;
  image?: string;
  unit: Product["unit"];
  unitValue?: number;
  categoryId: ObjectId;
  categoryName?: string;
  availableSupplierCount: number;
  lowestPrice: number;
  highestPrice: number;
  totalAvailableStock: number;
};

export type MarketplaceOfferItem = {
  offerId: ObjectId;
  supplierId: ObjectId;
  supplierName: string;
  price: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  deliveryDays: number;
};

export type MarketplaceProductDetail = MarketplaceProductItem & {
  offers: MarketplaceOfferItem[];
};

export type MarketplaceCategoryItem = Pick<Category, "_id" | "name">;

export type MarketplaceSearchInput = {
  query?: string;
  categoryId?: ObjectId;
  sort?: MarketplaceSort;
  limit?: number;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function eligibleOffersLookup(includeSupplierName: boolean): Document {
  return {
    $lookup: {
      from: collectionNames.supplierOffers,
      let: { marketplaceProductId: "$_id" },
      pipeline: [
        {
          $match: {
            isActive: true,
            stock: { $gt: 0 },
            $expr: { $eq: ["$productId", "$$marketplaceProductId"] },
          },
        },
        {
          $lookup: {
            from: collectionNames.suppliers,
            localField: "supplierId",
            foreignField: "_id",
            as: "supplier",
          },
        },
        { $unwind: "$supplier" },
        { $match: { "supplier.status": "active", "supplier.isVerified": true } },
        { $sort: { price: 1 } },
        {
          $project: {
            _id: 0,
            offerId: "$_id",
            supplierId: 1,
            ...(includeSupplierName ? { supplierName: "$supplier.name" } : {}),
            price: 1,
            stock: 1,
            minOrderQuantity: 1,
            maxOrderQuantity: 1,
            deliveryDays: 1,
          },
        },
      ],
      as: "eligibleOffers",
    },
  };
}

function categoryLookup(): Document[] {
  return [
    {
      $lookup: {
        from: collectionNames.categories,
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
  ];
}

function productSummaryProjection(): Document {
  return {
    $project: {
      _id: 0,
      productId: "$_id",
      title: 1,
      slug: 1,
      brand: 1,
      image: 1,
      unit: 1,
      unitValue: 1,
      categoryId: 1,
      categoryName: "$category.name",
      availableSupplierCount: { $size: "$eligibleOffers" },
      lowestPrice: { $min: "$eligibleOffers.price" },
      highestPrice: { $max: "$eligibleOffers.price" },
      totalAvailableStock: { $sum: "$eligibleOffers.stock" },
    },
  };
}

export async function searchMarketplaceProducts(
  input: MarketplaceSearchInput = {},
): Promise<MarketplaceProductItem[]> {
  const database = await getDatabase();
  const query = escapeRegex(input.query?.trim() ?? "");
  const limit = Math.min(Math.max(input.limit ?? 24, 1), 24);
  const sortStage = input.sort === "price_desc"
    ? { lowestPrice: -1 as const, title: 1 as const }
    : input.sort === "price_asc"
      ? { lowestPrice: 1 as const, title: 1 as const }
      : { title: 1 as const };

  return database
    .collection<Product>(collectionNames.products)
    .aggregate<MarketplaceProductItem>([
      {
        $match: {
          status: "active",
          ...(input.categoryId ? { categoryId: input.categoryId } : {}),
          ...(query
            ? {
                $or: [
                  { title: { $regex: query, $options: "i" } },
                  { brand: { $regex: query, $options: "i" } },
                ],
              }
            : {}),
        },
      },
      eligibleOffersLookup(false),
      { $match: { "eligibleOffers.0": { $exists: true } } },
      ...categoryLookup(),
      productSummaryProjection(),
      { $sort: sortStage },
      { $limit: limit },
    ])
    .toArray();
}

export async function getMarketplaceProductDetail(
  productId: ObjectId,
): Promise<MarketplaceProductDetail | null> {
  const database = await getDatabase();
  const results = await database
    .collection<Product>(collectionNames.products)
    .aggregate<MarketplaceProductDetail>([
      { $match: { _id: productId, status: "active" } },
      { $limit: 1 },
      eligibleOffersLookup(true),
      { $match: { "eligibleOffers.0": { $exists: true } } },
      ...categoryLookup(),
      {
        $project: {
          _id: 0,
          productId: "$_id",
          title: 1,
          slug: 1,
          brand: 1,
          image: 1,
          unit: 1,
          unitValue: 1,
          categoryId: 1,
          categoryName: "$category.name",
          availableSupplierCount: { $size: "$eligibleOffers" },
          lowestPrice: { $min: "$eligibleOffers.price" },
          highestPrice: { $max: "$eligibleOffers.price" },
          totalAvailableStock: { $sum: "$eligibleOffers.stock" },
          offers: "$eligibleOffers",
        },
      },
    ])
    .toArray();

  return results[0] ?? null;
}

export async function getMarketplaceCategories(limit = 50): Promise<MarketplaceCategoryItem[]> {
  const collection = await getDomainCollection("categories");
  return collection
    .find({ isActive: true }, { projection: { _id: 1, name: 1 } })
    .sort({ name: 1 })
    .limit(Math.min(Math.max(limit, 1), 50))
    .toArray();
}
