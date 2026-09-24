import {
  IconBuildingStore,
  IconChartBar,
  IconPackage,
} from "@tabler/icons-react";
import { ProductImage } from "@/components/products/product-image";
import {
  formatProductUnit,
  formatToman,
  type MarketplaceProductView,
} from "@/components/products/marketplace-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const numberFormatter = new Intl.NumberFormat("fa-IR");

export function ProductCard({
  product,
  onViewOffers,
}: {
  product: MarketplaceProductView;
  onViewOffers: (productId: string) => void;
}) {
  return (
    <article className="group flex min-w-0 flex-col rounded-card border border-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-float sm:p-4">
      <div className="flex min-w-0 gap-3">
        <ProductImage src={product.image} alt={product.title} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-black text-ink sm:text-base">{product.title}</h3>
            <Badge variant="success" className="min-h-6 px-2 text-[10px]">موجود</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">{product.brand ?? "بدون برند"}</p>
          <p className="mt-1 text-[10px] font-bold text-primary">
            {product.categoryName ?? "کاتالوگ مرکزی"} · {formatProductUnit(product)}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <IconBuildingStore size={15} className="text-primary" aria-hidden="true" />
              {numberFormatter.format(product.availableSupplierCount)} تأمین‌کننده
            </span>
            <span className="inline-flex items-center gap-1">
              <IconPackage size={15} className="text-primary" aria-hidden="true" />
              {numberFormatter.format(product.totalAvailableStock)} موجودی کل
            </span>
          </div>
        </div>
      </div>

      <div className="my-3 h-px bg-line" />

      <div className="mt-auto flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] text-ink-muted">از</p>
          <p className="mt-0.5 text-sm font-black text-ink" dir="auto">{formatToman(product.lowestPrice)}</p>
          {product.lowestPrice !== product.highestPrice ? (
            <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-ink-muted">
              <IconChartBar size={13} aria-hidden="true" />
              تا {formatToman(product.highestPrice)}
            </p>
          ) : null}
        </div>
        <Button type="button" size="sm" className="min-w-32" onClick={() => onViewOffers(product.productId)}>
          مشاهده فروشندگان
        </Button>
      </div>
    </article>
  );
}
