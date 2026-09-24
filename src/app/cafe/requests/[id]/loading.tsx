import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CafeRequestDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between rounded-xl border border-line p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
