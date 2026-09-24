"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconBox,
  IconBuildingStore,
  IconCategory,
  IconPackage,
  IconSparkles,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import type {
  MarketplaceCategoryView,
  MarketplaceProductDetailView,
  MarketplaceProductView,
  MarketplaceSort,
} from "@/components/products/marketplace-types";
import { ProductOffersModal } from "@/components/products/product-offers-modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const numberFormatter = new Intl.NumberFormat("fa-IR");

type ProductsPageProps = {
  products: MarketplaceProductView[];
  categories: MarketplaceCategoryView[];
  query: string;
  category: string;
  sort: MarketplaceSort;
  selectedProductId?: string;
  selectedProduct: MarketplaceProductDetailView | null;
};

export function ProductsPage({
  products,
  categories,
  query,
  category,
  sort,
  selectedProductId,
  selectedProduct,
}: ProductsPageProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const supplierOfferCount = products.reduce((total, product) => total + product.availableSupplierCount, 0);
  const hasFilters = Boolean(query) || category !== "all" || sort !== "default";

  const navigate = (next: {
    query?: string;
    category?: string;
    sort?: MarketplaceSort;
    productId?: string;
  }) => {
    const params = new URLSearchParams();
    const nextQuery = next.query ?? query;
    const nextCategory = next.category ?? category;
    const nextSort = next.sort ?? sort;
    const nextProductId = next.productId;
    if (nextQuery) params.set("q", nextQuery);
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextSort !== "default") params.set("sort", nextSort);
    if (nextProductId) params.set("product", nextProductId);
    const suffix = params.toString();
    startTransition(() => router.replace(suffix ? `/cafe/products?${suffix}` : "/cafe/products", { scroll: false }));
  };

  const resetFilters = () => {
    startTransition(() => router.replace("/cafe/products", { scroll: false }));
  };

  return (
    <>
      <PageHeader
        eyebrow="بازار مواد اولیه سفارش"
        title="کالاها"
        description="کالاهای دارای موجودی را ببینید و پیشنهاد فروشندگان فعال و تأییدشده را بررسی کنید."
        action={
          <Button type="button" size="lg" onClick={() => document.getElementById("product-search")?.focus()}>
            <IconSparkles size={19} aria-hidden="true" />
            پیدا کردن کالا
          </Button>
        }
      />

      <section aria-label="آمار بازار" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کالاهای قابل خرید" value={numberFormatter.format(products.length)} hint="در نتایج فعلی" icon={IconBox} tone="blue" />
        <StatCard label="دسته‌بندی فعال" value={numberFormatter.format(categories.length)} hint="از کاتالوگ مرکزی" icon={IconCategory} tone="violet" />
        <StatCard label="پیشنهادهای معتبر" value={numberFormatter.format(supplierOfferCount)} hint="از فروشندگان واجد شرایط" icon={IconBuildingStore} tone="green" />
        <StatCard label="وضعیت موجودی" value="۱۰۰٪" hint="فقط Offerهای دارای موجودی" icon={IconPackage} tone="orange" />
      </section>

      <div className="mt-5">
        <ProductFilters
          key={`${query}:${category}:${sort}`}
          initialQuery={query}
          category={category}
          sort={sort}
          categories={categories}
          resultCount={products.length}
          pending={pending}
          onSearch={(nextQuery) => navigate({ query: nextQuery.trim(), productId: undefined })}
          onCategoryChange={(nextCategory) => navigate({ category: nextCategory, productId: undefined })}
          onSortChange={(nextSort) => navigate({ sort: nextSort, productId: undefined })}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-ink">بازار کالاها</h2>
          <p className="mt-1 text-xs leading-6 text-ink-muted">قیمت نمایش‌داده‌شده کمترین قیمت فعال هر محصول است.</p>
        </div>
        {pending ? <p className="text-xs font-bold text-primary">در حال به‌روزرسانی…</p> : null}
      </div>

      {products.length ? (
        <section aria-label="فهرست کالاها" className="mt-3 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onViewOffers={(productId) => navigate({ productId })}
            />
          ))}
        </section>
      ) : (
        <div className="mt-3 rounded-card border border-line bg-white shadow-card">
          <EmptyState
            icon={IconPackage}
            title={hasFilters
              ? "محصولی با این جستجو پیدا نشد."
              : "در حال حاضر کالای قابل خریدی در بازار موجود نیست."}
            description={hasFilters
              ? "عبارت جستجو یا فیلترها را تغییر دهید."
              : "پس از فعال شدن موجودی فروشندگان، کالاها در این بخش نمایش داده می‌شوند."}
            action={hasFilters ? <Button type="button" variant="secondary" onClick={resetFilters}>پاک کردن فیلترها</Button> : undefined}
          />
        </div>
      )}

      <ProductOffersModal
        open={Boolean(selectedProductId)}
        product={selectedProduct}
        onClose={() => navigate({ productId: undefined })}
      />
    </>
  );
}
