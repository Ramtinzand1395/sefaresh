import "server-only";

import type { ObjectId } from "mongodb";
import { objectIdSchema } from "@/domain/schemas/common";
import {
  createSupplierOfferInputSchema,
  updateSupplierOfferInputSchema,
} from "@/domain/schemas/catalog";
import {
  createSupplierOffer,
  DuplicateSupplierOfferError,
  findActiveCatalogProductById,
  findSupplierOfferByProduct,
  getSupplierOfferDetail,
  getSupplierOffers,
  searchActiveCatalogProducts,
  toggleSupplierOfferStatus,
  updateSupplierOffer,
  type CatalogProductItem,
  type SupplierOfferListItem,
} from "@/repositories/supplier-offer-repository";

export type SupplierOfferServiceErrorCode =
  | "DUPLICATE_SUPPLIER_OFFER"
  | "PRODUCT_NOT_AVAILABLE"
  | "SUPPLIER_OFFER_NOT_FOUND_OR_FORBIDDEN"
  | "SUPPLIER_OFFER_CHANGED";

export class SupplierOfferServiceError extends Error {
  constructor(
    public readonly code: SupplierOfferServiceErrorCode,
    message: string,
    public readonly existingOfferId?: ObjectId,
  ) {
    super(message);
    this.name = "SupplierOfferServiceError";
  }
}

function asRecord(input: unknown): Record<string, unknown> {
  return typeof input === "object" && input !== null
    ? input as Record<string, unknown>
    : {};
}

export async function listSupplierOffers(
  supplierIdInput: string | ObjectId,
): Promise<SupplierOfferListItem[]> {
  const supplierId = objectIdSchema.parse(supplierIdInput);
  return getSupplierOffers(supplierId);
}

export async function getSupplierOfferForSupplier(
  supplierIdInput: string | ObjectId,
  offerIdInput: string | ObjectId,
): Promise<SupplierOfferListItem | null> {
  const supplierId = objectIdSchema.parse(supplierIdInput);
  const offerId = objectIdSchema.parse(offerIdInput);
  return getSupplierOfferDetail(supplierId, offerId);
}

export async function searchSupplierProductCatalog(
  query: string,
  limit = 20,
): Promise<CatalogProductItem[]> {
  return searchActiveCatalogProducts(query, limit);
}

export async function createSupplierOfferForSupplier(
  supplierIdInput: string | ObjectId,
  input: unknown,
) {
  const supplierId = objectIdSchema.parse(supplierIdInput);
  const parsedInput = createSupplierOfferInputSchema.parse({
    ...asRecord(input),
    supplierId,
  });
  const product = await findActiveCatalogProductById(parsedInput.productId);

  if (!product) {
    throw new SupplierOfferServiceError(
      "PRODUCT_NOT_AVAILABLE",
      "The selected catalog product is not available.",
    );
  }

  const existingOffer = await findSupplierOfferByProduct(supplierId, parsedInput.productId);
  if (existingOffer) {
    throw new SupplierOfferServiceError(
      "DUPLICATE_SUPPLIER_OFFER",
      "A supplier offer already exists for this product.",
      existingOffer._id,
    );
  }

  try {
    return await createSupplierOffer(supplierId, {
      productId: parsedInput.productId,
      price: parsedInput.price,
      stock: parsedInput.stock,
      minOrderQuantity: parsedInput.minOrderQuantity,
      maxOrderQuantity: parsedInput.maxOrderQuantity,
      deliveryDays: parsedInput.deliveryDays,
      isActive: parsedInput.isActive,
    });
  } catch (error) {
    if (error instanceof DuplicateSupplierOfferError) {
      const existing = await findSupplierOfferByProduct(supplierId, parsedInput.productId);
      throw new SupplierOfferServiceError(
        "DUPLICATE_SUPPLIER_OFFER",
        "A supplier offer already exists for this product.",
        existing?._id,
      );
    }

    throw error;
  }
}

export async function updateSupplierOfferForSupplier(
  supplierIdInput: string | ObjectId,
  offerIdInput: string | ObjectId,
  input: unknown,
) {
  const supplierId = objectIdSchema.parse(supplierIdInput);
  const offerId = objectIdSchema.parse(offerIdInput);
  const parsedInput = updateSupplierOfferInputSchema.parse(input);
  const updated = await updateSupplierOffer(supplierId, offerId, parsedInput);

  if (!updated) {
    throw new SupplierOfferServiceError(
      "SUPPLIER_OFFER_NOT_FOUND_OR_FORBIDDEN",
      "Supplier offer was not found for this supplier.",
    );
  }

  return updated;
}

export async function toggleSupplierOfferForSupplier(
  supplierIdInput: string | ObjectId,
  offerIdInput: string | ObjectId,
) {
  const supplierId = objectIdSchema.parse(supplierIdInput);
  const offerId = objectIdSchema.parse(offerIdInput);
  const updated = await toggleSupplierOfferStatus(supplierId, offerId);

  if (!updated) {
    throw new SupplierOfferServiceError(
      "SUPPLIER_OFFER_NOT_FOUND_OR_FORBIDDEN",
      "Supplier offer was not found for this supplier.",
    );
  }

  return updated;
}
