import Image from "next/image";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { popularProducts } from "@/data/dashboard";

export function PopularProducts() {
  return (
    <Card className="p-4 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-ink">خریدهای پرتکرار</h2>
        <button type="button" className="flex items-center gap-1 text-[11px] font-black text-primary">مشاهده همه <IconArrowLeft size={14} /></button>
      </div>
      <div className="mt-2 divide-y divide-line">
        {popularProducts.map((product) => (
          <div key={product.name} className="flex items-center gap-3 py-2.5">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-surface-subtle">
              <Image src={product.image} alt="" fill sizes="44px" className="object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-xs font-black text-ink">{product.name}</strong>
              <span className="mt-0.5 block text-[10px] text-ink-muted">{product.meta}</span>
              <span className="mt-1 block text-[10px] font-bold text-ink">{product.price} تومان</span>
            </div>
            <button type="button" aria-label={`افزودن ${product.name} به سبد`} className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-white">
              <IconPlus size={17} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
