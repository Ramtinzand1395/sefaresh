import { IconBell, IconMoodEmpty, IconSearch } from "@tabler/icons-react";
import { NotificationCard } from "@/components/notifications/notification-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "@/data/notifications";

type NotificationListProps = {
  notifications: NotificationItem[];
  hasFilters: boolean;
  onOpenDetail: (notification: NotificationItem) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
};

export function NotificationList({
  notifications,
  hasFilters,
  onOpenDetail,
  onToggleRead,
  onDelete,
  onReset,
}: NotificationListProps) {
  // ── Empty state: no notifications at all ──
  if (notifications.length === 0 && !hasFilters) {
    return (
      <div className="mt-4 rounded-card border border-line bg-white shadow-card">
        <EmptyState
          icon={IconBell}
          title="اعلانی وجود ندارد"
          description="هنوز اعلان جدیدی دریافت نکرده‌اید. وقتی رویدادی رخ دهد، اینجا نمایش داده می‌شود."
          className="min-h-64"
        />
      </div>
    );
  }

  // ── Filter empty state: filters active but no results ──
  if (notifications.length === 0 && hasFilters) {
    return (
      <div className="mt-4 rounded-card border border-line bg-white shadow-card">
        <EmptyState
          icon={IconSearch}
          title="نتیجه‌ای یافت نشد"
          description="اعلانی مطابق فیلترهای انتخاب‌شده وجود ندارد. فیلترها را تغییر دهید."
          className="min-h-64"
          action={
            <Button type="button" variant="secondary" size="sm" onClick={onReset}>
              پاک کردن فیلترها
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3" role="list" aria-label="لیست اعلان‌ها">
      {notifications.map((notification) => (
        <div key={notification.id} role="listitem">
          <NotificationCard
            notification={notification}
            onOpenDetail={onOpenDetail}
            onToggleRead={onToggleRead}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton — used when data is loading
// ---------------------------------------------------------------------------

export function NotificationListSkeleton() {
  return (
    <div className="mt-4 space-y-3" aria-busy="true" aria-label="در حال بارگذاری اعلان‌ها">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-card border border-line bg-white p-5 shadow-card"
        >
          <div className="size-12 shrink-0 animate-pulse rounded-2xl bg-surface-subtle" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/5 animate-pulse rounded bg-surface-subtle" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-surface-subtle" />
            <div className="flex gap-2">
              <div className="h-7 w-16 animate-pulse rounded-full bg-surface-subtle" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-surface-subtle" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state — for future API errors
// ---------------------------------------------------------------------------

export function NotificationListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-4 rounded-card border border-danger/30 bg-white shadow-card">
      <EmptyState
        icon={IconMoodEmpty}
        title="خطا در بارگذاری اعلان‌ها"
        description="امکان دریافت اعلان‌ها وجود ندارد. لطفاً دوباره تلاش کنید."
        className="min-h-64"
        action={
          <Button type="button" variant="primary" size="sm" onClick={onRetry}>
            تلاش مجدد
          </Button>
        }
      />
    </div>
  );
}
