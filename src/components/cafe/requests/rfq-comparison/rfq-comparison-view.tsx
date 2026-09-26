"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBuildingStore,
} from "@tabler/icons-react";
import {
  type RfqComparisonDetailView,
} from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import { RfqItemSection } from "@/components/cafe/requests/rfq-comparison/rfq-item-section";
import { RfqOverviewHeader } from "@/components/cafe/requests/rfq-comparison/rfq-overview-header";
import { RfqSelectionReviewModal } from "@/components/cafe/requests/rfq-comparison/rfq-selection-review-modal";
import { RfqStickySummary } from "@/components/cafe/requests/rfq-comparison/rfq-sticky-summary";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function RfqComparisonView({
  detail,
}: {
  detail: RfqComparisonDetailView;
}) {
  const { purchaseRequest, metrics, items, selection } = detail;

  // Initial selection map: requestItemId -> supplierRequestId
  const [selectedOffers, setSelectedOffers] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (selection?.items) {
      for (const item of selection.items) {
        map[item.requestItemId] = item.supplierRequestId;
      }
    } else {
      for (const item of items) {
        if (item.selectedSupplierRequestId) {
          map[item.requestItemId] = item.selectedSupplierRequestId;
        }
      }
    }
    return map;
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Items that have at least one valid commercial response
  const itemsWithCommercialOffers = useMemo(() => {
    return items.filter((item) => item.commercialOffersCount > 0);
  }, [items]);

  const itemsWithoutCommercialOffers = useMemo(() => {
    return items.filter((item) => item.commercialOffersCount === 0);
  }, [items]);

  const handleSelectOffer = (requestItemId: string, supplierRequestId: string) => {
    setSelectedOffers((prev) => ({
      ...prev,
      [requestItemId]: supplierRequestId,
    }));
  };

  const selectedCount = useMemo(() => {
    let count = 0;
    for (const item of itemsWithCommercialOffers) {
      if (selectedOffers[item.requestItemId]) {
        count++;
      }
    }
    return count;
  }, [itemsWithCommercialOffers, selectedOffers]);

  const isComplete =
    itemsWithCommercialOffers.length > 0 &&
    selectedCount === itemsWithCommercialOffers.length;

  // Selected previews and estimated total calculation
  const { selectedPreviews, estimatedTotal } = useMemo(() => {
    const previews: Array<{
      item: (typeof items)[0];
      selectedOffer: (typeof items)[0]["offers"][0];
    }> = [];
    let total = 0;

    for (const item of itemsWithCommercialOffers) {
      const selectedId = selectedOffers[item.requestItemId];
      if (!selectedId) continue;

      const offer = item.offers.find((o) => o.supplierRequestId === selectedId);
      if (offer && offer.isCommercial && offer.offeredPrice !== undefined) {
        previews.push({ item, selectedOffer: offer });
        const effectiveQty =
          offer.status === "partially_available"
            ? offer.availableQuantity ?? item.requestedQuantity
            : item.requestedQuantity;
        total += offer.offeredPrice * effectiveQty;
      }
    }

    return { selectedPreviews: previews, estimatedTotal: total };
  }, [itemsWithCommercialOffers, selectedOffers]);

  // Zero-candidates empty RFQ state
  if (metrics.invitedSuppliersCount === 0) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/cafe/requests"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted transition hover:text-ink"
          >
            <IconArrowRight size={16} />
            <span>بازگشت به درخواست‌ها</span>
          </Link>
        </div>

        <Card className="mx-auto my-6 max-w-xl">
          <EmptyState
            icon={IconBuildingStore}
            title="برای این استعلام تأمین‌کننده واجد شرایطی پیدا نشده است."
            description="در زمان ایجاد این استعلام، تأمین‌کننده فعالی با کالای منطبق در سامانه یافت نشد. می‌توانید اقلام را در لیست خرید بررسی و در فرصت دیگری استعلام ارسال کنید."
            action={
              <Link
                href="/cafe/shopping-list"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
              >
                <span>بازگشت به لیست خرید</span>
                <IconArrowLeft size={16} />
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-28">
      {/* Overview Header */}
      <RfqOverviewHeader rfq={purchaseRequest} metrics={metrics} />

      {/* Items Comparison List */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-black text-ink">
            پیشنهادهای تأمین‌کنندگان به تفکیک اقلام درخواستی
          </h2>
          <p className="text-xs text-ink-muted">
            برای هر قلم کالا بهترین پیشنهاد را بر اساس قیمت، زمان تحویل و اعتبار تأمین‌کننده انتخاب کنید.
          </p>
        </div>

        {itemsWithCommercialOffers.map((item) => (
          <RfqItemSection
            key={item.requestItemId}
            item={item}
            selectedOfferId={selectedOffers[item.requestItemId]}
            onSelectOffer={handleSelectOffer}
          />
        ))}

        {/* Items without commercial offers shown separately */}
        {itemsWithoutCommercialOffers.length > 0 ? (
          <div className="space-y-4 pt-4">
            <div className="border-t border-line/80 pt-6">
              <h3 className="text-sm font-black text-ink-muted">
                اقلام بدون پیشنهاد قیمت معتبر ({itemsWithoutCommercialOffers.length} قلم)
              </h3>
              <p className="text-xs text-ink-muted">
                این اقلام در حال حاضر پیشنهاد فعالی از سوی تأمین‌کنندگان ندارند و در انتخاب نهایی شرکت داده نمی‌شوند.
              </p>
            </div>

            {itemsWithoutCommercialOffers.map((item) => (
              <RfqItemSection
                key={item.requestItemId}
                item={item}
                selectedOfferId={undefined}
                onSelectOffer={() => {}}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Sticky Bottom Summary Bar */}
      {itemsWithCommercialOffers.length > 0 ? (
        <RfqStickySummary
          selectedCount={selectedCount}
          requiredCount={itemsWithCommercialOffers.length}
          estimatedTotal={estimatedTotal}
          isComplete={isComplete}
          onOpenReview={() => setIsReviewModalOpen(true)}
        />
      ) : null}

      {/* Review & Confirmation Modal */}
      <RfqSelectionReviewModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        purchaseRequestId={purchaseRequest.id}
        selectedPreviews={selectedPreviews}
        estimatedTotal={estimatedTotal}
      />
    </div>
  );
}
