# Contextualize.ai

An AI second brain: save what you read, then ask your own library and get
answers that cite the passages they came from.

> Stop saving. Start using.

## The front end

The interface is called **Card Catalogue** — warm paper, hairline rules, a
terracotta and moss palette, Instrument Serif for display, IBM Plex Sans for the
UI and IBM Plex Mono for anything the machine measured (similarity scores, chunk
counts, catalogue numbers). The design canvas lives in [`design/`](./design) and
is published at
<https://claude.ai/code/artifact/cc1ee309-c678-47b2-8ff8-da6777e62965>.

Four principles run through it:

- **Show the mechanism.** Retrieved chunks, similarity scores and cluster counts
  are on screen. Trust in RAG comes from seeing the evidence.
- **Monospace means measured.** If a number came from the machine it is set in
  mono. Prose stays in the sans.
- **Rules, not shadows.** Structure comes from hairlines and ground changes;
  elevation is reserved for things genuinely above the page.
- **Admit the gaps.** An answer says what the library does not contain.

### Routes

| Route             | What it is                                                      |
| ----------------- | --------------------------------------------------------------- |
| `/`               | Landing page                                                    |
| `/signin`         | Google sign-in (the whole form)                                  |
| `/ask`            | The RAG conversation, with a rail showing the retrieved passages |
| `/library`        | The catalogue — search, cluster and unread filters, sorting      |
| `/library/[id]`   | Reader, with chunk boundaries marked in the margin               |
| `/graph`          | The knowledge graph: clusters, bridges, similarity floor         |

`⌘K` opens the capture dialog from anywhere in the workspace.

### Layout of the code

```
app/
  globals.css              design tokens (the palette, type, geometry, depth)
  layout.tsx               fonts and metadata
  page.tsx                 landing
  signin/
  (workspace)/             the signed-in shell: sidebar + mobile chrome
    ask/  library/  graph/
components/
  ui/                      button, chip, tag, label, similarity, citation, status
  workspace/               sidebar, top bar, mobile chrome, capture dialog
  ask/  library/  document/  graph/  marketing/
lib/
  data/library.ts          typed sample data + the askLibrary() seam
  graph-layout.ts          deterministic cluster projection for the graph
```

### Wiring it to the backend

The front end reads everything through `lib/data/library.ts`, so each screen has
one seam to replace:

- `askLibrary(question)` stands in for `POST /api/chat` — embed the question,
  call the `match_documents` RPC, hand the chunks to the model. It returns the
  `Answer` shape the UI consumes.
- `DOCS`, `DOC_BODY` and `NEAREST` stand in for the `documents` and
  `document_chunks` tables.
- The capture dialog (`components/workspace/capture-dialog.tsx`) drives its
  stages from a timer; point it at `POST /api/ingest` and drive them from the
  response instead.
- `app/signin/page.tsx` links straight to `/ask`; replace that with
  `supabase.auth.signInWithOAuth({ provider: "google" })`.

Sample titles, domains, scores and counts are written for the interface and are
not real user content.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Supabase and OpenAI keys are not needed to run the interface. When you wire the
seams above, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Specification

`docs/` holds the PRD and the MVP build specification — scope, the Postgres and
pgvector schema, and the two API routes.
