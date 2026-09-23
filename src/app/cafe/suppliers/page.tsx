import type { Metadata } from "next";
import { SuppliersPage } from "@/components/suppliers/suppliers-page";

export const metadata: Metadata = {
  title: "تأمین‌کنندگان",
  description:
    "تأمین‌کنندگان تأییدشده را بر اساس قیمت، کیفیت و زمان ارسال مقایسه کنید.",
  robots: { index: false, follow: false },
};

export default function DashboardSuppliersPage() {
  return <SuppliersPage />;
}
