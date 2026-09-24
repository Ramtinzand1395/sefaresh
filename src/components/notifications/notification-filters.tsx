import { IconSearch, IconCalendar, IconX } from "@tabler/icons-react";
import { notificationFilterTabs, type NotificationFilterTab } from "@/data/notifications";
import { cn } from "@/lib/cn";

type NotificationFiltersProps = {
  activeTab: NotificationFilterTab;
  query: string;
  unreadCount: number;
  onTabChange: (tab: NotificationFilterTab) => void;
  onQueryChange: (value: string) => void;
  onReset: () => void;
};

export function NotificationFilters({
  activeTab,
  query,
  unreadCount,
  onTabChange,
  onQueryChange,
  onReset,
}: NotificationFiltersProps) {
  const hasFilters = Boolean(query || activeTab !== "all");

  return (
    <section aria-labelledby="notif-filter-title" className="mt-4 space-y-3">
      {/* ── Tab pills ── */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="فیلتر دسته‌بندی اعلان‌ها">
        {notificationFilterTabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const showBadge = tab.value === "unread" && unreadCount > 0;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "border border-line bg-white text-ink-muted hover:border-primary/30 hover:bg-primary-soft hover:text-primary",
              )}
            >
              {tab.label}
              {showBadge ? (
                <span className="grid min-w-5 place-items-center rounded-full bg-white/25 px-1 text-[10px] font-black leading-5">
                  {new Intl.NumberFormat("fa-IR").format(unreadCount)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ── Search + date row ── */}
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative min-w-0">
          <label htmlFor="notif-search" className="sr-only">جست‌وجوی اعلان</label>
          <IconSearch
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            size={19}
            aria-hidden="true"
          />
          <input
            id="notif-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="جست‌وجو…"
            className="h-11 w-full rounded-control border border-line bg-white pr-10 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line bg-white px-4 text-xs font-bold text-ink-muted transition hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
        >
          <IconCalendar size={17} aria-hidden="true" />
          تاریخ - ۱۴:۳۰
        </button>

        {hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-primary/35 bg-white px-4 text-xs font-black text-primary transition hover:bg-primary-soft"
          >
            <IconX size={16} aria-hidden="true" />
            پاک کردن
          </button>
        ) : null}
      </div>

      <p id="notif-filter-title" className="sr-only">فیلتر اعلان‌ها</p>
    </section>
  );
}
