import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Stroke-based, drawn on a 24px grid, one consistent weight. */
function Icon({ size = 17, className, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export const AskIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 5.5h15v10h-9l-6 4.5v-14.5z" />
    <path d="M8.5 9.5h7M8.5 12.5h4.5" />
  </Icon>
);

export const LibraryIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4.5h4v15H4zM10 4.5h4v15h-4z" />
    <path d="M16.8 5.6l3.4 13.6-2.3.6L14.5 6.2z" />
  </Icon>
);

export const GraphIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="7" r="2.4" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="12.5" cy="17.5" r="2.6" />
    <path d="M7.9 8.6l3.2 6.6M17 7.9l-3.2 7.1M8.2 6.4l7.9-.3" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 12h13" />
  </Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.4 15.4l4.1 4.1" />
  </Icon>
);

export const TuneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7.5h9M17.5 7.5h2.5M4 16.5h3.5M12 16.5h8" />
    <circle cx="15.2" cy="7.5" r="2.2" />
    <circle cx="9.7" cy="16.5" r="2.2" />
  </Icon>
);

export const ArrowUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 19V6.5M6.4 12.1L12 6.5l5.6 5.6" />
  </Icon>
);

export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 5h5v5M19.2 4.8l-7.7 7.7M17.5 13.5v5.5h-13v-13H10" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.2 12.6l4.4 4.4L18.8 7" />
  </Icon>
);

export const ClipIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 4.5h12v15l-6-4.2-6 4.2z" />
  </Icon>
);

export const ChevronIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5.5l6.5 6.5L9 18.5" />
  </Icon>
);

export const BackIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 5.5L8.5 12l6.5 6.5" />
  </Icon>
);

export const SparkIcon = (p: IconProps) => (
  <Icon strokeWidth={1.4} {...p}>
    <path d="M12 4.2l1.9 5.4 5.4 1.9-5.4 1.9-1.9 5.4-1.9-5.4-5.4-1.9 5.4-1.9z" />
  </Icon>
);

export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 4.5h7l8 8-7 7-8-8z" />
    <circle cx="8.6" cy="8.6" r="1.5" />
  </Icon>
);

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 7h14M9.5 7V4.8h5V7M7 7l.9 12.2h8.2L17 7" />
  </Icon>
);

/** The wordmark's companion: three indexed points, one lit. */
export function Mark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect x="0.6" y="0.6" width="20.8" height="20.8" rx="3.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.2 15.2L11 6.9l4.8 6.4" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="6.2" cy="15.2" r="2.1" fill="var(--color-ember)" />
      <circle cx="11" cy="6.9" r="1.7" fill="currentColor" />
      <circle cx="15.8" cy="13.3" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function GoogleMark({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.74 3-4.3 3-7.3z"
        fill="currentColor"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.6-2.4l-3.2-2.5c-.9.6-2.04.95-3.4.95-2.6 0-4.8-1.76-5.6-4.12H3.1v2.6A10 10 0 0 0 12 22z"
        fill="currentColor"
        opacity="0.72"
      />
      <path d="M6.4 13.93a6 6 0 0 1 0-3.84v-2.6H3.1a10 10 0 0 0 0 9.04l3.3-2.6z" fill="currentColor" opacity="0.5" />
      <path
        d="M12 5.94c1.47 0 2.78.5 3.82 1.5l2.84-2.85C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.9 5.49l3.3 2.6C7.2 7.72 9.4 5.94 12 5.94z"
        fill="currentColor"
      />
    </svg>
  );
}
