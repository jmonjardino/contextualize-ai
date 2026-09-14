import Link from "next/link";

import { Mark } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Wordmark({
  size = 19,
  href = "/",
  className,
}: {
  size?: number;
  href?: string | null;
  className?: string;
}) {
  const inner = (
    <>
      <Mark size={Math.round(size * 1.15)} />
      <span
        className="font-display leading-none tracking-[-0.005em]"
        style={{ fontSize: size }}
      >
        Contextualize
      </span>
    </>
  );
  const classes = cn("flex items-center gap-2.5 text-ink", className);
  return href ? (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  ) : (
    <span className={classes}>{inner}</span>
  );
}
