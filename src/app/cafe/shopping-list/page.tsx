import type { Metadata } from "next";
import { connection } from "next/server";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { ShoppingListView as ShoppingListViewType } from "@/components/cafe/shopping-list/shopping-list-types";
import { ShoppingListView } from "@/components/cafe/shopping-list/shopping-list-view";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentCafeIdentity } from "@/lib/current-cafe";
import { toShoppingListView } from "@/lib/shopping-list-view";
import { getActiveShoppingListForCafe } from "@/services/shopping-list-service";

export const metadata: Metadata = {
  title: "لیست خرید",
  description: "مشاهده و مدیریت لیست خرید جاری کافه",
  robots: { index: false, follow: false },
};

export default async function CafeShoppingListRoute() {
  await connection();
  let shoppingListView: ShoppingListViewType | null = null;
  let isReady = false;

  try {
    const { cafeId } = getCurrentCafeIdentity();
    const shoppingList = await getActiveShoppingListForCafe(cafeId);
    shoppingListView = shoppingList ? toShoppingListView(shoppingList) : null;
    isReady = true;
  } catch {}

  if (!isReady) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <EmptyState
          icon={IconAlertTriangle}
          title="امکان بارگذاری لیست خرید وجود ندارد"
          description="هویت کافه یا اتصال داده در محیط توسعه آماده نیست. متغیرهای محیطی SEFARESH_DEV_CAFE_ID و SEFARESH_DEV_USER_ID را بررسی کنید."
        />
      </Card>
    );
  }

  return <ShoppingListView shoppingList={shoppingListView} />;
}
