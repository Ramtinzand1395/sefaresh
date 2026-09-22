import Link from "next/link";
import {
  IconBookmark,
  IconCalendarTime,
  IconCheck,
  IconClock,
  IconDotsVertical,
  IconEye,
  IconMapPin,
  IconPackage,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PurchaseRequest, RequestStatus } from "@/data/purchase-requests";
import { cn } from "@/lib/cn";

const numberFormatter = new Intl.NumberFormat("fa-IR");

const statusConfig: Record<
  RequestStatus,
  { label: string; variant: "info" | "neutral" | "success" | "warning" | "danger" }
> = {
  new: { label: "جدید", variant: "info" },
  viewed: { label: "مشاهده‌شده", variant: "neutral" },
  proposal_sent: { label: "پیشنهاد ارسال‌شده", variant: "success" },
  urgent: { label: "نزدیک پایان", variant: "warning" },
  expired: { label: "منقضی‌شده", variant: "danger" },
};

type PurchaseRequestCardProps = {
  request: PurchaseRequest;
  status: RequestStatus;
  saved: boolean;
  onToggleSaved: (requestId: string) => void;
  onMarkViewed: (requestId: string) => void;
};

export function PurchaseRequestCard({
  request,
  status,
  saved,
  onToggleSaved,
  onMarkViewed,
}: PurchaseRequestCardProps) {
  const isExpired = status === "expired";
  const statusDetails = statusConfig[status];
  const matchPercent = Math.round((request.match.matchedItems / request.match.totalItems) * 100);
  const deadlineVariant = isExpired || request.deadlineInHours < 2
    ? "danger"
    : request.deadlineInHours < 24
      ? "warning"
      : "info";
  const remainingItemCount = Math.max(0, request.match.totalItems - request.items.length);

  return (
    <Card
      className={cn(
        "p-4 shadow-none transition hover:border-primary/25 hover:shadow-card sm:p-5",
        isExpired && "bg-slate-50/70",
      )}
    >
      <article className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(12rem,.95fr)_minmax(13rem,1.25fr)_minmax(8rem,.7fr)_minmax(9rem,.8fr)_minmax(9rem,auto)] lg:items-center lg:gap-4">
        <div className="min-w-0 md:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-xs font-black text-primary">
                {request.buyer.initials}
              </span>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <h2 className="truncate text-sm font-black text-ink">{request.buyer.name}</h2>
                  {request.buyer.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success">
                      <IconCheck size={13} className="rounded-full bg-success text-white" aria-hidden="true" />
                      تأییدشده
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                  <IconMapPin size={14} aria-hidden="true" />
                  {request.buyer.cityLabel}
                </p>
              </div>
            </div>

            <RequestMenu
              requestId={request.id}
              expired={isExpired}
              saved={saved}
              onToggleSaved={onToggleSaved}
              onMarkViewed={onMarkViewed}
            />
          </div>

          <div className="mt-3 hidden flex-wrap items-center gap-2 lg:flex">
            <Badge variant={statusDetails.variant}>{statusDetails.label}</Badge>
            <span dir="ltr" className="text-xs font-black text-ink-muted">#{request.id}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:hidden">
          <Badge variant={statusDetails.variant}>{statusDetails.label}</Badge>
          <Badge variant={deadlineVariant} className="gap-1">
            <IconClock size={14} aria-hidden="true" />
            {request.deadlineLabel}
          </Badge>
          {saved ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
              <IconBookmark size={14} fill="currentColor" aria-hidden="true" />
              ذخیره‌شده
            </span>
          ) : null}
        </div>

        <p dir="ltr" className="self-center text-right text-xs font-black text-ink-muted lg:hidden">#{request.id}</p>

        <div className="min-w-0 border-t border-line/80 pt-4 lg:border-0 lg:pt-0">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-ink-muted">
            <IconPackage size={15} className="text-primary" aria-hidden="true" />
            بخشی از کالاهای درخواستی
          </p>
          <ul className="space-y-1.5">
            {request.items.slice(0, 3).map((item) => (
              <li key={`${request.id}-${item.name}`} className="flex min-w-0 items-center justify-between gap-3 text-xs">
                <span className="truncate font-bold text-ink">{item.name}</span>
                <span className="shrink-0 text-ink-muted">× {item.quantity}</span>
              </li>
            ))}
          </ul>
          {remainingItemCount > 0 ? (
            <p className="mt-2 text-[11px] font-bold text-primary">
              +{numberFormatter.format(remainingItemCount)} قلم دیگر
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-line/80 pt-4 text-xs lg:grid-cols-1 lg:border-0 lg:pt-0">
          <div>
            <p className="text-[10px] text-ink-muted">ارزش تقریبی</p>
            <p className="mt-1 font-black text-ink">
              {numberFormatter.format(request.estimatedValue)}
              <span className="mr-1 text-[10px] font-bold text-ink-muted">تومان</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">تاریخ ثبت</p>
            <p className="mt-1 flex items-center gap-1 font-bold text-ink">
              <IconCalendarTime size={14} className="text-ink-muted" aria-hidden="true" />
              {request.createdAtLabel}
            </p>
          </div>
        </div>

        <div className="border-t border-line/80 pt-4 md:col-span-2 lg:col-span-1 lg:border-0 lg:pt-0">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black text-ink">
                {numberFormatter.format(request.match.matchedItems)} از {numberFormatter.format(request.match.totalItems)} قلم
              </p>
              <p className="mt-1 text-[10px] text-ink-muted">را می‌توانید تأمین کنید</p>
            </div>
            <span className="text-xs font-black text-primary">{numberFormatter.format(matchPercent)}٪</span>
          </div>
          <div
            role="progressbar"
            aria-label={`درصد تطابق کالاهای درخواست ${request.id}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={matchPercent}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"
          >
            <span className="block h-full rounded-full bg-primary" style={{ width: `${matchPercent}%` }} />
          </div>
          <Badge variant={deadlineVariant} className="mt-3 hidden max-w-full gap-1 whitespace-normal text-right leading-5 lg:inline-flex">
            <IconClock size={14} className="shrink-0" aria-hidden="true" />
            {request.deadlineLabel}
          </Badge>
        </div>

        <div className="border-t border-line/80 pt-4 md:col-span-2 lg:col-span-1 lg:border-0 lg:pt-0">
          {status === "proposal_sent" && request.proposal ? (
            <p className="mb-2 text-center text-[10px] font-bold text-success lg:text-right">
              پیشنهاد شما: {numberFormatter.format(request.proposal.amount)} تومان
            </p>
          ) : null}

          <RequestPrimaryAction request={request} status={status} />

          {saved ? (
            <p className="mt-2 hidden items-center justify-center gap-1 text-[10px] font-bold text-primary lg:flex">
              <IconBookmark size={13} fill="currentColor" aria-hidden="true" />
              ذخیره‌شده برای بعد
            </p>
          ) : null}
        </div>
      </article>
    </Card>
  );
}

function RequestPrimaryAction({ request, status }: { request: PurchaseRequest; status: RequestStatus }) {
  const commonClassName =
    "inline-flex min-h-11 w-full items-center justify-center rounded-control px-4 text-xs font-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  if (status === "expired") {
    return (
      <Link href={`/supplier/requests/${request.id}`} className={`${commonClassName} border border-line bg-white text-primary hover:bg-primary-soft`}>
        مشاهده جزئیات
      </Link>
    );
  }

  if (status === "proposal_sent" && request.proposal) {
    return (
      <Link href={`/supplier/requests/${request.id}`} className={`${commonClassName} border border-success/25 bg-success-soft text-success hover:border-success/40`}>
        مشاهده پیشنهاد
      </Link>
    );
  }

  return (
    <Link href={`/supplier/requests/${request.id}`} className={`${commonClassName} bg-primary text-white shadow-sm hover:bg-primary-hover`}>
      مشاهده و ارائه قیمت
    </Link>
  );
}

function RequestMenu({
  requestId,
  expired,
  saved,
  onToggleSaved,
  onMarkViewed,
}: {
  requestId: string;
  expired: boolean;
  saved: boolean;
  onToggleSaved: (requestId: string) => void;
  onMarkViewed: (requestId: string) => void;
}) {
  const closeMenu = (target: HTMLElement) => target.closest("details")?.removeAttribute("open");

  return (
    <details className="relative shrink-0">
      <summary
        aria-label={`اقدامات درخواست ${requestId}`}
        className="grid size-10 cursor-pointer list-none place-items-center rounded-control border border-line bg-white text-ink-muted transition marker:hidden hover:border-primary/30 hover:bg-primary-soft hover:text-primary [&::-webkit-details-marker]:hidden"
      >
        <IconDotsVertical size={19} aria-hidden="true" />
      </summary>
      <div className="absolute left-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-float" role="menu">
        <Link
          href={`/supplier/requests/${requestId}`}
          role="menuitem"
          className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-bold text-ink transition hover:bg-surface-subtle"
        >
          <IconEye size={17} className="text-primary" aria-hidden="true" />
          مشاهده جزئیات
        </Link>
        {!expired ? (
          <>
            <button
              type="button"
              role="menuitem"
              onClick={(event) => {
                onToggleSaved(requestId);
                closeMenu(event.currentTarget);
              }}
              className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-right text-xs font-bold text-ink transition hover:bg-surface-subtle"
            >
              <IconBookmark size={17} className="text-primary" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
              {saved ? "حذف از ذخیره‌شده‌ها" : "ذخیره برای بعد"}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={(event) => {
                onMarkViewed(requestId);
                closeMenu(event.currentTarget);
              }}
              className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-right text-xs font-bold text-ink transition hover:bg-surface-subtle"
            >
              <IconCheck size={17} className="text-success" aria-hidden="true" />
              علامت‌گذاری به‌عنوان مشاهده‌شده
            </button>
          </>
        ) : null}
      </div>
    </details>
  );
}
