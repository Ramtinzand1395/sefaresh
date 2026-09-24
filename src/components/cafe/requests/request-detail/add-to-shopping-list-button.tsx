"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  IconAlertCircle,
  IconCheck,
  IconFileText,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import { addApprovedRequestToShoppingListAction } from "@/app/cafe/requests/actions";
import { Button } from "@/components/ui/button";

export function AddToShoppingListButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleAdd = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await addApprovedRequestToShoppingListAction(requestId);
      if (res.status === "success") {
        setFeedback({ type: "success", message: res.message });
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary-soft/30 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-black text-ink">
          انتقال اقلام تأییدشده به لیست خرید
        </p>
        <p className="text-[11px] leading-5 text-ink-muted">
          اقلام این درخواست پس از تأیید می‌توانند مستقیماً به لیست خرید جاری کافه افزوده شوند.
        </p>

        {feedback ? (
          <div
            className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${
              feedback.type === "success" ? "text-success" : "text-danger"
            }`}
          >
            {feedback.type === "success" ? (
              <IconCheck size={16} />
            ) : (
              <IconAlertCircle size={16} />
            )}
            <span>{feedback.message}</span>
            {feedback.type === "success" ? (
              <Link
                href="/cafe/shopping-list"
                className="mr-2 inline-flex items-center gap-1 text-primary underline hover:text-primary-hover"
              >
                <IconFileText size={14} />
                مشاهده لیست خرید
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        loading={isPending}
        className="shrink-0 gap-1.5"
      >
        <IconShoppingCartPlus size={18} />
        <span>افزودن اقلام تأییدشده به لیست خرید</span>
      </Button>
    </div>
  );
}
