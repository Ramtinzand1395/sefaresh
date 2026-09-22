import type { SupplierPurchaseRequest, SupplierProposalDraft } from "@/types/supplier-proposal";
import { purchaseRequests } from "@/data/purchase-requests";

const requestItems: SupplierPurchaseRequest["items"] = [
  { id: "milk", name: "شیر پرچرب", category: "لبنیات", requestedQuantity: 20, unit: "عدد", supplierMatch: true, image: "/images/products/milk.png" },
  { id: "arabica", name: "دانه قهوه عربیکا", category: "قهوه و نوشیدنی", requestedQuantity: 10, unit: "کیلو", supplierMatch: true, image: "/images/products/coffee.png" },
  { id: "vanilla", name: "سیروپ وانیل برند X", category: "سیروپ", requestedQuantity: 6, unit: "عدد", supplierMatch: false, image: "/images/products/vanilla-syrup.png" },
  { id: "cups", name: "لیوان کاغذی ۳۶۰ سی‌سی", category: "یکبار مصرف", requestedQuantity: 500, unit: "عدد", supplierMatch: true },
  { id: "sugar", name: "شکر قهوه‌ای ساشه‌ای", category: "شیرین‌کننده", requestedQuantity: 10, unit: "بسته", supplierMatch: true },
  { id: "cream", name: "خامه صبحانه", category: "لبنیات", requestedQuantity: 24, unit: "عدد", supplierMatch: true },
  { id: "chocolate", name: "پودر شکلات", category: "پودر نوشیدنی", requestedQuantity: 5, unit: "کیلو", supplierMatch: true },
  { id: "napkin", name: "دستمال کاغذی پذیرایی", category: "سلولزی", requestedQuantity: 20, unit: "بسته", supplierMatch: true },
  { id: "tea", name: "چای سیاه ممتاز", category: "نوشیدنی", requestedQuantity: 8, unit: "بسته", supplierMatch: true },
  { id: "caramel", name: "سیروپ کارامل", category: "سیروپ", requestedQuantity: 6, unit: "عدد", supplierMatch: false },
  { id: "filter", name: "فیلتر کاغذی V60", category: "ابزار دم‌آوری", requestedQuantity: 4, unit: "بسته", supplierMatch: false },
  { id: "oat", name: "شیر جو دوسر", category: "نوشیدنی گیاهی", requestedQuantity: 12, unit: "عدد", supplierMatch: false },
];

const baseRequest: SupplierPurchaseRequest = {
  id: "RQ-2041",
  routeAliases: ["RQ-2041", "rq-2041", "pr-1098", "pr-1097", "pr-1096"],
  state: "active",
  statusLabel: "جدید",
  registeredAt: "امروز، ۱۰:۳۰",
  estimatedValue: 9_800_000,
  city: "کرمان",
  deadlineAt: "امروز، ۱۴:۳۰",
  deadlineLabel: "۱ ساعت و ۲۵ دقیقه باقی مانده",
  deadlineCritical: true,
  maxValidityHours: 24,
  buyer: {
    name: "کافه آریا",
    initials: "ک‌آ",
    verified: true,
    businessType: "کافه",
    city: "کرمان",
    rating: 4.8,
    successfulOrders: 42,
  },
  items: requestItems,
};

export async function getSupplierPurchaseRequest(routeId: string): Promise<SupplierPurchaseRequest | null> {
  if (routeId.toLowerCase() === "not-found") return null;
  const request = structuredClone(baseRequest);
  const normalizedId = routeId.toLowerCase() === "pr-1098" ? "RQ-2041" : routeId.toUpperCase();
  const summary = purchaseRequests.find((candidate) => candidate.id === normalizedId);

  if (summary) {
    request.id = summary.id;
    request.registeredAt = summary.createdAtLabel;
    request.estimatedValue = summary.estimatedValue;
    request.city = summary.buyer.cityLabel;
    request.deadlineLabel = summary.deadlineLabel;
    request.deadlineCritical = summary.deadlineInHours > 0 && summary.deadlineInHours < 2;
    request.buyer = {
      ...request.buyer,
      name: summary.buyer.name,
      initials: summary.buyer.initials,
      verified: summary.buyer.verified,
      city: summary.buyer.cityLabel,
    };

    if (summary.status === "expired") {
      request.state = "expired";
      request.statusLabel = "منقضی‌شده";
      request.deadlineCritical = false;
    } else if (summary.status === "proposal_sent") {
      request.state = "proposal_sent";
      request.statusLabel = "پیشنهاد ارسال‌شده";
      request.deadlineCritical = false;
      request.previousProposal = {
        id: summary.proposal?.id ?? "SP-4831",
        amount: summary.proposal?.amount ?? 8_280_000,
        itemCount: summary.match.matchedItems,
        delivery: "۱ روز کاری",
        validity: "۲۴ ساعت",
        status: "در انتظار بررسی خریدار",
        editable: true,
      };
    }
  }

  if (!summary && routeId.toLowerCase().includes("expired")) {
    request.state = "expired";
    request.statusLabel = "منقضی‌شده";
    request.deadlineLabel = "مهلت به پایان رسیده";
    request.deadlineCritical = false;
  } else if (!summary && routeId.toLowerCase().includes("cancelled")) {
    request.state = "cancelled";
    request.statusLabel = "لغوشده";
    request.deadlineCritical = false;
  } else if (!summary && routeId.toLowerCase().includes("sent")) {
    request.state = "proposal_sent";
    request.statusLabel = "پیشنهاد ارسال‌شده";
    request.deadlineCritical = false;
    request.previousProposal = {
      id: "SP-4831",
      amount: 8_280_000,
      itemCount: 8,
      delivery: "۱ روز کاری",
      validity: "۲۴ ساعت",
      status: "در انتظار بررسی خریدار",
      editable: true,
    };
  }

  return request;
}

const prices: Record<string, number> = {
  milk: 65_000,
  arabica: 1_250_000,
  cups: 2_800,
  sugar: 165_000,
  cream: 42_000,
  chocolate: 390_000,
  napkin: 78_000,
  tea: 215_000,
};

export function createInitialProposalDraft(request: SupplierPurchaseRequest): SupplierProposalDraft {
  return {
    items: request.items.map((item) => ({
      requestItemId: item.id,
      selected: item.supplierMatch,
      availableQuantity: item.id === "arabica" ? 8 : item.supplierMatch ? item.requestedQuantity : 0,
      unitPrice: prices[item.id] ?? 0,
      discount: { type: "fixed", value: 0 },
    })),
    preparationTime: "1_day",
    customPreparationTime: "",
    deliveryDate: "۱۴۰۵/۰۶/۲۵",
    shippingMethod: "supplier",
    freeShipping: false,
    shippingCost: 180_000,
    generalDiscount: { type: "fixed", value: 100_000 },
    validityHours: 24,
    notes: "",
    internalNote: "",
  };
}

export const alternativeProducts = [
  { id: "alt-monin", name: "سیروپ وانیل Monin" },
  { id: "alt-torani", name: "سیروپ وانیل Torani" },
  { id: "alt-maison", name: "سیروپ وانیل Maison Routin" },
];

export const preparationLabels: Record<Exclude<SupplierProposalDraft["preparationTime"], "">, string> = {
  same_day: "همان روز",
  "1_day": "۱ روز کاری",
  "2_days": "۲ روز کاری",
  "3_days": "۳ روز کاری",
  custom: "زمان سفارشی",
};
