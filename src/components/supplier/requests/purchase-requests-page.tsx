"use client";

import { useMemo, useState } from "react";
import { IconFilterOff, IconInbox } from "@tabler/icons-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PurchaseRequestCard } from "@/components/supplier/requests/purchase-request-card";
import {
  PurchaseRequestFilters,
  type SupplierRequestFilterStatus,
} from "@/components/supplier/requests/purchase-request-filters";
import type { SupplierRequestView } from "@/components/supplier/requests/supplier-request-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

const numberFormatter = new Intl.NumberFormat("fa-IR");
const normalize = (value: string) => value.trim().toLocaleLowerCase("fa-IR");

type PurchaseRequestsPageProps = {
  requests: SupplierRequestView[];
};

export function PurchaseRequestsPage({ requests }: PurchaseRequestsPageProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SupplierRequestFilterStatus>("all");
  const visibleRequests = useMemo(() => {
    const needle = normalize(query);

    return requests.filter((request) => {
      const searchable = normalize(`${request.product.title} ${request.product.brand ?? ""}`);
      return (
        (!needle || searchable.includes(needle)) &&
        (status === "all" || request.status === status)
      );
    });
  }, [query, requests, status]);
  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const hasFilters = Boolean(query.trim()) || status !== "all";

  return (
    <div className="space-y-5 pb-5">
      <PageHeader
        title="درخواست‌های خرید"
        description="درخواست‌های مرتبط با محصولات شما را بررسی کنید و برای هر محصول جداگانه پاسخ بدهید."
        action={
          <Badge variant="info" className="min-h-9 px-3.5 text-sm">
            {numberFormatter.format(pendingCount)} درخواست جدید
          </Badge>
        }
      />

      <PurchaseRequestFilters
        query={query}
        status={status}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />

      <div>
        <h2 className="text-base font-black text-ink">
          {numberFormatter.format(visibleRequests.length)} درخواست
        </h2>
        <p className="mt-1 text-xs text-ink-muted">هر مورد مربوط به یک محصول و یک درخواست مستقل است.</p>
      </div>

      {visibleRequests.length ? (
        <section aria-label="فهرست درخواست‌های تأمین" className="space-y-3">
          {visibleRequests.map((request) => (
            <PurchaseRequestCard key={request.supplierRequestId} request={request} />
          ))}
        </section>
      ) : (
        <Card>
          <EmptyState
            icon={hasFilters ? IconFilterOff : IconInbox}
            title={hasFilters
              ? "درخواستی با این فیلتر پیدا نشد"
              : "درخواست جدیدی برای محصولات شما وجود ندارد."}
            description={hasFilters
              ? "عبارت جستجو یا وضعیت انتخاب‌شده را تغییر دهید."
              : "درخواست‌های مرتبط با محصولات شما در این بخش نمایش داده می‌شوند."}
          />
        </Card>
      )}
    </div>
  );
}
