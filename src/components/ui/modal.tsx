"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
  onClose: () => void;
};

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
} as const;

export function Modal({ open, title, description, children, footer, width = "md", onClose }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => panelRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-5">
          <motion.button
            type="button"
            aria-label="بستن پنجره"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[4px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              "relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-[1.15rem] border border-white/80 bg-white shadow-float outline-none sm:max-h-[calc(100dvh-2.5rem)]",
              widths[width],
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-5">
              <div>
                <h2 id={titleId} className="text-base font-black text-ink sm:text-lg">{title}</h2>
                {description ? <p id={descriptionId} className="mt-1 text-xs leading-6 text-ink-muted">{description}</p> : null}
              </div>
              <button
                type="button"
                aria-label="بستن"
                onClick={onClose}
                className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-surface-subtle hover:text-ink"
              >
                <IconX size={20} aria-hidden="true" />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
            {footer ? <footer className="flex flex-col-reverse gap-2 border-t border-line bg-white px-4 py-4 sm:flex-row sm:px-5">{footer}</footer> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
