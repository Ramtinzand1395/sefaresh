"use client";

import { useId, useMemo, useState } from "react";
import { IconChartLine, IconTrendingUp } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import type {
  SalesChartPeriod,
  SalesChartPoint,
  SupplierDashboardData,
} from "@/data/supplier-dashboard";

const periods: { value: SalesChartPeriod; label: string }[] = [
  { value: "7d", label: "۷ روز گذشته" },
  { value: "30d", label: "۳۰ روز گذشته" },
  { value: "3m", label: "۳ ماه گذشته" },
  { value: "6m", label: "۶ ماه گذشته" },
];

const numberFormatter = new Intl.NumberFormat("fa-IR");
const emptySalesPoints: SalesChartPoint[] = [];

function formatCompactAmount(value: number) {
  return `${numberFormatter.format(Math.round(value / 1_000_000))} م`;
}

type SupplierSalesChartProps = {
  data: SupplierDashboardData["sales"];
};

export function SupplierSalesChart({ data }: SupplierSalesChartProps) {
  const [period, setPeriod] = useState<SalesChartPeriod>("30d");
  const [activePoint, setActivePoint] = useState<SalesChartPoint | null>(null);
  const titleId = useId();
  const points = data[period] ?? emptySalesPoints;

  const chart = useMemo(() => {
    const width = 720;
    const height = 260;
    const padding = { top: 24, right: 34, bottom: 42, left: 48 };
    const values = points.map((point) => point.value);
    const maximum = Math.max(...values, 1);
    const ceiling = Math.ceil(maximum / 5_000_000) * 5_000_000;
    const usableWidth = width - padding.right - padding.left;
    const usableHeight = height - padding.top - padding.bottom;
    const coordinates = points.map((point, index) => ({
      ...point,
      x: padding.right + (index * usableWidth) / Math.max(points.length - 1, 1),
      y: padding.top + usableHeight - (point.value / ceiling) * usableHeight,
    }));
    const ticks = Array.from({ length: 5 }, (_, index) => ({
      value: (ceiling / 4) * index,
      y: padding.top + usableHeight - (usableHeight / 4) * index,
    }));

    return {
      width,
      height,
      padding,
      coordinates,
      ticks,
      polyline: coordinates.map(({ x, y }) => `${x},${y}`).join(" "),
    };
  }, [points]);

  const total = points.reduce((sum, point) => sum + point.value, 0);
  const highlightedPoint = activePoint ?? points.at(-1) ?? null;

  return (
    <Card className="flex min-h-[25rem] flex-col p-4 shadow-none sm:p-5" aria-labelledby={titleId}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <IconChartLine size={20} stroke={1.8} aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-black text-ink">روند فروش</h2>
              <p className="mt-0.5 text-[11px] text-ink-muted">فروش ثبت‌شده در بازه انتخابی</p>
            </div>
          </div>
          <p className="mt-4 text-xl font-black text-ink sm:text-2xl">
            {numberFormatter.format(total)}
            <span className="mr-1 text-xs font-bold text-ink-muted">تومان</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-success">
            <IconTrendingUp size={15} aria-hidden="true" />
            ۱۸٫۷٪ رشد نسبت به دوره قبل
          </p>
        </div>

        <div>
          <label htmlFor="supplier-sales-period" className="sr-only">بازه زمانی نمودار فروش</label>
          <select
            id="supplier-sales-period"
            value={period}
            onChange={(event) => {
              setPeriod(event.target.value as SalesChartPeriod);
              setActivePoint(null);
            }}
            className="min-h-10 rounded-control border border-line bg-white px-3 text-xs font-bold text-ink shadow-sm focus:border-primary focus:outline-none"
          >
            {periods.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative mt-5 min-h-0 flex-1 rounded-xl border border-line/70 bg-surface-subtle/45 px-1 pt-12 sm:px-3">
        {highlightedPoint ? (
          <div className="absolute left-3 top-3 z-10 rounded-lg border border-line bg-white px-3 py-2 text-[11px] shadow-card" aria-live="polite">
            <span className="font-bold text-ink">{highlightedPoint.label}</span>
            <span className="mr-2 font-black text-primary">{numberFormatter.format(highlightedPoint.value)} تومان</span>
          </div>
        ) : null}

        {points.length ? (
          <svg
            className="h-full min-h-[15rem] w-full overflow-visible text-primary"
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label={`نمودار روند فروش ${periods.find((item) => item.value === period)?.label}`}
          >
            {chart.ticks.map((tick) => (
              <g key={tick.value}>
                <line
                  x1={chart.padding.right}
                  x2={chart.width - chart.padding.left}
                  y1={tick.y}
                  y2={tick.y}
                  stroke="var(--line)"
                  strokeDasharray="4 5"
                />
                <text
                  x={chart.width - 4}
                  y={tick.y + 4}
                  textAnchor="end"
                  fill="var(--ink-muted)"
                  fontSize="10"
                >
                  {formatCompactAmount(tick.value)}
                </text>
              </g>
            ))}
            <polyline
              points={chart.polyline}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chart.coordinates.map((point, index) => (
              <g key={`${point.label}-${point.value}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.label}، ${numberFormatter.format(point.value)} تومان`}
                  onMouseEnter={() => setActivePoint(point)}
                  onMouseLeave={() => setActivePoint(null)}
                  onFocus={() => setActivePoint(point)}
                  onBlur={() => setActivePoint(null)}
                />
                <circle cx={point.x} cy={point.y} r="5" fill="white" stroke="currentColor" strokeWidth="3" pointerEvents="none" />
                {(index === 0 || index === chart.coordinates.length - 1 || index % 2 === 0) ? (
                  <text
                    x={point.x}
                    y={chart.height - 12}
                    textAnchor="middle"
                    fill="var(--ink-muted)"
                    fontSize="10"
                  >
                    {point.shortLabel}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
        ) : (
          <div className="grid min-h-[15rem] place-items-center text-sm text-ink-muted">داده‌ای برای این بازه وجود ندارد.</div>
        )}
      </div>
    </Card>
  );
}
