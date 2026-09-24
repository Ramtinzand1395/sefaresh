"use client";

import { useMemo, useState, useTransition } from "react";
import { IconBoxOff, IconPlus, IconSearch } from "@tabler/icons-react";
import { toggleSupplierOfferAction } from "@/app/supplier/products/actions";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  CreateSupplierOfferModal,
  EditSupplierOfferModal,
} from "@/components/supplier/products/supplier-offer-modal";
import { SupplierOfferCard } from "@/components/supplier/products/supplier-offer-card";
import type {
  CatalogProductView,
  SupplierOfferView,
} from "@/components/supplier/products/supplier-offer-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type OfferFilter = "all" | "active" | "inactive" | "out_of_stock";

const filterOptions: Array<{ value: OfferFilter; label: string }> = [
  { value: "all", label: "همه" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
  { value: "out_of_stock", label: "ناموجود" },
];
const normalize = (value: string) => value.trim().toLocaleLowerCase("fa-IR");

export function SupplierProductsPage({
  offers,
  initialCatalogProducts,
}: {
  offers: SupplierOfferView[];
  initialCatalogProducts: CatalogProductView[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OfferFilter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SupplierOfferView | null>(null);
  const [togglingOfferId, setTogglingOfferId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [toggling, startToggle] = useTransition();
  const visibleOffers = useMemo(() => {
    const needle = normalize(query);
    return offers.filter((offer) => {
      const matchesQuery = !needle || normalize(`${offer.product.title} ${offer.product.brand ?? ""}`).includes(needle);
      const matchesFilter = filter === "all"
        || (filter === "active" && offer.isActive)
        || (filter === "inactive" && !offer.isActive)
        || (filter === "out_of_stock" && offer.stock === 0);
      return matchesQuery && matchesFilter;
    });
  }, [filter, offers, query]);
  const hasFilters = Boolean(query.trim()) || filter !== "all";

  const editExistingOffer = (offerId: string) => {
    const offer = offers.find((item) => item.offerId === offerId);
    setAddOpen(false);
    if (offer) setEditingOffer(offer);
  };

  const toggleOffer = (offer: SupplierOfferView) => {
    setTogglingOfferId(offer.offerId);
    startToggle(async () => {
      const result = await toggleSupplierOfferAction(offer.offerId);
      setNotice(result.message);
      setTogglingOfferId(null);
    });
  };

  return (
    <div className="space-y-5 pb-6">
      <PageHeader
        title="کالاهای من"
        description="محصولات کاتالوگ مرکزی را انتخاب کنید و قیمت، موجودی و شرایط فروش خود را مدیریت کنید."
        action={
          <Button type="button" onClick={() => setAddOpen(true)}>
            <IconPlus size={18} aria-hidden="true" />
            افزودن محصول
          </Button>
        }
      />

      <Card className="grid gap-3 p-3 shadow-none sm:grid-cols-[minmax(0,1fr)_auto] sm:p-4">
        <div className="relative min-w-0">
          <label htmlFor="supplier-products-search" className="sr-only">جستجوی محصولات</label>
          <IconSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={19} aria-hidden="true" />
          <input
            id="supplier-products-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو بر اساس نام محصول یا برند..."
            className="h-11 w-full rounded-control border border-line bg-white pr-11 pl-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex flex-wrap gap-2" aria-label="فیلتر وضعیت Offer">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={filter === option.value
                ? "min-h-10 rounded-control bg-primary px-3 text-xs font-black text-white"
                : "min-h-10 rounded-control border border-line bg-white px-3 text-xs font-bold text-ink-muted transition hover:border-primary/30 hover:text-primary"}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="text-base font-black text-ink">
          {new Intl.NumberFormat("fa-IR").format(visibleOffers.length)} محصول
        </h2>
        <p className="mt-1 text-xs text-ink-muted">هر مورد یک Offer متعلق به حساب تأمین‌کننده فعلی است.</p>
      </div>

      {visibleOffers.length ? (
        <section aria-label="فهرست Offerهای تأمین‌کننده" className="space-y-3">
          {visibleOffers.map((offer) => (
            <SupplierOfferCard
              key={offer.offerId}
              offer={offer}
              toggling={toggling && togglingOfferId === offer.offerId}
              onEdit={setEditingOffer}
              onToggle={toggleOffer}
            />
          ))}
        </section>
      ) : (
        <Card>
          <EmptyState
            icon={IconBoxOff}
            title={hasFilters
              ? "محصولی با این فیلتر پیدا نشد"
              : "هنوز محصولی به فهرست فروش شما اضافه نشده است."}
            description={hasFilters
              ? "عبارت جستجو یا وضعیت انتخاب‌شده را تغییر دهید."
              : "یک محصول از کاتالوگ مرکزی انتخاب و شرایط فروش خود را ثبت کنید."}
            action={!hasFilters ? (
              <Button type="button" onClick={() => setAddOpen(true)}>
                <IconPlus size={17} aria-hidden="true" />
                افزودن محصول
              </Button>
            ) : undefined}
          />
        </Card>
      )}

      {notice ? (
        <div role="status" className="fixed bottom-4 left-1/2 z-[90] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-center text-xs font-bold text-white shadow-float">
          {notice}
        </div>
      ) : null}

      {addOpen ? (
        <CreateSupplierOfferModal
          open
          initialProducts={initialCatalogProducts}
          onClose={() => setAddOpen(false)}
          onEditExisting={editExistingOffer}
        />
      ) : null}
      <EditSupplierOfferModal offer={editingOffer} onClose={() => setEditingOffer(null)} />
    </div>
  );
}
