import "server-only";

import type { Db } from "mongodb";
import { collectionNames } from "@/domain/collections";
import { getDatabase } from "@/lib/mongodb";

export async function ensureDomainIndexes(database?: Db): Promise<void> {
  const db = database ?? (await getDatabase());

  await Promise.all([
    db.collection(collectionNames.users).createIndexes([
      { key: { phone: 1 }, name: "phone_unique", unique: true },
    ]),
    db.collection(collectionNames.cafeMembers).createIndexes([
      {
        key: { cafeId: 1, userId: 1 },
        name: "cafe_user_unique",
        unique: true,
      },
      { key: { userId: 1, isActive: 1 }, name: "user_active_memberships" },
    ]),
    db.collection(collectionNames.suppliers).createIndexes([
      {
        key: { status: 1, isVerified: 1, rating: -1 },
        name: "active_verified_suppliers",
      },
    ]),
    db.collection(collectionNames.categories).createIndexes([
      { key: { slug: 1 }, name: "slug_unique", unique: true },
    ]),
    db.collection(collectionNames.products).createIndexes([
      { key: { slug: 1 }, name: "slug_unique", unique: true },
      { key: { categoryId: 1, status: 1 }, name: "category_status" },
    ]),
    db.collection(collectionNames.supplierOffers).createIndexes([
      {
        key: { supplierId: 1, productId: 1 },
        name: "supplier_product_unique",
        unique: true,
      },
      {
        key: { productId: 1, isActive: 1, price: 1 },
        name: "marketplace_product_offers",
      },
    ]),
    db.collection(collectionNames.internalPurchaseRequests).createIndexes([
      {
        key: { cafeId: 1, status: 1, createdAt: -1 },
        name: "cafe_review_queue",
      },
    ]),
    db.collection(collectionNames.shoppingLists).createIndexes([
      {
        key: { cafeId: 1, status: 1, updatedAt: -1 },
        name: "cafe_shopping_lists",
      },
      {
        key: { cafeId: 1, status: 1 },
        name: "one_active_shopping_list_per_cafe",
        unique: true,
        partialFilterExpression: { status: "active" },
      },
    ]),
    db.collection(collectionNames.purchaseRequests).createIndexes([
      {
        key: { cafeId: 1, status: 1, createdAt: -1 },
        name: "cafe_purchase_requests",
      },
    ]),
    db.collection(collectionNames.supplierRequests).createIndexes([
      {
        key: { purchaseRequestId: 1, requestItemId: 1, supplierId: 1 },
        name: "request_item_supplier_unique",
        unique: true,
      },
      {
        key: { supplierId: 1, status: 1, createdAt: -1 },
        name: "supplier_request_inbox",
      },
      {
        key: { supplierId: 1, createdAt: -1 },
        name: "supplier_request_inbox_recent",
      },
    ]),
    db.collection(collectionNames.carts).createIndexes([
      { key: { cafeId: 1 }, name: "one_cart_per_cafe", unique: true },
    ]),
    db.collection(collectionNames.orders).createIndexes([
      {
        key: { cafeId: 1, status: 1, createdAt: -1 },
        name: "cafe_orders",
      },
      {
        key: { "supplierOrders.supplierId": 1, createdAt: -1 },
        name: "supplier_orders",
      },
    ]),
  ]);
}
