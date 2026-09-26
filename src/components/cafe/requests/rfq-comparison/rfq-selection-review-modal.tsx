"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconCheck,
  IconDeviceFloppy,
  IconPackage,
  IconTruck,
} from "@tabler/icons-react";
import { saveRfqSelectionAction } from "@/app/cafe/requests/[id]/actions";
import {
  formatPersianNumber,
  formatToman,
  type RfqRequestedItemView,
  type RfqSupplierOfferView,
} from "@/components/cafe/requests/rfq-comparison/rfq-comparison-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type SelectedItemPreview = {
  item: RfqRequestedItemView;
  selectedOffer: RfqSupplierOfferView;
};

type RfqSelectionReviewModalProps = {
  open: boolean;
  onClose: () => void;
  purchaseRequestId: string;
  selectedPreviews: SelectedItemPreview[];
  estimatedTotal: number;
};

export function RfqSelectionReviewModal({
  open,
  onClose,
  purchaseRequestId,
  selectedPreviews,
  estimatedTotal,
}: RfqSelectionReviewModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);

    const payload = {
      purchaseRequestId,
      items: selectedPreviews.map(({ item, selectedOffer }) => ({
        requestItemId: item.requestItemId,
        supplierRequestId: selectedOffer.supplierRequestId,
      })),
    };

    startTransition(async () => {
      const response = await saveRfqSelectionAction(payload);
      if (response.status === "success") {
        setSuccessMessage(response.message);
        router.refresh();
      } else if (response.status === "error") {
        setError(response.message);
      }
    });
  };

  const handleModalClose = () => {
    if (successMessage) {
      router.refresh();
    }
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="مرور و ذخیره انتخاب پیشنهادها"
      description="پیشنهادهای انتخابی شما به عنوان مبنای صدور سبد خرید در مرحله بعد ثبت خواهند شد."
      width="lg"
      onClose={handleModalClose}
      footer={
        successMessage ? (
          <div className="flex w-full justify-end">
            <Button type="button" onClick={handleModalClose}>
              متوجه شدم
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
              disabled={isPending}
            >
              بازگشت و تغییر
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              loading={isPending}
              className="gap-2"
            >
              <IconDeviceFloppy size={18} />
              <span>تأیید و ذخیره نهایی</span>
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-5">
        {/* Error Alert */}
        {error ? (
          <div className="flex items-center gap-2 rounded-xl bg-danger-soft p-3 text-xs font-bold text-danger">
            <IconAlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Success Alert */}
        {successMessage ? (
          <div className="flex items-center gap-2 rounded-xl bg-success-soft p-4 text-xs font-bold text-success">
            <IconCheck size={22} className="shrink-0" />
            <div className="space-y-0.5">
              <p className="text-sm font-black">{successMessage}</p>
              <p className="text-[11px] font-normal text-ink-muted">
                انتخاب شما ذخیره شد و در بخش تدارکات کافه قابل مشاهده و پیگیری است.
              </p>
            </div>
          </div>
        ) : null}

        {/* Items List */}
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface-subtle/30 overflow-hidden">
          {selectedPreviews.map(({ item, selectedOffer }) => {
            const isPartial = selectedOffer.status === "partially_available";
            const effectiveQty = isPartial
              ? selectedOffer.availableQuantity ?? item.requestedQuantity
              : item.requestedQuantity;
            const subtotal = (selectedOffer.offeredPrice ?? 0) * effectiveQty;

            return (
              <div
                key={item.requestItemId}
                className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary">
                      <IconPackage size={16} />
                    </span>
                    <h4 className="text-sm font-black text-ink">
                      {item.productTitle}
                    </h4>
                    {isPartial ? (
                      <Badge variant="warning" className="text-[10px]">
                        کسری موجودی
                      </Badge>
                    ) : null}
                  </div>

                  <p className="text-xs text-ink-muted">
                    تأمین‌کننده انتخابی:{" "}
                    <strong className="text-ink font-bold">
                      {selectedOffer.supplierName}
                    </strong>
                    {selectedOffer.deliveryDays !== undefined ? (
                      <span className="mr-2 inline-flex items-center gap-1 text-[11px]">
                        <IconTruck size={13} />
                        {formatPersianNumber(selectedOffer.deliveryDays)} روز کاری
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-line/60 pt-2 sm:border-0 sm:pt-0 sm:text-left">
                  <div className="text-right sm:text-left">
                    <span className="text-xs font-bold text-ink">
                      {formatPersianNumber(effectiveQty)} {item.productUnit} ×{" "}
                      {formatToman(selectedOffer.offeredPrice ?? 0)}
                    </span>
                    <p className="text-xs font-black text-primary">
                      {formatToman(subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="flex items-center justify-between rounded-xl bg-surface-subtle p-4">
          <span className="text-xs font-bold text-ink-muted">
            مجموع برآورد سفارش ({formatPersianNumber(selectedPreviews.length)} قلم کالا):
          </span>
          <span className="text-base font-black text-primary">
            {formatToman(estimatedTotal)}
          </span>
        </div>
      </div>
    </Modal>
  );
}
