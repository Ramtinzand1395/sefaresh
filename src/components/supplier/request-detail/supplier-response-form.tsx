"use client";

import { useActionState, useState } from "react";
import { IconCheck, IconPackageOff, IconX } from "@tabler/icons-react";
import { submitSupplierResponse } from "@/app/supplier/requests/actions";
import {
  hasSupplierResponse,
  type SupplierRequestView,
  type SupplierResponseActionState,
  type SupplierResponseStatus,
} from "@/components/supplier/requests/supplier-request-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const initialState: SupplierResponseActionState = {
  status: "idle",
  message: "",
};

const responseOptions: Array<{
  value: SupplierResponseStatus;
  label: string;
  description: string;
  icon: typeof IconCheck;
}> = [
  {
    value: "available",
    label: "موجود است",
    description: "کل مقدار درخواستی قابل تأمین است.",
    icon: IconCheck,
  },
  {
    value: "partially_available",
    label: "موجودی جزئی",
    description: "بخشی از مقدار درخواستی قابل تأمین است.",
    icon: IconCheck,
  },
  {
    value: "unavailable",
    label: "ناموجود",
    description: "در حال حاضر موجودی این محصول کافی نیست.",
    icon: IconPackageOff,
  },
  {
    value: "declined",
    label: "رد درخواست",
    description: "قصد پاسخ‌گویی به این درخواست را ندارید.",
    icon: IconX,
  },
];

export function SupplierResponseForm({ request }: { request: SupplierRequestView }) {
  const defaultStatus = hasSupplierResponse(request.status) ? request.status : "available";
  const [selectedStatus, setSelectedStatus] = useState<SupplierResponseStatus>(defaultStatus);
  const [state, formAction, pending] = useActionState(submitSupplierResponse, initialState);
  const needsCommercialFields = selectedStatus === "available" || selectedStatus === "partially_available";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="supplierRequestId" value={request.supplierRequestId} />
      <input type="hidden" name="status" value={selectedStatus} />

      <fieldset disabled={pending}>
        <legend className="text-sm font-black text-ink">وضعیت تأمین</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {responseOptions.map((option) => {
            const Icon = option.icon;
            const selected = selectedStatus === option.value;

            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                  selected
                    ? "border-primary bg-primary-soft/50"
                    : "border-line bg-white hover:border-primary/30",
                )}
              >
                <input
                  type="radio"
                  name="responseStatusChoice"
                  value={option.value}
                  checked={selected}
                  onChange={() => setSelectedStatus(option.value)}
                  className="sr-only"
                />
                <span className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg",
                  selected ? "bg-primary text-white" : "bg-surface-subtle text-ink-muted",
                )}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-xs font-black text-ink">{option.label}</strong>
                  <span className="mt-1 block text-[10px] leading-5 text-ink-muted">{option.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {needsCommercialFields ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="قیمت پیشنهادی"
            htmlFor="offered-price"
            error={state.fieldErrors?.offeredPrice}
          >
            <div className="relative">
              <input
                id="offered-price"
                name="offeredPrice"
                type="number"
                min={0}
                step={1}
                required
                disabled={pending}
                defaultValue={request.offeredPrice}
                aria-invalid={Boolean(state.fieldErrors?.offeredPrice) || undefined}
                className={inputClassName}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-muted">تومان</span>
            </div>
          </Field>

          <Field
            label="مقدار قابل تأمین"
            htmlFor="available-quantity"
            error={state.fieldErrors?.availableQuantity}
          >
            <input
              id="available-quantity"
              name="availableQuantity"
              type="number"
              step="any"
              required
              disabled={pending}
              defaultValue={request.availableQuantity}
              aria-invalid={Boolean(state.fieldErrors?.availableQuantity) || undefined}
              className={inputClassName}
            />
          </Field>

          <Field
            label="زمان تحویل (روز، اختیاری)"
            htmlFor="delivery-days"
            error={state.fieldErrors?.deliveryDays}
          >
            <input
              id="delivery-days"
              name="deliveryDays"
              type="number"
              min={0}
              step={1}
              disabled={pending}
              defaultValue={request.deliveryDays}
              aria-invalid={Boolean(state.fieldErrors?.deliveryDays) || undefined}
              className={inputClassName}
            />
          </Field>
        </div>
      ) : null}

      <Field label="یادداشت (اختیاری)" htmlFor="supplier-note" error={state.fieldErrors?.note}>
        <textarea
          id="supplier-note"
          name="note"
          rows={4}
          disabled={pending}
          defaultValue={request.note}
          aria-invalid={Boolean(state.fieldErrors?.note) || undefined}
          placeholder="توضیحی که برای این پاسخ لازم است وارد کنید."
          className={cn(inputClassName, "min-h-28 resize-y py-3")}
        />
      </Field>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "rounded-xl px-3 py-2.5 text-xs font-bold leading-6",
            state.status === "success"
              ? "bg-success-soft text-success"
              : "bg-danger-soft text-danger",
          )}
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto sm:min-w-44">
        {hasSupplierResponse(request.status) ? "ذخیره تغییرات پاسخ" : "ثبت پاسخ"}
      </Button>
    </form>
  );
}

const inputClassName =
  "min-h-11 w-full rounded-control border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-surface-subtle aria-[invalid=true]:border-danger";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-black text-ink">{label}</label>
      {children}
      {error ? <p className="mt-1 text-[10px] font-bold text-danger">{error}</p> : null}
    </div>
  );
}
