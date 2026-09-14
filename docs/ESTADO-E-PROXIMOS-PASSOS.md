# Contextualize.ai — Estado do Projeto e Próximos Passos

> Auditoria de retoma, 14 Set 2026. Último commit: `f8006db` ("Ifrst project prompt"), ~8 meses parado.
> Verificações executadas: `next build`, `eslint`, `npm outdated`, `npm audit`, cruzamento ficheiro-a-ficheiro
> com `docs/ContextualizePRD.pdf`, `docs/ContextualizeMVP.pdf` e `docs/Steps.pdf`.

## 1. Onde ficámos (resumo honesto)

O repositório é um **scaffold `create-next-app` com 3 ficheiros próprios**. Nenhum requisito
funcional (FR-01 a FR-11) do PRD está implementado. Em termos do plano `Steps.pdf`:

| Fase | Estado |
|---|---|
| Fase 1 — "Vaporware" (protótipo HTML) | **Feita** — `mockup/index.html` está completo e funcional |
| Fase 2 — "Walking Skeleton" (Passo 1: repo) | **Feita** — Next.js + TS + Tailwind + ESLint |
| Fase 2 — Passo 2 (extensão Plasmo) | **Não iniciada** |
| Fase 2 — Passo 3 (schema + ler 1 linha) | **Não iniciada** — nem existe pasta `supabase/` |
| Fase 3 — Alpha "Wizard of Oz" | **Não iniciada** |

**A boa notícia:** o projeto compila (`✓ Compiled successfully in 3.4s`), o lint passa sem erros,
o TypeScript está em `strict`, e o mockup define a UX toda com clareza. A base está sã — o que
falta é produto, não reparação.

## 2. O que existe

- `app/page.tsx` — placeholder "Contextualize.ai: System Online"
- `app/layout.tsx` — layout base (metadata ainda por personalizar: diz "Create Next App")
- `lib/supabase/client.ts` — apenas o cliente de *browser*
- `lib/utils.ts` — helper `cn()` (preparação para shadcn/ui)
- `components/ui/.gitkeep` — pasta vazia; shadcn/ui **nunca foi inicializado** (não há `components.json`)
- `mockup/index.html` — protótipo: sidebar, chat com citações, library em grelha, knowledge graph (Chart.js), modal de ingestão
- `docs/` — PRD, especificação MVP, plano de lançamento

Dependências instaladas mas **ainda sem uma única linha de código a usá-las**:
`ai`, `openai`, `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, `tailwind-merge`, `clsx`.

## 3. O que falta (gap face ao MVP Spec)

| # | Frente | Estado | Requisitos |
|---|---|---|---|
| 1 | Autenticação Google (Supabase) | inexistente | MVP §1 |
| 2 | Schema SQL + migrations | inexistente | FR-05, FR-06, FR-07 |
| 3 | `POST /api/ingest` | inexistente | FR-01→FR-04 |
| 4 | `POST /api/chat` (RAG) | inexistente | FR-08, FR-09, FR-10 |
| 5 | Extensão Chrome (Plasmo) | inexistente | FR-01 |
| 6 | Dashboard / Library / Graph | inexistente | FR-11 |
| 7 | `.env.example` | inexistente | — |
| 8 | Testes e CI | inexistente | — |

## 4. Problemas ativos encontrados na auditoria

### P0 — Segurança: Next.js 16.1.1 tem 2 CVEs críticos
`npm audit` reporta 18 vulnerabilidades (1 crítica agregada, 10 high). Em `next@16.1.1`, entre outras:

- **Remote Code Execution não autenticado** na Image Optimization API quando são usados ficheiros AVIF
- **Remote Code Execution não autenticado** em servidores alojados em Windows
- Vários *Middleware / Proxy bypass* em App Router — relevantes porque o RLS vai depender de middleware de sessão

Corrigido em **16.3.3+**; `npm audit` confirma `fixAvailable: next@16.3.5, isSemVerMajor: false`.
É um upgrade menor. **Fazer antes de escrever qualquer rota.**

### P0 — Design: o SQL do MVP Spec tem um IDOR e não ativa RLS

O `match_documents` especificado recebe `p_user_id uuid` **como parâmetro vindo do cliente**:

```sql
where documents.user_id = p_user_id   -- ❌ qualquer utilizador autenticado
                                      --    passa o UUID de outro e lê a biblioteca dele
```

Agravante: o SQL do spec cria as três tabelas mas **nunca faz `enable row level security`
nem cria uma única policy**, apesar de o FR-07 exigir "a strict RLS policy". Sem RLS, o parâmetro
é a única barreira — e não é barreira nenhuma.

Correção ao retomar: trocar `p_user_id` por `auth.uid()` dentro da função, ativar RLS nas três
tabelas e escrever as policies. A assinatura da função passa a receber só
`(query_embedding, match_threshold, match_count)`.

### P1 — Schema: três correções antes de correr o SQL

1. **Sem índice vetorial.** Não há `ivfflat`/`hnsw` em `document_chunks.embedding` → cada pergunta
   faz *sequential scan* sobre toda a tabela. Indolor com 10 documentos, inviável com 1.000.
2. **`document_chunks` não tem `user_id`.** Obriga as policies a fazer join com `documents`.
   Desnormalizar (guardar `user_id` também no chunk) simplifica as policies e acelera o filtro.
3. **`match_score float generated always as (0) stored`** — coluna que é sempre 0 e não pode ser
   escrita. É peso morto vindo de um "para ranking mais tarde". Remover.

### P1 — O MVP Spec está desatualizado face às libs instaladas

- O spec descreve `{ messages: Message[] }` (padrão do Vercel AI SDK v3/v4). O `ai` instalado é **v6**,
  onde o contrato é `UIMessage[]` + `convertToModelMessages()` + `streamText()`. Copiar o código do
  spec tal e qual **não vai compilar**.
- O `ai` v6 **não traz provider**. Só está `@ai-sdk/gateway`; falta **`@ai-sdk/openai`** para
  `openai('gpt-4o')` / `openai.embedding('text-embedding-3-small')`.
- Falta **`@ai-sdk/react`** para o `useChat` no dashboard.
- Faltam **`@mozilla/readability`** e **`jsdom`**, exigidos pelo FR-02 (limpar DOM → texto).

Decisão a tomar: usar `embedMany()` do AI SDK **ou** o SDK `openai` diretamente para os embeddings.
Ter os dois instalados sem decidir é como está agora — escolher um e remover o outro.

### P2 — Dependências com ~8 meses

`lucide-react` 0.562 → **1.45** (major), `typescript` 5.9 → 7.0 (major), `eslint` 9 → 10 (major),
`ai` 6 → 7 (major), `openai` 6 → 7 (major), `@supabase/ssr` 0.8 → 0.12.
Sugestão: subir agora só os *minors* seguros + o Next (P0), e tratar os majors um a um **depois**
de haver código a funcionar — nunca antes.

## 5. Próximos passos, por ordem

### Sprint 0 — Destrancar (½ dia)
1. `npm i next@16.3.5 eslint-config-next@16.3.5` e correr `npm audit fix` (resolve os P0 de segurança)
2. Instalar o que falta: `@ai-sdk/openai`, `@ai-sdk/react`, `@mozilla/readability`, `jsdom`, `@types/jsdom`
3. Criar `.env.example` com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`
4. Corrigir a metadata em `app/layout.tsx` ("Create Next App" → Contextualize.ai)

### Sprint 1 — Fundação de dados (1–2 dias)
5. Criar `supabase/migrations/0001_init.sql` com o schema **corrigido** (RLS ativo + policies +
   índice HNSW + `user_id` nos chunks + sem `match_score`)
6. Reescrever `match_documents` com `auth.uid()` em vez de `p_user_id`
7. Trigger de `profiles` no signup (`auth.users` → `profiles`)
8. `lib/supabase/server.ts` + `middleware.ts` para refrescar a sessão (é o que falta ao `@supabase/ssr`)

### Sprint 2 — Walking skeleton (2–3 dias)
9. Google OAuth + rota de callback + proteção do `/dashboard`
10. `POST /api/ingest`: Readability → resumo com `gpt-4o-mini` → chunking → `embedMany` → insert
11. `POST /api/chat`: embed da pergunta → `match_documents` → `streamText` com citações
12. Portar o `mockup/index.html` para componentes React reais (é o passo com melhor retorno visual:
    o design já está decidido, é tradução, não desenho)

### Sprint 3 — Distribuição (2–3 dias)
13. Extensão Plasmo: popup → captura `document.documentElement.outerHTML` → `POST /api/ingest`
14. Knowledge graph com dados reais (ou estático, como o `Steps.pdf` autoriza explicitamente)
15. Deploy na Vercel + convites para os beta testers

### Transversal
16. CI no GitHub Actions: `build` + `lint` (o repo não tem rede de segurança nenhuma)
17. Teste de integração do pipeline RAG assim que `/api/chat` existir

## 6. Recomendação

O caminho mais curto para ter algo vivo é **Sprint 0 → 1 → 2 até ao ponto 11**. Nessa altura
existe um produto real: guardar um link e fazer-lhe perguntas. A extensão e o graph são
acessórios de demonstração — o `Steps.pdf` já dá permissão explícita para falsear o graph
("If the Graph View is too hard to build with real data initially? Fake it").

O maior risco não é técnico: é o schema ser criado com o SQL do spec tal como está, e o IDOR
do `match_documents` ficar enterrado em produção. Corrigir isso **custa 10 minutos agora**
e um incidente depois.
