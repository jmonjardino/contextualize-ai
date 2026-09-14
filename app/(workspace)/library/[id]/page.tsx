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
  clusterById,
  DOC_BODY,
  DOCS,
  docById,
  LIBRARY_STATS,
  NEAREST,
} from "@/lib/data/library";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return DOCS.map((doc) => ({ id: doc.id }));
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
  const body = DOC_BODY[doc.id];
  const nearest = NEAREST[doc.id] ?? [];

  const record: [string, string][] = [
    ["Source", doc.domain],
    ["Captured", new Date(doc.savedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })],
    ["Words", doc.words.toLocaleString()],
    ["Reading", `${doc.readingMinutes} min`],
    ["Chunks", `${doc.chunks} · 800 char`],
    ["Vectors", LIBRARY_STATS.embeddingModel],
  ];

  return (
    <>
      <header className="flex h-[57px] shrink-0 items-center justify-between gap-4 border-b border-rule px-6">
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
              <span className="font-mono text-[11px] text-faint">№{doc.ref}</span>
              <span className="text-rule-firm">·</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: cluster.color }}
                />
                <Label className="text-ink-soft">{cluster.name}</Label>
              </span>
            </div>

            <h1 className="mb-3.5 font-display text-[35px] leading-[1.18] tracking-[-0.01em]">
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

            <div className="mb-2 rounded-sm border border-ember-line bg-[#faf1ec] px-4 py-3.5">
              <div className="mb-2 flex items-center gap-2">
                <SparkIcon size={13} className="text-ember" />
                <Label className="text-ember-deep">AI summary</Label>
              </div>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{doc.summary}</p>
            </div>
          </div>

          {/* The margin numbers are the real chunk boundaries: what got embedded,
              and which passage an answer cited. */}
          <div className="max-w-[820px] px-6 pt-3.5 pb-10 lg:px-13">
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
                      chunk.cited
                        ? "border-ember-line bg-[#faf1ec]"
                        : "border-transparent",
                    )}
                  >
                    {chunk.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[13.5px] leading-relaxed text-muted">
                The stripped text for this document is not loaded in this build. It lives
                in <code className="font-mono">documents.content</code>, chunked into{" "}
                {doc.chunks} passages.
              </p>
            )}
          </div>
        </article>

        <aside className="flex w-[322px] shrink-0 flex-col overflow-y-auto border-l border-rule bg-paper-raised max-xl:hidden">
          <div className="p-4">
            <ButtonLink href="/ask" variant="primary" size="lg" className="w-full">
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
                  const related = docById(entry.id);
                  if (!related) return null;
                  return (
                    <li key={entry.id} className="border-b border-rule-soft">
                      <Link
                        href={`/library/${related.id}`}
                        className="flex items-start gap-2.5 py-2.5"
                      >
                        <span
                          className="mt-[5px] size-1.5 shrink-0 rounded-full"
                          style={{ background: clusterById(related.cluster).color }}
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
