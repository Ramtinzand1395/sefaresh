import "server-only";

import { z } from "zod";
import {
  documentShape,
  moneySchema,
  nameSchema,
  nonNegativeQuantitySchema,
  objectIdSchema,
  optionalTextSchema,
  quantitySchema,
} from "@/domain/schemas/common";

export const categorySchema = z.object({
  ...documentShape,
  name: nameSchema,
  slug: z.string().trim().min(1).max(160),
  parentId: objectIdSchema.optional(),
  isActive: z.boolean(),
});

export const createCategoryInputSchema = categorySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const productUnitSchema = z.enum(["piece", "pack", "box", "kg", "gram", "liter", "ml"]);
export const productStatusSchema = z.enum(["draft", "active", "inactive"]);

export const productSchema = z.object({
  ...documentShape,
  title: nameSchema,
  slug: z.string().trim().min(1).max(180),
  categoryId: objectIdSchema,
  brand: z.string().trim().min(1).max(160).optional(),
  description: optionalTextSchema,
  image: z.string().trim().min(1).max(2_048).optional(),
  unit: productUnitSchema,
  unitValue: quantitySchema.optional(),
  status: productStatusSchema,
});

export const createProductInputSchema = productSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

const supplierOfferCommercialShape = {
  price: moneySchema,
  stock: nonNegativeQuantitySchema,
  minOrderQuantity: quantitySchema,
  maxOrderQuantity: quantitySchema.optional(),
  deliveryDays: z.number().int().nonnegative(),
} as const;

const supplierOfferShape = {
  supplierId: objectIdSchema,
  productId: objectIdSchema,
  ...supplierOfferCommercialShape,
  isActive: z.boolean(),
} as const;

function validateOrderQuantityRange(
  value: { minOrderQuantity: number; maxOrderQuantity?: number },
  context: z.RefinementCtx,
) {
  if (
    value.maxOrderQuantity !== undefined &&
    value.maxOrderQuantity < value.minOrderQuantity
  ) {
    context.addIssue({
      code: "custom",
      message: "maxOrderQuantity نباید کمتر از minOrderQuantity باشد",
      path: ["maxOrderQuantity"],
    });
  }
}

export const supplierOfferSchema = z
  .object({ ...documentShape, ...supplierOfferShape })
  .superRefine(validateOrderQuantityRange);

export const createSupplierOfferInputSchema = z
  .object(supplierOfferShape)
  .superRefine(validateOrderQuantityRange);

export const updateSupplierOfferInputSchema = z
  .object(supplierOfferCommercialShape)
  .superRefine(validateOrderQuantityRange);
