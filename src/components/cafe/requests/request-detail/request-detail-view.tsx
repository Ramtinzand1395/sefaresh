import Link from "next/link";
import {
  IconArrowRight,
  IconCalendarTime,
  IconCheck,
  IconChecklist,
  IconClock,
  IconFileDescription,
  IconShieldCheck,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import {
  cafeRequestItemApprovalConfig,
  cafeRequestPriorityConfig,
  cafeRequestStatusConfig,
  formatPersianDate,
  formatPersianNumber,
  type CafeRequestDetailView,
} from "@/components/cafe/requests/cafe-request-types";
import { AddToShoppingListButton } from "@/components/cafe/requests/request-detail/add-to-shopping-list-button";
import { RequestReviewForm } from "@/components/cafe/requests/request-detail/request-review-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function RequestDetailView({
  request,
  canReview,
}: {
  request: CafeRequestDetailView;
  canReview: boolean;
}) {
  const status = cafeRequestStatusConfig[request.status];
  const priority = cafeRequestPriorityConfig[request.priority];
  const isReviewed = request.status !== "pending" && request.status !== "cancelled";
  const isApprovedOrPartial =
    request.status === "approved" || request.status === "partially_approved";

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          href="/cafe/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted transition hover:text-primary"
        >
          <IconArrowRight size={16} />
          <span>بازگشت به فهرست درخواست‌ها</span>
        </Link>
      </div>

      {/* Header Card */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-ink">
                جزئیات درخواست خرید
              </h1>
              <Badge variant={status.variant}>{status.label}</Badge>
              <Badge variant={priority.variant}>اولویت: {priority.label}</Badge>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-ink-muted">
              <IconCalendarTime size={15} />
              زمان ثبت درخواست: {formatPersianDate(request.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-surface-subtle p-3 text-xs">
            <IconUser size={18} className="text-primary" />
            <div>
              <p className="text-[10px] text-ink-muted">ثبت‌کننده درخواست</p>
              <p className="font-bold text-ink">
                {request.requesterName ?? "همکار کافه"}
              </p>
            </div>
          </div>
        </div>

        {/* Reason */}
        {request.reason ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface-subtle/60 p-3 text-xs">
            <IconFileDescription size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <span className="font-bold text-ink">دلیل یا شرح درخواست: </span>
              <span className="leading-6 text-ink-muted">{request.reason}</span>
            </div>
          </div>
        ) : null}

        {/* Review metadata if reviewed */}
        {isReviewed ? (
          <div className="mt-4 rounded-xl border border-line bg-surface-subtle/30 p-4 text-xs space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-ink">
                <IconShieldCheck size={16} className="text-success" />
                بررسی‌شده توسط: {request.reviewerName ?? "مدیریت"}
              </span>

              {request.reviewedAt ? (
                <span className="flex items-center gap-1 text-ink-muted">
                  <IconClock size={15} />
                  زمان بررسی: {formatPersianDate(request.reviewedAt)}
                </span>
              ) : null}
            </div>

            {request.reviewNote ? (
              <p className="text-ink-muted leading-6">
                <strong className="text-ink">توضیحات بررسی‌کننده: </strong>
                {request.reviewNote}
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>

      {/* Add to shopping list action banner for approved requests */}
      {isApprovedOrPartial ? (
        <AddToShoppingListButton requestId={request.id} />
      ) : null}

      {/* Items Section: either interactive Review Form or Read-only view */}
      {canReview && request.status === "pending" ? (
        <Card className="p-5 sm:p-6">
          <RequestReviewForm requestId={request.id} items={request.items} />
        </Card>
      ) : (
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="text-sm font-black text-ink">اقلام درخواست</h2>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              <IconChecklist size={16} />
              {formatPersianNumber(request.items.length)} قلم
            </span>
          </div>

          <div className="space-y-3">
            {request.items.map((item, index) => {
              const itemStatus = cafeRequestItemApprovalConfig[item.approvalStatus];
              const title = item.productTitle || item.customTitle || "کالای بدون عنوان";

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-line p-4 md:flex-row md:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-md bg-surface-subtle text-xs font-bold text-ink-muted">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-black text-ink">{title}</h3>
                      {item.productBrand ? (
                        <span className="text-xs text-ink-muted">({item.productBrand})</span>
                      ) : null}
                      {!item.productId ? (
                        <span className="rounded bg-violet-soft px-1.5 py-0.5 text-[10px] font-bold text-violet">
                          کالای سفارشی
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                      <span>
                        مقدار درخواستی:{" "}
                        <strong className="text-ink">
                          {formatPersianNumber(item.quantity)} {item.productUnit ?? "عدد"}
                        </strong>
                      </span>

                      {item.note ? (
                        <span>
                          توضیحات: <span className="text-ink">{item.note}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-line/70 pt-2 md:border-0 md:pt-0">
                    <Badge variant={itemStatus.variant} className="gap-1">
                      {item.approvalStatus === "approved" ? (
                        <IconCheck size={14} />
                      ) : item.approvalStatus === "rejected" ? (
                        <IconX size={14} />
                      ) : null}
                      <span>{itemStatus.label}</span>
                    </Badge>

                    {item.approvalStatus === "approved" ? (
                      <span className="text-xs font-bold text-success">
                        تأییدشده: {formatPersianNumber(item.approvedQuantity)} {item.productUnit ?? "عدد"}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
