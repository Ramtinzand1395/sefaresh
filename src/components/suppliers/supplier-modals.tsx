"use client";

import { useState } from "react";
import {
  IconArrowLeft,
  IconClock,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconPhone,
  IconShieldCheck,
  IconShieldCheckFilled,
  IconStarFilled,
  IconTruckDelivery,
  IconUsersGroup,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  suppliers as allSuppliers,
  formatPersianNumber,
  formatToman,
  type SupplierFull,
} from "@/data/suppliers";

// ---------------------------------------------------------------------------
// Modal state union — each variant carries the data it needs
// ---------------------------------------------------------------------------

export type SupplierModalState =
  | { type: "profile"; supplierId: string }
  | { type: "comparison"; supplierIds: string[] }
  | { type: "invite" }
  | { type: "guide" }
  | null;

type SupplierModalsProps = {
  modal: SupplierModalState;
  onClose: () => void;
  onDone: (message: string) => void;
};

/**
 * Renders the active modal based on the discriminated union state.
 * All 4 modal types from the supplier-page design reference.
 */
export function SupplierModals({ modal, onClose, onDone }: SupplierModalsProps) {
  if (!modal) return null;

  switch (modal.type) {
    case "profile":
      return <ProfileModal supplierId={modal.supplierId} onClose={onClose} onDone={onDone} />;
    case "comparison":
      return <ComparisonModal supplierIds={modal.supplierIds} onClose={onClose} onDone={onDone} />;
    case "invite":
      return <InviteModal onClose={onClose} onDone={onDone} />;
    case "guide":
      return <GuideModal onClose={onClose} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 1. پروفایل سریع تأمین‌کننده  (Quick Supplier Profile)
// ---------------------------------------------------------------------------

function ProfileModal({
  supplierId,
  onClose,
  onDone,
}: {
  supplierId: string;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const supplier = allSuppliers.find((s) => s.id === supplierId) ?? allSuppliers[0];
  const Icon = supplier.icon;

  return (
    <Modal
      open
      width="lg"
      title={supplier.name}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            مشاهده پروفایل کامل
          </Button>
          <Button type="button" className="flex-1" onClick={() => onDone(`صفحه کالاهای ${supplier.name} باز شد.`)}>
            مشاهده کالاها
            <IconArrowLeft size={17} aria-hidden="true" />
          </Button>
        </>
      }
    >
      {/* ── Header: icon + name + badges ─────────────────────── */}
      <div className="flex items-start gap-4">
        <span className={cn("grid size-16 shrink-0 place-items-center rounded-2xl", iconBg(supplier.iconTone))}>
          <Icon size={36} stroke={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-ink">{supplier.name}</h3>
            {supplier.verified ? (
              <IconShieldCheckFilled size={20} className="text-primary" aria-label="تأییدشده" />
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">{supplier.categoryLabel}</p>
          <p className="mt-1.5 flex items-center gap-1 text-xs">
            <IconStarFilled size={15} className="text-accent" aria-hidden="true" />
            <strong className="font-black text-ink">
              {new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1 }).format(supplier.score)}
            </strong>
            <span className="text-ink-muted">
              ({formatPersianNumber(supplier.reviewCount)} نظر)
            </span>
          </p>
        </div>
      </div>

      {/* ── Highlight badges row ─────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <HighlightBadge label="کیفیت مناسب" icon={<IconShieldCheck size={18} />} tone="blue" />
        <HighlightBadge label="ارسال به‌موقع" icon={<IconTruckDelivery size={18} />} tone="green" />
        <HighlightBadge label="پشتیبانی خوب" icon={<IconMessageCircle size={18} />} tone="orange" />
        <HighlightBadge label={supplier.responseRate} icon={<IconUsersGroup size={18} />} tone="violet" />
      </div>

      {/* ── Description ──────────────────────────────────────── */}
      <div className="mt-4 grid gap-3 rounded-xl border border-line p-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="font-bold text-ink">دسته‌بندی کالا</dt>
          <dd className="mt-1 text-ink-muted">{supplier.categoryLabel}</dd>
        </div>
        <div>
          <dt className="font-bold text-ink">سال فعالیت</dt>
          <dd className="mt-1 text-ink-muted">از {supplier.yearEstablished}</dd>
        </div>
        <div>
          <dt className="font-bold text-ink">نوع همکاری</dt>
          <dd className="mt-1 text-ink-muted">عمده و خرده</dd>
        </div>
        <div>
          <dt className="font-bold text-ink">روش‌های ارتباط</dt>
          <dd className="mt-1 text-ink-muted">تلفن، واتساپ، تیکت</dd>
        </div>
      </div>

      {/* ── Coverage areas ────────────────────────────────────── */}
      <div className="mt-4 rounded-xl border border-line p-3">
        <h4 className="mb-2 text-xs font-black text-ink">پوشش ارسال</h4>
        <div className="flex flex-wrap gap-1.5">
          {supplier.coverageAreas.map((area) => (
            <Badge key={area} variant="neutral">{area}</Badge>
          ))}
          {supplier.nationalCoverage ? (
            <Badge variant="info">پوشش سراسری</Badge>
          ) : null}
        </div>
      </div>

      {/* ── Sample products table ─────────────────────────────── */}
      {supplier.sampleProducts.length > 0 ? (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-black text-ink">نمونه قیمت کالاها</h4>
            <span className="text-[10px] text-ink-muted">
              مشاهده همه {formatPersianNumber(supplier.sampleProducts.length * 30)} کالا
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-subtle text-ink-muted">
                <tr>
                  <th className="px-3 py-2.5 font-bold">نام کالا</th>
                  <th className="px-3 py-2.5 font-bold">قیمت (تومان)</th>
                  <th className="px-3 py-2.5 font-bold">حداقل سفارش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {supplier.sampleProducts.map((product) => (
                  <tr key={product.name}>
                    <td className="px-3 py-2.5 font-bold text-ink">{product.name}</td>
                    <td className="px-3 py-2.5 text-ink">{formatPersianNumber(product.price)}</td>
                    <td className="px-3 py-2.5 text-ink-muted">
                      {formatPersianNumber(product.minOrder)} {product.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// 2. مقایسه تأمین‌کنندگان  (Supplier Comparison)
// ---------------------------------------------------------------------------

function ComparisonModal({
  supplierIds,
  onClose,
  onDone,
}: {
  supplierIds: string[];
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const compared = allSuppliers.filter((s) => supplierIds.includes(s.id));

  return (
    <Modal
      open
      width="lg"
      title={`مقایسه ${formatPersianNumber(compared.length)} تأمین‌کننده`}
      description="مشخصات و شرایط دو تأمین‌کننده را مقایسه کنید و بهترین گزینه را انتخاب کنید."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="sm:min-w-28" onClick={onClose}>
            بازگشت
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => onDone("تأمین‌کننده انتخاب شد.")}
          >
            مشاهده کالاهای تأمین‌کننده
            <IconArrowLeft size={17} aria-hidden="true" />
          </Button>
        </>
      }
    >
      {compared.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">تأمین‌کننده‌ای برای مقایسه انتخاب نشده.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[500px] text-right text-xs">
            <thead>
              <tr className="bg-surface-subtle">
                <th className="px-3 py-3 font-black text-ink" />
                {compared.map((s) => {
                  const SIcon = s.icon;
                  return (
                    <th key={s.id} className="px-4 py-3 text-center">
                      <span className={cn("mx-auto mb-1 grid size-12 place-items-center rounded-full", iconBg(s.iconTone))}>
                        <SIcon size={26} stroke={1.5} aria-hidden="true" />
                      </span>
                      <span className="block text-sm font-black text-ink">{s.name}</span>
                      <span className="block text-[10px] text-ink-muted">{s.categoryLabel}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <CompareRow label="امتیاز">
                {compared.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1">
                      <IconStarFilled size={14} className="text-accent" aria-hidden="true" />
                      <strong className="font-black text-ink">
                        {new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1 }).format(s.score)}
                      </strong>
                      <span className="text-ink-muted">از ۵</span>
                    </span>
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="حداقل سفارش">
                {compared.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-center font-bold text-ink">
                    {s.minimumOrder}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="زمان تحویل">
                {compared.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-center text-ink">
                    {s.deliveryTime}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="هزینه ارسال">
                {compared.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-center font-bold text-success">
                    {s.minimumOrderValue <= 400_000 ? "رایگان" : "۵۰ هزار تومان"}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="قیمت شیر پرچرب یک لیتری">
                {compared.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-center font-black text-ink">
                    {formatToman(s.sampleProducts[0]?.price ?? 34_000)}
                  </td>
                ))}
              </CompareRow>
              <CompareRow label="پشتیبانی">
                {compared.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-center text-ink-muted">
                    تلفنی و آنلاین
                  </td>
                ))}
              </CompareRow>
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="whitespace-nowrap px-3 py-3 font-bold text-ink-muted">{label}</td>
      {children}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// 3. درخواست تأمین‌کننده جدید  (Invite / Request New Supplier)
// ---------------------------------------------------------------------------

function InviteModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    onDone("درخواست تأمین‌کننده جدید با موفقیت ثبت شد.");
  }

  return (
    <Modal
      open
      title="درخواست تأمین‌کننده جدید"
      description="تأمین‌کننده مورد نظر خود را معرفی کنید تا پس از بررسی با شما در ارتباط باشیم."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="sm:min-w-28" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" form="invite-supplier-form" loading={submitting} className="flex-1">
            ثبت درخواست
            <IconArrowLeft size={17} aria-hidden="true" />
          </Button>
        </>
      }
    >
      <form id="invite-supplier-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Row: name + category */}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="نام تأمین‌کننده" required>
            <input
              required
              placeholder="مثال: لبنیات پاک دام"
              className={inputClassName}
            />
          </FormField>
          <FormField label="دسته‌بندی کالا" required>
            <select required className={inputClassName}>
              <option value="">انتخاب دسته‌بندی</option>
              <option>لبنیات</option>
              <option>مواد پروتئینی</option>
              <option>میوه و سبزیجات</option>
              <option>نوشیدنی</option>
              <option>خشکبار</option>
              <option>بسته‌بندی</option>
            </select>
          </FormField>
        </div>

        {/* Row: phone + city */}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="شماره تماس (اختیاری)">
            <input
              type="tel"
              dir="ltr"
              placeholder="مثال: ۰۹۱۲ ۳۴۵ ۶۷۸۹"
              className={cn(inputClassName, "text-left")}
            />
          </FormField>
          <FormField label="شهر یا محدوده ارسال" required>
            <input
              required
              placeholder="مثال: تهران، کرج، سراسر کشور"
              className={inputClassName}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="توضیحات (اختیاری)">
          <textarea
            rows={3}
            maxLength={500}
            placeholder="اطلاعات بیشتر درباره تأمین‌کننده، نوع کالاها یا هر نکته دیگری..."
            className="w-full resize-none rounded-control border border-line p-3 text-sm leading-6 text-ink placeholder:text-ink-muted/65 focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-left text-[10px] text-ink-muted">۱/۵۰۰</p>
        </FormField>

        {/* Notice */}
        <div className="flex items-start gap-2 rounded-xl border border-warning/20 bg-warning-soft p-3">
          <IconInfoCircle size={18} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
          <p className="text-xs leading-5 text-ink-muted">
            پس از بررسی، نتیجه به شما اطلاع داده می‌شود.
          </p>
        </div>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// 4. راهنمای مقایسه  (Comparison Guide)
// ---------------------------------------------------------------------------

function GuideModal({ onClose }: { onClose: () => void }) {
  const steps = [
    {
      number: "۱",
      title: "تأمین‌کنندگان‌ها را انتخاب کنید",
      description: "چند تأمین‌کننده را از لیست انتخاب کنید.",
      icon: IconUsersGroup,
      tone: "blue" as const,
    },
    {
      number: "۲",
      title: "قیمت و زمان تحویل را مقایسه کنید",
      description: "اطلاعات و شرایط را کنار هم ببینید.",
      icon: IconTruckDelivery,
      tone: "orange" as const,
    },
    {
      number: "۳",
      title: "بهترین گزینه را انتخاب کنید",
      description: "با توجه به امتیاز، قیمت و شرایط خرید بهترین تأمین‌کننده را انتخاب کنید.",
      icon: IconStarFilled,
      tone: "green" as const,
    },
  ];

  const stepTones = {
    blue: "bg-primary-soft text-primary",
    orange: "bg-accent-soft text-warning",
    green: "bg-success-soft text-success",
  };

  return (
    <Modal
      open
      title="مقایسه هوشمند تأمین‌کنندگان"
      description="با مقایسه تأمین‌کنندگان، بهترین قیمت و شرایط را برای خرید خود انتخاب کنید."
      onClose={onClose}
      footer={
        <Button type="button" className="w-full" onClick={onClose}>
          شروع مقایسه
          <IconArrowLeft size={17} aria-hidden="true" />
        </Button>
      }
    >
      <div className="space-y-4">
        {steps.map((step) => {
          const SIcon = step.icon;
          return (
            <div key={step.number} className="flex items-start gap-3 rounded-xl border border-line p-4">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full text-sm font-black", stepTones[step.tone])}>
                {step.number}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-ink">{step.title}</h3>
                <p className="mt-1 text-xs leading-5 text-ink-muted">{step.description}</p>
              </div>
              <SIcon size={22} className="shrink-0 text-ink-muted/50" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const inputClassName =
  "h-11 w-full rounded-control border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-muted/65 focus:border-primary focus:outline-none";

function iconBg(tone: "green" | "orange" | "blue" | "violet") {
  const map = {
    green: "bg-success-soft text-success",
    orange: "bg-accent-soft text-warning",
    blue: "bg-primary-soft text-primary",
    violet: "bg-violet-soft text-violet",
  } as const;
  return map[tone];
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black text-ink">
        {label}
        {required ? <span className="mr-1 text-danger">*</span> : null}
      </span>
      {children}
    </label>
  );
}
