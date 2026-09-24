import "server-only";

import { ObjectId } from "mongodb";
import {
  internalPurchaseRequestSchema,
  reviewInternalPurchaseRequestInputSchema,
  submitInternalPurchaseRequestInputSchema,
} from "@/domain/schemas/purchasing";
import type {
  InternalPurchaseRequest,
  InternalPurchaseRequestItem,
  InternalPurchaseRequestStatus,
  ReviewInternalPurchaseRequestInput,
  SubmitInternalPurchaseRequestInput,
} from "@/domain/types";
import { findActiveCafeMember } from "@/repositories/cafe-membership-repository";
import {
  findActiveProductIds,
  findInternalPurchaseRequestById,
  insertInternalPurchaseRequest,
  reviewPendingInternalPurchaseRequest,
} from "@/repositories/internal-purchase-request-repository";

const REVIEWER_ROLES = new Set(["owner", "manager", "purchase_manager"]);

export type InternalPurchaseRequestServiceErrorCode =
  | "NOT_CAFE_MEMBER"
  | "NOT_ALLOWED_TO_REVIEW"
  | "PRODUCT_NOT_FOUND_OR_INACTIVE"
  | "REQUEST_NOT_FOUND"
  | "REQUEST_ALREADY_REVIEWED"
  | "INVALID_REVIEW";

export class InternalPurchaseRequestServiceError extends Error {
  constructor(
    public readonly code: InternalPurchaseRequestServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "InternalPurchaseRequestServiceError";
  }
}

export async function createInternalPurchaseRequest(
  input: SubmitInternalPurchaseRequestInput,
): Promise<InternalPurchaseRequest> {
  const parsedInput = submitInternalPurchaseRequestInputSchema.parse(input);
  const membership = await findActiveCafeMember(
    parsedInput.cafeId,
    parsedInput.requestedBy,
  );

  if (!membership) {
    throw new InternalPurchaseRequestServiceError(
      "NOT_CAFE_MEMBER",
      "The requester is not an active member of this cafe.",
    );
  }

  const uniqueProductIds = [
    ...new Map(
      parsedInput.items
        .filter((item) => item.productId !== undefined)
        .map((item) => [item.productId!.toHexString(), item.productId!]),
    ).values(),
  ];
  const activeProductIds = await findActiveProductIds(uniqueProductIds);
  const hasUnavailableProduct = uniqueProductIds.some(
    (productId) => !activeProductIds.has(productId.toHexString()),
  );

  if (hasUnavailableProduct) {
    throw new InternalPurchaseRequestServiceError(
      "PRODUCT_NOT_FOUND_OR_INACTIVE",
      "Every referenced product must exist and be active.",
    );
  }

  const now = new Date();
  const request = internalPurchaseRequestSchema.parse({
    _id: new ObjectId(),
    cafeId: parsedInput.cafeId,
    requestedBy: parsedInput.requestedBy,
    items: parsedInput.items.map((item) => ({
      id: new ObjectId(),
      ...(item.productId !== undefined ? { productId: item.productId } : {}),
      ...(item.customTitle !== undefined ? { customTitle: item.customTitle } : {}),
      quantity: item.quantity,
      ...(item.note !== undefined ? { note: item.note } : {}),
      approvalStatus: "pending" as const,
      approvedQuantity: 0,
    })),
    ...(parsedInput.reason !== undefined ? { reason: parsedInput.reason } : {}),
    priority: parsedInput.priority,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  return insertInternalPurchaseRequest(request);
}

function deriveReviewedStatus(
  items: InternalPurchaseRequestItem[],
): Exclude<InternalPurchaseRequestStatus, "pending" | "cancelled"> {
  if (items.every((item) => item.approvalStatus === "rejected")) {
    return "rejected";
  }

  if (
    items.every(
      (item) =>
        item.approvalStatus === "approved" &&
        item.approvedQuantity === item.quantity,
    )
  ) {
    return "approved";
  }

  return "partially_approved";
}

export async function reviewInternalPurchaseRequest(
  input: ReviewInternalPurchaseRequestInput,
): Promise<InternalPurchaseRequest> {
  const parseResult = reviewInternalPurchaseRequestInputSchema.safeParse(input);

  if (!parseResult.success) {
    throw new InternalPurchaseRequestServiceError(
      "INVALID_REVIEW",
      "The item review payload is invalid.",
    );
  }

  const parsedInput = parseResult.data;
  const request = await findInternalPurchaseRequestById(
    parsedInput.internalPurchaseRequestId,
  );

  if (!request) {
    throw new InternalPurchaseRequestServiceError(
      "REQUEST_NOT_FOUND",
      "Internal purchase request was not found.",
    );
  }

  const membership = await findActiveCafeMember(request.cafeId, parsedInput.reviewedBy);

  if (!membership) {
    throw new InternalPurchaseRequestServiceError(
      "NOT_CAFE_MEMBER",
      "The reviewer is not an active member of this cafe.",
    );
  }

  if (!REVIEWER_ROLES.has(membership.role)) {
    throw new InternalPurchaseRequestServiceError(
      "NOT_ALLOWED_TO_REVIEW",
      "This cafe member role cannot review internal purchase requests.",
    );
  }

  if (request.status !== "pending") {
    throw new InternalPurchaseRequestServiceError(
      "REQUEST_ALREADY_REVIEWED",
      "This internal purchase request has already been reviewed.",
    );
  }

  const reviewByItemId = new Map(
    parsedInput.items.map((item) => [item.requestItemId.toHexString(), item]),
  );

  if (
    reviewByItemId.size !== parsedInput.items.length ||
    reviewByItemId.size !== request.items.length
  ) {
    throw new InternalPurchaseRequestServiceError(
      "INVALID_REVIEW",
      "Every request item must be reviewed exactly once.",
    );
  }

  const reviewedItems: InternalPurchaseRequestItem[] = request.items.map((item) => {
    const itemReview = reviewByItemId.get(item.id.toHexString());

    if (!itemReview) {
      throw new InternalPurchaseRequestServiceError(
        "INVALID_REVIEW",
        "Every request item must be reviewed exactly once.",
      );
    }

    if (
      itemReview.approvalStatus === "approved" &&
      itemReview.approvedQuantity > item.quantity
    ) {
      throw new InternalPurchaseRequestServiceError(
        "INVALID_REVIEW",
        "Approved quantity cannot exceed requested quantity.",
      );
    }

    return {
      ...item,
      approvalStatus: itemReview.approvalStatus,
      approvedQuantity:
        itemReview.approvalStatus === "approved"
          ? itemReview.approvedQuantity
          : 0,
    };
  });
  const status = deriveReviewedStatus(reviewedItems);
  const reviewedAt = new Date();
  const updatedRequest = await reviewPendingInternalPurchaseRequest(
    request._id,
    reviewedItems,
    status,
    parsedInput.reviewedBy,
    reviewedAt,
    parsedInput.reviewNote,
  );

  if (!updatedRequest) {
    throw new InternalPurchaseRequestServiceError(
      "REQUEST_ALREADY_REVIEWED",
      "This internal purchase request was reviewed before this update completed.",
    );
  }

  return updatedRequest;
}
