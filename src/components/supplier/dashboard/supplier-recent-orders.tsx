import Link from "next/link";
import { IconClipboardList, IconEye } from "@tabler/icons-react";
import { SupplierOrderStatusBadge } from "@/components/supplier/dashboard/supplier-order-status-badge";
import { SupplierSectionHeader } from "@/components/supplier/dashboard/supplier-section-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SupplierOrderSummary } from "@/data/supplier-dashboard";

const numberFormatter = new Intl.NumberFormat("fa-IR");

type SupplierRecentOrdersProps = {
  orders: SupplierOrderSummary[];
};

function OrderAction({ orderId }: { orderId: string }) {
  return (
    <Link
      href={`/supplier/orders/${orderId.toLowerCase()}`}
      className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-primary/25 bg-white px-3 text-xs font-black text-primary transition hover:border-primary hover:bg-primary-soft"
    >
      <IconEye size={15} aria-hidden="true" />
      مشاهده
    </Link>
  );
}

export function SupplierRecentOrders({ orders }: SupplierRecentOrdersProps) {
  return (
    <section aria-labelledby="recent-supplier-orders-heading">
      <Card className="overflow-hidden shadow-none">
        <div id="recent-supplier-orders-heading">
          <SupplierSectionHeader title="آخرین سفارش‌ها" href="/supplier/orders" />
        </div>

        {orders.length ? (
          <>
            <div className="hidden md:block">
              <table className="w-full text-right text-xs">
                <thead className="bg-surface-subtle text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-bold sm:px-5">شماره سفارش</th>
                    <th className="px-4 py-3 font-bold">خریدار</th>
                    <th className="px-4 py-3 font-bold">مبلغ</th>
                    <th className="px-4 py-3 font-bold">وضعیت</th>
                    <th className="px-4 py-3 font-bold">تاریخ</th>
                    <th className="px-4 py-3 font-bold"><span className="sr-only">اقدام</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {orders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-primary-soft/25">
                      <td className="px-4 py-3.5 font-black text-ink sm:px-5" dir="ltr">#{order.id}</td>
                      <td className="px-4 py-3.5 font-bold text-ink">{order.buyerName}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-black text-ink">{numberFormatter.format(order.amount)} <span className="font-medium text-ink-muted">تومان</span></td>
                      <td className="px-4 py-3.5"><SupplierOrderStatusBadge status={order.status} /></td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-ink-muted">{order.date}</td>
                      <td className="px-4 py-3.5 text-left"><OrderAction orderId={order.id} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {orders.map((order) => (
                <li key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-primary" dir="ltr">#{order.id}</p>
                      <h3 className="mt-1 text-sm font-black text-ink">{order.buyerName}</h3>
                    </div>
                    <SupplierOrderStatusBadge status={order.status} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-surface-subtle p-3 text-xs">
                    <div>
                      <dt className="text-[10px] text-ink-muted">مبلغ</dt>
                      <dd className="mt-1 font-black text-ink">{numberFormatter.format(order.amount)} تومان</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] text-ink-muted">تاریخ</dt>
                      <dd className="mt-1 font-bold text-ink">{order.date}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex justify-end"><OrderAction orderId={order.id} /></div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            icon={IconClipboardList}
            title="هنوز سفارشی ثبت نشده است."
            description="پس از پذیرش پیشنهاد شما، سفارش‌های تازه در این بخش قرار می‌گیرند."
          />
        )}
      </Card>
    </section>
  );
}
