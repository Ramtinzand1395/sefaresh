import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconFileOff } from "@tabler/icons-react";
import { SupplierRequestDetail } from "@/components/supplier/request-detail/supplier-request-detail";
import { Card } from "@/components/ui/card";
import { getSupplierPurchaseRequest } from "@/data/supplier-request-detail";

export const metadata: Metadata = {
  title: "جزئیات درخواست خرید",
};

export default async function SupplierRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getSupplierPurchaseRequest(id);

  if (!request) {
    return (
      <Card className="mx-auto my-10 max-w-xl p-6 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-danger-soft text-danger"><IconFileOff size={32} /></span>
        <h1 className="mt-5 text-xl font-black text-ink">درخواست پیدا نشد</h1>
        <p className="mt-2 text-sm leading-7 text-ink-muted">این درخواست حذف شده یا دیگر در دسترس نیست.</p>
        <Link href="/supplier/requests" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"><IconArrowRight size={18} />بازگشت به درخواست‌ها</Link>
      </Card>
    );
  }

  return <SupplierRequestDetail request={request} />;
}
