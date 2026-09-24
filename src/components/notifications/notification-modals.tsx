"use client";

import {
  IconBuildingStore,
  IconCalendar,
  IconTrash,
} from "@tabler/icons-react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "@/data/notifications";
import { cn } from "@/lib/cn";

export type NotificationModalState =
  | { type: "detail"; notification: NotificationItem }
  | null;

type NotificationModalsProps = {
  modal: NotificationModalState;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export function NotificationModals({ modal, onClose, onDelete }: NotificationModalsProps) {
  if (!modal) return null;

  if (modal.type === "detail") {
    return (
      <NotificationDetailModal
        notification={modal.notification}
        onClose={onClose}
        onDelete={onDelete}
      />
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Detail modal — shows full notification content
// ---------------------------------------------------------------------------

function NotificationDetailModal({
  notification,
  onClose,
  onDelete,
}: {
  notification: NotificationItem;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const Icon = notification.icon;

  const toneClasses = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    info: "bg-primary-soft text-primary",
    violet: "bg-violet-soft text-violet",
  };

  return (
    <Modal
      open
      title={notification.title}
      description={notification.source}
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            className="gap-2 sm:min-w-28"
            onClick={() => {
              onDelete(notification.id);
              onClose();
            }}
          >
            <IconTrash size={16} aria-hidden="true" />
            حذف
          </Button>
          <Button type="button" className="flex-1" onClick={onClose}>
            مشاهده جزئیات
          </Button>
        </>
      }
    >
      {/* ── Sender card ── */}
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-subtle p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <IconBuildingStore size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-ink">{notification.source}</p>
          <p className="mt-0.5 text-[10px] text-ink-muted">فرستنده اعلان</p>
        </div>
        <Badge variant={notification.badgeTone}>{notification.badgeLabel}</Badge>
      </div>

      {/* ── Notification content ── */}
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl",
              toneClasses[notification.tone],
            )}
          >
            <Icon size={22} stroke={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-black text-ink">{notification.title}</h3>
            <p className="mt-1.5 text-xs leading-7 text-ink-muted">
              {notification.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-ink-muted">
          <IconCalendar size={15} className="text-primary" aria-hidden="true" />
          {notification.timeLabel}
        </div>
      </div>
    </Modal>
  );
}
