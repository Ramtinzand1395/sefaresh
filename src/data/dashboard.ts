import {
  IconBox,
  IconClipboardText,
  IconFileText,
  IconShoppingCart,
  IconTruckDelivery,
  IconUsersGroup,
  type TablerIcon,
} from "@tabler/icons-react";

export type DashboardTone = "blue" | "green" | "orange" | "violet";

export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
  trend?: string;
  icon: TablerIcon;
  tone: DashboardTone;
};

export const dashboardStats: DashboardStat[] = [
  {
    label: "تحویل‌های پیش‌رو",
    value: "۵ سفارش",
    hint: "تا ۳ روز آینده",
    icon: IconTruckDelivery,
    tone: "violet",
  },
  {
    label: "درخواست‌های منتظر اقدام",
    value: "۴ مورد",
    hint: "نیاز به بررسی",
    icon: IconFileText,
    tone: "orange",
  },
  {
    label: "سفارش‌های فعال",
    value: "۷ سفارش",
    hint: "در ۳ حال ارسال",
    icon: IconClipboardText,
    tone: "blue",
  },
  {
    label: "خرید این ماه",
    value: "۱۲۳٬۴۵۰٬۰۰۰",
    hint: "نسبت به ماه قبل",
    trend: "۱۲٪",
    icon: IconShoppingCart,
    tone: "green",
  },
];

export const spendingData = [
  { month: "فروردین", value: 74 },
  { month: "اردیبهشت", value: 54 },
  { month: "خرداد", value: 92 },
  { month: "تیر", value: 116 },
  { month: "مرداد", value: 142 },
  { month: "شهریور", value: 123, active: true },
];

export const attentionItems = [
  {
    title: "۱ سفارش در انتظار تأیید نهایی",
    description: "بیش از ۲۴ ساعت است که بررسی نشده.",
  },
  {
    title: "۳ پیشنهاد جدید از تأمین‌کنندگان",
    description: "برای کالاهای مورد نیاز شما ثبت شده است.",
  },
];

export const quickActions = [
  { title: "مشاهده سفارش‌ها", description: "پیگیری وضعیت و جزئیات", icon: IconFileText, tone: "blue" as const },
  { title: "ثبت درخواست مواد اولیه", description: "از نیاز تا خرید در چند مرحله", icon: IconBox, tone: "orange" as const },
  { title: "سفارش مجدد", description: "خرید سریع کالاهای پرتکرار", icon: IconShoppingCart, tone: "green" as const },
  { title: "مقایسه تأمین‌کنندگان", description: "انتخاب بهتر، خرید مطمئن", icon: IconUsersGroup, tone: "violet" as const },
];

export const recentOrders = [
  { id: "#۱۲۵۸", supplier: "بازار کرمان", total: "۴٬۳۷۰٬۰۰۰", status: "در حال ارسال", tone: "info" as const, delivery: "فردا" },
  { id: "#۱۲۵۷", supplier: "پخش بهاران", total: "۲٬۱۵۰٬۰۰۰", status: "تأیید شده", tone: "success" as const, delivery: "۲ روز دیگر" },
  { id: "#۱۲۵۶", supplier: "زرین‌پخش", total: "۵٬۶۸۰٬۰۰۰", status: "آماده ارسال", tone: "warning" as const, delivery: "امروز" },
  { id: "#۱۲۵۵", supplier: "فودمارکت", total: "۱٬۲۴۰٬۰۰۰", status: "تحویل شده", tone: "success" as const, delivery: "—" },
  { id: "#۱۲۵۴", supplier: "بازار کرمان", total: "۳٬۷۵۰٬۰۰۰", status: "لغو شده", tone: "danger" as const, delivery: "—" },
];

export const suggestedSuppliers = [
  { name: "بازار کرمان", score: "۴٫۸", reviews: "۲۵ نظر", tags: ["ارسال سریع", "قیمت مناسب"], mark: "بـ", color: "green" },
  { name: "پخش بهاران", score: "۴٫۶", reviews: "۱۹ نظر", tags: ["تنوع کالا", "پشتیبانی خوب"], mark: "بـ", color: "orange" },
  { name: "فودمارکت", score: "۴٫۳", reviews: "۱۲ نظر", tags: ["ویژه کافه", "ارسال منظم"], mark: "فـ", color: "blue" },
];

export const popularProducts = [
  { name: "شیر پرچرب کاله", meta: "بسته ۶ عددی", price: "۳۸۵٬۰۰۰", image: "/images/products/milk.png" },
  { name: "قهوه اسپرسو لمیز", meta: "بسته ۱ کیلوگرم", price: "۱٬۲۴۰٬۰۰۰", image: "/images/products/coffee.png" },
  { name: "پنیر پیتزا موزارلا", meta: "بسته ۲ کیلوگرم", price: "۸۹۰٬۰۰۰", image: "/images/products/vanilla-syrup.png" },
  { name: "گوجه فرنگی تازه", meta: "بسته ۵ کیلوگرم", price: "۳۴۵٬۰۰۰", image: "/images/products/tomato.png" },
];

export const dashboardSummary = {
  spending: "۱۲۳٬۴۵۰٬۰۰۰",
  alert: "قیمت ۲ قلم تغییر کرده است",
  alertDescription: "مبلغ جدید را قبل از تأیید بررسی کنید.",
};
