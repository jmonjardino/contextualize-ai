import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AskIcon,
  BackIcon,
  ExternalIcon,
  SparkIcon,
  TagIcon,
  TrashIcon,
} from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";
import { Similarity } from "@/components/ui/similarity";
import {
  chunkCount,
  clusterById,
  DOC_BODY,
  DOCS,
  docById,
  docColor,
  docRef,
  LIBRARY_STATS,
  readingMinutes,
  savedStamp,
} from "@/lib/data/library";
import { nearestTo } from "@/lib/graph-layout";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return DOCS.map((doc) => ({ id: doc.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = docById(id);
  return { title: doc ? `${doc.title} · Contextualize` : "Not found · Contextualize" };
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = docById(id);
  if (!doc) notFound();

  const cluster = clusterById(doc.cluster);
  const chunks = chunkCount(doc);
  const body = DOC_BODY[doc.id];
  const nearest = nearestTo(doc.id, 4);

  const record: [string, string][] = [
    ["Source", doc.domain],
    ["Captured", savedStamp(doc)],
    ["Words", doc.words.toLocaleString("en-GB")],
    ["Reading", `${readingMinutes(doc)} min`],
    ["Chunks", `${chunks} · 800 char`],
    ["Vectors", LIBRARY_STATS.embeddingModel],
  ];

  return (
    <>
      <header className="flex h-[57px] shrink-0 items-center justify-between gap-4 border-b border-rule px-4 lg:px-6">
        <Link href="/library" className="flex items-center gap-2 text-ink-soft hover:text-ink">
          <BackIcon size={16} />
          <span className="text-[13px] font-medium">Library</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink href={doc.url} target="_blank" rel="noreferrer" className="max-md:hidden">
            <ExternalIcon size={15} />
            Open original
          </ButtonLink>
          <Button className="max-md:hidden">
            <TagIcon size={15} />
            Tag
          </Button>
          <Button className="text-muted">
            <TrashIcon size={15} />
            Remove
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 grow">
        <article className="min-w-0 grow overflow-y-auto">
          <div className="max-w-[820px] px-6 pt-7 lg:px-13">
            <div className="mb-3.5 flex items-center gap-2.5">
              <span className="font-mono text-[11px] text-faint">№{docRef(doc)}</span>
              <span className="text-rule-firm">·</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    background: cluster ? docColor(doc) : "transparent",
                    boxShadow: cluster ? undefined : "inset 0 0 0 1px var(--color-rule-firm)",
                  }}
                />
                <Label className={cluster ? "text-ink-soft" : undefined}>
                  {cluster?.name ?? "Not yet placed"}
                </Label>
              </span>
            </div>

            <h1 className="mb-3.5 font-display text-[clamp(28px,5vw,35px)] leading-[1.18] tracking-[-0.01em]">
              {doc.title}
            </h1>

            <a
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="mb-6 flex items-center gap-2.5 font-mono text-[11px] text-muted hover:text-ember"
            >
              {doc.domain}
              <ExternalIcon size={14} />
            </a>

            <div className="rounded-sm border border-ember-line bg-[#faf1ec] px-4 py-3.5">
              <div className="mb-2 flex items-center gap-2">
                <SparkIcon size={13} className="text-ember" />
                <Label className="text-ember-deep">AI summary</Label>
              </div>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{doc.summary}</p>
            </div>

            <ChunkMap total={chunks} body={body} />
          </div>

          {/* The margin numbers are the real chunk boundaries: what got embedded,
              and which passage an answer cited. */}
          <div className="max-w-[820px] px-6 pt-2 pb-10 lg:px-13">
            {body ? (
              body.map((chunk) => (
                <div key={chunk.index} className="flex gap-5 py-2.5">
                  <div className="flex w-[34px] shrink-0 flex-col items-end gap-1.5 pt-1.5">
                    <span
                      className={cn(
                        "font-mono text-[9.5px] tracking-[0.06em]",
                        chunk.cited ? "text-ember" : "text-faint",
                      )}
                    >
                      {String(chunk.index).padStart(2, "0")}
                    </span>
                    <span className="h-px w-4.5 bg-rule" />
                  </div>
                  <p
                    className={cn(
                      "grow border-l-2 px-3 py-1.5 text-[15.5px] leading-[1.72] text-pretty",
                      chunk.cited ? "border-ember-line bg-[#faf1ec]" : "border-transparent",
                    )}
                  >
                    {chunk.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex gap-5 py-2.5">
                <div className="flex w-[34px] shrink-0 flex-col items-end gap-1.5 pt-1.5">
                  <span className="font-mono text-[9.5px] tracking-[0.06em] text-faint">··</span>
                  <span className="h-px w-4.5 bg-rule" />
                </div>
                <p className="grow border-l-2 border-transparent px-3 py-1.5 text-[15px] leading-[1.72] text-muted">
                  The stripped text of this document is not bundled in the sample library, so the
                  passages above are shown as a map rather than as prose. With the ingest pipeline
                  connected, all {chunks} of them land here, and the one an answer cited is marked
                  in the margin.
                </p>
              </div>
            )}
          </div>
        </article>

        <aside className="flex w-[322px] shrink-0 flex-col overflow-y-auto border-l border-rule bg-paper-raised max-xl:hidden">
          <div className="p-4">
            <ButtonLink href={`/ask?doc=${doc.id}`} variant="primary" size="lg" className="w-full">
              <AskIcon size={16} />
              Ask about this document
            </ButtonLink>
          </div>

          <div className="h-px bg-rule" />
          <div className="px-4 pt-3.5 pb-2">
            <Label>Record</Label>
          </div>
          <dl className="px-4 pb-3">
            {record.map(([key, value]) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-3 border-b border-rule-soft py-[7px]"
              >
                <dt className="label shrink-0 text-faint">{key}</dt>
                <dd className="text-right font-mono text-[11px] text-ink-soft">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="h-px bg-rule" />
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
            <Label>Tags</Label>
            <span className="font-mono text-[10px] text-faint">AUTO</span>
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 pb-3.5">
            {doc.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {nearest.length > 0 ? (
            <>
              <div className="h-px bg-rule" />
              <div className="px-4 pt-3.5 pb-2">
                <Label>Nearest in your library</Label>
              </div>
              <ul className="px-4 pb-4">
                {nearest.map((entry) => {
                  const related = docById(entry.docId);
                  if (!related) return null;
                  return (
                    <li key={entry.docId} className="border-b border-rule-soft">
                      <Link
                        href={`/library/${related.id}`}
                        className="flex items-start gap-2.5 py-2.5"
                      >
                        <span
                          className="mt-[5px] size-1.5 shrink-0 rounded-full"
                          style={{ background: docColor(related) }}
                        />
                        <span className="min-w-0 grow">
                          <span className="block text-xs font-medium leading-snug text-ink">
                            {related.title}
                          </span>
                          <Similarity value={entry.similarity} width={44} className="mt-1" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </aside>
      </div>
    </>
  );
}

/**
 * Every chunk in the document as one hairline bar, so the reader can see how
 * the article was cut up for retrieval even when the text itself is elsewhere.
 */
function ChunkMap({
  total,
  body,
}: {
  total: number;
  body?: { index: number; cited?: boolean }[];
}) {
  const present = new Set(body?.map((c) => c.index));
  const cited = new Set(body?.filter((c) => c.cited).map((c) => c.index));

  return (
    <div className="mt-5 mb-1">
      <div className="mb-2.5 flex items-center gap-2.5">
        <Label>Chunk map</Label>
        <span className="h-px grow bg-rule" />
        <span className="font-mono text-[10px] text-faint">{total} × 800 CHAR</span>
      </div>
      <ol className="flex flex-wrap gap-1">
        {Array.from({ length: total }, (_, i) => i + 1).map((index) => (
          <li
            key={index}
            title={`Chunk ${index}${cited.has(index) ? " — cited in an answer" : ""}`}
            className={cn(
              "h-6 w-5 rounded-xs border",
              cited.has(index)
                ? "border-ember bg-ember-wash"
                : present.has(index)
                  ? "border-rule-firm bg-surface"
                  : "border-rule bg-paper-sunk",
            )}
          />
        ))}
      </ol>
    </div>
  );
}
