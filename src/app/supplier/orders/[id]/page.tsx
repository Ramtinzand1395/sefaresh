import { SupplierDetailPlaceholder } from "@/components/supplier/supplier-detail-placeholder";

export default async function SupplierOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SupplierDetailPlaceholder
      title={`سفارش ${id}`}
      description="جزئیات کامل سفارش در مرحله اختصاصی صفحه سفارش ساخته می‌شود."
      backHref="/supplier"
      backLabel="بازگشت به داشبورد"
    />
  );
}
