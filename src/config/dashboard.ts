import {
  IconBell,
  IconBuildingStore,
  IconChartBar,
  IconClipboardList,
  IconCube,
  IconHome,
  IconReceipt,
  IconSettings,
  IconShoppingCart,
  IconUsersGroup,
  type TablerIcon,
} from "@tabler/icons-react";

export type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: TablerIcon;
  implemented: boolean;
  badge?: string;
};

// Future routes stay visible as an information-architecture preview, but remain disabled until built.
export const dashboardNavigation: DashboardNavigationItem[] = [
  { label: "داشبورد", href: "/dashboard", icon: IconHome, implemented: true },
  { label: "درخواست مواد اولیه", href: "/dashboard/requests", icon: IconClipboardList, implemented: false },
  { label: "کالاها", href: "/dashboard/products", icon: IconCube, implemented: true },
  { label: "سبد خرید", href: "/dashboard/cart", icon: IconShoppingCart, implemented: false, badge: "۲" },
  { label: "سفارش‌ها", href: "/dashboard/orders", icon: IconReceipt, implemented: false },
  { label: "هزینه خرید", href: "/dashboard/spend", icon: IconChartBar, implemented: false },
  { label: "تأمین‌کنندگان", href: "/dashboard/suppliers", icon: IconUsersGroup, implemented: false },
  { label: "اعلان‌ها", href: "/dashboard/notifications", icon: IconBell, implemented: false, badge: "۳" },
  { label: "تنظیمات", href: "/dashboard/settings", icon: IconSettings, implemented: false },
];

export const dashboardAccount = {
  businessName: "کافه لیمز",
  role: "مدیر مجموعه",
  city: "کرمان",
  icon: IconBuildingStore,
} as const;
