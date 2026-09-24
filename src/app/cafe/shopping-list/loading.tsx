import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CafeShoppingListLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <Card className="p-5">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </Card>

      <Card className="divide-y divide-line p-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <Skeleton className="h-7 w-20 rounded-xl" />
          </div>
        ))}
      </Card>
    </div>
  );
}
