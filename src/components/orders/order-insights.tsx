import Image from "next/image";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconMessageCircle,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { activeOrders, attentionItems } from "@/data/orders";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type OrderInsightsProps = {
  onOpenOrder: (orderId: string) => void;
};

export function OrderInsights({ onOpenOrder }: OrderInsightsProps) {
  return (
    <section aria-label="پیگیری و اقدام‌های سفارش" className="mt-4 grid gap-4 xl:grid-cols-[minmax(16rem,.78fr)_minmax(25rem,1.12fr)_minmax(18rem,.9fr)]">
      <AttentionPanel onOpenOrder={onOpenOrder} />
      <ActiveOrders onOpenOrder={onOpenOrder} />
      <AssistantCard />
    </section>
  );
}

function AttentionPanel({ onOpenOrder }: OrderInsightsProps) {
  return (
    <Card className="overflow-hidden shadow-none">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-warning-soft text-warning">
            <IconAlertTriangle size={18} aria-hidden="true" />
          </span>
          <h2 className="text-sm font-black text-ink">نیاز به اقدام</h2>
        </div>
        <button type="button" className="inline-flex items-center gap-1 text-[11px] font-black text-primary">
          مشاهده همه
          <IconArrowLeft size={14} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-2.5 p-3">
        {attentionItems.map((item) => (
          <article key={item.title} className="rounded-xl border border-line p-3">
            <div className="flex items-start gap-2">
              <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-full", item.tone === "warning" ? "bg-warning-soft text-warning" : "bg-accent-soft text-warning")}>
                <span className="text-base font-black">!</span>
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-black text-ink">{item.title}</h3>
                <p className="mt-1 text-[10px] leading-5 text-ink-muted">{item.description}</p>
              </div>
            </div>
            <button type="button" onClick={() => onOpenOrder(item.orderId)} className="mt-2 min-h-8 rounded-lg border border-primary/35 px-2.5 text-[10px] font-black text-primary transition hover:bg-primary-soft">
              {item.action}
            </button>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ActiveOrders({ onOpenOrder }: OrderInsightsProps) {
  return (
    <Card className="overflow-hidden shadow-none">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary">
            <IconTruckDelivery size={18} aria-hidden="true" />
          </span>
          <h2 className="text-sm font-black text-ink">وضعیت سفارش‌های فعال</h2>
        </div>
        <button type="button" className="inline-flex items-center gap-1 text-[11px] font-black text-primary">
          مشاهده همه
          <IconArrowLeft size={14} aria-hidden="true" />
        </button>
      </div>
      <div className="divide-y divide-line px-3">
        {activeOrders.map((order) => (
          <button key={order.id} type="button" onClick={() => onOpenOrder(order.id)} className="grid w-full gap-3 py-3 text-right sm:grid-cols-[6rem_1fr] sm:items-center">
            <div>
              <span className="block text-xs font-black text-ink">{order.id}</span>
              <span className="mt-0.5 block text-[10px] text-ink-muted">{order.supplier}</span>
            </div>
            <ProgressSteps activeStep={order.step} />
          </button>
        ))}
      </div>
    </Card>
  );
}

function ProgressSteps({ activeStep }: { activeStep: number }) {
  const steps = ["تأیید سفارش", "بسته‌بندی", "ارسال"];
  return (
    <div className="grid grid-cols-3" aria-label={`مرحله ${activeStep + 1} از ۳`}>
      {steps.map((step, index) => (
        <div key={step} className="relative text-center">
          {index < steps.length - 1 ? <span className={cn("absolute right-1/2 top-3 h-0.5 w-full", index < activeStep ? "bg-primary" : "bg-line")} /> : null}
          <span className={cn("relative mx-auto grid size-6 place-items-center rounded-full border-2 bg-white", index <= activeStep ? "border-primary text-primary" : "border-line text-ink-muted")}>
            {index < activeStep ? <IconCheck size={13} stroke={3} aria-hidden="true" /> : index === activeStep ? <IconTruckDelivery size={13} aria-hidden="true" /> : null}
          </span>
          <span className={cn("relative mt-1 block text-[9px]", index <= activeStep ? "font-bold text-primary" : "text-ink-muted")}>{step}</span>
        </div>
      ))}
    </div>
  );
}

function AssistantCard() {
  return (
    <Card className="relative min-h-56 overflow-hidden border-primary/10 bg-primary-soft/65 p-4 shadow-none">
      <div className="relative z-10 max-w-[60%]">
        <h2 className="text-lg font-black text-primary">روشا</h2>
        <p className="mt-1 text-xs font-bold leading-6 text-ink-muted">همراه شما در مدیریت سفارش‌ها</p>
        <p className="mt-3 text-[11px] leading-6 text-ink-muted">اگر درباره سفارش‌ها، تحویل یا تأمین‌کنندگان سوالی دارید، من اینجا هستم.</p>
        <button type="button" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/30 bg-white px-3 text-xs font-black text-primary transition hover:bg-primary-soft">
          <IconMessageCircle size={17} aria-hidden="true" />
          مشاوره با روشا
        </button>
      </div>
      <div className="absolute -bottom-8 -left-5 h-[108%] w-[57%] overflow-hidden">
        <Image src="/images/rosha-orders.png" alt="روشا، راهنمای سفارش" fill sizes="280px" className="object-contain object-bottom" />
      </div>
    </Card>
  );
}
