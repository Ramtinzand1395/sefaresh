import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

type SupplierSectionHeaderProps = {
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SupplierSectionHeader({
  title,
  href,
  linkLabel = "مشاهده همه",
}: SupplierSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
      <h2 className="text-base font-black text-ink">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-black text-primary transition hover:bg-primary-soft"
        >
          {linkLabel}
          <IconArrowLeft size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
