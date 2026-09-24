import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsSkeleton() {
  return (
    <div className="space-y-5" aria-label="در حال بارگذاری بازار کالاها" aria-busy="true">
      <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><Skeleton className="h-4 w-32" /><Skeleton className="mt-2 h-9 w-40" /><Skeleton className="mt-3 h-5 w-96 max-w-full" /></div><Skeleton className="h-12 w-36 rounded-control" /></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Card key={index} className="h-28 p-4"><Skeleton className="h-full w-full" /></Card>)}</div>
      <Card className="h-32 p-4"><Skeleton className="h-full w-full" /></Card>
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Card key={index} className="h-64 p-4"><Skeleton className="h-full w-full" /></Card>)}</div>
    </div>
  );
}
