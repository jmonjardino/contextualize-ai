import { cn } from "@/lib/utils";

/** Mono, uppercase, letter-spaced. Section headings and machine-set metadata. */
export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("label", className)}>{children}</span>;
}

/** Mono, sentence case. Counts, scores, timestamps, identifiers. */
export function Mono({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("font-mono text-[11px] text-muted", className)}>{children}</span>
  );
}

export function Dot({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block size-1.5 shrink-0 rounded-full bg-moss", className)}
      aria-hidden="true"
    />
  );
}
