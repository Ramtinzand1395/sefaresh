export type SettingsTabId =
  | "account"
  | "business"
  | "notifications"
  | "purchasing"
  | "billing"
  | "security"
  | "appearance";

export type ThemePreference = "light" | "dark" | "system";
export type LayoutDirection = "rtl" | "ltr";

export type SettingsTab = {
  id: SettingsTabId;
  label: string;
};

export const settingsTabs: SettingsTab[] = [
  { id: "account", label: "حساب کاربری" },
  { id: "business", label: "اطلاعات کسب‌وکار" },
  { id: "notifications", label: "اعلان‌ها" },
  { id: "purchasing", label: "خرید و سفارش" },
  { id: "billing", label: "پرداخت و فاکتور" },
  { id: "security", label: "امنیت" },
  { id: "appearance", label: "ظاهر و تم" },
];

export const settingsPreview: Record<
  Exclude<SettingsTabId, "appearance">,
  { title: string; description: string; items: Array<{ label: string; value: string }> }
> = {
  account: {
    title: "حساب کاربری",
    description: "اطلاعات فردی و راه‌های ارتباطی مدیر حساب",
    items: [
      { label: "نام و نام خانوادگی", value: "کامران لیمویی" },
      { label: "شماره همراه", value: "۰۹۱۳ ۱۲۳ ۴۵۶۷" },
      { label: "سمت", value: "مدیر مجموعه" },
    ],
  },
  business: {
    title: "اطلاعات کسب‌وکار",
    description: "مشخصات مجموعه‌ای که سفارش‌ها برای آن ثبت می‌شوند",
    items: [
      { label: "نام مجموعه", value: "کافه لیمز" },
      { label: "شهر", value: "کرمان" },
      { label: "نوع فعالیت", value: "کافه و رستوران" },
    ],
  },
  notifications: {
    title: "اعلان‌ها",
    description: "روش دریافت خبرهای مهم سفارش و موجودی",
    items: [
      { label: "تغییر وضعیت سفارش", value: "پیامک و اعلان داخل برنامه" },
      { label: "پیشنهاد جدید تأمین‌کننده", value: "اعلان داخل برنامه" },
      { label: "یادآوری پرداخت", value: "پیامک" },
    ],
  },
  purchasing: {
    title: "خرید و سفارش",
    description: "تنظیمات پیش‌فرض ثبت درخواست و تحویل کالا",
    items: [
      { label: "آدرس پیش‌فرض", value: "کرمان، بلوار جمهوری" },
      { label: "بازه تحویل", value: "۹ تا ۱۴" },
      { label: "تأیید نهایی", value: "فقط مدیر مجموعه" },
    ],
  },
  billing: {
    title: "پرداخت و فاکتور",
    description: "اطلاعات صورتحساب و روش پرداخت ترجیحی",
    items: [
      { label: "نوع فاکتور", value: "رسمی" },
      { label: "روش پرداخت", value: "درگاه آنلاین" },
      { label: "شناسه اقتصادی", value: "ثبت شده" },
    ],
  },
  security: {
    title: "امنیت",
    description: "کنترل ورود، نشست‌ها و دسترسی کاربران مجموعه",
    items: [
      { label: "ورود دومرحله‌ای", value: "فعال" },
      { label: "آخرین ورود", value: "امروز، ساعت ۱۰:۴۵" },
      { label: "نشست‌های فعال", value: "۲ دستگاه" },
    ],
  },
};
