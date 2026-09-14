import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentLoading() {
  return (
    <>
      <div className="flex h-[57px] shrink-0 items-center border-b border-rule px-4 lg:px-6">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex min-h-0 grow">
        <div className="min-w-0 grow px-6 pt-7 lg:px-13">
          <Skeleton className="mb-4 h-3 w-32" />
          <Skeleton className="mb-3 h-9 w-4/5" />
          <Skeleton className="mb-7 h-9 w-2/5" />
          <Skeleton className="mb-6 h-20 w-full max-w-[820px] rounded-sm" />
          <div className="flex max-w-[820px] flex-col gap-3">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="w-[322px] shrink-0 border-l border-rule bg-paper-raised p-4 max-xl:hidden">
          <Skeleton className="mb-5 h-9 w-full rounded-sm" />
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="mb-3 h-3 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
