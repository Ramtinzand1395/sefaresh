import Link from "next/link";
import {
  IconClock,
  IconFileSearch,
  IconMapPin,
  IconPackage,
} from "@tabler/icons-react";
import { SupplierSectionHeader } from "@/components/supplier/dashboard/supplier-section-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { PurchaseRequestSummary } from "@/data/supplier-dashboard";

const numberFormatter = new Intl.NumberFormat("fa-IR");

const deadlineVariants = {
  urgent: "danger",
  warning: "warning",
  normal: "info",
} as const;

type SupplierRequestsProps = {
  requests: PurchaseRequestSummary[];
};

export function SupplierRequests({ requests }: SupplierRequestsProps) {
  return (
    <section aria-labelledby="new-purchase-requests-heading">
      <Card className="overflow-hidden shadow-none">
        <div id="new-purchase-requests-heading">
          <SupplierSectionHeader title="درخواست‌های خرید جدید" href="/supplier/requests" />
        </div>

        {requests.length ? (
          <ul className="divide-y divide-line">
            {requests.slice(0, 3).map((request) => (
              <li key={request.id} className="grid gap-4 px-4 py-4 transition hover:bg-primary-soft/25 sm:px-5 lg:grid-cols-[minmax(12rem,1.2fr)_minmax(9rem,.75fr)_minmax(10rem,.9fr)_auto] lg:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-xs font-black text-primary">
                    {request.buyerInitials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-ink">{request.buyerName}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                      <IconMapPin size={14} aria-hidden="true" />
                      {request.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="grid size-8 place-items-center rounded-lg bg-surface-subtle text-primary">
                    <IconPackage size={17} aria-hidden="true" />
                  </span>
                  <span><strong className="font-black text-ink">{numberFormatter.format(request.itemCount)}</strong> قلم کالا</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 lg:block">
                  <div>
                    <p className="text-[10px] text-ink-muted">ارزش تقریبی</p>
                    <p className="mt-1 text-sm font-black text-ink">{numberFormatter.format(request.estimatedValue)} <span className="text-[10px] font-bold text-ink-muted">تومان</span></p>
                  </div>
                  <Badge variant={deadlineVariants[request.urgency]} className="gap-1 lg:mt-2">
                    <IconClock size={14} aria-hidden="true" />
                    {request.deadline}
                  </Badge>
                </div>

                <Link
                  href={`/supplier/requests/${request.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-xs font-black text-white shadow-sm transition hover:bg-primary-hover"
                >
                  مشاهده و ارائه قیمت
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={IconFileSearch}
            title="درخواست خرید جدیدی ندارید."
            description="درخواست‌های تازه خریداران پس از ثبت در این بخش نمایش داده می‌شوند."
          />
        )}
      </Card>
    </section>
  );
}
