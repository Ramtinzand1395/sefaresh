import "server-only";

import { z } from "zod";
import { objectIdSchema } from "@/domain/schemas/common";

export const compareItemInputSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const compareInputSchema = z.object({
  cafeId: objectIdSchema,
  items: z
    .array(compareItemInputSchema)
    .min(1, "At least 1 item is required for comparison")
    .max(50, "At most 50 items can be compared at once"),
});

export const compareOfferReasonSchema = z.enum([
  "OFFER_INACTIVE",
  "OUT_OF_STOCK",
  "INSUFFICIENT_STOCK",
  "BELOW_MIN_ORDER",
  "ABOVE_MAX_ORDER",
  "SUPPLIER_INACTIVE",
  "SUPPLIER_UNVERIFIED",
]);
