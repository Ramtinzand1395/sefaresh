import type { Metadata } from "next";
import { ProductsPage } from "@/components/products/products-page";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "کالاها",
  description: "جست‌وجو و انتخاب مواد اولیه کافه و رستوران",
};

export default function DashboardProductsPage() {
  return <ProductsPage products={products} />;
}
