"use client";

import { useState } from "react";

import { ArrowUpIcon } from "@/components/icons";
import { Chip } from "@/components/ui/chip";
import { LIBRARY_STATS } from "@/lib/data/library";

const BASE_SCOPES = ["Whole library", "Last 30 days", "Unread only"];

export function Composer({
  onSubmit,
  busy,
  scopeDoc,
}: {
  onSubmit: (question: string) => void;
  busy: boolean;
  /** Arriving from a document narrows the search to it until you widen it. */
  scopeDoc?: { id: string; title: string };
}) {
  const [value, setValue] = useState("");
  const scopes = scopeDoc ? [`In: ${scopeDoc.title}`, ...BASE_SCOPES] : BASE_SCOPES;
  const [scope, setScope] = useState(0);

  function submit() {
    const question = value.trim();
    if (!question || busy) return;
    onSubmit(question);
    setValue("");
  }

  return (
    <div className="shrink-0 px-6 pt-3.5 pb-5 lg:px-11">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="max-w-[740px] overflow-hidden rounded-md border border-rule-firm bg-surface focus-within:border-ink"
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Ask your library anything…"
          aria-label="Ask your library"
          className="block max-h-40 w-full resize-none bg-transparent px-4 pt-3.5 pb-2.5 text-sm leading-relaxed text-ink outline-none placeholder:text-faint"
        />
        <div className="h-px bg-rule-soft" />
        <div className="flex items-center justify-between gap-3 py-2.5 pr-2.5 pl-3">
          <div className="flex items-center gap-[7px] overflow-x-auto">
            {scopes.map((label, i) => (
              <Chip
                key={label}
                active={scope === i}
                onClick={() => setScope(i)}
                className="max-w-[15rem] [&>span:first-child]:truncate"
              >
                {label}
              </Chip>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[10px] text-faint max-sm:hidden">
              {LIBRARY_STATS.chatModel} · TOP 5
            </span>
            <button
              type="submit"
              disabled={!value.trim() || busy}
              aria-label="Ask"
              className="flex size-[31px] items-center justify-center rounded-sm bg-ink text-paper transition-colors hover:bg-ink-soft disabled:bg-paper-sunk disabled:text-dim"
            >
              <ArrowUpIcon size={17} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-2.5 flex max-w-[740px] justify-between gap-4">
        <span className="font-mono text-[10px] text-faint">
          Answers are grounded in your library. Nothing else.
        </span>
        <span className="font-mono text-[10px] text-faint max-sm:hidden">
          ↵ to send · ⇧↵ for a new line
        </span>
      </div>
    </div>
  );
}
