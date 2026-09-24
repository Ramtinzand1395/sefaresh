import type { ObjectId } from "mongodb";
import type {
  CompareOfferReason,
  OfferEvaluation,
  ProductComparison,
  SupplierScenario,
  SupplierScenarioCoveredItem,
  SupplierScenarioMissingItem,
} from "@/domain/types";
import type {
  CompareOfferRecord,
  CompareProductRecord,
  CompareSupplierRecord,
} from "@/repositories/compare-repository";

/**
 * Normalizes compare items deterministically by summing quantities
 * for any duplicate productIds while preserving first-seen item order.
 */
export function normalizeCompareItems(
  items: Array<{ productId: ObjectId; quantity: number }>,
): Array<{ productId: ObjectId; quantity: number }> {
  const mergedMap = new Map<string, { productId: ObjectId; quantity: number }>();

  for (const item of items) {
    const key = item.productId.toHexString();
    const existing = mergedMap.get(key);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      mergedMap.set(key, {
        productId: item.productId,
        quantity: item.quantity,
      });
    }
  }

  return Array.from(mergedMap.values());
}

/**
 * Evaluates an individual supplier offer against a requested quantity and supplier status.
 * Produces machine-readable reason codes when ineligible.
 */
export function evaluateOffer(
  offer: CompareOfferRecord,
  supplier: CompareSupplierRecord | undefined,
  requestedQuantity: number,
): OfferEvaluation {
  const reasons: CompareOfferReason[] = [];

  if (!offer.isActive) {
    reasons.push("OFFER_INACTIVE");
  }

  if (offer.stock <= 0) {
    reasons.push("OUT_OF_STOCK");
  } else if (offer.stock < requestedQuantity) {
    reasons.push("INSUFFICIENT_STOCK");
  }

  if (!supplier || supplier.status !== "active") {
    reasons.push("SUPPLIER_INACTIVE");
  }

  if (!supplier || !supplier.isVerified) {
    reasons.push("SUPPLIER_UNVERIFIED");
  }

  if (requestedQuantity < offer.minOrderQuantity) {
    reasons.push("BELOW_MIN_ORDER");
  }

  if (
    offer.maxOrderQuantity !== undefined &&
    requestedQuantity > offer.maxOrderQuantity
  ) {
    reasons.push("ABOVE_MAX_ORDER");
  }

  const eligible = reasons.length === 0;
  const unitPrice = Math.round(offer.price);
  const lineTotal = Math.round(unitPrice * requestedQuantity);

  return {
    offerId: offer._id,
    productId: offer.productId,
    supplierId: offer.supplierId,
    supplierName: supplier?.name ?? "تأمین‌کننده ناشناس",
    requestedQuantity,
    unitPrice,
    lineTotal,
    stock: offer.stock,
    minOrderQuantity: offer.minOrderQuantity,
    maxOrderQuantity: offer.maxOrderQuantity,
    deliveryDays: offer.deliveryDays,
    eligible,
    reasons,
  };
}

/**
 * Sorts eligible offers deterministically:
 * 1. unitPrice ascending
 * 2. deliveryDays ascending
 * 3. supplierName stable tie-break
 */
export function sortEligibleOffers(
  offers: OfferEvaluation[],
): OfferEvaluation[] {
  return [...offers].sort((a, b) => {
    if (a.unitPrice !== b.unitPrice) {
      return a.unitPrice - b.unitPrice;
    }
    if (a.deliveryDays !== b.deliveryDays) {
      return a.deliveryDays - b.deliveryDays;
    }
    return a.supplierName.localeCompare(b.supplierName);
  });
}

/**
 * Builds a single ProductComparison structure with summaries.
 * Price fields are null when no eligible offer exists (never zero).
 */
export function buildProductComparison(
  product: CompareProductRecord,
  requestedQuantity: number,
  evaluations: OfferEvaluation[],
): ProductComparison {
  const eligibleOffers = sortEligibleOffers(
    evaluations.filter((o) => o.eligible),
  );
  const unavailableOffers = evaluations.filter((o) => !o.eligible);

  const uniqueEligibleSupplierIds = new Set(
    eligibleOffers.map((o) => o.supplierId.toHexString()),
  );

  const hasEligible = eligibleOffers.length > 0;

  const lowestEligiblePrice = hasEligible
    ? Math.min(...eligibleOffers.map((o) => o.unitPrice))
    : null;

  const highestEligiblePrice = hasEligible
    ? Math.max(...eligibleOffers.map((o) => o.unitPrice))
    : null;

  const lowestEligibleLineTotal = hasEligible
    ? Math.min(...eligibleOffers.map((o) => o.lineTotal))
    : null;

  const fastestDeliveryDays = hasEligible
    ? Math.min(...eligibleOffers.map((o) => o.deliveryDays))
    : null;

  return {
    product: {
      _id: product._id,
      title: product.title,
      brand: product.brand,
      unit: product.unit,
      status: product.status,
    },
    requestedQuantity,
    eligibleOffers,
    unavailableOffers,
    eligibleSupplierCount: uniqueEligibleSupplierIds.size,
    lowestEligiblePrice,
    highestEligiblePrice,
    lowestEligibleLineTotal,
    fastestDeliveryDays,
  };
}

/**
 * Groups eligible offers by supplier into scenarios.
 * Also derives completeSupplierScenarios sorted by subtotal asc then maxDeliveryDays asc.
 */
export function buildSupplierScenarios(
  normalizedItems: Array<{ productId: ObjectId; quantity: number }>,
  allEvaluations: OfferEvaluation[],
): {
  supplierScenarios: SupplierScenario[];
  completeSupplierScenarios: SupplierScenario[];
} {
  const totalRequestedItemCount = normalizedItems.length;

  // Group eligible evaluations by supplierId hex
  const supplierEligibleMap = new Map<
    string,
    {
      supplierId: ObjectId;
      supplierName: string;
      offersByProduct: Map<string, OfferEvaluation>;
    }
  >();

  for (const evaluation of allEvaluations) {
    if (!evaluation.eligible) {
      continue;
    }

    const supplierHex = evaluation.supplierId.toHexString();
    let entry = supplierEligibleMap.get(supplierHex);

    if (!entry) {
      entry = {
        supplierId: evaluation.supplierId,
        supplierName: evaluation.supplierName,
        offersByProduct: new Map(),
      };
      supplierEligibleMap.set(supplierHex, entry);
    }

    const productHex = evaluation.productId.toHexString();
    const existing = entry.offersByProduct.get(productHex);

    // If multiple offers exist for same product, choose lowest lineTotal / deliveryDays
    if (
      !existing ||
      evaluation.lineTotal < existing.lineTotal ||
      (evaluation.lineTotal === existing.lineTotal &&
        evaluation.deliveryDays < existing.deliveryDays)
    ) {
      entry.offersByProduct.set(productHex, evaluation);
    }
  }

  const supplierScenarios: SupplierScenario[] = [];

  for (const entry of supplierEligibleMap.values()) {
    const coveredItems: SupplierScenarioCoveredItem[] = [];
    const missingItems: SupplierScenarioMissingItem[] = [];

    let subtotal = 0;
    let maxDeliveryDays: number | null = null;

    for (const item of normalizedItems) {
      const productHex = item.productId.toHexString();
      const offer = entry.offersByProduct.get(productHex);

      if (offer) {
        coveredItems.push({
          productId: item.productId,
          offerId: offer.offerId,
          requestedQuantity: item.quantity,
          unitPrice: offer.unitPrice,
          lineTotal: offer.lineTotal,
          deliveryDays: offer.deliveryDays,
        });
        subtotal += offer.lineTotal;
        maxDeliveryDays =
          maxDeliveryDays === null
            ? offer.deliveryDays
            : Math.max(maxDeliveryDays, offer.deliveryDays);
      } else {
        missingItems.push({
          productId: item.productId,
          requestedQuantity: item.quantity,
        });
      }
    }

    const coveredItemCount = coveredItems.length;
    const completeCoverage = coveredItemCount === totalRequestedItemCount;

    supplierScenarios.push({
      supplierId: entry.supplierId,
      supplierName: entry.supplierName,
      coveredItems,
      missingItems,
      coveredItemCount,
      totalRequestedItemCount,
      subtotal,
      maxDeliveryDays,
      completeCoverage,
    });
  }

  // Sort general supplier scenarios by coverage descending, then subtotal ascending
  supplierScenarios.sort((a, b) => {
    if (b.coveredItemCount !== a.coveredItemCount) {
      return b.coveredItemCount - a.coveredItemCount;
    }
    if (a.subtotal !== b.subtotal) {
      return a.subtotal - b.subtotal;
    }
    if (
      a.maxDeliveryDays !== null &&
      b.maxDeliveryDays !== null &&
      a.maxDeliveryDays !== b.maxDeliveryDays
    ) {
      return a.maxDeliveryDays - b.maxDeliveryDays;
    }
    return a.supplierName.localeCompare(b.supplierName);
  });

  // Extract complete supplier scenarios and sort deterministically:
  // subtotal ascending, then maxDeliveryDays ascending, then supplierName
  const completeSupplierScenarios = supplierScenarios
    .filter((s) => s.completeCoverage)
    .sort((a, b) => {
      if (a.subtotal !== b.subtotal) {
        return a.subtotal - b.subtotal;
      }
      const aDays = a.maxDeliveryDays ?? 0;
      const bDays = b.maxDeliveryDays ?? 0;
      if (aDays !== bDays) {
        return aDays - bDays;
      }
      return a.supplierName.localeCompare(b.supplierName);
    });

  return {
    supplierScenarios,
    completeSupplierScenarios,
  };
}
