import type { Metadata } from "next";
import { connection } from "next/server";
import { IconAlertTriangle } from "@tabler/icons-react";
import { PurchaseRequestsPage } from "@/components/supplier/requests/purchase-requests-page";
import type { SupplierRequestView } from "@/components/supplier/requests/supplier-request-types";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentSupplierId } from "@/lib/current-supplier";
import { toSupplierRequestView } from "@/lib/supplier-request-view";
import { getSupplierRequests } from "@/services/supplier-request-service";

export const metadata: Metadata = {
  title: "درخواست‌های خرید",
  description: "بررسی درخواست‌های مرتبط با محصولات تأمین‌کننده و ثبت پاسخ",
  robots: { index: false, follow: false },
};

export default async function SupplierRequestsRoute() {
  await connection();
  let requestViews: SupplierRequestView[] | null = null;

  try {
    const supplierId = getCurrentSupplierId();
    const requests = await getSupplierRequests(supplierId);
    requestViews = requests.map(toSupplierRequestView);
  } catch {}

  if (!requestViews) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <EmptyState
          icon={IconAlertTriangle}
          title="امکان بارگذاری درخواست‌ها وجود ندارد"
          description="هویت تأمین‌کننده یا اتصال داده در محیط توسعه آماده نیست. تنظیمات سرور را بررسی کنید."
        />
      </Card>
    );
  }

  return <PurchaseRequestsPage requests={requestViews} />;
}
