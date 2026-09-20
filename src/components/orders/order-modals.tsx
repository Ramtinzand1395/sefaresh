"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconPackage,
  IconPhone,
  IconSearch,
  IconSend,
  IconShieldCheck,
  IconShoppingBag,
  IconStarFilled,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Order, formatPrice, suppliers } from "@/data/orders";
import { cn } from "@/lib/cn";

export type OrderModalState =
  | { type: "request" }
  | { type: "details"; order: Order }
  | { type: "supplier"; supplierId: string }
  | { type: "comparison" }
  | null;

type OrderModalsProps = {
  modal: OrderModalState;
  onClose: () => void;
  onDone: (message: string) => void;
  onOpenComparison: () => void;
};

export function OrderModals({ modal, onClose, onDone, onOpenComparison }: OrderModalsProps) {
  if (!modal) return null;

  if (modal.type === "request") {
    return <RequestModal onClose={onClose} onDone={onDone} />;
  }

  if (modal.type === "details") {
    return <OrderDetailsModal order={modal.order} onClose={onClose} onDone={onDone} />;
  }

  if (modal.type === "supplier") {
    return <SupplierProfileModal supplierId={modal.supplierId} onClose={onClose} onOpenComparison={onOpenComparison} />;
  }

  return <ComparisonModal onClose={onClose} onDone={onDone} />;
}

function RequestModal({ onClose, onDone }: { onClose: () => void; onDone: (message: string) => void }) {
  const [quantity, setQuantity] = useState(10);

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onDone("درخواست قیمت جدید با موفقیت ثبت شد.");
  }

  return (
    <Modal
      open
      title="درخواست قیمت جدید"
      description="کالای مورد نیاز را مشخص کنید تا پیشنهاد تأمین‌کنندگان را دریافت کنید."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="sm:min-w-28" onClick={onClose}>انصراف</Button>
          <Button type="submit" form="new-price-request" className="flex-1">
            <IconSend size={18} aria-hidden="true" />
            ارسال درخواست قیمت
          </Button>
        </>
      }
    >
      <form id="new-price-request" onSubmit={submitRequest} className="space-y-4">
        <div>
          <label htmlFor="request-product" className="mb-1.5 block text-xs font-black text-ink">جست‌وجوی کالا</label>
          <div className="relative">
            <IconSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} aria-hidden="true" />
            <input id="request-product" defaultValue="شیر پرچرب پگاه" className="h-11 w-full rounded-control border border-line pr-10 pl-3 text-sm text-ink focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-black text-ink">کالای انتخاب‌شده</span>
          <div className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-primary-soft/60 p-2 pl-3">
            <span className="relative size-9 overflow-hidden rounded-lg bg-white"><Image src="/images/products/milk.png" alt="شیر پرچرب پگاه" fill sizes="36px" className="object-cover" /></span>
            <span className="text-xs font-black text-ink">شیر پرچرب پگاه</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-xs font-black text-ink">مقدار مورد نیاز</span>
            <div className="flex h-11 overflow-hidden rounded-control border border-line">
              <button type="button" onClick={() => setQuantity((current) => current + 1)} className="grid w-11 place-items-center text-xl text-primary hover:bg-primary-soft" aria-label="افزایش مقدار">+</button>
              <span className="grid flex-1 place-items-center border-x border-line text-xs font-black text-ink">{new Intl.NumberFormat("fa-IR").format(quantity)} بسته</span>
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="grid w-11 place-items-center text-xl text-primary hover:bg-primary-soft" aria-label="کاهش مقدار">−</button>
            </div>
          </div>
          <div>
            <label htmlFor="request-date" className="mb-1.5 block text-xs font-black text-ink">تاریخ مورد نیاز</label>
            <div className="relative">
              <IconCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" size={17} aria-hidden="true" />
              <input id="request-date" defaultValue="۱۴۰۳/۰۶/۱۵" className="h-11 w-full rounded-control border border-line pr-10 pl-3 text-xs font-bold text-ink focus:border-primary focus:outline-none" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="request-note" className="mb-1.5 block text-xs font-black text-ink">توضیحات درخواست <span className="font-normal text-ink-muted">(اختیاری)</span></label>
          <textarea id="request-note" rows={3} placeholder="مثلاً نوع بسته‌بندی، برند خاص، شرایط تحویل و…" className="w-full resize-none rounded-control border border-line p-3 text-sm leading-6 text-ink placeholder:text-ink-muted/65 focus:border-primary focus:outline-none" />
        </div>
      </form>
    </Modal>
  );
}

function OrderDetailsModal({ order, onClose, onDone }: { order: Order; onClose: () => void; onDone: (message: string) => void }) {
  const SupplierIcon = order.supplierIcon;
  const statusTone = order.status === "shipping" ? "info" : order.status === "pending" || order.status === "preparing" ? "warning" : "success";

  return (
    <Modal
      open
      width="lg"
      title={`جزئیات سفارش ${order.id}`}
      description={`ثبت‌شده در ${order.registeredDate}، ساعت ${order.registeredTime}`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="sm:min-w-28" onClick={onClose}>بستن</Button>
          {order.status === "pending" ? <Button type="button" className="flex-1" onClick={() => onDone(`سفارش ${order.id} تأیید شد.`)}><IconCheck size={18} aria-hidden="true" />تأیید سفارش</Button> : <Button type="button" className="flex-1" onClick={() => onDone(`پیام برای ${order.supplier} آماده شد.`)}><IconMessageCircle size={18} aria-hidden="true" />پیام به تأمین‌کننده</Button>}
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoTile icon={SupplierIcon} label="تأمین‌کننده" value={order.supplier} />
        <InfoTile icon={IconTruckDelivery} label="زمان تحویل" value={`${order.deliveryPrimary}، ${order.deliverySecondary}`} />
        <InfoTile icon={IconShoppingBag} label="مبلغ نهایی" value={`${formatPrice(order.amount)} تومان`} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-surface-subtle p-3">
        <div><p className="text-xs font-black text-ink">وضعیت فعلی سفارش</p><p className="mt-1 text-[10px] text-ink-muted">آخرین به‌روزرسانی امروز، ساعت ۱۰:۴۵</p></div>
        <Badge variant={statusTone}>{order.statusLabel}</Badge>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <div className="flex items-center justify-between bg-surface-subtle px-4 py-3"><h3 className="text-xs font-black text-ink">اقلام سفارش</h3><span className="text-[10px] font-bold text-ink-muted">{new Intl.NumberFormat("fa-IR").format(order.products.length)} قلم</span></div>
        <div className="divide-y divide-line">
          {order.products.map((product, index) => (
            <div key={`${product.name}-${index}`} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-xs">
              <div><p className="font-bold text-ink">{product.name}</p><p className="mt-1 text-[10px] text-ink-muted">{product.quantity}</p></div>
              <span className="self-center whitespace-nowrap font-black text-ink">{formatPrice(product.price)} تومان</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function SupplierProfileModal({ supplierId, onClose, onOpenComparison }: { supplierId: string; onClose: () => void; onOpenComparison: () => void }) {
  const supplier = suppliers.find((item) => item.id === supplierId) ?? suppliers[0];
  const SupplierIcon = supplier.icon;

  return (
    <Modal
      open
      title="مشاهده پروفایل تأمین‌کننده"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="flex-1" onClick={onOpenComparison}>مقایسه تأمین‌کنندگان</Button>
          <Button type="button" className="flex-1" onClick={onClose}><IconMessageCircle size={18} aria-hidden="true" />ارسال پیام</Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid size-20 shrink-0 place-items-center rounded-2xl border border-line bg-success-soft text-success">
          <SupplierIcon size={44} stroke={1.6} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black text-ink">{supplier.name}</h3><IconShieldCheck size={18} className="text-primary" aria-label="تأییدشده" /><Badge variant="success">فعال</Badge></div>
          <div className="mt-1 flex items-center gap-1 text-xs"><IconStarFilled size={15} className="text-accent" aria-hidden="true" /><strong className="text-ink">{supplier.score}</strong><span className="text-ink-muted">({supplier.reviews})</span></div>
          <p className="mt-2 text-xs leading-6 text-ink-muted">{supplier.description}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">{supplier.tags.map((tag) => <Badge key={tag} variant="info">{tag}</Badge>)}</div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <InfoTile icon={IconClock} label="زمان تحویل" value={supplier.delivery} compact />
        <InfoTile icon={IconShoppingBag} label="حداقل سفارش" value={supplier.minimumOrder} compact />
        <InfoTile icon={IconShieldCheck} label="نرخ پاسخ‌گویی" value={supplier.responseRate} compact />
      </div>

      <div className="mt-4 grid gap-2 rounded-xl border border-line p-3 text-xs sm:grid-cols-2">
        <span className="flex items-center gap-2 text-ink-muted"><IconMapPin size={16} className="text-primary" aria-hidden="true" />پوشش: {supplier.city}</span>
        <span className="flex items-center gap-2 text-ink-muted" dir="ltr"><IconPhone size={16} className="text-primary" aria-hidden="true" />{supplier.phone}</span>
        <span className="flex items-center gap-2 text-ink-muted sm:col-span-2" dir="ltr"><IconMail size={16} className="text-primary" aria-hidden="true" />{supplier.email}</span>
      </div>
    </Modal>
  );
}

function ComparisonModal({ onClose, onDone }: { onClose: () => void; onDone: (message: string) => void }) {
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0].id);
  const selected = suppliers.find((supplier) => supplier.id === selectedSupplier) ?? suppliers[0];

  return (
    <Modal
      open
      width="lg"
      title="مقایسه تأمین‌کنندگان"
      description="مقایسه برای: شیر پرچرب پگاه ۱ لیتری"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" className="sm:min-w-32" onClick={onClose}>جزئیات بیشتر</Button>
          <Button type="button" className="flex-1" onClick={() => onDone(`${selected.name} برای درخواست انتخاب شد.`)}><IconCheck size={18} aria-hidden="true" />انتخاب تأمین‌کننده</Button>
        </>
      }
    >
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[620px] text-right text-xs">
          <thead className="bg-surface-subtle text-ink-muted">
            <tr><th className="px-3 py-3 font-bold">تأمین‌کننده</th><th className="px-3 py-3 font-bold">قیمت واحد</th><th className="px-3 py-3 font-bold">هزینه ارسال</th><th className="px-3 py-3 font-bold">زمان تحویل</th><th className="px-3 py-3 font-bold">امتیاز</th><th className="px-3 py-3 font-bold">انتخاب</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {suppliers.slice(0, 3).map((supplier, index) => {
              const SupplierIcon = supplier.icon;
              const selectedRow = selectedSupplier === supplier.id;
              return (
                <tr key={supplier.id} className={cn(selectedRow && "bg-success-soft/60")}>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-white text-success shadow-sm"><SupplierIcon size={20} aria-hidden="true" /></span><div><strong className="block text-ink">{supplier.name}</strong>{index === 0 ? <span className="mt-0.5 block text-[9px] font-black text-success">بهترین انتخاب</span> : null}</div></div></td>
                  <td className="px-3 py-3 font-black text-ink">{formatPrice(supplier.price)} <span className="font-normal text-ink-muted">تومان</span></td>
                  <td className={cn("px-3 py-3 font-bold", supplier.shipping === 0 ? "text-success" : "text-ink")}>{supplier.shipping === 0 ? "رایگان" : `${formatPrice(supplier.shipping)} تومان`}</td>
                  <td className="px-3 py-3 text-ink">{supplier.deliveryDays}</td>
                  <td className="px-3 py-3"><span className="inline-flex items-center gap-1 font-black text-ink"><IconStarFilled size={14} className="text-accent" aria-hidden="true" />{supplier.score}</span></td>
                  <td className="px-3 py-3"><input type="radio" name="supplier" value={supplier.id} checked={selectedRow} onChange={() => setSelectedSupplier(supplier.id)} className="size-4 accent-primary" aria-label={`انتخاب ${supplier.name}`} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

function InfoTile({ icon: Icon, label, value, compact = false }: { icon: typeof IconPackage; label: string; value: string; compact?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface-subtle", compact ? "p-3" : "p-3.5")}>
      <span className="flex items-center gap-2 text-[10px] font-bold text-ink-muted"><Icon size={16} className="text-primary" aria-hidden="true" />{label}</span>
      <strong className="mt-1.5 block text-xs text-ink">{value}</strong>
    </div>
  );
}
