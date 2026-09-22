export type PurchaseRequestState = "active" | "expired" | "cancelled" | "proposal_sent";

export type DiscountType = "fixed" | "percent";

export type ProposalDiscount = {
  type: DiscountType;
  value: number;
};

export type AlternativeProduct = {
  id: string;
  name: string;
  description: string;
};

export type SupplierProposalItem = {
  requestItemId: string;
  selected: boolean;
  availableQuantity: number;
  unitPrice: number;
  discount: ProposalDiscount;
  alternative?: AlternativeProduct;
};

export type DeliveryOption = "same_day" | "1_day" | "2_days" | "3_days" | "custom";
export type ShippingMethod = "supplier" | "courier" | "freight" | "pickup";
export type ProposalValidity = 2 | 6 | 12 | 24 | 48;

export type SupplierProposalDraft = {
  items: SupplierProposalItem[];
  preparationTime: DeliveryOption | "";
  customPreparationTime: string;
  deliveryDate: string;
  shippingMethod: ShippingMethod | "";
  freeShipping: boolean;
  shippingCost: number;
  generalDiscount: ProposalDiscount;
  validityHours: ProposalValidity;
  notes: string;
  internalNote: string;
};

export type ProposalTotals = {
  subtotal: number;
  itemDiscount: number;
  generalDiscount: number;
  shipping: number;
  total: number;
};

export type PurchaseRequestItem = {
  id: string;
  name: string;
  category: string;
  requestedQuantity: number;
  unit: string;
  supplierMatch: boolean;
  image?: string;
};

export type SupplierPurchaseRequest = {
  id: string;
  routeAliases: string[];
  state: PurchaseRequestState;
  statusLabel: string;
  registeredAt: string;
  estimatedValue: number;
  city: string;
  deadlineAt: string;
  deadlineLabel: string;
  deadlineCritical: boolean;
  maxValidityHours: ProposalValidity;
  buyer: {
    name: string;
    initials: string;
    verified: boolean;
    businessType: string;
    city: string;
    rating: number;
    successfulOrders: number;
  };
  items: PurchaseRequestItem[];
  previousProposal?: {
    id: string;
    amount: number;
    itemCount: number;
    delivery: string;
    validity: string;
    status: string;
    editable: boolean;
  };
};
