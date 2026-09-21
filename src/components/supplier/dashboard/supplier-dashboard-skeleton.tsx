import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SectionCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`p-5 shadow-none ${className}`}>
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-3 w-52 max-w-full" />
      <Skeleton className="mt-6 h-52 w-full rounded-xl" />
    </Card>
  );
}

export function SupplierDashboardSkeleton() {
  return (
    <div className="space-y-5 pb-4" role="status" aria-label="در حال بارگذاری داشبورد تأمین‌کننده">
      <div className="py-1">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="mt-3 h-4 w-[32rem] max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="flex gap-3 p-4 shadow-none">
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-6 w-32 max-w-full" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,1fr)]">
        <SectionCardSkeleton className="min-h-[25rem]" />
        <SectionCardSkeleton className="min-h-[25rem]" />
      </div>

      <SectionCardSkeleton className="min-h-72" />
      <SectionCardSkeleton className="min-h-72" />
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
