import Image from "next/image";
import Link from "next/link";
import { IconCalendarTime, IconPackage } from "@tabler/icons-react";
import {
  formatMoney,
  formatRequestedQuantity,
  formatSupplierRequestDate,
  hasSupplierResponse,
  supplierRequestStatusConfig,
  type SupplierRequestView,
} from "@/components/supplier/requests/supplier-request-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function PurchaseRequestCard({ request }: { request: SupplierRequestView }) {
  const status = supplierRequestStatusConfig[request.status];
  const responded = hasSupplierResponse(request.status);

  return (
    <Card className="p-4 shadow-none transition hover:border-primary/25 hover:shadow-card sm:p-5">
      <article className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(13rem,.7fr)] lg:grid-cols-[minmax(0,1.2fr)_minmax(12rem,.65fr)_minmax(13rem,.75fr)_10rem] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          {request.product.image ? (
            <span className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
              <Image
                src={request.product.image}
                alt={request.product.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <IconPackage size={28} aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-ink">{request.product.title}</h3>
            <p className="mt-1 text-xs text-ink-muted">{request.product.brand ?? "بدون برند"}</p>
            <p className="mt-3 text-xs font-bold text-ink">
              مقدار درخواستی: {formatRequestedQuantity(request)}
            </p>
          </div>
        </div>

        <div className="border-t border-line/80 pt-4 md:border-0 md:pt-0">
          <p className="text-[10px] text-ink-muted">وضعیت درخواست</p>
          <Badge variant={status.variant} className="mt-2">{status.label}</Badge>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
            <IconCalendarTime size={15} aria-hidden="true" />
            {formatSupplierRequestDate(request.createdAt)}
          </p>
        </div>

        <div className="border-t border-line/80 pt-4 lg:border-0 lg:pt-0">
          <p className="text-[10px] text-ink-muted">وضعیت پاسخ</p>
          <p className="mt-1 text-xs font-black text-ink">
            {responded ? status.label : "پاسخی ثبت نشده"}
          </p>
          {request.offeredPrice !== undefined ? (
            <p className="mt-2 text-xs text-ink-muted">
              قیمت پیشنهادی: <strong className="text-ink">{formatMoney(request.offeredPrice)}</strong>
            </p>
          ) : null}
        </div>

        <div className="border-t border-line/80 pt-4 md:col-span-2 lg:col-span-1 lg:border-0 lg:pt-0">
          <Link
            href={`/supplier/requests/${request.supplierRequestId}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-primary px-4 text-xs font-black text-white transition hover:bg-primary-hover"
          >
            {responded ? "مشاهده یا ویرایش پاسخ" : "مشاهده و پاسخ"}
          </Link>
        </div>
      </article>
    </Card>
  );
}
