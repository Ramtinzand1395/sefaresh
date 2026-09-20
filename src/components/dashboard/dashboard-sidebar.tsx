import Image from "next/image";
import Link from "next/link";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { dashboardNavigation } from "@/config/dashboard";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/icon-button";

type DashboardSidebarProps = {
  activePath: string;
  mobile?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({ activePath, mobile = false, onClose }: DashboardSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex min-h-[5.5rem] items-center justify-between px-5">
        <Link href="/" aria-label="بازگشت به صفحه اصلی سفارش" onClick={onClose}>
          <BrandLogo className="w-[145px]" priority />
        </Link>
        {mobile ? (
          <IconButton label="بستن منو" className="border-0" onClick={onClose}>
            <IconX size={22} aria-hidden="true" />
          </IconButton>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-2" aria-label="ناوبری داشبورد">
        <ul className="space-y-1">
          {dashboardNavigation.map((item) => {
            const isActive = activePath === item.href;
            const Icon = item.icon;
            const content = (
              <>
                <Icon size={22} stroke={1.8} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      "grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[11px] font-black",
                      isActive ? "bg-white text-primary" : "bg-primary-soft text-primary",
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            return (
              <li key={item.href}>
                {item.implemented ? (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors",
                      isActive
                        ? "bg-[linear-gradient(90deg,#eef5ff,#dcecff)] text-primary after:absolute after:inset-y-1.5 after:right-0 after:w-1 after:rounded-l-full after:bg-primary"
                        : "text-ink-muted hover:bg-surface-subtle hover:text-ink",
                    )}
                  >
                    {content}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title="این بخش در مرحله بعد ساخته می‌شود"
                    className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-bold text-ink-muted/75"
                  >
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <div className="relative overflow-hidden rounded-card border border-primary/10 bg-[linear-gradient(145deg,#f4f9ff,#e8f2ff)] p-4 pt-16 text-center">
          <div className="absolute -top-8 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full bg-white">
            <Image src="/images/rosha-orders.png" alt="روشا، راهنمای سفارش" fill sizes="96px" className="scale-[1.35] object-cover object-top" />
          </div>
          <p className="mt-1 text-sm font-black leading-6 text-primary">سوالی داری؟<br />روشا اینجاست!</p>
          <p className="mt-1 text-[10px] leading-5 text-ink-muted">راهنمای خرید و انتخاب</p>
          <button
            type="button"
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white text-xs font-black text-primary transition hover:border-primary/40"
          >
            <IconMessageCircle size={17} aria-hidden="true" />
            چت با روشا
          </button>
        </div>
      </div>
    </div>
  );
}
