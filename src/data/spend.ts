export type SpendPeriod = "six-months" | "three-months" | "year";

export type SpendTone = "blue" | "green" | "orange" | "violet";

export type SpendSummaryItem = {
  id: "monthly" | "budget" | "average" | "savings";
  label: string;
  value: string;
  suffix: string;
  hint: string;
  trend?: string;
  progress?: number;
  tone: SpendTone;
};

export type SpendPoint = {
  month: string;
  value: number;
  label: string;
  active?: boolean;
};

export type ExpenseCategory = {
  label: string;
  amount: string;
  percentage: number;
  color: string;
};

export type RecentExpense = {
  id: string;
  supplier: string;
  category: string;
  categoryTone: "blue" | "orange" | "violet";
  amount: string;
  date: string;
  status: "paid" | "pending";
  statusLabel: string;
  image: string;
};

export const spendSummary: SpendSummaryItem[] = [
  {
    id: "monthly",
    label: "خرید این ماه",
    value: "۱۲۳٬۴۵۰٬۰۰۰",
    suffix: "تومان",
    hint: "نسبت به ماه قبل",
    trend: "۱۲٪",
    tone: "green",
  },
  {
    id: "budget",
    label: "بودجه باقی‌مانده",
    value: "۴۶٬۵۵۰٬۰۰۰",
    suffix: "تومان",
    hint: "۶۵٪ از بودجه ماهانه مصرف شده است.",
    progress: 65,
    tone: "orange",
  },
  {
    id: "average",
    label: "میانگین هر سفارش",
    value: "۱٬۵۳۸٬۰۰۰",
    suffix: "تومان",
    hint: "در ۸۰ سفارش اخیر",
    tone: "blue",
  },
  {
    id: "savings",
    label: "صرفه‌جویی با سفارش",
    value: "۲٬۳۴۰٬۰۰۰",
    suffix: "تومان",
    hint: "نسبت به ماه قبل",
    tone: "orange",
  },
];

export const spendSeries: Record<SpendPeriod, SpendPoint[]> = {
  "six-months": [
    { month: "فروردین", value: 58, label: "۵۸٬۲۰۰٬۰۰۰" },
    { month: "اردیبهشت", value: 55, label: "۵۵٬۸۰۰٬۰۰۰" },
    { month: "خرداد", value: 84, label: "۸۴٬۷۰۰٬۰۰۰" },
    { month: "تیر", value: 103, label: "۱۰۳٬۴۰۰٬۰۰۰" },
    { month: "مرداد", value: 126, label: "۱۲۶٬۸۰۰٬۰۰۰" },
    { month: "شهریور", value: 123, label: "۱۲۳٬۴۵۰٬۰۰۰", active: true },
  ],
  "three-months": [
    { month: "تیر", value: 103, label: "۱۰۳٬۴۰۰٬۰۰۰" },
    { month: "مرداد", value: 126, label: "۱۲۶٬۸۰۰٬۰۰۰" },
    { month: "شهریور", value: 123, label: "۱۲۳٬۴۵۰٬۰۰۰", active: true },
  ],
  year: [
    { month: "مهر", value: 72, label: "۷۲٬۱۰۰٬۰۰۰" },
    { month: "آبان", value: 77, label: "۷۷٬۴۰۰٬۰۰۰" },
    { month: "آذر", value: 69, label: "۶۹٬۲۰۰٬۰۰۰" },
    { month: "دی", value: 92, label: "۹۲٬۸۰۰٬۰۰۰" },
    { month: "بهمن", value: 88, label: "۸۸٬۱۰۰٬۰۰۰" },
    { month: "اسفند", value: 97, label: "۹۷٬۵۰۰٬۰۰۰" },
    { month: "فروردین", value: 58, label: "۵۸٬۲۰۰٬۰۰۰" },
    { month: "اردیبهشت", value: 55, label: "۵۵٬۸۰۰٬۰۰۰" },
    { month: "خرداد", value: 84, label: "۸۴٬۷۰۰٬۰۰۰" },
    { month: "تیر", value: 103, label: "۱۰۳٬۴۰۰٬۰۰۰" },
    { month: "مرداد", value: 126, label: "۱۲۶٬۸۰۰٬۰۰۰" },
    { month: "شهریور", value: 123, label: "۱۲۳٬۴۵۰٬۰۰۰", active: true },
  ],
};

export const expenseCategories: ExpenseCategory[] = [
  { label: "مواد اولیه", amount: "۶۴٬۱۹۰٬۰۰۰", percentage: 52, color: "#2563eb" },
  { label: "نوشیدنی", amount: "۲۵٬۹۲۵٬۰۰۰", percentage: 21, color: "#ff9f1c" },
  { label: "بسته‌بندی", amount: "۱۸٬۴۰۰٬۰۰۰", percentage: 15, color: "#7c4dff" },
  { label: "سایر", amount: "۱۴٬۸۳۵٬۰۰۰", percentage: 12, color: "#cbdaf7" },
];

export const recentExpenses: RecentExpense[] = [
  {
    id: "expense-1281",
    supplier: "بازار کرمان",
    category: "مواد اولیه",
    categoryTone: "blue",
    amount: "۴٬۸۰۰٬۰۰۰",
    date: "امروز",
    status: "paid",
    statusLabel: "پرداخت‌شده",
    image: "/images/products/tomato.png",
  },
  {
    id: "expense-1280",
    supplier: "پخش بهاران",
    category: "نوشیدنی",
    categoryTone: "orange",
    amount: "۲٬۱۲۰٬۰۰۰",
    date: "دیروز",
    status: "paid",
    statusLabel: "پرداخت‌شده",
    image: "/images/products/milk.png",
  },
  {
    id: "expense-1279",
    supplier: "فودمارکت",
    category: "بسته‌بندی",
    categoryTone: "violet",
    amount: "۱٬۴۵۰٬۰۰۰",
    date: "۱۸ شهریور",
    status: "pending",
    statusLabel: "در انتظار",
    image: "/images/products/vanilla-syrup.png",
  },
  {
    id: "expense-1278",
    supplier: "زرین‌پخش",
    category: "مواد اولیه",
    categoryTone: "blue",
    amount: "۳٬۷۸۰٬۰۰۰",
    date: "۱۶ شهریور",
    status: "paid",
    statusLabel: "پرداخت‌شده",
    image: "/images/products/coffee.png",
  },
  {
    id: "expense-1277",
    supplier: "پخش سپید",
    category: "نوشیدنی",
    categoryTone: "orange",
    amount: "۹۸۰٬۰۰۰",
    date: "۱۴ شهریور",
    status: "paid",
    statusLabel: "پرداخت‌شده",
    image: "/images/products/milk.png",
  },
];
