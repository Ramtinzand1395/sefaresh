"use client";

import { IconSearch, IconBell, IconChevronDown } from "@tabler/icons-react";
import Image from "next/image";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-brand-border bg-white px-8">
      {/* Search Bar */}
      <div className="flex w-full max-w-2xl items-center rounded-xl border border-brand-border bg-brand-neutral px-4 py-2.5 transition-colors focus-within:border-brand-blue focus-within:bg-white">
        <IconSearch size={20} className="text-brand-muted" />
        <input
          type="text"
          placeholder="جستجوی کالا، برند یا تأمین‌کننده..."
          className="mx-3 w-full bg-transparent text-sm font-medium text-brand-navy outline-none placeholder:text-brand-muted"
        />
        <div className="hidden items-center gap-1 rounded-md border border-brand-border bg-white px-2 py-1 text-xs font-bold text-brand-muted md:flex">
          <span>Ctrl + K</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-xl border border-brand-border bg-white p-2.5 text-brand-muted transition hover:bg-brand-neutral">
          <IconBell size={22} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
            ۲
          </span>
        </button>

        <div className="h-8 w-px bg-brand-border" />

        <button className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-2 text-right transition hover:bg-brand-neutral">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            {/* Using a placeholder avatar color for now */}
            <div className="h-full w-full bg-blue-100 flex items-center justify-center text-xl">
              👨🏻
            </div>
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-bold text-brand-navy">کافه لمیز</span>
            <span className="text-xs font-medium text-brand-muted">مدیر مجموعه</span>
          </div>
          <IconChevronDown size={18} className="text-brand-muted" />
        </button>
      </div>
    </header>
  );
}
