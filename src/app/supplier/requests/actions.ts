"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { respondToSupplierRequestInputSchema } from "@/domain/schemas/purchasing";
import type { SupplierResponseActionState } from "@/components/supplier/requests/supplier-request-types";
import {
  CurrentSupplierIdentityError,
  getCurrentSupplierId,
} from "@/lib/current-supplier";
import {
  respondToSupplierRequest,
  SupplierRequestServiceError,
} from "@/services/supplier-request-service";

function optionalText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? Number(value) : undefined;
}

function validationState(error: z.ZodError): SupplierResponseActionState {
  const messages: Record<string, string> = {
    supplierRequestId: "شناسه درخواست معتبر نیست.",
    status: "یکی از وضعیت‌های پاسخ را انتخاب کنید.",
    offeredPrice: "قیمت پیشنهادی باید یک عدد صحیح و نامنفی باشد.",
    availableQuantity: "مقدار قابل تأمین باید بیشتر از صفر باشد.",
    deliveryDays: "زمان تحویل باید تعداد روز صحیح و نامنفی باشد.",
    note: "یادداشت واردشده معتبر نیست.",
  };
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= messages[field] ?? "مقدار واردشده معتبر نیست.";
  }

  return {
    status: "error",
    message: "اطلاعات پاسخ را بررسی و دوباره تلاش کنید.",
    fieldErrors,
  };
}

export async function submitSupplierResponse(
  _previousState: SupplierResponseActionState,
  formData: FormData,
): Promise<SupplierResponseActionState> {
  try {
    const supplierId = getCurrentSupplierId();
    const parsedInput = respondToSupplierRequestInputSchema.parse({
      supplierRequestId: optionalText(formData, "supplierRequestId"),
      supplierId,
      status: optionalText(formData, "status"),
      offeredPrice: optionalNumber(formData, "offeredPrice"),
      availableQuantity: optionalNumber(formData, "availableQuantity"),
      deliveryDays: optionalNumber(formData, "deliveryDays"),
      note: optionalText(formData, "note"),
    });

    const result = await respondToSupplierRequest(parsedInput);
    const detailPath = `/supplier/requests/${result.supplierRequestId.toHexString()}`;
    revalidatePath("/supplier/requests");
    revalidatePath(detailPath);

    return {
      status: "success",
      message: "پاسخ شما با موفقیت ثبت شد.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationState(error);
    }

    if (error instanceof SupplierRequestServiceError) {
      if (error.code === "INVALID_PARTIAL_QUANTITY") {
        return {
          status: "error",
          message: "مقدار موجودی جزئی باید کمتر از مقدار درخواستی باشد.",
          fieldErrors: {
            availableQuantity: "عددی کمتر از مقدار درخواستی وارد کنید.",
          },
        };
      }

      const message = error.code === "SUPPLIER_REQUEST_EXPIRED"
        ? "مهلت پاسخ‌گویی به این درخواست به پایان رسیده است."
        : "این درخواست دیگر برای شما قابل پاسخ‌گویی نیست.";

      return { status: "error", message };
    }

    if (error instanceof CurrentSupplierIdentityError) {
      return {
        status: "error",
        message: "هویت تأمین‌کننده در محیط توسعه تنظیم نشده است.",
      };
    }

    return {
      status: "error",
      message: "ثبت پاسخ با خطا روبه‌رو شد. دوباره تلاش کنید.",
    };
  }
}
