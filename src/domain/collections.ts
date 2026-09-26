import type {
  Cafe,
  CafeMember,
  Cart,
  Category,
  InternalPurchaseRequest,
  Order,
  Product,
  PurchaseRequest,
  PurchaseRequestSelection,
  ShoppingList,
  Supplier,
  SupplierOffer,
  SupplierRequest,
  User,
} from "@/domain/types";

export const collectionNames = {
  users: "users",
  cafes: "cafes",
  cafeMembers: "cafe_members",
  suppliers: "suppliers",
  categories: "categories",
  products: "products",
  supplierOffers: "supplier_offers",
  internalPurchaseRequests: "internal_purchase_requests",
  shoppingLists: "shopping_lists",
  purchaseRequests: "purchase_requests",
  purchaseRequestSelections: "purchase_request_selections",
  supplierRequests: "supplier_requests",
  carts: "carts",
  orders: "orders",
} as const;

export type DomainCollections = {
  users: User;
  cafes: Cafe;
  cafeMembers: CafeMember;
  suppliers: Supplier;
  categories: Category;
  products: Product;
  supplierOffers: SupplierOffer;
  internalPurchaseRequests: InternalPurchaseRequest;
  shoppingLists: ShoppingList;
  purchaseRequests: PurchaseRequest;
  purchaseRequestSelections: PurchaseRequestSelection;
  supplierRequests: SupplierRequest;
  carts: Cart;
  orders: Order;
};

export type DomainCollectionKey = keyof DomainCollections;
