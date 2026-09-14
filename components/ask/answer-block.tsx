import { SparkIcon } from "@/components/icons";
import { Citation } from "@/components/ui/citation";
import { Label } from "@/components/ui/label";
import { SourceCard } from "@/components/ask/source-card";
import type { Answer } from "@/lib/data/library";
import { cn } from "@/lib/utils";

/** Splits "…module scope.[[1]]" into text runs and citation markers. */
function withCitations(text: string) {
  return text.split(/(\[\[\d+\]\])/).map((part, i) => {
    const match = part.match(/^\[\[(\d+)\]\]$/);
    return match ? <Citation key={i} marker={Number(match[1])} /> : part;
  });
}

export function AnswerBlock({
  answer,
  compact = false,
  showSources = true,
}: {
  answer: Answer;
  compact?: boolean;
  showSources?: boolean;
}) {
  return (
    <div className={cn("flex gap-3.5", compact && "gap-0")}>
      {!compact ? (
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-sm border border-rule bg-surface text-ember">
          <SparkIcon size={14} />
        </span>
      ) : null}

      <div className="min-w-0 grow">
        <div className="mb-2.5 flex h-[26px] items-center gap-2.5">
          {compact ? <SparkIcon size={12} className="text-ember" /> : null}
          <Label className="text-ink-soft">Second Brain</Label>
          <span className="text-rule-firm">·</span>
          <span className="font-mono text-[10px] text-faint">
            {answer.retrieved.length + answer.belowThreshold} CHUNKS ·{" "}
            {answer.citations.length} SOURCES · {answer.elapsedSeconds}s
          </span>
        </div>

        <div className={cn("text-ink", compact ? "text-[13px] leading-[1.62]" : "text-[15px] leading-[1.68]")}>
          {answer.paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {withCitations(paragraph.text)}
            </p>
          ))}

          {answer.gap ? (
            <p className="mt-4 border-l-2 border-ember-line pl-3 text-muted italic">
              {answer.gap}
            </p>
          ) : null}
        </div>

        {showSources ? (
          <>
            <div className="mt-[22px] flex items-center gap-2.5">
              <Label>Sources</Label>
              <span className="h-px grow bg-rule" />
            </div>
            <div className="mt-2.5 flex gap-2.5 max-md:-mx-6 max-md:snap-x max-md:overflow-x-auto max-md:px-6 [&>a]:max-md:w-54 [&>a]:max-md:shrink-0 [&>a]:max-md:snap-start">
              {answer.citations.map((citation) => (
                <SourceCard key={citation.marker} citation={citation} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
