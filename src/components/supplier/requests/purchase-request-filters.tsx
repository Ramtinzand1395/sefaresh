"use client";

import { IconSearch } from "@tabler/icons-react";
import {
  supplierRequestStatusConfig,
  type SupplierRequestStatus,
} from "@/components/supplier/requests/supplier-request-types";
import { Card } from "@/components/ui/card";

export type SupplierRequestFilterStatus = "all" | SupplierRequestStatus;

type PurchaseRequestFiltersProps = {
  query: string;
  status: SupplierRequestFilterStatus;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: SupplierRequestFilterStatus) => void;
};

const statuses = Object.entries(supplierRequestStatusConfig) as Array<
  [SupplierRequestStatus, (typeof supplierRequestStatusConfig)[SupplierRequestStatus]]
>;

export function PurchaseRequestFilters({
  query,
  status,
  onQueryChange,
  onStatusChange,
}: PurchaseRequestFiltersProps) {
  return (
    <Card className="grid gap-3 p-3 shadow-none sm:grid-cols-[minmax(0,1fr)_13rem] sm:p-4">
      <div className="relative min-w-0">
        <label htmlFor="supplier-request-search" className="sr-only">
          جستجوی درخواست‌ها
        </label>
        <IconSearch
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          size={20}
          aria-hidden="true"
        />
        <input
          id="supplier-request-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="جستجو بر اساس نام محصول یا برند..."
          className="h-11 w-full rounded-control border border-line bg-white pr-11 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <label className="min-w-0">
        <span className="sr-only">فیلتر وضعیت</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as SupplierRequestFilterStatus)}
          className="h-11 w-full rounded-control border border-line bg-white px-3 text-xs font-bold text-ink focus:border-primary focus:outline-none"
        >
          <option value="all">همه وضعیت‌ها</option>
          {statuses.map(([value, config]) => (
            <option key={value} value={value}>{config.label}</option>
          ))}
        </select>
      </label>
    </Card>
  );
}
