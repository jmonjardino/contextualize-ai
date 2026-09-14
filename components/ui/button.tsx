import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-colors disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft disabled:bg-paper-sunk disabled:text-dim",
  ghost:
    "border border-rule bg-surface text-ink-soft hover:border-rule-firm hover:text-ink disabled:border-rule-soft disabled:bg-paper-sunk disabled:text-dim",
  quiet: "text-muted hover:bg-paper-sunk hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-[11.5px]",
  md: "h-8 px-3 text-[12.5px]",
  lg: "h-[38px] px-4 text-[13px]",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({
  variant = "ghost",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({
  variant = "ghost",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

/** Square icon-only control, sized to match the text buttons. */
export function IconButton({
  className,
  variant = "ghost",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        "size-8 p-0",
        className,
      )}
      {...props}
    />
  );
}
