import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { IconArrowRight, IconFileOff } from "@tabler/icons-react";
import { SupplierRequestDetail } from "@/components/supplier/request-detail/supplier-request-detail";
import type { SupplierRequestView } from "@/components/supplier/requests/supplier-request-types";
import { Card } from "@/components/ui/card";
import { getCurrentSupplierId } from "@/lib/current-supplier";
import { toSupplierRequestView } from "@/lib/supplier-request-view";
import { getSupplierRequestDetail } from "@/services/supplier-request-service";

export const metadata: Metadata = {
  title: "جزئیات درخواست خرید",
};

export default async function SupplierRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  let requestView: SupplierRequestView | null = null;

  try {
    const supplierId = getCurrentSupplierId();
    const request = await getSupplierRequestDetail(id, supplierId);
    requestView = request ? toSupplierRequestView(request) : null;
  } catch {}

  return requestView
    ? <SupplierRequestDetail request={requestView} />
    : <UnavailableRequest />;
}

function UnavailableRequest() {
  return (
    <Card className="mx-auto my-10 max-w-xl p-6 text-center sm:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-danger-soft text-danger">
        <IconFileOff size={32} aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-xl font-black text-ink">درخواست در دسترس نیست</h1>
      <p className="mt-2 text-sm leading-7 text-ink-muted">
        این درخواست وجود ندارد یا اجازه مشاهده آن را ندارید.
      </p>
      <Link
        href="/supplier/requests"
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
      >
        <IconArrowRight size={18} aria-hidden="true" />
        بازگشت به درخواست‌ها
      </Link>
    </Card>
  );
}
