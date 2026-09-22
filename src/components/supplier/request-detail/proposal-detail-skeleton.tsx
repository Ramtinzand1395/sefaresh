import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProposalDetailSkeleton() {
  return (
    <div className="space-y-5 pb-8" role="status" aria-label="در حال بارگذاری جزئیات درخواست">
      <div>
        <Skeleton className="h-4 w-72 max-w-full" />
        <Skeleton className="mt-5 h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
        <div className="space-y-4">
          <Card className="p-5"><Skeleton className="h-5 w-40" /><Skeleton className="mt-6 h-36 w-full" /></Card>
          <Card className="p-5"><Skeleton className="h-5 w-36" /><Skeleton className="mt-6 h-24 w-full" /></Card>
          <Card className="p-5"><Skeleton className="h-5 w-44" /><Skeleton className="mt-6 h-80 w-full" /></Card>
        </div>
        <Card className="h-fit p-5"><Skeleton className="h-6 w-36" /><Skeleton className="mt-7 h-72 w-full" /></Card>
      </div>
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
