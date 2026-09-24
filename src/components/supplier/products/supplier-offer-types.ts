export type ProductUnit = "piece" | "pack" | "box" | "kg" | "gram" | "liter" | "ml";

export type CatalogProductView = {
  productId: string;
  title: string;
  slug: string;
  brand?: string;
  image?: string;
  unit: ProductUnit;
  unitValue?: number;
};

export type SupplierOfferView = {
  offerId: string;
  productId: string;
  product: Omit<CatalogProductView, "productId">;
  price: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  deliveryDays: number;
  isActive: boolean;
  updatedAt: string;
};

export type SupplierOfferActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
  existingOfferId?: string;
  isActive?: boolean;
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

export function formatMoney(value: number) {
  return `${moneyFormatter.format(value)} تومان`;
}

export function formatQuantity(value: number, unit: ProductUnit) {
  return `${numberFormatter.format(value)} ${productUnitLabels[unit]}`;
}

export function formatProductUnit(product: CatalogProductView | SupplierOfferView["product"]) {
  const label = productUnitLabels[product.unit];
  return product.unitValue === undefined
    ? label
    : `${numberFormatter.format(product.unitValue)} ${label}`;
}

export function formatUpdatedAt(value: string) {
  return dateFormatter.format(new Date(value));
}
