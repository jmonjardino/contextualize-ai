import { cn } from "@/lib/utils";

/**
 * A block shaped like the content that is coming. It holds the layout so the
 * page does not jump when the real thing lands — the point a spinner misses.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xs bg-rule-soft", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-start gap-[18px] border-b border-rule-soft py-3.5 pr-6 pl-5">
      <Skeleton className="h-3 w-10 shrink-0" />
      <div className="flex min-w-0 grow flex-col gap-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="h-3 w-24 shrink-0 max-lg:hidden" />
      <Skeleton className="h-3 w-10 shrink-0 max-lg:hidden" />
      <Skeleton className="h-3 w-14 shrink-0" />
    </div>
  );
}
