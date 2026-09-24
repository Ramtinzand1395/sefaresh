"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type {
  CatalogProductView,
  SupplierOfferActionState,
} from "@/components/supplier/products/supplier-offer-types";
import { getCurrentSupplierId } from "@/lib/current-supplier";
import { toCatalogProductView } from "@/lib/supplier-offer-view";
import {
  createSupplierOfferForSupplier,
  searchSupplierProductCatalog,
  SupplierOfferServiceError,
  toggleSupplierOfferForSupplier,
  updateSupplierOfferForSupplier,
} from "@/services/supplier-offer-service";

function optionalText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? Number(value) : undefined;
}

function offerFields(formData: FormData) {
  return {
    price: optionalNumber(formData, "price"),
    stock: optionalNumber(formData, "stock"),
    minOrderQuantity: optionalNumber(formData, "minOrderQuantity"),
    maxOrderQuantity: optionalNumber(formData, "maxOrderQuantity"),
    deliveryDays: optionalNumber(formData, "deliveryDays"),
  };
}

function validationState(error: z.ZodError): SupplierOfferActionState {
  const messages: Record<string, string> = {
    productId: "یک محصول معتبر از کاتالوگ انتخاب کنید.",
    price: "قیمت باید یک عدد صحیح و نامنفی باشد.",
    stock: "موجودی باید یک عدد نامنفی باشد.",
    minOrderQuantity: "حداقل سفارش باید بیشتر از صفر باشد.",
    maxOrderQuantity: "حداکثر سفارش نباید کمتر از حداقل سفارش باشد.",
    deliveryDays: "زمان تحویل باید تعداد روز صحیح و نامنفی باشد.",
  };
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= messages[field] ?? "مقدار واردشده معتبر نیست.";
  }

  return {
    status: "error",
    message: "اطلاعات Offer را بررسی و دوباره تلاش کنید.",
    fieldErrors,
  };
}

function serviceErrorState(error: SupplierOfferServiceError): SupplierOfferActionState {
  if (error.code === "DUPLICATE_SUPPLIER_OFFER") {
    return {
      status: "error",
      message: "این محصول قبلاً به فهرست شما اضافه شده است.",
      existingOfferId: error.existingOfferId?.toHexString(),
    };
  }

  if (error.code === "PRODUCT_NOT_AVAILABLE") {
    return {
      status: "error",
      message: "محصول انتخاب‌شده دیگر در کاتالوگ فعال نیست.",
      fieldErrors: { productId: "محصول دیگری انتخاب کنید." },
    };
  }

  return {
    status: "error",
    message: "این Offer وجود ندارد یا اجازه تغییر آن را ندارید.",
  };
}

export async function searchCatalogProductsAction(query: string): Promise<CatalogProductView[]> {
  getCurrentSupplierId();
  const products = await searchSupplierProductCatalog(query, 20);
  return products.map(toCatalogProductView);
}

export async function createSupplierOfferAction(
  _previousState: SupplierOfferActionState,
  formData: FormData,
): Promise<SupplierOfferActionState> {
  try {
    const supplierId = getCurrentSupplierId();
    await createSupplierOfferForSupplier(supplierId, {
      productId: optionalText(formData, "productId"),
      ...offerFields(formData),
      isActive: formData.get("isActive") === "on",
    });
    revalidatePath("/supplier/products");

    return { status: "success", message: "محصول با موفقیت به فهرست فروش اضافه شد." };
  } catch (error) {
    if (error instanceof z.ZodError) return validationState(error);
    if (error instanceof SupplierOfferServiceError) return serviceErrorState(error);
    return { status: "error", message: "افزودن Offer با خطا روبه‌رو شد." };
  }
}

export async function updateSupplierOfferAction(
  _previousState: SupplierOfferActionState,
  formData: FormData,
): Promise<SupplierOfferActionState> {
  try {
    const supplierId = getCurrentSupplierId();
    const offerId = optionalText(formData, "offerId");
    await updateSupplierOfferForSupplier(supplierId, offerId ?? "", offerFields(formData));
    revalidatePath("/supplier/products");

    return { status: "success", message: "اطلاعات Offer با موفقیت به‌روزرسانی شد." };
  } catch (error) {
    if (error instanceof z.ZodError) return validationState(error);
    if (error instanceof SupplierOfferServiceError) return serviceErrorState(error);
    return { status: "error", message: "ویرایش Offer با خطا روبه‌رو شد." };
  }
}

export async function toggleSupplierOfferAction(
  offerId: string,
): Promise<SupplierOfferActionState> {
  try {
    const supplierId = getCurrentSupplierId();
    const updated = await toggleSupplierOfferForSupplier(supplierId, offerId);
    revalidatePath("/supplier/products");

    return {
      status: "success",
      message: updated.isActive ? "Offer فعال شد." : "Offer غیرفعال شد.",
      isActive: updated.isActive,
    };
  } catch (error) {
    if (error instanceof SupplierOfferServiceError) return serviceErrorState(error);
    return { status: "error", message: "تغییر وضعیت Offer با خطا روبه‌رو شد." };
  }
}
