"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconCheck, IconChecks } from "@tabler/icons-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationList } from "@/components/notifications/notification-list";
import {
  NotificationModals,
  type NotificationModalState,
} from "@/components/notifications/notification-modals";
import {
  notifications as initialNotifications,
  type NotificationFilterTab,
  type NotificationItem,
} from "@/data/notifications";

const normalize = (value: string) => value.trim().toLocaleLowerCase("fa-IR");

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<NotificationModalState>(null);
  const [notice, setNotice] = useState("");
  const reduceMotion = useReducedMotion();

  // ── Derived counts ──
  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  // ── Filtered list ──
  const filteredItems = useMemo(() => {
    const needle = normalize(query);

    return items.filter((n) => {
      // Tab filter
      if (activeTab === "unread" && n.read) return false;
      if (
        activeTab !== "all" &&
        activeTab !== "unread" &&
        n.category !== activeTab
      )
        return false;

      // Search filter
      if (needle) {
        const searchable = normalize(
          `${n.title} ${n.description} ${n.badgeLabel} ${n.source}`,
        );
        if (!searchable.includes(needle)) return false;
      }

      return true;
    });
  }, [activeTab, items, query]);

  const hasFilters = Boolean(query || activeTab !== "all");

  // ── Actions ──
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    showNotice("همه اعلان‌ها خوانده شدند.");
  };

  const toggleRead = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
      );
      const target = items.find((n) => n.id === id);
      showNotice(
        target?.read
          ? "اعلان خوانده‌نشده شد."
          : "اعلان خوانده شد.",
      );
    },
    [items],
  );

  const deleteNotification = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    showNotice("اعلان حذف شد.");
  }, []);

  const openDetail = useCallback((notification: NotificationItem) => {
    // Mark as read when opening
    setItems((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    setModal({ type: "detail", notification });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const resetFilters = () => {
    setQuery("");
    setActiveTab("all");
  };

  return (
    <>
      <PageHeader
        title="اعلان‌ها"
        description="مشاهده آخرین رویدادها و اطلاع‌رسانی‌ها"
        action={
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto"
            disabled={unreadCount === 0}
            onClick={markAllRead}
          >
            <IconChecks size={20} aria-hidden="true" />
            خواندن همه
          </Button>
        }
      />

      <NotificationFilters
        activeTab={activeTab}
        query={query}
        unreadCount={unreadCount}
        onTabChange={setActiveTab}
        onQueryChange={setQuery}
        onReset={resetFilters}
      />

      <NotificationList
        notifications={filteredItems}
        hasFilters={hasFilters}
        onOpenDetail={openDetail}
        onToggleRead={toggleRead}
        onDelete={deleteNotification}
        onReset={resetFilters}
      />

      <NotificationModals
        modal={modal}
        onClose={closeModal}
        onDelete={deleteNotification}
      />

      {/* ── Toast notice ── */}
      <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      <AnimatePresence>
        {notice ? (
          <motion.div
            role="status"
            className="fixed bottom-4 left-1/2 z-[90] flex min-h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-ink px-4 text-xs font-bold text-white shadow-float"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span className="grid size-7 place-items-center rounded-full bg-success text-white">
              <IconCheck size={17} aria-hidden="true" />
            </span>
            {notice}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
