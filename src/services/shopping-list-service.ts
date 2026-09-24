import "server-only";

import { ObjectId } from "mongodb";
import { addApprovedInternalRequestToShoppingListInputSchema } from "@/domain/schemas/purchasing";
import type {
  AddApprovedInternalRequestToShoppingListInput,
  ShoppingList,
  ShoppingListItem,
} from "@/domain/types";
import { findActiveCafeMember } from "@/repositories/cafe-membership-repository";
import { findInternalPurchaseRequestById } from "@/repositories/internal-purchase-request-repository";
import {
  appendInternalRequestItemsIfMissing,
  findOrCreateActiveShoppingList,
  findShoppingListById,
} from "@/repositories/shopping-list-repository";

const DEFAULT_ACTIVE_LIST_NAME = "لیست خرید جاری";

export type ShoppingListServiceErrorCode =
  | "NOT_CAFE_MEMBER"
  | "REQUEST_NOT_FOUND"
  | "REQUEST_NOT_REVIEWED"
  | "REQUEST_NOT_APPROVED"
  | "NO_APPROVED_ITEMS"
  | "SHOPPING_LIST_NOT_FOUND"
  | "SHOPPING_LIST_CAFE_MISMATCH"
  | "SHOPPING_LIST_NOT_ACTIVE"
  | "SHOPPING_LIST_CHANGED";

export class ShoppingListServiceError extends Error {
  constructor(
    public readonly code: ShoppingListServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ShoppingListServiceError";
  }
}

export type AddApprovedInternalRequestToShoppingListResult = {
  shoppingList: ShoppingList;
  approvedItemCount: number;
  addedItemCount: number;
  existingItemCount: number;
};

export async function addApprovedInternalRequestToShoppingList(
  input: AddApprovedInternalRequestToShoppingListInput,
): Promise<AddApprovedInternalRequestToShoppingListResult> {
  const parsedInput = addApprovedInternalRequestToShoppingListInputSchema.parse(input);
  const request = await findInternalPurchaseRequestById(
    parsedInput.internalPurchaseRequestId,
  );

  if (!request) {
    throw new ShoppingListServiceError(
      "REQUEST_NOT_FOUND",
      "Internal purchase request was not found.",
    );
  }

  const membership = await findActiveCafeMember(request.cafeId, parsedInput.addedBy);

  if (!membership) {
    throw new ShoppingListServiceError(
      "NOT_CAFE_MEMBER",
      "The actor is not an active member of this cafe.",
    );
  }

  if (request.status === "pending") {
    throw new ShoppingListServiceError(
      "REQUEST_NOT_REVIEWED",
      "A pending internal purchase request cannot be added to a shopping list.",
    );
  }

  if (request.status !== "approved" && request.status !== "partially_approved") {
    throw new ShoppingListServiceError(
      "REQUEST_NOT_APPROVED",
      "Only approved or partially approved requests can be added to a shopping list.",
    );
  }

  const approvedItems = request.items.filter(
    (item) => item.approvalStatus === "approved" && item.approvedQuantity > 0,
  );

  if (approvedItems.length === 0) {
    throw new ShoppingListServiceError(
      "NO_APPROVED_ITEMS",
      "This internal purchase request has no approved items to add.",
    );
  }

  let shoppingList: ShoppingList;

  if (parsedInput.shoppingListId) {
    const selectedList = await findShoppingListById(parsedInput.shoppingListId);

    if (!selectedList) {
      throw new ShoppingListServiceError(
        "SHOPPING_LIST_NOT_FOUND",
        "Shopping list was not found.",
      );
    }

    if (!selectedList.cafeId.equals(request.cafeId)) {
      throw new ShoppingListServiceError(
        "SHOPPING_LIST_CAFE_MISMATCH",
        "The request and shopping list must belong to the same cafe.",
      );
    }

    if (selectedList.status !== "active") {
      throw new ShoppingListServiceError(
        "SHOPPING_LIST_NOT_ACTIVE",
        "Only an active shopping list can receive approved items.",
      );
    }

    shoppingList = selectedList;
  } else {
    shoppingList = await findOrCreateActiveShoppingList(
      request.cafeId,
      parsedInput.addedBy,
      DEFAULT_ACTIVE_LIST_NAME,
      new Date(),
    );
  }

  const shoppingListItems: ShoppingListItem[] = approvedItems.map((item) => ({
    id: new ObjectId(),
    ...(item.productId !== undefined ? { productId: item.productId } : {}),
    ...(item.customTitle !== undefined ? { customTitle: item.customTitle } : {}),
    quantity: item.approvedQuantity,
    ...(item.note !== undefined ? { note: item.note } : {}),
    source: {
      type: "internal_request",
      internalPurchaseRequestId: request._id,
      requestItemId: item.id,
    },
  }));
  const appendResult = await appendInternalRequestItemsIfMissing(
    shoppingList._id,
    request.cafeId,
    shoppingListItems,
    new Date(),
  );

  if (!appendResult.shoppingList || appendResult.shoppingList.status !== "active") {
    throw new ShoppingListServiceError(
      "SHOPPING_LIST_CHANGED",
      "Shopping list changed before approved items could be added.",
    );
  }

  return {
    shoppingList: appendResult.shoppingList,
    approvedItemCount: shoppingListItems.length,
    addedItemCount: appendResult.addedCount,
    existingItemCount: shoppingListItems.length - appendResult.addedCount,
  };
}
