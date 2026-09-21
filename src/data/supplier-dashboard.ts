export type SupplierDashboardStatKind =
  | "monthly_sales"
  | "new_orders"
  | "new_requests"
  | "settlement";

export type SupplierDashboardStats = {
  kind: SupplierDashboardStatKind;
  title: string;
  value: number;
  unit: "تومان" | "سفارش" | "درخواست";
  description: string;
  trend: string;
  tone: "blue" | "green" | "orange" | "violet";
};

export type SupplierActionVariant = "urgent" | "warning" | "info" | "success";

export type SupplierActionItem = {
  id: string;
  count: number;
  title: string;
  cta: string;
  href: string;
  variant: SupplierActionVariant;
};

export type PurchaseRequestUrgency = "urgent" | "warning" | "normal";

export type PurchaseRequestSummary = {
  id: string;
  buyerName: string;
  buyerInitials: string;
  city: string;
  itemCount: number;
  estimatedValue: number;
  deadline: string;
  urgency: PurchaseRequestUrgency;
};

export type SupplierOrderStatus =
  | "new"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled";

export type SupplierOrderSummary = {
  id: string;
  buyerName: string;
  amount: number;
  status: SupplierOrderStatus;
  date: string;
};

export type SalesChartPeriod = "7d" | "30d" | "3m" | "6m";

export type SalesChartPoint = {
  label: string;
  shortLabel: string;
  value: number;
};

export type SupplierDashboardData = {
  stats: SupplierDashboardStats[];
  actions: SupplierActionItem[];
  purchaseRequests: PurchaseRequestSummary[];
  recentOrders: SupplierOrderSummary[];
  sales: Record<SalesChartPeriod, SalesChartPoint[]>;
};

export const supplierDashboardMockData: SupplierDashboardData = {
  stats: [
    {
      kind: "monthly_sales",
      title: "فروش این ماه",
      value: 84_500_000,
      unit: "تومان",
      description: "نسبت به ماه قبل",
      trend: "+۱۸٫۷٪",
      tone: "green",
    },
    {
      kind: "new_orders",
      title: "سفارش‌های جدید",
      value: 12,
      unit: "سفارش",
      description: "نسبت به هفته قبل",
      trend: "+۴",
      tone: "blue",
    },
    {
      kind: "new_requests",
      title: "درخواست قیمت جدید",
      value: 28,
      unit: "درخواست",
      description: "نسبت به هفته قبل",
      trend: "+۸",
      tone: "orange",
    },
    {
      kind: "settlement",
      title: "مبلغ قابل تسویه",
      value: 32_800_000,
      unit: "تومان",
      description: "بیشتر نسبت به ماه قبل",
      trend: "۸٪",
      tone: "violet",
    },
  ],
  actions: [
    {
      id: "waiting-quotes",
      count: 5,
      title: "درخواست خرید منتظر قیمت شماست",
      cta: "مشاهده درخواست‌ها",
      href: "/supplier/requests",
      variant: "urgent",
    },
    {
      id: "prepare-today",
      count: 3,
      title: "سفارش باید امروز آماده شود",
      cta: "مشاهده سفارش‌ها",
      href: "/supplier/orders",
      variant: "warning",
    },
    {
      id: "ready-to-ship",
      count: 2,
      title: "سفارش آماده ارسال است",
      cta: "مشاهده ارسال‌ها",
      href: "/supplier/shipments",
      variant: "info",
    },
    {
      id: "settled",
      count: 1,
      title: "تسویه انجام شده",
      cta: "مشاهده جزئیات",
      href: "/supplier/finance",
      variant: "success",
    },
  ],
  purchaseRequests: [
    {
      id: "pr-1098",
      buyerName: "کافه آریا",
      buyerInitials: "ک‌آ",
      city: "کرمان",
      itemCount: 12,
      estimatedValue: 9_800_000,
      deadline: "۲ ساعت",
      urgency: "urgent",
    },
    {
      id: "pr-1097",
      buyerName: "رستوران نارون",
      buyerInitials: "ر‌ن",
      city: "کرمان",
      itemCount: 8,
      estimatedValue: 6_450_000,
      deadline: "۵ ساعت",
      urgency: "warning",
    },
    {
      id: "pr-1096",
      buyerName: "کافه لمیز",
      buyerInitials: "ک‌ل",
      city: "کرمان",
      itemCount: 15,
      estimatedValue: 13_300_000,
      deadline: "۱ روز",
      urgency: "normal",
    },
  ],
  recentOrders: [
    {
      id: "O-2847",
      buyerName: "کافه آریا",
      amount: 8_900_000,
      status: "processing",
      date: "۲۳ شهریور ۱۴۰۵",
    },
    {
      id: "O-2846",
      buyerName: "رستوران نارون",
      amount: 6_200_000,
      status: "ready_to_ship",
      date: "۲۲ شهریور ۱۴۰۵",
    },
    {
      id: "O-2845",
      buyerName: "کافه لمیز",
      amount: 12_500_000,
      status: "new",
      date: "۲۱ شهریور ۱۴۰۵",
    },
    {
      id: "O-2844",
      buyerName: "رستوران باران",
      amount: 4_800_000,
      status: "delivered",
      date: "۲۰ شهریور ۱۴۰۵",
    },
  ],
  sales: {
    "7d": [
      { label: "شنبه ۲۰ شهریور", shortLabel: "شنبه", value: 2_900_000 },
      { label: "یکشنبه ۲۱ شهریور", shortLabel: "یکشنبه", value: 4_200_000 },
      { label: "دوشنبه ۲۲ شهریور", shortLabel: "دوشنبه", value: 3_700_000 },
      { label: "سه‌شنبه ۲۳ شهریور", shortLabel: "سه‌شنبه", value: 6_400_000 },
      { label: "چهارشنبه ۲۴ شهریور", shortLabel: "چهارشنبه", value: 5_800_000 },
      { label: "پنجشنبه ۲۵ شهریور", shortLabel: "پنجشنبه", value: 8_100_000 },
      { label: "جمعه ۲۶ شهریور", shortLabel: "جمعه", value: 7_350_000 },
    ],
    "30d": [
      { label: "۱ شهریور", shortLabel: "۱ شهریور", value: 4_200_000 },
      { label: "۵ شهریور", shortLabel: "۵ شهریور", value: 6_150_000 },
      { label: "۹ شهریور", shortLabel: "۹ شهریور", value: 5_400_000 },
      { label: "۱۳ شهریور", shortLabel: "۱۳ شهریور", value: 7_800_000 },
      { label: "۱۷ شهریور", shortLabel: "۱۷ شهریور", value: 7_100_000 },
      { label: "۲۱ شهریور", shortLabel: "۲۱ شهریور", value: 9_450_000 },
      { label: "۲۳ شهریور", shortLabel: "۲۳ شهریور", value: 10_850_000 },
      { label: "۲۶ شهریور", shortLabel: "۲۶ شهریور", value: 9_550_000 },
      { label: "۳۰ شهریور", shortLabel: "۳۰ شهریور", value: 12_200_000 },
    ],
    "3m": [
      { label: "هفته اول تیر", shortLabel: "۱ تیر", value: 11_200_000 },
      { label: "هفته سوم تیر", shortLabel: "۱۵ تیر", value: 13_800_000 },
      { label: "هفته اول مرداد", shortLabel: "۱ مرداد", value: 12_900_000 },
      { label: "هفته سوم مرداد", shortLabel: "۱۵ مرداد", value: 16_400_000 },
      { label: "هفته اول شهریور", shortLabel: "۱ شهریور", value: 18_200_000 },
      { label: "هفته سوم شهریور", shortLabel: "۱۵ شهریور", value: 21_950_000 },
      { label: "پایان شهریور", shortLabel: "۳۰ شهریور", value: 24_100_000 },
    ],
    "6m": [
      { label: "فروردین ۱۴۰۵", shortLabel: "فروردین", value: 42_000_000 },
      { label: "اردیبهشت ۱۴۰۵", shortLabel: "اردیبهشت", value: 48_500_000 },
      { label: "خرداد ۱۴۰۵", shortLabel: "خرداد", value: 45_800_000 },
      { label: "تیر ۱۴۰۵", shortLabel: "تیر", value: 56_400_000 },
      { label: "مرداد ۱۴۰۵", shortLabel: "مرداد", value: 71_200_000 },
      { label: "شهریور ۱۴۰۵", shortLabel: "شهریور", value: 84_500_000 },
    ],
  },
};
