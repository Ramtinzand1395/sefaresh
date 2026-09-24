import "server-only";

import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { compareInputSchema } from "@/domain/schemas/compare";
import { objectIdSchema } from "@/domain/schemas/common";
import type {
  CompareResult,
  OfferEvaluation,
  ProductComparison,
  ShoppingListCompareResult,
  ShoppingListCustomItem,
} from "@/domain/types";
import { fetchCompareCatalogData } from "@/repositories/compare-repository";
import { findActiveShoppingList } from "@/repositories/shopping-list-repository";
import {
  buildProductComparison,
  buildSupplierScenarios,
  evaluateOffer,
  normalizeCompareItems,
} from "@/services/compare-engine";

export type CompareServiceErrorCode =
  | "INVALID_COMPARE_INPUT"
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_INACTIVE"
  | "NO_ACTIVE_SHOPPING_LIST"
  | "NO_COMPARABLE_ITEMS"
  | "CAFE_NOT_ALLOWED";

export class CompareServiceError extends Error {
  constructor(
    public readonly code: CompareServiceErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "CompareServiceError";
  }
}

/**
 * Compares eligible supplier offers for a requested list of products and quantities.
 * Evaluates stock, order limits, supplier verification, and builds single-supplier scenarios.
 */
export async function compareProducts(input: unknown): Promise<CompareResult> {
  let parsedInput;
  try {
    parsedInput = compareInputSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CompareServiceError(
        "INVALID_COMPARE_INPUT",
        "Invalid compare input: " + error.issues.map((i) => i.message).join(", "),
        error.issues,
      );
    }
    throw error;
  }

  // Normalize duplicate products deterministically by summing quantities
  const normalizedItems = normalizeCompareItems(parsedInput.items);

  if (normalizedItems.length === 0) {
    throw new CompareServiceError(
      "INVALID_COMPARE_INPUT",
      "At least one valid item is required for comparison.",
    );
  }

  const productIds = normalizedItems.map((item) => item.productId);

  // Fetch all required data in bounded queries (no N+1)
  const { products, offers, suppliers } = await fetchCompareCatalogData(productIds);

  const productMap = new Map(
    products.map((p) => [p._id.toHexString(), p]),
  );

  // Validate every requested product exists and is active
  for (const item of normalizedItems) {
    const productHex = item.productId.toHexString();
    const product = productMap.get(productHex);

    if (!product) {
      throw new CompareServiceError(
        "PRODUCT_NOT_FOUND",
        `Product ${productHex} was not found.`,
        { productId: item.productId },
      );
    }

    if (product.status !== "active") {
      throw new CompareServiceError(
        "PRODUCT_INACTIVE",
        `Product ${productHex} is not active.`,
        { productId: item.productId, status: product.status },
      );
    }
  }

  const supplierMap = new Map(
    suppliers.map((s) => [s._id.toHexString(), s]),
  );

  // Group offers by productId hex
  const offersByProduct = new Map<string, typeof offers>();
  for (const offer of offers) {
    const pKey = offer.productId.toHexString();
    const existing = offersByProduct.get(pKey);
    if (existing) {
      existing.push(offer);
    } else {
      offersByProduct.set(pKey, [offer]);
    }
  }

  const productComparisons: ProductComparison[] = [];
  const allEvaluations: OfferEvaluation[] = [];

  for (const item of normalizedItems) {
    const productHex = item.productId.toHexString();
    const product = productMap.get(productHex)!;
    const productOffers = offersByProduct.get(productHex) ?? [];

    const evaluations: OfferEvaluation[] = productOffers.map((offer) => {
      const supplier = supplierMap.get(offer.supplierId.toHexString());
      return evaluateOffer(offer, supplier, item.quantity);
    });

    allEvaluations.push(...evaluations);
    productComparisons.push(
      buildProductComparison(product, item.quantity, evaluations),
    );
  }

  const { supplierScenarios, completeSupplierScenarios } = buildSupplierScenarios(
    normalizedItems,
    allEvaluations,
  );

  return {
    products: productComparisons,
    supplierScenarios,
    completeSupplierScenarios,
  };
}

/**
 * Compares supplier offers for the current active ShoppingList belonging to a Cafe.
 *
 * Rules:
 * - Only items with `productId` enter SupplierOffer comparison.
 * - If the ShoppingList contains duplicate `productId` entries, quantities are summed deterministically.
 * - Items with `customTitle` cannot be compared against catalog offers and are returned separately in `unmatchedCustomItems`.
 * - Does not mutate the ShoppingList in the database.
 * - Strictly respects tenant boundary by loading only the active shopping list of the given cafeId.
 */
export async function compareActiveShoppingList(
  cafeIdInput: string | ObjectId,
): Promise<ShoppingListCompareResult> {
  const parsedCafeId = objectIdSchema.safeParse(cafeIdInput);
  if (!parsedCafeId.success) {
    throw new CompareServiceError(
      "INVALID_COMPARE_INPUT",
      "Invalid cafe ID format.",
    );
  }
  const cafeId = parsedCafeId.data;

  const shoppingList = await findActiveShoppingList(cafeId);
  if (!shoppingList) {
    throw new CompareServiceError(
      "NO_ACTIVE_SHOPPING_LIST",
      "No active shopping list found for this cafe.",
    );
  }

  const comparableRawItems: Array<{ productId: ObjectId; quantity: number }> = [];
  const unmatchedCustomItems: ShoppingListCustomItem[] = [];

  for (const item of shoppingList.items) {
    if (item.productId) {
      comparableRawItems.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    } else if (item.customTitle) {
      unmatchedCustomItems.push({
        id: item.id,
        customTitle: item.customTitle,
        quantity: item.quantity,
        note: item.note,
      });
    }
  }

  if (comparableRawItems.length === 0) {
    throw new CompareServiceError(
      "NO_COMPARABLE_ITEMS",
      "The shopping list contains no catalog products to compare.",
      { unmatchedCustomItemsCount: unmatchedCustomItems.length },
    );
  }

  // Normalize duplicate product quantities deterministically
  const normalizedItems = normalizeCompareItems(comparableRawItems);

  const compareResult = await compareProducts({
    cafeId,
    items: normalizedItems,
  });

  return {
    ...compareResult,
    shoppingListId: shoppingList._id,
    unmatchedCustomItems,
  };
}
