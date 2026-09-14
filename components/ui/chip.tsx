import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Chip({
  active = false,
  count,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { active?: boolean; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium transition-colors",
        active
          ? "border-ember-line bg-ember-wash text-ember-deep"
          : "border-rule bg-surface text-ink-soft hover:border-rule-firm",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined ? (
        <span className="font-mono text-[10px] opacity-75">{count}</span>
      ) : null}
    </button>
  );
}

/** Auto-generated keyword. Not interactive — tags are derived, not chosen. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-xs border border-rule bg-paper px-1.5 py-0.5 font-mono text-[10px] tracking-[0.04em] text-ink-soft">
      {children}
    </span>
  );
}
