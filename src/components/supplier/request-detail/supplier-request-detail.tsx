import Image from "next/image";
import Link from "next/link";
import {
  IconCalendarTime,
  IconChevronLeft,
  IconClock,
  IconPackage,
} from "@tabler/icons-react";
import { SupplierResponseForm } from "@/components/supplier/request-detail/supplier-response-form";
import {
  formatMoney,
  formatRequestedQuantity,
  formatSupplierRequestDate,
  hasSupplierResponse,
  supplierRequestStatusConfig,
  type SupplierRequestView,
} from "@/components/supplier/requests/supplier-request-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const numberFormatter = new Intl.NumberFormat("fa-IR");

export function SupplierRequestDetail({ request }: { request: SupplierRequestView }) {
  const status = supplierRequestStatusConfig[request.status];
  const responded = hasSupplierResponse(request.status);

  return (
    <div className="space-y-5 pb-8">
      <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/supplier">داشبورد</Link>
        <IconChevronLeft size={14} aria-hidden="true" />
        <Link href="/supplier/requests">درخواست‌های خرید</Link>
        <IconChevronLeft size={14} aria-hidden="true" />
        <span>جزئیات درخواست</span>
      </nav>

      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-ink">جزئیات درخواست تأمین</h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="mt-2 text-sm leading-7 text-ink-muted">
            این درخواست فقط مربوط به یک محصول از محصولات شماست.
          </p>
        </div>
        <span dir="ltr" className="text-xs font-black text-ink-muted">
          #{request.supplierRequestId.slice(-8)}
        </span>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)]">
        <div className="space-y-5">
          <Card>
            <CardHeader className="border-b border-line">
              <div>
                <CardTitle>محصول درخواستی</CardTitle>
                <CardDescription>اطلاعات همان قلمی که برای شما ارسال شده است.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {request.product.image ? (
                  <span className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-white">
                    <Image
                      src={request.product.image}
                      alt={request.product.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="grid size-28 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <IconPackage size={40} aria-hidden="true" />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-ink">{request.product.title}</h2>
                  <p className="mt-1 text-sm text-ink-muted">{request.product.brand ?? "بدون برند"}</p>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoItem label="مقدار درخواستی" value={formatRequestedQuantity(request)} />
                    <InfoItem label="وضعیت درخواست" value={status.label} />
                    <InfoItem label="زمان ایجاد" value={formatSupplierRequestDate(request.createdAt)} icon="calendar" />
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          {responded ? <CurrentResponse request={request} /> : null}
        </div>

        <Card className="h-fit xl:sticky xl:top-24">
          <CardHeader className="border-b border-line">
            <div>
              <CardTitle>{responded ? "ویرایش پاسخ" : "ثبت پاسخ"}</CardTitle>
              <CardDescription>
                پاسخ فقط برای همین محصول ثبت می‌شود.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {request.status === "expired" ? (
              <div className="rounded-xl bg-danger-soft p-4 text-sm font-bold leading-7 text-danger">
                مهلت پاسخ‌گویی به این درخواست به پایان رسیده است.
              </div>
            ) : (
              <SupplierResponseForm key={request.updatedAt} request={request} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CurrentResponse({ request }: { request: SupplierRequestView }) {
  const status = supplierRequestStatusConfig[request.status];

  return (
    <Card>
      <CardHeader className="border-b border-line">
        <div>
          <CardTitle>پاسخ ثبت‌شده شما</CardTitle>
          <CardDescription>آخرین پاسخ ذخیره‌شده برای این درخواست.</CardDescription>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </CardHeader>
      <CardContent className="pt-5">
        <dl className="grid gap-3 sm:grid-cols-2">
          {request.offeredPrice !== undefined ? (
            <InfoItem label="قیمت پیشنهادی" value={formatMoney(request.offeredPrice)} />
          ) : null}
          {request.availableQuantity !== undefined ? (
            <InfoItem label="مقدار قابل تأمین" value={numberFormatter.format(request.availableQuantity)} />
          ) : null}
          {request.deliveryDays !== undefined ? (
            <InfoItem
              label="زمان تحویل"
              value={`${numberFormatter.format(request.deliveryDays)} روز`}
              icon="clock"
            />
          ) : null}
          {request.respondedAt ? (
            <InfoItem label="زمان پاسخ" value={formatSupplierRequestDate(request.respondedAt)} icon="calendar" />
          ) : null}
        </dl>
        {request.note ? (
          <div className="mt-4 rounded-xl bg-surface-subtle p-4">
            <p className="text-[10px] font-bold text-ink-muted">یادداشت</p>
            <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-ink">{request.note}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: "calendar" | "clock";
}) {
  const Icon = icon === "calendar" ? IconCalendarTime : icon === "clock" ? IconClock : null;

  return (
    <div className="rounded-xl bg-surface-subtle p-3">
      <dt className="text-[10px] text-ink-muted">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 text-xs font-black text-ink">
        {Icon ? <Icon size={15} className="text-primary" aria-hidden="true" /> : null}
        {value}
      </dd>
    </div>
  );
}
