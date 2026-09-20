export const productCategories = [
  { id: "all", label: "همه کالاها" },
  { id: "dairy", label: "لبنیات" },
  { id: "beverages", label: "نوشیدنی‌ها" },
  { id: "dry", label: "مواد خشک" },
  { id: "produce", label: "میوه و سبزیجات" },
] as const;

export type ProductCategoryId = Exclude<(typeof productCategories)[number]["id"], "all">;

export type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategoryId;
  categoryLabel: string;
  unit: string;
  price: number;
  supplierCount: number;
  minOrder: string;
  image: string;
  available: boolean;
  popular?: boolean;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "pegah-full-fat-milk",
    name: "شیر پرچرب پگاه",
    description: "بطری یک لیتری · مناسب نوشیدنی‌های گرم",
    category: "dairy",
    categoryLabel: "لبنیات",
    unit: "بطری",
    price: 38500,
    supplierCount: 8,
    minOrder: "۶ بطری",
    image: "/images/products/milk.png",
    available: true,
    popular: true,
    badge: "پرفروش",
  },
  {
    id: "arabica-espresso",
    name: "دانه قهوه اسپرسو",
    description: "ترکیب عربیکا · بسته یک کیلوگرمی",
    category: "beverages",
    categoryLabel: "نوشیدنی‌ها",
    unit: "کیلوگرم",
    price: 1240000,
    supplierCount: 5,
    minOrder: "۱ بسته",
    image: "/images/products/coffee.png",
    available: true,
    popular: true,
    badge: "انتخاب کافه‌ها",
  },
  {
    id: "vanilla-syrup",
    name: "سیروپ وانیل",
    description: "برند مونین · بطری ۷۵۰ میلی‌لیتری",
    category: "beverages",
    categoryLabel: "نوشیدنی‌ها",
    unit: "بطری",
    price: 685000,
    supplierCount: 4,
    minOrder: "۱ بطری",
    image: "/images/products/vanilla-syrup.png",
    available: true,
  },
  {
    id: "fresh-tomato",
    name: "گوجه فرنگی تازه",
    description: "درجه یک · بار روز کرمان",
    category: "produce",
    categoryLabel: "میوه و سبزیجات",
    unit: "کیلوگرم",
    price: 89000,
    supplierCount: 11,
    minOrder: "۵ کیلوگرم",
    image: "/images/products/tomato.png",
    available: true,
    popular: true,
    badge: "تازه امروز",
  },
  {
    id: "low-fat-milk",
    name: "شیر کم‌چرب پگاه",
    description: "بطری یک لیتری · چربی ۱٫۵ درصد",
    category: "dairy",
    categoryLabel: "لبنیات",
    unit: "بطری",
    price: 36000,
    supplierCount: 6,
    minOrder: "۶ بطری",
    image: "/images/products/milk.png",
    available: true,
  },
  {
    id: "coffee-house-blend",
    name: "قهوه ترکیبی خانه",
    description: "رُست متوسط · بسته یک کیلوگرمی",
    category: "dry",
    categoryLabel: "مواد خشک",
    unit: "کیلوگرم",
    price: 980000,
    supplierCount: 3,
    minOrder: "۲ بسته",
    image: "/images/products/coffee.png",
    available: false,
    badge: "ناموجود موقت",
  },
  {
    id: "cherry-tomato",
    name: "گوجه گیلاسی",
    description: "تازه و دستچین · سبد یک کیلوگرمی",
    category: "produce",
    categoryLabel: "میوه و سبزیجات",
    unit: "سبد",
    price: 112000,
    supplierCount: 7,
    minOrder: "۲ سبد",
    image: "/images/products/tomato.png",
    available: true,
  },
  {
    id: "caramel-syrup",
    name: "سیروپ کارامل",
    description: "بطری ۷۰۰ میلی‌لیتری · مناسب قهوه",
    category: "beverages",
    categoryLabel: "نوشیدنی‌ها",
    unit: "بطری",
    price: 640000,
    supplierCount: 5,
    minOrder: "۱ بطری",
    image: "/images/products/vanilla-syrup.png",
    available: true,
  },
];

export function formatToman(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
}
