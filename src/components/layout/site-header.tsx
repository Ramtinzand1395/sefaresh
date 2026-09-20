import Link from "next/link";
import { IconMenu2 } from "@tabler/icons-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { mainNavigation } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link href="/" aria-label="صفحه اصلی سفارش">
          <BrandLogo priority />
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-semibold text-brand-muted md:flex"
          aria-label="ناوبری اصلی"
        >
          {mainNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand-blue">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/#suppliers"
            className="rounded-lg border border-brand-blue px-6 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-brand-sky"
          >
            ورود
          </Link>
          <Link
            href="/#suppliers"
            className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1d49b5]"
          >
            شروع خرید
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-brand-border text-brand-navy">
            <IconMenu2 size={23} aria-hidden="true" />
            <span className="sr-only">باز کردن منو</span>
          </summary>
          <nav
            className="absolute left-0 top-14 w-64 rounded-2xl border border-brand-border bg-white p-4 shadow-xl"
            aria-label="ناوبری موبایل"
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-brand-muted hover:bg-brand-sky hover:text-brand-blue"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#suppliers"
              className="mt-2 block rounded-lg bg-brand-blue px-4 py-3 text-center text-sm font-bold text-white"
            >
              شروع خرید
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
