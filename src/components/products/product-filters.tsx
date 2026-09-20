import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import type { ProductCategoryId } from "@/data/products";
import { productCategories } from "@/data/products";
import { cn } from "@/lib/cn";

export type ProductSort = "popular" | "price-asc" | "price-desc";

type ProductFiltersProps = {
  query: string;
  category: "all" | ProductCategoryId;
  availableOnly: boolean;
  sort: ProductSort;
  resultCount: number;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: "all" | ProductCategoryId) => void;
  onAvailableOnlyChange: (value: boolean) => void;
  onSortChange: (value: ProductSort) => void;
  onReset: () => void;
};

export function ProductFilters({
  query,
  category,
  availableOnly,
  sort,
  resultCount,
  onQueryChange,
  onCategoryChange,
  onAvailableOnlyChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const hasFilters = query || category !== "all" || availableOnly || sort !== "popular";

  return (
    <section aria-labelledby="product-filter-heading" className="rounded-card border border-line bg-white p-3 shadow-card md:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex items-center justify-between gap-3 xl:w-44">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <IconAdjustmentsHorizontal size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 id="product-filter-heading" className="text-sm font-black text-ink">فیلتر کالاها</h2>
              <p className="text-[11px] text-ink-muted">{new Intl.NumberFormat("fa-IR").format(resultCount)} نتیجه</p>
            </div>
          </div>
          {hasFilters ? (
            <button type="button" onClick={onReset} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-bold text-primary hover:bg-primary-soft">
              <IconX size={15} aria-hidden="true" />
              پاک کردن
            </button>
          ) : null}
        </div>

        <div className="relative min-w-0 flex-1">
          <label htmlFor="product-search" className="sr-only">جست‌وجوی کالا</label>
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={19} aria-hidden="true" />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="نام کالا، برند یا دسته‌بندی را جست‌وجو کنید…"
            className="h-11 w-full rounded-control border border-line bg-surface pr-10 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
          />
        </div>

        <label className="relative block min-w-44">
          <span className="sr-only">مرتب‌سازی کالاها</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ProductSort)}
            className="h-11 w-full appearance-none rounded-control border border-line bg-white pr-4 pl-10 text-sm font-bold text-ink focus:border-primary focus:outline-none"
          >
            <option value="popular">محبوب‌ترین</option>
            <option value="price-asc">کمترین قیمت</option>
            <option value="price-desc">بیشترین قیمت</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} aria-hidden="true" />
        </label>

        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-control border border-line bg-white px-3 text-sm font-bold text-ink">
          فقط موجودها
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => onAvailableOnlyChange(event.target.checked)}
            className="size-4 accent-primary"
          />
        </label>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="دسته‌بندی کالاها">
        {productCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => onCategoryChange(item.id)}
            className={cn(
              "min-h-9 shrink-0 rounded-xl px-3 text-xs font-bold transition-colors",
              category === item.id
                ? "bg-primary text-white"
                : "bg-surface-subtle text-ink-muted hover:bg-primary-soft hover:text-primary",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
