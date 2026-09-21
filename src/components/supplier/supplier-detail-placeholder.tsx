import Link from "next/link";
import { IconArrowRight, IconClock } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

type SupplierDetailPlaceholderProps = {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
};

export function SupplierDetailPlaceholder({
  title,
  description,
  backHref,
  backLabel,
}: SupplierDetailPlaceholderProps) {
  return (
    <Card className="mx-auto max-w-2xl p-6 text-center shadow-none sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <IconClock size={28} stroke={1.8} aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-xl font-black text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-muted">{description}</p>
      <Link
        href={backHref}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-line bg-white px-4 text-sm font-black text-primary transition hover:bg-primary-soft"
      >
        <IconArrowRight size={17} aria-hidden="true" />
        {backLabel}
      </Link>
    </Card>
  );
}
