import {
  IconAlertTriangle,
  IconArrowsExchange,
  IconInfoCircle,
  IconReceipt,
  IconTag,
  type TablerIcon,
} from "@tabler/icons-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationCategory = "order" | "request" | "supplier" | "system";

export type NotificationItem = {
  id: string;
  category: NotificationCategory;
  /** Icon shown in the colored circle. */
  icon: TablerIcon;
  /** Visual tone for the icon background. */
  tone: "success" | "warning" | "info" | "violet";
  title: string;
  description: string;
  /** Human-readable relative time, e.g. "امروز - ۱۰:۳۰". */
  timeLabel: string;
  /** Category badge text, e.g. "سفارش", "پیشنهاد". */
  badgeLabel: string;
  badgeTone: "success" | "warning" | "info" | "violet" | "neutral";
  read: boolean;
  /** Primary CTA label. */
  actionLabel: string;
  /** Optional secondary CTA label. */
  secondaryActionLabel?: string;
  /** Sender/source name for the detail modal. */
  source: string;
};

// ---------------------------------------------------------------------------
// Filter tab options
// ---------------------------------------------------------------------------

export type NotificationFilterTab = "all" | "unread" | NotificationCategory;

export const notificationFilterTabs: Array<{
  value: NotificationFilterTab;
  label: string;
}> = [
  { value: "all", label: "همه" },
  { value: "unread", label: "خوانده‌نشده" },
  { value: "order", label: "سفارش‌ها" },
  { value: "request", label: "درخواست‌های خرید" },
  { value: "supplier", label: "تأمین‌کنندگان" },
  { value: "system", label: "سیستم" },
];

// ---------------------------------------------------------------------------
// Mock notifications — realistic cafe/restaurant procurement data
// ---------------------------------------------------------------------------

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    category: "order",
    icon: IconReceipt,
    tone: "success",
    title: "«سفارش جدید ثبت شد»",
    description: "درخواست خرید شما با موفقیت ثبت شد.",
    timeLabel: "امروز - ۱۰:۳۰",
    badgeLabel: "سفارش",
    badgeTone: "success",
    read: false,
    actionLabel: "مشاهده سفارش",
    source: "سیستم سفارش",
  },
  {
    id: "notif-2",
    category: "supplier",
    icon: IconTag,
    tone: "warning",
    title: "«پیشنهاد جدید تأمین‌کننده»",
    description:
      "یک تأمین‌کننده برای درخواست خرید شما قیمت جدید ارسال کرده است.",
    timeLabel: "دیروز - ۱۴:۴۵",
    badgeLabel: "پیشنهاد",
    badgeTone: "warning",
    read: false,
    actionLabel: "مشاهده پیشنهاد",
    source: "بازار کرمان",
  },
  {
    id: "notif-3",
    category: "order",
    icon: IconArrowsExchange,
    tone: "info",
    title: "«وضعیت سفارش تغییر کرد»",
    description:
      "وضعیت سفارش از «در انتظار تأیید» به «تأیید شده» تغییر کرد.",
    timeLabel: "۲ روز پیش - ۱۴:۳۰",
    badgeLabel: "سفارش",
    badgeTone: "success",
    read: false,
    actionLabel: "مشاهده جزئیات",
    source: "پخش بهاران",
  },
  {
    id: "notif-4",
    category: "supplier",
    icon: IconAlertTriangle,
    tone: "warning",
    title: "«قیمت جدید ارسال شد»",
    description:
      "یک تأمین‌کننده برای درخواست شما قیمت جدید ارسال کرده است.",
    timeLabel: "دیروز - ۱۶:۳۵",
    badgeLabel: "قیمت",
    badgeTone: "warning",
    read: false,
    actionLabel: "مشاهده جزئیات",
    secondaryActionLabel: "مشاهده سفارش",
    source: "فودمارکت",
  },
  {
    id: "notif-5",
    category: "order",
    icon: IconReceipt,
    tone: "success",
    title: "«سفارش شما تحویل شد»",
    description:
      "سفارش #۱۲۵۵ با موفقیت به آدرس شما تحویل داده شد.",
    timeLabel: "۳ روز پیش - ۰۹:۱۵",
    badgeLabel: "سفارش",
    badgeTone: "success",
    read: true,
    actionLabel: "مشاهده سفارش",
    source: "فودمارکت",
  },
  {
    id: "notif-6",
    category: "request",
    icon: IconReceipt,
    tone: "info",
    title: "«درخواست خرید تأیید شد»",
    description:
      "درخواست خرید مواد اولیه هفته آینده توسط مدیر مجموعه تأیید شد.",
    timeLabel: "۳ روز پیش - ۱۱:۲۰",
    badgeLabel: "درخواست",
    badgeTone: "info",
    read: true,
    actionLabel: "مشاهده درخواست",
    source: "سیستم سفارش",
  },
  {
    id: "notif-7",
    category: "system",
    icon: IconInfoCircle,
    tone: "violet",
    title: "«به‌روزرسانی سیستم»",
    description:
      "نسخه جدید سامانه سفارش با امکانات بهبودیافته منتشر شد.",
    timeLabel: "۱ هفته پیش - ۰۸:۰۰",
    badgeLabel: "سیستم",
    badgeTone: "violet",
    read: true,
    actionLabel: "مشاهده جزئیات",
    source: "تیم سفارش",
  },
  {
    id: "notif-8",
    category: "supplier",
    icon: IconTag,
    tone: "warning",
    title: "«پیشنهاد ویژه تأمین‌کننده»",
    description:
      "بازار کرمان تخفیف ویژه برای سفارش‌های بالای ۵ میلیون تومان اعلام کرده است.",
    timeLabel: "۱ هفته پیش - ۱۲:۳۰",
    badgeLabel: "پیشنهاد",
    badgeTone: "warning",
    read: true,
    actionLabel: "مشاهده پیشنهاد",
    source: "بازار کرمان",
  },
  {
    id: "notif-9",
    category: "order",
    icon: IconArrowsExchange,
    tone: "info",
    title: "«سفارش آماده ارسال»",
    description:
      "سفارش #۱۲۵۶ توسط تأمین‌کننده آماده ارسال شده است.",
    timeLabel: "۵ روز پیش - ۱۶:۰۰",
    badgeLabel: "سفارش",
    badgeTone: "success",
    read: true,
    actionLabel: "مشاهده سفارش",
    source: "زرین پخش",
  },
  {
    id: "notif-10",
    category: "supplier",
    icon: IconAlertTriangle,
    tone: "warning",
    title: "«تغییر قیمت کالا»",
    description:
      "قیمت شیر پرچرب پگاه نزد تأمین‌کننده بازار کرمان تغییر کرده است.",
    timeLabel: "۲ روز پیش - ۱۰:۱۵",
    badgeLabel: "قیمت",
    badgeTone: "warning",
    read: false,
    actionLabel: "مشاهده جزئیات",
    source: "بازار کرمان",
  },
  {
    id: "notif-11",
    category: "system",
    icon: IconInfoCircle,
    tone: "violet",
    title: "«امکانات جدید سفارش»",
    description:
      "قابلیت مقایسه هم‌زمان چند تأمین‌کننده به داشبورد اضافه شد.",
    timeLabel: "۲ هفته پیش - ۰۹:۰۰",
    badgeLabel: "سیستم",
    badgeTone: "violet",
    read: true,
    actionLabel: "مشاهده جزئیات",
    source: "تیم سفارش",
  },
  {
    id: "notif-12",
    category: "request",
    icon: IconReceipt,
    tone: "info",
    title: "«درخواست خرید جدید ثبت شد»",
    description:
      "درخواست خرید قهوه اسپرسو و سیروپ وانیل توسط انباردار ثبت شد.",
    timeLabel: "۴ روز پیش - ۱۳:۴۰",
    badgeLabel: "درخواست",
    badgeTone: "info",
    read: true,
    actionLabel: "مشاهده درخواست",
    source: "کافه لیمز",
  },
];

// ---------------------------------------------------------------------------
// Aggregate stats
// ---------------------------------------------------------------------------

export function getNotificationStats(items: NotificationItem[]) {
  return {
    total: items.length,
    unread: items.filter((n) => !n.read).length,
  };
}
