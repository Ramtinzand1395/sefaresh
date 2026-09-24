import "server-only";

import type {
  ShoppingListItemView,
  ShoppingListView,
} from "@/components/cafe/shopping-list/shopping-list-types";
import type {
  ShoppingListDetail,
  ShoppingListDetailItem,
} from "@/repositories/shopping-list-repository";

function toShoppingListItemView(item: ShoppingListDetailItem): ShoppingListItemView {
  return {
    id: item.id.toHexString(),
    productId: item.productId?.toHexString(),
    productTitle: item.productTitle,
    productBrand: item.productBrand,
    productUnit: item.productUnit,
    customTitle: item.customTitle,
    quantity: item.quantity,
    note: item.note,
    isInternalRequest: item.source.type === "internal_request",
  };
}

export function toShoppingListView(list: ShoppingListDetail): ShoppingListView {
  return {
    id: list._id.toHexString(),
    name: list.name,
    status: list.status,
    updatedAt: list.updatedAt.toISOString(),
    itemCount: list.items.length,
    items: list.items.map(toShoppingListItemView),
  };
}
