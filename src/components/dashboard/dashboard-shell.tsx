"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // The drawer owns scroll while open and always remains dismissible with Escape.
  useEffect(() => {
    if (!navigationOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavigationOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [navigationOpen]);

  return (
    <div className="min-h-dvh bg-surface-subtle text-ink">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-[14.75rem] border-l border-line lg:block">
        <DashboardSidebar activePath={pathname} />
      </aside>

      <AnimatePresence>
        {navigationOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="بستن منوی ناوبری"
              className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px] lg:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavigationOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="منوی اصلی"
              className="fixed inset-y-0 right-0 z-50 w-[min(19rem,88vw)] border-l border-line shadow-float lg:hidden"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <DashboardSidebar
                activePath={pathname}
                mobile
                onClose={() => setNavigationOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="lg:pr-[14.75rem]">
        <DashboardTopbar onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 md:px-5">{children}</main>
      </div>
    </div>
  );
}
