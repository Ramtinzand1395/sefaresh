import "server-only";

import { z } from "zod";
import {
  addressSchema,
  documentShape,
  moneySchema,
  objectIdSchema,
  quantitySchema,
} from "@/domain/schemas/common";

export const cartItemSchema = z.object({
  id: objectIdSchema,
  productId: objectIdSchema,
  supplierId: objectIdSchema,
  offerId: objectIdSchema,
  quantity: quantitySchema,
  priceSnapshot: moneySchema,
});

export const cartSchema = z.object({
  ...documentShape,
  cafeId: objectIdSchema,
  items: z.array(cartItemSchema),
});

export const createCartInputSchema = cartSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
]);

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "partially_fulfilled",
  "completed",
  "cancelled",
]);

export const supplierOrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orderItemSchema = z.object({
  productId: objectIdSchema,
  productTitle: z.string().trim().min(1).max(200),
  quantity: quantitySchema,
  unitPrice: moneySchema,
  totalPrice: moneySchema,
});

export const supplierOrderSchema = z.object({
  id: objectIdSchema,
  supplierId: objectIdSchema,
  items: z.array(orderItemSchema).min(1),
  subtotal: moneySchema,
  deliveryFee: moneySchema,
  total: moneySchema,
  status: supplierOrderStatusSchema,
});

export const orderSchema = z.object({
  ...documentShape,
  cafeId: objectIdSchema,
  createdBy: objectIdSchema,
  supplierOrders: z.array(supplierOrderSchema).min(1),
  subtotal: moneySchema,
  deliveryTotal: moneySchema,
  total: moneySchema,
  paymentStatus: paymentStatusSchema,
  status: orderStatusSchema,
  shippingAddress: addressSchema,
});

export const createOrderInputSchema = orderSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
