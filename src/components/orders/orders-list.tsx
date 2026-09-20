"use client";

import Image from "next/image";
import {
  IconArrowsExchange,
  IconDots,
  IconEye,
  IconPackageOff,
  IconUserSearch,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { type Order, formatPrice } from "@/data/orders";
import { cn } from "@/lib/cn";

type OrdersListProps = {
  orders: Order[];
  onOpenDetails: (order: Order) => void;
  onOpenSupplier: (supplierId: string) => void;
  onOpenComparison: () => void;
  onResetFilters: () => void;
};

const statusVariants = {
  pending: "warning",
  confirmed: "success",
  preparing: "warning",
  shipping: "info",
  delivered: "success",
} as const;

export function OrdersList({ orders, onOpenDetails, onOpenSupplier, onOpenComparison, onResetFilters }: OrdersListProps) {
  if (!orders.length) {
    return (
      <div className="mt-3 rounded-card border border-line bg-white shadow-card">
        <EmptyState
          icon={IconPackageOff}
          title="سفارشی با این مشخصات پیدا نشد"
          description="عبارت جست‌وجو یا فیلترها را تغییر دهید تا سفارش‌های بیشتری نمایش داده شود."
          action={<Button type="button" variant="secondary" onClick={onResetFilters}>پاک کردن فیلترها</Button>}
        />
      </div>
    );
  }

  return (
    <section aria-labelledby="orders-list-title" className="mt-3 overflow-hidden rounded-card border border-line bg-white shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 lg:hidden">
        <h2 id="orders-list-title" className="text-sm font-black text-ink">فهرست سفارش‌ها</h2>
        <span className="text-xs font-bold text-ink-muted">{new Intl.NumberFormat("fa-IR").format(orders.length)} سفارش</span>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] text-right text-xs">
          <caption id="orders-list-title" className="sr-only">فهرست سفارش‌ها</caption>
          <thead className="bg-[linear-gradient(180deg,#f8fbff,#f2f6fb)] text-ink">
            <tr>
              <th className="px-4 py-3 font-black">شماره سفارش</th>
              <th className="px-3 py-3 font-black">تاریخ ثبت</th>
              <th className="px-3 py-3 font-black">تأمین‌کننده</th>
              <th className="px-3 py-3 font-black">اقلام</th>
              <th className="px-3 py-3 font-black">مبلغ نهایی</th>
              <th className="px-3 py-3 font-black">وضعیت</th>
              <th className="px-3 py-3 font-black">زمان تحویل</th>
              <th className="w-16 px-3 py-3 font-black">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => {
              const SupplierIcon = order.supplierIcon;
              return (
                <tr key={order.id} className="group transition hover:bg-primary-soft/25">
                  <td className="px-4 py-3.5">
                    <button type="button" onClick={() => onOpenDetails(order)} className="font-black text-ink transition hover:text-primary">{order.id}</button>
                  </td>
                  <td className="px-3 py-3.5 text-ink-muted">
                    <span className="block text-ink">{order.registeredDate}</span>
                    <span className="mt-0.5 block text-[10px]">{order.registeredTime}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <button type="button" onClick={() => onOpenSupplier(order.supplierId)} className="flex items-center gap-2 text-right">
                      <span className="grid size-9 place-items-center rounded-xl border border-line bg-white text-success shadow-sm">
                        <SupplierIcon size={21} stroke={1.8} aria-hidden="true" />
                      </span>
                      <span className="font-bold text-ink transition hover:text-primary">{order.supplier}</span>
                    </button>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-ink">{new Intl.NumberFormat("fa-IR").format(order.itemCount)} قلم</span>
                      <ProductThumbs images={order.productImages} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 font-black text-ink">
                    {formatPrice(order.amount)} <span className="font-medium text-ink-muted">تومان</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge variant={statusVariants[order.status]} className="min-h-7 whitespace-nowrap">{order.statusLabel}</Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={cn("block font-bold text-ink", order.deliveryTone === "success" && "text-success")}>{order.deliveryPrimary}</span>
                    <span className="mt-0.5 block text-[10px] text-ink-muted">{order.deliverySecondary}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <OrderActions
                      order={order}
                      onOpenDetails={onOpenDetails}
                      onOpenSupplier={onOpenSupplier}
                      onOpenComparison={onOpenComparison}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-line lg:hidden">
        {orders.map((order) => {
          const SupplierIcon = order.supplierIcon;
          return (
            <article key={order.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                    <SupplierIcon size={22} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <button type="button" onClick={() => onOpenDetails(order)} className="text-sm font-black text-ink">{order.id}</button>
                    <button type="button" onClick={() => onOpenSupplier(order.supplierId)} className="mt-0.5 block truncate text-xs text-ink-muted">{order.supplier}</button>
                  </div>
                </div>
                <Badge variant={statusVariants[order.status]} className="min-h-7 shrink-0 text-[10px]">{order.statusLabel}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-surface-subtle p-3 text-xs">
                <div><dt className="text-[10px] text-ink-muted">مبلغ نهایی</dt><dd className="mt-1 font-black text-ink">{formatPrice(order.amount)} تومان</dd></div>
                <div><dt className="text-[10px] text-ink-muted">زمان تحویل</dt><dd className="mt-1 font-bold text-ink">{order.deliveryPrimary}</dd></div>
                <div><dt className="text-[10px] text-ink-muted">تاریخ ثبت</dt><dd className="mt-1 font-bold text-ink">{order.registeredDate}</dd></div>
                <div><dt className="text-[10px] text-ink-muted">اقلام</dt><dd className="mt-1 flex items-center gap-2 font-bold text-ink"><span>{new Intl.NumberFormat("fa-IR").format(order.itemCount)} قلم</span><ProductThumbs images={order.productImages} /></dd></div>
              </dl>
              <div className="mt-3 flex items-center justify-between gap-2">
                <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => onOpenDetails(order)}>
                  <IconEye size={16} aria-hidden="true" />
                  جزئیات سفارش
                </Button>
                <OrderActions order={order} onOpenDetails={onOpenDetails} onOpenSupplier={onOpenSupplier} onOpenComparison={onOpenComparison} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductThumbs({ images }: { images: string[] }) {
  return (
    <span className="flex -space-x-1 space-x-reverse" aria-hidden="true">
      {images.slice(0, 2).map((image) => (
        <span key={image} className="relative size-8 overflow-hidden rounded-lg border-2 border-white bg-white shadow-sm">
          <Image src={image} alt="" fill sizes="32px" className="object-cover" />
        </span>
      ))}
    </span>
  );
}

function OrderActions({
  order,
  onOpenDetails,
  onOpenSupplier,
  onOpenComparison,
}: {
  order: Order;
  onOpenDetails: (order: Order) => void;
  onOpenSupplier: (supplierId: string) => void;
  onOpenComparison: () => void;
}) {
  return (
    <details className="group/actions relative">
      <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-line bg-surface-subtle text-ink transition hover:border-primary/30 hover:text-primary">
        <span className="sr-only">عملیات سفارش {order.id}</span>
        <IconDots size={18} aria-hidden="true" />
      </summary>
      <div className="absolute left-0 top-10 z-20 w-48 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-float">
        <ActionButton icon={IconEye} label="مشاهده جزئیات" onClick={() => onOpenDetails(order)} />
        <ActionButton icon={IconUserSearch} label="پروفایل تأمین‌کننده" onClick={() => onOpenSupplier(order.supplierId)} />
        <ActionButton icon={IconArrowsExchange} label="مقایسه تأمین‌کنندگان" onClick={onOpenComparison} />
      </div>
    </details>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof IconEye; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 text-right text-xs font-bold text-ink-muted transition hover:bg-primary-soft hover:text-primary">
      <Icon size={17} aria-hidden="true" />
      {label}
    </button>
  );
}
