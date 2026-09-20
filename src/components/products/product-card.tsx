import Image from "next/image";
import {
  IconCheck,
  IconHeart,
  IconShoppingCartPlus,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-react";
import type { Product } from "@/data/products";
import { formatToman } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ProductCardProps = {
  product: Product;
  quantity: number;
  favourite: boolean;
  onAdd: (product: Product) => void;
  onToggleFavourite: (productId: string) => void;
};

export function ProductCard({ product, quantity, favourite, onAdd, onToggleFavourite }: ProductCardProps) {
  return (
    <article className="group flex min-w-0 flex-col rounded-card border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-float sm:p-4">
      <div className="flex min-w-0 gap-3">
        <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line/70 bg-surface-subtle sm:size-24">
          <Image src={product.image} alt={product.name} width={92} height={92} className="size-full object-contain p-1.5" />
          {quantity > 0 ? (
            <span className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-primary text-[11px] font-black text-white shadow-sm" aria-label={`${quantity} عدد در سبد`}>
              {new Intl.NumberFormat("fa-IR").format(quantity)}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="truncate text-sm font-black text-ink sm:text-base">{product.name}</h3>
                {product.badge ? (
                  <Badge variant={product.available ? "success" : "neutral"} className="min-h-6 px-2 text-[10px]">
                    {product.badge}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-muted">{product.description}</p>
            </div>
            <button
              type="button"
              aria-label={favourite ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
              aria-pressed={favourite}
              onClick={() => onToggleFavourite(product.id)}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl border transition-colors",
                favourite
                  ? "border-danger/15 bg-danger-soft text-danger"
                  : "border-line bg-white text-ink-muted hover:border-danger/25 hover:text-danger",
              )}
            >
              <IconHeart size={18} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1"><IconUsers size={15} className="text-primary" aria-hidden="true" /> {new Intl.NumberFormat("fa-IR").format(product.supplierCount)} تأمین‌کننده</span>
            <span className="inline-flex items-center gap-1"><IconTruckDelivery size={15} className="text-primary" aria-hidden="true" /> حداقل {product.minOrder}</span>
          </div>
        </div>
      </div>

      <div className="my-3 h-px bg-line" />

      <div className="mt-auto flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-ink-muted">قیمت از</p>
          <p className="mt-0.5 text-sm font-black text-ink" dir="auto">{formatToman(product.price)}</p>
          <p className="text-[10px] text-ink-muted">برای هر {product.unit}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={quantity > 0 ? "secondary" : "primary"}
          disabled={!product.available}
          onClick={() => onAdd(product)}
          className="min-w-28"
        >
          {quantity > 0 ? <IconCheck size={17} aria-hidden="true" /> : <IconShoppingCartPlus size={17} aria-hidden="true" />}
          {product.available ? (quantity > 0 ? "افزودن دوباره" : "افزودن به سبد") : "ناموجود"}
        </Button>
      </div>
    </article>
  );
}
