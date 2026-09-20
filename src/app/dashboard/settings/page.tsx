import type { Metadata } from "next";
import { SettingsPage } from "@/components/settings/settings-page";

export const metadata: Metadata = {
  title: "تنظیمات",
  description: "مدیریت حساب، کسب‌وکار، اعلان‌ها و ظاهر داشبورد سفارش",
  robots: { index: false, follow: false },
};

export default function DashboardSettingsPage() {
  return <SettingsPage />;
}
