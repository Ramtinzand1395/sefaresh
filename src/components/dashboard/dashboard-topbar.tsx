"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconBell,
  IconChevronDown,
  IconHelpCircle,
  IconMenu2,
  IconMessageCircle,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { IconButton } from "@/components/ui/icon-button";
import {
  dashboardAccountByRole,
  dashboardSearchByRole,
  type DashboardRole,
} from "@/config/dashboard";
import { cn } from "@/lib/cn";

type DashboardTopbarProps = {
  role?: DashboardRole;
  onOpenNavigation: () => void;
};

export function DashboardTopbar({ role = "buyer", onOpenNavigation }: DashboardTopbarProps) {
  const account = dashboardAccountByRole[role];
  const search = dashboardSearchByRole[role];
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMobileSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const openMobileSearch = () => {
    setMobileSearchOpen(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-surface-subtle/90 px-3 py-3 backdrop-blur sm:px-4 md:px-5 lg:px-6">
      <div className="mx-auto flex max-w-[1680px] items-center gap-2.5">
        {!mobileSearchOpen ? (
          <IconButton label="باز کردن منو" className="min-[850px]:hidden" onClick={onOpenNavigation}>
            <IconMenu2 size={22} aria-hidden="true" />
          </IconButton>
        ) : null}

        <IconButton
          label="باز کردن جستجو"
          className={cn("sm:hidden", mobileSearchOpen && "hidden")}
          onClick={openMobileSearch}
        >
          <IconSearch size={21} aria-hidden="true" />
        </IconButton>

        <form
          action={search.action}
          role="search"
          className={cn(
            "relative min-w-0 flex-1 lg:mx-3",
            mobileSearchOpen ? "block" : "hidden sm:block",
          )}
        >
          <label htmlFor={`${role}-dashboard-search`} className="sr-only">
            {search.label}
          </label>
          <IconSearch
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
            size={20}
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            id={`${role}-dashboard-search`}
            name="q"
            type="search"
            placeholder={search.placeholder}
            className="h-[3.25rem] w-full rounded-xl border border-line bg-white pr-11 pl-16 text-sm text-ink shadow-[0_4px_20px_rgb(20_43_74_/_0.025)] placeholder:text-ink-muted/70 focus:border-primary focus:outline-none"
          />
          <kbd className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-lg bg-primary-soft px-2 py-1 text-[11px] text-ink-muted md:block">
            Ctrl + K
          </kbd>
          {mobileSearchOpen ? (
            <button
              type="button"
              aria-label="بستن جستجو"
              className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-ink-muted hover:bg-surface-subtle hover:text-ink sm:hidden"
              onClick={() => setMobileSearchOpen(false)}
            >
              <IconX size={19} aria-hidden="true" />
            </button>
          ) : null}
        </form>

        {!mobileSearchOpen ? (
          <>
            {role === "supplier" ? (
              <IconButton label="راهنما" className="hidden size-[3.25rem] rounded-xl lg:grid">
                <IconHelpCircle size={21} aria-hidden="true" />
              </IconButton>
            ) : null}
            <IconButton label="پیام‌ها" className="hidden size-[3.25rem] rounded-xl md:grid">
              <IconMessageCircle size={21} aria-hidden="true" />
            </IconButton>
            <IconButton label="اعلان‌ها، ۳ اعلان خوانده‌نشده" className="size-[3.25rem] rounded-xl">
              <IconBell size={21} aria-hidden="true" />
              <span
                className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-danger text-[10px] font-black text-white"
                aria-hidden="true"
              >
                ۳
              </span>
            </IconButton>

            <details className="group relative">
              <summary
                className="flex min-h-[3.25rem] cursor-pointer list-none items-center gap-2 rounded-xl border border-line bg-white px-1.5 text-right sm:px-2.5"
                aria-label={`پروفایل ${account.userName}`}
              >
                <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-black text-white ring-2 ring-primary-soft">
                  {account.initials}
                </span>
                <span className="hidden xl:block">
                  <strong className="block text-xs font-black text-ink">{account.userName}</strong>
                  <span className="block text-[10px] text-ink-muted">{account.role}</span>
                </span>
                <IconChevronDown
                  size={15}
                  className="hidden text-ink-muted transition group-open:rotate-180 sm:block"
                  aria-hidden="true"
                />
              </summary>
              <div className="absolute left-0 top-14 w-60 rounded-card border border-line bg-white p-3 shadow-float">
                <p className="text-sm font-black text-ink">{account.userName}</p>
                <p className="mt-1 text-xs font-bold text-ink-muted">{account.businessName}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {account.role} · {account.city}
                </p>
                <div className="my-3 h-px bg-line" />
                <p className="text-xs leading-6 text-ink-muted">تنظیمات حساب در مرحله بعد تکمیل می‌شود.</p>
              </div>
            </details>
          </>
        ) : null}
      </div>
    </header>
  );
}
