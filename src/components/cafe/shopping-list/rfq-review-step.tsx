"use client";

import {
  IconCalendarEvent,
  IconChecklist,
  IconClockHour4,
  IconEdit,
  IconFileText,
  IconPackage,
  IconSum,
} from "@tabler/icons-react";
import { formatPersianNumber } from "@/components/cafe/shopping-list/shopping-list-types";
import { Card } from "@/components/ui/card";

type SelectedItemReview = {
  id: string;
  productTitle?: string;
  productBrand?: string;
  productUnit?: string;
  quantity: number;
  note?: string;
};

type RfqReviewStepProps = {
  title: string;
  neededAt: string;
  expiresAt: string;
  selectedItems: SelectedItemReview[];
  onEditItems: () => void;
  onEditDetails: () => void;
};

function formatPersianDateString(dateStr: string): string {
  if (!dateStr) return "تعیین نشده";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "تعیین نشده";
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function RfqReviewStep({
  title,
  neededAt,
  expiresAt,
  selectedItems,
  onEditItems,
  onEditDetails,
}: RfqReviewStepProps) {
  const selectedCount = selectedItems.length;
  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black text-ink">مرور و تأیید نهایی استعلام</h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          اطلاعات استعلام را پیش از ارسال برای تأمین‌کنندگان واجد شرایط بررسی کنید.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-3">
          <div className="flex items-center gap-2 text-ink-muted">
            <IconChecklist size={16} className="text-primary" />
            <span className="text-[11px] font-bold">تعداد اقلام</span>
          </div>
          <p className="mt-1 text-base font-black text-ink">
            {formatPersianNumber(selectedCount)} قلم
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 text-ink-muted">
            <IconSum size={16} className="text-primary" />
            <span className="text-[11px] font-bold">مجموع واحدها</span>
          </div>
          <p className="mt-1 text-base font-black text-ink">
            {formatPersianNumber(totalQuantity)}
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 text-ink-muted">
            <IconClockHour4 size={16} className="text-primary" />
            <span className="text-[11px] font-bold">مهلت پاسخ</span>
          </div>
          <p className="mt-1 text-xs font-black text-ink">
            {formatPersianDateString(expiresAt)}
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 text-ink-muted">
            <IconCalendarEvent size={16} className="text-primary" />
            <span className="text-[11px] font-bold">تاریخ تحویل</span>
          </div>
          <p className="mt-1 text-xs font-black text-ink">
            {formatPersianDateString(neededAt)}
          </p>
        </Card>
      </div>

      {/* Details Card */}
      <div className="rounded-2xl border border-line bg-surface-subtle/50 p-4">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <IconFileText size={18} className="text-primary" />
            <span className="text-xs font-black text-ink">مشخصات استعلام</span>
          </div>
          <button
            type="button"
            onClick={onEditDetails}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <IconEdit size={14} />
            <span>ویرایش مشخصات</span>
          </button>
        </div>

        <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <span className="text-ink-muted">عنوان استعلام: </span>
            <strong className="font-black text-ink">{title}</strong>
          </div>
          <div>
            <span className="text-ink-muted">مهلت ارسال پیشنهاد: </span>
            <strong className="font-black text-ink">
              {formatPersianDateString(expiresAt)}
            </strong>
          </div>
          <div>
            <span className="text-ink-muted">تاریخ تحویل مورد نیاز: </span>
            <strong className="font-black text-ink">
              {formatPersianDateString(neededAt)}
            </strong>
          </div>
        </div>
      </div>

      {/* Items Review Card */}
      <div className="rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line p-4">
          <div className="flex items-center gap-2">
            <IconPackage size={18} className="text-primary" />
            <span className="text-xs font-black text-ink">
              اقلام انتخابی ({formatPersianNumber(selectedCount)} قلم)
            </span>
          </div>
          <button
            type="button"
            onClick={onEditItems}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <IconEdit size={14} />
            <span>ویرایش اقلام</span>
          </button>
        </div>

        <div className="divide-y divide-line/60">
          {selectedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-2 p-3 text-xs sm:flex-row sm:items-center sm:px-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink-muted">
                    {formatPersianNumber(index + 1)}.
                  </span>
                  <span className="font-black text-ink">
                    {item.productTitle || "کالای کاتالوگ"}
                  </span>
                  {item.productBrand ? (
                    <span className="text-ink-muted">({item.productBrand})</span>
                  ) : null}
                </div>
                {item.note ? (
                  <p className="text-[11px] text-ink-muted">یادداشت: {item.note}</p>
                ) : null}
              </div>

              <div className="self-end sm:self-center">
                <span className="rounded-lg bg-surface-subtle px-2.5 py-1 font-black text-ink">
                  {formatPersianNumber(item.quantity)} {item.productUnit ?? "عدد"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
