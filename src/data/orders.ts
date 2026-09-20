import {
  IconBuildingStore,
  IconLeaf,
  IconPackage,
  IconSun,
  type TablerIcon,
} from "@tabler/icons-react";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "shipping" | "delivered";

export type Order = {
  id: string;
  supplierId: string;
  supplier: string;
  supplierIcon: TablerIcon;
  registeredDate: string;
  registeredTime: string;
  itemCount: number;
  amount: number;
  status: OrderStatus;
  statusLabel: string;
  deliveryPrimary: string;
  deliverySecondary: string;
  deliveryTone?: "success";
  productImages: string[];
  products: Array<{ name: string; quantity: string; price: number }>;
};

export type Supplier = {
  id: string;
  name: string;
  icon: TablerIcon;
  score: string;
  reviews: string;
  description: string;
  tags: string[];
  city: string;
  responseRate: string;
  minimumOrder: string;
  delivery: string;
  phone: string;
  email: string;
  price: number;
  shipping: number;
  deliveryDays: string;
};

export const orders: Order[] = [
  {
    id: "#۱۲۵۸",
    supplierId: "bazar-kerman",
    supplier: "بازار کرمان",
    supplierIcon: IconLeaf,
    registeredDate: "۱۴۰۳/۰۵/۲۸",
    registeredTime: "۱۱:۲۰",
    itemCount: 3,
    amount: 4370000,
    status: "shipping",
    statusLabel: "در حال ارسال",
    deliveryPrimary: "فردا",
    deliverySecondary: "۲ شهریور",
    productImages: ["/images/products/tomato.png", "/images/products/coffee.png"],
    products: [
      { name: "گوجه فرنگی تازه", quantity: "۱۰ کیلوگرم", price: 920000 },
      { name: "قهوه اسپرسو", quantity: "۲ بسته", price: 2480000 },
      { name: "سبزی تازه", quantity: "۵ کیلوگرم", price: 970000 },
    ],
  },
  {
    id: "#۱۲۵۷",
    supplierId: "baharan",
    supplier: "پخش بهاران",
    supplierIcon: IconSun,
    registeredDate: "۱۴۰۳/۰۵/۲۷",
    registeredTime: "۱۶:۴۵",
    itemCount: 5,
    amount: 2150000,
    status: "confirmed",
    statusLabel: "تأیید شده",
    deliveryPrimary: "سه‌شنبه",
    deliverySecondary: "۳ شهریور",
    productImages: ["/images/products/vanilla-syrup.png", "/images/products/milk.png"],
    products: [
      { name: "سیروپ وانیل", quantity: "۳ بطری", price: 840000 },
      { name: "شیر پرچرب", quantity: "۴ بسته", price: 680000 },
      { name: "خامه قنادی", quantity: "۲ بسته", price: 360000 },
      { name: "شکر", quantity: "۵ کیلوگرم", price: 150000 },
      { name: "لیوان کاغذی", quantity: "۱ بسته", price: 120000 },
    ],
  },
  {
    id: "#۱۲۵۶",
    supplierId: "zarrin",
    supplier: "زرین پخش",
    supplierIcon: IconPackage,
    registeredDate: "۱۴۰۳/۰۵/۲۶",
    registeredTime: "۰۹:۳۰",
    itemCount: 2,
    amount: 5680000,
    status: "preparing",
    statusLabel: "آماده ارسال",
    deliveryPrimary: "۲ روز دیگر",
    deliverySecondary: "۵ شهریور",
    productImages: ["/images/products/milk.png", "/images/products/vanilla-syrup.png"],
    products: [
      { name: "شیر پرچرب", quantity: "۱۲ بسته", price: 2040000 },
      { name: "سیروپ وانیل", quantity: "۱۳ بطری", price: 3640000 },
    ],
  },
  {
    id: "#۱۲۵۵",
    supplierId: "foodmarket",
    supplier: "فودمارکت",
    supplierIcon: IconBuildingStore,
    registeredDate: "۱۴۰۳/۰۵/۲۵",
    registeredTime: "۱۴:۱۵",
    itemCount: 4,
    amount: 1240000,
    status: "delivered",
    statusLabel: "تحویل شده",
    deliveryPrimary: "تحویل شده",
    deliverySecondary: "۲۹ مرداد",
    deliveryTone: "success",
    productImages: ["/images/products/tomato.png", "/images/products/coffee.png"],
    products: [
      { name: "گوجه فرنگی تازه", quantity: "۵ کیلوگرم", price: 460000 },
      { name: "سبزی تازه", quantity: "۳ کیلوگرم", price: 280000 },
      { name: "قهوه اسپرسو", quantity: "۱ بسته", price: 390000 },
      { name: "دستمال پذیرایی", quantity: "۲ بسته", price: 110000 },
    ],
  },
];

export const suppliers: Supplier[] = [
  {
    id: "bazar-kerman",
    name: "بازار کرمان",
    icon: IconLeaf,
    score: "۴٫۸",
    reviews: "۲۴ نظر",
    description: "عرضه‌کننده انواع لبنیات، مواد پروتئینی و کالاهای اساسی با بیش از ۵ سال سابقه همکاری با مجموعه‌های غذایی.",
    tags: ["لبنیات", "مواد پروتئینی", "کالای اساسی"],
    city: "کرمان",
    responseRate: "۹۵٪",
    minimumOrder: "۵۰۰٬۰۰۰ تومان",
    delivery: "۱ تا ۲ روز",
    phone: "۰۳۴ ۳۲۴۵ ۶۷۸۹",
    email: "info@bazarkerman.ir",
    price: 38500,
    shipping: 0,
    deliveryDays: "۱ روز",
  },
  {
    id: "baharan",
    name: "پخش بهاران",
    icon: IconSun,
    score: "۴٫۶",
    reviews: "۱۹ نظر",
    description: "توزیع‌کننده مواد غذایی و لبنیات در تهران و البرز با ارسال منظم و پشتیبانی سفارش.",
    tags: ["لبنیات", "مواد پروتئینی", "مواد خشک"],
    city: "تهران و البرز",
    responseRate: "۹۲٪",
    minimumOrder: "۷۰۰٬۰۰۰ تومان",
    delivery: "۲ روز",
    phone: "۰۲۱ ۴۴۸۸ ۲۲۰۰",
    email: "sales@baharan.ir",
    price: 39000,
    shipping: 20000,
    deliveryDays: "۲ روز",
  },
  {
    id: "foodmarket",
    name: "فودمارکت",
    icon: IconBuildingStore,
    score: "۴٫۳",
    reviews: "۱۲ نظر",
    description: "تأمین مواد اولیه منتخب کافه و رستوران با تمرکز بر بسته‌بندی استاندارد و تحویل منظم.",
    tags: ["ویژه کافه", "لبنیات", "بسته‌بندی"],
    city: "کرمان",
    responseRate: "۸۹٪",
    minimumOrder: "۴۰۰٬۰۰۰ تومان",
    delivery: "۳ روز",
    phone: "۰۳۴ ۳۲۲۲ ۱۱۰۰",
    email: "hello@foodmarket.ir",
    price: 37500,
    shipping: 25000,
    deliveryDays: "۳ روز",
  },
  {
    id: "zarrin",
    name: "زرین پخش",
    icon: IconPackage,
    score: "۴٫۵",
    reviews: "۱۶ نظر",
    description: "پخش عمده نوشیدنی، لبنیات و اقلام مصرفی با پوشش ارسال در استان کرمان.",
    tags: ["نوشیدنی", "لبنیات", "اقلام مصرفی"],
    city: "استان کرمان",
    responseRate: "۹۰٪",
    minimumOrder: "۶۰۰٬۰۰۰ تومان",
    delivery: "۲ روز",
    phone: "۰۳۴ ۳۲۵۵ ۸۸۰۰",
    email: "order@zarrin.ir",
    price: 39800,
    shipping: 0,
    deliveryDays: "۲ روز",
  },
];

export const orderStatusOptions: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار تأیید" },
  { value: "confirmed", label: "تأیید شده" },
  { value: "preparing", label: "آماده ارسال" },
  { value: "shipping", label: "در حال ارسال" },
  { value: "delivered", label: "تحویل شده" },
];

export const activeOrders = [
  { id: "#۱۲۶۱", supplier: "بازار کرمان", step: 2 },
  { id: "#۱۲۶۰", supplier: "پخش بهاران", step: 2 },
  { id: "#۱۲۵۹", supplier: "زرین پخش", step: 1 },
];

export const attentionItems = [
  {
    orderId: "#۱۲۶۲",
    title: "تأیید سفارش #۱۲۶۲",
    description: "لطفاً تا پایان امروز سفارش را تأیید کنید تا فرایند ارسال آغاز شود.",
    action: "مشاهده سفارش",
    tone: "warning" as const,
  },
  {
    orderId: "#۱۲۵۹",
    title: "تغییر قیمت در سفارش #۱۲۵۹",
    description: "قیمت برخی اقلام این سفارش تغییر کرده است؛ لطفاً تغییرات را بررسی کنید.",
    action: "بررسی تغییرات",
    tone: "orange" as const,
  },
];

export const orderStats = {
  all: 24,
  pending: 3,
  shipping: 5,
  deliveredThisMonth: 16,
};

export const formatPrice = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
