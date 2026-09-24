import type { Metadata } from "next";
import { connection } from "next/server";
import { IconAlertTriangle } from "@tabler/icons-react";
import { SupplierProductsPage } from "@/components/supplier/products/supplier-products-page";
import type {
  CatalogProductView,
  SupplierOfferView,
} from "@/components/supplier/products/supplier-offer-types";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentSupplierId } from "@/lib/current-supplier";
import {
  toCatalogProductView,
  toSupplierOfferView,
} from "@/lib/supplier-offer-view";
import {
  listSupplierOffers,
  searchSupplierProductCatalog,
} from "@/services/supplier-offer-service";

export const metadata: Metadata = {
  title: "کالاهای من",
  description: "مدیریت Offerهای محصولات تأمین‌کننده",
  robots: { index: false, follow: false },
};

export default async function SupplierProductsRoute() {
  await connection();
  let offerViews: SupplierOfferView[] | null = null;
  let catalogViews: CatalogProductView[] = [];

  try {
    const supplierId = getCurrentSupplierId();
    const [offers, catalogProducts] = await Promise.all([
      listSupplierOffers(supplierId),
      searchSupplierProductCatalog("", 20),
    ]);
    offerViews = offers.map(toSupplierOfferView);
    catalogViews = catalogProducts.map(toCatalogProductView);
  } catch {}

  if (!offerViews) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <EmptyState
          icon={IconAlertTriangle}
          title="امکان بارگذاری محصولات وجود ندارد"
          description="هویت تأمین‌کننده یا اتصال داده در محیط توسعه آماده نیست. تنظیمات سرور را بررسی کنید."
        />
      </Card>
    );
  }

  return (
    <SupplierProductsPage
      offers={offerViews}
      initialCatalogProducts={catalogViews}
    />
  );
}
