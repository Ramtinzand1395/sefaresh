"use client";

import {
  IconAlertTriangle,
  IconCheck,
  IconCheckbox,
  IconInfoCircle,
  IconPackage,
  IconSquare,
} from "@tabler/icons-react";
import {
  formatPersianNumber,
  type ShoppingListItemView,
} from "@/components/cafe/shopping-list/shopping-list-types";
import { Badge } from "@/components/ui/badge";

type RfqItemSelectorProps = {
  items: ShoppingListItemView[];
  selectedIds: Set<string>;
  quantities: Record<string, number>;
  notes: Record<string, string>;
  onToggleItem: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onQuantityChange: (id: string, qty: number) => void;
  onNoteChange: (id: string, note: string) => void;
};

export function RfqItemSelector({
  items,
  selectedIds,
  quantities,
  notes,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
  onQuantityChange,
  onNoteChange,
}: RfqItemSelectorProps) {
  const eligibleItems = items.filter((item) => Boolean(item.productId));
  const ineligibleItems = items.filter((item) => !item.productId);

  const allEligibleSelected =
    eligibleItems.length > 0 &&
    eligibleItems.every((item) => selectedIds.has(item.id));

  return (
    <div className="space-y-6">
      {/* Header controls for selection */}
      <div className="flex flex-col justify-between gap-3 border-b border-line pb-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-black text-ink">
            انتخاب اقلام برای ارسال استعلام
          </h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            اقلامی را که مایلید تأمین‌کنندگان قیمت آن‌ها را پیشنهاد دهند انتخاب و در
            صورت نیاز مقادیر را ویرایش کنید.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={allEligibleSelected ? onDeselectAll : onSelectAll}
            disabled={eligibleItems.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-subtle px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-surface-subtle/80 disabled:opacity-50"
          >
            {allEligibleSelected ? (
              <>
                <IconSquare size={16} className="text-ink-muted" />
                <span>لغو انتخاب همه</span>
              </>
            ) : (
              <>
                <IconCheckbox size={16} className="text-primary" />
                <span>انتخاب همه اقلام</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Eligible Items List */}
      <div className="space-y-3">
        {eligibleItems.length > 0 ? (
          eligibleItems.map((item, index) => {
            const isSelected = selectedIds.has(item.id);
            const currentQty = quantities[item.id] ?? item.quantity;
            const currentNote = notes[item.id] ?? (item.note || "");
            const title = item.productTitle || item.customTitle || "کالای بدون عنوان";

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl border p-4 transition ${
                  isSelected
                    ? "border-primary/40 bg-primary-soft/10 shadow-sm"
                    : "border-line bg-surface-subtle/30 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Item info and Checkbox */}
                  <div className="flex items-start gap-3">
                    <label
                      htmlFor={`item-select-${item.id}`}
                      className="mt-0.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-lg border border-line bg-white transition hover:border-primary"
                    >
                      <input
                        id={`item-select-${item.id}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleItem(item.id)}
                        className="peer sr-only"
                      />
                      {isSelected ? (
                        <span className="grid size-6 place-items-center rounded-lg bg-primary text-white">
                          <IconCheck size={16} strokeWidth={3} />
                        </span>
                      ) : null}
                    </label>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-ink-muted">
                          {formatPersianNumber(index + 1)}.
                        </span>
                        <h4 className="text-sm font-black text-ink">{title}</h4>
                        {item.productBrand ? (
                          <Badge variant="neutral" className="text-[10px]">
                            {item.productBrand}
                          </Badge>
                        ) : null}
                      </div>

                      <p className="text-[11px] text-ink-muted">
                        واحد شمارش: {item.productUnit ?? "عدد"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Editing */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <label
                      htmlFor={`qty-input-${item.id}`}
                      className="text-xs font-bold text-ink-muted"
                    >
                      تعداد استعلام:
                    </label>
                    <div className="flex items-center rounded-xl border border-line bg-white px-2 py-1 focus-within:border-primary">
                      <input
                        id={`qty-input-${item.id}`}
                        type="number"
                        min={1}
                        value={currentQty}
                        disabled={!isSelected}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          onQuantityChange(item.id, Number.isNaN(val) || val < 1 ? 1 : val);
                        }}
                        className="w-14 text-center text-xs font-black text-ink outline-none disabled:bg-transparent disabled:text-ink-muted"
                      />
                      <span className="text-[11px] font-bold text-ink-muted">
                        {item.productUnit ?? "عدد"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional note input */}
                {isSelected ? (
                  <div className="mt-3 border-t border-line/50 pt-2">
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) => onNoteChange(item.id, e.target.value)}
                      placeholder="توضیحات و شرایط خاص برای تأمین‌کننده (اختیاری)..."
                      className="w-full rounded-lg border border-line/60 bg-white px-3 py-1.5 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none"
                    />
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-6 text-center">
            <IconPackage size={32} className="mx-auto text-ink-muted" />
            <p className="mt-2 text-xs font-bold text-ink">
              هیچ کالای متصل به کاتالوگی در لیست خرید یافت نشد.
            </p>
          </div>
        )}
      </div>

      {/* Ineligible Items Section (Separate and with clear explanation) */}
      {ineligibleItems.length > 0 ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4">
          <div className="flex items-start gap-2.5">
            <IconAlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-900">
                اقلام سفارشی (غیرقابل ارسال به تأمین‌کنندگان)
              </h4>
              <p className="text-[11px] leading-5 text-amber-800">
                این اقلام هنوز به کالای کاتالوگ متصل نشده و قابل ارسال برای
                تأمین‌کنندگان نیستند. این اقلام در لیست خرید باقی می‌مانند و حذف
                نخواهند شد.
              </p>
            </div>
          </div>

          <div className="mt-3 divide-y divide-amber-200/50 rounded-xl border border-amber-200/60 bg-white/70">
            {ineligibleItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <span className="font-bold text-ink">
                    {item.customTitle || "کالای سفارشی"}
                  </span>
                  <Badge variant="warning" className="text-[10px]">
                    سفارشی
                  </Badge>
                </div>
                <span className="text-[11px] text-ink-muted">
                  {formatPersianNumber(item.quantity)} {item.productUnit ?? "عدد"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom hint */}
      <div className="flex items-center gap-2 rounded-xl bg-surface-subtle p-3 text-xs text-ink-muted">
        <IconInfoCircle size={16} className="shrink-0 text-primary" />
        <span>
          تعداد اقلام انتخاب‌شده:{" "}
          <strong className="text-ink">
            {formatPersianNumber(selectedIds.size)} از{" "}
            {formatPersianNumber(eligibleItems.length)} قلم
          </strong>
        </span>
      </div>
    </div>
  );
}
