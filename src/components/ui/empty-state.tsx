import type { TablerIcon } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: TablerIcon;
  title: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, className, action }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center", className)}>
      <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon size={28} stroke={1.8} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-black text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-6 text-ink-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
