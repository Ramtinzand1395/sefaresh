import Image from "next/image";
import { IconCreditCard, IconFileInvoice, IconInfoCircle, IconReceipt, IconShieldCheck, IconWallet } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type PaymentStepProps = {
  method: "after-approval" | "online";
  gateway: "zarinpal";
  emailInvoice: boolean;
  onSelectMethod: (method: "after-approval" | "online") => void;
  onToggleInvoice: () => void;
};

export function PaymentStep({ method, emailInvoice, onSelectMethod, onToggleInvoice }: PaymentStepProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2"><IconWallet className="text-primary" size={25} aria-hidden="true" /><div><h2 className="text-lg font-black text-ink">روش پرداخت</h2><p className="mt-1 text-xs text-ink-muted">روش نهایی پرداخت سفارش را انتخاب کنید.</p></div></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice active={method === "online"} title="پرداخت آنلاین" description="پرداخت امن از طریق درگاه بانکی" icon={<IconCreditCard size={23} aria-hidden="true" />} onClick={() => onSelectMethod("online")} />
          <Choice active={method === "after-approval"} title="پرداخت پس از تأیید تأمین‌کننده" description="پس از نهایی شدن قیمت و موجودی" icon={<IconReceipt size={23} aria-hidden="true" />} onClick={() => onSelectMethod("after-approval")} />
        </div>
      </Card>

      {method === "online" ? (
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2"><IconFileInvoice className="text-primary" size={24} aria-hidden="true" /><div><h2 className="text-lg font-black text-ink">انتخاب درگاه پرداخت</h2><p className="mt-1 text-xs text-ink-muted">درگاه پرداخت مورد نظر خود را انتخاب کنید.</p></div></div>
          <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-primary bg-primary-soft/65 p-4 text-right">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm"><Image src="/images/payment-zarinpal.png" alt="نشان درگاه زرین‌پال" fill sizes="48px" className="object-contain p-1.5" /></span>
            <span className="min-w-0 flex-1"><strong className="block font-black text-ink">درگاه پرداخت امن زرین‌پال</strong><span className="mt-1 block text-xs text-ink-muted">پرداخت امن و سریع از طریق درگاه بانکی زرین‌پال</span></span>
            <span className="size-5 shrink-0 rounded-full border-[5px] border-primary bg-white" />
          </button>
        </Card>
      ) : null}

      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3"><IconFileInvoice className="mt-0.5 shrink-0 text-primary" size={23} aria-hidden="true" /><div><h2 className="text-sm font-black text-ink">دریافت فاکتور و رسید پرداخت</h2><p className="mt-1 text-xs leading-6 text-ink-muted">پس از تکمیل سفارش، فاکتور رسمی و رسید برای شما ایمیل شود.</p></div></div>
          <button type="button" role="switch" aria-checked={emailInvoice} onClick={onToggleInvoice} className={cn("relative h-7 w-12 shrink-0 rounded-full transition", emailInvoice ? "bg-primary" : "bg-slate-300")}><span className={cn("absolute top-1 size-5 rounded-full bg-white shadow-sm transition", emailInvoice ? "left-1" : "left-6")} /></button>
        </div>
      </Card>

      <div className="relative flex min-h-24 items-start gap-3 overflow-hidden rounded-card border border-primary/10 bg-primary-soft p-4 text-primary sm:pl-32">
        {method === "online" ? <IconShieldCheck size={24} className="mt-0.5 shrink-0" aria-hidden="true" /> : <IconInfoCircle size={24} className="mt-0.5 shrink-0" aria-hidden="true" />}
        <div><strong className="text-sm font-black">{method === "online" ? "پرداخت شما با امنیت کامل انجام می‌شود." : "فعلاً مبلغی از شما دریافت نمی‌شود."}</strong><p className="mt-1 text-xs leading-6 text-ink-muted">{method === "online" ? "اطلاعات بانکی شما فقط در درگاه امن بانک وارد می‌شود." : "پس از بررسی موجودی و قیمت، لینک پرداخت برای شما ارسال خواهد شد."}</p></div>
        <Image src="/images/rosha-orders.png" alt="روشا، راهنمای سفارش" width={112} height={140} className="absolute bottom-[-2.5rem] left-3 hidden h-32 w-24 object-contain object-top sm:block" />
      </div>
    </div>
  );
}

function Choice({ active, title, description, icon, onClick }: { active: boolean; title: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("flex min-h-24 items-center gap-3 rounded-xl border p-4 text-right transition", active ? "border-primary bg-primary-soft text-primary" : "border-line bg-white text-ink hover:border-primary/35")}><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm">{icon}</span><span className="min-w-0 flex-1"><strong className="block text-sm font-black">{title}</strong><span className="mt-1 block text-xs leading-5 text-ink-muted">{description}</span></span><span className={cn("size-5 shrink-0 rounded-full border", active ? "border-[5px] border-primary bg-white" : "border-line bg-white")} /></button>;
}
