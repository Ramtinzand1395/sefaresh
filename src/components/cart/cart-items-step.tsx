import Image from "next/image";
import { IconMinus, IconPlus, IconShoppingCartPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CartItem } from "@/data/cart";
import { formatToman } from "@/data/products";

type CartItemsStepProps = {
  items: CartItem[];
  onAddProduct: () => void;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartItemsStep({ items, onAddProduct, onChangeQuantity, onRemove }: CartItemsStepProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="text-lg font-black text-ink">اقلام سبد خرید</h2>
          <p className="mt-1 text-xs leading-6 text-ink-muted">تعداد و اقلام مورد نیازتان را پیش از ادامه بررسی کنید.</p>
        </div>
        <Button type="button" variant="secondary" onClick={onAddProduct} className="w-full sm:w-auto">
          <IconShoppingCartPlus size={19} aria-hidden="true" />
          افزودن کالا
        </Button>
      </div>

      {items.length ? (
        <div className="divide-y divide-line px-4 sm:px-5">
          {items.map((item) => (
            <article key={item.id} className="grid gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-subtle sm:size-20">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-ink">{item.name}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{item.description}</p>
                  <p className="mt-2 text-xs font-bold text-primary">{formatToman(item.price)} / {item.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <span className="text-xs font-bold text-ink-muted sm:hidden">تعداد</span>
                <div className="flex h-11 items-center overflow-hidden rounded-xl border border-line bg-white" aria-label={`تعداد ${item.name}`}>
                  <button type="button" className="grid size-10 place-items-center text-primary transition hover:bg-primary-soft disabled:text-ink-muted/40" onClick={() => onChangeQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`کاهش تعداد ${item.name}`}>
                    <IconMinus size={17} aria-hidden="true" />
                  </button>
                  <output className="grid h-full min-w-11 place-items-center border-x border-line text-sm font-black text-ink">{item.quantity.toLocaleString("fa-IR")}</output>
                  <button type="button" className="grid size-10 place-items-center text-primary transition hover:bg-primary-soft" onClick={() => onChangeQuantity(item.id, item.quantity + 1)} aria-label={`افزایش تعداد ${item.name}`}>
                    <IconPlus size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-3 sm:min-w-36 sm:border-0 sm:pt-0">
                <div>
                  <span className="block text-[10px] text-ink-muted">جمع این کالا</span>
                  <strong className="mt-1 block text-sm font-black text-ink">{formatToman(item.price * item.quantity)}</strong>
                </div>
                <button type="button" onClick={() => onRemove(item.id)} className="grid size-10 place-items-center rounded-xl text-danger transition hover:bg-danger-soft" aria-label={`حذف ${item.name}`}>
                  <IconTrash size={19} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center p-6 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><IconShoppingCartPlus size={28} aria-hidden="true" /></span>
            <h3 className="mt-4 font-black text-ink">سبد خرید شما خالی است</h3>
            <p className="mt-2 text-sm text-ink-muted">برای ادامه، دست‌کم یک کالا به سبد اضافه کنید.</p>
            <Button type="button" className="mt-4" onClick={onAddProduct}>انتخاب کالا</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
