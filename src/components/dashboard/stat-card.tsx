import type { TablerIcon } from "@tabler/icons-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";

const tones = {
  blue: "bg-primary-soft text-primary",
  green: "bg-success-soft text-success",
  orange: "bg-warning-soft text-warning",
  violet: "bg-violet-soft text-violet",
} as const;

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  trend?: string;
  icon: TablerIcon;
  tone?: keyof typeof tones;
};

export function StatCard({ label, value, hint, trend, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <Card className="p-3.5 shadow-none sm:p-4">
      <div className="flex items-start gap-3">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon size={23} stroke={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-ink-muted">{label}</p>
          <p className="mt-2 whitespace-nowrap text-lg font-black text-ink" dir="auto">{value}</p>
          <p className="mt-1 flex items-center gap-1 text-[10px] leading-5 text-ink-muted">
            {hint}
            {trend ? <span className="font-black text-success">↗ {trend}</span> : null}
          </p>
        </div>
      </div>
    </Card>
  );
}
