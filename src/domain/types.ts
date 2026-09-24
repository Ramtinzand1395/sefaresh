import type { z } from "zod";
import type {
  cafeMemberRoleSchema,
  cafeMemberSchema,
  cafeSchema,
  cafeTypeSchema,
  createCafeInputSchema,
  createCafeMemberInputSchema,
  createSupplierInputSchema,
  createUserInputSchema,
  supplierSchema,
  supplierStatusSchema,
  systemRoleSchema,
  userSchema,
} from "@/domain/schemas/identity";
import type {
  categorySchema,
  createCategoryInputSchema,
  createProductInputSchema,
  createSupplierOfferInputSchema,
  productSchema,
  productStatusSchema,
  productUnitSchema,
  supplierOfferSchema,
  updateSupplierOfferInputSchema,
} from "@/domain/schemas/catalog";
import type {
  createInternalPurchaseRequestInputSchema,
  createPurchaseRequestInputSchema,
  createShoppingListInputSchema,
  createSupplierRequestInputSchema,
  internalPurchaseRequestItemApprovalStatusSchema,
  internalPurchaseRequestItemSchema,
  internalPurchaseRequestPrioritySchema,
  internalPurchaseRequestSchema,
  internalPurchaseRequestStatusSchema,
  purchaseRequestItemSchema,
  purchaseRequestSchema,
  purchaseRequestStatusSchema,
  respondToSupplierRequestInputSchema,
  shoppingListItemSchema,
  shoppingListItemSourceSchema,
  shoppingListSchema,
  shoppingListStatusSchema,
  supplierRequestSchema,
  supplierRequestResponseStatusSchema,
  supplierRequestStatusSchema,
} from "@/domain/schemas/purchasing";
import type {
  cartItemSchema,
  cartSchema,
  createCartInputSchema,
  createOrderInputSchema,
  orderItemSchema,
  orderSchema,
  orderStatusSchema,
  paymentStatusSchema,
  supplierOrderSchema,
  supplierOrderStatusSchema,
} from "@/domain/schemas/commerce";

export type SystemRole = z.output<typeof systemRoleSchema>;
export type User = z.output<typeof userSchema>;
export type CreateUserInput = z.input<typeof createUserInputSchema>;

export type CafeType = z.output<typeof cafeTypeSchema>;
export type Cafe = z.output<typeof cafeSchema>;
export type CreateCafeInput = z.input<typeof createCafeInputSchema>;
export type CafeMemberRole = z.output<typeof cafeMemberRoleSchema>;
export type CafeMember = z.output<typeof cafeMemberSchema>;
export type CreateCafeMemberInput = z.input<typeof createCafeMemberInputSchema>;

export type SupplierStatus = z.output<typeof supplierStatusSchema>;
export type Supplier = z.output<typeof supplierSchema>;
export type CreateSupplierInput = z.input<typeof createSupplierInputSchema>;

export type Category = z.output<typeof categorySchema>;
export type CreateCategoryInput = z.input<typeof createCategoryInputSchema>;
export type ProductUnit = z.output<typeof productUnitSchema>;
export type ProductStatus = z.output<typeof productStatusSchema>;
export type Product = z.output<typeof productSchema>;
export type CreateProductInput = z.input<typeof createProductInputSchema>;
export type SupplierOffer = z.output<typeof supplierOfferSchema>;
export type CreateSupplierOfferInput = z.input<typeof createSupplierOfferInputSchema>;
export type UpdateSupplierOfferInput = z.input<typeof updateSupplierOfferInputSchema>;

export type InternalPurchaseRequestPriority = z.output<
  typeof internalPurchaseRequestPrioritySchema
>;
export type InternalPurchaseRequestStatus = z.output<
  typeof internalPurchaseRequestStatusSchema
>;
export type InternalPurchaseRequestItemApprovalStatus = z.output<
  typeof internalPurchaseRequestItemApprovalStatusSchema
>;
export type InternalPurchaseRequestItem = z.output<typeof internalPurchaseRequestItemSchema>;
export type InternalPurchaseRequest = z.output<typeof internalPurchaseRequestSchema>;
export type CreateInternalPurchaseRequestInput = z.input<
  typeof createInternalPurchaseRequestInputSchema
>;

export type ShoppingListStatus = z.output<typeof shoppingListStatusSchema>;
export type ShoppingListItemSource = z.output<typeof shoppingListItemSourceSchema>;
export type ShoppingListItem = z.output<typeof shoppingListItemSchema>;
export type ShoppingList = z.output<typeof shoppingListSchema>;
export type CreateShoppingListInput = z.input<typeof createShoppingListInputSchema>;

export type PurchaseRequestStatus = z.output<typeof purchaseRequestStatusSchema>;
export type PurchaseRequestItem = z.output<typeof purchaseRequestItemSchema>;
export type PurchaseRequest = z.output<typeof purchaseRequestSchema>;
export type CreatePurchaseRequestInput = z.input<typeof createPurchaseRequestInputSchema>;

export type SupplierRequestStatus = z.output<typeof supplierRequestStatusSchema>;
export type SupplierRequestResponseStatus = z.output<
  typeof supplierRequestResponseStatusSchema
>;
export type SupplierRequest = z.output<typeof supplierRequestSchema>;
export type CreateSupplierRequestInput = z.input<typeof createSupplierRequestInputSchema>;
export type RespondToSupplierRequestInput = z.input<
  typeof respondToSupplierRequestInputSchema
>;

export type CartItem = z.output<typeof cartItemSchema>;
export type Cart = z.output<typeof cartSchema>;
export type CreateCartInput = z.input<typeof createCartInputSchema>;

export type PaymentStatus = z.output<typeof paymentStatusSchema>;
export type OrderStatus = z.output<typeof orderStatusSchema>;
export type SupplierOrderStatus = z.output<typeof supplierOrderStatusSchema>;
export type OrderItem = z.output<typeof orderItemSchema>;
export type SupplierOrder = z.output<typeof supplierOrderSchema>;
export type Order = z.output<typeof orderSchema>;
export type CreateOrderInput = z.input<typeof createOrderInputSchema>;
