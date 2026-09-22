"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IconCheck,
  IconFilterOff,
  IconInbox,
  IconX,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PurchaseRequestCard } from "@/components/supplier/requests/purchase-request-card";
import {
  categoryOptions,
  cityOptions,
  deadlineOptions,
  defaultRequestFilters,
  PurchaseRequestFilters,
  RequestSortSelect,
  statusOptions,
  type RequestFilterValues,
  type RequestSort,
} from "@/components/supplier/requests/purchase-request-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { PurchaseRequest, RequestStatus } from "@/data/purchase-requests";
import { cn } from "@/lib/cn";

const pageSize = 10;
const numberFormatter = new Intl.NumberFormat("fa-IR");
const normalize = (value: string) => value.trim().toLocaleLowerCase("fa-IR");

const requestStatuses: RequestFilterValues["status"][] = ["all", "new", "viewed", "proposal_sent", "urgent", "expired"];
const requestCities: RequestFilterValues["city"][] = ["all", "kerman", "rafsanjan", "sirjan", "bam"];
const requestCategories: RequestFilterValues["category"][] = ["all", "coffee", "dairy", "food", "beverage", "packaging", "hygiene", "consumables"];
const deadlineValues: RequestFilterValues["deadline"][] = ["all", "two_hours", "today", "three_days", "later"];
const sortValues: RequestSort[] = ["newest", "deadline", "value", "items"];

type PurchaseRequestsPageProps = {
  requests: PurchaseRequest[];
};

export function PurchaseRequestsPage({ requests }: PurchaseRequestsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(requests.filter((request) => request.saved).map((request) => request.id)),
  );
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({});
  const [notice, setNotice] = useState("");

  const filters = readFilters(searchParams);
  const sort = readOption(searchParams.get("sort"), sortValues, "newest");
  const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const filteredRequests = useMemo(() => {
    const needle = normalize(filters.query);
    const minValue = parsePositiveNumber(filters.minValue);
    const maxValue = parsePositiveNumber(filters.maxValue);
    const minItems = parsePositiveNumber(filters.minItems);

    const matches = requests.filter((request) => {
      const status = statusOverrides[request.id] ?? request.status;
      const searchableText = normalize(
        `${request.id} ${request.buyer.name} ${request.buyer.cityLabel} ${request.items.map((item) => item.name).join(" ")}`,
      );

      return (
        (!needle || searchableText.includes(needle)) &&
        (filters.status === "all" || status === filters.status) &&
        (filters.city === "all" || request.buyer.city === filters.city) &&
        (filters.category === "all" || request.categories.includes(filters.category)) &&
        matchesDeadline(request.deadlineInHours, filters.deadline) &&
        (!filters.savedOnly || savedIds.has(request.id)) &&
        (!minValue || request.estimatedValue >= minValue) &&
        (!maxValue || request.estimatedValue <= maxValue) &&
        (!minItems || request.match.totalItems >= minItems) &&
        (!filters.matchesOnly || request.match.matchedItems > 0) &&
        (!filters.verifiedOnly || request.buyer.verified)
      );
    });

    return [...matches].sort((first, second) => {
      if (sort === "deadline") {
        const firstDeadline = first.deadlineInHours < 0 ? Number.POSITIVE_INFINITY : first.deadlineInHours;
        const secondDeadline = second.deadlineInHours < 0 ? Number.POSITIVE_INFINITY : second.deadlineInHours;
        return firstDeadline - secondDeadline;
      }
      if (sort === "value") return second.estimatedValue - first.estimatedValue;
      if (sort === "items") return second.match.totalItems - first.match.totalItems;
      return first.createdAtMinutesAgo - second.createdAtMinutesAgo;
    });
  }, [filters, requests, savedIds, sort, statusOverrides]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const visibleRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = hasActiveFilters(filters);
  const activeFilters = buildActiveFilters(filters);

  const replaceParams = (updates: Record<string, string | null>, resetPage = true) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    if (resetPage) nextParams.delete("page");
    const queryString = nextParams.toString();
    startTransition(() => router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false }));
  };

  const changeFilter = <K extends keyof RequestFilterValues>(key: K, value: RequestFilterValues[K]) => {
    const paramKey = filterParamKeys[key];
    const defaultValue = defaultRequestFilters[key];
    const serialized: string | null = value === defaultValue
      ? null
      : typeof value === "boolean"
        ? (value ? "1" : null)
        : String(value);
    replaceParams({ [paramKey]: serialized });
  };

  const applyAdvanced = (values: Pick<RequestFilterValues, "minValue" | "maxValue" | "minItems" | "matchesOnly" | "verifiedOnly">) => {
    replaceParams({
      minValue: values.minValue || null,
      maxValue: values.maxValue || null,
      minItems: values.minItems || null,
      matched: values.matchesOnly ? "1" : null,
      verified: values.verifiedOnly ? "1" : null,
    });
  };

  const resetFilters = () => {
    const nextParams = new URLSearchParams();
    if (sort !== "newest") nextParams.set("sort", sort);
    const queryString = nextParams.toString();
    startTransition(() => router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false }));
  };

  const changeSort = (nextSort: RequestSort) => replaceParams({ sort: nextSort === "newest" ? null : nextSort });
  const changePage = (page: number) => replaceParams({ page: page > 1 ? String(page) : null }, false);

  const toggleSaved = (requestId: string) => {
    const willSave = !savedIds.has(requestId);
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(requestId)) next.delete(requestId);
      else next.add(requestId);
      return next;
    });
    showNotice(willSave ? "درخواست برای بررسی بعدی ذخیره شد." : "درخواست از ذخیره‌شده‌ها حذف شد.");
  };

  const markViewed = (requestId: string) => {
    setStatusOverrides((current) => ({ ...current, [requestId]: "viewed" }));
    showNotice("درخواست به‌عنوان مشاهده‌شده علامت‌گذاری شد.");
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <div className="space-y-5 pb-5">
      <PageHeader
        title="درخواست‌های خرید"
        description="درخواست‌های خرید کافه‌ها و رستوران‌ها را بررسی کنید و برای کالاهای قابل تأمین پیشنهاد قیمت ارسال کنید."
        action={
          <Badge variant="info" className="min-h-9 gap-2 px-3.5 text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            ۲۸ درخواست جدید
          </Badge>
        }
      />

      <PurchaseRequestFilters
        filters={filters}
        sort={sort}
        onChange={changeFilter}
        onApplyAdvanced={applyAdvanced}
        onSortChange={changeSort}
        onReset={resetFilters}
      />

      {activeFilters.length ? (
        <div className="flex flex-wrap items-center gap-2" aria-label="فیلترهای فعال">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => changeFilter(filter.key, defaultRequestFilters[filter.key])}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 text-[11px] font-bold text-primary transition hover:border-primary/35"
            >
              {filter.label}
              <IconX size={14} aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={resetFilters} className="min-h-8 px-2 text-[11px] font-black text-danger hover:underline">
            پاک کردن همه
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-ink">
            {numberFormatter.format(filteredRequests.length)} درخواست پیدا شد
          </h2>
          <p className="mt-1 hidden text-xs text-ink-muted sm:block">فرصت‌هایی که با کالاها و محدوده فعالیت شما هم‌خوانی دارند.</p>
        </div>
        <div className="flex items-center gap-2">
          {isNavigating ? <span className="text-[11px] font-bold text-primary">در حال به‌روزرسانی…</span> : null}
          <RequestSortSelect sort={sort} onChange={changeSort} />
        </div>
      </div>

      {visibleRequests.length ? (
        <section aria-label="فهرست درخواست‌های خرید" className="space-y-3">
          {visibleRequests.map((request) => (
            <PurchaseRequestCard
              key={request.id}
              request={request}
              status={statusOverrides[request.id] ?? request.status}
              saved={savedIds.has(request.id)}
              onToggleSaved={toggleSaved}
              onMarkViewed={markViewed}
            />
          ))}
        </section>
      ) : (
        <div className="rounded-card border border-line bg-white shadow-card">
          <EmptyState
            icon={hasFilters ? IconFilterOff : IconInbox}
            title={hasFilters ? "درخواستی با این فیلترها پیدا نشد" : "درخواست خرید جدیدی وجود ندارد"}
            description={hasFilters ? "فیلترها را تغییر دهید یا همه فیلترها را پاک کنید." : "درخواست‌های مرتبط با کالاها و محدوده فعالیت شما اینجا نمایش داده می‌شوند."}
            action={hasFilters ? <Button type="button" variant="secondary" onClick={resetFilters}>پاک کردن فیلترها</Button> : undefined}
          />
        </div>
      )}

      {filteredRequests.length ? (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filteredRequests.length}
          onPageChange={changePage}
        />
      ) : null}

      <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      {notice ? (
        <div className="fixed bottom-4 left-1/2 z-[90] flex min-h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-ink px-4 text-xs font-bold text-white shadow-float" role="status">
          <span className="grid size-7 place-items-center rounded-full bg-success text-white"><IconCheck size={17} aria-hidden="true" /></span>
          {notice}
        </div>
      ) : null}
    </div>
  );
}

const filterParamKeys: Record<keyof RequestFilterValues, string> = {
  query: "search",
  status: "status",
  city: "city",
  category: "category",
  deadline: "deadline",
  savedOnly: "saved",
  minValue: "minValue",
  maxValue: "maxValue",
  minItems: "minItems",
  matchesOnly: "matched",
  verifiedOnly: "verified",
};

function readFilters(searchParams: ReturnType<typeof useSearchParams>): RequestFilterValues {
  return {
    query: searchParams.get("search") ?? "",
    status: readOption(searchParams.get("status"), requestStatuses, "all"),
    city: readOption(searchParams.get("city"), requestCities, "all"),
    category: readOption(searchParams.get("category"), requestCategories, "all"),
    deadline: readOption(searchParams.get("deadline"), deadlineValues, "all"),
    savedOnly: searchParams.get("saved") === "1",
    minValue: searchParams.get("minValue")?.replace(/[^0-9]/g, "") ?? "",
    maxValue: searchParams.get("maxValue")?.replace(/[^0-9]/g, "") ?? "",
    minItems: searchParams.get("minItems")?.replace(/[^0-9]/g, "") ?? "",
    matchesOnly: searchParams.get("matched") === "1",
    verifiedOnly: searchParams.get("verified") === "1",
  };
}

function readOption<T extends string>(value: string | null, options: readonly T[], fallback: T): T {
  return value && options.includes(value as T) ? value as T : fallback;
}

function parsePositiveNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function matchesDeadline(hours: number, deadline: RequestFilterValues["deadline"]) {
  if (deadline === "all") return true;
  if (hours < 0) return false;
  if (deadline === "two_hours") return hours < 2;
  if (deadline === "today") return hours <= 24;
  if (deadline === "three_days") return hours <= 72;
  return hours > 72;
}

function hasActiveFilters(filters: RequestFilterValues) {
  return (Object.keys(filters) as Array<keyof RequestFilterValues>).some((key) => filters[key] !== defaultRequestFilters[key]);
}

function buildActiveFilters(filters: RequestFilterValues) {
  const items: Array<{ key: keyof RequestFilterValues; label: string }> = [];
  if (filters.query) items.push({ key: "query", label: `جستجو: ${filters.query}` });
  if (filters.status !== "all") items.push({ key: "status", label: statusOptions.find((item) => item.value === filters.status)?.label ?? filters.status });
  if (filters.city !== "all") items.push({ key: "city", label: cityOptions.find((item) => item.value === filters.city)?.label ?? filters.city });
  if (filters.category !== "all") items.push({ key: "category", label: categoryOptions.find((item) => item.value === filters.category)?.label ?? filters.category });
  if (filters.deadline !== "all") items.push({ key: "deadline", label: deadlineOptions.find((item) => item.value === filters.deadline)?.label ?? filters.deadline });
  if (filters.savedOnly) items.push({ key: "savedOnly", label: "ذخیره‌شده‌ها" });
  if (filters.minValue) items.push({ key: "minValue", label: `از ${numberFormatter.format(Number(filters.minValue))} تومان` });
  if (filters.maxValue) items.push({ key: "maxValue", label: `تا ${numberFormatter.format(Number(filters.maxValue))} تومان` });
  if (filters.minItems) items.push({ key: "minItems", label: `حداقل ${numberFormatter.format(Number(filters.minItems))} قلم` });
  if (filters.matchesOnly) items.push({ key: "matchesOnly", label: "دارای کالای من" });
  if (filters.verifiedOnly) items.push({ key: "verifiedOnly", label: "خریدار تأییدشده" });
  return items;
}

function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <nav aria-label="صفحه‌بندی درخواست‌ها" className="flex flex-col items-center justify-between gap-3 rounded-card border border-line bg-white px-3 py-3 shadow-card sm:flex-row sm:px-4">
      <p className="text-xs font-bold text-ink-muted">
        نمایش {numberFormatter.format(firstItem)} تا {numberFormatter.format(lastItem)} از {numberFormatter.format(totalItems)} درخواست
      </p>
      <div className="flex items-center gap-1">
        <PageButton label="صفحه قبل" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-3">قبلی</PageButton>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <PageButton key={pageNumber} label={`صفحه ${numberFormatter.format(pageNumber)}`} active={pageNumber === page} onClick={() => onPageChange(pageNumber)}>
            {numberFormatter.format(pageNumber)}
          </PageButton>
        ))}
        <PageButton label="صفحه بعد" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="px-3">بعدی</PageButton>
      </div>
    </nav>
  );
}

function PageButton({
  label,
  active = false,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "grid min-h-9 min-w-9 place-items-center rounded-lg border px-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40",
        active ? "border-primary bg-primary text-white" : "border-line bg-white text-ink-muted hover:border-primary/30 hover:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
