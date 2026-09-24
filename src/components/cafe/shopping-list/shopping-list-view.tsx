"use client";

import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendarTime,
  IconChecklist,
  IconFileText,
  IconPackage,
} from "@tabler/icons-react";
import {
  formatPersianDate,
  formatPersianNumber,
  type ShoppingListView as ShoppingListViewType,
} from "@/components/cafe/shopping-list/shopping-list-types";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function ShoppingListView({
  shoppingList,
}: {
  shoppingList: ShoppingListViewType | null;
}) {
  const hasItems = shoppingList && shoppingList.items.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="تدارکات و خرید"
        title="لیست خرید جاری"
        description="اقلام تأییدشده و آماده سفارش کافه برای مقایسه و خرید از تأمین‌کنندگان"
      />

      {hasItems ? (
        <div className="space-y-4">
          {/* Header Summary Card */}
          <Card className="p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
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

              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <span className="flex items-center gap-1.5 rounded-xl bg-surface-subtle px-3 py-2">
                  <IconChecklist size={16} className="text-primary" />
                  مجموع اقلام:{" "}
                  <strong className="text-primary">
                    {formatPersianNumber(shoppingList.itemCount)} قلم
                  </strong>
                </span>
              </div>
            </div>
          </Card>

          {/* List of items */}
          <Card className="divide-y divide-line overflow-hidden p-0">
            {shoppingList.items.map((item, index) => {
              const title = item.productTitle || item.customTitle || "کالای بدون عنوان";

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 p-4 transition hover:bg-surface-subtle/40 sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <IconPackage size={20} />
                    </span>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-ink-muted">
                          {index + 1}.
                        </span>
                        <h3 className="text-sm font-black text-ink">{title}</h3>
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
                        {!item.productId ? (
                          <Badge variant="violet" className="text-[10px]">
                            کالای سفارشی
                          </Badge>
                        ) : null}
                      </div>

                      {item.note ? (
                        <p className="text-xs text-ink-muted leading-5">
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
                      {formatPersianNumber(item.quantity)} {item.productUnit ?? "عدد"}
                    </span>
                  </div>
                </div>
              );
            })}
          </Card>
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
    </div>
  );
}
