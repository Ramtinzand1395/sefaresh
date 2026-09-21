import { IconChevronDown } from "@tabler/icons-react";
import { SupplierCard } from "@/components/suppliers/supplier-card";
import { sortOptions, type SupplierFull, type SupplierSort } from "@/data/suppliers";

type SupplierListProps = {
  suppliers: SupplierFull[];
  comparedIds: Set<string>;
  sort: SupplierSort;
  onSortChange: (sort: SupplierSort) => void;
  onToggleCompare: (id: string) => void;
  onViewProfile: (id: string) => void;
  onViewProducts: (id: string) => void;
};

/**
 * Supplier grid with sort dropdown and result count header.
 * Renders a 2-column grid on desktop, single column on mobile.
 */
export function SupplierList({
  suppliers,
  comparedIds,
  sort,
  onSortChange,
  onToggleCompare,
  onViewProfile,
  onViewProducts,
}: SupplierListProps) {
  return (
    <section aria-label="لیست تأمین‌کنندگان" className="min-w-0">
      {/* ── Header: count + sort ───────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-ink">
          {new Intl.NumberFormat("fa-IR").format(suppliers.length)} تأمین‌کننده
        </h2>

        {/* Sort dropdown */}
        <label className="relative">
          <span className="sr-only">مرتب‌سازی</span>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-muted">
            مرتب‌سازی:
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SupplierSort)}
            className="h-10 appearance-none rounded-control border border-line bg-white pr-[5.5rem] pl-8 text-[11px] font-bold text-ink focus:border-primary focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <IconChevronDown
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
            size={16}
            aria-hidden="true"
          />
        </label>
      </div>

      {/* ── Card grid ──────────────────────────────────────────── */}
      {suppliers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              compared={comparedIds.has(supplier.id)}
              onToggleCompare={onToggleCompare}
              onViewProfile={onViewProfile}
              onViewProducts={onViewProducts}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-card border border-line bg-white px-6 py-10 text-center">
          <p className="text-sm font-black text-ink">تأمین‌کننده‌ای یافت نشد</p>
          <p className="mt-1 text-xs text-ink-muted">
            فیلترها را تغییر دهید یا عبارت جست‌وجو را بررسی کنید.
          </p>
        </div>
      )}
    </section>
  );
}
