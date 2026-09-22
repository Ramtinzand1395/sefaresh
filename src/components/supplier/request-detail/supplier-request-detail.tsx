"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconBookmark,
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconClock,
  IconInfoCircle,
  IconMapPin,
  IconPackage,
  IconPencil,
  IconRosetteDiscountCheckFilled,
  IconStarFilled,
  IconTrash,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createInitialProposalDraft, preparationLabels } from "@/data/supplier-request-detail";
import {
  calculateItemTotal,
  calculateProposalTotals,
  formatToman,
  supplierProposalSchema,
} from "@/lib/supplier-proposal";
import { cn } from "@/lib/cn";
import type {
  AlternativeProduct,
  DiscountType,
  PurchaseRequestItem,
  SupplierProposalDraft,
  SupplierProposalItem,
  SupplierPurchaseRequest,
} from "@/types/supplier-proposal";
import { MoneyInput } from "./money-input";
import {
  AlternativeProductModal,
  ProposalSuccessModal,
  ReviewProposalModal,
  UnsavedChangesModal,
} from "./proposal-modals";

type DraftAction =
  | { type: "set-item"; index: number; value: Partial<SupplierProposalItem> }
  | { type: "set-item-discount"; index: number; field: "type" | "value"; value: DiscountType | number }
  | { type: "select-matched"; matchedIds: string[]; selected: boolean }
  | { type: "set-field"; field: keyof SupplierProposalDraft; value: SupplierProposalDraft[keyof SupplierProposalDraft] }
  | { type: "set-general-discount"; field: "type" | "value"; value: DiscountType | number };

function proposalReducer(state: SupplierProposalDraft, action: DraftAction): SupplierProposalDraft {
  if (action.type === "set-item") {
    return { ...state, items: state.items.map((item, index) => index === action.index ? { ...item, ...action.value } : item) };
  }
  if (action.type === "set-item-discount") {
    return {
      ...state,
      items: state.items.map((item, index) => index === action.index ? { ...item, discount: { ...item.discount, [action.field]: action.value } } : item),
    };
  }
  if (action.type === "select-matched") {
    return { ...state, items: state.items.map((item) => action.matchedIds.includes(item.requestItemId) ? { ...item, selected: action.selected } : item) };
  }
  if (action.type === "set-general-discount") {
    return { ...state, generalDiscount: { ...state.generalDiscount, [action.field]: action.value } };
  }
  return { ...state, [action.field]: action.value };
}

const inputClass = "h-11 w-full rounded-control border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-ink-muted";
const numberFormatter = new Intl.NumberFormat("fa-IR");

export function SupplierRequestDetail({ request }: { request: SupplierPurchaseRequest }) {
  const router = useRouter();
  const initialDraft = useMemo(() => createInitialProposalDraft(request), [request]);
  const [draft, dispatch] = useReducer(proposalReducer, initialDraft);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialDraft));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alternativeIndex, setAlternativeIndex] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const errorFocusRef = useRef<HTMLDivElement>(null);
  const editable = request.state === "active";
  const dirty = editable && JSON.stringify(draft) !== savedSnapshot;
  const totals = useMemo(() => calculateProposalTotals(draft), [draft]);
  const selectedCount = draft.items.filter((item) => item.selected).length;
  const matchedIds = request.items.filter((item) => item.supplierMatch).map((item) => item.id);
  const coverage = Math.round((selectedCount / request.items.length) * 100);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    const interceptNavigation = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.dataset.ignoreUnsaved === "true") return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault();
      setPendingHref(`${destination.pathname}${destination.search}${destination.hash}`);
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", interceptNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", interceptNavigation, true);
    };
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (request.state === "proposal_sent" && request.previousProposal) {
    return <SentProposalState request={request} />;
  }

  function setField<K extends keyof SupplierProposalDraft>(field: K, value: SupplierProposalDraft[K]) {
    dispatch({ type: "set-field", field, value });
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateProposal() {
    const result = supplierProposalSchema.safeParse({
      ...draft,
      items: draft.items.map((item, index) => ({ ...item, requestedQuantity: request.items[index].requestedQuantity })),
      maxValidityHours: request.maxValidityHours,
    });
    if (result.success) {
      setErrors({});
      return true;
    }
    const nextErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path.join(".");
      if (!nextErrors[key]) nextErrors[key] = issue.message;
    });
    setErrors(nextErrors);
    window.setTimeout(() => {
      const firstError = errorFocusRef.current?.querySelector<HTMLElement>("[aria-invalid='true'], [data-form-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError?.focus({ preventScroll: true });
    }, 0);
    return false;
  }

  function openReview() {
    if (!editable || !validateProposal()) return;
    setReviewOpen(true);
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(`supplier-proposal-draft:${request.id}`, JSON.stringify(draft));
      setSavedSnapshot(JSON.stringify(draft));
      setToast("پیش‌نویس ذخیره شد.");
    } catch {
      setToast("ذخیره پیش‌نویس در این مرورگر ممکن نبود.");
    }
  }

  function submitProposal() {
    setReviewOpen(false);
    setSavedSnapshot(JSON.stringify(draft));
    setSuccessOpen(true);
  }

  function saveAlternative(alternative: AlternativeProduct, quantity: number, price: number) {
    if (alternativeIndex === null) return;
    dispatch({ type: "set-item", index: alternativeIndex, value: { alternative, selected: true, availableQuantity: quantity, unitPrice: price } });
    setAlternativeIndex(null);
  }

  const preparationSummary = draft.preparationTime === "custom"
    ? draft.customPreparationTime || "—"
    : draft.preparationTime ? preparationLabels[draft.preparationTime] : "—";

  return (
    <div ref={errorFocusRef} className="space-y-5 pb-28 lg:pb-6">
      <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/supplier" className="transition hover:text-primary">داشبورد</Link><IconChevronLeft size={14} />
        <Link href="/supplier/requests" className="transition hover:text-primary">درخواست‌های خرید</Link><IconChevronLeft size={14} />
        <span dir="ltr" className="font-bold text-ink">#{request.id}</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-ink sm:text-3xl">جزئیات درخواست خرید</h1>
            <Badge variant={request.state === "active" ? "info" : request.state === "expired" ? "warning" : "danger"}>{request.statusLabel}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span dir="ltr" className="font-black text-ink">#{request.id}</span>
            <Badge variant={request.deadlineCritical ? "danger" : "neutral"} className="gap-1"><IconClock size={14} />{request.deadlineLabel}</Badge>
          </div>
        </div>
        {editable ? <Button type="button" variant="secondary" onClick={saveDraft}><IconBookmark size={18} />ذخیره برای بعد</Button> : null}
      </header>

      {request.deadlineCritical ? <Alert tone="warning" icon={IconClock}>زمان کمی برای ارسال پیشنهاد باقی مانده است. قیمت‌ها و شرایط تحویل را پیش از پایان مهلت نهایی کنید.</Alert> : null}
      {request.state === "expired" ? <Alert tone="danger" icon={IconAlertTriangle}>مهلت ارائه پیشنهاد برای این درخواست به پایان رسیده است. جزئیات درخواست همچنان قابل مشاهده است.</Alert> : null}
      {request.state === "cancelled" ? <Alert tone="danger" icon={IconAlertTriangle}>این درخواست توسط خریدار لغو شده است. امکان ثبت یا ذخیره پیشنهاد وجود ندارد.</Alert> : null}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
        <main className="min-w-0 space-y-4">
          <RequestOverview request={request} selectedCount={selectedCount} />
          <BuyerInformation request={request} />

          <Card id="requested-products" className="overflow-hidden shadow-none">
            <CardHeader className="flex-col sm:flex-row">
              <div>
                <CardTitle>اقلام درخواستی</CardTitle>
                <CardDescription>کالاهایی را که قادر به تأمین آنها هستید انتخاب کرده و قیمت خود را وارد کنید.</CardDescription>
              </div>
              {editable ? (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => dispatch({ type: "select-matched", matchedIds, selected: true })}>انتخاب همه قابل تأمین‌ها</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => dispatch({ type: "select-matched", matchedIds: draft.items.map((item) => item.requestItemId), selected: false })}>لغو انتخاب همه</Button>
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {errors.items ? <p data-form-error="true" tabIndex={-1} role="alert" className="mx-4 mb-3 rounded-xl bg-danger-soft px-3 py-2 text-xs font-bold text-danger sm:mx-5">{errors.items}</p> : null}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[930px] text-right text-xs">
                  <thead className="border-y border-line bg-surface-subtle text-ink-muted">
                    <tr><th className="w-12 px-3 py-3">انتخاب</th><th className="px-3 py-3">کالا</th><th className="px-3 py-3">درخواستی</th><th className="px-3 py-3">قابل تأمین</th><th className="px-3 py-3">قیمت واحد</th><th className="px-3 py-3">تخفیف</th><th className="px-3 py-3">جمع</th><th className="px-3 py-3">وضعیت</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {request.items.map((item, index) => <ProductTableRow key={item.id} item={item} proposalItem={draft.items[index]} index={index} disabled={!editable} errors={errors} dispatch={dispatch} onAlternative={() => setAlternativeIndex(index)} />)}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-line lg:hidden">
                {request.items.map((item, index) => <ProductMobileCard key={item.id} item={item} proposalItem={draft.items[index]} index={index} disabled={!editable} errors={errors} dispatch={dispatch} onAlternative={() => setAlternativeIndex(index)} />)}
              </div>
            </CardContent>
          </Card>

          <DeliveryCard draft={draft} disabled={!editable} errors={errors} setField={setField} dispatch={dispatch} maxValidityHours={request.maxValidityHours} />

          <Card>
            <CardHeader><div><CardTitle>توضیحات پیشنهاد</CardTitle><CardDescription>اطلاعات تکمیلی درباره موجودی، برند یا شرایط سفارش را برای خریدار بنویسید.</CardDescription></div></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="proposal-notes" className="mb-1.5 block text-xs font-black text-ink">توضیحات برای خریدار</label>
                <textarea id="proposal-notes" rows={4} maxLength={500} value={draft.notes} disabled={!editable} onChange={(event) => setField("notes", event.target.value)} placeholder="اگر درباره موجودی، برند، زمان تحویل یا شرایط سفارش توضیحی دارید اینجا بنویسید..." aria-invalid={Boolean(errors.notes) || undefined} aria-describedby={errors.notes ? "proposal-notes-error" : "proposal-notes-count"} className={cn("w-full resize-none rounded-control border p-3 text-sm leading-7 outline-none disabled:bg-surface-subtle", errors.notes ? "border-danger" : "border-line focus:border-primary")} />
                <div className="mt-1 flex items-center justify-between text-[10px]"><span id="proposal-notes-error" className="font-bold text-danger">{errors.notes}</span><span id="proposal-notes-count" className="text-ink-muted">{numberFormatter.format(draft.notes.length)} / ۵۰۰</span></div>
              </div>
              <div>
                <label htmlFor="internal-note" className="mb-1.5 block text-xs font-black text-ink">یادداشت داخلی <span className="font-normal text-ink-muted">(اختیاری)</span></label>
                <textarea id="internal-note" rows={2} value={draft.internalNote} disabled={!editable} onChange={(event) => setField("internalNote", event.target.value)} placeholder="برای این مشتری امکان تخفیف بیشتر وجود دارد." className="w-full resize-none rounded-control border border-line p-3 text-sm leading-7 outline-none focus:border-primary disabled:bg-surface-subtle" />
                <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-muted"><IconInfoCircle size={13} />فقط برای شما قابل مشاهده است.</p>
              </div>
            </CardContent>
          </Card>
        </main>

        <ProposalSummary request={request} draft={draft} totals={totals} selectedCount={selectedCount} coverage={coverage} preparation={preparationSummary} editable={editable} onReview={openReview} onSave={saveDraft} />
      </div>

      {editable ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 shadow-[0_-10px_30px_rgba(20,43,74,.10)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1"><span className="block text-[10px] text-ink-muted">مبلغ پیشنهاد</span><strong className="truncate text-sm text-ink">{formatToman(totals.total)}</strong></div>
            <Button type="button" onClick={openReview}>بررسی پیشنهاد</Button>
          </div>
        </div>
      ) : null}

      <AlternativeProductModal item={alternativeIndex === null ? null : request.items[alternativeIndex]} current={alternativeIndex === null ? undefined : draft.items[alternativeIndex]} onClose={() => setAlternativeIndex(null)} onSave={saveAlternative} />
      <ReviewProposalModal open={reviewOpen} request={request} draft={draft} totals={totals} onClose={() => setReviewOpen(false)} onSubmit={submitProposal} />
      <ProposalSuccessModal open={successOpen} requestId={request.id} amount={totals.total} validity={draft.validityHours} onView={() => router.push("/supplier/proposals/SP-4831")} onBack={() => router.push("/supplier/requests")} />
      <UnsavedChangesModal open={Boolean(pendingHref)} onStay={() => setPendingHref(null)} onLeave={() => { const href = pendingHref; setSavedSnapshot(JSON.stringify(draft)); setPendingHref(null); if (href) router.push(href); }} />
      {toast ? <div role="status" className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-xs font-bold text-white shadow-float lg:bottom-6">{toast}</div> : null}
    </div>
  );
}

function Alert({ children, tone, icon: Icon }: { children: React.ReactNode; tone: "warning" | "danger"; icon: typeof IconClock }) {
  return <div role="alert" className={cn("flex items-start gap-2 rounded-card border p-3 text-sm leading-7", tone === "warning" ? "border-warning/20 bg-warning-soft text-warning" : "border-danger/20 bg-danger-soft text-danger")}><Icon className="mt-1 shrink-0" size={20} /><p>{children}</p></div>;
}

function RequestOverview({ request, selectedCount }: { request: SupplierPurchaseRequest; selectedCount: number }) {
  const matchedCount = request.items.filter((item) => item.supplierMatch).length;
  return (
    <Card>
      <CardHeader><CardTitle>خلاصه درخواست</CardTitle></CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewItem icon={IconCalendar} label="تاریخ ثبت" value={request.registeredAt} />
          <OverviewItem icon={IconPackage} label="تعداد اقلام" value={`${numberFormatter.format(request.items.length)} قلم`} />
          <OverviewItem icon={IconBuildingStore} label="ارزش تقریبی درخواست" value={formatToman(request.estimatedValue)} />
          <OverviewItem icon={IconMapPin} label="محل تحویل" value={request.city} />
          <OverviewItem icon={IconClock} label="مهلت ارائه پیشنهاد" value={request.deadlineAt} />
          <div className="rounded-xl border border-primary/15 bg-primary-soft/45 p-3">
            <dt className="text-[10px] font-bold text-ink-muted">تطابق کالاها</dt>
            <dd className="mt-1 text-xs font-black text-ink">{numberFormatter.format(matchedCount)} از {numberFormatter.format(request.items.length)} قلم را تأمین می‌کنید</dd>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white" aria-label={`${matchedCount} از ${request.items.length}`}><span className="block h-full rounded-full bg-primary" style={{ width: `${(matchedCount / request.items.length) * 100}%` }} /></div>
            {selectedCount !== matchedCount ? <p className="mt-2 text-[10px] text-primary">فعلاً {numberFormatter.format(selectedCount)} قلم انتخاب شده است.</p> : null}
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function OverviewItem({ icon: Icon, label, value }: { icon: typeof IconClock; label: string; value: string }) {
  return <div className="rounded-xl border border-line bg-surface-subtle p-3"><dt className="flex items-center gap-1.5 text-[10px] font-bold text-ink-muted"><Icon size={15} className="text-primary" />{label}</dt><dd className="mt-1.5 text-xs font-black text-ink">{value}</dd></div>;
}

function BuyerInformation({ request }: { request: SupplierPurchaseRequest }) {
  const buyer = request.buyer;
  return (
    <Card>
      <CardHeader><CardTitle>اطلاعات خریدار</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-lg font-black text-primary">{buyer.initials}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-black text-ink">{buyer.name}</h3>{buyer.verified ? <Badge variant="success" className="gap-1"><IconRosetteDiscountCheckFilled size={15} />خریدار تأییدشده</Badge> : null}</div>
            <div className="mt-3 grid gap-2 text-xs min-[500px]:grid-cols-2 lg:grid-cols-4">
              <span><span className="text-ink-muted">نوع کسب‌وکار:</span> <strong>{buyer.businessType}</strong></span>
              <span><span className="text-ink-muted">شهر:</span> <strong>{buyer.city}</strong></span>
              <span className="flex items-center gap-1"><span className="text-ink-muted">امتیاز:</span> <IconStarFilled size={14} className="text-accent" /><strong>{buyer.rating}</strong></span>
              <span><span className="text-ink-muted">خرید موفق:</span> <strong>{numberFormatter.format(buyer.successfulOrders)} سفارش</strong></span>
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-surface-subtle p-3 text-[10px] leading-5 text-ink-muted"><IconInfoCircle size={15} className="mt-0.5 shrink-0 text-primary" />اطلاعات تماس و آدرس دقیق خریدار پس از نهایی‌شدن سفارش در دسترس قرار می‌گیرد.</p>
      </CardContent>
    </Card>
  );
}

type ProductEditorProps = {
  item: PurchaseRequestItem;
  proposalItem: SupplierProposalItem;
  index: number;
  disabled: boolean;
  errors: Record<string, string>;
  dispatch: React.Dispatch<DraftAction>;
  onAlternative: () => void;
};

function ProductTableRow(props: ProductEditorProps) {
  const { item, proposalItem, index, disabled, errors, dispatch, onAlternative } = props;
  const active = proposalItem.selected && !disabled;
  const total = calculateItemTotal(proposalItem).total;
  const partial = proposalItem.selected && proposalItem.availableQuantity > 0 && proposalItem.availableQuantity < item.requestedQuantity;
  const quantityError = errors[`items.${index}.availableQuantity`];
  const priceError = errors[`items.${index}.unitPrice`];
  const discountError = errors[`items.${index}.discount`];
  return (
    <tr className={cn("align-top", proposalItem.selected && "bg-primary-soft/15")}>
      <td className="px-3 py-4"><input type="checkbox" checked={proposalItem.selected} disabled={disabled || (!item.supplierMatch && !proposalItem.alternative)} onChange={(event) => dispatch({ type: "set-item", index, value: { selected: event.target.checked } })} className="size-4 accent-primary" aria-label={`انتخاب ${item.name}`} /></td>
      <td className="px-3 py-4"><ProductIdentity item={item} alternative={proposalItem.alternative} onEdit={onAlternative} onRemove={() => dispatch({ type: "set-item", index, value: { alternative: undefined, selected: false, availableQuantity: 0, unitPrice: 0 } })} disabled={disabled} /></td>
      <td className="whitespace-nowrap px-3 py-4 font-bold text-ink">{numberFormatter.format(item.requestedQuantity)} {item.unit}</td>
      <td className="w-32 px-3 py-4"><QuantityInput item={item} proposalItem={proposalItem} index={index} disabled={!active} error={quantityError} dispatch={dispatch} />{partial ? <p className="mt-1.5 text-[9px] leading-4 text-warning">{numberFormatter.format(item.requestedQuantity - proposalItem.availableQuantity)} {item.unit} تأمین نمی‌شود.</p> : null}</td>
      <td className="w-44 px-3 py-4"><MoneyInput id={`price-${item.id}`} value={proposalItem.unitPrice} disabled={!active} invalid={Boolean(priceError)} ariaDescribedBy={priceError ? `price-${item.id}-error` : undefined} onChange={(value) => dispatch({ type: "set-item", index, value: { unitPrice: value } })} />{priceError ? <p id={`price-${item.id}-error`} className="mt-1 text-[9px] text-danger">{priceError}</p> : null}</td>
      <td className="w-44 px-3 py-4"><DiscountInput itemId={item.id} proposalItem={proposalItem} index={index} disabled={!active} error={discountError} dispatch={dispatch} /></td>
      <td className="whitespace-nowrap px-3 py-4 font-black text-ink">{formatToman(total)}</td>
      <td className="px-3 py-4">{item.supplierMatch || proposalItem.alternative ? <Badge variant="success">{proposalItem.alternative ? "جایگزین" : "موجود"}</Badge> : <Button type="button" size="sm" variant="secondary" disabled={disabled} onClick={onAlternative}>پیشنهاد جایگزین</Button>}</td>
    </tr>
  );
}

function ProductMobileCard(props: ProductEditorProps) {
  const { item, proposalItem, index, disabled, errors, dispatch, onAlternative } = props;
  const active = proposalItem.selected && !disabled;
  const partial = proposalItem.selected && proposalItem.availableQuantity > 0 && proposalItem.availableQuantity < item.requestedQuantity;
  return (
    <article className={cn("p-4", proposalItem.selected && "bg-primary-soft/15")}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={proposalItem.selected} disabled={disabled || (!item.supplierMatch && !proposalItem.alternative)} onChange={(event) => dispatch({ type: "set-item", index, value: { selected: event.target.checked } })} className="mt-1 size-4 accent-primary" aria-label={`انتخاب ${item.name}`} />
        <div className="min-w-0 flex-1"><ProductIdentity item={item} alternative={proposalItem.alternative} onEdit={onAlternative} onRemove={() => dispatch({ type: "set-item", index, value: { alternative: undefined, selected: false, availableQuantity: 0, unitPrice: 0 } })} disabled={disabled} /></div>
        <Badge variant={item.supplierMatch || proposalItem.alternative ? "success" : "danger"}>{item.supplierMatch || proposalItem.alternative ? "موجود" : "ناموجود"}</Badge>
      </div>
      <div className="mt-3 rounded-xl bg-surface-subtle px-3 py-2 text-xs"><span className="text-ink-muted">مقدار درخواستی:</span> <strong>{numberFormatter.format(item.requestedQuantity)} {item.unit}</strong></div>
      {!item.supplierMatch && !proposalItem.alternative ? <Button type="button" size="sm" variant="secondary" className="mt-3 w-full" disabled={disabled} onClick={onAlternative}>پیشنهاد کالای جایگزین</Button> : null}
      <div className="mt-3 grid gap-3 min-[480px]:grid-cols-2">
        <div><span className="mb-1.5 block text-xs font-black text-ink">مقدار قابل تأمین</span><QuantityInput item={item} proposalItem={proposalItem} index={index} disabled={!active} error={errors[`items.${index}.availableQuantity`]} dispatch={dispatch} />{partial ? <p className="mt-1.5 text-[9px] text-warning">{numberFormatter.format(item.requestedQuantity - proposalItem.availableQuantity)} {item.unit} از مقدار درخواستی تأمین نمی‌شود.</p> : null}</div>
        <div><label htmlFor={`mobile-price-${item.id}`} className="mb-1.5 block text-xs font-black text-ink">قیمت واحد</label><MoneyInput id={`mobile-price-${item.id}`} value={proposalItem.unitPrice} disabled={!active} invalid={Boolean(errors[`items.${index}.unitPrice`])} onChange={(value) => dispatch({ type: "set-item", index, value: { unitPrice: value } })} />{errors[`items.${index}.unitPrice`] ? <p className="mt-1 text-[9px] text-danger">{errors[`items.${index}.unitPrice`]}</p> : null}</div>
        <div><span className="mb-1.5 block text-xs font-black text-ink">تخفیف</span><DiscountInput itemId={`mobile-${item.id}`} proposalItem={proposalItem} index={index} disabled={!active} error={errors[`items.${index}.discount`]} dispatch={dispatch} /></div>
        <div className="rounded-xl border border-line bg-white p-3"><span className="text-[10px] text-ink-muted">جمع این قلم</span><strong className="mt-1 block text-sm text-ink">{formatToman(calculateItemTotal(proposalItem).total)}</strong></div>
      </div>
    </article>
  );
}

function ProductIdentity({ item, alternative, onEdit, onRemove, disabled }: { item: PurchaseRequestItem; alternative?: AlternativeProduct; onEdit: () => void; onRemove: () => void; disabled: boolean }) {
  return (
    <div className="flex min-w-[11rem] items-start gap-2">
      {item.image ? <span className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-line bg-white"><Image src={item.image} alt="" fill sizes="40px" className="object-cover" /></span> : <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-subtle text-primary"><IconPackage size={20} /></span>}
      <div className="min-w-0"><strong className="block text-xs text-ink">{item.name}</strong><span className="mt-1 block text-[10px] text-ink-muted">{item.category}</span>{alternative ? <div className="mt-2 rounded-lg bg-violet-soft px-2 py-1.5"><span className="block text-[9px] font-bold text-violet">کالای جایگزین پیشنهاد شده</span><strong className="mt-0.5 block text-[10px] text-ink">{alternative.name}</strong>{!disabled ? <div className="mt-1 flex gap-2"><button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-[9px] font-bold text-primary"><IconPencil size={12} />ویرایش</button><button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-[9px] font-bold text-danger"><IconTrash size={12} />حذف</button></div> : null}</div> : null}</div>
    </div>
  );
}

function QuantityInput({ item, proposalItem, index, disabled, error, dispatch }: { item: PurchaseRequestItem; proposalItem: SupplierProposalItem; index: number; disabled: boolean; error?: string; dispatch: React.Dispatch<DraftAction> }) {
  const id = `quantity-${item.id}-${disabled ? "disabled" : "active"}`;
  return <><div className="relative"><input id={id} type="number" min={1} max={item.requestedQuantity} step="any" value={proposalItem.availableQuantity || ""} disabled={disabled} aria-invalid={Boolean(error) || undefined} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => dispatch({ type: "set-item", index, value: { availableQuantity: Number(event.target.value) } })} className={cn(inputClass, "pl-12", error && "border-danger")} /><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted">{item.unit}</span></div>{error ? <p id={`${id}-error`} className="mt-1 text-[9px] leading-4 text-danger">{error}</p> : null}</>;
}

function DiscountInput({ itemId, proposalItem, index, disabled, error, dispatch }: { itemId: string; proposalItem: SupplierProposalItem; index: number; disabled: boolean; error?: string; dispatch: React.Dispatch<DraftAction> }) {
  return <><div className="flex overflow-hidden rounded-control border border-line bg-white"><select aria-label="نوع تخفیف" value={proposalItem.discount.type} disabled={disabled} onChange={(event) => dispatch({ type: "set-item-discount", index, field: "type", value: event.target.value as DiscountType })} className="w-[4.6rem] border-l border-line bg-surface-subtle px-1 text-[10px] outline-none"><option value="fixed">مبلغ</option><option value="percent">درصد</option></select><input id={`discount-${itemId}`} type="number" min={0} max={proposalItem.discount.type === "percent" ? 100 : undefined} value={proposalItem.discount.value || ""} disabled={disabled} aria-invalid={Boolean(error) || undefined} onChange={(event) => dispatch({ type: "set-item-discount", index, field: "value", value: Number(event.target.value) })} className="h-11 min-w-0 flex-1 px-2 text-sm outline-none disabled:bg-surface-subtle" /></div>{error ? <p className="mt-1 text-[9px] text-danger">{error}</p> : null}</>;
}

function DeliveryCard({ draft, disabled, errors, setField, dispatch, maxValidityHours }: { draft: SupplierProposalDraft; disabled: boolean; errors: Record<string, string>; setField: <K extends keyof SupplierProposalDraft>(field: K, value: SupplierProposalDraft[K]) => void; dispatch: React.Dispatch<DraftAction>; maxValidityHours: number }) {
  const validityOptions = [2, 6, 12, 24, 48] as const;
  return (
    <Card id="delivery-conditions">
      <CardHeader><div><CardTitle>ارسال و تحویل</CardTitle><CardDescription>زمان، روش ارسال و اعتبار پیشنهاد را مشخص کنید.</CardDescription></div></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label="زمان آماده‌سازی" htmlFor="preparation-time" error={errors.preparationTime}>
          <select id="preparation-time" value={draft.preparationTime} disabled={disabled} aria-invalid={Boolean(errors.preparationTime) || undefined} onChange={(event) => setField("preparationTime", event.target.value as SupplierProposalDraft["preparationTime"])} className={inputClass}><option value="">انتخاب کنید</option><option value="same_day">همان روز</option><option value="1_day">۱ روز کاری</option><option value="2_days">۲ روز کاری</option><option value="3_days">۳ روز کاری</option><option value="custom">زمان سفارشی</option></select>
        </Field>
        {draft.preparationTime === "custom" ? <Field label="زمان آماده‌سازی سفارشی" htmlFor="custom-preparation" error={errors.customPreparationTime}><input id="custom-preparation" value={draft.customPreparationTime} disabled={disabled} aria-invalid={Boolean(errors.customPreparationTime) || undefined} onChange={(event) => setField("customPreparationTime", event.target.value)} placeholder="مثلاً ۵ روز کاری" className={inputClass} /></Field> : null}
        <Field label="تاریخ تقریبی تحویل" htmlFor="delivery-date"><div className="relative"><IconCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" size={17} /><input id="delivery-date" dir="ltr" value={draft.deliveryDate} disabled={disabled} onChange={(event) => setField("deliveryDate", event.target.value)} placeholder="۱۴۰۵/۰۶/۲۵" className={cn(inputClass, "pr-10 text-right")} /></div></Field>
        <Field label="روش ارسال" htmlFor="shipping-method" error={errors.shippingMethod}><select id="shipping-method" value={draft.shippingMethod} disabled={disabled} aria-invalid={Boolean(errors.shippingMethod) || undefined} onChange={(event) => setField("shippingMethod", event.target.value as SupplierProposalDraft["shippingMethod"])} className={inputClass}><option value="">انتخاب کنید</option><option value="supplier">ارسال توسط تأمین‌کننده</option><option value="courier">پیک</option><option value="freight">باربری</option><option value="pickup">تحویل حضوری</option></select></Field>
        <Field label="هزینه ارسال" htmlFor="shipping-cost" error={errors.shippingCost}><MoneyInput id="shipping-cost" value={draft.shippingCost} disabled={disabled || draft.freeShipping} invalid={Boolean(errors.shippingCost)} onChange={(value) => setField("shippingCost", value)} /></Field>
        <div className="flex items-end"><label className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-control border border-line bg-surface-subtle px-3 text-xs font-bold text-ink"><span className="flex items-center gap-2"><IconTruckDelivery size={18} className="text-success" />ارسال رایگان</span><input type="checkbox" checked={draft.freeShipping} disabled={disabled} onChange={(event) => setField("freeShipping", event.target.checked)} className="size-4 accent-primary" /></label></div>
        <Field label="اعتبار پیشنهاد" htmlFor="validity-hours" error={errors.validityHours}><select id="validity-hours" value={draft.validityHours} disabled={disabled} aria-invalid={Boolean(errors.validityHours) || undefined} onChange={(event) => setField("validityHours", Number(event.target.value) as SupplierProposalDraft["validityHours"])} className={inputClass}>{validityOptions.map((hours) => <option key={hours} value={hours} disabled={hours > maxValidityHours}>{numberFormatter.format(hours)} ساعت{hours > maxValidityHours ? " — پس از مهلت درخواست" : ""}</option>)}</select></Field>
        <Field label="تخفیف کلی (اختیاری)" htmlFor="general-discount" error={errors.generalDiscount}><div className="flex overflow-hidden rounded-control border border-line bg-white"><select aria-label="نوع تخفیف کلی" value={draft.generalDiscount.type} disabled={disabled} onChange={(event) => dispatch({ type: "set-general-discount", field: "type", value: event.target.value as DiscountType })} className="w-24 border-l border-line bg-surface-subtle px-2 text-xs outline-none"><option value="fixed">مبلغ ثابت</option><option value="percent">درصد</option></select><input id="general-discount" type="number" min={0} max={draft.generalDiscount.type === "percent" ? 100 : undefined} value={draft.generalDiscount.value || ""} disabled={disabled} onChange={(event) => dispatch({ type: "set-general-discount", field: "value", value: Number(event.target.value) })} className="h-11 min-w-0 flex-1 px-3 text-sm outline-none disabled:bg-surface-subtle" /></div></Field>
      </CardContent>
    </Card>
  );
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return <div><label htmlFor={htmlFor} className="mb-1.5 block text-xs font-black text-ink">{label}</label>{children}{error ? <p role="alert" className="mt-1 text-[10px] font-bold text-danger">{error}</p> : null}</div>;
}

function ProposalSummary({ request, draft, totals, selectedCount, coverage, preparation, editable, onReview, onSave }: { request: SupplierPurchaseRequest; draft: SupplierProposalDraft; totals: ReturnType<typeof calculateProposalTotals>; selectedCount: number; coverage: number; preparation: string; editable: boolean; onReview: () => void; onSave: () => void }) {
  return (
    <aside className="xl:sticky xl:top-24">
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="border-b border-line"><CardTitle>خلاصه پیشنهاد</CardTitle></CardHeader>
        <CardContent className="pt-5">
          <dl className="space-y-3 text-xs"><SummaryRow label="اقلام درخواست" value={numberFormatter.format(request.items.length)} /><SummaryRow label="اقلام انتخاب‌شده" value={numberFormatter.format(selectedCount)} strong /><SummaryRow label="مجموع کالاها" value={formatToman(totals.subtotal)} /><SummaryRow label="تخفیف کالاها" value={`− ${formatToman(totals.itemDiscount)}`} tone="success" /><SummaryRow label="تخفیف کلی" value={`− ${formatToman(totals.generalDiscount)}`} tone="success" /><SummaryRow label="هزینه ارسال" value={totals.shipping ? formatToman(totals.shipping) : "رایگان"} /></dl>
          <div className="my-5 rounded-xl bg-primary-soft p-4"><span className="text-xs font-bold text-primary">مبلغ نهایی پیشنهاد</span><strong className="mt-1 block text-2xl font-black text-ink">{formatToman(totals.total)}</strong></div>
          <div><div className="flex items-center justify-between text-xs"><strong className="text-ink">{numberFormatter.format(selectedCount)} از {numberFormatter.format(request.items.length)} قلم</strong><span className="text-ink-muted">{numberFormatter.format(coverage)}٪ درخواست</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-subtle"><span className="block h-full rounded-full bg-success transition-[width]" style={{ width: `${coverage}%` }} /></div></div>
          <dl className="mt-5 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded-xl bg-surface-subtle p-3"><dt className="text-ink-muted">زمان آماده‌سازی</dt><dd className="mt-1 font-black text-ink">{preparation}</dd></div><div className="rounded-xl bg-surface-subtle p-3"><dt className="text-ink-muted">اعتبار پیشنهاد</dt><dd className="mt-1 font-black text-ink">{numberFormatter.format(draft.validityHours)} ساعت</dd></div></dl>
          {editable ? <div className="mt-5 grid gap-2"><Button type="button" size="lg" onClick={onReview}>بررسی و ارسال پیشنهاد</Button><Button type="button" variant="secondary" onClick={onSave}>ذخیره پیش‌نویس</Button></div> : null}
        </CardContent>
      </Card>
    </aside>
  );
}

function SummaryRow({ label, value, strong = false, tone }: { label: string; value: string; strong?: boolean; tone?: "success" }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-ink-muted">{label}</dt><dd className={cn(strong ? "font-black text-ink" : "font-bold text-ink", tone === "success" && "text-success")}>{value}</dd></div>;
}

function SentProposalState({ request }: { request: SupplierPurchaseRequest }) {
  const proposal = request.previousProposal!;
  return (
    <div className="space-y-5 pb-6">
      <nav aria-label="مسیر صفحه" className="flex items-center gap-1.5 text-xs text-ink-muted"><Link href="/supplier">داشبورد</Link><IconChevronLeft size={14} /><Link href="/supplier/requests">درخواست‌های خرید</Link><IconChevronLeft size={14} /><span dir="ltr">#{request.id}</span></nav>
      <header><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-black text-ink">جزئیات درخواست خرید</h1><Badge variant="success">پیشنهاد ارسال‌شده</Badge></div><p dir="ltr" className="mt-2 w-fit text-xs font-black text-ink">#{request.id}</p></header>
      <Card className="mx-auto max-w-3xl">
        <CardHeader><div><CardTitle>پیشنهاد شما</CardTitle><CardDescription>این پیشنهاد برای خریدار ارسال شده و اکنون در انتظار بررسی است.</CardDescription></div><Badge variant="warning">{proposal.status}</Badge></CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2"><OverviewItem icon={IconBuildingStore} label="مبلغ" value={formatToman(proposal.amount)} /><OverviewItem icon={IconPackage} label="اقلام" value={`${numberFormatter.format(proposal.itemCount)} قلم`} /><OverviewItem icon={IconTruckDelivery} label="زمان تحویل" value={proposal.delivery} /><OverviewItem icon={IconClock} label="اعتبار" value={proposal.validity} /></dl>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row"><Link href={`/supplier/proposals/${proposal.id}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control bg-primary px-4 text-sm font-bold text-white">مشاهده پیشنهاد</Link><Button type="button" variant="secondary" className="flex-1" disabled={!proposal.editable}>ویرایش پیشنهاد</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
