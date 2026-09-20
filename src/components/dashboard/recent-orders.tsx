import { IconDots, IconArrowLeft } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { recentOrders } from "@/data/dashboard";

export function RecentOrders() {
  return (
    <Card className="overflow-hidden shadow-none">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h2 className="text-base font-black text-ink">سفارش‌های اخیر</h2>
        <button type="button" className="flex items-center gap-1 text-xs font-black text-primary">
          مشاهده همه
          <IconArrowLeft size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px] text-right text-xs">
          <thead className="bg-surface-subtle text-ink-muted">
            <tr>
              <th className="px-3 py-2.5 font-bold">شماره سفارش</th>
              <th className="px-3 py-2.5 font-bold">تأمین‌کننده</th>
              <th className="px-3 py-2.5 font-bold">مبلغ</th>
              <th className="px-3 py-2.5 font-bold">وضعیت</th>
              <th className="px-3 py-2.5 font-bold">تحویل</th>
              <th className="w-12"><span className="sr-only">عملیات</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {recentOrders.map((order) => (
              <tr key={order.id} className="transition hover:bg-primary-soft/30">
                <td className="px-3 py-2.5 font-black text-ink">{order.id}</td>
                <td className="px-3 py-2.5 text-ink">{order.supplier}</td>
                <td className="px-3 py-2.5 text-ink-muted">{order.total}</td>
                <td className="px-3 py-2.5"><Badge variant={order.tone} className="min-h-6 text-[10px]">{order.status}</Badge></td>
                <td className="px-3 py-2.5 text-ink-muted">{order.delivery}</td>
                <td className="px-2 py-2.5">
                  <button type="button" aria-label={`عملیات سفارش ${order.id}`} className="grid size-7 place-items-center rounded-lg bg-surface-subtle text-ink-muted hover:text-primary">
                    <IconDots size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
