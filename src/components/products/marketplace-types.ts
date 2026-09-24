export type ProductUnit = "piece" | "pack" | "box" | "kg" | "gram" | "liter" | "ml";
export type MarketplaceSort = "default" | "price_asc" | "price_desc";

export type MarketplaceProductView = {
  productId: string;
  title: string;
  slug: string;
  brand?: string;
  image?: string;
  unit: ProductUnit;
  unitValue?: number;
  categoryId: string;
  categoryName?: string;
  availableSupplierCount: number;
  lowestPrice: number;
  highestPrice: number;
  totalAvailableStock: number;
};

export type MarketplaceOfferView = {
  offerId: string;
  supplierId: string;
  supplierName: string;
  price: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  deliveryDays: number;
};

export type MarketplaceProductDetailView = MarketplaceProductView & {
  offers: MarketplaceOfferView[];
};

export type MarketplaceCategoryView = {
  categoryId: string;
  name: string;
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

export function formatToman(value: number) {
  return `${numberFormatter.format(value)} تومان`;
}

export function formatQuantity(value: number, unit: ProductUnit) {
  return `${numberFormatter.format(value)} ${productUnitLabels[unit]}`;
}

export function formatProductUnit(product: Pick<MarketplaceProductView, "unit" | "unitValue">) {
  const label = productUnitLabels[product.unit];
  return product.unitValue === undefined
    ? label
    : `${numberFormatter.format(product.unitValue)} ${label}`;
}
