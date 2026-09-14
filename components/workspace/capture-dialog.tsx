"use client";

import { useEffect, useRef, useState } from "react";

import { CheckIcon, ClipIcon, CloseIcon, SparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * The ingest pipeline, shown step by step. Each step maps to one stage of
 * `POST /api/ingest` — fetch, readability, summarise, chunk, embed — so the
 * interface tells the truth about what the server is doing.
 */
const STEPS = [
  { name: "Fetch page", detail: "0.4s" },
  { name: "Strip to readable text", detail: "1,842 WORDS" },
  { name: "Title, summary & tags", detail: "GPT-4o-MINI" },
  { name: "Split into chunks", detail: "7 × 800 CHAR" },
  { name: "Embed & store vectors", detail: "5 / 7" },
];

const SAMPLE_URL =
  "nextjs.org/docs/app/building-your-application/authentication";

export function CaptureDialog({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const running = stage >= 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (stage < 0 || stage >= STEPS.length - 1) return;
    const timer = setTimeout(() => setStage((s) => s + 1), 700);
    return () => clearTimeout(timer);
  }, [stage]);

  // TODO: POST to /api/ingest with { url } and drive the stages from the
  // response stream instead of a timer.
  function start() {
    if (!url.trim()) return;
    setStage(0);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Capture a page"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[568px] overflow-hidden rounded-lg border border-ink bg-paper shadow-modal animate-fade-up">
        <div className="flex h-[50px] items-center justify-between border-b border-rule bg-paper-sunk px-[18px]">
          <div className="flex items-center gap-2.5">
            <ClipIcon size={16} />
            <h2 className="text-sm font-semibold">Capture</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted transition-colors hover:text-ink"
          >
            <CloseIcon size={17} />
          </button>
        </div>

        <div className="px-5 pt-[18px]">
          <Label>Address</Label>
          <div className="mt-2 flex h-10 items-center gap-2.5 rounded-sm border border-rule-firm bg-surface px-3 focus-within:border-ink">
            <span className="size-4 shrink-0 rounded-xs bg-ink" aria-hidden="true" />
            <input
              ref={inputRef}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && start()}
              readOnly={running}
              placeholder={SAMPLE_URL}
              aria-label="Page address"
              className="w-full bg-transparent font-mono text-[12.5px] text-ink outline-none placeholder:text-faint"
            />
          </div>
        </div>

        {running ? (
          <>
            <div className="px-5 pt-[18px] pb-1">
              <div className="mb-1 flex items-center gap-2.5">
                <Label>Pipeline</Label>
                <span className="h-px grow bg-rule" />
                <span className="font-mono text-[10px] text-ember">
                  {Math.min(stage + 1, STEPS.length)} / {STEPS.length}
                </span>
              </div>
              {STEPS.map((step, i) => (
                <Step
                  key={step.name}
                  name={step.name}
                  detail={step.detail}
                  state={i < stage ? "done" : i === stage ? "running" : "queued"}
                />
              ))}
            </div>

            <div className="mx-5 mt-3 rounded-sm border border-rule bg-surface p-3.5">
              <div className="mb-2.5 flex items-center gap-2">
                <SparkIcon size={13} className="text-ember" />
                <Label className="text-ember-deep">Generated record</Label>
                <span className="grow" />
                <span className="font-mono text-[10px] text-faint">EDITABLE</span>
              </div>
              <p className="mb-1.5 text-sm font-medium leading-snug">
                Authentication in the Next.js App Router
              </p>
              <p className="mb-3 text-[12.5px] leading-relaxed text-muted">
                Covers session handling across Server Components, middleware and route
                handlers, with the cookies() verification rule spelled out.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Tag>next.js</Tag>
                <Tag>auth</Tag>
                <Tag>app-router</Tag>
              </div>
            </div>
          </>
        ) : (
          <p className="px-5 pt-4 text-[12.5px] leading-relaxed text-muted">
            Paste an address, or save the tab you are on with the browser extension. The
            page is stripped to its readable text, summarised, chunked and embedded.
          </p>
        )}

        <div className="mt-[18px] flex items-center justify-between gap-4 border-t border-rule bg-paper-sunk px-5 py-3.5">
          <p className="font-mono text-[10.5px] text-muted">
            Stored in your library only. Never used for training.
          </p>
          <div className="flex shrink-0 gap-2.5">
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={running ? onClose : start} disabled={!url.trim()}>
              <CheckIcon size={15} />
              {running ? "Save to library" : "Capture"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  name,
  detail,
  state,
}: {
  name: string;
  detail: string;
  state: "done" | "running" | "queued";
}) {
  return (
    <div className="flex h-8 items-center gap-[11px]">
      {state === "done" ? (
        <span className="flex size-[17px] shrink-0 items-center justify-center rounded-full bg-moss text-surface">
          <CheckIcon size={10} strokeWidth={3} />
        </span>
      ) : state === "running" ? (
        <span className="size-[17px] shrink-0 animate-spin rounded-full border-2 border-ember-line border-t-ember" />
      ) : (
        <span className="size-[17px] shrink-0 rounded-full border-[1.5px] border-rule" />
      )}
      <span
        className={cn(
          "grow text-[13px] font-medium",
          state === "done" && "text-ink",
          state === "running" && "text-ember-deep",
          state === "queued" && "text-faint",
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          "font-mono text-[10.5px]",
          state === "running" ? "text-ember" : state === "done" ? "text-muted" : "text-dim",
        )}
      >
        {detail}
      </span>
    </div>
  );
}
