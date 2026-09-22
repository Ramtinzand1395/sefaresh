export type RequestStatus =
  | "new"
  | "viewed"
  | "proposal_sent"
  | "urgent"
  | "expired";

export type RequestCategory =
  | "coffee"
  | "dairy"
  | "food"
  | "beverage"
  | "packaging"
  | "hygiene"
  | "consumables";

export type RequestCity = "kerman" | "rafsanjan" | "sirjan" | "bam";

export type BuyerSummary = {
  name: string;
  initials: string;
  city: RequestCity;
  cityLabel: string;
  verified: boolean;
};

export type PurchaseRequestItem = {
  name: string;
  quantity: string;
  category: RequestCategory;
};

export type RequestMatch = {
  matchedItems: number;
  totalItems: number;
};

export type PurchaseRequestProposal = {
  id: string;
  amount: number;
};

export type PurchaseRequest = {
  id: string;
  buyer: BuyerSummary;
  items: PurchaseRequestItem[];
  categories: RequestCategory[];
  estimatedValue: number;
  createdAtLabel: string;
  createdAtMinutesAgo: number;
  deadlineLabel: string;
  deadlineInHours: number;
  status: RequestStatus;
  match: RequestMatch;
  proposal?: PurchaseRequestProposal;
  saved: boolean;
};

const itemBundles: PurchaseRequestItem[][] = [
  [
    { name: "شیر پرچرب", quantity: "۲۰ عدد", category: "dairy" },
    { name: "دانه قهوه عربیکا", quantity: "۱۰ کیلو", category: "coffee" },
    { name: "سیروپ وانیل", quantity: "۶ بطری", category: "beverage" },
    { name: "لیوان بیرون‌بر", quantity: "۱۰۰ عدد", category: "packaging" },
  ],
  [
    { name: "برنج ایرانی", quantity: "۲۵ کیلو", category: "food" },
    { name: "روغن سرخ‌کردنی", quantity: "۱۲ بطری", category: "food" },
    { name: "نوشابه شیشه‌ای", quantity: "۶ باکس", category: "beverage" },
    { name: "دستکش یک‌بارمصرف", quantity: "۸ بسته", category: "hygiene" },
  ],
  [
    { name: "قهوه ترکیبی اسپرسو", quantity: "۱۵ کیلو", category: "coffee" },
    { name: "شیر کم‌چرب", quantity: "۳۰ عدد", category: "dairy" },
    { name: "شکر قهوه‌ای", quantity: "۱۰ بسته", category: "food" },
    { name: "نی کاغذی", quantity: "۵۰۰ عدد", category: "packaging" },
  ],
  [
    { name: "مایع ظرفشویی صنعتی", quantity: "۴ گالن", category: "hygiene" },
    { name: "دستمال حوله‌ای", quantity: "۲۴ رول", category: "hygiene" },
    { name: "کیسه زباله صنعتی", quantity: "۱۰ بسته", category: "consumables" },
    { name: "ظرف آلومینیومی", quantity: "۲۰۰ عدد", category: "packaging" },
  ],
  [
    { name: "خامه صبحانه", quantity: "۲۴ عدد", category: "dairy" },
    { name: "پنیر خامه‌ای", quantity: "۱۲ بسته", category: "dairy" },
    { name: "سس شکلات", quantity: "۸ بطری", category: "food" },
    { name: "پودر کاکائو", quantity: "۵ کیلو", category: "food" },
  ],
];

const buyers: BuyerSummary[] = [
  { name: "کافه آریا", initials: "ک‌آ", city: "kerman", cityLabel: "کرمان", verified: true },
  { name: "رستوران نارون", initials: "ر‌ن", city: "kerman", cityLabel: "کرمان", verified: true },
  { name: "کافه لمیز", initials: "ک‌ل", city: "kerman", cityLabel: "کرمان", verified: true },
  { name: "رستوران باران", initials: "ر‌ب", city: "rafsanjan", cityLabel: "رفسنجان", verified: false },
  { name: "کافه وینا", initials: "ک‌و", city: "kerman", cityLabel: "کرمان", verified: true },
  { name: "فودکورت نگین", initials: "ف‌ن", city: "sirjan", cityLabel: "سیرجان", verified: true },
  { name: "کافه عمارت", initials: "ک‌ع", city: "bam", cityLabel: "بم", verified: false },
  { name: "رستوران شبدیز", initials: "ر‌ش", city: "rafsanjan", cityLabel: "رفسنجان", verified: true },
  { name: "کافه دیدار", initials: "ک‌د", city: "sirjan", cityLabel: "سیرجان", verified: true },
  { name: "آشپزخانه زیتون", initials: "آ‌ز", city: "bam", cityLabel: "بم", verified: true },
];

type RequestSeed = Omit<PurchaseRequest, "categories">;

const highlightedRequests: RequestSeed[] = [
  {
    id: "RQ-2041", buyer: buyers[0], items: itemBundles[0], estimatedValue: 9_800_000,
    createdAtLabel: "امروز، ۱۰:۳۰", createdAtMinutesAgo: 18, deadlineLabel: "۱ ساعت و ۲۵ دقیقه باقی مانده",
    deadlineInHours: 1.42, status: "new", match: { matchedItems: 8, totalItems: 12 }, saved: false,
  },
  {
    id: "RQ-2042", buyer: buyers[1], items: itemBundles[1], estimatedValue: 6_450_000,
    createdAtLabel: "امروز، ۰۹:۵۵", createdAtMinutesAgo: 53, deadlineLabel: "۵ ساعت باقی مانده",
    deadlineInHours: 5, status: "new", match: { matchedItems: 6, totalItems: 8 }, saved: true,
  },
  {
    id: "RQ-2043", buyer: buyers[2], items: itemBundles[2], estimatedValue: 13_300_000,
    createdAtLabel: "امروز، ۰۹:۱۰", createdAtMinutesAgo: 98, deadlineLabel: "۱ روز باقی مانده",
    deadlineInHours: 24, status: "viewed", match: { matchedItems: 11, totalItems: 15 }, saved: false,
  },
  {
    id: "RQ-2044", buyer: buyers[3], items: itemBundles[3], estimatedValue: 21_600_000,
    createdAtLabel: "امروز، ۰۸:۴۰", createdAtMinutesAgo: 128, deadlineLabel: "۴۵ دقیقه باقی مانده",
    deadlineInHours: 0.75, status: "urgent", match: { matchedItems: 16, totalItems: 22 }, saved: true,
  },
  {
    id: "RQ-2045", buyer: buyers[4], items: itemBundles[4], estimatedValue: 7_200_000,
    createdAtLabel: "دیروز، ۱۷:۲۰", createdAtMinutesAgo: 1050, deadlineLabel: "۲ روز باقی مانده",
    deadlineInHours: 48, status: "proposal_sent", match: { matchedItems: 10, totalItems: 10 },
    proposal: { id: "PR-581", amount: 7_850_000 }, saved: false,
  },
  {
    id: "RQ-2046", buyer: buyers[5], items: itemBundles[1], estimatedValue: 18_900_000,
    createdAtLabel: "دیروز، ۱۵:۴۰", createdAtMinutesAgo: 1150, deadlineLabel: "۳ روز باقی مانده",
    deadlineInHours: 72, status: "new", match: { matchedItems: 9, totalItems: 14 }, saved: false,
  },
  {
    id: "RQ-2047", buyer: buyers[6], items: itemBundles[0], estimatedValue: 4_850_000,
    createdAtLabel: "دیروز، ۱۲:۱۵", createdAtMinutesAgo: 1355, deadlineLabel: "منقضی‌شده در امروز، ۰۹:۰۰",
    deadlineInHours: -2, status: "expired", match: { matchedItems: 4, totalItems: 7 }, saved: false,
  },
  {
    id: "RQ-2048", buyer: buyers[7], items: itemBundles[3], estimatedValue: 26_300_000,
    createdAtLabel: "۲ روز پیش، ۱۱:۵۰", createdAtMinutesAgo: 2820, deadlineLabel: "۸ ساعت باقی مانده",
    deadlineInHours: 8, status: "viewed", match: { matchedItems: 13, totalItems: 18 }, saved: true,
  },
];

const statusCycle: RequestStatus[] = ["new", "viewed", "new", "proposal_sent", "urgent", "new", "expired"];
const deadlineCycle = [1.75, 6, 18, 36, 60, 96, -8];

const generatedRequests: RequestSeed[] = Array.from({ length: 20 }, (_, index) => {
  const serial = 2049 + index;
  const buyer = buyers[(index + 2) % buyers.length];
  const items = itemBundles[index % itemBundles.length];
  const totalItems = 7 + ((index * 3) % 17);
  const matchedItems = Math.min(totalItems, 4 + ((index * 5) % 14));
  const status = statusCycle[index % statusCycle.length];
  const deadlineInHours = status === "expired" ? -4 - index : deadlineCycle[index % deadlineCycle.length];
  const proposal = status === "proposal_sent"
    ? { id: `PR-${600 + index}`, amount: 5_900_000 + index * 410_000 }
    : undefined;

  return {
    id: `RQ-${serial}`,
    buyer,
    items,
    estimatedValue: 5_200_000 + index * 870_000,
    createdAtLabel: index < 4 ? `۲ روز پیش، ${new Intl.NumberFormat("fa-IR").format(9 + index)}:۲۰` : `${new Intl.NumberFormat("fa-IR").format(3 + Math.floor(index / 3))} روز پیش`,
    createdAtMinutesAgo: 3000 + index * 190,
    deadlineLabel: deadlineInHours < 0
      ? "مهلت ارسال پیشنهاد به پایان رسیده"
      : deadlineInHours < 2
        ? "کمتر از ۲ ساعت باقی مانده"
        : deadlineInHours < 24
          ? `${new Intl.NumberFormat("fa-IR").format(deadlineInHours)} ساعت باقی مانده`
          : `${new Intl.NumberFormat("fa-IR").format(Math.round(deadlineInHours / 24))} روز باقی مانده`,
    deadlineInHours,
    status,
    match: { matchedItems, totalItems },
    proposal,
    saved: index === 3 || index === 11,
  };
});

function withCategories(request: RequestSeed): PurchaseRequest {
  return {
    ...request,
    categories: [...new Set(request.items.map((item) => item.category))],
  };
}

export const purchaseRequests: PurchaseRequest[] = [
  ...highlightedRequests.map(withCategories),
  ...generatedRequests.map(withCategories),
];

