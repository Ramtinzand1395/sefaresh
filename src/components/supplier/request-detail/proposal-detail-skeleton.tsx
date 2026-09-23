import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProposalDetailSkeleton() {
  return (
    <div className="space-y-5 pb-8" role="status" aria-label="در حال بارگذاری جزئیات درخواست">
      <Skeleton className="h-4 w-72 max-w-full" />
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)]">
        <div className="space-y-5">
          <Card className="p-5">
            <Skeleton className="h-6 w-36" />
            <div className="mt-8 flex flex-col gap-5 sm:flex-row">
              <Skeleton className="size-28 shrink-0 rounded-2xl" />
              <div className="flex-1"><Skeleton className="h-6 w-48" /><Skeleton className="mt-3 h-4 w-28" /><Skeleton className="mt-6 h-28 w-full" /></div>
            </div>
          </Card>
          <Card className="p-5"><Skeleton className="h-6 w-40" /><Skeleton className="mt-6 h-32 w-full" /></Card>
        </div>
        <Card className="h-fit p-5"><Skeleton className="h-6 w-28" /><Skeleton className="mt-7 h-80 w-full" /></Card>
      </div>
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
