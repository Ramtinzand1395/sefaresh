"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { objectIdSchema } from "@/domain/schemas/common";
import {
  CurrentCafeIdentityError,
  getCurrentCafeIdentity,
} from "@/lib/current-cafe";
import {
  PurchaseRequestSelectionServiceError,
  savePurchaseRequestSelection,
} from "@/services/purchase-request-selection-service";

export type SaveRfqSelectionActionState =
  | { status: "idle" }
  | {
      status: "success";
      selectionId: string;
      selectedItemCount: number;
      estimatedTotal: number;
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string>;
    };

const saveSelectionPayloadSchema = z.object({
  purchaseRequestId: objectIdSchema,
  items: z
    .array(
      z.object({
        requestItemId: objectIdSchema,
        supplierRequestId: objectIdSchema,
      }),
    )
    .min(1, "حداقل انتخاب یک پیشنهاد برای ذخیره الزامی است."),
});

export async function saveRfqSelectionAction(
  payload: unknown,
): Promise<SaveRfqSelectionActionState> {
  try {
    const { cafeId, userId } = getCurrentCafeIdentity();
    const parsed = saveSelectionPayloadSchema.parse(payload);

    const result = await savePurchaseRequestSelection({
      cafeId,
      userId,
      purchaseRequestId: parsed.purchaseRequestId,
      items: parsed.items,
    });

    const requestIdStr = parsed.purchaseRequestId.toHexString();
    revalidatePath(`/cafe/requests/${requestIdStr}`);
    revalidatePath("/cafe/requests");

    return {
      status: "success",
      selectionId: result.selection._id.toHexString(),
      selectedItemCount: result.selectedItemCount,
      estimatedTotal: result.estimatedTotal,
      message: `انتخاب ${result.selectedItemCount} قلم از پیشنهادهای تأمین‌کنندگان با موفقیت ذخیره شد.`,
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
        message: "اطلاعات ارسالی انتخاب پیشنهادها معتبر نیست.",
        fieldErrors,
      };
    }

    if (error instanceof PurchaseRequestSelectionServiceError) {
      const messages: Record<string, string> = {
        NOT_CAFE_MEMBER: "شما عضو فعال این مجموعه نیستید.",
        PURCHASE_REQUEST_NOT_FOUND: "استعلام خرید مورد نظر یافت نشد.",
        PURCHASE_REQUEST_CANCELLED: "این استعلام قبلاً لغو شده است.",
        SUPPLIER_REQUEST_CHANGED:
          "یکی از پیشنهادهای انتخاب‌شده تغییر کرده است. لطفاً پیشنهادها را دوباره بررسی کنید.",
        INVALID_SELECTION: "اطلاعات انتخاب‌شده برای اقلام با استعلام تطابق ندارد.",
        MISSING_ITEM_SELECTION:
          "لطفاً برای تمام اقلامی که پیشنهاد قیمت دارند، تأمین‌کننده مورد نظر را انتخاب کنید.",
        NO_VALID_RESPONSES: "پیشنهاد معتبری برای انتخاب ثبت نشده است.",
      };
      return {
        status: "error",
        message: messages[error.code] ?? error.message,
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
      message: "خطای پیش‌بینی نشده در ذخیره انتخاب پیشنهادها. لطفاً دوباره تلاش کنید.",
    };
  }
}
