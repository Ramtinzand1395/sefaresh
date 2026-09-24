import {
  IconBell,
  IconChartBar,
  IconBuildingStore,
  IconClipboardList,
  IconCube,
  IconFileText,
  IconHome,
  IconPackage,
  IconReceipt,
  IconSettings,
  IconShoppingCart,
  IconStar,
  IconTruck,
  IconUsersGroup,
  IconWallet,
  type TablerIcon,
} from "@tabler/icons-react";

export type DashboardRole = "buyer" | "supplier";

export type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: TablerIcon;
  implemented: boolean;
  badge?: string;
};

// Future routes stay visible as an information-architecture preview, but remain disabled until built.
export const dashboardNavigation: DashboardNavigationItem[] = [
  { label: "داشبورد", href: "/cafe", icon: IconHome, implemented: true },
  { label: "درخواست مواد اولیه", href: "/cafe/requests", icon: IconClipboardList, implemented: false },
  { label: "کالاها", href: "/cafe/products", icon: IconCube, implemented: true },
  { label: "سبد خرید", href: "/cafe/cart", icon: IconShoppingCart, implemented: true, badge: "۴" },
  { label: "سفارش‌ها", href: "/cafe/orders", icon: IconReceipt, implemented: true },
  { label: "هزینه خرید", href: "/cafe/spend", icon: IconChartBar, implemented: true },
  { label: "تأمین‌کنندگان", href: "/cafe/suppliers", icon: IconUsersGroup, implemented: true },
  { label: "اعلان‌ها", href: "/cafe/notifications", icon: IconBell, implemented: true, badge: "۳" },
  { label: "تنظیمات", href: "/cafe/settings", icon: IconSettings, implemented: true },
];

export const supplierNavigation: DashboardNavigationItem[] = [
  { label: "داشبورد", href: "/supplier", icon: IconHome, implemented: true },
  {
    label: "درخواست‌های خرید",
    href: "/supplier/requests",
    icon: IconShoppingCart,
    implemented: true,
    badge: "۲۸",
  },
  { label: "پیشنهادهای من", href: "/supplier/proposals", icon: IconFileText, implemented: true },
  {
    label: "سفارش‌ها",
    href: "/supplier/orders",
    icon: IconClipboardList,
    implemented: true,
    badge: "۴",
  },
  { label: "کالاهای من", href: "/supplier/products", icon: IconPackage, implemented: true },
  { label: "ارسال‌ها", href: "/supplier/shipments", icon: IconTruck, implemented: true },
  { label: "مالی و تسویه", href: "/supplier/finance", icon: IconWallet, implemented: true },
  { label: "گزارش‌ها", href: "/supplier/reports", icon: IconChartBar, implemented: true },
  { label: "امتیاز و نظرات", href: "/supplier/reviews", icon: IconStar, implemented: true },
  { label: "اعلان‌ها", href: "/supplier/notifications", icon: IconBell, implemented: true },
  { label: "پروفایل و تنظیمات", href: "/supplier/settings", icon: IconSettings, implemented: true },
];

export const dashboardAccount = {
  userName: "کاوه لیمز",
  businessName: "کافه لیمز",
  role: "مدیر مجموعه",
  city: "کرمان",
  initials: "ک‌ل",
  icon: IconBuildingStore,
} as const;

export const supplierAccount = {
  userName: "علی محمدی",
  businessName: "بازرگانی قهوه آریا",
  role: "تأمین‌کننده",
  city: "کرمان",
  initials: "ع‌م",
  verificationLabel: "تأمین‌کننده معتبر",
} as const;

export const dashboardNavigationByRole = {
  buyer: dashboardNavigation,
  supplier: supplierNavigation,
} satisfies Record<DashboardRole, DashboardNavigationItem[]>;

export const dashboardAccountByRole = {
  buyer: dashboardAccount,
  supplier: supplierAccount,
} satisfies Record<DashboardRole, typeof dashboardAccount | typeof supplierAccount>;

export const dashboardSearchByRole = {
  buyer: {
    action: "/cafe",
    placeholder: "جست‌وجوی کالا، تأمین‌کننده، سفارش…",
    label: "جست‌وجو در کالاها، تأمین‌کنندگان و سفارش‌ها",
  },
  supplier: {
    action: "/supplier",
    placeholder: "جستجو در درخواست‌ها، سفارش‌ها، کالاها و ...",
    label: "جستجو در درخواست‌ها، سفارش‌ها و کالاها",
  },
} satisfies Record<DashboardRole, { action: string; placeholder: string; label: string }>;
