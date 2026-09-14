import { cn } from "@/lib/utils";

/**
 * Cosine similarity between a chunk and the query, shown as a hairline meter
 * plus the literal value — the number is the point, the bar is the glance.
 */
export function Similarity({
  value,
  width = 64,
  className,
}: {
  value: number;
  width?: number;
  className?: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className={cn("flex items-center gap-[7px]", className)}>
      <div
        className="h-[3px] overflow-hidden rounded-[2px] bg-[#dfd7c8]"
        style={{ width }}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-label="Similarity to your question"
      >
        <div className="h-[3px] bg-ember" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-ink-soft">{value.toFixed(2)}</span>
    </div>
  );
}
