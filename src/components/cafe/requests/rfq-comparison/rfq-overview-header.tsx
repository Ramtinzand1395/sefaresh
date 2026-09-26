"use client";

import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCalendar,
  IconCalendarEvent,
  IconClock,
  IconFileText,
  IconSend,
  IconUsers,
} from "@tabler/icons-react";
import {
  formatPersianDate,
  formatPersianNumber,
  type RfqComparisonDetailView,
} from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type RfqOverviewHeaderProps = {
  rfq: RfqComparisonDetailView["purchaseRequest"];
  metrics: RfqComparisonDetailView["metrics"];
};

export function RfqOverviewHeader({ rfq, metrics }: RfqOverviewHeaderProps) {
  const statusLabels: Record<string, { label: string; variant: "success" | "neutral" | "warning" | "danger" | "info" }> = {
    draft: { label: "پیش‌نویس", variant: "neutral" },
    matching: { label: "در حال تطبیق", variant: "info" },
    collecting_offers: { label: "دریافت پیشنهادها", variant: "success" },
    completed: { label: "تکمیل شده", variant: "neutral" },
    cancelled: { label: "لغو شده", variant: "danger" },
    expired: { label: "مهلت منقضی شده", variant: "warning" },
  };

  const statusConfig = statusLabels[rfq.status] ?? {
    label: rfq.status,
    variant: "neutral",
  };

  return (
    <div className="space-y-4">
      {/* Top back navigation */}
      <div>
        <Link
          href="/cafe/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted transition hover:text-ink"
        >
          <IconArrowRight size={16} />
          <span>بازگشت به لیست استعلام‌ها و درخواست‌ها</span>
        </Link>
      </div>

      {/* Main Overview Card */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-white">
                <IconFileText size={20} />
              </span>
              <h1 className="text-lg font-black text-ink sm:text-xl">
                {rfq.title}
              </h1>
              <Badge variant={statusConfig.variant} className="text-xs">
                {statusConfig.label}
              </Badge>
              {rfq.isExpired && rfq.status !== "expired" ? (
                <Badge variant="warning" className="gap-1 text-xs">
                  <IconAlertTriangle size={13} />
                  <span>پایان مهلت ارسال پاسخ</span>
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <IconCalendar size={15} />
                ثبت استعلام: {formatPersianDate(rfq.createdAt)}
              </span>

              {rfq.expiresAt ? (
                <span className="flex items-center gap-1 font-bold text-ink">
                  <IconClock size={15} className="text-primary" />
                  مهلت پاسخ تأمین‌کنندگان: {formatPersianDate(rfq.expiresAt)}
                </span>
              ) : null}

              {rfq.neededAt ? (
                <span className="flex items-center gap-1">
                  <IconCalendarEvent size={15} />
                  تاریخ تحویل مدنظر: {formatPersianDate(rfq.neededAt)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-line bg-surface-subtle px-3 py-2 text-xs font-bold text-ink">
            <span>تعداد اقلام استعلام:</span>
            <strong className="text-primary font-black">
              {formatPersianNumber(metrics.itemCount)} قلم
            </strong>
          </div>
        </div>

        {/* Response Metrics Banner */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line/70 pt-4 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-surface-subtle/80 p-3">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <IconUsers size={16} className="text-primary" />
              <span>تأمین‌کنندگان دعوت‌شده</span>
            </div>
            <p className="mt-1 text-sm font-black text-ink">
              {formatPersianNumber(metrics.invitedSuppliersCount)} تأمین‌کننده
            </p>
          </div>

          <div className="rounded-xl bg-surface-subtle/80 p-3">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <IconSend size={16} className="text-success" />
              <span>پاسخ‌های ثبت‌شده</span>
            </div>
            <p className="mt-1 text-sm font-black text-success">
              {formatPersianNumber(metrics.totalResponsesCount)} پاسخ
            </p>
          </div>

          <div className="rounded-xl bg-surface-subtle/80 p-3">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <IconClock size={16} className="text-amber-600" />
              <span>در انتظار پاسخ</span>
            </div>
            <p className="mt-1 text-sm font-black text-ink">
              {formatPersianNumber(metrics.pendingResponsesCount)} مورد
            </p>
          </div>

          <div className="rounded-xl bg-primary-soft/30 p-3">
            <div className="flex items-center gap-1.5 text-primary">
              <IconFileText size={16} />
              <span>پیشنهادهای قیمت فعال</span>
            </div>
            <p className="mt-1 text-sm font-black text-primary">
              {formatPersianNumber(metrics.commercialOffersCount)} پیشنهاد
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
