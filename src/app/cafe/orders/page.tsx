import type { Metadata } from "next";
import { OrdersPage } from "@/components/orders/orders-page";

export const metadata: Metadata = {
  title: "سفارش‌ها",
  description: "مدیریت، فیلتر و پیگیری سفارش‌های خرید مواد اولیه",
  robots: { index: false, follow: false },
};

export default function DashboardOrdersPage() {
  return <OrdersPage />;
}
