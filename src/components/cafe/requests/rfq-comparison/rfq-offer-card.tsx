"use client";

import {
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconShieldCheckFilled,
  IconStarFilled,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import {
  formatPersianNumber,
  formatToman,
  type RfqSupplierOfferView,
} from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RfqOfferCardProps = {
  offer: RfqSupplierOfferView;
  requestedQuantity: number;
  unit: string;
  isSelected: boolean;
  isLowestPrice?: boolean;
  isFastestDelivery?: boolean;
  onSelect: () => void;
};

export function RfqOfferCard({
  offer,
  requestedQuantity,
  unit,
  isSelected,
  isLowestPrice = false,
  isFastestDelivery = false,
  onSelect,
}: RfqOfferCardProps) {
  const isAvailable = offer.status === "available";
  const isPartial = offer.status === "partially_available";
  const isDeclined = offer.status === "declined";
  const isUnavailable = offer.status === "unavailable";
  const isPending = offer.status === "pending" || offer.status === "viewed";

  const availableQty = offer.availableQuantity ?? (isAvailable ? requestedQuantity : 0);

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-4 transition ${
        isSelected
          ? "border-primary bg-primary-soft/15 shadow-md ring-2 ring-primary/30"
          : offer.isCommercial
          ? "border-line bg-white hover:border-primary/40 hover:shadow-sm"
          : "border-line/70 bg-surface-subtle/50 opacity-70"
      }`}
    >
      {/* Top Badges / Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {offer.isCommercial && isLowestPrice ? (
            <Badge variant="success" className="gap-1 text-[10px]">
              <span>کمترین قیمت</span>
            </Badge>
          ) : null}
          {offer.isCommercial && isFastestDelivery && offer.deliveryDays !== undefined ? (
            <Badge variant="info" className="gap-1 text-[10px]">
              <span>سریع‌ترین تحویل</span>
            </Badge>
          ) : null}
          {offer.isFullSupply ? (
            <Badge variant="success" className="text-[10px]">
              تأمین کامل
            </Badge>
          ) : isPartial ? (
            <Badge variant="warning" className="text-[10px]">
              تأمین جزئی
            </Badge>
          ) : null}
        </div>

        <div>
          {isAvailable ? (
            <Badge variant="success" className="text-[10px]">
              موجود
            </Badge>
          ) : isPartial ? (
            <Badge variant="warning" className="text-[10px]">
              کسری موجودی
            </Badge>
          ) : isUnavailable ? (
            <Badge variant="danger" className="text-[10px]">
              عدم موجودی
            </Badge>
          ) : isDeclined ? (
            <Badge variant="danger" className="text-[10px]">
              رد شده
            </Badge>
          ) : isPending ? (
            <Badge variant="neutral" className="text-[10px]">
              در انتظار پاسخ
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Supplier Info */}
      <div className="space-y-1 pb-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-black text-ink">{offer.supplierName}</h4>
          {offer.isVerified ? (
            <span title="تأمین‌کننده معتبر" className="text-primary">
              <IconShieldCheckFilled size={17} />
            </span>
          ) : null}
        </div>

        {offer.supplierRating > 0 ? (
          <div className="flex items-center gap-1 text-[11px] text-amber-600">
            <IconStarFilled size={13} />
            <span className="font-bold">{formatPersianNumber(offer.supplierRating)}</span>
            <span className="text-ink-muted">از ۵</span>
          </div>
        ) : null}
      </div>

      {/* Commercial Details */}
      {offer.isCommercial ? (
        <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-line/60 bg-surface-subtle/60 p-2.5 text-xs">
          <div>
            <span className="text-[10px] font-bold text-ink-muted">قیمت واحد:</span>
            <p className="mt-0.5 font-black text-ink">
              {offer.offeredPrice !== undefined ? formatToman(offer.offeredPrice) : "—"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-ink-muted">موجودی اعلامی:</span>
            <p className="mt-0.5 font-bold text-ink">
              {isPartial ? (
                <span className="font-black text-amber-700">
                  {formatPersianNumber(availableQty)} از {formatPersianNumber(requestedQuantity)} {unit}
                </span>
              ) : (
                <span>
                  {formatPersianNumber(availableQty)} از {formatPersianNumber(requestedQuantity)} {unit}
                </span>
              )}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-ink-muted">مجموع این قلم:</span>
            <p className="mt-0.5 font-black text-primary">
              {offer.totalPrice !== undefined ? formatToman(offer.totalPrice) : "—"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-ink-muted">زمان تحویل:</span>
            <p className="mt-0.5 flex items-center gap-1 font-bold text-ink">
              <IconTruck size={14} className="text-ink-muted" />
              <span>
                {offer.deliveryDays !== undefined
                  ? `${formatPersianNumber(offer.deliveryDays)} روز`
                  : "تعیین‌نشده"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line p-3 text-center text-xs text-ink-muted">
          {isPending ? (
            <p className="flex items-center justify-center gap-1.5">
              <IconClock size={15} />
              <span>تأمین‌کننده هنوز پاسخی ثبت نکرده است.</span>
            </p>
          ) : isUnavailable ? (
            <p className="flex items-center justify-center gap-1.5 text-danger">
              <IconX size={15} />
              <span>این کالا در انبار تأمین‌کننده موجود نیست.</span>
            </p>
          ) : isDeclined ? (
            <p className="flex items-center justify-center gap-1.5 text-danger">
              <IconAlertCircle size={15} />
              <span>درخواست توسط تأمین‌کننده رد شده است.</span>
            </p>
          ) : (
            <p>پیشنهاد نامعتبر یا منقضی شده است.</p>
          )}
        </div>
      )}

      {/* Note if present */}
      {offer.note ? (
        <p className="mt-2 text-[11px] leading-5 text-ink-muted">
          توضیحات: {offer.note}
        </p>
      ) : null}

      {/* Selection CTA */}
      <div className="pt-3">
        {offer.isCommercial ? (
          <Button
            type="button"
            variant={isSelected ? "primary" : "secondary"}
            size="sm"
            onClick={onSelect}
            className="w-full gap-1.5"
            aria-pressed={isSelected}
          >
            {isSelected ? (
              <>
                <IconCheck size={16} strokeWidth={3} />
                <span>انتخاب‌شده</span>
              </>
            ) : (
              <span>انتخاب این پیشنهاد</span>
            )}
          </Button>
        ) : (
          <Button type="button" variant="secondary" size="sm" disabled className="w-full opacity-50">
            غیرقابل انتخاب
          </Button>
        )}
      </div>
    </div>
  );
}
