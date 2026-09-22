"use client";

import { useMemo, useState } from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheckFilled,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { alternativeProducts, preparationLabels } from "@/data/supplier-request-detail";
import { calculateItemTotal, formatToman } from "@/lib/supplier-proposal";
import type {
  AlternativeProduct,
  ProposalTotals,
  PurchaseRequestItem,
  SupplierProposalDraft,
  SupplierProposalItem,
  SupplierPurchaseRequest,
} from "@/types/supplier-proposal";
import { MoneyInput } from "./money-input";

type AlternativeModalProps = {
  item: PurchaseRequestItem | null;
  current?: SupplierProposalItem;
  onClose: () => void;
  onSave: (alternative: AlternativeProduct, quantity: number, price: number) => void;
};

export function AlternativeProductModal({ item, current, onClose, onSave }: AlternativeModalProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(current?.alternative?.id ?? "");
  const [quantity, setQuantity] = useState(current?.availableQuantity ?? item?.requestedQuantity ?? 0);
  const [price, setPrice] = useState(current?.unitPrice ?? 0);
  const [description, setDescription] = useState(current?.alternative?.description ?? "");
  const [error, setError] = useState("");
  const matches = useMemo(
    () => alternativeProducts.filter((product) => product.name.includes(query.trim())),
    [query],
  );

  if (!item) return null;

  function submit() {
    const product = alternativeProducts.find((candidate) => candidate.id === selectedId);
    if (!product || quantity <= 0 || quantity > item!.requestedQuantity || price <= 0) {
      setError("کالا، مقدار معتبر و قیمت واحد را کامل کنید.");
      return;
    }
    onSave({ ...product, description }, quantity, price);
  }

  return (
    <Modal
      open
      width="lg"
      title="پیشنهاد کالای جایگزین"
      description="یک کالای نزدیک از کالاهای خود انتخاب کنید. خریدار جایگزین بودن آن را واضح خواهد دید."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>انصراف</Button>
          <Button type="button" className="flex-1" onClick={submit}><IconCheck size={18} />افزودن جایگزین</Button>
        </>
      }
    >
      <div className="rounded-xl border border-line bg-surface-subtle p-3">
        <span className="text-[10px] font-bold text-ink-muted">کالای اصلی</span>
        <p className="mt-1 text-sm font-black text-ink">{item.name}</p>
        <p className="mt-1 text-xs text-ink-muted">{new Intl.NumberFormat("fa-IR").format(item.requestedQuantity)} {item.unit}</p>
      </div>

      <div className="mt-4">
        <label htmlFor="alternative-search" className="mb-1.5 block text-xs font-black text-ink">جستجو در کالاهای من</label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
          <input id="alternative-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو در کالاهای من..." className="h-11 w-full rounded-control border border-line pr-10 pl-3 text-sm outline-none focus:border-primary" />
        </div>
      </div>

      <fieldset className="mt-3 space-y-2">
        <legend className="sr-only">انتخاب کالای جایگزین</legend>
        {matches.map((product) => (
          <label key={product.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2 transition has-[:checked]:border-primary has-[:checked]:bg-primary-soft/55">
            <input type="radio" name="alternative" value={product.id} checked={selectedId === product.id} onChange={() => setSelectedId(product.id)} className="size-4 accent-primary" />
            <span className="text-xs font-bold text-ink">{product.name}</span>
          </label>
        ))}
      </fieldset>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="alternative-quantity" className="mb-1.5 block text-xs font-black text-ink">مقدار قابل تأمین</label>
          <div className="relative">
            <input id="alternative-quantity" type="number" min={1} max={item.requestedQuantity} value={quantity || ""} onChange={(event) => setQuantity(Number(event.target.value))} className="h-11 w-full rounded-control border border-line px-3 pl-14 text-sm outline-none focus:border-primary" />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted">{item.unit}</span>
          </div>
        </div>
        <div>
          <label htmlFor="alternative-price" className="mb-1.5 block text-xs font-black text-ink">قیمت واحد</label>
          <MoneyInput id="alternative-price" value={price} onChange={setPrice} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="alternative-description" className="mb-1.5 block text-xs font-black text-ink">توضیح اختیاری</label>
        <textarea id="alternative-description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="این محصول از نظر حجم و طعم نزدیک‌ترین گزینه موجود است." className="w-full resize-none rounded-control border border-line p-3 text-sm leading-6 outline-none focus:border-primary" />
      </div>
      {error ? <p role="alert" className="mt-3 text-xs font-bold text-danger">{error}</p> : null}
    </Modal>
  );
}

type ReviewModalProps = {
  open: boolean;
  request: SupplierPurchaseRequest;
  draft: SupplierProposalDraft;
  totals: ProposalTotals;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReviewProposalModal({ open, request, draft, totals, onClose, onSubmit }: ReviewModalProps) {
  const selected = draft.items.filter((item) => item.selected);
  const itemsById = new Map(request.items.map((item) => [item.id, item]));
  const preparation = draft.preparationTime === "custom" ? draft.customPreparationTime : draft.preparationTime ? preparationLabels[draft.preparationTime] : "—";

  return (
    <Modal
      open={open}
      width="lg"
      title="بررسی پیشنهاد قیمت"
      description="قبل از ارسال، اطلاعات پیشنهاد را بررسی کنید."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>بازگشت و ویرایش</Button>
          <Button type="button" className="flex-1" onClick={onSubmit}>ارسال پیشنهاد</Button>
        </>
      }
    >
      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <ReviewValue label="خریدار" value={request.buyer.name} />
        <ReviewValue label="درخواست" value={`#${request.id}`} ltr />
        <ReviewValue label="اقلام" value={`${new Intl.NumberFormat("fa-IR").format(selected.length)} از ${new Intl.NumberFormat("fa-IR").format(request.items.length)}`} />
        <ReviewValue label="زمان تحویل" value={preparation} />
        <ReviewValue label="مجموع کالاها" value={formatToman(totals.subtotal)} />
        <ReviewValue label="تخفیف" value={formatToman(totals.itemDiscount + totals.generalDiscount)} />
        <ReviewValue label="ارسال" value={totals.shipping ? formatToman(totals.shipping) : "رایگان"} />
        <ReviewValue label="اعتبار" value={`${new Intl.NumberFormat("fa-IR").format(draft.validityHours)} ساعت`} />
      </dl>

      <div className="mt-4 rounded-xl bg-primary-soft p-4">
        <span className="text-xs font-bold text-primary">مبلغ نهایی پیشنهاد</span>
        <strong className="mt-1 block text-xl font-black text-ink">{formatToman(totals.total)}</strong>
      </div>

      {selected.length < request.items.length ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/20 bg-warning-soft p-3 text-xs leading-6 text-warning">
          <IconAlertTriangle className="mt-0.5 shrink-0" size={18} />
          <p>شما برای {new Intl.NumberFormat("fa-IR").format(selected.length)} مورد از {new Intl.NumberFormat("fa-IR").format(request.items.length)} قلم این درخواست پیشنهاد ارسال می‌کنید. این موضوع مانع ارسال پیشنهاد نیست.</p>
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <div className="bg-surface-subtle px-3 py-2 text-xs font-black text-ink">اقلام انتخاب‌شده</div>
        <ul className="max-h-56 divide-y divide-line overflow-y-auto">
          {selected.map((proposalItem) => {
            const requestItem = itemsById.get(proposalItem.requestItemId);
            const total = calculateItemTotal(proposalItem).total;
            return (
              <li key={proposalItem.requestItemId} className="flex items-center justify-between gap-3 px-3 py-3 text-xs">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-ink">{proposalItem.alternative?.name ?? requestItem?.name}</strong>
                    {proposalItem.alternative ? <Badge variant="violet">جایگزین</Badge> : null}
                  </div>
                  <span className="mt-1 block text-ink-muted">{new Intl.NumberFormat("fa-IR").format(proposalItem.availableQuantity)} × {formatToman(proposalItem.unitPrice)}</span>
                </div>
                <strong className="shrink-0 text-ink">{formatToman(total)}</strong>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}

function ReviewValue({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3"><dt className="text-ink-muted">{label}</dt><dd className="font-black text-ink" dir={ltr ? "ltr" : undefined}>{value}</dd></div>;
}

export function ProposalSuccessModal({ open, requestId, amount, validity, onView, onBack }: { open: boolean; requestId: string; amount: number; validity: number; onView: () => void; onBack: () => void }) {
  return (
    <Modal open={open} title="پیشنهاد شما ارسال شد" onClose={onView} width="sm" footer={<><Button type="button" variant="secondary" onClick={onBack}>بازگشت به درخواست‌ها</Button><Button type="button" className="flex-1" onClick={onView}>مشاهده پیشنهاد</Button></>}>
      <div className="text-center">
        <IconCircleCheckFilled size={64} className="mx-auto text-success" />
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-ink-muted">پیشنهاد قیمت شما برای درخواست <span dir="ltr" className="font-black text-ink">#{requestId}</span> با موفقیت برای خریدار ارسال شد.</p>
        <dl className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-surface-subtle p-3"><dt className="text-ink-muted">مبلغ</dt><dd className="mt-1 font-black text-ink">{formatToman(amount)}</dd></div>
          <div className="rounded-xl bg-surface-subtle p-3"><dt className="text-ink-muted">اعتبار</dt><dd className="mt-1 font-black text-ink">{new Intl.NumberFormat("fa-IR").format(validity)} ساعت</dd></div>
        </dl>
      </div>
    </Modal>
  );
}

export function UnsavedChangesModal({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) {
  return (
    <Modal open={open} title="تغییرات ذخیره نشده‌اند" description="اگر از این صفحه خارج شوید تغییرات ثبت‌نشده از بین می‌روند." onClose={onStay} width="sm" footer={<><Button type="button" variant="secondary" className="flex-1" onClick={onStay}>ماندن در صفحه</Button><Button type="button" variant="danger" className="flex-1" onClick={onLeave}><IconTrash size={18} />خروج بدون ذخیره</Button></>}>
      <div className="flex items-start gap-3 rounded-xl bg-warning-soft p-3 text-sm leading-7 text-warning"><IconAlertTriangle className="mt-1 shrink-0" size={20} /><p>برای نگه‌داشتن قیمت‌ها و شرایط واردشده، ابتدا پیش‌نویس را ذخیره کنید.</p></div>
    </Modal>
  );
}
