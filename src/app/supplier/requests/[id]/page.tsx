import { SupplierDetailPlaceholder } from "@/components/supplier/supplier-detail-placeholder";

export default async function SupplierRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SupplierDetailPlaceholder
      title={`درخواست خرید ${id}`}
      description="جزئیات درخواست و فرم ارائه قیمت در مرحله بعد پیاده‌سازی می‌شود."
      backHref="/supplier"
      backLabel="بازگشت به داشبورد"
    />
  );
}
