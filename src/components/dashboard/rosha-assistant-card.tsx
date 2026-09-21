import Image from "next/image";
import { IconMessageCircle } from "@tabler/icons-react";
import type { DashboardRole } from "@/config/dashboard";
import { cn } from "@/lib/cn";

type RoshaAssistantCardProps = {
  role: DashboardRole;
  collapsed?: boolean;
};

export function RoshaAssistantCard({ role, collapsed = false }: RoshaAssistantCardProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        aria-label="گفت‌وگو با روشا، دستیار هوشمند سفارش"
        title="روشا، دستیار هوشمند سفارش"
        className="mx-auto grid size-12 place-items-center overflow-hidden rounded-2xl border border-primary/15 bg-primary-soft transition hover:border-primary/35"
      >
        <Image
          src="/images/rosha-orders.png"
          alt=""
          width={48}
          height={48}
          className="size-12 scale-125 object-cover object-top"
        />
      </button>
    );
  }

  if (role === "supplier") {
    return (
      <div className="rounded-card border border-primary/10 bg-primary-soft/70 p-3">
        <div className="flex items-center gap-2.5">
          <div className="size-12 shrink-0 overflow-hidden rounded-full bg-white">
            <Image
              src="/images/rosha-orders.png"
              alt="روشا، دستیار هوشمند سفارش"
              width={48}
              height={48}
              className="size-12 scale-125 object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-primary">روشا</p>
            <p className="truncate text-[10px] leading-5 text-ink-muted">دستیار هوشمند سفارش</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-2.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-2 text-xs font-black text-primary transition hover:border-primary/40"
        >
          <IconMessageCircle size={17} aria-hidden="true" />
          سؤالت رو از روشا بپرس
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-card border border-primary/10 bg-primary-soft/70 p-4 pt-16 text-center">
      <div className="absolute -top-8 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full bg-white">
        <Image
          src="/images/rosha-orders.png"
          alt="روشا، راهنمای سفارش"
          fill
          sizes="96px"
          className="scale-[1.35] object-cover object-top"
        />
      </div>
      <p className="mt-1 text-sm font-black leading-6 text-primary">
        سوالی داری؟
        <br />
        روشا اینجاست!
      </p>
      <p className="mt-1 text-[10px] leading-5 text-ink-muted">راهنمای خرید و انتخاب</p>
      <button
        type="button"
        className={cn(
          "mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white text-xs font-black text-primary transition",
          "hover:border-primary/40",
        )}
      >
        <IconMessageCircle size={17} aria-hidden="true" />
        چت با روشا
      </button>
    </div>
  );
}
