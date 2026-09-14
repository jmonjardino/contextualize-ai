/**
 * Sample library data.
 *
 * The front end reads everything through this module so that swapping in the
 * real Supabase queries is a single-file change: each export below maps to one
 * table or RPC in the MVP schema (documents, document_chunks, match_documents).
 *
 * Nothing here is real user content — titles, domains, similarity scores and
 * counts are written as plausible sample data for the interface.
 */

export type ClusterId = "ai" | "frontend" | "infra" | "design";

export type Cluster = {
  id: ClusterId;
  name: string;
  /** Documents assigned to this cluster. */
  count: number;
  /** Token name, resolved against the palette in globals.css. */
  color: string;
};

export type Doc = {
  id: string;
  /** Catalogue number shown in the UI as №0147. */
  ref: string;
  title: string;
  url: string;
  domain: string;
  /** One-line summary generated at ingest time. */
  summary: string;
  cluster: ClusterId;
  chunks: number;
  words: number;
  readingMinutes: number;
  savedAt: string;
  savedLabel: string;
  tags: string[];
  unread?: boolean;
};

export type Chunk = {
  id: string;
  docId: string;
  /** 1-based position of the chunk within its document. */
  index: number;
  text: string;
  /** Cosine similarity to the query, as returned by match_documents. */
  similarity: number;
};

export type Citation = {
  marker: number;
  docId: string;
  similarity: number;
};

export type Answer = {
  question: string;
  askedAt: string;
  /** Paragraphs. `[[n]]` in the text renders citation marker n in place. */
  paragraphs: { text: string }[];
  /** What the library does not contain — rendered as an aside. */
  gap?: string;
  citations: Citation[];
  retrieved: Chunk[];
  belowThreshold: number;
  threshold: number;
  model: string;
  elapsedSeconds: number;
  followUps: string[];
};

export const CLUSTERS: Cluster[] = [
  { id: "ai", name: "AI & Agents", count: 42, color: "var(--color-ember)" },
  { id: "frontend", name: "Frontend", count: 31, color: "var(--color-moss)" },
  { id: "infra", name: "Infrastructure", count: 18, color: "var(--color-ink)" },
  { id: "design", name: "Design", count: 12, color: "var(--color-gold)" },
];

export const clusterById = (id: ClusterId) =>
  CLUSTERS.find((c) => c.id === id) ?? CLUSTERS[0];

export const LIBRARY_STATS = {
  documents: 184,
  chunks: 1247,
  clustered: 103,
  unclustered: 81,
  quota: 500,
  embeddingModel: "text-embedding-3-small",
  chatModel: "GPT-4o",
};

export const USER = {
  name: "João Monjardino",
  initials: "JM",
  plan: "Free",
};

export const DOCS: Doc[] = [
  {
    id: "server-components-cookies",
    ref: "0147",
    title: "Server Components and the cookies() boundary",
    url: "https://nextjs.org/docs/app/building-your-application/authentication",
    domain: "nextjs.org/docs",
    summary:
      "Any value derived from cookies() must be re-verified per read, never memoised at module scope.",
    cluster: "ai",
    chunks: 7,
    words: 1842,
    readingMinutes: 8,
    savedAt: "2026-03-12T09:14:00Z",
    savedLabel: "12 Mar",
    tags: ["next.js", "auth", "server-components", "cookies"],
  },
  {
    id: "embedding-models",
    ref: "0146",
    title: "Embedding models are not interchangeable",
    url: "https://pilcrow.dev/embedding-models",
    domain: "pilcrow.dev",
    summary:
      "Swapping text-embedding-3-small for a larger model invalidates every vector you already stored.",
    cluster: "ai",
    chunks: 11,
    words: 2410,
    readingMinutes: 11,
    savedAt: "2026-03-11T18:02:00Z",
    savedLabel: "11 Mar",
    tags: ["embeddings", "migration"],
  },
  {
    id: "pgvector-index-types",
    ref: "0145",
    title: "A field guide to pgvector index types",
    url: "https://supabase.com/docs/guides/ai/vector-indexes",
    domain: "supabase.com/docs",
    summary:
      "IVFFlat trades recall for speed; HNSW costs memory but survives growth without retraining.",
    cluster: "infra",
    chunks: 14,
    words: 3120,
    readingMinutes: 14,
    savedAt: "2026-03-09T11:40:00Z",
    savedLabel: "09 Mar",
    tags: ["pgvector", "postgres", "indexes"],
  },
  {
    id: "confidently-wrong-rag",
    ref: "0144",
    title: "Why your RAG answers are confidently wrong",
    url: "https://arxiv.org/abs/2603.00142",
    domain: "arxiv.org",
    summary:
      "Retrieval quality collapses long before generation does — measure recall@k before touching prompts.",
    cluster: "ai",
    chunks: 22,
    words: 5480,
    readingMinutes: 24,
    savedAt: "2026-03-07T08:25:00Z",
    savedLabel: "07 Mar",
    tags: ["rag", "evaluation", "recall"],
    unread: true,
  },
  {
    id: "typesetting-long-form",
    ref: "0143",
    title: "Type-setting long-form text on the web",
    url: "https://pilcrow.dev/long-form-typesetting",
    domain: "pilcrow.dev",
    summary:
      "Optical margin alignment and text-wrap: pretty do more for readability than any font choice.",
    cluster: "design",
    chunks: 6,
    words: 1310,
    readingMinutes: 6,
    savedAt: "2026-03-05T21:11:00Z",
    savedLabel: "05 Mar",
    tags: ["typography", "css"],
  },
  {
    id: "streaming-layout-shift",
    ref: "0142",
    title: "Streaming responses without layout shift",
    url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
    domain: "nextjs.org/docs",
    summary:
      "Reserve the answer block's height from the first token, or every citation reflows twice.",
    cluster: "frontend",
    chunks: 9,
    words: 1975,
    readingMinutes: 9,
    savedAt: "2026-03-03T14:48:00Z",
    savedLabel: "03 Mar",
    tags: ["streaming", "cls", "react"],
  },
  {
    id: "rls-patterns",
    ref: "0141",
    title: "Row Level Security patterns worth copying",
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
    domain: "supabase.com/docs",
    summary:
      "One policy per table per operation. Anything cleverer becomes unauditable within a month.",
    cluster: "infra",
    chunks: 13,
    words: 2860,
    readingMinutes: 13,
    savedAt: "2026-03-01T10:05:00Z",
    savedLabel: "01 Mar",
    tags: ["rls", "postgres", "security"],
  },
  {
    id: "cost-of-a-chunk",
    ref: "0140",
    title: "The cost of a chunk",
    url: "https://pilcrow.dev/cost-of-a-chunk",
    domain: "pilcrow.dev",
    summary:
      "Chunk size is a retrieval decision, not a token-budget one. 800 characters beat 2,000 in every test.",
    cluster: "ai",
    chunks: 8,
    words: 1690,
    readingMinutes: 8,
    savedAt: "2026-02-27T16:30:00Z",
    savedLabel: "27 Feb",
    tags: ["chunking", "retrieval"],
    unread: true,
  },
  {
    id: "session-verification",
    ref: "0092",
    title: "Session verification in the App Router",
    url: "https://supabase.com/docs/guides/auth/server-side/nextjs",
    domain: "supabase.com/docs",
    summary:
      "A single getSession() helper called from the layout, at the cost of one duplicate check.",
    cluster: "ai",
    chunks: 11,
    words: 2240,
    readingMinutes: 10,
    savedAt: "2026-02-04T12:00:00Z",
    savedLabel: "04 Feb",
    tags: ["auth", "supabase", "app-router"],
  },
  {
    id: "refresh-rotation",
    ref: "0203",
    title: "Refresh rotation without race conditions",
    url: "https://pilcrow.dev/refresh-rotation",
    domain: "pilcrow.dev",
    summary:
      "Rotate in middleware so no React component ever observes an expiring token.",
    cluster: "ai",
    chunks: 9,
    words: 1520,
    readingMinutes: 7,
    savedAt: "2026-01-27T19:22:00Z",
    savedLabel: "27 Jan",
    tags: ["auth", "middleware", "tokens"],
  },
];

export const docById = (id: string) => DOCS.find((d) => d.id === id);

/** Body text of a document, split at the chunk boundaries used for embedding. */
export const DOC_BODY: Record<string, { index: number; text: string; cited?: boolean }[]> = {
  "server-components-cookies": [
    {
      index: 1,
      text: "Every framework that renders on the server eventually has to answer the same question: who is this request for? The answer feels obvious until you notice that a Server Component does not own its own lifecycle. It can be re-rendered as part of a request it never saw begin.",
    },
    {
      index: 2,
      text: "The temptation is to read the session once, at module scope, and hand it to everything below. It is the cheapest thing to write and the most expensive thing to debug, because the failure is silent and only shows up under load, when two requests happen to share a worker.",
    },
    {
      index: 4,
      cited: true,
      text: "Because a Server Component may render for a request your code did not initiate, any value derived from cookies() must be re-verified rather than memoised across renders. Treat the cookie as an assertion, not a fact: it is a claim that has to be checked against the session store on every read, including reads that feel redundant.",
    },
    {
      index: 5,
      text: "The redundancy is the point. A verification you skipped is a verification an attacker gets to skip too, and the cost — a single round trip to a store you are already talking to — is smaller than almost anything else on the page.",
    },
  ],
};

/** Documents nearest to a given one in vector space. */
export const NEAREST: Record<string, { id: string; similarity: number }[]> = {
  "server-components-cookies": [
    { id: "session-verification", similarity: 0.88 },
    { id: "rls-patterns", similarity: 0.81 },
    { id: "refresh-rotation", similarity: 0.79 },
    { id: "streaming-layout-shift", similarity: 0.74 },
  ],
};

export const SAMPLE_ANSWER: Answer = {
  question: "What did I save about handling auth tokens in Next.js server components?",
  askedAt: "14:32",
  paragraphs: [
    {
      text: "Three saved pieces converge on the same rule: inside a Server Component, treat the session as untrusted on every read. The Next.js docs are the strictest — a Server Component can be rendered for a request your code did not initiate, so anything derived from cookies() has to be re-verified rather than memoised at module scope.[[1]]",
    },
    {
      text: "Your Supabase notes agree on the rule but move the work: verification lives in a getSession() helper called from the layout, paying a duplicate check to keep call sites clean.[[2]] Only one source covers rotation — it puts the refresh in middleware so the Server Component never observes a stale token.[[3]]",
    },
  ],
  gap: "Nothing in your library covers what happens when a refresh fails mid-stream.",
  citations: [
    { marker: 1, docId: "server-components-cookies", similarity: 0.91 },
    { marker: 2, docId: "session-verification", similarity: 0.87 },
    { marker: 3, docId: "refresh-rotation", similarity: 0.84 },
  ],
  retrieved: [
    {
      id: "c-0147-4",
      docId: "server-components-cookies",
      index: 4,
      similarity: 0.91,
      text: "…because a Server Component may render for a request your code did not initiate, any value derived from cookies() must be re-verified rather than memoised across…",
    },
    {
      id: "c-0092-11",
      docId: "session-verification",
      index: 11,
      similarity: 0.87,
      text: "…we moved the check into a single getSession() helper. It runs twice per request in the worst case, which we accepted in exchange for one place to audit…",
    },
    {
      id: "c-0203-2",
      docId: "refresh-rotation",
      index: 2,
      similarity: 0.84,
      text: "…rotate in middleware. By the time any React code runs, the cookie already holds a token with a full TTL, so no component has to think about expiry…",
    },
  ],
  belowThreshold: 2,
  threshold: 0.78,
  model: "GPT-4o",
  elapsedSeconds: 1.8,
  followUps: ["Show me the middleware snippet", "What else did I save in March?"],
};

/**
 * Stands in for `POST /api/chat` (embed the question, call match_documents,
 * hand the chunks to the model). Replace the body with a real fetch; the
 * shape the UI consumes is `Answer`.
 */
export async function askLibrary(question: string): Promise<Answer> {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  return { ...SAMPLE_ANSWER, question };
}
