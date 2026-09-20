export const mainNavigation = [
  { label: "چطور کار می‌کند", href: "/#how-it-works" },
  { label: "امکانات", href: "/#features" },
  { label: "تأمین‌کنندگان", href: "/#suppliers" },
  { label: "درباره ما", href: "/about" },
] as const;

export const coveredCities = ["کرمان", "رفسنجان", "سیرجان", "بم", "جیرفت"] as const;

export const siteConfig = {
  name: "سفارش",
  description: "دستیار خرید مواد اولیه کافه‌ها و رستوران‌های کرمان",
  slogan: "خرید مواد اولیه آسان شد",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
