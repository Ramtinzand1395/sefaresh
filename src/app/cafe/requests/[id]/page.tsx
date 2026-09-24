import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { IconArrowRight, IconFileOff } from "@tabler/icons-react";
import { objectIdSchema } from "@/domain/schemas/common";
import { RequestDetailView } from "@/components/cafe/requests/request-detail/request-detail-view";
import type { CafeRequestDetailView } from "@/components/cafe/requests/cafe-request-types";
import { Card } from "@/components/ui/card";
import { toCafeRequestDetailView } from "@/lib/cafe-request-view";
import { getCurrentCafeIdentity, getCurrentCafeMemberRole } from "@/lib/current-cafe";
import { getCafeInternalPurchaseRequestDetail } from "@/services/internal-purchase-request-service";

export const metadata: Metadata = {
  title: "جزئیات درخواست خرید",
  description: "بررسی و مدیریت جزئیات درخواست خرید داخلی کافه",
};

const REVIEWER_ROLES = new Set(["owner", "manager", "purchase_manager"]);

export default async function CafeRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  let requestView: CafeRequestDetailView | null = null;
  let canReview = false;

  try {
    const parsedId = objectIdSchema.safeParse(id);
    if (parsedId.success) {
      const { cafeId } = getCurrentCafeIdentity();
      const [detail, memberRole] = await Promise.all([
        getCafeInternalPurchaseRequestDetail(parsedId.data, cafeId),
        getCurrentCafeMemberRole(),
      ]);

      if (detail) {
        requestView = toCafeRequestDetailView(detail);
        canReview = memberRole !== null && REVIEWER_ROLES.has(memberRole);
      }
    }
  } catch {}

  if (!requestView) {
    return <UnavailableRequest />;
  }

  return <RequestDetailView request={requestView} canReview={canReview} />;
}

function UnavailableRequest() {
  return (
    <Card className="mx-auto my-10 max-w-xl p-6 text-center sm:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-danger-soft text-danger">
        <IconFileOff size={32} aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-xl font-black text-ink">درخواست در دسترس نیست</h1>
      <p className="mt-2 text-sm leading-7 text-ink-muted">
        این درخواست وجود ندارد یا دسترسی مشاهده آن برای شما مجاز نیست.
      </p>
      <Link
        href="/cafe/requests"
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
      >
        <IconArrowRight size={18} aria-hidden="true" />
        بازگشت به درخواست‌ها
      </Link>
    </Card>
  );
}
