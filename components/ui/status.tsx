import { cn } from "@/lib/utils";

import { Dot } from "./label";

export function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-moss-line bg-moss-wash px-2.5 py-[3px]",
        className,
      )}
    >
      <Dot />
      <span className="font-mono text-[10px] tracking-[0.06em] text-moss">{children}</span>
    </span>
  );
}
