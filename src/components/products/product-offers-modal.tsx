"use client";

import { IconBuildingStore, IconClock, IconPackage } from "@tabler/icons-react";
import { ProductImage } from "@/components/products/product-image";
import {
  formatProductUnit,
  formatQuantity,
  formatToman,
  type MarketplaceProductDetailView,
} from "@/components/products/marketplace-types";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

const numberFormatter = new Intl.NumberFormat("fa-IR");

export function ProductOffersModal({
  open,
  product,
  onClose,
}: {
  open: boolean;
  product: MarketplaceProductDetailView | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product?.title ?? "پیشنهادهای محصول"}
      description="فروشندگان فعال و تأییدشده این محصول، مرتب‌شده بر اساس قیمت."
      width="lg"
    >
      {product ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl bg-surface-subtle p-3">
            <ProductImage src={product.image} alt={product.title} size="detail" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-black text-ink">{product.title}</h3>
              <p className="mt-1 text-xs text-ink-muted">{product.brand ?? "بدون برند"}</p>
              <p className="mt-2 text-[11px] font-bold text-primary">
                {product.categoryName ?? "کاتالوگ مرکزی"} · {formatProductUnit(product)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="success">{numberFormatter.format(product.availableSupplierCount)} تأمین‌کننده</Badge>
                <Badge variant="info">از {formatToman(product.lowestPrice)}</Badge>
              </div>
            </div>
          </div>

          <section aria-label="فهرست پیشنهادهای فروش" className="space-y-2">
            {product.offers.map((offer) => (
              <article key={offer.offerId} className="rounded-xl border border-line p-3 sm:p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-black text-ink">
                      <IconBuildingStore size={18} className="text-primary" aria-hidden="true" />
                      {offer.supplierName}
                    </h4>
                    <p className="mt-2 text-base font-black text-primary">{formatToman(offer.price)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:min-w-72">
                    <OfferFact
                      icon="stock"
                      label="موجودی"
                      value={formatQuantity(offer.stock, product.unit)}
                    />
                    <OfferFact
                      icon="stock"
                      label="حداقل سفارش"
                      value={formatQuantity(offer.minOrderQuantity, product.unit)}
                    />
                    {offer.maxOrderQuantity !== undefined ? (
                      <OfferFact
                        icon="stock"
                        label="حداکثر سفارش"
                        value={formatQuantity(offer.maxOrderQuantity, product.unit)}
                      />
                    ) : null}
                    <OfferFact
                      icon="clock"
                      label="زمان تحویل"
                      value={`${numberFormatter.format(offer.deliveryDays)} روز`}
                    />
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      ) : (
        <div className="py-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-subtle text-ink-muted">
            <IconPackage size={28} aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-black text-ink">در حال حاضر پیشنهاد فعالی برای این محصول وجود ندارد.</p>
        </div>
      )}
    </Modal>
  );
}

function OfferFact({
  icon,
  label,
  value,
}: {
  icon: "stock" | "clock";
  label: string;
  value: string;
}) {
  const Icon = icon === "clock" ? IconClock : IconPackage;
  return (
    <div className="rounded-xl bg-surface-subtle p-2.5">
      <dt className="flex items-center gap-1 text-[10px] text-ink-muted"><Icon size={13} aria-hidden="true" />{label}</dt>
      <dd className="mt-1 font-black text-ink">{value}</dd>
    </div>
  );
}
