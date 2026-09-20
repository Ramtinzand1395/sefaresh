import { IconArrowLeft } from "@tabler/icons-react";
import { quickActions } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const tones = {
  blue: "bg-primary-soft text-primary",
  green: "bg-success-soft text-success",
  orange: "bg-accent-soft text-warning",
  violet: "bg-violet-soft text-violet",
};

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="rounded-card border border-line bg-white p-3 shadow-card sm:p-4">
      <h2 id="quick-actions-heading" className="mb-3 text-base font-black text-ink">دسترسی سریع</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.title} type="button" className={cn("group flex min-h-20 items-center gap-3 rounded-xl p-3 text-right transition hover:-translate-y-0.5", tones[item.tone])}>
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/70">
                <Icon size={25} stroke={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-black text-ink">{item.title}</strong>
                <span className="mt-1 block truncate text-[11px] text-ink-muted">{item.description}</span>
              </span>
              <IconArrowLeft className="opacity-0 transition group-hover:opacity-100" size={17} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
