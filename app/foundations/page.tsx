import {
  ArrowUpIcon,
  AskIcon,
  BackIcon,
  CheckIcon,
  ChevronIcon,
  ClipIcon,
  CloseIcon,
  ExternalIcon,
  GraphIcon,
  LibraryIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  SparkIcon,
  TagIcon,
  TrashIcon,
  TuneIcon,
} from "@/components/icons";
import { Button, ButtonLink, IconButton } from "@/components/ui/button";
import { Chip, Tag } from "@/components/ui/chip";
import { Citation } from "@/components/ui/citation";
import { Label } from "@/components/ui/label";
import { Similarity } from "@/components/ui/similarity";
import { StatusPill } from "@/components/ui/status";
import { Wordmark } from "@/components/workspace/wordmark";
import { LIBRARY_STATS } from "@/lib/data/library";
import { cn } from "@/lib/utils";

export const metadata = { title: "Foundations · Contextualize" };

/* ---------------------------------------------------------------------------
   The specimen sheet, rendered from the real components rather than redrawn.
   If a control drifts in components/ui, this page drifts with it — which is
   the whole point of keeping the styleguide a route and not a picture.
--------------------------------------------------------------------------- */

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule">
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 px-6 pt-5.5 lg:px-10">
        <h2 className="text-[15px] font-semibold tracking-[-0.005em]">{title}</h2>
        <span className="font-mono text-[10.5px] text-faint">{caption}</span>
      </div>
      <div className="px-6 pt-6.5 pb-8.5 lg:px-10">{children}</div>
    </section>
  );
}

/** A captioned row of specimens. Wraps rather than scrolls on a phone. */
function Group({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <span className="font-mono text-[10px] tracking-[0.09em] text-faint uppercase">
        {name}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-x-11 gap-y-6.5">{children}</div>;
}

/* ------------------------------- palette -------------------------------- */

type Swatch = { name: string; hex: string; use: string; tint?: boolean };

const PALETTE: { group: string; swatches: Swatch[] }[] = [
  {
    group: "Ground",
    swatches: [
      { name: "Paper", hex: "#FBF9F5", use: "Page ground", tint: true },
      { name: "Paper sunk", hex: "#F4F1EA", use: "Rails, toolbars", tint: true },
      { name: "Surface", hex: "#FFFFFF", use: "Cards, fields", tint: true },
      { name: "Rule", hex: "#E3DDD1", use: "Hairlines", tint: true },
      { name: "Rule firm", hex: "#D6CEBF", use: "Inputs, focus", tint: true },
    ],
  },
  {
    group: "Ink",
    swatches: [
      { name: "Ink", hex: "#17140F", use: "Text, primary fill" },
      { name: "Ink soft", hex: "#3D372E", use: "Secondary text" },
      { name: "Muted", hex: "#78705F", use: "Metadata" },
      { name: "Faint", hex: "#9C9384", use: "Mono labels" },
    ],
  },
  {
    group: "Accent",
    swatches: [
      { name: "Ember", hex: "#B2492A", use: "Citations, AI" },
      { name: "Ember deep", hex: "#8E3A21", use: "Hover" },
      { name: "Ember wash", hex: "#F3E4DB", use: "Citation ground", tint: true },
      { name: "Moss", hex: "#2E6A55", use: "Indexed, live" },
      { name: "Gold", hex: "#8A6A2F", use: "Fourth cluster" },
    ],
  },
];

/* ------------------------------ type ramp -------------------------------- */

const RAMP: { name: string; sizes: string; specimen: React.ReactNode }[] = [
  {
    name: "Display",
    sizes: "76 / 46 / 35 / 30 / 25 px",
    specimen: (
      <span className="font-display text-[clamp(28px,7vw,42px)] leading-[1.1] tracking-[-0.016em]">
        Stop saving. Start using.
      </span>
    ),
  },
  {
    name: "Heading",
    sizes: "20 / 16 / 15 px · 600",
    specimen: (
      <span className="text-[20px] font-semibold tracking-[-0.008em]">
        Retrieved context
      </span>
    ),
  },
  {
    name: "Body",
    sizes: "15 / 13.5 / 12.5 px · 400",
    specimen: (
      <span className="text-[15px] leading-[1.68]">
        Answers are grounded in your library, and every claim carries a citation back to
        the passage it came from.
      </span>
    ),
  },
  {
    name: "Metadata",
    sizes: "11 / 10.5 / 10 px · MONO",
    specimen: (
      <span className="font-mono text-[11px] text-muted">
        CHUNK 04 · №0147 · 0.91 · {LIBRARY_STATS.chunks.toLocaleString("en-GB")} CHUNKS
      </span>
    ),
  },
  {
    name: "Label",
    sizes: "10 px · 0.1em · UPPER",
    specimen: <Label>Sources · Clusters · Pipeline</Label>,
  },
];

/* --------------------------- values & principles -------------------------- */

const VALUES: { group: string; rows: [string, string][] }[] = [
  {
    group: "Geometry",
    rows: [
      ["Tag, swatch", "2px"],
      ["Button, card, field", "3px"],
      ["Modal, panel", "4–5px"],
      ["Chip, pill", "999px"],
      ["Hairline", "1px · #E3DDD1"],
    ],
  },
  {
    group: "Rhythm",
    rows: [
      ["Row padding", "13px / 26px"],
      ["Section padding", "22px / 40px"],
      ["Control height", "26 / 32 / 36 / 46px"],
      ["Touch target (mobile)", "44px min"],
      ["Icon grid", "13 / 15 / 17 / 20px"],
    ],
  },
  {
    group: "Depth",
    rows: [
      ["Page, rails, rows", "no shadow"],
      ["Hover card", "0 12px 28px / 13%"],
      ["Modal", "0 26px 64px / 30%"],
      ["Focus ring", "3px ember @ 10%"],
      ["Dim backdrop", "ink @ 42%"],
    ],
  },
];

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Show the mechanism",
    body: "Chunks, similarity scores and cluster counts are visible, not hidden behind a spinner. Trust in retrieval comes from seeing what was retrieved.",
  },
  {
    title: "Monospace means measured",
    body: "If a number came from the machine — a score, a count, a timestamp — it is set in mono. Prose stays in the sans.",
  },
  {
    title: "Rules, not shadows",
    body: "Structure comes from hairlines and ground changes. Elevation is reserved for things genuinely floating above the page.",
  },
  {
    title: "Admit the gaps",
    body: "The library says what it does not contain. An honest “nothing saved on this” beats a confident paragraph.",
  },
];

const ICONS: [string, (p: { size?: number }) => React.ReactElement][] = [
  ["ask", AskIcon],
  ["library", LibraryIcon],
  ["graph", GraphIcon],
  ["plus", PlusIcon],
  ["minus", MinusIcon],
  ["search", SearchIcon],
  ["tune", TuneIcon],
  ["check", CheckIcon],
  ["close", CloseIcon],
  ["external", ExternalIcon],
  ["chevron", ChevronIcon],
  ["back", BackIcon],
  ["arrow-up", ArrowUpIcon],
  ["spark", SparkIcon],
  ["tag", TagIcon],
  ["clip", ClipIcon],
  ["trash", TrashIcon],
];

/* The ingest pipeline's row states. The real one lives inside CaptureDialog,
   which is a stateful client component, so the three states are drawn here. */
function PipelineStep({
  name,
  state,
}: {
  name: string;
  state: "done" | "running" | "queued";
}) {
  return (
    <span className="flex items-center gap-[11px]">
      {state === "done" ? (
        <span className="flex size-[17px] shrink-0 items-center justify-center rounded-full bg-moss text-surface">
          <CheckIcon size={10} strokeWidth={3} />
        </span>
      ) : state === "running" ? (
        <span className="size-[17px] shrink-0 animate-spin rounded-full border-2 border-ember-line border-t-ember" />
      ) : (
        <span className="size-[17px] shrink-0 rounded-full border-[1.5px] border-rule" />
      )}
      <span
        className={cn(
          "text-[13px] font-medium",
          state === "done" && "text-ink",
          state === "running" && "text-ember-deep",
          state === "queued" && "text-faint",
        )}
      >
        {name}
      </span>
    </span>
  );
}

export default function FoundationsPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="flex items-end justify-between gap-10 px-6 pt-10 pb-7.5 max-sm:flex-col max-sm:items-start max-sm:gap-6 lg:px-10">
        <div className="min-w-0">
          <Wordmark size={21} className="mb-4.5" />
          <h1 className="mb-2.5 font-display text-[clamp(34px,8vw,44px)] leading-[1.1] tracking-[-0.016em]">
            Card Catalogue
          </h1>
          <p className="max-w-[54ch] text-[14.5px] leading-[1.6] text-muted text-pretty">
            The design language of Contextualize: warm paper, hairline rules, and
            monospace for anything the machine measured. Nothing is rounded more than 4px
            and nothing floats unless it is genuinely above the page.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-[5px] text-right font-mono text-[10.5px] text-faint max-sm:text-left">
          <span>INSTRUMENT SERIF</span>
          <span>IBM PLEX SANS</span>
          <span>IBM PLEX MONO</span>
        </div>
      </header>

      <Section title="Palette" caption="Warm neutrals · two accents sharing chroma">
        <div className="flex flex-col gap-6">
          {PALETTE.map(({ group, swatches }) => (
            <div key={group}>
              <div className="mb-3">
                <Label>{group}</Label>
              </div>
              <div className="flex flex-wrap gap-3">
                {swatches.map((swatch) => (
                  <div key={swatch.hex} className="w-32 shrink-0">
                    <div
                      className={cn(
                        "h-[62px] rounded-sm border",
                        swatch.tint ? "border-rule" : "border-ink/[0.07]",
                      )}
                      style={{ background: swatch.hex }}
                    />
                    <div className="mt-2 text-xs font-medium text-ink">{swatch.name}</div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-muted">
                      {swatch.hex}
                    </div>
                    <div className="mt-[3px] text-[11px] leading-[1.4] text-faint">
                      {swatch.use}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" caption="Three families, one voice">
        {RAMP.map((step) => (
          <div
            key={step.name}
            className="flex gap-x-6.5 gap-y-1.5 border-b border-rule-soft py-[11px] max-md:flex-col md:items-baseline"
          >
            <span className="w-29 shrink-0 font-mono text-[10px] tracking-[0.09em] text-faint uppercase">
              {step.name}
            </span>
            <div className="min-w-0 grow">{step.specimen}</div>
            <span className="shrink-0 font-mono text-[10.5px] text-faint md:w-[190px] md:text-right">
              {step.sizes}
            </span>
          </div>
        ))}
      </Section>

      <Section title="Components" caption="Every control in the product">
        <div className="flex flex-col gap-6.5">
          <Row>
            <Group name="Buttons">
              <Button variant="primary" size="lg">
                <CheckIcon size={16} />
                Save to library
              </Button>
              <ButtonLink href="/library" size="lg">
                <ExternalIcon size={15} />
                Open original
              </ButtonLink>
              <Button size="lg" disabled>
                Disabled
              </Button>
            </Group>

            {/* The artboard shows one size; the component has three, plus the
                quiet variant used for destructive and tertiary actions. */}
            <Group name="Sizes & variants">
              <Button size="sm">sm</Button>
              <Button size="md">md</Button>
              <Button size="lg">lg</Button>
              <Button variant="quiet" size="md">
                Quiet
              </Button>
              <IconButton aria-label="Capture">
                <PlusIcon size={16} />
              </IconButton>
            </Group>
          </Row>

          <Row>
            <Group name="Chips">
              <Chip active>Whole library</Chip>
              <Chip>Last 30 days</Chip>
              <Chip count={9}>Unread</Chip>
            </Group>

            <Group name="Tags">
              <Tag>next.js</Tag>
              <Tag>auth</Tag>
              <Tag>server-components</Tag>
            </Group>

            <Group name="Citation">
              <span className="text-[15px] text-ink">
                …verified on every read
                <Citation marker={1} />
              </span>
            </Group>
          </Row>

          <Row>
            <Group name="Similarity">
              <Similarity value={0.91} />
              <Similarity value={0.74} />
              <Similarity value={0.52} />
            </Group>

            <Group name="Status">
              <StatusPill>INDEX LIVE</StatusPill>
              <PipelineStep name="Done" state="done" />
              <PipelineStep name="Running" state="running" />
              <PipelineStep name="Queued" state="queued" />
            </Group>
          </Row>

          <Row>
            <Group name="Navigation">
              <div className="w-42">
                <div className="flex h-[34px] items-center gap-2.5 rounded-sm bg-ink px-[11px] text-[13.5px] font-medium text-paper">
                  <AskIcon size={17} />
                  Ask
                </div>
                <div className="flex h-[34px] items-center gap-2.5 rounded-sm px-[11px] text-[13.5px] font-medium text-ink-soft">
                  <LibraryIcon size={17} />
                  Library
                </div>
              </div>
            </Group>

            <Group name="Field">
              <div className="flex h-9 w-70 max-w-full items-center gap-2.5 rounded-sm border border-rule-firm bg-surface px-[11px]">
                <SearchIcon size={15} className="text-faint" />
                <span className="text-[13px] text-faint">Rest</span>
              </div>
              <div className="flex h-9 w-70 max-w-full items-center gap-2.5 rounded-sm border border-ink bg-surface px-[11px] shadow-[0_0_0_3px_rgba(178,73,42,0.10)]">
                <SearchIcon size={15} className="text-ink" />
                <span className="text-[13px] text-ink">Focus</span>
              </div>
            </Group>
          </Row>

          <Group name="Icons · 24px grid, 1.5 stroke">
            {ICONS.map(([name, Glyph]) => (
              <span
                key={name}
                className="flex w-17 flex-col items-center gap-1.5 text-ink-soft"
              >
                <Glyph size={20} />
                <span className="font-mono text-[9.5px] text-faint">{name}</span>
              </span>
            ))}
          </Group>
        </div>
      </Section>

      <Section
        title="Geometry, rhythm & depth"
        caption="The numbers that keep it consistent"
      >
        <div className="flex gap-10 max-md:flex-col max-md:gap-7">
          {VALUES.map(({ group, rows }) => (
            <div key={group} className="min-w-0 flex-1">
              <div className="mb-2.5">
                <Label>{group}</Label>
              </div>
              <dl>
                {rows.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 border-b border-rule-soft py-1.5"
                  >
                    <dt className="text-[12.5px] text-ink-soft">{key}</dt>
                    <dd className="shrink-0 font-mono text-[10.5px] text-muted">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Principles" caption="Why it looks like this">
        <div className="-ml-5.5 flex max-lg:flex-col max-lg:gap-6">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="min-w-0 flex-1 border-l border-rule px-5.5"
            >
              <h3 className="mb-1.5 text-sm font-semibold">{principle.title}</h3>
              <p className="text-[12.5px] leading-[1.6] text-muted text-pretty">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
