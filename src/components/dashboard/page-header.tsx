import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-bold text-primary">{eyebrow}</p> : null}
        <h1 className="text-2xl font-black tracking-tight text-ink md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
