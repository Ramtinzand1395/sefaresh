"use client";

import {
  IconAlertCircle,
  IconCheck,
  IconChecklist,
  IconEye,
} from "@tabler/icons-react";
import {
  formatPersianNumber,
  formatToman,
} from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import { Button } from "@/components/ui/button";

type RfqStickySummaryProps = {
  selectedCount: number;
  requiredCount: number;
  estimatedTotal: number;
  isComplete: boolean;
  onOpenReview: () => void;
};

export function RfqStickySummary({
  selectedCount,
  requiredCount,
  estimatedTotal,
  isComplete,
  onOpenReview,
}: RfqStickySummaryProps) {
  return (
    <aside
      aria-label="خلاصه انتخاب پیشنهادهای استعلام"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white/95 backdrop-blur-md shadow-float"
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-6">
        {/* Count & Status */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`grid size-8 place-items-center rounded-xl text-white ${
                isComplete ? "bg-success" : "bg-primary"
              }`}
            >
              <IconChecklist size={18} />
            </span>

            <div>
              <p className="text-xs font-black text-ink">
                {formatPersianNumber(selectedCount)} از {formatPersianNumber(requiredCount)} قلم انتخاب شده
              </p>
              <p className="text-[11px] text-ink-muted">
                {isComplete ? (
                  <span className="flex items-center gap-1 font-bold text-success">
                    <IconCheck size={13} strokeWidth={3} />
                    <span>تمامی اقلام دارای پیشنهاد تکمیل شدند</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700">
                    <IconAlertCircle size={13} />
                    <span>هنوز {formatPersianNumber(requiredCount - selectedCount)} قلم انتخاب نشده است</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Estimated Total */}
          <div className="border-r border-line pr-4">
            <span className="text-[10px] font-bold text-ink-muted">برآورد کل مبلغ:</span>
            <p className="text-sm font-black text-primary">
              {formatToman(estimatedTotal)}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Button
            type="button"
            onClick={onOpenReview}
            disabled={!isComplete || selectedCount === 0}
            className="w-full gap-2 sm:w-auto"
            title={
              !isComplete
                ? "برای ادامه باید تمام اقلام دارای پیشنهاد را انتخاب کنید"
                : undefined
            }
          >
            <IconEye size={18} />
            <span>مرور نهایی و ذخیره انتخاب‌ها</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
