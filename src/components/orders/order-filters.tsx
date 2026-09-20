import { IconAdjustmentsHorizontal, IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";
import { orderStatusOptions, suppliers, type OrderStatus } from "@/data/orders";

export type DateRange = "all" | "week" | "month" | "quarter";

type OrderFiltersProps = {
  query: string;
  status: "all" | OrderStatus;
  dateRange: DateRange;
  supplier: string;
  resultCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "all" | OrderStatus) => void;
  onDateRangeChange: (value: DateRange) => void;
  onSupplierChange: (value: string) => void;
  onReset: () => void;
};

const selectClassName = "h-11 w-full appearance-none rounded-control border border-line bg-white pr-3 pl-9 text-xs font-bold text-ink focus:border-primary focus:outline-none";

export function OrderFilters({
  query,
  status,
  dateRange,
  supplier,
  resultCount,
  onQueryChange,
  onStatusChange,
  onDateRangeChange,
  onSupplierChange,
  onReset,
}: OrderFiltersProps) {
  const hasFilters = Boolean(query || status !== "all" || dateRange !== "all" || supplier !== "all");

  return (
    <section aria-labelledby="order-filter-title" className="mt-4 rounded-card border border-line bg-white p-3 shadow-card">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(19rem,1.6fr)_repeat(3,minmax(9.5rem,.72fr))_auto]">
        <div className="relative min-w-0">
          <label htmlFor="order-search" className="sr-only">جست‌وجوی سفارش</label>
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={19} aria-hidden="true" />
          <input
            id="order-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="شماره سفارش، کالا یا تأمین‌کننده…"
            className="h-11 w-full rounded-control border border-primary/45 bg-white pr-10 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <SelectField label="همه وضعیت‌ها" value={status} onChange={(value) => onStatusChange(value as "all" | OrderStatus)}>
          {orderStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </SelectField>

        <SelectField label="همه بازه‌ها" value={dateRange} onChange={(value) => onDateRangeChange(value as DateRange)}>
          <option value="all">همه بازه‌ها</option>
          <option value="week">هفته اخیر</option>
          <option value="month">ماه اخیر</option>
          <option value="quarter">سه ماه اخیر</option>
        </SelectField>

        <SelectField label="همه تأمین‌کنندگان" value={supplier} onChange={onSupplierChange}>
          <option value="all">همه تأمین‌کنندگان</option>
          {suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </SelectField>

        <div className="flex items-center justify-between gap-2 md:col-span-2 xl:col-span-1">
          <div className="flex min-h-11 items-center gap-2 rounded-control border border-line px-3 xl:hidden">
            <IconAdjustmentsHorizontal size={17} className="text-primary" aria-hidden="true" />
            <span className="text-xs font-bold text-ink-muted">{new Intl.NumberFormat("fa-IR").format(resultCount)} نتیجه</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={!hasFilters}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-primary/35 bg-white px-4 text-xs font-black text-primary transition hover:bg-primary-soft disabled:cursor-not-allowed disabled:border-line disabled:text-ink-muted/50"
          >
            {hasFilters ? <IconX size={16} aria-hidden="true" /> : <IconAdjustmentsHorizontal size={17} aria-hidden="true" />}
            {hasFilters ? "پاک کردن" : "فیلترها"}
          </button>
        </div>
      </div>
      <p id="order-filter-title" className="sr-only">فیلتر سفارش‌ها؛ {new Intl.NumberFormat("fa-IR").format(resultCount)} نتیجه</p>
    </section>
  );
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClassName}>
        {children}
      </select>
      <IconChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={17} aria-hidden="true" />
    </label>
  );
}
