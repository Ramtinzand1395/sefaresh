"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconCheck,
  IconChecklist,
  IconX,
} from "@tabler/icons-react";
import { reviewInternalPurchaseRequestAction } from "@/app/cafe/requests/actions";
import {
  formatPersianNumber,
  type CafeRequestDetailItemView,
} from "@/components/cafe/requests/cafe-request-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ItemDecision = {
  approvalStatus: "approved" | "rejected";
  approvedQuantity: number;
};

export function RequestReviewForm({
  requestId,
  items,
}: {
  requestId: string;
  items: CafeRequestDetailItemView[];
}) {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Record<string, ItemDecision>>(() => {
    const initial: Record<string, ItemDecision> = {};
    for (const item of items) {
      initial[item.id] = {
        approvalStatus: "approved",
        approvedQuantity: item.quantity,
      };
    }
    return initial;
  });

  const [reviewNote, setReviewNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDecisionChange = (
    itemId: string,
    status: "approved" | "rejected",
    maxQty: number,
  ) => {
    setDecisions((prev) => ({
      ...prev,
      [itemId]: {
        approvalStatus: status,
        approvedQuantity: status === "approved" ? (prev[itemId]?.approvedQuantity || maxQty) : 0,
      },
    }));
  };

  const handleQuantityChange = (itemId: string, qty: number, maxQty: number) => {
    const validQty = Math.max(1, Math.min(qty, maxQty));
    setDecisions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        approvedQuantity: validQty,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that each item has been reviewed
    for (const item of items) {
      const decision = decisions[item.id];
      if (!decision) {
        setError(`لطفاً وضعیت قلم «${item.productTitle || item.customTitle}» را تعیین کنید.`);
        return;
      }
      if (decision.approvalStatus === "approved") {
        if (decision.approvedQuantity <= 0 || decision.approvedQuantity > item.quantity) {
          setError(
            `مقدار تأیید شده برای قلم «${item.productTitle || item.customTitle}» باید بین ۱ تا ${item.quantity} باشد.`,
          );
          return;
        }
      }
    }

    const payload = {
      requestId,
      reviewNote: reviewNote.trim() || undefined,
      items: items.map((item) => ({
        requestItemId: item.id,
        approvalStatus: decisions[item.id].approvalStatus,
        approvedQuantity: decisions[item.id].approvedQuantity,
      })),
    };

    startTransition(async () => {
      const res = await reviewInternalPurchaseRequestAction(payload);
      if (res.status === "success") {
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <h2 className="text-sm font-black text-ink">بررسی اقلام درخواست</h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            وضعیت و مقدار مجاز هر قلم را مشخص کنید. تمام اقلام باید بررسی شوند.
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-primary">
          <IconChecklist size={16} />
          {formatPersianNumber(items.length)} قلم
        </span>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl bg-danger-soft p-3 text-xs font-bold text-danger">
          <IconAlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="space-y-3">
        {items.map((item, index) => {
          const decision = decisions[item.id];
          const isApproved = decision?.approvalStatus === "approved";
          const title = item.productTitle || item.customTitle || "کالای بدون عنوان";

          return (
            <Card
              key={item.id}
              className={`p-4 transition ${
                isApproved
                  ? "border-success/30 bg-white"
                  : "border-danger/30 bg-surface-subtle/40"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                {/* Item Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-surface-subtle text-xs font-bold text-ink-muted">
                      {index + 1}
                    </span>
                    <h3 className="truncate text-sm font-black text-ink">{title}</h3>
                    {item.productBrand ? (
                      <span className="text-xs text-ink-muted">({item.productBrand})</span>
                    ) : null}
                    {!item.productId ? (
                      <span className="rounded bg-violet-soft px-1.5 py-0.5 text-[10px] font-bold text-violet">
                        کالای سفارشی
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                    <span>
                      مقدار درخواستی:{" "}
                      <strong className="text-ink">
                        {formatPersianNumber(item.quantity)} {item.productUnit ?? "عدد"}
                      </strong>
                    </span>

                    {item.note ? (
                      <span>
                        توضیحات: <span className="text-ink">{item.note}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Review Decision Controls */}
                <div className="flex flex-wrap items-center gap-3 border-t border-line/70 pt-3 md:border-0 md:pt-0">
                  <div className="flex rounded-xl border border-line bg-surface-subtle p-0.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => handleDecisionChange(item.id, "approved", item.quantity)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                        isApproved
                          ? "bg-success text-white shadow-sm"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      <IconCheck size={15} />
                      <span>تأیید</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecisionChange(item.id, "rejected", item.quantity)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                        !isApproved
                          ? "bg-danger text-white shadow-sm"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      <IconX size={15} />
                      <span>رد</span>
                    </button>
                  </div>

                  {isApproved ? (
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-ink-muted">
                        مقدار تأیید:
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={decision?.approvedQuantity ?? item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value, 10) || 1,
                            item.quantity,
                          )
                        }
                        className="w-16 rounded-control border border-line bg-white py-1 text-center text-xs font-black text-ink focus:border-primary focus:outline-none"
                      />
                      <span className="text-[11px] text-ink-muted">
                        از {formatPersianNumber(item.quantity)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-danger">رد شده (۰ قلم)</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Review Note */}
      <div>
        <label className="mb-1 block text-xs font-bold text-ink">
          یادداشت بررسی (اختیاری)
        </label>
        <textarea
          rows={2}
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          placeholder="توضیحات تکمیلی یا علت تغییر مقادیر برای ثبت در سابقه..."
          className="w-full rounded-control border border-line bg-surface-subtle p-3 text-xs font-medium text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" loading={isPending} className="w-full sm:w-auto">
          ثبت نهایی بررسی درخواست
        </Button>
      </div>
    </form>
  );
}
