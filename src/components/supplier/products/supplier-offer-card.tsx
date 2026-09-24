import {
  IconCalendarTime,
  IconClock,
  IconEdit,
  IconPower,
  IconStack2,
} from "@tabler/icons-react";
import { ProductThumbnail } from "@/components/supplier/products/product-thumbnail";
import {
  formatMoney,
  formatProductUnit,
  formatQuantity,
  formatUpdatedAt,
  type SupplierOfferView,
} from "@/components/supplier/products/supplier-offer-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const numberFormatter = new Intl.NumberFormat("fa-IR");

export function SupplierOfferCard({
  offer,
  toggling,
  onEdit,
  onToggle,
}: {
  offer: SupplierOfferView;
  toggling: boolean;
  onEdit: (offer: SupplierOfferView) => void;
  onToggle: (offer: SupplierOfferView) => void;
}) {
  const outOfStock = offer.stock === 0;

  return (
    <Card className="p-4 shadow-none transition hover:border-primary/25 hover:shadow-card sm:p-5">
      <article className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(12rem,.7fr)] lg:grid-cols-[minmax(0,1.25fr)_minmax(10rem,.65fr)_minmax(13rem,.8fr)_11rem] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <ProductThumbnail src={offer.product.image} alt={offer.product.title} />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black text-ink">{offer.product.title}</h2>
            <p className="mt-1 text-xs text-ink-muted">{offer.product.brand ?? "بدون برند"}</p>
            <p className="mt-2 text-[10px] font-bold text-primary">
              واحد محصول: {formatProductUnit(offer.product)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={offer.isActive ? "success" : "neutral"}>
                {offer.isActive ? "فعال" : "غیرفعال"}
              </Badge>
              {outOfStock ? <Badge variant="danger">ناموجود</Badge> : <Badge variant="info">موجود</Badge>}
            </div>
          </div>
        </div>

        <div className="border-t border-line/80 pt-4 md:border-0 md:pt-0">
          <p className="text-[10px] text-ink-muted">قیمت فروش</p>
          <p className="mt-1 text-sm font-black text-ink">{formatMoney(offer.price)}</p>
          <p className="mt-3 text-[10px] text-ink-muted">موجودی</p>
          <p className={outOfStock ? "mt-1 text-xs font-black text-danger" : "mt-1 text-xs font-black text-ink"}>
            {outOfStock ? "ناموجود" : formatQuantity(offer.stock, offer.product.unit)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-t border-line/80 pt-4 text-xs lg:border-0 lg:pt-0">
          <div>
            <dt className="flex items-center gap-1 text-[10px] text-ink-muted"><IconStack2 size={14} aria-hidden="true" />حداقل سفارش</dt>
            <dd className="mt-1 font-black text-ink">{formatQuantity(offer.minOrderQuantity, offer.product.unit)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[10px] text-ink-muted"><IconClock size={14} aria-hidden="true" />زمان تحویل</dt>
            <dd className="mt-1 font-black text-ink">{numberFormatter.format(offer.deliveryDays)} روز</dd>
          </div>
          <div className="col-span-2">
            <dt className="flex items-center gap-1 text-[10px] text-ink-muted"><IconCalendarTime size={14} aria-hidden="true" />آخرین به‌روزرسانی</dt>
            <dd className="mt-1 font-bold text-ink">{formatUpdatedAt(offer.updatedAt)}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-2 border-t border-line/80 pt-4 md:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:border-0 lg:pt-0">
          <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(offer)}>
            <IconEdit size={16} aria-hidden="true" />
            ویرایش
          </Button>
          <Button
            type="button"
            variant={offer.isActive ? "ghost" : "primary"}
            size="sm"
            loading={toggling}
            onClick={() => onToggle(offer)}
          >
            <IconPower size={16} aria-hidden="true" />
            {offer.isActive ? "غیرفعال کردن" : "فعال کردن"}
          </Button>
        </div>
      </article>
    </Card>
  );
}
