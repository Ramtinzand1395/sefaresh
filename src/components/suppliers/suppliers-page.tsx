"use client";

import { useMemo, useState, useCallback } from "react";
import {
  IconAdjustmentsHorizontal,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { SupplierStats } from "@/components/suppliers/supplier-stats";
import { SupplierFilters, type SupplierFilterValues } from "@/components/suppliers/supplier-filters";
import { SupplierList } from "@/components/suppliers/supplier-list";
import { SupplierModals, type SupplierModalState } from "@/components/suppliers/supplier-modals";
import {
  suppliers as allSuppliers,
  formatPersianNumber,
  type SupplierSort,
} from "@/data/suppliers";

// ---------------------------------------------------------------------------
// Default filter state
// ---------------------------------------------------------------------------

const defaultFilters: SupplierFilterValues = {
  query: "",
  category: "all",
  rating: "all",
  delivery: "all",
  minOrderFrom: "",
  minOrderTo: "",
};

// ---------------------------------------------------------------------------
// SuppliersPage — the client orchestrator for /dashboard/suppliers
// ---------------------------------------------------------------------------

/**
 * Orchestrates the entire suppliers page:
 * - filter state
 * - sort state
 * - comparison set (checkboxes)
 * - modal state
 * - toast state
 * - mobile filter drawer
 *
 * Reuses PageHeader, StatCard, SupplierFilters, SupplierList,
 * SupplierCard, and SupplierModals from the design system.
 */
export function SuppliersPage() {
  const prefersReduced = useReducedMotion();

  // ── Filter state ────────────────────────────────────────────
  const [filters, setFilters] = useState<SupplierFilterValues>(defaultFilters);
  const [sort, setSort] = useState<SupplierSort>("relevance");

  // ── Comparison set ──────────────────────────────────────────
  const [comparedIds, setComparedIds] = useState<Set<string>>(new Set());

  // ── Modal state ─────────────────────────────────────────────
  const [modal, setModal] = useState<SupplierModalState>(null);

  // ── Toast feedback ──────────────────────────────────────────
  const [toast, setToast] = useState<string | null>(null);

  // ── Mobile filter drawer ────────────────────────────────────
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Filter change handler ───────────────────────────────────
  const handleFilterChange = useCallback(
    <K extends keyof SupplierFilterValues>(key: K, value: SupplierFilterValues[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleFilterReset = useCallback(() => setFilters(defaultFilters), []);

  // ── Comparison toggle ───────────────────────────────────────
  const toggleCompare = useCallback((id: string) => {
    setComparedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // ── Modal done callback — shows a toast ─────────────────────
  const handleModalDone = useCallback(
    (message: string) => {
      setModal(null);
      setToast(message);
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  // ── Filtered + sorted supplier list ─────────────────────────
  const filteredSuppliers = useMemo(() => {
    let list = [...allSuppliers];

    // Text search
    if (filters.query.trim()) {
      const q = filters.query.trim();
      list = list.filter(
        (s) =>
          s.name.includes(q) ||
          s.categoryLabel.includes(q) ||
          s.tags.some((t) => t.includes(q)),
      );
    }

    // Category filter
    if (filters.category !== "all") {
      list = list.filter((s) => s.categoryId === filters.category);
    }

    // Rating filter
    if (filters.rating !== "all") {
      const min = Number(filters.rating);
      list = list.filter((s) => s.score >= min);
    }

    // Delivery speed filter
    if (filters.delivery !== "all") {
      list = list.filter((s) => s.deliverySpeed === filters.delivery);
    }

    // Min-order range filter
    if (filters.minOrderFrom) {
      const fromVal = Number(filters.minOrderFrom.replace(/\D/g, ""));
      if (!isNaN(fromVal)) list = list.filter((s) => s.minimumOrderValue >= fromVal);
    }
    if (filters.minOrderTo) {
      const toVal = Number(filters.minOrderTo.replace(/\D/g, ""));
      if (!isNaN(toVal)) list = list.filter((s) => s.minimumOrderValue <= toVal);
    }

    // Sort
    switch (sort) {
      case "rating":
        list.sort((a, b) => b.score - a.score);
        break;
      case "delivery":
        // today < tomorrow < 2-3days
        const speedWeight = { today: 0, tomorrow: 1, "2-3days": 2 } as const;
        list.sort((a, b) => speedWeight[a.deliverySpeed] - speedWeight[b.deliverySpeed]);
        break;
      case "price":
        list.sort((a, b) => a.minimumOrderValue - b.minimumOrderValue);
        break;
      default:
        break; // "relevance" = default order
    }

    return list;
  }, [filters, sort]);

  return (
    <div className="space-y-5">
      {/* ── Page header with action buttons ────────────────────── */}
      <PageHeader
        title="تأمین‌کنندگان"
        description="تأمین‌کنندگان تأییدشده را بر اساس قیمت، کیفیت و زمان ارسال مقایسه کنید."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setModal({ type: "invite" })}
            >
              <IconPlus size={17} aria-hidden="true" />
              درخواست تأمین‌کننده جدید
            </Button>

            {comparedIds.size >= 2 ? (
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  setModal({ type: "comparison", supplierIds: [...comparedIds] })
                }
              >
                <IconAdjustmentsHorizontal size={17} aria-hidden="true" />
                مقایسه انتخاب‌شده‌ها ({formatPersianNumber(comparedIds.size)})
              </Button>
            ) : null}
          </div>
        }
      />

      {/* ── Stats row ──────────────────────────────────────────── */}
      <SupplierStats />

      {/* ── Mobile filter toggle ───────────────────────────────── */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <IconAdjustmentsHorizontal size={17} aria-hidden="true" />
          فیلترها
        </Button>
        {comparedIds.size > 0 ? (
          <span className="text-xs font-bold text-primary">
            {formatPersianNumber(comparedIds.size)} تأمین‌کننده انتخاب‌شده
          </span>
        ) : null}
      </div>

      {/* ── Main layout: supplier list + filter sidebar ─────── */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <SupplierList
          suppliers={filteredSuppliers}
          comparedIds={comparedIds}
          sort={sort}
          onSortChange={setSort}
          onToggleCompare={toggleCompare}
          onViewProfile={(id) => setModal({ type: "profile", supplierId: id })}
          onViewProducts={(id) => {
            setToast(`صفحه کالاهای تأمین‌کننده باز شد.`);
            setTimeout(() => setToast(null), 3000);
          }}
        />

        {/* Desktop sidebar filters */}
        <SupplierFilters
          {...filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          className="hidden lg:block sticky top-4 self-start rounded-card border border-line bg-white p-4 shadow-card"
        />
      </div>

      {/* ── Bottom comparison CTA bar (Rosha) ──────────────────── */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-primary to-primary/80 px-5 py-4 sm:flex-row sm:px-8">
        <p className="text-sm font-black text-white">
          <strong>روشا:</strong> برای انتخاب سریع‌تر، تأمین‌کنندگان‌ها را مقایسه کن.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="border-white/30 bg-white/15 text-white hover:bg-white/25"
          onClick={() => setModal({ type: "guide" })}
        >
          راهنمای مقایسه
        </Button>
      </div>

      {/* ── Mobile filter drawer (overlay) ─────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen ? (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.2 }}
              onClick={() => setMobileFiltersOpen(false)}
              aria-hidden="true"
            />
            {/* Panel */}
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs overflow-y-auto bg-white shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280, duration: prefersReduced ? 0 : undefined }}
            >
              <div className="flex items-center justify-between border-b border-line p-4">
                <h2 className="text-sm font-black text-ink">فیلترها</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="grid size-8 place-items-center rounded-full hover:bg-surface-subtle"
                  aria-label="بستن فیلترها"
                >
                  <IconX size={18} aria-hidden="true" />
                </button>
              </div>
              <SupplierFilters
                {...filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
                className="p-4"
              />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <SupplierModals
        modal={modal}
        onClose={() => setModal(null)}
        onDone={handleModalDone}
      />

      {/* ── Toast notification ─────────────────────────────────── */}
      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-success/25 bg-success-soft px-5 py-3 text-sm font-black text-success shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: prefersReduced ? 0 : 0.25 }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
