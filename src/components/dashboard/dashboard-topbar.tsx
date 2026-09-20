import {
  IconBell,
  IconChevronDown,
  IconMenu2,
  IconMessageCircle,
  IconSearch,
} from "@tabler/icons-react";
import { dashboardAccount } from "@/config/dashboard";
import { IconButton } from "@/components/ui/icon-button";

type DashboardTopbarProps = {
  onOpenNavigation: () => void;
};

export function DashboardTopbar({ onOpenNavigation }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-surface-subtle/90 px-3 py-3 backdrop-blur sm:px-4 md:px-5">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2.5">
        <IconButton label="باز کردن منو" className="lg:hidden" onClick={onOpenNavigation}>
          <IconMenu2 size={22} aria-hidden="true" />
        </IconButton>

        <form action="/dashboard" role="search" className="relative min-w-0 flex-1 lg:mx-3">
          <label htmlFor="dashboard-search" className="sr-only">
            جست‌وجو در کالاها، تأمین‌کنندگان و سفارش‌ها
          </label>
          <IconSearch
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
            size={20}
            aria-hidden="true"
          />
          <input
            id="dashboard-search"
            name="q"
            type="search"
            placeholder="جست‌وجوی کالا، تأمین‌کننده، سفارش…"
            className="h-[3.25rem] w-full rounded-xl border border-line bg-white pr-11 pl-4 text-sm text-ink shadow-[0_4px_20px_rgb(20_43_74_/_0.025)] placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
          />
          <kbd className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-lg bg-primary-soft px-2 py-1 text-[11px] text-ink-muted md:block">
            Ctrl + K
          </kbd>
        </form>

        <IconButton label="پیام‌ها" className="hidden size-[3.25rem] rounded-xl sm:grid">
          <IconMessageCircle size={21} aria-hidden="true" />
        </IconButton>
        <IconButton label="اعلان‌ها" className="size-[3.25rem] rounded-xl">
          <IconBell size={21} aria-hidden="true" />
          <span className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-danger text-[10px] font-black text-white">
            ۳
          </span>
        </IconButton>

        <details className="group relative hidden sm:block">
          <summary className="flex min-h-[3.25rem] cursor-pointer list-none items-center gap-2 rounded-xl border border-line bg-white px-2.5 text-right">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-black text-white ring-2 ring-primary-soft">
              ک‌ل
            </span>
            <span className="hidden xl:block">
              <strong className="block text-xs font-black text-ink">{dashboardAccount.businessName}</strong>
              <span className="block text-[10px] text-ink-muted">{dashboardAccount.role}</span>
            </span>
            <IconChevronDown size={15} className="text-ink-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="absolute left-0 top-14 w-56 rounded-card border border-line bg-white p-3 shadow-float">
            <p className="text-sm font-black text-ink">{dashboardAccount.businessName}</p>
            <p className="mt-1 text-xs text-ink-muted">{dashboardAccount.role} · {dashboardAccount.city}</p>
            <div className="my-3 h-px bg-line" />
            <p className="text-xs leading-6 text-ink-muted">تنظیمات حساب در مرحله بعد تکمیل می‌شود.</p>
          </div>
        </details>
      </div>
    </header>
  );
}
