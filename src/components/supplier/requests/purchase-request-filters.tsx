"use client";

import { useCallback, useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconBookmark,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import type { RequestCategory, RequestCity, RequestStatus } from "@/data/purchase-requests";
import { cn } from "@/lib/cn";

export type DeadlineFilter = "all" | "two_hours" | "today" | "three_days" | "later";
export type RequestSort = "newest" | "deadline" | "value" | "items";

export type RequestFilterValues = {
  query: string;
  status: "all" | RequestStatus;
  city: "all" | RequestCity;
  category: "all" | RequestCategory;
  deadline: DeadlineFilter;
  savedOnly: boolean;
  minValue: string;
  maxValue: string;
  minItems: string;
  matchesOnly: boolean;
  verifiedOnly: boolean;
};

export const defaultRequestFilters: RequestFilterValues = {
  query: "",
  status: "all",
  city: "all",
  category: "all",
  deadline: "all",
  savedOnly: false,
  minValue: "",
  maxValue: "",
  minItems: "",
  matchesOnly: false,
  verifiedOnly: false,
};

export const statusOptions: Array<{ value: RequestFilterValues["status"]; label: string }> = [
  { value: "all", label: "همه درخواست‌ها" },
  { value: "new", label: "جدید" },
  { value: "viewed", label: "مشاهده‌شده" },
  { value: "proposal_sent", label: "پیشنهاد ارسال‌شده" },
  { value: "urgent", label: "نزدیک پایان" },
  { value: "expired", label: "منقضی‌شده" },
];

export const cityOptions: Array<{ value: RequestFilterValues["city"]; label: string }> = [
  { value: "all", label: "همه شهرها" },
  { value: "kerman", label: "کرمان" },
  { value: "rafsanjan", label: "رفسنجان" },
  { value: "sirjan", label: "سیرجان" },
  { value: "bam", label: "بم" },
];

export const categoryOptions: Array<{ value: RequestFilterValues["category"]; label: string }> = [
  { value: "all", label: "همه دسته‌ها" },
  { value: "coffee", label: "قهوه" },
  { value: "dairy", label: "لبنیات" },
  { value: "food", label: "مواد غذایی" },
  { value: "beverage", label: "نوشیدنی" },
  { value: "packaging", label: "بسته‌بندی" },
  { value: "hygiene", label: "شوینده و بهداشت" },
  { value: "consumables", label: "تجهیزات مصرفی" },
];

export const deadlineOptions: Array<{ value: DeadlineFilter; label: string }> = [
  { value: "all", label: "همه زمان‌ها" },
  { value: "two_hours", label: "کمتر از ۲ ساعت" },
  { value: "today", label: "امروز" },
  { value: "three_days", label: "تا ۳ روز" },
  { value: "later", label: "بیشتر از ۳ روز" },
];

export const sortOptions: Array<{ value: RequestSort; label: string }> = [
  { value: "newest", label: "جدیدترین" },
  { value: "deadline", label: "نزدیک‌ترین مهلت" },
  { value: "value", label: "بیشترین ارزش خرید" },
  { value: "items", label: "بیشترین تعداد کالا" },
];

type PurchaseRequestFiltersProps = {
  filters: RequestFilterValues;
  sort: RequestSort;
  onChange: <K extends keyof RequestFilterValues>(key: K, value: RequestFilterValues[K]) => void;
  onApplyAdvanced: (values: Pick<RequestFilterValues, "minValue" | "maxValue" | "minItems" | "matchesOnly" | "verifiedOnly">) => void;
  onSortChange: (sort: RequestSort) => void;
  onReset: () => void;
};

const selectClassName =
  "h-11 w-full appearance-none rounded-control border border-line bg-white pr-3 pl-9 text-xs font-bold text-ink transition focus:border-primary focus:outline-none";

export function PurchaseRequestFilters({
  filters,
  sort,
  onChange,
  onApplyAdvanced,
  onSortChange,
  onReset,
}: PurchaseRequestFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedDraft, setAdvancedDraft] = useState({
    minValue: filters.minValue,
    maxValue: filters.maxValue,
    minItems: filters.minItems,
    matchesOnly: filters.matchesOnly,
    verifiedOnly: filters.verifiedOnly,
  });

  const closeAdvanced = useCallback(() => setAdvancedOpen(false), []);

  const openAdvanced = () => {
    setAdvancedDraft({
      minValue: filters.minValue,
      maxValue: filters.maxValue,
      minItems: filters.minItems,
      matchesOnly: filters.matchesOnly,
      verifiedOnly: filters.verifiedOnly,
    });
    setAdvancedOpen(true);
  };

  const applyAdvanced = () => {
    onApplyAdvanced(advancedDraft);
    setAdvancedOpen(false);
  };

  const resetAll = () => {
    setAdvancedDraft({ minValue: "", maxValue: "", minItems: "", matchesOnly: false, verifiedOnly: false });
    onReset();
  };

  return (
    <>
      <Card className="p-3 shadow-none sm:p-4">
        <div className="relative min-w-0">
          <label htmlFor="request-search" className="sr-only">جستجوی درخواست‌های خرید</label>
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={20} aria-hidden="true" />
          <input
            id="request-search"
            type="search"
            value={filters.query}
            onChange={(event) => onChange("query", event.target.value)}
            placeholder="جستجو بر اساس نام خریدار، کالا یا شماره درخواست..."
            className="h-12 w-full rounded-control border border-primary/35 bg-white pr-11 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="mt-3 hidden grid-cols-2 gap-2 lg:grid xl:grid-cols-[repeat(4,minmax(9rem,1fr))_auto_auto]">
          <SelectField label="وضعیت درخواست" value={filters.status} onChange={(value) => onChange("status", value as RequestFilterValues["status"])} options={statusOptions} />
          <SelectField label="شهر" value={filters.city} onChange={(value) => onChange("city", value as RequestFilterValues["city"])} options={cityOptions} />
          <SelectField label="دسته‌بندی" value={filters.category} onChange={(value) => onChange("category", value as RequestFilterValues["category"])} options={categoryOptions} />
          <SelectField label="زمان باقی‌مانده" value={filters.deadline} onChange={(value) => onChange("deadline", value as DeadlineFilter)} options={deadlineOptions} />
          <button
            type="button"
            aria-pressed={filters.savedOnly}
            onClick={() => onChange("savedOnly", !filters.savedOnly)}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-3 text-xs font-black transition",
              filters.savedOnly
                ? "border-primary bg-primary-soft text-primary"
                : "border-line bg-white text-ink-muted hover:border-primary/30 hover:text-primary",
            )}
          >
            <IconBookmark size={17} fill={filters.savedOnly ? "currentColor" : "none"} aria-hidden="true" />
            ذخیره‌شده‌ها
          </button>
          <Button type="button" variant="secondary" size="md" onClick={openAdvanced}>
            <IconAdjustmentsHorizontal size={18} aria-hidden="true" />
            فیلترهای بیشتر
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_minmax(8.5rem,1fr)] gap-2 lg:hidden">
          <Button type="button" variant="secondary" className="px-3" onClick={openAdvanced}>
            <IconAdjustmentsHorizontal size={18} aria-hidden="true" />
            فیلترها
          </Button>
          <SelectField label="مرتب‌سازی" value={sort} onChange={(value) => onSortChange(value as RequestSort)} options={sortOptions} />
        </div>
      </Card>

      <Modal
        open={advancedOpen}
        onClose={closeAdvanced}
        title="فیلتر درخواست‌های خرید"
        description="نتایج را بر اساس محدوده فعالیت و ظرفیت تأمین خود دقیق‌تر کنید."
        width="lg"
        footer={
          <>
            <Button type="button" variant="secondary" className="sm:min-w-28" onClick={resetAll}>پاک کردن همه</Button>
            <Button type="button" className="sm:min-w-28" onClick={applyAdvanced}>اعمال فیلترها</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          <SelectField label="وضعیت" value={filters.status} onChange={(value) => onChange("status", value as RequestFilterValues["status"])} options={statusOptions} showLabel />
          <SelectField label="شهر" value={filters.city} onChange={(value) => onChange("city", value as RequestFilterValues["city"])} options={cityOptions} showLabel />
          <SelectField label="دسته‌بندی" value={filters.category} onChange={(value) => onChange("category", value as RequestFilterValues["category"])} options={categoryOptions} showLabel />
          <SelectField label="زمان باقی‌مانده" value={filters.deadline} onChange={(value) => onChange("deadline", value as DeadlineFilter)} options={deadlineOptions} showLabel />
          <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-control border border-line px-3 text-xs font-bold text-ink sm:col-span-2">
            <span className="flex items-center gap-2"><IconBookmark size={17} className="text-primary" aria-hidden="true" /> فقط درخواست‌های ذخیره‌شده</span>
            <input type="checkbox" checked={filters.savedOnly} onChange={(event) => onChange("savedOnly", event.target.checked)} className="size-4 accent-primary" />
          </label>
        </div>

        <div className="mt-1 border-t border-line pt-5 lg:mt-0 lg:border-0 lg:pt-0">
          <h3 className="mb-4 text-sm font-black text-ink">فیلترهای تکمیلی</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField label="حداقل ارزش تقریبی درخواست" value={advancedDraft.minValue} onChange={(value) => setAdvancedDraft((current) => ({ ...current, minValue: value }))} suffix="تومان" />
            <NumberField label="حداکثر ارزش تقریبی درخواست" value={advancedDraft.maxValue} onChange={(value) => setAdvancedDraft((current) => ({ ...current, maxValue: value }))} suffix="تومان" />
            <NumberField label="حداقل تعداد اقلام" value={advancedDraft.minItems} onChange={(value) => setAdvancedDraft((current) => ({ ...current, minItems: value }))} suffix="قلم" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CheckField label="فقط درخواست‌هایی که کالاهای من در آن وجود دارد" checked={advancedDraft.matchesOnly} onChange={(checked) => setAdvancedDraft((current) => ({ ...current, matchesOnly: checked }))} />
            <CheckField label="فقط خریداران تأییدشده" checked={advancedDraft.verifiedOnly} onChange={(checked) => setAdvancedDraft((current) => ({ ...current, verifiedOnly: checked }))} />
          </div>
        </div>
      </Modal>
    </>
  );
}

export function RequestSortSelect({ sort, onChange }: { sort: RequestSort; onChange: (sort: RequestSort) => void }) {
  return (
    <div className="hidden min-w-48 lg:block">
      <SelectField label="مرتب‌سازی درخواست‌ها" value={sort} onChange={(value) => onChange(value as RequestSort)} options={sortOptions} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  showLabel = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  showLabel?: boolean;
}) {
  return (
    <label className="relative block min-w-0">
      <span className={showLabel ? "mb-1.5 block text-[11px] font-bold text-ink-muted" : "sr-only"}>{label}</span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClassName}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <IconChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={17} aria-hidden="true" />
      </span>
    </label>
  );
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: string; onChange: (value: string) => void; suffix: string }) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-bold text-ink-muted">{label}</span>
      <span className="relative block">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
          placeholder="بدون محدودیت"
          className="h-11 w-full rounded-control border border-line bg-white px-3 pl-14 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none"
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-muted">{suffix}</span>
      </span>
    </label>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-control border border-line bg-surface-subtle/60 px-3 text-xs font-bold text-ink">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 shrink-0 accent-primary" />
    </label>
  );
}
