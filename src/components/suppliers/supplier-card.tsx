import {
  IconArrowLeft,
  IconCheck,
  IconShieldCheckFilled,
  IconStarFilled,
  IconTruckDelivery,
  IconWallet,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { SupplierFull } from "@/data/suppliers";

// Icon background tones — maps supplier.iconTone to Tailwind classes
const iconTones = {
  green: "bg-success-soft text-success",
  orange: "bg-accent-soft text-warning",
  blue: "bg-primary-soft text-primary",
  violet: "bg-violet-soft text-violet",
} as const;

type SupplierCardProps = {
  supplier: SupplierFull;
  compared: boolean;
  onToggleCompare: (id: string) => void;
  onViewProfile: (id: string) => void;
  onViewProducts: (id: string) => void;
};

/**
 * Individual supplier card matching the design reference.
 *
 * Layout (RTL):
 * - Top: comparison checkbox (end-aligned)
 * - Content row: logo circle (start) + info block (end)
 * - Separator
 * - Delivery + min-order info
 * - Two action buttons
 */
export function SupplierCard({
  supplier,
  compared,
  onToggleCompare,
  onViewProfile,
  onViewProducts,
}: SupplierCardProps) {
  const Icon = supplier.icon;

  return (
    <article className="group relative flex min-w-0 flex-col rounded-card border border-line bg-white p-4 shadow-card transition hover:border-primary/25 hover:shadow-float sm:p-5">
      {/* ── Comparison checkbox ─────────────────────────────────── */}
      <label className="absolute left-4 top-4 flex cursor-pointer items-center gap-2 text-xs font-bold text-ink-muted sm:left-5 sm:top-5">
        <span className="sr-only">افزودن {supplier.name} به مقایسه</span>
        <span>برای مقایسه</span>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={compared}
          onChange={() => onToggleCompare(supplier.id)}
        />
        {/* Custom checkbox visual matching the design's blue rounded square */}
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-lg border-2 transition",
            compared
              ? "border-primary bg-primary text-white"
              : "border-line bg-white peer-hover:border-primary/40",
          )}
        >
          {compared ? <IconCheck size={14} stroke={3} aria-hidden="true" /> : null}
        </span>
      </label>

      {/* ── Main content: logo + info ──────────────────────────── */}
      <div className="mt-6 flex gap-4 sm:mt-4">
        {/* Logo circle */}
        <div className="shrink-0 text-center">
          <span
            className={cn(
              "mx-auto grid size-[4.5rem] place-items-center rounded-full sm:size-20",
              iconTones[supplier.iconTone],
            )}
          >
            <Icon size={36} stroke={1.6} aria-hidden="true" />
          </span>
          <p className="mt-1.5 text-[10px] font-bold leading-4 text-ink-muted">
            {supplier.name}
            <br />
            <span className="text-[9px] text-ink-muted/70">{supplier.slogan}</span>
          </p>
        </div>

        {/* Info block */}
        <div className="min-w-0 flex-1">
          {/* Name + verified badge */}
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-black text-ink sm:text-lg">
              {supplier.name}
            </h3>
            {supplier.verified ? (
              <IconShieldCheckFilled
                size={20}
                className="shrink-0 text-primary"
                aria-label="تأمین‌کننده تأییدشده"
              />
            ) : null}
          </div>

          {/* Category */}
          <p className="mt-1 text-xs text-ink-muted">{supplier.categoryLabel}</p>

          {/* Rating */}
          <p className="mt-2 flex items-center gap-1 text-xs">
            <IconStarFilled size={15} className="text-accent" aria-hidden="true" />
            <strong className="font-black text-ink">
              {new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1 }).format(supplier.score)}
            </strong>
            <span className="text-ink-muted">
              ({new Intl.NumberFormat("fa-IR").format(supplier.reviewCount)}نظر)
            </span>
          </p>

          {/* Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {supplier.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-subtle px-2.5 py-1 text-[10px] font-bold text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Separator ──────────────────────────────────────────── */}
      <div className="my-3 h-px bg-line sm:my-4" />

      {/* ── Delivery + min-order info ──────────────────────────── */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <IconWallet size={16} className="text-primary" aria-hidden="true" />
          حداقل سفارش: {supplier.minimumOrder}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconTruckDelivery size={16} className="text-primary" aria-hidden="true" />
          تحویل: {supplier.deliveryTime}
        </span>
      </div>

      {/* ── Action buttons ─────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onViewProfile(supplier.id)}
        >
          مشاهده پروفایل
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onViewProducts(supplier.id)}
        >
          مشاهده کالاهای تأمین‌کننده
          <IconArrowLeft size={15} aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
