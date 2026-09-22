import { z } from "zod";
import type {
  ProposalDiscount,
  ProposalTotals,
  SupplierProposalDraft,
  SupplierProposalItem,
} from "@/types/supplier-proposal";

const discountSchema = z.object({
  type: z.enum(["fixed", "percent"]),
  value: z.number().int().min(0, "تخفیف نمی‌تواند منفی باشد."),
});

export const supplierProposalSchema = z
  .object({
    items: z.array(
      z.object({
        requestItemId: z.string().min(1),
        selected: z.boolean(),
        availableQuantity: z.number(),
        unitPrice: z.number().int(),
        discount: discountSchema,
        requestedQuantity: z.number().positive(),
      }),
    ),
    preparationTime: z.enum(["same_day", "1_day", "2_days", "3_days", "custom"], {
      error: "زمان آماده‌سازی را انتخاب کنید.",
    }),
    customPreparationTime: z.string(),
    deliveryDate: z.string(),
    shippingMethod: z.enum(["supplier", "courier", "freight", "pickup"], {
      error: "روش ارسال را انتخاب کنید.",
    }),
    shippingCost: z.number().int().min(0, "هزینه ارسال نمی‌تواند منفی باشد."),
    generalDiscount: discountSchema,
    validityHours: z.union([z.literal(2), z.literal(6), z.literal(12), z.literal(24), z.literal(48)]),
    maxValidityHours: z.number().positive(),
    notes: z.string().max(500, "توضیحات حداکثر ۵۰۰ نویسه است."),
  })
  .superRefine((value, context) => {
    const selectedItems = value.items.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      context.addIssue({
        code: "custom",
        message: "حداقل یک قلم را برای ارائه پیشنهاد انتخاب کنید.",
        path: ["items"],
      });
    }

    value.items.forEach((item, index) => {
      if (!item.selected) return;
      if (item.availableQuantity <= 0) {
        context.addIssue({
          code: "custom",
          message: "مقدار قابل تأمین باید بیشتر از صفر باشد.",
          path: ["items", index, "availableQuantity"],
        });
      }
      if (item.availableQuantity > item.requestedQuantity) {
        context.addIssue({
          code: "custom",
          message: "مقدار قابل تأمین نمی‌تواند بیشتر از مقدار درخواستی باشد.",
          path: ["items", index, "availableQuantity"],
        });
      }
      if (item.unitPrice <= 0) {
        context.addIssue({
          code: "custom",
          message: "قیمت واحد باید بیشتر از صفر باشد.",
          path: ["items", index, "unitPrice"],
        });
      }
      if (item.discount.type === "percent" && item.discount.value > 100) {
        context.addIssue({
          code: "custom",
          message: "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.",
          path: ["items", index, "discount"],
        });
      }
    });

    if (value.preparationTime === "custom" && !value.customPreparationTime.trim()) {
      context.addIssue({
        code: "custom",
        message: "زمان آماده‌سازی سفارشی را وارد کنید.",
        path: ["customPreparationTime"],
      });
    }
    if (value.validityHours > value.maxValidityHours) {
      context.addIssue({
        code: "custom",
        message: "اعتبار پیشنهاد نمی‌تواند از مهلت درخواست عبور کند.",
        path: ["validityHours"],
      });
    }
    if (value.generalDiscount.type === "percent" && value.generalDiscount.value > 100) {
      context.addIssue({
        code: "custom",
        message: "درصد تخفیف کلی نمی‌تواند بیشتر از ۱۰۰ باشد.",
        path: ["generalDiscount"],
      });
    }
  });

function discountAmount(base: number, discount: ProposalDiscount): number {
  if (base <= 0 || discount.value <= 0) return 0;
  if (discount.type === "percent") {
    return Math.min(base, Math.floor((base * Math.min(discount.value, 100)) / 100));
  }
  return Math.min(base, discount.value);
}

export function calculateItemTotal(item: SupplierProposalItem): {
  gross: number;
  discount: number;
  total: number;
} {
  if (!item.selected) return { gross: 0, discount: 0, total: 0 };
  const gross = Math.max(0, Math.trunc(item.availableQuantity)) * Math.max(0, Math.trunc(item.unitPrice));
  const discount = discountAmount(gross, item.discount);
  return { gross, discount, total: gross - discount };
}

export function calculateProposalTotals(draft: SupplierProposalDraft): ProposalTotals {
  const itemTotals = draft.items.map(calculateItemTotal);
  const subtotal = itemTotals.reduce((sum, item) => sum + item.gross, 0);
  const itemDiscount = itemTotals.reduce((sum, item) => sum + item.discount, 0);
  const afterItemDiscount = subtotal - itemDiscount;
  const generalDiscount = discountAmount(afterItemDiscount, draft.generalDiscount);
  const shipping = draft.freeShipping ? 0 : Math.max(0, Math.trunc(draft.shippingCost));
  return {
    subtotal,
    itemDiscount,
    generalDiscount,
    shipping,
    total: Math.max(0, afterItemDiscount - generalDiscount + shipping),
  };
}

export function formatToman(value: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.trunc(value)))} تومان`;
}

export function normalizeNumericInput(value: string): number {
  const latin = value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "");
  return latin ? Number(latin) : 0;
}
