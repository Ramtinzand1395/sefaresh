"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import type { DashboardRole } from "@/config/dashboard";
import { cn } from "@/lib/cn";

type DashboardShellProps = {
  children: ReactNode;
  role?: DashboardRole;
};

export function DashboardShell({ children, role = "buyer" }: DashboardShellProps) {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 hidden border-l border-line transition-[width] duration-200 min-[850px]:block",
          sidebarCollapsed ? "w-[5.25rem]" : "w-[15.5rem]",
        )}
      >
        <DashboardSidebar
          activePath={pathname}
          role={role}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        />
      </aside>

      <AnimatePresence>
        {navigationOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="بستن منوی ناوبری"
              className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px] min-[850px]:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavigationOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="منوی اصلی"
              className="fixed inset-y-0 right-0 z-50 w-[min(19rem,88vw)] border-l border-line shadow-float min-[850px]:hidden"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <DashboardSidebar
                activePath={pathname}
                role={role}
                mobile
                onClose={() => setNavigationOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div
        className={cn(
          "transition-[padding] duration-200",
          sidebarCollapsed ? "min-[850px]:pr-[5.25rem]" : "min-[850px]:pr-[15.5rem]",
        )}
      >
        <DashboardTopbar role={role} onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="mx-auto w-full max-w-[1680px] px-3 py-4 sm:px-4 md:px-5 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
