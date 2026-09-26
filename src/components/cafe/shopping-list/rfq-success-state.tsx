"use client";

import Link from "next/link";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconChecklist,
  IconFileText,
  IconRefresh,
  IconSend,
  IconUsers,
} from "@tabler/icons-react";
import { formatPersianNumber } from "@/components/cafe/shopping-list/shopping-list-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type RfqSuccessStateProps = {
  purchaseRequestId: string;
  itemCount: number;
  candidateCount: number;
  createdCount: number;
  existingCount: number;
  onClose: () => void;
};

export function RfqSuccessState({
  purchaseRequestId,
  itemCount,
  candidateCount,
  createdCount,
  existingCount,
  onClose,
}: RfqSuccessStateProps) {
  const hasCandidates = candidateCount > 0;

  return (
    <div className="space-y-6 py-2 text-center">
      {/* Icon & Title */}
      <div>
        {hasCandidates ? (
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-success-soft text-success shadow-sm">
            <IconCheck size={36} strokeWidth={2.5} />
          </div>
        ) : (
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
            <IconAlertCircle size={36} strokeWidth={2.5} />
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2">
          <h3 className="text-lg font-black text-ink">
            {hasCandidates
              ? "استعلام خرید با موفقیت ایجاد و ارسال شد"
              : "استعلام خرید با موفقیت در سامانه ثبت شد"}
          </h3>
          <Badge variant={hasCandidates ? "success" : "warning"}>
            {hasCandidates ? "ارسال‌شده" : "در انتظار تأمین‌کننده"}
          </Badge>
        </div>

        <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-ink-muted">
          {hasCandidates
            ? `استعلام با موفقیت برای ${formatPersianNumber(candidateCount)} تأمین‌کننده واجد شرایط ارسال شد.`
            : "استعلام ثبت شد، اما در حال حاضر تأمین‌کننده واجد شرایطی برای این کالاها پیدا نشد."}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 text-right sm:grid-cols-4">
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <IconChecklist size={16} className="text-primary" />
            <span className="text-[11px] font-bold">اقلام استعلام</span>
          </div>
          <p className="mt-1 text-base font-black text-ink">
            {formatPersianNumber(itemCount)} قلم
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <IconUsers size={16} className="text-primary" />
            <span className="text-[11px] font-bold">کاندیداهای تأمین</span>
          </div>
          <p className="mt-1 text-base font-black text-ink">
            {formatPersianNumber(candidateCount)} تأمین‌کننده
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <IconSend size={16} className="text-primary" />
            <span className="text-[11px] font-bold">ارسال جدید</span>
          </div>
          <p className="mt-1 text-base font-black text-ink">
            {formatPersianNumber(createdCount)} درخواست
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <IconRefresh size={16} className="text-primary" />
            <span className="text-[11px] font-bold">درخواست‌های قبلی</span>
          </div>
          <p className="mt-1 text-base font-black text-ink">
            {formatPersianNumber(existingCount)} درخواست
          </p>
        </Card>
      </div>

      {/* Tracking ID info */}
      <div className="rounded-xl border border-line bg-surface-subtle p-3 text-xs text-ink-muted">
        <span>شناسه رهگیری استعلام: </span>
        <code className="rounded bg-white px-2 py-0.5 font-mono text-xs font-bold text-ink" dir="ltr">
          {purchaseRequestId}
        </code>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-center gap-2.5 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          بازگشت به لیست خرید
        </Button>
        <Link
          href="/cafe/requests"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          <IconFileText size={18} />
          <span>مشاهده استعلام</span>
          <IconArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
}
