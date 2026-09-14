"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AskIcon, GraphIcon, LibraryIcon, PlusIcon, TuneIcon } from "@/components/icons";
import { Dot, Label } from "@/components/ui/label";
import { Wordmark } from "@/components/workspace/wordmark";
import { useCapture } from "@/components/workspace/capture-provider";
import { CLUSTERS, LIBRARY_STATS, USER } from "@/lib/data/library";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/ask", label: "Ask", Icon: AskIcon },
  { href: "/library", label: "Library", Icon: LibraryIcon },
  { href: "/graph", label: "Graph", Icon: GraphIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open } = useCapture();
  const used = Math.round((LIBRARY_STATS.documents / LIBRARY_STATS.quota) * 100);

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-rule bg-paper-sunk max-lg:hidden">
      <div className="flex h-[57px] items-center border-b border-rule px-4">
        <Wordmark />
      </div>

      <div className="px-3 pt-3.5 pb-2.5">
        <button
          type="button"
          onClick={open}
          className="flex h-[38px] w-full items-center gap-2 rounded-sm bg-ink px-3 text-paper transition-colors hover:bg-ink-soft"
        >
          <PlusIcon size={16} />
          <span className="grow text-left text-[13px] font-medium">Capture</span>
          <kbd className="rounded-xs border border-ink-soft px-1 py-px font-mono text-[10px] text-faint">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-[34px] items-center gap-2.5 rounded-sm px-[11px] text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:bg-[#ece7dd]",
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mt-5 mb-2 flex items-center justify-between px-[11px]">
        <Label>Clusters</Label>
        <span className="font-mono text-[10px] text-faint">AUTO</span>
      </div>
      <ul className="flex flex-col px-3">
        {CLUSTERS.map((cluster) => (
          <li key={cluster.id}>
            <Link
              href={`/library?cluster=${cluster.id}`}
              className="flex h-[27px] items-center gap-2.5 rounded-sm px-[11px] hover:bg-[#ece7dd]"
            >
              <span
                className="size-[7px] shrink-0 rounded-full"
                style={{ background: cluster.color }}
              />
              <span className="grow text-[12.5px] text-ink-soft">{cluster.name}</span>
              <span className="font-mono text-[10.5px] text-faint">{cluster.count}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-rule px-4 py-3.5">
        <div className="mb-[7px] flex items-center justify-between">
          <Label>Index</Label>
          <span className="flex items-center gap-1.5">
            <Dot />
            <span className="font-mono text-[10px] text-moss">LIVE</span>
          </span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-[2px] bg-rule">
          <div className="h-[3px] bg-ink-soft" style={{ width: `${used}%` }} />
        </div>
        <p className="mt-1.5 font-mono text-[10px] text-muted">
          {LIBRARY_STATS.documents} docs · {LIBRARY_STATS.chunks.toLocaleString()} chunks
        </p>
      </div>

      <div className="flex h-[54px] items-center gap-2.5 border-t border-rule px-4">
        <span className="flex size-[27px] shrink-0 items-center justify-center rounded-sm bg-ink text-[11.5px] font-semibold text-paper">
          {USER.initials}
        </span>
        <span className="min-w-0 grow">
          <span className="block truncate text-[12.5px] font-medium leading-tight">
            {USER.name}
          </span>
          <span className="block font-mono text-[10px] text-faint">
            {USER.plan} · {LIBRARY_STATS.documents} / {LIBRARY_STATS.quota}
          </span>
        </span>
        <TuneIcon size={17} className="text-faint" />
      </div>
    </aside>
  );
}
