import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendarTime,
  IconChecklist,
  IconUser,
} from "@tabler/icons-react";
import {
  cafeRequestPriorityConfig,
  cafeRequestStatusConfig,
  formatPersianDate,
  formatPersianNumber,
  type CafeRequestListItemView,
} from "@/components/cafe/requests/cafe-request-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function RequestCard({ request }: { request: CafeRequestListItemView }) {
  const status = cafeRequestStatusConfig[request.status];
  const priority = cafeRequestPriorityConfig[request.priority];

  return (
    <Card className="p-4 transition hover:border-primary/25 hover:shadow-card sm:p-5">
      <article className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* Info Column */}
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant={priority.variant}>اولویت: {priority.label}</Badge>

            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <IconCalendarTime size={15} aria-hidden="true" />
              {formatPersianDate(request.createdAt)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-ink">
            <span className="flex items-center gap-1.5 text-ink-muted">
              <IconUser size={15} className="text-primary" />
              ثبت‌شده توسط:{" "}
              <strong className="text-ink">{request.requesterName ?? "همکار کافه"}</strong>
            </span>

            <span className="flex items-center gap-1.5 text-ink-muted">
              <IconChecklist size={15} className="text-primary" />
              تعداد اقلام:{" "}
              <strong className="text-ink">
                {formatPersianNumber(request.itemCount)} قلم
              </strong>
            </span>
          </div>

          {request.reason ? (
            <p className="line-clamp-2 text-xs leading-6 text-ink-muted">
              علت درخواست: {request.reason}
            </p>
          ) : null}
        </div>

        {/* Action Button */}
        <div className="border-t border-line/80 pt-3 md:border-0 md:pt-0">
          <Link
            href={`/cafe/requests/${request.id}`}
            className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-control bg-surface-subtle px-4 text-xs font-bold text-ink transition hover:bg-primary hover:text-white sm:w-auto"
          >
            <span>مشاهده جزئیات و بررسی</span>
            <IconArrowLeft size={16} />
          </Link>
        </div>
      </article>
    </Card>
  );
}
