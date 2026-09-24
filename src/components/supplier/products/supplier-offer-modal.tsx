"use client";

import { useActionState, useState, useTransition } from "react";
import { IconCheck, IconSearch } from "@tabler/icons-react";
import {
  createSupplierOfferAction,
  searchCatalogProductsAction,
  updateSupplierOfferAction,
} from "@/app/supplier/products/actions";
import { ProductThumbnail } from "@/components/supplier/products/product-thumbnail";
import {
  formatProductUnit,
  type CatalogProductView,
  type SupplierOfferActionState,
  type SupplierOfferView,
} from "@/components/supplier/products/supplier-offer-types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";

const initialState: SupplierOfferActionState = { status: "idle", message: "" };
const inputClassName =
  "min-h-11 w-full rounded-control border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-surface-subtle aria-[invalid=true]:border-danger";

export function CreateSupplierOfferModal({
  open,
  initialProducts,
  onClose,
  onEditExisting,
}: {
  open: boolean;
  initialProducts: CatalogProductView[];
  onClose: () => void;
  onEditExisting: (offerId: string) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="افزودن محصول"
      description="ابتدا محصول مرکزی را انتخاب کنید و سپس شرایط فروش خود را ثبت کنید."
      width="lg"
    >
      <CreateOfferForm
        initialProducts={initialProducts}
        onClose={onClose}
        onEditExisting={onEditExisting}
      />
    </Modal>
  );
}

function CreateOfferForm({
  initialProducts,
  onClose,
  onEditExisting,
}: {
  initialProducts: CatalogProductView[];
  onClose: () => void;
  onEditExisting: (offerId: string) => void;
}) {
  const [state, formAction, pending] = useActionState(createSupplierOfferAction, initialState);
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searching, startSearch] = useTransition();

  const searchProducts = () => {
    startSearch(async () => {
      try {
        setProducts(await searchCatalogProductsAction(query));
        setSearchError("");
      } catch {
        setSearchError("جستجوی کاتالوگ با خطا روبه‌رو شد.");
      }
    });
  };

  if (state.status === "success") {
    return <SuccessState message={state.message} onClose={onClose} />;
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="productId" value={selectedProductId} />

      <section>
        <h3 className="text-sm font-black text-ink">۱. انتخاب از کاتالوگ مرکزی</h3>
        <div className="mt-3 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  searchProducts();
                }
              }}
              placeholder="نام محصول یا برند..."
              className={cn(inputClassName, "pr-10")}
            />
          </div>
          <Button type="button" variant="secondary" loading={searching} onClick={searchProducts}>جستجو</Button>
        </div>
        {searchError ? <p role="alert" className="mt-2 text-xs font-bold text-danger">{searchError}</p> : null}
        {state.fieldErrors?.productId ? <p role="alert" className="mt-2 text-xs font-bold text-danger">{state.fieldErrors.productId}</p> : null}

        <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto rounded-xl border border-line p-2 sm:grid-cols-2">
          {products.length ? products.map((product) => {
            const selected = selectedProductId === product.productId;
            return (
              <label
                key={product.productId}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition",
                  selected ? "border-primary bg-primary-soft/50" : "border-line hover:border-primary/30",
                )}
              >
                <input
                  type="radio"
                  name="catalogProduct"
                  value={product.productId}
                  checked={selected}
                  onChange={() => setSelectedProductId(product.productId)}
                  className="sr-only"
                />
                <ProductThumbnail src={product.image} alt={product.title} size="sm" />
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-xs font-black text-ink">{product.title}</strong>
                  <span className="mt-1 block truncate text-[10px] text-ink-muted">{product.brand ?? "بدون برند"}</span>
                  <span className="mt-1 block text-[10px] font-bold text-primary">{formatProductUnit(product)}</span>
                </span>
                {selected ? <IconCheck size={18} className="shrink-0 text-primary" aria-hidden="true" /> : null}
              </label>
            );
          }) : (
            <p className="p-5 text-center text-xs text-ink-muted sm:col-span-2">محصول فعالی با این عبارت پیدا نشد.</p>
          )}
        </div>
      </section>

      <section className="border-t border-line pt-5">
        <h3 className="text-sm font-black text-ink">۲. شرایط فروش شما</h3>
        <OfferFields state={state} pending={pending} />
        <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-surface-subtle px-3 text-xs font-bold text-ink">
          Offer از ابتدا فعال باشد
          <input type="checkbox" name="isActive" defaultChecked disabled={pending} className="size-4 accent-primary" />
        </label>
      </section>

      <ActionMessage state={state} />
      {state.existingOfferId ? (
        <Button type="button" variant="secondary" onClick={() => onEditExisting(state.existingOfferId!)}>
          ویرایش Offer موجود
        </Button>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button type="button" variant="secondary" onClick={onClose}>انصراف</Button>
        <Button type="submit" loading={pending} className="sm:min-w-36">افزودن محصول</Button>
      </div>
    </form>
  );
}

export function EditSupplierOfferModal({
  offer,
  onClose,
}: {
  offer: SupplierOfferView | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={Boolean(offer)}
      onClose={onClose}
      title="ویرایش Offer"
      description="اطلاعات محصول مرکزی ثابت است؛ فقط شرایط فروش شما تغییر می‌کند."
      width="md"
    >
      {offer ? <EditOfferForm key={offer.updatedAt} offer={offer} onClose={onClose} /> : <span />}
    </Modal>
  );
}

function EditOfferForm({ offer, onClose }: { offer: SupplierOfferView; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(updateSupplierOfferAction, initialState);

  if (state.status === "success") {
    return <SuccessState message={state.message} onClose={onClose} />;
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="offerId" value={offer.offerId} />
      <div className="flex items-center gap-3 rounded-xl bg-surface-subtle p-3">
        <ProductThumbnail src={offer.product.image} alt={offer.product.title} size="sm" />
        <div className="min-w-0">
          <strong className="block truncate text-sm font-black text-ink">{offer.product.title}</strong>
          <span className="mt-1 block text-xs text-ink-muted">{offer.product.brand ?? "بدون برند"} · {formatProductUnit(offer.product)}</span>
        </div>
      </div>
      <OfferFields state={state} pending={pending} offer={offer} />
      <ActionMessage state={state} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button type="button" variant="secondary" onClick={onClose}>انصراف</Button>
        <Button type="submit" loading={pending} className="sm:min-w-36">ذخیره تغییرات</Button>
      </div>
    </form>
  );
}

function OfferFields({
  state,
  pending,
  offer,
}: {
  state: SupplierOfferActionState;
  pending: boolean;
  offer?: SupplierOfferView;
}) {
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      <Field label="قیمت" htmlFor="offer-price" error={state.fieldErrors?.price} suffix="تومان">
        <input id="offer-price" name="price" type="number" min={0} step={1} required disabled={pending} defaultValue={offer?.price} aria-invalid={Boolean(state.fieldErrors?.price) || undefined} className={inputClassName} />
      </Field>
      <Field label="موجودی" htmlFor="offer-stock" error={state.fieldErrors?.stock}>
        <input id="offer-stock" name="stock" type="number" min={0} step="any" required disabled={pending} defaultValue={offer?.stock} aria-invalid={Boolean(state.fieldErrors?.stock) || undefined} className={inputClassName} />
      </Field>
      <Field label="حداقل سفارش" htmlFor="offer-min" error={state.fieldErrors?.minOrderQuantity}>
        <input id="offer-min" name="minOrderQuantity" type="number" step="any" required disabled={pending} defaultValue={offer?.minOrderQuantity} aria-invalid={Boolean(state.fieldErrors?.minOrderQuantity) || undefined} className={inputClassName} />
      </Field>
      <Field label="حداکثر سفارش (اختیاری)" htmlFor="offer-max" error={state.fieldErrors?.maxOrderQuantity}>
        <input id="offer-max" name="maxOrderQuantity" type="number" step="any" disabled={pending} defaultValue={offer?.maxOrderQuantity} aria-invalid={Boolean(state.fieldErrors?.maxOrderQuantity) || undefined} className={inputClassName} />
      </Field>
      <Field label="زمان تحویل" htmlFor="offer-delivery" error={state.fieldErrors?.deliveryDays} suffix="روز">
        <input id="offer-delivery" name="deliveryDays" type="number" min={0} step={1} required disabled={pending} defaultValue={offer?.deliveryDays} aria-invalid={Boolean(state.fieldErrors?.deliveryDays) || undefined} className={inputClassName} />
      </Field>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  suffix,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor}>
      <span className="mb-1.5 block text-xs font-black text-ink">{label}</span>
      <span className="relative block">
        {children}
        {suffix ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-muted">{suffix}</span> : null}
      </span>
      {error ? <span className="mt-1 block text-[10px] font-bold text-danger">{error}</span> : null}
    </label>
  );
}

function ActionMessage({ state }: { state: SupplierOfferActionState }) {
  return state.message && state.status === "error" ? (
    <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2.5 text-xs font-bold leading-6 text-danger">{state.message}</p>
  ) : null;
}

function SuccessState({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-success-soft text-success"><IconCheck size={28} aria-hidden="true" /></span>
      <p className="mt-4 text-sm font-black text-ink">{message}</p>
      <Button type="button" className="mt-5 min-w-32" onClick={onClose}>بستن</Button>
    </div>
  );
}
