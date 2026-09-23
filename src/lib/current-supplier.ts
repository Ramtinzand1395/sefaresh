import "server-only";

import { objectIdSchema } from "@/domain/schemas/common";

export class CurrentSupplierIdentityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CurrentSupplierIdentityError";
  }
}

export function getCurrentSupplierId() {
  if (process.env.NODE_ENV !== "development") {
    throw new CurrentSupplierIdentityError(
      "Supplier identity requires the future authentication adapter outside development.",
    );
  }

  const parsedSupplierId = objectIdSchema.safeParse(
    process.env.SEFARESH_DEV_SUPPLIER_ID,
  );

  if (!parsedSupplierId.success) {
    throw new CurrentSupplierIdentityError(
      "SEFARESH_DEV_SUPPLIER_ID is missing or invalid.",
    );
  }

  return parsedSupplierId.data;
}
