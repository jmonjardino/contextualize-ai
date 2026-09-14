import { GraphIcon } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Similarity } from "@/components/ui/similarity";
import { NeighbourhoodGraph } from "@/components/graph/neighbourhood-graph";
import { docById, docRef, type Answer } from "@/lib/data/library";

/**
 * What retrieval actually returned. Showing the passages — and how many fell
 * below the similarity floor — is what makes an answer checkable.
 */
export function ContextRail({ answer }: { answer: Answer | null }) {
  return (
    <aside className="flex w-[322px] shrink-0 flex-col border-l border-rule bg-paper-raised max-xl:hidden">
      <div className="flex h-11 items-center justify-between border-b border-rule px-4">
        <Label>Retrieved context</Label>
        <span className="font-mono text-[10px] text-faint">
          {answer ? `≥ ${answer.threshold.toFixed(2)}` : "—"}
        </span>
      </div>

      <div className="flex grow flex-col gap-2.5 overflow-y-auto p-3.5">
        {answer ? (
          <>
            {answer.retrieved.map((chunk) => {
              const doc = docById(chunk.docId);
              return (
                <article
                  key={chunk.id}
                  className="rounded-sm border border-rule bg-surface px-[11px] py-2.5"
                >
                  <div className="mb-[7px] flex items-center justify-between gap-2">
                    <span className="font-mono text-[9.5px] tracking-[0.07em] text-muted">
                      CHUNK {String(chunk.index).padStart(2, "0")} · №{doc ? docRef(doc) : "----"}
                    </span>
                    <Similarity value={chunk.similarity} width={38} />
                  </div>
                  <blockquote className="border-l-2 border-rule pl-2.5 text-[11.5px] leading-relaxed text-ink-soft">
                    {chunk.text}
                  </blockquote>
                  <p className="mt-2 truncate text-[10.5px] text-faint">{doc?.title}</p>
                </article>
              );
            })}
            <div className="flex items-center gap-2 px-0.5 py-0.5">
              <span className="h-px grow bg-rule" />
              <span className="font-mono text-[9.5px] text-faint">
                {answer.belowThreshold} MORE BELOW THRESHOLD
              </span>
              <span className="h-px grow bg-rule" />
            </div>
          </>
        ) : (
          <p className="px-1 pt-1 text-[12px] leading-relaxed text-faint">
            Ask something and the passages behind the answer appear here, with the score
            that got each of them chosen.
          </p>
        )}
      </div>

      <div className="mt-auto border-t border-rule px-4 pt-3.5 pb-4">
        <div className="mb-2.5 flex items-center justify-between">
          <Label>Query neighbourhood</Label>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-faint">
            <GraphIcon size={12} />
            {answer ? `${answer.citations.length} CITED` : "IDLE"}
          </span>
        </div>
        <div className="overflow-hidden rounded-sm border border-rule bg-paper">
          <NeighbourhoodGraph docIds={answer ? answer.citations.map((c) => c.docId) : []} />
        </div>
      </div>
    </aside>
  );
}
