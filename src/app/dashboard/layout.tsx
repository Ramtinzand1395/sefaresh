import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "داشبورد",
  description: "مرکز مدیریت خرید، سفارش‌ها و تأمین‌کنندگان سفارش",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="buyer">{children}</DashboardShell>;
}
