import {
  IconBuildingStore,
  IconCoffee,
  IconLeaf,
  IconPackage,
  IconSun,
  IconTruckDelivery,
  type TablerIcon,
} from "@tabler/icons-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Speed categories used by the delivery-time filter. */
export type DeliverySpeed = "today" | "tomorrow" | "2-3days";

/** Product-category keys for the sidebar filter chips. */
export type SupplierCategoryId =
  | "all"
  | "dairy"
  | "protein"
  | "produce"
  | "dry"
  | "beverages"
  | "packaging";

/** Full supplier record — drives cards, modals, and comparison. */
export type SupplierFull = {
  id: string;
  name: string;
  /** Short brand tagline shown below the logo circle. */
  slogan: string;
  icon: TablerIcon;
  /** Visual tone for the icon background. */
  iconTone: "green" | "orange" | "blue" | "violet";
  verified: boolean;
  /** Human-readable category label (e.g. "لبنیات و مواد پروتئینی"). */
  categoryLabel: string;
  categoryId: Exclude<SupplierCategoryId, "all">;
  score: number;
  reviewCount: number;
  description: string;
  tags: string[];
  coverageAreas: string[];
  nationalCoverage: boolean;
  responseRate: string;
  minimumOrder: string;
  /** Numeric value in tomans for range-filter comparison. */
  minimumOrderValue: number;
  deliveryTime: string;
  deliverySpeed: DeliverySpeed;
  phone: string;
  mobile: string;
  email: string;
  yearEstablished: string;
  /** Sample products the supplier carries — used by profile modal. */
  sampleProducts: Array<{
    name: string;
    price: number;
    minOrder: number;
    unit: string;
  }>;
};

// ---------------------------------------------------------------------------
// Category chips for the filter sidebar
// ---------------------------------------------------------------------------

export const supplierCategories: Array<{
  id: SupplierCategoryId;
  label: string;
}> = [
  { id: "all", label: "همه دسته‌ها" },
  { id: "dairy", label: "لبنیات" },
  { id: "protein", label: "پروتئینی" },
  { id: "produce", label: "میوه و سبزی" },
  { id: "dry", label: "خشکبار" },
  { id: "beverages", label: "نوشیدنی" },
  { id: "packaging", label: "بسته‌بندی" },
];

// ---------------------------------------------------------------------------
// Rating filter options
// ---------------------------------------------------------------------------

export const ratingOptions = [
  { value: "all" as const, label: "همه" },
  { value: "4" as const, label: "۴ به بالا" },
  { value: "3" as const, label: "۳ به بالا" },
  { value: "2" as const, label: "۲ به بالا" },
];

// ---------------------------------------------------------------------------
// Delivery-time filter options
// ---------------------------------------------------------------------------

export const deliveryOptions: Array<{
  value: "all" | DeliverySpeed;
  label: string;
}> = [
  { value: "all", label: "همه" },
  { value: "today", label: "ارسال امروز" },
  { value: "tomorrow", label: "فردا" },
  { value: "2-3days", label: "۲ تا ۳ روز" },
];

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

export type SupplierSort = "relevance" | "rating" | "delivery" | "price";

export const sortOptions: Array<{ value: SupplierSort; label: string }> = [
  { value: "relevance", label: "بهترین تطبیق" },
  { value: "rating", label: "بالاترین امتیاز" },
  { value: "delivery", label: "سریع‌ترین ارسال" },
  { value: "price", label: "کمترین حداقل سفارش" },
];

// ---------------------------------------------------------------------------
// Mock suppliers — matches the 4 visible cards in the design
// ---------------------------------------------------------------------------

export const suppliers: SupplierFull[] = [
  {
    id: "bazar-kerman",
    name: "بازار کرمان",
    slogan: "از ۱۳۹۲",
    icon: IconLeaf,
    iconTone: "green",
    verified: true,
    categoryLabel: "لبنیات و مواد پروتئینی",
    categoryId: "dairy",
    score: 4.8,
    reviewCount: 128,
    description:
      "عرضه‌کننده انواع لبنیات، مواد پروتئینی و کالاهای اساسی با بیش از ۵ سال سابقه همکاری با مجموعه‌های غذایی.",
    tags: ["قیمت مناسب", "ارسال سریع"],
    coverageAreas: ["کرمان", "قم", "البرز", "اصفهان"],
    nationalCoverage: false,
    responseRate: "۹۵٪",
    minimumOrder: "۵۰۰ هزار تومان",
    minimumOrderValue: 500_000,
    deliveryTime: "امروز، ۲ تا ۴ ساعت",
    deliverySpeed: "today",
    phone: "۰۳۴ ۳۲۴۵ ۶۷۸۹",
    mobile: "۰۹۱۲ ۱۲۳ ۴۵۶۷",
    email: "info@bazarkerman.ir",
    yearEstablished: "۱۳۹۲",
    sampleProducts: [
      { name: "شیر پرچرب یک لیتری", price: 34_000, minOrder: 24, unit: "عدد" },
      { name: "ماست دبه‌ای ۲ کیلویی", price: 56_000, minOrder: 4, unit: "عدد" },
      { name: "پنیر سفید ۴۰۰ گرمی", price: 78_000, minOrder: 6, unit: "عدد" },
      { name: "دوغ خانواده ۱.۵ لیتری", price: 28_000, minOrder: 6, unit: "عدد" },
    ],
  },
  {
    id: "baharan",
    name: "پخش بهاران",
    slogan: "تازگی هر روز",
    icon: IconSun,
    iconTone: "orange",
    verified: true,
    categoryLabel: "سبزیجات و میوه تازه",
    categoryId: "produce",
    score: 4.6,
    reviewCount: 91,
    description:
      "توزیع‌کننده مواد غذایی و لبنیات در تهران و البرز با ارسال منظم و پشتیبانی سفارش.",
    tags: ["تازه روزانه", "پشتیبانی خوب"],
    coverageAreas: ["تهران", "البرز", "قزوین"],
    nationalCoverage: false,
    responseRate: "۹۲٪",
    minimumOrder: "۳۰۰ هزار تومان",
    minimumOrderValue: 300_000,
    deliveryTime: "فردا صبح",
    deliverySpeed: "tomorrow",
    phone: "۰۲۱ ۴۴۸۸ ۲۲۰۰",
    mobile: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
    email: "sales@baharan.ir",
    yearEstablished: "۱۳۹۵",
    sampleProducts: [
      { name: "گوجه فرنگی تازه", price: 45_000, minOrder: 5, unit: "کیلوگرم" },
      { name: "خیار بوته‌ای", price: 38_000, minOrder: 3, unit: "کیلوگرم" },
      { name: "سبزی تازه مخلوط", price: 62_000, minOrder: 2, unit: "کیلوگرم" },
    ],
  },
  {
    id: "foodmarket",
    name: "فودمارکت",
    slogan: "انتخاب حرفه‌ای‌ها",
    icon: IconCoffee,
    iconTone: "blue",
    verified: true,
    categoryLabel: "خشکبار و مواد کافی‌شاپی",
    categoryId: "dry",
    score: 4.9,
    reviewCount: 72,
    description:
      "تأمین مواد اولیه منتخب کافه و رستوران با تمرکز بر بسته‌بندی استاندارد و تحویل منظم.",
    tags: ["کیفیت تضمینی", "ارسال منظم"],
    coverageAreas: ["کرمان", "سیرجان"],
    nationalCoverage: false,
    responseRate: "۸۹٪",
    minimumOrder: "۷۵۰ هزار تومان",
    minimumOrderValue: 750_000,
    deliveryTime: "امروز",
    deliverySpeed: "today",
    phone: "۰۳۴ ۳۲۲۲ ۱۱۰۰",
    mobile: "۰۹۱۳ ۴۵۶ ۷۸۹۰",
    email: "hello@foodmarket.ir",
    yearEstablished: "۱۳۹۸",
    sampleProducts: [
      { name: "دانه قهوه اسپرسو ۱ کیلویی", price: 1_240_000, minOrder: 1, unit: "بسته" },
      { name: "سیروپ وانیل ۷۵۰ میلی‌لیتری", price: 685_000, minOrder: 1, unit: "بطری" },
    ],
  },
  {
    id: "zarrin",
    name: "زرین تجارت",
    slogan: "همراه کسب‌وکار شما",
    icon: IconPackage,
    iconTone: "violet",
    verified: true,
    categoryLabel: "بسته‌بندی و نوشیدنی",
    categoryId: "packaging",
    score: 4.7,
    reviewCount: 104,
    description:
      "پخش عمده نوشیدنی، لبنیات و اقلام مصرفی با پوشش ارسال در استان کرمان.",
    tags: ["موجودی کامل", "تخفیف پلکانی"],
    coverageAreas: ["کرمان", "رفسنجان", "سیرجان", "بم"],
    nationalCoverage: false,
    responseRate: "۹۰٪",
    minimumOrder: "۴۰۰ هزار تومان",
    minimumOrderValue: 400_000,
    deliveryTime: "۱ تا ۲ روز",
    deliverySpeed: "2-3days",
    phone: "۰۳۴ ۳۲۵۵ ۸۸۰۰",
    mobile: "۰۹۱۳ ۷۸۹ ۰۱۲۳",
    email: "order@zarrin.ir",
    yearEstablished: "۱۳۹۰",
    sampleProducts: [
      { name: "لیوان کاغذی ۲۰۰ میلی‌لیتری", price: 120_000, minOrder: 10, unit: "بسته" },
      { name: "نی نوشیدنی بسته ۵۰۰ تایی", price: 85_000, minOrder: 5, unit: "بسته" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Aggregate stats shown above the supplier list
// ---------------------------------------------------------------------------

export const supplierPageStats = {
  activeCount: 28,
  averageScore: 4.8,
  categoryCount: 12,
  onTimeDeliveryPercent: "۸۷٪",
};

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatToman(value: number): string {
  return `${formatPersianNumber(value)} تومان`;
}
