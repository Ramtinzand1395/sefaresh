"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendarTime,
  IconCheck,
  IconCheckbox,
  IconChecklist,
  IconFileText,
  IconPackage,
  IconSend,
  IconSquare,
} from "@tabler/icons-react";
import { CreateRfqModal } from "@/components/cafe/shopping-list/create-rfq-modal";
import {
  formatPersianDate,
  formatPersianNumber,
  type ShoppingListView as ShoppingListViewType,
} from "@/components/cafe/shopping-list/shopping-list-types";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function ShoppingListView({
  shoppingList,
}: {
  shoppingList: ShoppingListViewType | null;
}) {
  const hasItems = shoppingList && shoppingList.items.length > 0;

  const eligibleItems = useMemo(
    () => (shoppingList ? shoppingList.items.filter((item) => Boolean(item.productId)) : []),
    [shoppingList],
  );

  const ineligibleItems = useMemo(
    () => (shoppingList ? shoppingList.items.filter((item) => !item.productId) : []),
    [shoppingList],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    return new Set(eligibleItems.map((item) => item.id));
  });

  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  const selectedEligibleCount = useMemo(() => {
    let count = 0;
    for (const item of eligibleItems) {
      if (selectedIds.has(item.id)) count++;
    }
    return count;
  }, [eligibleItems, selectedIds]);

  const allEligibleSelected =
    eligibleItems.length > 0 && selectedEligibleCount === eligibleItems.length;

  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(eligibleItems.map((item) => item.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const isCtaEnabled = selectedEligibleCount > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="تدارکات و خرید"
        title="لیست خرید جاری"
        description="اقلام تأییدشده و آماده سفارش کافه برای مقایسه و خرید از تأمین‌کنندگان"
        action={
          hasItems ? (
            <Button
              type="button"
              onClick={() => setIsRfqModalOpen(true)}
              disabled={!isCtaEnabled}
              className="w-full gap-2 sm:w-auto shadow-sm"
              title={
                !isCtaEnabled
                  ? "حداقل یک قلم کالای متصل به کاتالوگ را انتخاب کنید"
                  : undefined
              }
            >
              <IconSend size={18} />
              <span>ارسال برای استعلام قیمت</span>
              {selectedEligibleCount > 0 ? (
                <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-black">
                  {formatPersianNumber(selectedEligibleCount)}
                </span>
              ) : null}
            </Button>
          ) : null
        }
      />

      {hasItems ? (
        <div className="space-y-6">
          {/* Header Summary Card */}
          <Card className="p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-ink">
                    {shoppingList.name}
                  </h2>
                  <Badge variant="success">فعال</Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                  <IconCalendarTime size={15} />
                  آخرین به‌روزرسانی: {formatPersianDate(shoppingList.updatedAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink">
                <span className="flex items-center gap-1.5 rounded-xl bg-surface-subtle px-3 py-2">
                  <IconChecklist size={16} className="text-primary" />
                  مجموع اقلام:{" "}
                  <strong className="text-primary">
                    {formatPersianNumber(shoppingList.itemCount)} قلم
                  </strong>
                </span>

                <span className="flex items-center gap-1.5 rounded-xl bg-primary-soft/40 px-3 py-2 text-primary">
                  <IconPackage size={16} />
                  قابل استعلام:{" "}
                  <strong>{formatPersianNumber(eligibleItems.length)} قلم</strong>
                </span>

                {ineligibleItems.length > 0 ? (
                  <span className="flex items-center gap-1.5 rounded-xl bg-amber-100/60 px-3 py-2 text-amber-800">
                    <IconAlertTriangle size={15} />
                    سفارشی:{" "}
                    <strong>
                      {formatPersianNumber(ineligibleItems.length)} قلم
                    </strong>
                  </span>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Section 1: Eligible Catalog Items */}
          <div className="space-y-3">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-black text-ink">
                  اقلام متصل به کاتالوگ (آماده استعلام قیمت)
                </h3>
                <p className="text-xs text-ink-muted">
                  برای ارسال استعلام، اقلام مورد نظر را انتخاب و دکمه «ارسال برای
                  استعلام قیمت» را بزنید.
                </p>
              </div>

              {eligibleItems.length > 0 ? (
                <button
                  type="button"
                  onClick={allEligibleSelected ? handleDeselectAll : handleSelectAll}
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line bg-surface-subtle px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-surface-subtle/80 sm:self-center"
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
              ) : null}
            </div>

            {eligibleItems.length > 0 ? (
              <Card className="divide-y divide-line overflow-hidden p-0">
                {eligibleItems.map((item, index) => {
                  const isSelected = selectedIds.has(item.id);
                  const title =
                    item.productTitle || item.customTitle || "کالای بدون عنوان";

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col justify-between gap-3 p-4 transition sm:flex-row sm:items-center sm:p-5 ${
                        isSelected
                          ? "bg-primary-soft/10"
                          : "hover:bg-surface-subtle/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <label
                          htmlFor={`list-item-checkbox-${item.id}`}
                          className="mt-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-lg border border-line bg-white transition hover:border-primary"
                        >
                          <input
                            id={`list-item-checkbox-${item.id}`}
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(item.id)}
                            className="peer sr-only"
                          />
                          {isSelected ? (
                            <span className="grid size-6 place-items-center rounded-lg bg-primary text-white">
                              <IconCheck size={16} strokeWidth={3} />
                            </span>
                          ) : null}
                        </label>

                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                          <IconPackage size={20} />
                        </span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-ink-muted">
                              {formatPersianNumber(index + 1)}.
                            </span>
                            <h4 className="text-sm font-black text-ink">{title}</h4>
                            {item.productBrand ? (
                              <span className="text-xs text-ink-muted">
                                ({item.productBrand})
                              </span>
                            ) : null}
                            {item.isInternalRequest ? (
                              <Badge variant="info" className="text-[10px]">
                                درخواست داخلی
                              </Badge>
                            ) : null}
                          </div>

                          {item.note ? (
                            <p className="text-xs leading-5 text-ink-muted">
                              توضیحات: {item.note}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-line/70 pt-2 sm:border-0 sm:pt-0">
                        <span className="text-xs font-bold text-ink-muted sm:hidden">
                          مقدار:
                        </span>
                        <span className="rounded-xl bg-surface-subtle px-3 py-1.5 text-xs font-black text-ink">
                          {formatPersianNumber(item.quantity)}{" "}
                          {item.productUnit ?? "عدد"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </Card>
            ) : (
              <Card className="p-6 text-center text-xs text-ink-muted">
                هیچ کالای متصل به کاتالوگی در لیست خرید جاری وجود ندارد.
              </Card>
            )}
          </div>

          {/* Section 2: Ineligible Custom Items (shown separately with clear Persian explanation) */}
          {ineligibleItems.length > 0 ? (
            <div className="space-y-3 pt-2">
              <div>
                <h3 className="text-sm font-black text-ink">
                  اقلام سفارشی (نیازمند اتصال به کاتالوگ)
                </h3>
                <p className="text-xs text-ink-muted">
                  اقلامی که به کالای کاتالوگ متصل نشده‌اند، در این بخش نگهداری
                  می‌شوند.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4">
                <div className="flex items-start gap-2.5">
                  <IconAlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div>
                    <h4 className="text-xs font-black text-amber-900">
                      غیرقابل ارسال به تأمین‌کنندگان
                    </h4>
                    <p className="mt-0.5 text-xs leading-5 text-amber-800">
                      این قلم هنوز به کالای کاتالوگ متصل نشده و قابل ارسال برای
                      تأمین‌کنندگان نیست. این اقلام در لیست خرید باقی می‌مانند و
                      حذف نخواهند شد.
                    </p>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-amber-200/60 rounded-xl border border-amber-200/60 bg-white">
                  {ineligibleItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-7 place-items-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                          {formatPersianNumber(index + 1)}
                        </span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-ink">
                              {item.customTitle || "کالای سفارشی"}
                            </h4>
                            <Badge
                              variant="warning"
                              className="text-[10px]"
                            >
                              کالای سفارشی
                            </Badge>
                          </div>
                          <p className="text-xs text-amber-700">
                            این قلم هنوز به کالای کاتالوگ متصل نشده و قابل ارسال
                            برای تأمین‌کنندگان نیست.
                          </p>
                          {item.note ? (
                            <p className="text-xs text-ink-muted">
                              توضیحات: {item.note}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-amber-100 pt-2 sm:border-0 sm:pt-0">
                        <span className="text-xs font-bold text-ink-muted sm:hidden">
                          مقدار:
                        </span>
                        <span className="rounded-xl bg-surface-subtle px-3 py-1.5 text-xs font-black text-ink">
                          {formatPersianNumber(item.quantity)}{" "}
                          {item.productUnit ?? "عدد"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon={IconFileText}
          title="لیست خرید شما هنوز خالی است."
          description="اقلام تأییدشده از درخواست‌های خرید می‌توانند به این بخش اضافه شوند. پس از تأیید درخواست‌ها در بخش درخواست‌های خرید، دکمه افزودن به لیست خرید را انتخاب کنید."
          action={
            <Link
              href="/cafe/requests"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              <span>مشاهده درخواست‌های خرید</span>
              <IconArrowLeft size={16} />
            </Link>
          }
        />
      )}

      {/* RFQ Creation Modal */}
      {shoppingList ? (
        <CreateRfqModal
          open={isRfqModalOpen}
          onClose={() => setIsRfqModalOpen(false)}
          items={shoppingList.items}
          initialSelectedIds={selectedIds}
        />
      ) : null}
    </div>
  );
}
