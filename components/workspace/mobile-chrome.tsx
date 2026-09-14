"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AskIcon, GraphIcon, LibraryIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { Wordmark } from "@/components/workspace/wordmark";
import { useCapture } from "@/components/workspace/capture-provider";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/ask", label: "Ask", Icon: AskIcon },
  { href: "/library", label: "Library", Icon: LibraryIcon },
  { href: "/graph", label: "Graph", Icon: GraphIcon },
];

/**
 * Below the sidebar breakpoint the rail is replaced by a header and a tab bar.
 * No painted status bar: the real one renders above this on a phone.
 */
export function MobileHeader() {
  const { open } = useCapture();
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-rule px-4 lg:hidden">
      <Wordmark size={17} />
      <div className="flex items-center gap-2">
        <Link
          href="/library"
          aria-label="Search your library"
          className="flex size-11 items-center justify-center text-ink-soft"
        >
          <SearchIcon size={20} />
        </Link>
        <button
          type="button"
          onClick={open}
          aria-label="Capture a page"
          className="flex size-11 items-center justify-center rounded-sm bg-ink text-paper"
        >
          <PlusIcon size={20} />
        </button>
      </div>
    </header>
  );
}

export function MobileTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex h-14 shrink-0 border-t border-rule bg-paper-sunk lg:hidden">
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1",
              active ? "text-ink" : "text-faint",
            )}
          >
            <Icon size={20} />
            <span className="text-[10.5px] font-medium">{label}</span>
            <span
              className={cn("h-0.5 w-5.5 rounded-full", active ? "bg-ink" : "bg-transparent")}
            />
          </Link>
        );
      })}
    </nav>
  );
}
