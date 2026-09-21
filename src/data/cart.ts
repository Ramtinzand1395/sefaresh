import { products } from "@/data/products";

export type CartItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  unit: string;
  price: number;
  quantity: number;
};

export type DeliverySlot = {
  id: string;
  day: string;
  date: string;
  time: string;
  period: string;
};

export type DeliveryAddress = {
  title: string;
  city: string;
  street: string;
  details: string;
};

const quantities: Record<string, number> = {
  "pegah-full-fat-milk": 12,
  "arabica-espresso": 4,
  "vanilla-syrup": 1,
  "fresh-tomato": 7,
};

export const initialCartItems: CartItem[] = products.slice(0, 4).map((product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  image: product.image,
  unit: product.unit,
  price: product.price,
  quantity: quantities[product.id] ?? 1,
}));

export const defaultDeliveryAddress: DeliveryAddress = {
  title: "کافه لیمز · شعبه مرکزی",
  city: "تهران",
  street: "خیابان ولیعصر، بالاتر از میدان ونک",
  details: "پلاک ۱۲۳، واحد ۲",
};

export const deliverySlots: DeliverySlot[] = [
  { id: "mon-morning", day: "دوشنبه", date: "۲۷ شهریور", time: "۹ تا ۱۲", period: "صبح" },
  { id: "tue-noon", day: "سه‌شنبه", date: "۲۸ شهریور", time: "۱۲ تا ۱۶", period: "ظهر" },
  { id: "tue-evening", day: "سه‌شنبه", date: "۲۸ شهریور", time: "۱۶ تا ۲۰", period: "عصر" },
];

export const checkoutCosts = {
  shipping: 150_000,
  discount: 245_000,
} as const;
