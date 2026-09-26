import "server-only";

import { ObjectId } from "mongodb";
import { quantitySchema } from "@/domain/schemas/common";
import { purchaseRequestSchema } from "@/domain/schemas/purchasing";
import type { PurchaseRequest, PurchaseRequestItem } from "@/domain/types";
import { findActiveCafeMember } from "@/repositories/cafe-membership-repository";
import {
  findPurchaseRequestByIdForCafe,
  insertPurchaseRequest,
} from "@/repositories/purchase-request-repository";
import { findActiveShoppingList } from "@/repositories/shopping-list-repository";
import {
  matchPurchaseRequest,
  type PurchaseRequestMatchingResult,
} from "@/services/purchase-request-matching";

export type PurchaseRequestServiceErrorCode =
  | "NOT_CAFE_MEMBER"
  | "SHOPPING_LIST_NOT_FOUND"
  | "SHOPPING_LIST_NOT_ACTIVE"
  | "SHOPPING_LIST_EMPTY"
  | "NO_ELIGIBLE_ITEMS"
  | "INVALID_ITEMS"
  | "ITEM_NOT_FOUND_IN_SHOPPING_LIST"
  | "INVALID_TITLE"
  | "INVALID_EXPIRES_AT"
  | "INVALID_NEEDED_AT";

export class PurchaseRequestServiceError extends Error {
  constructor(
    public readonly code: PurchaseRequestServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PurchaseRequestServiceError";
  }
}

export type CreatePurchaseRequestItemInput = {
  shoppingListItemId: ObjectId;
  quantity: number;
  note?: string;
};

export type CreatePurchaseRequestFromShoppingListInput = {
  cafeId: ObjectId;
  userId: ObjectId;
  title: string;
  items: CreatePurchaseRequestItemInput[];
  neededAt?: Date;
  expiresAt?: Date;
};

export type CreatePurchaseRequestFromShoppingListResult = {
  purchaseRequest: PurchaseRequest;
  matchingResult: PurchaseRequestMatchingResult;
};

export async function createPurchaseRequestFromShoppingList(
  input: CreatePurchaseRequestFromShoppingListInput,
): Promise<CreatePurchaseRequestFromShoppingListResult> {
  const { cafeId, userId } = input;

  const membership = await findActiveCafeMember(cafeId, userId);
  if (!membership) {
    throw new PurchaseRequestServiceError(
      "NOT_CAFE_MEMBER",
      "کاربر عضو فعال این کافه نیست.",
    );
  }

  const shoppingList = await findActiveShoppingList(cafeId);
  if (!shoppingList) {
    throw new PurchaseRequestServiceError(
      "SHOPPING_LIST_NOT_FOUND",
      "لیست خرید فعال برای این مجموعه یافت نشد.",
    );
  }

  if (shoppingList.status !== "active") {
    throw new PurchaseRequestServiceError(
      "SHOPPING_LIST_NOT_ACTIVE",
      "لیست خرید در وضعیت فعال قرار ندارد.",
    );
  }

  if (shoppingList.items.length === 0) {
    throw new PurchaseRequestServiceError(
      "SHOPPING_LIST_EMPTY",
      "لیست خرید جاری خالی است.",
    );
  }

  if (!input.items || input.items.length === 0) {
    throw new PurchaseRequestServiceError(
      "NO_ELIGIBLE_ITEMS",
      "حداقل یک قلم کالا برای ارسال استعلام باید انتخاب شود.",
    );
  }

  const itemsMap = new Map(
    shoppingList.items.map((item) => [item.id.toHexString(), item]),
  );

  const purchaseRequestItems: PurchaseRequestItem[] = [];

  for (const requestedItem of input.items) {
    const key = requestedItem.shoppingListItemId.toHexString();
    const existingShoppingItem = itemsMap.get(key);

    if (!existingShoppingItem) {
      throw new PurchaseRequestServiceError(
        "ITEM_NOT_FOUND_IN_SHOPPING_LIST",
        "یکی از اقلام انتخاب‌شده در لیست خرید فعال موجود نیست یا حذف شده است.",
      );
    }

    if (!existingShoppingItem.productId) {
      throw new PurchaseRequestServiceError(
        "INVALID_ITEMS",
        "این قلم هنوز به کالای کاتالوگ متصل نشده و قابل ارسال برای تأمین‌کنندگان نیست.",
      );
    }

    const quantityParse = quantitySchema.safeParse(requestedItem.quantity);
    if (!quantityParse.success) {
      throw new PurchaseRequestServiceError(
        "INVALID_ITEMS",
        "تعداد هر قلم باید یک عدد صحیح مثبت باشد.",
      );
    }

    const itemNote = requestedItem.note?.trim() || existingShoppingItem.note?.trim();

    purchaseRequestItems.push({
      id: new ObjectId(),
      productId: existingShoppingItem.productId,
      quantity: quantityParse.data,
      ...(itemNote ? { note: itemNote } : {}),
    });
  }

  const trimmedTitle = input.title?.trim();
  if (!trimmedTitle || trimmedTitle.length === 0) {
    throw new PurchaseRequestServiceError(
      "INVALID_TITLE",
      "عنوان استعلام الزامی است.",
    );
  }
  if (trimmedTitle.length > 200) {
    throw new PurchaseRequestServiceError(
      "INVALID_TITLE",
      "عنوان استعلام حداکثر می‌تواند ۲۰۰ کاراکتر باشد.",
    );
  }

  const now = new Date();

  if (input.expiresAt !== undefined && input.expiresAt <= now) {
    throw new PurchaseRequestServiceError(
      "INVALID_EXPIRES_AT",
      "مهلت ارسال پیشنهاد تأمین‌کنندگان باید در تاریخ و ساعت آینده باشد.",
    );
  }

  if (input.neededAt !== undefined && input.neededAt <= now) {
    throw new PurchaseRequestServiceError(
      "INVALID_NEEDED_AT",
      "تاریخ نیاز به کالا باید در آینده باشد.",
    );
  }

  const purchaseRequestCandidate = {
    _id: new ObjectId(),
    cafeId,
    createdBy: userId,
    title: trimmedTitle,
    items: purchaseRequestItems,
    status: "draft" as const,
    createdAt: now,
    updatedAt: now,
    ...(input.neededAt ? { neededAt: input.neededAt } : {}),
    ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
  };

  const parsedRequest = purchaseRequestSchema.parse(purchaseRequestCandidate);
  const created = await insertPurchaseRequest(parsedRequest);

  const matchingResult = await matchPurchaseRequest(created._id);

  return {
    purchaseRequest: created,
    matchingResult,
  };
}

export async function getPurchaseRequestDetailForCafe(
  requestId: ObjectId,
  cafeId: ObjectId,
): Promise<PurchaseRequest | null> {
  return findPurchaseRequestByIdForCafe(requestId, cafeId);
}
