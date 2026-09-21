import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "پنل تأمین‌کننده",
    template: "%s | پنل تأمین‌کننده",
  },
  description: "مرکز مدیریت درخواست‌ها، پیشنهادها، سفارش‌ها و تسویه‌های تأمین‌کننده سفارش",
  robots: { index: false, follow: false },
};

export default function SupplierLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="supplier">{children}</DashboardShell>;
}
