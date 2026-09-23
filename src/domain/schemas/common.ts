import "server-only";

import { ObjectId } from "mongodb";
import { z } from "zod";

const objectIdHexSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "شناسه MongoDB نامعتبر است")
  .transform((value) => new ObjectId(value));

export const objectIdSchema = z.union([z.instanceof(ObjectId), objectIdHexSchema]);

export const documentShape = {
  _id: objectIdSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
} as const;

export const nameSchema = z.string().trim().min(1).max(160);
export const phoneSchema = z.string().trim().min(3).max(32);
export const addressSchema = z.string().trim().min(1).max(500);
export const optionalTextSchema = z.string().trim().min(1).max(2_000).optional();
export const moneySchema = z.number().int().nonnegative();
export const quantitySchema = z.number().finite().positive();
export const nonNegativeQuantitySchema = z.number().finite().nonnegative();

type ProductOrCustomTitle = {
  productId?: ObjectId;
  customTitle?: string;
};

export function requireProductOrCustomTitle(
  value: ProductOrCustomTitle,
  context: z.RefinementCtx,
) {
  if (!value.productId && !value.customTitle) {
    context.addIssue({
      code: "custom",
      message: "حداقل یکی از productId یا customTitle الزامی است",
      path: ["customTitle"],
    });
  }
}
