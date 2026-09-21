import { IconArrowLeft, IconArrowRight, IconBasket, IconLock } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatToman } from "@/data/products";

type CartSummaryProps = {
  step: 1 | 2 | 3;
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  disabled?: boolean;
  onNext: () => void;
  onBack: () => void;
};

const actionLabels = {
  1: "تأیید سبد و ادامه",
  2: "تأیید اطلاعات و ادامه",
  3: "پرداخت امن و ثبت سفارش",
} as const;

export function CartSummary({ step, itemCount, subtotal, shipping, discount, total, disabled, onNext, onBack }: CartSummaryProps) {
  return (
    <Card className="p-4 sm:p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-black text-ink">{step === 3 ? "خلاصه پرداخت" : "خلاصه سفارش"}</h2>
      <div className="mt-4 flex items-center gap-3 border-y border-line py-4">
        <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><IconBasket size={23} aria-hidden="true" /></span>
        <div><strong className="block text-sm font-black text-ink">{itemCount.toLocaleString("fa-IR")} قلم در سبد شما</strong><span className="text-[11px] text-ink-muted">آماده ثبت سفارش</span></div>
      </div>
      <dl className="space-y-3 py-4 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-ink-muted">جمع مبلغ کالاها</dt><dd className="font-bold text-ink">{formatToman(subtotal)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-ink-muted">هزینه ارسال</dt><dd className="font-bold text-ink">{formatToman(shipping)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-ink-muted">تخفیف‌ها</dt><dd className="font-bold text-success">− {formatToman(discount)}</dd></div>
      </dl>
      <div className="flex items-end justify-between gap-3 border-t border-line pt-4"><span className="text-sm text-ink-muted">مبلغ قابل پرداخت</span><strong className="text-lg font-black text-ink sm:text-xl">{formatToman(total)}</strong></div>
      <Button type="button" size="lg" className="mt-5 w-full" onClick={onNext} disabled={disabled}>{actionLabels[step]}<IconArrowLeft size={19} aria-hidden="true" /></Button>
      {step > 1 ? <Button type="button" size="md" variant="ghost" className="mt-2 w-full" onClick={onBack}><IconArrowRight size={18} aria-hidden="true" />مرحله قبل</Button> : null}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted"><IconLock size={14} aria-hidden="true" />اطلاعات شما محفوظ و امن است.</p>
    </Card>
  );
}
