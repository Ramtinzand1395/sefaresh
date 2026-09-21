import type { Metadata } from "next";
import { SupplierDashboard } from "@/components/supplier/dashboard/supplier-dashboard";
import { supplierDashboardMockData } from "@/data/supplier-dashboard";

export const metadata: Metadata = {
  title: "داشبورد",
};

export default function SupplierPage() {
  return <SupplierDashboard data={supplierDashboardMockData} />;
}
