"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { objectIdSchema, quantitySchema } from "@/domain/schemas/common";
import {
  internalPurchaseRequestPrioritySchema,
  submitInternalPurchaseRequestItemSchema,
} from "@/domain/schemas/purchasing";
import type { CatalogProductSearchView } from "@/components/cafe/requests/cafe-request-types";
import {
  CurrentCafeIdentityError,
  getCurrentCafeIdentity,
} from "@/lib/current-cafe";
import { searchActiveCatalogProducts } from "@/repositories/supplier-offer-repository";
import {
  createInternalPurchaseRequest,
  InternalPurchaseRequestServiceError,
  reviewInternalPurchaseRequest,
} from "@/services/internal-purchase-request-service";
import {
  addApprovedInternalRequestToShoppingList,
  ShoppingListServiceError,
} from "@/services/shopping-list-service";

export type CafeRequestActionState = {
  status: "idle" | "success" | "error";
  message: string;
  requestId?: string;
  fieldErrors?: Record<string, string>;
};

const createRequestPayloadSchema = z.object({
  priority: internalPurchaseRequestPrioritySchema,
  reason: z.string().trim().max(500).optional(),
  items: z.array(submitInternalPurchaseRequestItemSchema).min(1, "حداقل یک قلم کالا الزامی است."),
});

const reviewItemPayloadSchema = z.object({
  requestItemId: objectIdSchema,
  approvalStatus: z.enum(["approved", "rejected"]),
  approvedQuantity: z.number().int().nonnegative(),
});

const reviewRequestPayloadSchema = z.object({
  requestId: objectIdSchema,
  reviewNote: z.string().trim().max(500).optional(),
  items: z.array(reviewItemPayloadSchema).min(1),
});

export async function searchRequestCatalogProductsAction(
  query: string,
): Promise<CatalogProductSearchView[]> {
  try {
    getCurrentCafeIdentity();
    const products = await searchActiveCatalogProducts(query, 20);
    return products.map((p) => ({
      productId: p._id.toHexString(),
      title: p.title,
      brand: p.brand,
      unit: p.unit,
    }));
  } catch {
    return [];
  }
}

export async function createInternalPurchaseRequestAction(
  payload: unknown,
): Promise<CafeRequestActionState> {
  try {
    const { cafeId, userId } = getCurrentCafeIdentity();
    const parsedPayload = createRequestPayloadSchema.parse(payload);

    const created = await createInternalPurchaseRequest({
      cafeId,
      requestedBy: userId,
      priority: parsedPayload.priority,
      reason: parsedPayload.reason || undefined,
      items: parsedPayload.items,
    });

    revalidatePath("/cafe/requests");

    return {
      status: "success",
      message: "درخواست خرید با موفقیت ثبت شد.",
      requestId: created._id.toHexString(),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = issue.path.join(".");
        fieldErrors[key] = issue.message;
      }
      return {
        status: "error",
        message: "اطلاعات درخواست معتبر نیست. لطفاً موارد را بررسی کنید.",
        fieldErrors,
      };
    }

    if (error instanceof InternalPurchaseRequestServiceError) {
      const messages: Record<string, string> = {
        NOT_CAFE_MEMBER: "شما عضو فعال این مجموعه نیستید.",
        PRODUCT_NOT_FOUND_OR_INACTIVE: "کالای انتخاب‌شده در سیستم فعال نیست.",
      };
      return {
        status: "error",
        message: messages[error.code] ?? "ثبت درخواست خرید با خطا مواجه شد.",
      };
    }

    if (error instanceof CurrentCafeIdentityError) {
      return {
        status: "error",
        message: "هویت کافه در محیط توسعه تنظیم نشده است.",
      };
    }

    return {
      status: "error",
      message: "خطای پیش‌بینی نشده در ثبت درخواست. لطفاً دوباره تلاش کنید.",
    };
  }
}

export async function reviewInternalPurchaseRequestAction(
  payload: unknown,
): Promise<CafeRequestActionState> {
  try {
    const { userId } = getCurrentCafeIdentity();
    const parsed = reviewRequestPayloadSchema.parse(payload);

    const reviewItems = parsed.items.map((item) => {
      if (item.approvalStatus === "approved") {
        return {
          requestItemId: item.requestItemId,
          approvalStatus: "approved" as const,
          approvedQuantity: quantitySchema.parse(item.approvedQuantity),
        };
      }
      return {
        requestItemId: item.requestItemId,
        approvalStatus: "rejected" as const,
        approvedQuantity: 0 as const,
      };
    });

    const reviewed = await reviewInternalPurchaseRequest({
      internalPurchaseRequestId: parsed.requestId,
      reviewedBy: userId,
      reviewNote: parsed.reviewNote || undefined,
      items: reviewItems,
    });

    const detailPath = `/cafe/requests/${reviewed._id.toHexString()}`;
    revalidatePath("/cafe/requests");
    revalidatePath(detailPath);

    return {
      status: "success",
      message: "بررسی درخواست با موفقیت ثبت شد.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: "اطلاعات بررسی معتبر نیست. مقدار تأییدشده هر قلم را بررسی کنید.",
      };
    }

    if (error instanceof InternalPurchaseRequestServiceError) {
      const messages: Record<string, string> = {
        NOT_CAFE_MEMBER: "شما عضو فعال این مجموعه نیستید.",
        NOT_ALLOWED_TO_REVIEW: "شما دسترسی مجاز برای بررسی این درخواست را ندارید.",
        REQUEST_NOT_FOUND: "درخواست موردنظر یافت نشد.",
        REQUEST_ALREADY_REVIEWED: "این درخواست قبلاً بررسی شده است.",
        INVALID_REVIEW: "اطلاعات بررسی معتبر نیست. مقادیر وارد شده را بررسی کنید.",
      };
      return {
        status: "error",
        message: messages[error.code] ?? "ثبت بررسی درخواست با خطا روبه‌رو شد.",
      };
    }

    if (error instanceof CurrentCafeIdentityError) {
      return {
        status: "error",
        message: "هویت کافه در محیط توسعه تنظیم نشده است.",
      };
    }

    return {
      status: "error",
      message: "خطایی در ثبت بررسی رخ داد. دوباره تلاش کنید.",
    };
  }
}

export async function addApprovedRequestToShoppingListAction(
  requestId: string,
): Promise<{ status: "success" | "error"; message: string }> {
  try {
    const { userId } = getCurrentCafeIdentity();
    const parsedRequestId = objectIdSchema.parse(requestId);

    const result = await addApprovedInternalRequestToShoppingList({
      internalPurchaseRequestId: parsedRequestId,
      addedBy: userId,
    });

    revalidatePath(`/cafe/requests/${requestId}`);
    revalidatePath("/cafe/shopping-list");

    if (result.addedItemCount > 0) {
      return {
        status: "success",
        message: `${result.addedItemCount} قلم به لیست خرید اضافه شد.`,
      };
    }

    return {
      status: "success",
      message: "اقلام تأییدشده قبلاً به لیست خرید اضافه شده‌اند.",
    };
  } catch (error) {
    if (error instanceof ShoppingListServiceError) {
      const messages: Record<string, string> = {
        NOT_CAFE_MEMBER: "شما عضو فعال این مجموعه نیستید.",
        REQUEST_NOT_FOUND: "درخواست موردنظر یافت نشد.",
        REQUEST_NOT_REVIEWED: "درخواست هنوز بررسی نشده است.",
        REQUEST_NOT_APPROVED: "تنها درخواست‌های تأییدشده امکان انتقال به لیست خرید دارند.",
        NO_APPROVED_ITEMS: "این درخواست قلم تأییدشده‌ای برای افزودن ندارد.",
        SHOPPING_LIST_NOT_FOUND: "لیست خرید یافت نشد.",
        SHOPPING_LIST_CAFE_MISMATCH: "لیست خرید متعلق به این مجموعه نیست.",
        SHOPPING_LIST_NOT_ACTIVE: "لیست خرید در حال حاضر فعال نیست.",
        SHOPPING_LIST_CHANGED: "لیست خرید پیش از انتقال تغییر کرده است. دوباره تلاش کنید.",
      };
      return {
        status: "error",
        message: messages[error.code] ?? "افزودن به لیست خرید با خطا روبه‌رو شد.",
      };
    }

    if (error instanceof CurrentCafeIdentityError) {
      return {
        status: "error",
        message: "هویت کافه در محیط توسعه تنظیم نشده است.",
      };
    }

    return {
      status: "error",
      message: "افزودن به لیست خرید با خطا مواجه شد. لطفاً دوباره امتحان کنید.",
    };
  }
}
