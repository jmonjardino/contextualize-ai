import { ChevronIcon, Mark, PlusIcon } from "@/components/icons";
import { AnswerBlock } from "@/components/ask/answer-block";
import { ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/ui/status";
import { LIBRARY_STATS, SAMPLE_ANSWER } from "@/lib/data/library";

export function Hero() {
  return (
    <section className="flex items-start gap-15 px-6 pt-16 pb-20 max-xl:flex-col lg:px-14">
      <div className="max-w-[600px] grow">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-ember" />
          <Label className="text-ink-soft">A second brain with citations</Label>
        </div>

        <h1 className="mb-6 font-display text-[clamp(48px,7vw,76px)] leading-[1.02] tracking-[-0.022em]">
          Stop saving.
          <br />
          <span className="text-ember italic">Start using.</span>
        </h1>

        <p className="mb-4 max-w-[48ch] text-[18px] leading-[1.6] text-ink-soft text-pretty">
          You have read the answer already. It is in a tab you closed, an article you
          bookmarked, a link you sent yourself at midnight. Contextualize keeps the text,
          not the link — and answers from it.
        </p>
        <p className="mb-8 max-w-[52ch] text-sm leading-[1.6] text-muted">
          One click saves the page. Every answer cites the pieces it came from, so you can
          go back and read the original.
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <ButtonLink href="/ask" variant="primary" className="h-[46px] px-5 text-[14.5px]">
            <PlusIcon size={17} />
            Add to Chrome
          </ButtonLink>
          <ButtonLink href="/ask" className="h-[46px] px-5 text-sm">
            See a live library
            <ChevronIcon size={15} />
          </ButtonLink>
        </div>

        <ul className="flex flex-wrap items-center gap-4">
          {["Chrome & Edge", `Free for ${LIBRARY_STATS.quota} documents`, "Export any time"].map(
            (item, i) => (
              <li key={item} className="flex items-center gap-4">
                {i > 0 ? <span className="text-rule-firm">·</span> : null}
                <span className="font-mono text-[11px] tracking-[0.06em] text-faint uppercase">
                  {item}
                </span>
              </li>
            ),
          )}
        </ul>
      </div>

      <div className="w-full max-w-[596px] shrink-0 overflow-hidden rounded-lg border border-ink bg-surface shadow-lift">
        <div className="flex h-[38px] items-center justify-between border-b border-rule bg-paper-sunk px-3.5">
          <div className="flex items-center gap-2">
            <Mark size={15} />
            <Label className="text-ink-soft">Ask</Label>
          </div>
          <StatusPill>{LIBRARY_STATS.documents} DOCS INDEXED</StatusPill>
        </div>
        <div className="px-5 pt-4.5 pb-5">
          <p className="mb-3.5 font-display text-[19px] leading-[1.3]">
            {SAMPLE_ANSWER.question}
          </p>
          <AnswerBlock answer={SAMPLE_ANSWER} compact />
        </div>
      </div>
    </section>
  );
}
