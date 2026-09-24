"use client";

import { useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import type {
  MarketplaceCategoryView,
  MarketplaceSort,
} from "@/components/products/marketplace-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ProductFiltersProps = {
  initialQuery: string;
  category: string;
  sort: MarketplaceSort;
  categories: MarketplaceCategoryView[];
  resultCount: number;
  pending: boolean;
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (value: MarketplaceSort) => void;
  onReset: () => void;
};

const numberFormatter = new Intl.NumberFormat("fa-IR");

export function ProductFilters({
  initialQuery,
  category,
  sort,
  categories,
  resultCount,
  pending,
  onSearch,
  onCategoryChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const [query, setQuery] = useState(initialQuery);
  const hasFilters = Boolean(initialQuery) || category !== "all" || sort !== "default";

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
              <p className="text-[11px] text-ink-muted">{numberFormatter.format(resultCount)} نتیجه</p>
            </div>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onReset();
              }}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-bold text-primary hover:bg-primary-soft"
            >
              <IconX size={15} aria-hidden="true" />
              پاک کردن
            </button>
          ) : null}
        </div>

        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(query);
          }}
        >
          <div className="relative min-w-0 flex-1">
            <label htmlFor="product-search" className="sr-only">جست‌وجوی کالا</label>
            <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={19} aria-hidden="true" />
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="نام کالا یا برند را جست‌وجو کنید…"
              className="h-11 w-full rounded-control border border-line bg-surface pr-10 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
            />
          </div>
          <Button type="submit" variant="secondary" loading={pending}>جست‌وجو</Button>
        </form>

        <label className="relative block min-w-44">
          <span className="sr-only">مرتب‌سازی کالاها</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as MarketplaceSort)}
            className="h-11 w-full appearance-none rounded-control border border-line bg-white pr-4 pl-10 text-sm font-bold text-ink focus:border-primary focus:outline-none"
          >
            <option value="default">مرتب‌سازی پیش‌فرض</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} aria-hidden="true" />
        </label>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="دسته‌بندی کالاها">
        <button
          type="button"
          aria-pressed={category === "all"}
          onClick={() => onCategoryChange("all")}
          className={cn(
            "min-h-9 shrink-0 rounded-xl px-3 text-xs font-bold transition-colors",
            category === "all" ? "bg-primary text-white" : "bg-surface-subtle text-ink-muted hover:bg-primary-soft hover:text-primary",
          )}
        >
          همه کالاها
        </button>
        {categories.map((item) => (
          <button
            key={item.categoryId}
            type="button"
            aria-pressed={category === item.categoryId}
            onClick={() => onCategoryChange(item.categoryId)}
            className={cn(
              "min-h-9 shrink-0 rounded-xl px-3 text-xs font-bold transition-colors",
              category === item.categoryId
                ? "bg-primary text-white"
                : "bg-surface-subtle text-ink-muted hover:bg-primary-soft hover:text-primary",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
}
