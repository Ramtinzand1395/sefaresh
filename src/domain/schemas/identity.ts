import "server-only";

import { z } from "zod";
import {
  addressSchema,
  documentShape,
  nameSchema,
  objectIdSchema,
  phoneSchema,
} from "@/domain/schemas/common";

export const systemRoleSchema = z.enum([
  "user",
  "super_admin",
  "operations",
  "support",
  "finance",
]);

export const userSchema = z.object({
  ...documentShape,
  name: nameSchema,
  phone: phoneSchema,
  isActive: z.boolean(),
  systemRole: systemRoleSchema.optional(),
});

export const createUserInputSchema = userSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const cafeTypeSchema = z.enum(["cafe", "restaurant", "cafe_restaurant", "other"]);

export const cafeSchema = z.object({
  ...documentShape,
  name: nameSchema,
  type: cafeTypeSchema,
  phone: phoneSchema,
  address: addressSchema,
  isActive: z.boolean(),
});

export const createCafeInputSchema = cafeSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const cafeMemberRoleSchema = z.enum([
  "owner",
  "manager",
  "purchase_manager",
  "chef",
  "barista",
  "staff",
]);

export const cafeMemberSchema = z.object({
  ...documentShape,
  cafeId: objectIdSchema,
  userId: objectIdSchema,
  role: cafeMemberRoleSchema,
  isActive: z.boolean(),
});

export const createCafeMemberInputSchema = cafeMemberSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const supplierStatusSchema = z.enum(["pending", "active", "suspended"]);

export const supplierSchema = z.object({
  ...documentShape,
  name: nameSchema,
  ownerId: objectIdSchema,
  description: z.string().trim().min(1).max(2_000),
  phone: phoneSchema,
  address: addressSchema,
  status: supplierStatusSchema,
  rating: z.number().finite().min(0).max(5),
  isVerified: z.boolean(),
});

export const createSupplierInputSchema = supplierSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
