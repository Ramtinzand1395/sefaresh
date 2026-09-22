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

      <Card className="p-3 shadow-none sm:p-4">
        <Skeleton className="h-12 w-full rounded-control" />
        <div className="mt-3 hidden grid-cols-6 gap-2 lg:grid">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-11 rounded-control" />)}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
          <Skeleton className="h-11 rounded-control" />
          <Skeleton className="h-11 rounded-control" />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-2 hidden h-4 w-72 sm:block" />
        </div>
        <Skeleton className="hidden h-11 w-48 rounded-control lg:block" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="p-4 shadow-none sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(12rem,.95fr)_minmax(13rem,1.25fr)_minmax(8rem,.7fr)_minmax(9rem,.8fr)_minmax(9rem,auto)] lg:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 shrink-0 rounded-xl" />
                <div className="flex-1"><Skeleton className="h-4 w-28" /><Skeleton className="mt-2 h-3 w-16" /></div>
              </div>
              <div><Skeleton className="h-3 w-28" /><Skeleton className="mt-3 h-3 w-full" /><Skeleton className="mt-2 h-3 w-4/5" /><Skeleton className="mt-2 h-3 w-3/5" /></div>
              <div><Skeleton className="h-3 w-20" /><Skeleton className="mt-2 h-4 w-28" /><Skeleton className="mt-4 h-3 w-24" /></div>
              <div><Skeleton className="h-4 w-24" /><Skeleton className="mt-3 h-2 w-full rounded-full" /><Skeleton className="mt-3 h-7 w-32 rounded-full" /></div>
              <Skeleton className="h-11 w-full rounded-control" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
