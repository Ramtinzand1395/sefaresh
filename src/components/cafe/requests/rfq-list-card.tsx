import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconChecklist,
  IconClock,
  IconFileText,
} from "@tabler/icons-react";
import type { RfqListItemView } from "@/components/cafe/requests/cafe-request-types";
import {
  formatPersianDate,
  formatPersianNumber,
} from "@/components/cafe/shopping-list/shopping-list-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function RfqListCard({ rfq }: { rfq: RfqListItemView }) {
  const statusLabels: Record<
    string,
    { label: string; variant: "success" | "neutral" | "warning" | "danger" | "info" }
  > = {
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
    <Card className="p-4 transition hover:border-primary/40 hover:shadow-sm sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <IconFileText size={20} />
          </span>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-ink">{rfq.title}</h3>
              <Badge variant={statusConfig.variant} className="text-[10px]">
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <IconChecklist size={14} className="text-primary" />
                <span>{formatPersianNumber(rfq.itemCount)} قلم کالا</span>
              </span>

              <span className="flex items-center gap-1">
                <IconCalendar size={14} />
                <span>ثبت: {formatPersianDate(rfq.createdAt)}</span>
              </span>

              {rfq.expiresAt ? (
                <span className="flex items-center gap-1 font-bold text-ink">
                  <IconClock size={14} className="text-primary" />
                  <span>مهلت: {formatPersianDate(rfq.expiresAt)}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-line/60 pt-3 sm:border-0 sm:pt-0">
          <Link
            href={`/cafe/requests/${rfq.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-control bg-primary px-4 text-xs font-bold text-white transition hover:bg-primary-hover"
          >
            <span>بررسی و مقایسه پیشنهادها</span>
            <IconArrowLeft size={15} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
