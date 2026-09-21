import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "بررسی سبد خرید، اطلاعات تحویل و پرداخت سفارش",
  robots: { index: false, follow: false },
};

export default function DashboardCartPage() {
  return <CartPage />;
}
