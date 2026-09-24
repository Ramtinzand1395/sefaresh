"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconCheck,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "@/data/notifications";
import { cn } from "@/lib/cn";

type NotificationCardProps = {
  notification: NotificationItem;
  onOpenDetail: (notification: NotificationItem) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationCard({
  notification,
  onOpenDetail,
  onToggleRead,
  onDelete,
}: NotificationCardProps) {
  const Icon = notification.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const toneClasses = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    info: "bg-primary-soft text-primary",
    violet: "bg-violet-soft text-violet",
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-card border p-4 transition-colors sm:gap-4 sm:p-5",
        notification.read
          ? "border-line bg-white"
          : "border-primary/20 bg-primary-soft/30",
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuOpen(true);
      }}
    >
      {/* ── Unread indicator ── */}
      {!notification.read ? (
        <span
          className="absolute right-3 top-3 size-2.5 rounded-full bg-primary sm:right-4 sm:top-4"
          aria-label="خوانده‌نشده"
        />
      ) : null}

      {/* ── Icon ── */}
      <span
        className={cn(
          "mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl sm:size-12",
          toneClasses[notification.tone],
        )}
      >
        <Icon size={22} stroke={1.8} aria-hidden="true" />
      </span>

      {/* ── Content ── */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-sm font-black text-ink">{notification.title}</h3>
          <span className="whitespace-nowrap text-[11px] text-ink-muted">
            {notification.timeLabel}
          </span>
        </div>

        <p className="mt-1 text-xs leading-6 text-ink-muted">
          {notification.description}
        </p>

        {/* ── Actions row ── */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant={notification.badgeTone}>{notification.badgeLabel}</Badge>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenDetail(notification)}
          >
            {notification.actionLabel}
          </Button>

          {notification.secondaryActionLabel ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenDetail(notification)}
            >
              {notification.secondaryActionLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── Context menu trigger (three-dot) ── */}
      <div className="relative shrink-0">
        <button
          ref={triggerRef}
          type="button"
          aria-label="منوی بیشتر"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="grid size-9 place-items-center rounded-xl text-ink-muted opacity-0 transition hover:bg-surface-subtle hover:text-ink focus:opacity-100 group-hover:opacity-100"
        >
          <IconDots size={18} aria-hidden="true" />
        </button>

        {/* ── Context menu dropdown ── */}
        {menuOpen ? (
          <div
            ref={menuRef}
            role="menu"
            className="absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-card border border-line bg-white shadow-float"
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-ink transition hover:bg-surface-subtle"
              onClick={() => {
                onToggleRead(notification.id);
                setMenuOpen(false);
              }}
            >
              <IconCheck size={17} className="text-primary" aria-hidden="true" />
              {notification.read
                ? "علامت‌گذاری به‌عنوان خوانده‌نشده"
                : "علامت‌گذاری به‌عنوان خوانده‌شده"}
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-danger transition hover:bg-danger-soft"
              onClick={() => {
                onDelete(notification.id);
                setMenuOpen(false);
              }}
            >
              <IconTrash size={17} aria-hidden="true" />
              حذف اعلان
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
