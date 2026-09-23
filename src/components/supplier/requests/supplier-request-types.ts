export type SupplierRequestStatus =
  | "pending"
  | "viewed"
  | "available"
  | "partially_available"
  | "unavailable"
  | "declined"
  | "expired";

export type SupplierResponseStatus = Extract<
  SupplierRequestStatus,
  "available" | "partially_available" | "unavailable" | "declined"
>;

export type ProductUnit = "piece" | "pack" | "box" | "kg" | "gram" | "liter" | "ml";

export type SupplierRequestView = {
  supplierRequestId: string;
  requestItemId: string;
  product: {
    id: string;
    title: string;
    slug: string;
    brand?: string;
    image?: string;
    unit: ProductUnit;
    unitValue?: number;
  };
  requestedQuantity: number;
  status: SupplierRequestStatus;
  offeredPrice?: number;
  availableQuantity?: number;
  deliveryDays?: number;
  note?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type SupplierResponseActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

export const supplierRequestStatusConfig: Record<
  SupplierRequestStatus,
  {
    label: string;
    variant: "info" | "neutral" | "success" | "warning" | "danger";
  }
> = {
  pending: { label: "جدید", variant: "info" },
  viewed: { label: "مشاهده‌شده", variant: "neutral" },
  available: { label: "موجود", variant: "success" },
  partially_available: { label: "موجودی جزئی", variant: "warning" },
  unavailable: { label: "ناموجود", variant: "danger" },
  declined: { label: "رد شده", variant: "danger" },
  expired: { label: "منقضی", variant: "danger" },
};

export const productUnitLabels: Record<ProductUnit, string> = {
  piece: "عدد",
  pack: "بسته",
  box: "جعبه",
  kg: "کیلوگرم",
  gram: "گرم",
  liter: "لیتر",
  ml: "میلی‌لیتر",
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const moneyFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

export function formatRequestedQuantity(request: SupplierRequestView) {
  const quantity = numberFormatter.format(request.requestedQuantity);
  const unit = productUnitLabels[request.product.unit];

  if (request.product.unitValue === undefined || request.product.unitValue === 1) {
    return `${quantity} ${unit}`;
  }

  return `${quantity} × ${numberFormatter.format(request.product.unitValue)} ${unit}`;
}

export function formatSupplierRequestDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatMoney(value: number) {
  return `${moneyFormatter.format(value)} تومان`;
}

export function hasSupplierResponse(status: SupplierRequestStatus): status is SupplierResponseStatus {
  return ["available", "partially_available", "unavailable", "declined"].includes(status);
}
