"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconPackage,
  IconSend,
} from "@tabler/icons-react";
import { createRfqAction, type CreateRfqActionState } from "@/app/cafe/shopping-list/actions";
import { RfqDetailsStep } from "@/components/cafe/shopping-list/rfq-details-step";
import { RfqItemSelector } from "@/components/cafe/shopping-list/rfq-item-selector";
import { RfqReviewStep } from "@/components/cafe/shopping-list/rfq-review-step";
import { RfqSuccessState } from "@/components/cafe/shopping-list/rfq-success-state";
import { formatPersianNumber, type ShoppingListItemView } from "@/components/cafe/shopping-list/shopping-list-types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type CreateRfqModalProps = {
  open: boolean;
  onClose: () => void;
  items: ShoppingListItemView[];
  initialSelectedIds?: Set<string>;
};

type Step = 1 | 2 | 3 | 4;

const stepsMeta: { id: Step; label: string; icon: typeof IconPackage }[] = [
  { id: 1, label: "انتخاب اقلام", icon: IconPackage },
  { id: 2, label: "مشخصات استعلام", icon: IconFileText },
  { id: 3, label: "مرور و تأیید", icon: IconCheck },
  { id: 4, label: "ارسال استعلام", icon: IconSend },
];

function getDefaultDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function CreateRfqModalInner({
  onClose,
  items,
  initialSelectedIds,
}: {
  onClose: () => void;
  items: ShoppingListItemView[];
  initialSelectedIds?: Set<string>;
}) {
  const router = useRouter();
  const eligibleItems = items.filter((item) => Boolean(item.productId));

  const [step, setStep] = useState<Step>(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    if (initialSelectedIds && initialSelectedIds.size > 0) {
      return new Set(initialSelectedIds);
    }
    return new Set(eligibleItems.map((i) => i.id));
  });

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const q: Record<string, number> = {};
    for (const item of items) {
      q[item.id] = item.quantity;
    }
    return q;
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const n: Record<string, string> = {};
    for (const item of items) {
      if (item.note) n[item.id] = item.note;
    }
    return n;
  });

  const [title, setTitle] = useState("استعلام خرید هفتگی کافه");
  const [neededAt, setNeededAt] = useState(() => getDefaultDate(7));
  const [expiresAt, setExpiresAt] = useState(() => getDefaultDate(3));

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [successState, setSuccessState] = useState<
    Extract<CreateRfqActionState, { status: "success" }> | null
  >(null);

  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(eligibleItems.map((item) => item.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, qty),
    }));
  };

  const handleNoteChange = (id: string, noteText: string) => {
    setNotes((prev) => ({
      ...prev,
      [id]: noteText,
    }));
  };

  const handleClose = () => {
    if (successState) {
      router.refresh();
    }
    onClose();
  };

  // Step 1 -> Step 2 validation
  const handleProceedToDetails = () => {
    setError(null);
    if (selectedIds.size === 0) {
      setError("حداقل یک قلم کالا از کاتالوگ باید انتخاب شود.");
      return;
    }
    for (const id of selectedIds) {
      const q = quantities[id];
      if (!q || q < 1) {
        setError("تعداد تمام اقلام انتخابی باید حداقل ۱ باشد.");
        return;
      }
    }
    setStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleProceedToReview = () => {
    setError(null);
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "عنوان استعلام الزامی است.";
    } else if (title.trim().length > 200) {
      errors.title = "عنوان استعلام نباید بیشتر از ۲۰۰ کاراکتر باشد.";
    }

    if (expiresAt && neededAt && new Date(expiresAt) > new Date(neededAt)) {
      errors.expiresAt = "مهلت پاسخ تأمین‌کنندگان نمی‌تواند پس از تاریخ نیاز باشد.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("لطفاً خطاهای مشخصات را برطرف کنید.");
      return;
    }

    setFieldErrors({});
    setStep(3);
  };

  // Step 3 -> Submit
  const handleSubmit = () => {
    setError(null);
    setFieldErrors({});

    const payloadItems = Array.from(selectedIds).map((id) => ({
      shoppingListItemId: id,
      quantity: quantities[id] ?? 1,
      note: notes[id]?.trim() || undefined,
    }));

    const payload = {
      title: title.trim(),
      neededAt: neededAt || undefined,
      expiresAt: expiresAt || undefined,
      items: payloadItems,
    };

    startTransition(async () => {
      const response = await createRfqAction(payload);
      if (response.status === "success") {
        setSuccessState(response);
        setStep(4);
      } else if (response.status === "error") {
        setError(response.message);
        if (response.fieldErrors) {
          setFieldErrors(response.fieldErrors);
        }
      }
    });
  };

  const selectedItemsForReview = eligibleItems
    .filter((item) => selectedIds.has(item.id))
    .map((item) => ({
      id: item.id,
      productTitle: item.productTitle,
      productBrand: item.productBrand,
      productUnit: item.productUnit,
      quantity: quantities[item.id] ?? item.quantity,
      note: notes[item.id] ?? item.note,
    }));

  return (
    <div className="space-y-6">
      {/* Progress Stepper */}
      {step < 4 ? (
        <div className="grid grid-cols-3 gap-2 border-b border-line pb-4 text-center">
          {stepsMeta.slice(0, 3).map((s) => {
            const isActive = step === s.id;
            const isPassed = step > s.id;

            return (
              <div
                key={s.id}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition sm:flex-row sm:justify-center ${
                  isActive
                    ? "bg-primary-soft/60 text-primary font-black"
                    : isPassed
                    ? "text-success font-bold"
                    : "text-ink-muted opacity-60"
                }`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-[11px] font-black ${
                    isActive
                      ? "bg-primary text-white"
                      : isPassed
                      ? "bg-success text-white"
                      : "bg-surface-subtle text-ink-muted"
                  }`}
                >
                  {isPassed ? <IconCheck size={14} strokeWidth={3} /> : s.id}
                </span>
                <span className="text-xs">{s.label}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Global Error Banner */}
      {error ? (
        <div className="flex items-center gap-2 rounded-xl bg-danger-soft p-3 text-xs font-bold text-danger">
          <IconAlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Step Contents */}
      {step === 1 ? (
        <RfqItemSelector
          items={items}
          selectedIds={selectedIds}
          quantities={quantities}
          notes={notes}
          onToggleItem={handleToggleItem}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onQuantityChange={handleQuantityChange}
          onNoteChange={handleNoteChange}
        />
      ) : step === 2 ? (
        <RfqDetailsStep
          title={title}
          neededAt={neededAt}
          expiresAt={expiresAt}
          onTitleChange={setTitle}
          onNeededAtChange={setNeededAt}
          onExpiresAtChange={setExpiresAt}
          errors={fieldErrors}
        />
      ) : step === 3 ? (
        <RfqReviewStep
          title={title}
          neededAt={neededAt}
          expiresAt={expiresAt}
          selectedItems={selectedItemsForReview}
          onEditItems={() => setStep(1)}
          onEditDetails={() => setStep(2)}
        />
      ) : step === 4 && successState ? (
        <RfqSuccessState
          purchaseRequestId={successState.purchaseRequestId}
          itemCount={successState.itemCount}
          candidateCount={successState.candidateCount}
          createdCount={successState.createdCount}
          existingCount={successState.existingCount}
          onClose={handleClose}
        />
      ) : null}

      {/* Action Footer */}
      {step < 4 ? (
        <div className="flex w-full flex-col-reverse justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
          {step === 1 ? (
            <Button type="button" variant="secondary" onClick={handleClose}>
              انصراف
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : 1))}
              disabled={isPending}
              className="gap-1.5"
            >
              <IconArrowRight size={16} />
              <span>بازگشت</span>
            </Button>
          )}

          <div className="flex items-center gap-2">
            {step === 1 ? (
              <Button
                type="button"
                onClick={handleProceedToDetails}
                disabled={selectedIds.size === 0}
                className="w-full gap-1.5 sm:w-auto"
              >
                <span>مرحله بعد: مشخصات استعلام</span>
                <IconArrowLeft size={16} />
              </Button>
            ) : step === 2 ? (
              <Button
                type="button"
                onClick={handleProceedToReview}
                className="w-full gap-1.5 sm:w-auto"
              >
                <span>مرحله بعد: مرور نهایی</span>
                <IconArrowLeft size={16} />
              </Button>
            ) : step === 3 ? (
              <Button
                type="button"
                onClick={handleSubmit}
                loading={isPending}
                className="w-full gap-2 sm:w-auto"
              >
                <IconSend size={18} />
                <span>تأیید و ارسال استعلام ({formatPersianNumber(selectedIds.size)} قلم)</span>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CreateRfqModal({
  open,
  onClose,
  items,
  initialSelectedIds,
}: CreateRfqModalProps) {
  return (
    <Modal
      open={open}
      title="استعلام قیمت از تأمین‌کنندگان (RFQ)"
      description="تبدیل اقلام لیست خرید به درخواست رسمی استعلام قیمت برای تأمین‌کنندگان واجد شرایط"
      width="lg"
      onClose={onClose}
    >
      {open ? (
        <CreateRfqModalInner
          onClose={onClose}
          items={items}
          initialSelectedIds={initialSelectedIds}
        />
      ) : null}
    </Modal>
  );
}
