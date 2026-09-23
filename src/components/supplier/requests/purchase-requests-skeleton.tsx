import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PurchaseRequestsSkeleton() {
  return (
    <div className="space-y-5 pb-5" aria-label="در حال بارگذاری درخواست‌های خرید" aria-busy="true">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Skeleton className="h-9 w-52" />
          <Skeleton className="mt-3 h-5 w-[min(34rem,80vw)]" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>

      <Card className="grid gap-3 p-3 shadow-none sm:grid-cols-[minmax(0,1fr)_13rem] sm:p-4">
        <Skeleton className="h-11 rounded-control" />
        <Skeleton className="h-11 rounded-control" />
      </Card>

      <Skeleton className="h-6 w-36" />
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="p-4 shadow-none sm:p-5">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(12rem,.65fr)_minmax(13rem,.75fr)_10rem] lg:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="size-16 shrink-0 rounded-xl" />
                <div className="flex-1"><Skeleton className="h-4 w-36" /><Skeleton className="mt-3 h-3 w-24" /><Skeleton className="mt-4 h-3 w-40" /></div>
              </div>
              <div><Skeleton className="h-3 w-20" /><Skeleton className="mt-3 h-7 w-24 rounded-full" /><Skeleton className="mt-3 h-3 w-36" /></div>
              <div><Skeleton className="h-3 w-20" /><Skeleton className="mt-3 h-4 w-28" /><Skeleton className="mt-3 h-3 w-40" /></div>
              <Skeleton className="h-11 w-full rounded-control md:col-span-2 lg:col-span-1" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
