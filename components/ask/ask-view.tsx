"use client";

import { useState } from "react";

import { AnswerBlock } from "@/components/ask/answer-block";
import { Composer } from "@/components/ask/composer";
import { ContextRail } from "@/components/ask/context-rail";
import { Chip } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";
import { Mono } from "@/components/ui/label";
import { StatusPill } from "@/components/ui/status";
import { TopBar } from "@/components/workspace/topbar";
import { askLibrary, LIBRARY_STATS, SAMPLE_ANSWER, type Answer } from "@/lib/data/library";

type Turn =
  | { kind: "question"; text: string; at: string }
  | { kind: "answer"; answer: Answer }
  | { kind: "pending" };

export function AskView() {
  const [turns, setTurns] = useState<Turn[]>([
    { kind: "question", text: SAMPLE_ANSWER.question, at: SAMPLE_ANSWER.askedAt },
    { kind: "answer", answer: SAMPLE_ANSWER },
  ]);
  const [busy, setBusy] = useState(false);

  const latestAnswer =
    [...turns].reverse().find((t): t is { kind: "answer"; answer: Answer } => t.kind === "answer")
      ?.answer ?? null;

  async function ask(question: string) {
    const at = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTurns((current) => [...current, { kind: "question", text: question, at }, { kind: "pending" }]);
    setBusy(true);
    const answer = await askLibrary(question);
    setTurns((current) => [...current.slice(0, -1), { kind: "answer", answer }]);
    setBusy(false);
  }

  return (
    <>
      <TopBar
        title="Ask"
        meta={`grounded in ${LIBRARY_STATS.documents} documents`}
        actions={
          <>
            <Mono className="text-[10px] max-md:hidden">{LIBRARY_STATS.documents} DOCS</Mono>
            <span className="text-rule-firm max-md:hidden">|</span>
            <Mono className="text-[10px] max-md:hidden">
              {LIBRARY_STATS.chunks.toLocaleString()} CHUNKS
            </Mono>
            <StatusPill>INDEX LIVE</StatusPill>
          </>
        }
      />

      <div className="flex min-h-0 grow">
        <section className="flex min-w-0 grow flex-col">
          <div className="flex grow flex-col gap-6 overflow-y-auto px-6 pt-7 pb-2 lg:px-11">
            {turns.map((turn, i) => {
              if (turn.kind === "question") {
                return (
                  <div key={i} className="flex max-w-[700px] flex-col gap-2.5">
                    <Label>You · {turn.at}</Label>
                    <p className="font-display text-[25px] leading-[1.28] tracking-[-0.005em]">
                      {turn.text}
                    </p>
                  </div>
                );
              }
              if (turn.kind === "pending") {
                return (
                  <div key={i} className="flex max-w-[700px] items-center gap-3.5">
                    <span className="size-[26px] shrink-0 animate-spin rounded-full border-2 border-ember-line border-t-ember" />
                    <Label className="text-ember-deep">Embedding your question · searching vectors</Label>
                  </div>
                );
              }
              return (
                <div key={i} className="max-w-[700px] animate-fade-up">
                  <AnswerBlock answer={turn.answer} />
                  <div className="mt-5 flex flex-wrap gap-2">
                    {turn.answer.followUps.map((follow) => (
                      <Chip key={follow} onClick={() => ask(follow)}>
                        {follow}
                      </Chip>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <Composer onSubmit={ask} busy={busy} />
        </section>

        <ContextRail answer={busy ? null : latestAnswer} />
      </div>
    </>
  );
}
