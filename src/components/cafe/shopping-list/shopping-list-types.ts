export type ShoppingListItemView = {
  id: string;
  productId?: string;
  productTitle?: string;
  productBrand?: string;
  productUnit?: string;
  customTitle?: string;
  quantity: number;
  note?: string;
  isInternalRequest: boolean;
};

export type ShoppingListView = {
  id: string;
  name: string;
  status: "active" | "converted" | "archived";
  updatedAt: string;
  itemCount: number;
  items: ShoppingListItemView[];
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

export function formatPersianNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPersianDate(value: string): string {
  return dateFormatter.format(new Date(value));
}
