import type { Metadata } from "next";
import { SpendPage } from "@/components/spend/spend-page";

export const metadata: Metadata = {
  title: "هزینه خرید",
  description: "گزارش هزینه‌های خرید، بودجه و روند مصرف کسب‌وکار",
  robots: { index: false, follow: false },
};

export default function DashboardSpendPage() {
  return <SpendPage />;
}
