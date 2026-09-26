"use client";

import { useMemo, useState } from "react";
import {
  IconAlertCircle,
  IconClock,
  IconPackage,
  IconSortDescending,
  IconX,
} from "@tabler/icons-react";
import {
  findBestOffersHighlights,
  formatPersianNumber,
  sortSupplierOffers,
  type OfferSortOption,
  type RfqRequestedItemView,
} from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import { RfqOfferCard } from "@/components/cafe/requests/rfq-comparison/rfq-offer-card";
import { Badge } from "@/components/ui/badge";

type RfqItemSectionProps = {
  item: RfqRequestedItemView;
  selectedOfferId?: string;
  onSelectOffer: (requestItemId: string, supplierRequestId: string) => void;
};

export function RfqItemSection({
  item,
  selectedOfferId,
  onSelectOffer,
}: RfqItemSectionProps) {
  const [sortBy, setSortBy] = useState<OfferSortOption>("lowest_price");

  const sortedOffers = useMemo(() => {
    return sortSupplierOffers(item.offers, sortBy);
  }, [item.offers, sortBy]);

  const highlights = useMemo(() => {
    return findBestOffersHighlights(item.offers);
  }, [item.offers]);

  const hasOffers = item.offers.length > 0;
  const hasCommercialOffers = item.commercialOffersCount > 0;
  const allPending = hasOffers && item.pendingOffersCount === item.offers.length;
  const allUnavailable =
    hasOffers &&
    item.unavailableOffersCount === item.offers.length &&
    item.commercialOffersCount === 0;

  return (
    <section className="space-y-4 rounded-3xl border border-line bg-white p-5 shadow-xs sm:p-6">
      {/* Product Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary shadow-xs">
            <IconPackage size={24} />
          </span>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-ink">{item.productTitle}</h3>
              {item.productBrand ? (
                <Badge variant="neutral" className="text-[11px]">
                  {item.productBrand}
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
              <span>
                مقدار مورد نیاز:{" "}
                <strong className="text-ink font-bold">
                  {formatPersianNumber(item.requestedQuantity)} {item.productUnit}
                </strong>
              </span>

              {item.note ? (
                <span>• توضیح: {item.note}</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Coverage badge & Sort Control */}
        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
          <Badge
            variant={hasCommercialOffers ? "success" : "neutral"}
            className="text-xs"
          >
            {hasCommercialOffers
              ? `${formatPersianNumber(item.commercialOffersCount)} پیشنهاد قیمت فعال`
              : `${formatPersianNumber(item.offers.length)} پاسخ`}
          </Badge>

          {hasCommercialOffers ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-subtle px-2.5 py-1.5 text-xs">
              <IconSortDescending size={16} className="text-ink-muted" />
              <label htmlFor={`sort-select-${item.requestItemId}`} className="sr-only">
                مرتب‌سازی پیشنهادها
              </label>
              <select
                id={`sort-select-${item.requestItemId}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as OfferSortOption)}
                className="bg-transparent font-bold text-ink outline-none cursor-pointer"
              >
                <option value="lowest_price">کمترین قیمت واحد</option>
                <option value="fastest_delivery">سریع‌ترین تحویل</option>
                <option value="highest_rating">بالاترین امتیاز تأمین‌کننده</option>
                <option value="availability">تأمین کامل موجودی</option>
              </select>
            </div>
          ) : null}
        </div>
      </div>

      {/* Offers Grid or Zero-Offer State */}
      {hasCommercialOffers ? (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {sortedOffers.map((offer) => (
            <RfqOfferCard
              key={offer.supplierRequestId}
              offer={offer}
              requestedQuantity={item.requestedQuantity}
              unit={item.productUnit}
              isSelected={selectedOfferId === offer.supplierRequestId}
              isLowestPrice={highlights.lowestPriceId === offer.supplierRequestId}
              isFastestDelivery={highlights.fastestDeliveryId === offer.supplierRequestId}
              onSelect={() => onSelectOffer(item.requestItemId, offer.supplierRequestId)}
            />
          ))}
        </div>
      ) : allPending ? (
        <div className="flex items-center gap-3 rounded-2xl border border-line/80 bg-surface-subtle/70 p-5 text-xs text-ink-muted">
          <IconClock size={20} className="text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-ink">در انتظار پاسخ تأمین‌کنندگان</h4>
            <p className="mt-0.5 leading-5">
              درخواست استعلام برای تأمین‌کنندگان ارسال شده و هنوز پاسخی دریافت نشده است.
            </p>
          </div>
        </div>
      ) : allUnavailable ? (
        <div className="flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger-soft/30 p-5 text-xs text-danger">
          <IconX size={20} className="shrink-0" />
          <div>
            <h4 className="font-bold">عدم موجودی توسط تأمین‌کنندگان</h4>
            <p className="mt-0.5 leading-5">
              هیچ تأمین‌کننده‌ای موجودی این کالا را تأیید نکرده است.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 text-xs text-amber-800">
          <IconAlertCircle size={20} className="shrink-0 text-amber-600" />
          <div>
            <h4 className="font-bold text-amber-900">پیشنهادی ثبت نشده است</h4>
            <p className="mt-0.5 leading-5">
              برای این کالا هنوز پیشنهاد معتبری دریافت نشده است.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
