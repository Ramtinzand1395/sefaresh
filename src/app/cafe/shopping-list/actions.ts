"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { objectIdSchema, quantitySchema } from "@/domain/schemas/common";
import {
  CurrentCafeIdentityError,
  getCurrentCafeIdentity,
} from "@/lib/current-cafe";
import {
  PurchaseRequestMatchingError,
} from "@/services/purchase-request-matching";
import {
  createPurchaseRequestFromShoppingList,
  PurchaseRequestServiceError,
} from "@/services/purchase-request-service";

export type CreateRfqActionState =
  | { status: "idle" }
  | {
      status: "success";
      purchaseRequestId: string;
      itemCount: number;
      candidateCount: number;
      createdCount: number;
      existingCount: number;
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string>;
    };

const rfqItemPayloadSchema = z.object({
  shoppingListItemId: objectIdSchema,
  quantity: quantitySchema,
  note: z.string().trim().max(500).optional(),
});

const createRfqPayloadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "عنوان استعلام الزامی است.")
    .max(200, "عنوان استعلام نمی‌تواند بیش از ۲۰۰ کاراکتر باشد."),
  neededAt: z.string().optional(),
  expiresAt: z.string().optional(),
  items: z
    .array(rfqItemPayloadSchema)
    .min(1, "حداقل انتخاب یک قلم کالا برای ارسال استعلام الزامی است."),
});

export async function createRfqAction(
  payload: unknown,
): Promise<CreateRfqActionState> {
  try {
    const { cafeId, userId } = getCurrentCafeIdentity();
    const parsed = createRfqPayloadSchema.parse(payload);

    let neededAtDate: Date | undefined;
    if (parsed.neededAt && parsed.neededAt.trim().length > 0) {
      const parsedDate = new Date(parsed.neededAt);
      if (Number.isNaN(parsedDate.getTime())) {
        return {
          status: "error",
          message: "فرمت تاریخ نیاز به کالا نامعتبر است.",
          fieldErrors: { neededAt: "تاریخ معتبر نیست." },
        };
      }
      neededAtDate = parsedDate;
    }

    let expiresAtDate: Date | undefined;
    if (parsed.expiresAt && parsed.expiresAt.trim().length > 0) {
      const parsedDate = new Date(parsed.expiresAt);
      if (Number.isNaN(parsedDate.getTime())) {
        return {
          status: "error",
          message: "فرمت مهلت پاسخ تأمین‌کنندگان نامعتبر است.",
          fieldErrors: { expiresAt: "تاریخ معتبر نیست." },
        };
      }
      expiresAtDate = parsedDate;
    }

    const result = await createPurchaseRequestFromShoppingList({
      cafeId,
      userId,
      title: parsed.title,
      items: parsed.items,
      neededAt: neededAtDate,
      expiresAt: expiresAtDate,
    });

    revalidatePath("/cafe/shopping-list");
    revalidatePath("/cafe/requests");

    const candidateCount = result.matchingResult.candidateCount;
    const createdCount = result.matchingResult.createdCount;
    const existingCount = result.matchingResult.existingCount;

    let message = "";
    if (candidateCount > 0) {
      message = `استعلام با موفقیت برای ${createdCount} تأمین‌کننده واجد شرایط ارسال شد.`;
    } else {
      message = "استعلام ثبت شد، اما در حال حاضر تأمین‌کننده واجد شرایطی برای این کالاها پیدا نشد.";
    }

    return {
      status: "success",
      purchaseRequestId: result.purchaseRequest._id.toHexString(),
      itemCount: result.purchaseRequest.items.length,
      candidateCount,
      createdCount,
      existingCount,
      message,
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
        message: "اطلاعات ارسالی استعلام معتبر نیست. لطفاً فرم را بررسی کنید.",
        fieldErrors,
      };
    }

    if (error instanceof PurchaseRequestServiceError) {
      const messages: Record<string, string> = {
        NOT_CAFE_MEMBER: "شما دسترسی مجاز در این مجموعه را ندارید.",
        SHOPPING_LIST_NOT_FOUND: "لیست خرید جاری یافت نشد.",
        SHOPPING_LIST_NOT_ACTIVE: "لیست خرید در وضعیت فعال قرار ندارد.",
        SHOPPING_LIST_EMPTY: "لیست خرید خالی است.",
        NO_ELIGIBLE_ITEMS: "هیچ کالای معتبری برای استعلام انتخاب نشده است.",
        INVALID_ITEMS: "این قلم هنوز به کالای کاتالوگ متصل نشده و قابل ارسال برای تأمین‌کنندگان نیست.",
        ITEM_NOT_FOUND_IN_SHOPPING_LIST: "یک یا چند قلم انتخاب‌شده در لیست خرید فعال موجود نیستند.",
        INVALID_TITLE: "عنوان استعلام نامعتبر است.",
        INVALID_EXPIRES_AT: "مهلت ارسال پیشنهاد باید در تاریخ و ساعت آینده باشد.",
        INVALID_NEEDED_AT: "تاریخ تحویل کالا باید در آینده باشد.",
      };
      return {
        status: "error",
        message: messages[error.code] ?? error.message,
      };
    }

    if (error instanceof PurchaseRequestMatchingError) {
      const messages: Record<string, string> = {
        PURCHASE_REQUEST_NOT_FOUND: "استعلام ثبت‌شده جهت تطبیق یافت نشد.",
        PURCHASE_REQUEST_EXPIRED: "مهلت زمانی استعلام منقضی شده است.",
        PURCHASE_REQUEST_NOT_MATCHABLE: "امکان انطباق این استعلام با تأمین‌کنندگان وجود ندارد.",
      };
      return {
        status: "error",
        message: messages[error.code] ?? "خطا در فرآیند تطبیق تأمین‌کنندگان.",
      };
    }

    if (error instanceof CurrentCafeIdentityError) {
      return {
        status: "error",
        message: "هویت کافه در محیط توسعه تنظیم نشده است. متغیرهای محیطی را بررسی کنید.",
      };
    }

    return {
      status: "error",
      message: "خطای پیش‌بینی نشده در ایجاد استعلام خرید. لطفاً دوباره تلاش کنید.",
    };
  }
}
