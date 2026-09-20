"use client";

import { useMemo, useState } from "react";
import {
  IconBox,
  IconCategory,
  IconCheck,
  IconPackage,
  IconShoppingCart,
  IconSparkles,
} from "@tabler/icons-react";
import type { Product, ProductCategoryId } from "@/data/products";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters, type ProductSort } from "@/components/products/product-filters";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type ProductsPageProps = {
  products: Product[];
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("fa-IR");

export function ProductsPage({ products }: ProductsPageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategoryId>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>("popular");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favourites, setFavourites] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    const needle = normalize(query);
    const matches = products.filter((product) => {
      const text = normalize(`${product.name} ${product.description} ${product.categoryLabel}`);
      return (
        (!needle || text.includes(needle)) &&
        (category === "all" || product.category === category) &&
        (!availableOnly || product.available)
      );
    });

    return [...matches].sort((first, second) => {
      if (sort === "price-asc") return first.price - second.price;
      if (sort === "price-desc") return second.price - first.price;
      return Number(Boolean(second.popular)) - Number(Boolean(first.popular));
    });
  }, [availableOnly, category, products, query, sort]);

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const categoryCount = new Set(products.map((product) => product.category)).size;
  const availableCount = products.filter((product) => product.available).length;

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setAvailableOnly(false);
    setSort("popular");
  };

  const addToCart = (product: Product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setNotice(`${product.name} به سبد خرید اضافه شد.`);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const toggleFavourite = (productId: string) => {
    setFavourites((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="بازار مواد اولیه سفارش"
        title="کالاها"
        description="کالاهای مورد نیاز کافه و رستوران را پیدا کنید، قیمت پایه را ببینید و برای خرید بعدی به سبد اضافه کنید."
        action={
          <Button type="button" size="lg" onClick={() => document.getElementById("product-search")?.focus()}>
            <IconSparkles size={19} aria-hidden="true" />
            پیدا کردن کالا
          </Button>
        }
      />

      <section aria-label="آمار کالاها" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="همه کالاها" value={new Intl.NumberFormat("fa-IR").format(products.length)} hint="در کاتالوگ فعلی" icon={IconBox} tone="blue" />
        <StatCard label="دسته‌بندی فعال" value={new Intl.NumberFormat("fa-IR").format(categoryCount)} hint="برای جست‌وجوی سریع‌تر" icon={IconCategory} tone="violet" />
        <StatCard label="کالای موجود" value={new Intl.NumberFormat("fa-IR").format(availableCount)} hint="آماده استعلام قیمت" icon={IconPackage} tone="green" />
        <StatCard label="اقلام سبد خرید" value={new Intl.NumberFormat("fa-IR").format(cartCount)} hint={cartCount ? "آماده بررسی و ثبت" : "هنوز کالایی اضافه نشده"} icon={IconShoppingCart} tone="orange" />
      </section>

      <div className="mt-5">
        <ProductFilters
          query={query}
          category={category}
          availableOnly={availableOnly}
          sort={sort}
          resultCount={filteredProducts.length}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
          onAvailableOnlyChange={setAvailableOnly}
          onSortChange={setSort}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-ink">کاتالوگ کالاها</h2>
          <p className="mt-1 text-xs leading-6 text-ink-muted">قیمت‌ها پایه هستند و مبلغ نهایی پس از انتخاب تأمین‌کننده مشخص می‌شود.</p>
        </div>
        <p className="hidden text-xs font-bold text-primary sm:block">به‌روزرسانی امروز، ساعت ۱۰:۳۰</p>
      </div>

      {filteredProducts.length ? (
        <section aria-label="فهرست کالاها" className="mt-3 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] ?? 0}
              favourite={favourites.includes(product.id)}
              onAdd={addToCart}
              onToggleFavourite={toggleFavourite}
            />
          ))}
        </section>
      ) : (
        <div className="mt-3 rounded-card border border-line bg-white shadow-card">
          <EmptyState
            icon={IconPackage}
            title="کالایی با این مشخصات پیدا نشد"
            description="عبارت جست‌وجو یا فیلترها را تغییر دهید تا گزینه‌های بیشتری نمایش داده شود."
            action={<Button type="button" variant="secondary" onClick={resetFilters}>پاک کردن فیلترها</Button>}
          />
        </div>
      )}

      {cartCount > 0 ? (
        <div className="sticky bottom-3 z-20 mt-5 flex flex-col gap-3 rounded-card border border-primary/20 bg-primary-soft/95 p-3 shadow-float backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white">
              <IconShoppingCart size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-black text-ink">{new Intl.NumberFormat("fa-IR").format(cartCount)} قلم برای خرید انتخاب شده</p>
              <p className="mt-1 text-xs text-ink-muted">در مرحله بعد می‌توانید مقدار و تأمین‌کننده را مشخص کنید.</p>
            </div>
          </div>
          <Button type="button" className="w-full sm:w-auto" onClick={() => setNotice("سبد خرید شما برای بررسی آماده است.")}>
            مشاهده سبد خرید
          </Button>
        </div>
      ) : null}

      <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      {notice ? (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-bold text-white shadow-float" role="status">
          <IconCheck size={17} className="text-emerald-300" aria-hidden="true" />
          {notice}
        </div>
      ) : null}
    </>
  );
}
