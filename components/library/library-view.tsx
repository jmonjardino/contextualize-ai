"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  AskIcon,
  ChevronIcon,
  ExternalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";
import { TopBar } from "@/components/workspace/topbar";
import { useCapture } from "@/components/workspace/capture-provider";
import {
  chunkCount,
  CLUSTERS,
  clusterById,
  clusterCount,
  docRef,
  DOCS,
  LIBRARY_STATS,
  savedLabel,
  type ClusterId,
} from "@/lib/data/library";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread" | "unplaced" | ClusterId;

export function LibraryView({ initialFilter }: { initialFilter?: ClusterId | "unplaced" }) {
  const { open } = useCapture();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter ?? "all");
  const [newestFirst, setNewestFirst] = useState(true);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return DOCS.filter((doc) => {
      if (filter === "unread" && !doc.unread) return false;
      if (filter === "unplaced" && doc.cluster !== null) return false;
      if (filter !== "all" && filter !== "unread" && filter !== "unplaced" && doc.cluster !== filter)
        return false;
      if (!needle) return true;
      return (
        doc.title.toLowerCase().includes(needle) ||
        doc.summary.toLowerCase().includes(needle) ||
        doc.domain.toLowerCase().includes(needle) ||
        doc.tags.some((tag) => tag.includes(needle))
      );
    }).sort((a, b) =>
      newestFirst
        ? b.savedAt.localeCompare(a.savedAt)
        : a.savedAt.localeCompare(b.savedAt),
    );
  }, [query, filter, newestFirst]);



  const activeCluster = CLUSTERS.find((c) => c.id === filter) ?? null;

  return (
    <>
      <TopBar
        title="Library"
        meta={`${LIBRARY_STATS.documents} documents · ${LIBRARY_STATS.chunks.toLocaleString()} chunks`}
        actions={
          <>
            <Button className="max-md:hidden">
              <ExternalIcon size={15} />
              Export
            </Button>
            <Button variant="primary" onClick={open}>
              <PlusIcon size={15} />
              Capture
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3 border-b border-rule px-6 py-4">
        <div className="flex h-[34px] w-full max-w-[360px] shrink items-center gap-2.5 rounded-sm border border-rule-firm bg-surface px-3 focus-within:border-ink">
          <SearchIcon size={15} className="text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, summaries and full text…"
            aria-label="Search your library"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-faint"
          />
        </div>

        {/* Clusters live in the sidebar; the toolbar keeps the filters that
            cut across them, plus whichever cluster you arrived on. */}
        <div className="flex min-w-0 grow items-center gap-2 overflow-x-auto">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
          <Chip
            active={filter === "unread"}
            onClick={() => setFilter("unread")}
            count={LIBRARY_STATS.unread}
          >
            Unread
          </Chip>
          <Chip
            active={filter === "unplaced"}
            onClick={() => setFilter("unplaced")}
            count={LIBRARY_STATS.unclustered}
          >
            Not yet placed
          </Chip>
          {activeCluster ? (
            <Chip active onClick={() => setFilter("all")} count={clusterCount(activeCluster.id)}>
              {activeCluster.name}
            </Chip>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 max-lg:hidden">
          <Label>Sort</Label>
          <Button size="md" onClick={() => setNewestFirst((v) => !v)}>
            {newestFirst ? "Newest first" : "Oldest first"}
            <ChevronIcon size={14} className="rotate-90" />
          </Button>
        </div>
      </div>

      <div className="grow overflow-y-auto">
        <div className="flex items-center gap-[18px] border-b border-rule bg-paper-raised py-2.5 pr-6 pl-5">
          <Label className="w-10 shrink-0">№</Label>
          <Label className="grow">Document</Label>
          <Label className="w-32 shrink-0 max-lg:hidden">Cluster</Label>
          <Label className="w-[58px] shrink-0 max-lg:hidden">Chunks</Label>
          <Label className="w-[138px] shrink-0 max-xl:hidden">Source</Label>
          <Label className="w-14 shrink-0 text-right">Saved</Label>
        </div>

        {rows.map((doc) => {
          const cluster = clusterById(doc.cluster);
          return (
            <div
              key={doc.id}
              className="group flex items-start gap-[18px] border-b border-rule-soft py-3.5 pr-6 pl-5 transition-colors hover:bg-paper-sunk"
            >
              <span className="w-10 shrink-0 pt-0.5 font-mono text-[10.5px] text-faint">
                №{docRef(doc)}
              </span>

              <Link href={`/library/${doc.id}`} className="min-w-0 grow">
                <span className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium leading-snug text-ink">
                    {doc.title}
                  </span>
                  {doc.unread ? (
                    <span className="shrink-0 rounded-xs border border-ember-line bg-ember-wash px-1 font-mono text-[9px] text-ember">
                      NEW
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block max-w-[620px] text-[12.5px] leading-relaxed text-muted">
                  {doc.summary}
                </span>
              </Link>

              <span className="flex w-32 shrink-0 items-center gap-2 pt-0.5 max-lg:hidden">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{
                    background: cluster?.color ?? "transparent",
                    boxShadow: cluster ? undefined : "inset 0 0 0 1px var(--color-rule-firm)",
                  }}
                />
                <span
                  className={cn(
                    "truncate text-[11.5px]",
                    cluster ? "text-ink-soft" : "text-faint",
                  )}
                >
                  {cluster?.name ?? "Not yet placed"}
                </span>
              </span>

              <span className="w-[58px] shrink-0 pt-0.5 font-mono text-[10.5px] text-faint max-lg:hidden">
                {chunkCount(doc)} ch
              </span>

              {/* Metadata gives way to row actions on hover — same footprint, no reflow. */}
              <span className="flex w-[214px] shrink-0 items-center justify-end gap-4 pt-px max-xl:w-14">
                <span className="flex items-center gap-4 group-hover:hidden">
                  <span className="w-[138px] truncate font-mono text-[10.5px] text-faint max-xl:hidden">
                    {doc.domain}
                  </span>
                  <span className="w-14 text-right font-mono text-[10.5px] text-faint">
                    {savedLabel(doc)}
                  </span>
                </span>
                <span className="hidden items-center gap-1.5 group-hover:flex">
                  <ButtonLink href={`/ask?doc=${doc.id}`} size="sm" className="max-xl:hidden">
                    <AskIcon size={14} />
                    Ask
                  </ButtonLink>
                  <ButtonLink href={doc.url} target="_blank" rel="noreferrer" size="sm">
                    <ExternalIcon size={14} />
                    Open
                  </ButtonLink>
                  <Button size="sm" aria-label="Remove" className="w-7 px-0 text-faint">
                    <TrashIcon size={14} />
                  </Button>
                </span>
              </span>
            </div>
          );
        })}

        <div className="flex items-center justify-center gap-2.5 py-5">
          <span className="h-px w-16 bg-rule" />
          <span className="font-mono text-[10.5px] text-faint">
            {rows.length === 0
              ? "NOTHING MATCHES THAT"
              : `SHOWING ${rows.length} OF ${LIBRARY_STATS.documents}`}
          </span>
          <span className="h-px w-16 bg-rule" />
        </div>
      </div>
    </>
  );
}
