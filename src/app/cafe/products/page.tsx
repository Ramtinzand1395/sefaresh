import type { Metadata } from "next";
import { connection } from "next/server";
import { IconAlertTriangle } from "@tabler/icons-react";
import { ProductsPage } from "@/components/products/products-page";
import type {
  MarketplaceCategoryView,
  MarketplaceProductDetailView,
  MarketplaceProductView,
  MarketplaceSort,
} from "@/components/products/marketplace-types";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  toMarketplaceCategoryView,
  toMarketplaceDetailView,
  toMarketplaceProductView,
} from "@/lib/marketplace-view";
import {
  getMarketplaceDetail,
  listMarketplaceCategories,
  searchMarketplace,
} from "@/services/marketplace-service";

export const metadata: Metadata = {
  title: "کالاها",
  description: "مشاهده کالاهای دارای موجودی و پیشنهادهای فروشندگان معتبر",
};

type ProductsRouteProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    product?: string;
  }>;
};

export default async function CafeProductsRoute({ searchParams }: ProductsRouteProps) {
  await connection();
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 120) ?? "";
  const category = params.category ?? "all";
  const sort: MarketplaceSort = params.sort === "price_asc" || params.sort === "price_desc"
    ? params.sort
    : "default";
  let productViews: MarketplaceProductView[] | null = null;
  let categoryViews: MarketplaceCategoryView[] = [];
  let detailView: MarketplaceProductDetailView | null = null;

  try {
    const [products, categories, detail] = await Promise.all([
      searchMarketplace({
        query,
        categoryId: category === "all" ? undefined : category,
        sort,
        limit: 24,
      }),
      listMarketplaceCategories(),
      params.product ? getMarketplaceDetail(params.product) : Promise.resolve(null),
    ]);
    productViews = products.map(toMarketplaceProductView);
    categoryViews = categories.map(toMarketplaceCategoryView);
    detailView = detail ? toMarketplaceDetailView(detail) : null;
  } catch {}

  if (!productViews) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <EmptyState
          icon={IconAlertTriangle}
          title="امکان بارگذاری بازار وجود ندارد"
          description="اتصال داده در حال حاضر آماده نیست. دوباره تلاش کنید."
        />
      </Card>
    );
  }

  return (
    <ProductsPage
      key={`${query}:${category}:${sort}:${params.product ?? ""}`}
      products={productViews}
      categories={categoryViews}
      query={query}
      category={category}
      sort={sort}
      selectedProductId={params.product}
      selectedProduct={detailView}
    />
  );
}
