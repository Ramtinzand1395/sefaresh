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
  addApprovedInternalRequestToShoppingListInputSchema,
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
  reviewInternalPurchaseRequestInputSchema,
  shoppingListItemSchema,
  shoppingListItemSourceSchema,
  shoppingListSchema,
  shoppingListStatusSchema,
  supplierRequestSchema,
  supplierRequestResponseStatusSchema,
  supplierRequestStatusSchema,
  submitInternalPurchaseRequestInputSchema,
} from "@/domain/schemas/purchasing";
import type { ObjectId } from "mongodb";
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
import type {
  compareInputSchema,
  compareItemInputSchema,
  compareOfferReasonSchema,
} from "@/domain/schemas/compare";

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
export type SubmitInternalPurchaseRequestInput = z.input<
  typeof submitInternalPurchaseRequestInputSchema
>;
export type ReviewInternalPurchaseRequestInput = z.input<
  typeof reviewInternalPurchaseRequestInputSchema
>;

export type ShoppingListStatus = z.output<typeof shoppingListStatusSchema>;
export type ShoppingListItemSource = z.output<typeof shoppingListItemSourceSchema>;
export type ShoppingListItem = z.output<typeof shoppingListItemSchema>;
export type ShoppingList = z.output<typeof shoppingListSchema>;
export type CreateShoppingListInput = z.input<typeof createShoppingListInputSchema>;
export type AddApprovedInternalRequestToShoppingListInput = z.input<
  typeof addApprovedInternalRequestToShoppingListInputSchema
>;

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

export type CompareItemInput = z.input<typeof compareItemInputSchema>;
export type CompareInput = z.input<typeof compareInputSchema>;
export type CompareOfferReason = z.output<typeof compareOfferReasonSchema>;

export type OfferEvaluation = {
  offerId: ObjectId;
  productId: ObjectId;
  supplierId: ObjectId;
  supplierName: string;
  requestedQuantity: number;
  unitPrice: number;
  lineTotal: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  deliveryDays: number;
  eligible: boolean;
  reasons: CompareOfferReason[];
};

export type ComparedProductInfo = {
  _id: ObjectId;
  title: string;
  brand?: string;
  unit: ProductUnit;
  status: ProductStatus;
};

export type ProductComparison = {
  product: ComparedProductInfo;
  requestedQuantity: number;
  eligibleOffers: OfferEvaluation[];
  unavailableOffers: OfferEvaluation[];
  eligibleSupplierCount: number;
  lowestEligiblePrice: number | null;
  highestEligiblePrice: number | null;
  lowestEligibleLineTotal: number | null;
  fastestDeliveryDays: number | null;
};

export type SupplierScenarioCoveredItem = {
  productId: ObjectId;
  offerId: ObjectId;
  requestedQuantity: number;
  unitPrice: number;
  lineTotal: number;
  deliveryDays: number;
};

export type SupplierScenarioMissingItem = {
  productId: ObjectId;
  requestedQuantity: number;
};

export type SupplierScenario = {
  supplierId: ObjectId;
  supplierName: string;
  coveredItems: SupplierScenarioCoveredItem[];
  missingItems: SupplierScenarioMissingItem[];
  coveredItemCount: number;
  totalRequestedItemCount: number;
  subtotal: number;
  maxDeliveryDays: number | null;
  completeCoverage: boolean;
};

export type CompareResult = {
  products: ProductComparison[];
  supplierScenarios: SupplierScenario[];
  completeSupplierScenarios: SupplierScenario[];
};

export type ShoppingListCustomItem = {
  id: ObjectId;
  customTitle: string;
  quantity: number;
  note?: string;
};

export type ShoppingListCompareResult = CompareResult & {
  shoppingListId: ObjectId;
  unmatchedCustomItems: ShoppingListCustomItem[];
};
