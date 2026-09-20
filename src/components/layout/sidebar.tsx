"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconFileText,
  IconBox,
  IconShoppingCart,
  IconReceipt2,
  IconChartBar,
  IconUsers,
  IconBell,
  IconSettings,
  IconMessageCircle,
} from "@tabler/icons-react";
import { BrandLogo } from "@/components/brand/brand-logo";

const sidebarLinks = [
  { label: "داشبورد", href: "/dashboard", icon: IconHome },
  { label: "درخواست مواد اولیه", href: "/requests", icon: IconFileText },
  { label: "کالاها", href: "/products", icon: IconBox },
  {
    label: "سبد خرید",
    href: "/cart",
    icon: IconShoppingCart,
    badge: true, // For the red dot
  },
  { label: "سفارش‌ها", href: "/orders", icon: IconReceipt2 },
  { label: "هزینه خرید", href: "/expenses", icon: IconChartBar },
  { label: "تأمین‌کنندگان", href: "/suppliers", icon: IconUsers },
  { label: "اعلان‌ها", href: "/notifications", icon: IconBell },
  { label: "تنظیمات", href: "/settings", icon: IconSettings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 border-l border-brand-border bg-white px-4 py-6 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="mb-10 px-4">
          <Link href="/">
            <BrandLogo />
          </Link>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-sky text-brand-blue"
                    : "text-brand-muted hover:bg-brand-neutral hover:text-brand-navy"
                }`}
              >
                <link.icon
                  size={20}
                  className={isActive ? "text-brand-blue" : "text-brand-muted"}
                />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="absolute left-6 top-4 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 rounded-2xl bg-brand-sky p-4 text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center text-4xl">
           🦊
        </div>
        <h4 className="mb-1 text-sm font-bold text-brand-blue">
          سوالی دارید؟ روشا اینجاست!
        </h4>
        <p className="mb-4 text-xs text-brand-muted">
          راهنمای خرید و انتخاب
        </p>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-blue shadow-sm transition hover:bg-gray-50">
          <IconMessageCircle size={18} />
          چت با روشا
        </button>
      </div>
    </aside>
  );
}
