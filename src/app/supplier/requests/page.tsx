import type { Metadata } from "next";
import { Suspense } from "react";
import { PurchaseRequestsPage } from "@/components/supplier/requests/purchase-requests-page";
import { PurchaseRequestsSkeleton } from "@/components/supplier/requests/purchase-requests-skeleton";
import { purchaseRequests } from "@/data/purchase-requests";

export const metadata: Metadata = {
  title: "درخواست‌های خرید",
  description: "بررسی فرصت‌های خرید و ارسال پیشنهاد قیمت برای کافه‌ها و رستوران‌ها",
  robots: { index: false, follow: false },
};

export default function SupplierRequestsRoute() {
  return (
    <Suspense fallback={<PurchaseRequestsSkeleton />}>
      <PurchaseRequestsPage requests={purchaseRequests} />
    </Suspense>
  );
}
