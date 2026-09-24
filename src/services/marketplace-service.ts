import "server-only";

import { z } from "zod";
import { objectIdSchema } from "@/domain/schemas/common";
import {
  getMarketplaceCategories,
  getMarketplaceProductDetail,
  searchMarketplaceProducts,
} from "@/repositories/marketplace-repository";

const marketplaceSearchSchema = z.object({
  query: z.string().trim().max(120).default(""),
  categoryId: objectIdSchema.optional(),
  sort: z.enum(["default", "price_asc", "price_desc"]).default("default"),
  limit: z.number().int().positive().max(24).default(24),
});

export type MarketplaceSearchParams = {
  query?: string;
  categoryId?: string;
  sort?: string;
  limit?: number;
};

export async function searchMarketplace(input: MarketplaceSearchParams = {}) {
  const categoryResult = input.categoryId
    ? objectIdSchema.safeParse(input.categoryId)
    : null;
  const parsed = marketplaceSearchSchema.parse({
    query: (input.query ?? "").slice(0, 120),
    categoryId: categoryResult?.success ? categoryResult.data : undefined,
    sort: input.sort === "price_asc" || input.sort === "price_desc"
      ? input.sort
      : "default",
    limit: input.limit,
  });
  return searchMarketplaceProducts(parsed);
}

export async function getMarketplaceDetail(productIdInput: string) {
  const productId = objectIdSchema.safeParse(productIdInput);
  return productId.success ? getMarketplaceProductDetail(productId.data) : null;
}

export async function listMarketplaceCategories() {
  return getMarketplaceCategories(50);
}
