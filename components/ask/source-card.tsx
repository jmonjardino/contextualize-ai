import Link from "next/link";

import { Similarity } from "@/components/ui/similarity";
import { docById, savedLabel, type Citation } from "@/lib/data/library";

export function SourceCard({ citation }: { citation: Citation }) {
  const doc = docById(citation.docId);
  if (!doc) return null;

  return (
    <Link
      href={`/library/${doc.id}`}
      className="flex min-w-0 flex-1 flex-col gap-[7px] rounded-sm border border-rule bg-surface px-3 py-2.5 transition-colors hover:border-rule-firm"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-xs border border-ember-line bg-ember-wash px-1 font-mono text-[10px] leading-tight text-ember">
          {citation.marker}
        </span>
        <Similarity value={citation.similarity} width={40} />
      </div>
      <p className="text-[12.5px] font-medium leading-snug text-ink">{doc.title}</p>
      <p className="mt-auto flex items-center gap-1.5 font-mono text-[10px] text-muted">
        <span className="truncate">{doc.domain}</span>
        <span className="text-rule-firm">·</span>
        <span className="shrink-0 text-faint">{savedLabel(doc)}</span>
      </p>
    </Link>
  );
}
