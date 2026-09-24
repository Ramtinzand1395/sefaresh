import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SupplierProductsSkeleton() {
  return (
    <div className="space-y-5 pb-6" aria-label="در حال بارگذاری محصولات" aria-busy="true">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><Skeleton className="h-9 w-40" /><Skeleton className="mt-3 h-5 w-[min(34rem,80vw)]" /></div>
        <Skeleton className="h-11 w-36 rounded-control" />
      </div>
      <Card className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_24rem]"><Skeleton className="h-11 rounded-control" /><Skeleton className="h-11 rounded-control" /></Card>
      <Skeleton className="h-6 w-28" />
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="p-5 shadow-none">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(10rem,.65fr)_minmax(13rem,.8fr)_11rem]">
              <div className="flex gap-3"><Skeleton className="size-16 shrink-0 rounded-xl" /><div className="flex-1"><Skeleton className="h-4 w-36" /><Skeleton className="mt-3 h-3 w-24" /><Skeleton className="mt-4 h-7 w-32 rounded-full" /></div></div>
              <Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-20 w-full md:col-span-2 lg:col-span-1" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
