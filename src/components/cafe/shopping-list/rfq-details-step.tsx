"use client";

import {
  IconCalendar,
  IconCalendarEvent,
  IconClockHour4,
  IconFileText,
} from "@tabler/icons-react";

type RfqDetailsStepProps = {
  title: string;
  neededAt: string;
  expiresAt: string;
  onTitleChange: (val: string) => void;
  onNeededAtChange: (val: string) => void;
  onExpiresAtChange: (val: string) => void;
  errors?: Record<string, string>;
};

function formatPersianDatePreview(dateStr: string): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return null;
  }
}

export function RfqDetailsStep({
  title,
  neededAt,
  expiresAt,
  onTitleChange,
  onNeededAtChange,
  onExpiresAtChange,
  errors = {},
}: RfqDetailsStepProps) {
  const neededAtPreview = formatPersianDatePreview(neededAt);
  const expiresAtPreview = formatPersianDatePreview(expiresAt);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black text-ink">مشخصات و زمان‌بندی استعلام</h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          عنوان و مهلت‌های زمانی را برای دریافت پاسخ از تأمین‌کنندگان تعیین کنید.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="rfq-title-input" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-ink">
            <IconFileText size={16} className="text-primary" />
            <span>عنوان استعلام</span>
            <span className="text-danger">*</span>
          </label>
          <input
            id="rfq-title-input"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="مثال: استعلام خرید هفتگی کافه"
            className={`w-full rounded-control border px-3.5 py-2.5 text-xs font-medium text-ink placeholder:text-ink-muted/50 focus:outline-none ${
              errors.title
                ? "border-danger bg-danger-soft/20 focus:border-danger"
                : "border-line bg-surface-subtle focus:border-primary"
            }`}
          />
          {errors.title ? (
            <p className="mt-1 text-[11px] font-bold text-danger">{errors.title}</p>
          ) : (
            <p className="mt-1 text-[11px] text-ink-muted">
              یک عنوان مشخص که تأمین‌کنندگان نوع سفارش را تشخیص دهند.
            </p>
          )}
        </div>

        {/* Expiration date (Response deadline) */}
        <div>
          <label htmlFor="rfq-expires-at-input" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-ink">
            <IconClockHour4 size={16} className="text-primary" />
            <span>مهلت پاسخ تأمین‌کنندگان (پایان استعلام)</span>
          </label>
          <div className="relative">
            <input
              id="rfq-expires-at-input"
              type="date"
              min={today}
              value={expiresAt}
              onChange={(e) => onExpiresAtChange(e.target.value)}
              className={`w-full rounded-control border px-3.5 py-2.5 text-xs font-medium text-ink focus:outline-none ${
                errors.expiresAt
                  ? "border-danger bg-danger-soft/20 focus:border-danger"
                  : "border-line bg-surface-subtle focus:border-primary"
              }`}
            />
          </div>
          {expiresAtPreview ? (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-primary">
              <IconCalendar size={14} />
              <span>معادل تاریخ شمسی: {expiresAtPreview}</span>
            </p>
          ) : null}
          {errors.expiresAt ? (
            <p className="mt-1 text-[11px] font-bold text-danger">{errors.expiresAt}</p>
          ) : (
            <p className="mt-1 text-[11px] text-ink-muted">
              پس از این تاریخ، تأمین‌کنندگان دیگر امکان ارسال پیشنهاد جدید نخواهند داشت.
            </p>
          )}
        </div>

        {/* Needed date */}
        <div>
          <label htmlFor="rfq-needed-at-input" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-ink">
            <IconCalendarEvent size={16} className="text-primary" />
            <span>تاریخ تحویل مورد نیاز در کافه</span>
          </label>
          <div className="relative">
            <input
              id="rfq-needed-at-input"
              type="date"
              min={expiresAt || today}
              value={neededAt}
              onChange={(e) => onNeededAtChange(e.target.value)}
              className={`w-full rounded-control border px-3.5 py-2.5 text-xs font-medium text-ink focus:outline-none ${
                errors.neededAt
                  ? "border-danger bg-danger-soft/20 focus:border-danger"
                  : "border-line bg-surface-subtle focus:border-primary"
              }`}
            />
          </div>
          {neededAtPreview ? (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-primary">
              <IconCalendar size={14} />
              <span>معادل تاریخ شمسی: {neededAtPreview}</span>
            </p>
          ) : null}
          {errors.neededAt ? (
            <p className="mt-1 text-[11px] font-bold text-danger">{errors.neededAt}</p>
          ) : (
            <p className="mt-1 text-[11px] text-ink-muted">
              تأمین‌کنندگان در پیشنهاد خود تعهد زمان تحویل را بر اساس این تاریخ مشخص می‌کنند.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
