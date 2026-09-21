"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { IconCalendarTime, IconCheck, IconMapPin, IconPlus, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { CartItem, DeliveryAddress, DeliverySlot } from "@/data/cart";
import { productCategories, products } from "@/data/products";
import { cn } from "@/lib/cn";

export type CartModalState = "catalog" | "address" | "delivery" | "success" | null;

type CartModalsProps = {
  modal: CartModalState;
  items: CartItem[];
  address: DeliveryAddress;
  deliverySlots: DeliverySlot[];
  selectedSlotId: string;
  orderNumber: string;
  onClose: () => void;
  onAddItem: (item: CartItem) => void;
  onSaveAddress: (address: DeliveryAddress) => void;
  onSaveDelivery: (slotId: string) => void;
  onReset: () => void;
};

export function CartModals({ modal, items, address, deliverySlots, selectedSlotId, orderNumber, onClose, onAddItem, onSaveAddress, onSaveDelivery, onReset }: CartModalsProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [draftAddress, setDraftAddress] = useState(address);
  const [draftSlot, setDraftSlot] = useState(selectedSlotId);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const needle = query.trim().toLocaleLowerCase("fa-IR");
    return matchesCategory && (!needle || `${product.name} ${product.description}`.toLocaleLowerCase("fa-IR").includes(needle));
  }), [category, query]);

  return (
    <>
      <Modal open={modal === "catalog"} title="افزودن کالا به سبد" description="کالای مورد نیاز خود را جست‌وجو و به سبد خرید اضافه کنید." width="lg" onClose={onClose}>
        <div className="relative">
          <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" size={19} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="نام کالا یا دسته‌بندی را بنویسید…" className="h-12 w-full rounded-xl border border-line bg-white pr-10 pl-3 text-sm outline-none focus:border-primary" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {productCategories.map((item) => <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={cn("min-h-9 shrink-0 rounded-xl border px-3 text-xs font-bold transition", category === item.id ? "border-primary bg-primary text-white" : "border-line bg-white text-ink-muted hover:border-primary/30")}>{item.label}</button>)}
        </div>
        <div className="mt-4 max-h-[48vh] space-y-2 overflow-y-auto pl-1">
          {visibleProducts.map((product) => {
            const inCart = items.some((item) => item.id === product.id);
            return <div key={product.id} className="flex items-center gap-3 rounded-xl border border-line p-3"><div className="relative size-14 shrink-0 rounded-xl bg-surface-subtle"><Image src={product.image} alt={product.name} fill sizes="56px" className="object-contain p-1" /></div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-black text-ink">{product.name}</h3><p className="mt-1 truncate text-xs text-ink-muted">{product.description}</p></div><Button type="button" size="sm" variant={inCart ? "ghost" : "secondary"} disabled={inCart || !product.available} onClick={() => onAddItem({ id: product.id, name: product.name, description: product.description, image: product.image, unit: product.unit, price: product.price, quantity: 1 })}>{inCart ? <IconCheck size={17} aria-hidden="true" /> : <IconPlus size={17} aria-hidden="true" />}{inCart ? "در سبد" : product.available ? "افزودن" : "ناموجود"}</Button></div>;
          })}
        </div>
      </Modal>

      <Modal open={modal === "address"} title="ویرایش آدرس تحویل" description="آدرس دقیق محل دریافت سفارش را وارد کنید." onClose={onClose} footer={<><Button type="button" variant="secondary" className="flex-1" onClick={onClose}>انصراف</Button><Button type="button" className="flex-1" onClick={() => onSaveAddress(draftAddress)}>ذخیره آدرس</Button></>}>
        <div className="space-y-3">
          <Field label="عنوان آدرس" value={draftAddress.title} onChange={(value) => setDraftAddress((current) => ({ ...current, title: value }))} />
          <div className="grid gap-3 sm:grid-cols-2"><Field label="شهر" value={draftAddress.city} onChange={(value) => setDraftAddress((current) => ({ ...current, city: value }))} /><Field label="خیابان" value={draftAddress.street} onChange={(value) => setDraftAddress((current) => ({ ...current, street: value }))} /></div>
          <Field label="پلاک و واحد" value={draftAddress.details} onChange={(value) => setDraftAddress((current) => ({ ...current, details: value }))} />
          <div className="flex items-start gap-2 rounded-xl bg-primary-soft p-3 text-xs leading-6 text-ink-muted"><IconMapPin size={19} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />این آدرس فقط برای نمایش جریان نمونه استفاده می‌شود و جایی ذخیره نخواهد شد.</div>
        </div>
      </Modal>

      <Modal open={modal === "delivery"} title="انتخاب زمان تحویل" description="تاریخ و بازه زمانی مناسب خود را انتخاب کنید." onClose={onClose} footer={<><Button type="button" variant="secondary" className="flex-1" onClick={onClose}>انصراف</Button><Button type="button" className="flex-1" onClick={() => onSaveDelivery(draftSlot)}>تأیید زمان</Button></>}>
        <div className="grid gap-3 sm:grid-cols-3">
          {deliverySlots.map((slot) => <button key={slot.id} type="button" onClick={() => setDraftSlot(slot.id)} className={cn("rounded-xl border p-4 text-center transition", draftSlot === slot.id ? "border-primary bg-primary-soft text-primary" : "border-line hover:border-primary/35")}><IconCalendarTime className="mx-auto" size={22} aria-hidden="true" /><strong className="mt-2 block text-sm font-black">{slot.day}</strong><span className="mt-1 block text-xs">{slot.date}</span><span className="mt-3 block text-xs font-bold">{slot.time} ({slot.period})</span></button>)}
        </div>
      </Modal>

      <Modal open={modal === "success"} title="درخواست با موفقیت ثبت شد" description={`شماره سفارش ${orderNumber} ثبت شد و برای تأمین‌کنندگان مناسب ارسال می‌شود.`} onClose={onClose} footer={<><Button type="button" variant="secondary" className="flex-1" onClick={onReset}><IconPlus size={18} aria-hidden="true" />ثبت سفارش جدید</Button><Button type="button" className="flex-1" onClick={onClose}>مشاهده درخواست</Button></>}>
        <div className="py-3 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-success text-white shadow-[0_10px_30px_rgb(8_122_85_/_0.25)]"><IconCheck size={42} stroke={2.5} aria-hidden="true" /></span><h3 className="mt-5 text-lg font-black text-ink">همه چیز آماده است!</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-ink-muted">به‌محض دریافت پیشنهادهای تأمین‌کنندگان، از طریق اعلان‌ها به شما خبر می‌دهیم.</p><div className="mt-5 rounded-xl bg-primary-soft p-4 text-sm font-bold text-primary">وضعیت فعلی: در انتظار پیشنهاد تأمین‌کنندگان</div></div>
      </Modal>
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold text-ink"><span className="mb-1.5 block">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-line px-3 text-sm font-normal outline-none focus:border-primary" /></label>;
}
