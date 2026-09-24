import type { Metadata } from "next";
import { NotificationsPage } from "@/components/notifications/notifications-page";

export const metadata: Metadata = {
  title: "اعلان‌ها",
  description: "مشاهده آخرین رویدادها و اطلاع‌رسانی‌های سفارش",
  robots: { index: false, follow: false },
};

export default function CafeNotificationsPage() {
  return <NotificationsPage />;
}
