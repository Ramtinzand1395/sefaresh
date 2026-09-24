import type { Metadata } from "next";
import { connection } from "next/server";
import { IconAlertTriangle } from "@tabler/icons-react";
import { CafeRequestsPage } from "@/components/cafe/requests/cafe-requests-page";
import type { CafeRequestListItemView } from "@/components/cafe/requests/cafe-request-types";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { toCafeRequestListItemView } from "@/lib/cafe-request-view";
import { getCurrentCafeIdentity } from "@/lib/current-cafe";
import { listCafeInternalPurchaseRequests } from "@/services/internal-purchase-request-service";

export const metadata: Metadata = {
  title: "درخواست‌های خرید",
  description: "مدیریت و بررسی درخواست‌های خرید مواد اولیه کافه",
  robots: { index: false, follow: false },
};

export default async function CafeRequestsRoute() {
  await connection();
  let requestViews: CafeRequestListItemView[] | null = null;

  try {
    const { cafeId } = getCurrentCafeIdentity();
    const requests = await listCafeInternalPurchaseRequests(cafeId);
    requestViews = requests.map(toCafeRequestListItemView);
  } catch {}

  if (!requestViews) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <EmptyState
          icon={IconAlertTriangle}
          title="امکان بارگذاری درخواست‌ها وجود ندارد"
          description="هویت کافه یا اتصال داده در محیط توسعه آماده نیست. متغیرهای محیطی SEFARESH_DEV_CAFE_ID و SEFARESH_DEV_USER_ID را بررسی کنید."
        />
      </Card>
    );
  }

  return <CafeRequestsPage requests={requestViews} />;
}
