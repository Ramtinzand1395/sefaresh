import "server-only";

import { z } from "zod";
import {
  documentShape,
  moneySchema,
  nonNegativeQuantitySchema,
  objectIdSchema,
  optionalTextSchema,
  quantitySchema,
  requireProductOrCustomTitle,
} from "@/domain/schemas/common";

export const internalPurchaseRequestPrioritySchema = z.enum([
  "low",
  "normal",
  "high",
  "urgent",
]);

export const internalPurchaseRequestStatusSchema = z.enum([
  "pending",
  "approved",
  "partially_approved",
  "rejected",
  "cancelled",
]);

export const internalPurchaseRequestItemApprovalStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const internalPurchaseRequestItemSchema = z
  .object({
    id: objectIdSchema,
    productId: objectIdSchema.optional(),
    customTitle: z.string().trim().min(1).max(200).optional(),
    quantity: quantitySchema,
    note: optionalTextSchema,
    approvalStatus: internalPurchaseRequestItemApprovalStatusSchema,
    approvedQuantity: nonNegativeQuantitySchema,
  })
  .superRefine((value, context) => {
    requireProductOrCustomTitle(value, context);

    if (value.approvedQuantity > value.quantity) {
      context.addIssue({
        code: "custom",
        message: "approvedQuantity نباید از quantity بیشتر باشد",
        path: ["approvedQuantity"],
      });
    }
  });

export const internalPurchaseRequestSchema = z.object({
  ...documentShape,
  cafeId: objectIdSchema,
  requestedBy: objectIdSchema,
  items: z.array(internalPurchaseRequestItemSchema).min(1),
  reason: optionalTextSchema,
  priority: internalPurchaseRequestPrioritySchema,
  status: internalPurchaseRequestStatusSchema,
  reviewedBy: objectIdSchema.optional(),
  reviewedAt: z.coerce.date().optional(),
  reviewNote: optionalTextSchema,
});

export const createInternalPurchaseRequestInputSchema = internalPurchaseRequestSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const shoppingListStatusSchema = z.enum(["active", "converted", "archived"]);

export const shoppingListItemSourceSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("manual") }),
  z.object({
    type: z.literal("internal_request"),
    internalPurchaseRequestId: objectIdSchema,
    requestItemId: objectIdSchema,
  }),
]);

export const shoppingListItemSchema = z
  .object({
    id: objectIdSchema,
    productId: objectIdSchema.optional(),
    customTitle: z.string().trim().min(1).max(200).optional(),
    quantity: quantitySchema,
    note: optionalTextSchema,
    source: shoppingListItemSourceSchema,
  })
  .superRefine(requireProductOrCustomTitle);

export const shoppingListSchema = z.object({
  ...documentShape,
  cafeId: objectIdSchema,
  name: z.string().trim().min(1).max(160),
  status: shoppingListStatusSchema,
  items: z.array(shoppingListItemSchema),
  createdBy: objectIdSchema,
});

export const createShoppingListInputSchema = shoppingListSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const purchaseRequestStatusSchema = z.enum([
  "draft",
  "matching",
  "collecting_offers",
  "completed",
  "cancelled",
  "expired",
]);

export const purchaseRequestItemSchema = z.object({
  id: objectIdSchema,
  productId: objectIdSchema,
  quantity: quantitySchema,
  note: optionalTextSchema,
});

export const purchaseRequestSchema = z.object({
  ...documentShape,
  cafeId: objectIdSchema,
  createdBy: objectIdSchema,
  title: z.string().trim().min(1).max(200),
  items: z.array(purchaseRequestItemSchema).min(1),
  neededAt: z.coerce.date().optional(),
  status: purchaseRequestStatusSchema,
  expiresAt: z.coerce.date().optional(),
});

export const createPurchaseRequestInputSchema = purchaseRequestSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const supplierRequestStatusSchema = z.enum([
  "pending",
  "viewed",
  "available",
  "partially_available",
  "unavailable",
  "declined",
  "expired",
]);

export const supplierRequestSchema = z.object({
  ...documentShape,
  purchaseRequestId: objectIdSchema,
  requestItemId: objectIdSchema,
  productId: objectIdSchema,
  supplierId: objectIdSchema,
  requestedQuantity: quantitySchema,
  status: supplierRequestStatusSchema,
  offeredPrice: moneySchema.optional(),
  availableQuantity: nonNegativeQuantitySchema.optional(),
  deliveryDays: z.number().int().nonnegative().optional(),
  note: optionalTextSchema,
  respondedAt: z.coerce.date().optional(),
});

export const createSupplierRequestInputSchema = supplierRequestSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
