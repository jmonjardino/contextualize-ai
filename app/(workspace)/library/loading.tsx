import { Skeleton, SkeletonRow } from "@/components/ui/skeleton";

export default function LibraryLoading() {
  return (
    <>
      <div className="flex h-[57px] shrink-0 items-center gap-3 border-b border-rule px-4 lg:px-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-44" />
      </div>
      <div className="flex items-center gap-3 border-b border-rule px-6 py-4">
        <Skeleton className="h-[34px] w-full max-w-[360px] rounded-sm" />
        <Skeleton className="h-[26px] w-16 rounded-full" />
        <Skeleton className="h-[26px] w-24 rounded-full" />
        <Skeleton className="h-[26px] w-28 rounded-full" />
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}
