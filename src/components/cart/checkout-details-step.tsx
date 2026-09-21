import Image from "next/image";
import { IconBuildingStore, IconCalendarTime, IconCreditCard, IconEdit, IconInfoCircle, IconMapPin, IconReceipt } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import type { DeliveryAddress, DeliverySlot } from "@/data/cart";
import { cn } from "@/lib/cn";

type CheckoutDetailsStepProps = {
  address: DeliveryAddress;
  slots: DeliverySlot[];
  selectedSlotId: string;
  paymentMethod: "after-approval" | "online";
  onEditAddress: () => void;
  onOpenDelivery: () => void;
  onSelectSlot: (id: string) => void;
  onSelectPayment: (method: "after-approval" | "online") => void;
};

export function CheckoutDetailsStep({ address, slots, selectedSlotId, paymentMethod, onEditAddress, onOpenDelivery, onSelectSlot, onSelectPayment }: CheckoutDetailsStepProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><IconMapPin className="text-primary" size={24} aria-hidden="true" /><h2 className="text-lg font-black text-ink">آدرس تحویل</h2></div>
          <button type="button" onClick={onEditAddress} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-xs font-black text-primary transition hover:bg-primary-soft"><IconEdit size={17} aria-hidden="true" />ویرایش</button>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary-soft/45 p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm"><IconBuildingStore size={22} aria-hidden="true" /></span>
          <div><h3 className="font-black text-ink">{address.title}</h3><p className="mt-1 text-xs leading-6 text-ink-muted">{address.city}، {address.street}، {address.details}</p><span className="mt-2 inline-flex rounded-full bg-success-soft px-2.5 py-1 text-[10px] font-black text-success">آدرس پیش‌فرض</span></div>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><div className="flex items-center gap-2"><IconCalendarTime className="text-primary" size={24} aria-hidden="true" /><h2 className="text-lg font-black text-ink">زمان تحویل</h2></div><p className="mt-1 text-xs text-ink-muted">زمان پیشنهادی تحویل را انتخاب کنید.</p></div>
          <button type="button" onClick={onOpenDelivery} className="hidden min-h-10 rounded-xl border border-line px-3 text-xs font-black text-primary transition hover:bg-primary-soft sm:inline-flex sm:items-center">نمایش همه</button>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {slots.map((slot) => (
            <button key={slot.id} type="button" onClick={() => onSelectSlot(slot.id)} className={cn("flex min-h-20 items-center gap-3 rounded-xl border p-3 text-right transition", selectedSlotId === slot.id ? "border-primary bg-primary-soft text-primary shadow-[0_0_0_1px_rgb(36_87_214_/_0.08)]" : "border-line bg-white text-ink hover:border-primary/35")}>
              <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border", selectedSlotId === slot.id ? "border-[5px] border-primary bg-white" : "border-line bg-white")} />
              <span><strong className="block text-xs font-black">{slot.day}، {slot.date}</strong><span className="mt-1 block text-[11px]">ساعت {slot.time} · {slot.period}</span></span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2"><IconCreditCard className="text-primary" size={24} aria-hidden="true" /><div><h2 className="text-lg font-black text-ink">روش پرداخت</h2><p className="mt-1 text-xs text-ink-muted">روش پرداخت مورد نظر خود را انتخاب کنید.</p></div></div>
        <div className="grid gap-2 sm:grid-cols-2">
          <PaymentChoice active={paymentMethod === "after-approval"} title="پرداخت پس از تأیید تأمین‌کننده" description="پس از نهایی شدن قیمت و موجودی" icon={<IconReceipt size={22} aria-hidden="true" />} onClick={() => onSelectPayment("after-approval")} />
          <PaymentChoice active={paymentMethod === "online"} title="پرداخت آنلاین" description="پرداخت امن از طریق درگاه بانکی" icon={<IconCreditCard size={22} aria-hidden="true" />} onClick={() => onSelectPayment("online")} />
        </div>
      </Card>

      <div className="relative flex min-h-24 items-start gap-3 overflow-hidden rounded-card border border-primary/10 bg-primary-soft p-4 text-primary sm:pl-32">
        <IconInfoCircle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div><strong className="text-sm font-black">بعد از تأیید، مقایسه تأمین‌کنندگان آغاز می‌شود.</strong><p className="mt-1 text-xs leading-6 text-ink-muted">سفارش شما برای تأمین‌کنندگان ارسال می‌شود و بهترین پیشنهادها در اختیارتان قرار می‌گیرد.</p></div>
        <Image src="/images/rosha-orders.png" alt="روشا، راهنمای سفارش" width={112} height={140} className="absolute bottom-[-2.5rem] left-3 hidden h-32 w-24 object-contain object-top sm:block" />
      </div>
    </div>
  );
}

function PaymentChoice({ active, title, description, icon, onClick }: { active: boolean; title: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex min-h-20 items-center gap-3 rounded-xl border p-3 text-right transition", active ? "border-primary bg-primary-soft text-primary" : "border-line bg-white text-ink hover:border-primary/35")}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm">{icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-xs font-black sm:text-sm">{title}</strong><span className="mt-1 block text-[11px] text-ink-muted">{description}</span></span>
      <span className={cn("size-5 shrink-0 rounded-full border", active ? "border-[5px] border-primary bg-white" : "border-line bg-white")} />
    </button>
  );
}
