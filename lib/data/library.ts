/**
 * The sample library.
 *
 * Everything the front end shows is derived from `DOCS` — cluster counts, the
 * index meter, chunk totals, the knowledge graph, the "nearest in your library"
 * list. There are no separately-maintained numbers to drift out of step.
 *
 * This module is also the single seam to the backend: each export maps to one
 * table or RPC in the MVP schema (`documents`, `document_chunks`,
 * `match_documents`), so wiring Supabase in is a one-file change.
 *
 * Titles, domains, summaries, similarity scores and dates are sample content
 * written for the interface. They are not real user data.
 */

export type ClusterId = "ai" | "frontend" | "infra" | "design";

export type Cluster = {
  id: ClusterId;
  name: string;
  /** Colour token, resolved against the palette in globals.css. */
  color: string;
};

export type Doc = {
  id: string;
  title: string;
  url: string;
  domain: string;
  /** The one-line summary written at ingest time by the small model. */
  summary: string;
  /** `null` until the clustering job has enough neighbours to place it. */
  cluster: ClusterId | null;
  words: number;
  /** ISO instant; every date shown in the UI is formatted from this in UTC. */
  savedAt: string;
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

// ---------------------------------------------------------------------------
// Clusters
// ---------------------------------------------------------------------------

export const CLUSTERS: Cluster[] = [
  { id: "ai", name: "AI & Agents", color: "var(--color-ember)" },
  { id: "frontend", name: "Frontend", color: "var(--color-moss)" },
  { id: "infra", name: "Infrastructure", color: "var(--color-ink)" },
  { id: "design", name: "Design", color: "var(--color-gold)" },
];

export const clusterById = (id: ClusterId | null) =>
  CLUSTERS.find((c) => c.id === id) ?? null;

export const UNCLUSTERED_COLOR = "var(--color-rule-firm)";

/** Colour for a document's dot anywhere in the UI, clustered or not. */
export const docColor = (doc: Doc) => clusterById(doc.cluster)?.color ?? UNCLUSTERED_COLOR;

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

type DocSeed = Omit<Doc, "savedAt"> & { savedAt: string };

/** Newest first. Catalogue numbers are assigned from this order. */
const SEEDS: DocSeed[] = [
  {
    id: "server-components-cookies",
    title: "Server Components and the cookies() boundary",
    url: "https://nextjs.org/docs/app/building-your-application/authentication",
    domain: "nextjs.org/docs",
    summary:
      "Any value derived from cookies() must be re-verified per read, never memoised at module scope.",
    cluster: "ai",
    words: 1842,
    savedAt: "2026-03-12T09:14:00Z",
    tags: ["next.js", "auth", "server-components", "cookies"],
  },
  {
    id: "embedding-models",
    title: "Embedding models are not interchangeable",
    url: "https://pilcrow.dev/embedding-models",
    domain: "pilcrow.dev",
    summary:
      "Swapping text-embedding-3-small for a larger model invalidates every vector you already stored.",
    cluster: "ai",
    words: 2410,
    savedAt: "2026-03-11T18:02:00Z",
    tags: ["embeddings", "migration"],
  },
  {
    id: "pgvector-index-types",
    title: "A field guide to pgvector index types",
    url: "https://supabase.com/docs/guides/ai/vector-indexes",
    domain: "supabase.com/docs",
    summary:
      "IVFFlat trades recall for speed; HNSW costs memory but survives growth without retraining.",
    cluster: "infra",
    words: 3120,
    savedAt: "2026-03-09T11:40:00Z",
    tags: ["pgvector", "postgres", "indexes"],
  },
  {
    id: "confidently-wrong-rag",
    title: "Why your RAG answers are confidently wrong",
    url: "https://arxiv.org/abs/2603.00142",
    domain: "arxiv.org",
    summary:
      "Retrieval quality collapses long before generation does — measure recall@k before touching prompts.",
    cluster: "ai",
    words: 5480,
    savedAt: "2026-03-07T08:25:00Z",
    tags: ["rag", "evaluation", "recall"],
    unread: true,
  },
  {
    id: "typesetting-long-form",
    title: "Type-setting long-form text on the web",
    url: "https://pilcrow.dev/long-form-typesetting",
    domain: "pilcrow.dev",
    summary:
      "Optical margin alignment and text-wrap: pretty do more for readability than any font choice.",
    cluster: "design",
    words: 1310,
    savedAt: "2026-03-05T21:11:00Z",
    tags: ["typography", "css"],
  },
  {
    id: "streaming-layout-shift",
    title: "Streaming responses without layout shift",
    url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
    domain: "nextjs.org/docs",
    summary:
      "Reserve the answer block's height from the first token, or every citation reflows twice.",
    cluster: "frontend",
    words: 1975,
    savedAt: "2026-03-03T14:48:00Z",
    tags: ["streaming", "cls", "react"],
  },
  {
    id: "rls-patterns",
    title: "Row Level Security patterns worth copying",
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
    domain: "supabase.com/docs",
    summary:
      "One policy per table per operation. Anything cleverer becomes unauditable within a month.",
    cluster: "infra",
    words: 2860,
    savedAt: "2026-03-01T10:05:00Z",
    tags: ["rls", "postgres", "security"],
  },
  {
    id: "cost-of-a-chunk",
    title: "The cost of a chunk",
    url: "https://pilcrow.dev/cost-of-a-chunk",
    domain: "pilcrow.dev",
    summary:
      "Chunk size is a retrieval decision, not a token-budget one. 800 characters beat 2,000 in every test.",
    cluster: "ai",
    words: 1690,
    savedAt: "2026-02-27T16:30:00Z",
    tags: ["chunking", "retrieval"],
    unread: true,
  },
  {
    id: "reranking-cheaper",
    title: "Reranking is cheaper than a bigger model",
    url: "https://ratchet.works/reranking",
    domain: "ratchet.works",
    summary:
      "A cross-encoder over the top fifty beats doubling the context window, at a fraction of the latency.",
    cluster: "ai",
    words: 2240,
    savedAt: "2026-02-25T09:50:00Z",
    tags: ["reranking", "latency", "retrieval"],
  },
  {
    id: "use-client-boundary",
    title: "The use client boundary is a data boundary",
    url: "https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns",
    domain: "nextjs.org/docs",
    summary:
      "Everything crossing it is serialised. That constraint is a feature: it shows you where your data really splits.",
    cluster: "frontend",
    words: 1560,
    savedAt: "2026-02-23T13:20:00Z",
    tags: ["react", "rsc", "architecture"],
  },
  {
    id: "auth-uid-inside",
    title: "auth.uid() belongs inside the function",
    url: "https://supabase.com/docs/guides/database/functions",
    domain: "supabase.com/docs",
    summary:
      "A user id passed in as a parameter is a user id an attacker can change. Read it from the session instead.",
    cluster: "infra",
    words: 1180,
    savedAt: "2026-02-21T17:35:00Z",
    tags: ["security", "postgres", "rls"],
    unread: true,
  },
  {
    id: "prompt-injection-retrieval",
    title: "Prompt injection is a retrieval problem",
    url: "https://marginalia.engineering/prompt-injection",
    domain: "marginalia.engineering",
    summary:
      "If untrusted text can reach the context window, the defence belongs at retrieval, not in the system prompt.",
    cluster: "ai",
    words: 3340,
    savedAt: "2026-02-19T11:02:00Z",
    tags: ["security", "prompting", "rag"],
  },
  {
    id: "hairlines-survive",
    title: "Hairlines survive what shadows do not",
    url: "https://marginalia.engineering/hairlines",
    domain: "marginalia.engineering",
    summary:
      "A one-pixel rule reads the same on every screen, in print, and at 200% zoom. A soft shadow reads on none of them.",
    cluster: "design",
    words: 1420,
    savedAt: "2026-02-17T20:14:00Z",
    tags: ["ui", "contrast", "print"],
  },
  {
    id: "optimistic-ui-rollback",
    title: "Optimistic UI that survives a failed write",
    url: "https://slowweb.dev/optimistic-rollback",
    domain: "slowweb.dev",
    summary:
      "Roll back to the value you had, not to a refetch. The refetch is the part that feels broken.",
    cluster: "frontend",
    words: 1730,
    savedAt: "2026-02-15T08:44:00Z",
    tags: ["react", "state", "ux"],
  },
  {
    id: "top-k-costs",
    title: "What top-k actually costs you",
    url: "https://stackful.io/top-k",
    domain: "stackful.io",
    summary:
      "Every extra chunk dilutes attention. Past eight, the model starts citing the least relevant passage it was given.",
    cluster: "ai",
    words: 1290,
    savedAt: "2026-02-13T15:26:00Z",
    tags: ["retrieval", "context", "prompting"],
  },
  {
    id: "focus-management",
    title: "Focus management is most of accessibility",
    url: "https://marginalia.engineering/focus",
    domain: "marginalia.engineering",
    summary:
      "Dialogs, route changes and toasts all move focus. Get those three right and most of the audit passes.",
    cluster: "frontend",
    words: 2050,
    savedAt: "2026-02-11T12:08:00Z",
    tags: ["a11y", "focus", "dialogs"],
  },
  {
    id: "pooling-serverless",
    title: "Connection pooling with serverless is a truce",
    url: "https://ratchet.works/pooling",
    domain: "ratchet.works",
    summary:
      "Every function invocation is another client. Put a pooler in front or watch Postgres run out of slots.",
    cluster: "infra",
    words: 1880,
    savedAt: "2026-02-09T19:17:00Z",
    tags: ["postgres", "serverless", "pgbouncer"],
  },
  {
    id: "session-verification",
    title: "Session verification in the App Router",
    url: "https://supabase.com/docs/guides/auth/server-side/nextjs",
    domain: "supabase.com/docs",
    summary:
      "A single getSession() helper called from the layout, at the cost of one duplicate check.",
    cluster: "ai",
    words: 2240,
    savedAt: "2026-02-04T12:00:00Z",
    tags: ["auth", "supabase", "app-router"],
  },
  {
    id: "cascade-layers",
    title: "Cascade layers ended the specificity war",
    url: "https://slowweb.dev/cascade-layers",
    domain: "slowweb.dev",
    summary:
      "Order your layers once and you never write another !important. The cascade becomes something you declare.",
    cluster: "design",
    words: 1640,
    savedAt: "2026-02-02T10:30:00Z",
    tags: ["css", "architecture"],
  },
  {
    id: "hybrid-search-bm25",
    title: "BM25 is still undefeated on proper nouns",
    url: "https://ratchet.works/hybrid-search",
    domain: "ratchet.works",
    summary:
      "Vectors lose to keyword search on names, error codes and version numbers. Run both and fuse the ranks.",
    cluster: "ai",
    words: 2720,
    savedAt: "2026-01-31T14:55:00Z",
    tags: ["search", "bm25", "hybrid"],
  },
  {
    id: "migrations-twice",
    title: "Migrations you can run twice",
    url: "https://stackful.io/idempotent-migrations",
    domain: "stackful.io",
    summary:
      "Idempotent up-migrations turn a frightening deploy into a boring one. Write them that way from the first file.",
    cluster: "infra",
    words: 1450,
    savedAt: "2026-01-29T09:12:00Z",
    tags: ["migrations", "postgres", "deploys"],
  },
  {
    id: "refresh-rotation",
    title: "Refresh rotation without race conditions",
    url: "https://pilcrow.dev/refresh-rotation",
    domain: "pilcrow.dev",
    summary:
      "Rotate in middleware so no React component ever observes an expiring token.",
    cluster: "ai",
    words: 1520,
    savedAt: "2026-01-27T19:22:00Z",
    tags: ["auth", "middleware", "tokens"],
  },
  {
    id: "hydration-time-randomness",
    title: "Hydration errors are almost always time or randomness",
    url: "https://nextjs.org/docs/messages/react-hydration-error",
    domain: "nextjs.org/docs",
    summary:
      "Dates, locales and Math.random are the three that bite. Seed them or defer them; there is no third option.",
    cluster: "frontend",
    words: 1220,
    savedAt: "2026-01-25T16:40:00Z",
    tags: ["react", "hydration", "debugging"],
  },
  {
    id: "monospace-signal",
    title: "Monospace as a signal, not a style",
    url: "https://pilcrow.dev/monospace-signal",
    domain: "pilcrow.dev",
    summary:
      "Reserve it for values the machine produced and it stops being decoration and starts carrying meaning.",
    cluster: "design",
    words: 980,
    savedAt: "2026-01-23T11:28:00Z",
    tags: ["typography", "ui"],
  },
  {
    id: "hnsw-parameters",
    title: "HNSW parameters, explained for people in a hurry",
    url: "https://arxiv.org/abs/2601.09984",
    domain: "arxiv.org",
    summary:
      "m controls memory, ef_construction controls build time, ef_search controls recall. That is most of it.",
    cluster: "infra",
    words: 4210,
    savedAt: "2026-01-21T13:05:00Z",
    tags: ["hnsw", "ann", "indexes"],
    unread: true,
  },
  {
    id: "virtualised-lists-find",
    title: "Virtualised lists lie to Cmd+F",
    url: "https://quiet-loops.net/virtualised-find",
    domain: "quiet-loops.net",
    summary:
      "Users search the page with the browser. A virtualised list quietly takes that away and never says so.",
    cluster: "frontend",
    words: 1090,
    savedAt: "2026-01-19T18:33:00Z",
    tags: ["lists", "ux", "a11y"],
  },
  {
    id: "summaries-lossy",
    title: "Summaries are lossy in ways you cannot predict",
    url: "https://quiet-loops.net/lossy-summaries",
    domain: "quiet-loops.net",
    summary:
      "The sentence you will need later is almost never the one a summariser decided to keep.",
    cluster: "ai",
    words: 1760,
    savedAt: "2026-01-17T10:20:00Z",
    tags: ["summarisation", "retrieval"],
  },
  {
    id: "empty-state-first",
    title: "Design the empty state first",
    url: "https://slowweb.dev/empty-state-first",
    domain: "slowweb.dev",
    summary:
      "It is the product's first impression and the last thing anyone gets around to designing.",
    cluster: "design",
    words: 1140,
    savedAt: "2026-01-15T15:47:00Z",
    tags: ["ux", "onboarding"],
  },
  {
    id: "backups-restore",
    title: "Backups you have never restored are not backups",
    url: "https://marginalia.engineering/restore-drills",
    domain: "marginalia.engineering",
    summary:
      "Schedule the restore, not the dump. The dump has never been the part that fails.",
    cluster: "infra",
    words: 1330,
    savedAt: "2026-01-13T08:55:00Z",
    tags: ["backups", "operations"],
  },
  {
    id: "container-queries",
    title: "Container queries changed how components ship",
    url: "https://slowweb.dev/container-queries",
    domain: "slowweb.dev",
    summary:
      "A component that measures itself can be dropped anywhere. Media queries never allowed that.",
    cluster: "frontend",
    words: 1510,
    savedAt: "2026-01-11T12:41:00Z",
    tags: ["css", "components"],
  },
  {
    id: "eval-without-golden-set",
    title: "Evaluating retrieval without a golden set",
    url: "https://arxiv.org/abs/2512.07731",
    domain: "arxiv.org",
    summary:
      "Bootstrap a test set from the questions users already asked and the answers they clicked away from.",
    cluster: "ai",
    words: 4880,
    savedAt: "2026-01-09T17:09:00Z",
    tags: ["evaluation", "rag", "metrics"],
  },
  {
    id: "rate-limit-edge",
    title: "Rate limiting at the edge, not in the handler",
    url: "https://ratchet.works/edge-rate-limits",
    domain: "ratchet.works",
    summary:
      "By the time the handler runs you have already paid for the request. Reject it earlier.",
    cluster: "infra",
    words: 1270,
    savedAt: "2026-01-07T09:38:00Z",
    tags: ["edge", "abuse", "cost"],
  },
  {
    id: "web-font-cost",
    title: "The cost of a web font, honestly measured",
    url: "https://pilcrow.dev/web-font-cost",
    domain: "pilcrow.dev",
    summary:
      "Subset it, preload one weight, pick a fallback with close metrics. Everything beyond that is decoration.",
    cluster: "frontend",
    words: 1680,
    savedAt: "2026-01-05T14:16:00Z",
    tags: ["performance", "typography"],
  },
  {
    id: "colour-roles",
    title: "Colour systems that survive dark mode",
    url: "https://quiet-loops.net/colour-roles",
    domain: "quiet-loops.net",
    summary:
      "Name a token for its role, never for its value, or the inversion will fight you in every component.",
    cluster: "design",
    words: 1390,
    savedAt: "2026-01-03T19:52:00Z",
    tags: ["colour", "tokens", "dark-mode"],
  },
  {
    id: "streaming-citations",
    title: "Streaming tool calls without losing the citation",
    url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
    domain: "nextjs.org/docs",
    summary:
      "A marker has to be emitted with the token that earns it, or it attaches itself to the wrong sentence.",
    cluster: "ai",
    words: 2130,
    savedAt: "2026-01-01T11:11:00Z",
    tags: ["streaming", "citations", "ai-sdk"],
  },
  {
    id: "route-loading-states",
    title: "Route-level loading states beat spinners",
    url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
    domain: "nextjs.org/docs",
    summary:
      "A skeleton shaped like the layout removes the shift. A spinner only announces the wait.",
    cluster: "frontend",
    words: 940,
    savedAt: "2025-12-29T16:04:00Z",
    tags: ["loading", "ux", "next.js"],
  },
  {
    id: "postgres-fts-first",
    title: "Try Postgres full-text search before reaching for vectors",
    url: "https://quiet-loops.net/tsvector-first",
    domain: "quiet-loops.net",
    summary:
      "tsvector handles more of your search than you expect, and it is already installed.",
    cluster: "infra",
    words: 1590,
    savedAt: "2025-12-27T10:47:00Z",
    tags: ["postgres", "search", "tsvector"],
  },
  {
    id: "token-budget-product",
    title: "Token budgets are a product decision",
    url: "https://pilcrow.dev/token-budgets",
    domain: "pilcrow.dev",
    summary:
      "How much context you spend per answer is pricing, not engineering. Someone has to own the number.",
    cluster: "ai",
    words: 1210,
    savedAt: "2025-12-24T13:29:00Z",
    tags: ["cost", "product"],
  },
  {
    id: "scroll-restoration",
    title: "Scroll restoration is harder than it looks",
    url: "https://stackful.io/scroll-restoration",
    domain: "stackful.io",
    summary:
      "Every async list breaks it. The fix is storing the anchor element, not the pixel offset.",
    cluster: "frontend",
    words: 1350,
    savedAt: "2025-12-22T08:18:00Z",
    tags: ["scroll", "routing", "ux"],
  },
  {
    id: "density-accessibility",
    title: "Density is an accessibility decision",
    url: "https://marginalia.engineering/density",
    domain: "marginalia.engineering",
    summary:
      "Compact tables serve experts and exclude everyone else. Offer both and let people choose.",
    cluster: "design",
    words: 1060,
    savedAt: "2025-12-20T17:55:00Z",
    tags: ["a11y", "tables", "ux"],
  },
  // Saved recently; the clustering job has not placed these yet.
  {
    id: "unix-philosophy",
    title: "The Unix philosophy, thirty years on",
    url: "https://quiet-loops.net/unix-thirty-years",
    domain: "quiet-loops.net",
    summary:
      "Small sharp tools still win, but only where the interfaces between them stayed boring.",
    cluster: null,
    words: 2480,
    savedAt: "2026-03-10T07:30:00Z",
    tags: ["systems", "essay"],
    unread: true,
  },
  {
    id: "how-to-read-a-paper",
    title: "How to read a paper",
    url: "https://arxiv.org/abs/2504.00311",
    domain: "arxiv.org",
    summary: "Three passes: the shape, the argument, the arithmetic. Most papers stop you at the first.",
    cluster: null,
    words: 1420,
    savedAt: "2026-03-08T20:41:00Z",
    tags: ["research", "method"],
  },
  {
    id: "good-commit-message",
    title: "Writing a commit message someone will thank you for",
    url: "https://marginalia.engineering/commit-messages",
    domain: "marginalia.engineering",
    summary:
      "The subject says what changed; the body says what you knew at the time that made it the right change.",
    cluster: null,
    words: 890,
    savedAt: "2026-03-06T12:03:00Z",
    tags: ["git", "writing"],
  },
  {
    id: "lab-notebook",
    title: "On keeping a lab notebook",
    url: "https://pilcrow.dev/lab-notebook",
    domain: "pilcrow.dev",
    summary:
      "Record the attempt that failed. It is the only part you will not be able to reconstruct later.",
    cluster: null,
    words: 1150,
    savedAt: "2026-03-04T09:26:00Z",
    tags: ["method", "writing"],
    unread: true,
  },
  {
    id: "good-error-message",
    title: "What makes a good error message",
    url: "https://slowweb.dev/error-messages",
    domain: "slowweb.dev",
    summary:
      "Say what happened, what it means for the thing the person was doing, and what they can do next.",
    cluster: null,
    words: 1020,
    savedAt: "2026-03-02T15:38:00Z",
    tags: ["ux", "writing", "errors"],
  },
];

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------

/** Chunker settings from the MVP spec: ~800 characters per chunk. */
const WORDS_PER_CHUNK = 135;
const WORDS_PER_MINUTE = 225;

/** Catalogue numbers run oldest-to-newest, so the newest document is №0147. */
const HIGHEST_REF = 147;

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const stampFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

/** Newest first — the order the library lists them in by default. */
export const DOCS: Doc[] = [...SEEDS].sort((a, b) => b.savedAt.localeCompare(a.savedAt));

export const chunkCount = (doc: Doc) => Math.max(1, Math.round(doc.words / WORDS_PER_CHUNK));
export const readingMinutes = (doc: Doc) =>
  Math.max(1, Math.round(doc.words / WORDS_PER_MINUTE));

/** "12 Mar" — formatted in UTC so the server and the browser agree. */
export const savedLabel = (doc: Doc) => dayFormat.format(new Date(doc.savedAt));
/** "12 Mar 2026, 09:14" */
export const savedStamp = (doc: Doc) => stampFormat.format(new Date(doc.savedAt));

const REFS = new Map(
  [...DOCS]
    .sort((a, b) => a.savedAt.localeCompare(b.savedAt))
    .map((doc, i) => [doc.id, String(HIGHEST_REF - DOCS.length + 1 + i).padStart(4, "0")]),
);

/** The catalogue number, shown throughout as №0147. */
export const docRef = (doc: Doc) => REFS.get(doc.id) ?? "0000";

export const docById = (id: string) => DOCS.find((d) => d.id === id);

export const clusterCount = (id: ClusterId) => DOCS.filter((d) => d.cluster === id).length;

export const LIBRARY_STATS = {
  documents: DOCS.length,
  chunks: DOCS.reduce((total, doc) => total + chunkCount(doc), 0),
  unclustered: DOCS.filter((d) => d.cluster === null).length,
  unread: DOCS.filter((d) => d.unread).length,
  quota: 500,
  embeddingModel: "text-embedding-3-small",
  chatModel: "GPT-4o",
};

export const USER = {
  name: "João Monjardino",
  initials: "JM",
  plan: "Free",
};

// ---------------------------------------------------------------------------
// Document bodies
// ---------------------------------------------------------------------------

/**
 * Stripped article text, split at the boundaries the chunker used. Only the
 * documents worth reading end to end carry their text in this sample library;
 * the reader renders a chunk map either way.
 */
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
  "session-verification": [
    {
      index: 9,
      text: "We tried three shapes before settling. Reading the session in every route handler was correct and unreadable. Reading it in middleware alone was readable and wrong, because middleware does not run for every render path we care about.",
    },
    {
      index: 11,
      cited: true,
      text: "We moved the check into a single getSession() helper. It runs twice per request in the worst case, which we accepted in exchange for one place to audit. When someone asks how authentication works here, the answer is a file, not a diagram.",
    },
    {
      index: 12,
      text: "The duplicate call is not free, but it is bounded and it is visible in traces. An optimisation that hides the check is an optimisation that eventually removes it, and we have watched that happen in two previous codebases.",
    },
  ],
  "refresh-rotation": [
    {
      index: 1,
      text: "A refresh token that rotates is a small distributed systems problem hiding in your auth library. Two tabs wake up at once, both see an expiring token, both call refresh, and one of them gets an error it did not deserve.",
    },
    {
      index: 2,
      cited: true,
      text: "Rotate in middleware. By the time any React code runs, the cookie already holds a token with a full TTL, so no component has to think about expiry. The race collapses into one writer, and the writer is a place you can put a lock.",
    },
    {
      index: 4,
      text: "What this does not solve is the refresh that fails while a response is already streaming. That case needs a decision rather than a mechanism: either the stream ends with an error the client can retry, or you accept a stale read for the remainder of the response. Pick one deliberately.",
    },
  ],
  "cost-of-a-chunk": [
    {
      index: 1,
      text: "Chunk size gets discussed as a token-budget question, as though the only cost of a large chunk were the tokens it occupies. That framing is why so many systems ship with two-thousand-character chunks and disappointing recall.",
    },
    {
      index: 3,
      text: "A chunk is the unit of retrieval. Its embedding is a single point standing in for everything inside it, so the more ground a chunk covers, the further that point drifts from any particular sentence in it. Large chunks are not expensive; they are blurry.",
    },
    {
      index: 5,
      text: "Eight hundred characters, with an overlap of about a hundred, beat every larger size we tested on recall@5, and did so on three different corpora. The overlap matters more than people expect: without it, the sentence that answers the question lands on a boundary often enough to notice.",
    },
    {
      index: 7,
      text: "The counter-argument is coherence — that a small chunk arrives without the context needed to interpret it. That is real, and it is what the document title and summary are for. Send the chunk with its provenance rather than making the chunk bigger.",
    },
  ],
  "pgvector-index-types": [
    {
      index: 2,
      text: "IVFFlat partitions the vector space into lists and searches only the nearest few. It builds quickly and it is small, which makes it the right first index. Its weakness is structural: the partitions are computed from the data you had when you built it.",
    },
    {
      index: 6,
      text: "HNSW builds a navigable graph instead of a partition. It costs more memory and considerably more build time, and in exchange it degrades gracefully as the table grows, because insertions extend the graph rather than invalidating a clustering.",
    },
    {
      index: 9,
      text: "The practical rule: if your corpus is static, IVFFlat with a well-chosen list count is cheaper and good enough. If documents arrive continuously — which is the whole premise of a reading library — go to HNSW before you have to, because rebuilding an IVFFlat index on a live table is the kind of maintenance you will keep postponing.",
    },
  ],
  "hairlines-survive": [
    {
      index: 1,
      text: "A soft shadow is a claim about light. It says: this surface floats a few millimetres above that one. Screens are bad at honouring that claim — the shadow disappears on a cheap panel, muddies in dark mode, and vanishes entirely on paper.",
    },
    {
      index: 2,
      text: "A one-pixel rule makes no claim about light at all. It is a statement that two regions are different, and it survives every rendering condition you will encounter: high contrast mode, two hundred per cent zoom, greyscale printing, a photograph of a monitor in a meeting.",
    },
    {
      index: 4,
      text: "This is not an argument against elevation. It is an argument for spending it. Reserve shadow for the two or three things genuinely floating above the page — a dialog, a menu, a card following the cursor — and let structure everywhere else come from rules and from changes of ground.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Retrieval
// ---------------------------------------------------------------------------

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
      id: "c-cookies-4",
      docId: "server-components-cookies",
      index: 4,
      similarity: 0.91,
      text: "…because a Server Component may render for a request your code did not initiate, any value derived from cookies() must be re-verified rather than memoised across…",
    },
    {
      id: "c-session-11",
      docId: "session-verification",
      index: 11,
      similarity: 0.87,
      text: "…we moved the check into a single getSession() helper. It runs twice per request in the worst case, which we accepted in exchange for one place to audit…",
    },
    {
      id: "c-refresh-2",
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
 * Stands in for `POST /api/chat`: embed the question, call the match_documents
 * RPC, hand the chunks to the model. Replace the body with a real fetch — the
 * shape the UI consumes is `Answer`.
 */
export async function askLibrary(question: string): Promise<Answer> {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  return { ...SAMPLE_ANSWER, question };
}
