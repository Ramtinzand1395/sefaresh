"use client";

import {
  IconAdjustmentsHorizontal,
  IconClock,
  IconSearch,
  IconStarFilled,
  IconTrash,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/cn";
import {
  supplierCategories,
  ratingOptions,
  deliveryOptions,
  type DeliverySpeed,
  type SupplierCategoryId,
} from "@/data/suppliers";

export type SupplierFilterValues = {
  query: string;
  category: SupplierCategoryId;
  rating: "all" | "4" | "3" | "2";
  delivery: "all" | DeliverySpeed;
  minOrderFrom: string;
  minOrderTo: string;
};

type SupplierFiltersProps = SupplierFilterValues & {
  onChange: <K extends keyof SupplierFilterValues>(
    key: K,
    value: SupplierFilterValues[K],
  ) => void;
  onReset: () => void;
  /** On mobile, this entire component renders inside a modal. */
  className?: string;
};

/**
 * Left sidebar filters matching the design reference.
 *
 * Sections:
 * 1. Search input
 * 2. Category chips (دسته‌بندی کالا)
 * 3. Rating options (امتیاز تأمین‌کننده)
 * 4. Delivery speed (زمان ارسال)
 * 5. Min order range (حداقل سفارش)
 * 6. Reset button
 */
export function SupplierFilters({
  query,
  category,
  rating,
  delivery,
  minOrderFrom,
  minOrderTo,
  onChange,
  onReset,
  className,
}: SupplierFiltersProps) {
  const hasFilters =
    query !== "" ||
    category !== "all" ||
    rating !== "all" ||
    delivery !== "all" ||
    minOrderFrom !== "" ||
    minOrderTo !== "";

  return (
    <aside className={cn("space-y-5", className)}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm font-black text-ink">
        <IconAdjustmentsHorizontal size={20} className="text-primary" aria-hidden="true" />
        فیلتر تأمین‌کنندگان
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="relative">
        <IconSearch
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
          size={18}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onChange("query", e.target.value)}
          placeholder="جست‌وجوی نام تأمین‌کننده..."
          className="h-11 w-full rounded-control border border-line bg-white pr-10 pl-3 text-xs text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
        />
      </div>

      {/* ── دسته‌بندی کالا ────────────────────────────────────── */}
      <FilterSection icon={<IconAdjustmentsHorizontal size={17} />} title="دسته‌بندی کالا">
        <div className="flex flex-wrap gap-2">
          {supplierCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange("category", cat.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
                category === cat.id
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-line bg-white text-ink-muted hover:border-primary/30",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── امتیاز تأمین‌کننده ────────────────────────────────── */}
      <FilterSection icon={<IconStarFilled size={17} className="text-accent" />} title="امتیاز تأمین‌کننده">
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange("rating", opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
                rating === opt.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-line bg-white text-ink-muted hover:border-primary/30",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── زمان ارسال ────────────────────────────────────────── */}
      <FilterSection icon={<IconClock size={17} />} title="زمان ارسال">
        <div className="flex flex-wrap gap-2">
          {deliveryOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange("delivery", opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
                delivery === opt.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-line bg-white text-ink-muted hover:border-primary/30",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── حداقل سفارش ───────────────────────────────────────── */}
      <FilterSection icon={<IconWallet size={17} />} title="حداقل سفارش">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={minOrderFrom}
            onChange={(e) => onChange("minOrderFrom", e.target.value)}
            placeholder="از"
            className="h-10 w-full rounded-control border border-line bg-white px-3 text-center text-[11px] text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
          />
          <span className="text-xs text-ink-muted">تا</span>
          <input
            type="text"
            inputMode="numeric"
            value={minOrderTo}
            onChange={(e) => onChange("minOrderTo", e.target.value)}
            placeholder="تا"
            className="h-10 w-full rounded-control border border-line bg-white px-3 text-center text-[11px] text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
          />
        </div>
        <p className="mt-1 text-center text-[10px] text-ink-muted">تومان</p>
      </FilterSection>

      {/* ── Reset button ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={onReset}
        disabled={!hasFilters}
        className="flex w-full min-h-11 items-center justify-center gap-2 rounded-control border border-primary/30 bg-white text-xs font-black text-primary transition hover:bg-primary-soft disabled:cursor-not-allowed disabled:border-line disabled:text-ink-muted/50"
      >
        <IconTrash size={16} aria-hidden="true" />
        پاک کردن فیلترها
      </button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Shared section wrapper with icon + title
// ---------------------------------------------------------------------------

function FilterSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-xs font-black text-ink">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}
