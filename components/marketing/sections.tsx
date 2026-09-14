import Link from "next/link";

import { CloseIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { GoogleMark } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/workspace/wordmark";

export function ProblemBand() {
  return (
    <section className="bg-ink px-6 py-18 lg:px-14">
      <div className="max-w-[1000px]">
        <Label className="text-faint">The problem</Label>
        <p className="mt-5 font-display text-[clamp(30px,4vw,42px)] leading-[1.24] tracking-[-0.012em] text-paper text-pretty">
          A bookmark is a promise to your future self that you almost never keep. The
          article is not saved — only its address is.{" "}
          <span className="text-[#d9663f] italic">Contextualize saves the words.</span>
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  {
    number: "01",
    title: "Capture",
    body: "Click once in the toolbar. The extension strips navigation, ads and cookie banners, keeps the readable text, and writes a title, a one-line summary and three tags.",
    meta: "EXTENSION · ~2s",
  },
  {
    number: "02",
    title: "Index",
    body: "The text is split into 800-character chunks and embedded as vectors. Chunks are what retrieval actually searches — smaller segments beat whole documents on precision.",
    meta: "pgvector · 1536 DIM",
  },
  {
    number: "03",
    title: "Ask",
    body: "Your question is embedded too, matched against your own vectors, and the closest passages are handed to the model. Every claim carries a citation back to the source.",
    meta: "TOP-5 · CITED",
  },
];

function StepDiagram({ index }: { index: number }) {
  const common = {
    width: 80,
    height: 64,
    viewBox: "0 0 80 64",
    fill: "none",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    "aria-hidden": true,
  };
  if (index === 0) {
    return (
      <svg {...common}>
        <rect x="10" y="14" width="52" height="38" rx="3" stroke="var(--color-rule-firm)" />
        <path d="M10 24h52" stroke="var(--color-rule-firm)" />
        <circle cx="16" cy="19" r="1.6" fill="var(--color-rule-firm)" />
        <path d="M20 32h26M20 39h32M20 46h18" stroke="var(--color-ink)" />
        <circle cx="60" cy="48" r="9" fill="var(--color-ember)" />
        <path d="M56.4 48h7.2M60 44.4v7.2" stroke="var(--color-paper)" strokeWidth="1.6" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...common}>
        <path d="M12 20h22M12 28h22M12 36h22M12 44h22" stroke="var(--color-rule-firm)" />
        <path d="M40 32h10" stroke="var(--color-ink)" />
        <path d="M58 20l9 10M58 20l-2 16M56 36l9 9" stroke="#e0d6c6" />
        <circle cx="58" cy="20" r="3.4" fill="var(--color-ember)" />
        <circle cx="67" cy="30" r="2.6" fill="var(--color-ember)" />
        <circle cx="56" cy="36" r="3" fill="var(--color-ember)" />
        <circle cx="65" cy="45" r="2.2" fill="var(--color-ember)" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="18" cy="32" r="7" stroke="var(--color-ink)" />
      <path d="M25 32h12" stroke="var(--color-rule-firm)" />
      <rect x="37" y="16" width="32" height="32" rx="3" stroke="var(--color-rule-firm)" />
      <path d="M43 25h20M43 32h20M43 39h12" stroke="var(--color-ink)" />
      <rect x="60" y="36" width="9" height="9" rx="1.5" fill="var(--color-ember)" />
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="px-6 py-20 lg:px-14">
      <div className="mb-11 flex items-baseline justify-between gap-6">
        <h2 className="font-display text-[38px] tracking-[-0.012em]">How it works</h2>
        <span className="font-mono text-[11px] text-faint max-sm:hidden">
          CAPTURE → INDEX → ASK
        </span>
      </div>
      <div className="-ml-8.5 flex max-lg:flex-col max-lg:gap-8">
        {STEPS.map((step, i) => (
          <div key={step.number} className="min-w-0 flex-1 border-l border-rule px-8.5">
            <div className="mb-5.5">
              <StepDiagram index={i} />
            </div>
            <div className="mb-3 flex items-baseline gap-3">
              <span className="font-mono text-[11px] tracking-[0.08em] text-ember">
                {step.number}
              </span>
              <h3 className="font-display text-[27px]">{step.title}</h3>
            </div>
            <p className="mb-3.5 text-sm leading-[1.62] text-ink-soft text-pretty">
              {step.body}
            </p>
            <span className="font-mono text-[10px] tracking-[0.09em] text-faint">
              {step.meta}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

const LIMITS = [
  {
    title: "No folders to maintain",
    body: "Clusters are derived from the vectors, not from a filing habit you will abandon in week three.",
  },
  {
    title: "No summary instead of the source",
    body: "Every answer links to the passage it used. The original is one click away, always.",
  },
  {
    title: "Nothing leaves your library",
    body: "Retrieval runs against your rows only, enforced in the database. Your text is never training data.",
  },
];

export function Limits() {
  return (
    <section
      id="limits"
      className="border-y border-rule bg-paper-sunk px-6 py-18 lg:px-14"
    >
      <h2 className="mb-2 font-display text-[38px] tracking-[-0.012em]">
        What it will not do
      </h2>
      <p className="mb-9 text-[15px] text-muted">The constraints are the product.</p>
      <div className="flex gap-4.5 max-lg:flex-col">
        {LIMITS.map((limit) => (
          <div
            key={limit.title}
            className="min-w-0 flex-1 rounded-md border border-rule bg-surface px-6 pt-6 pb-6.5"
          >
            <span className="mb-4 flex size-6.5 items-center justify-center rounded-full border border-rule text-ember">
              <CloseIcon size={13} strokeWidth={1.8} />
            </span>
            <h3 className="mb-2.5 text-base font-semibold tracking-[-0.005em]">
              {limit.title}
            </h3>
            <p className="text-[13.5px] leading-[1.6] text-muted text-pretty">{limit.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BuiltOn() {
  const stack = [
    "Next.js",
    "Supabase",
    "pgvector",
    "OpenAI embeddings",
    "Row Level Security",
    "Open schema, exportable",
  ];
  return (
    <section className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-rule px-6 py-7 lg:px-14">
      <Label className="mr-2">Built on</Label>
      {stack.map((item, i) => (
        <span key={item} className="flex items-center gap-5">
          {i > 0 ? <span className="text-rule-firm">·</span> : null}
          <span className="font-mono text-[11.5px] tracking-[0.06em] text-ink-soft">
            {item}
          </span>
        </span>
      ))}
    </section>
  );
}

export function FinalCta() {
  return (
    <section
      id="pricing"
      className="flex items-center justify-between gap-12 px-6 pt-21 pb-23 max-lg:flex-col max-lg:items-start lg:px-14"
    >
      <div className="max-w-[560px]">
        <h2 className="mb-4 font-display text-[clamp(34px,5vw,46px)] leading-[1.14] tracking-[-0.016em]">
          Your reading list is already an archive. Give it an index.
        </h2>
        <p className="text-[15px] leading-[1.62] text-muted">
          Install the extension, save five things you were going to read anyway, and ask it
          something on Friday.
        </p>
      </div>
      <div className="flex w-[268px] shrink-0 flex-col gap-3 max-lg:w-full">
        <ButtonLink href="/ask" variant="primary" className="h-12 text-[15px]">
          Add to Chrome
        </ButtonLink>
        <ButtonLink href="/signin" className="h-11 text-[13.5px]">
          <GoogleMark size={15} />
          Sign in with Google
        </ButtonLink>
        <p className="text-center font-mono text-[10.5px] leading-relaxed text-faint">
          No card required.
          <br />
          Export your library whenever you like.
        </p>
      </div>
    </section>
  );
}

const FOOTER: { heading: string; items: { label: string; href?: string }[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "How it works", href: "#how" },
      { label: "Extension" },
      { label: "Changelog" },
    ],
  },
  {
    heading: "Your data",
    items: [{ label: "Export" }, { label: "Delete account" }, { label: "Security" }],
  },
  {
    heading: "Elsewhere",
    items: [{ label: "Foundations", href: "/foundations" }, { label: "Docs" }, { label: "Status" }],
  },
];

export function MarketingFooter() {
  return (
    <footer className="flex justify-between gap-10 border-t border-rule bg-paper-sunk px-6 pt-10 pb-8.5 max-md:flex-col lg:px-14">
      <div className="max-w-[250px]">
        <Wordmark size={18} className="mb-3" />
        <p className="font-mono text-[10.5px] leading-[1.7] text-faint">
          [YOUR COMPANY], [CITY]
          <br />© 2026 · Privacy · Terms
        </p>
      </div>
      <div className="flex gap-14 max-sm:flex-col max-sm:gap-6">
        {FOOTER.map((column) => (
          <div key={column.heading} className="flex min-w-32 flex-col gap-2.5">
            <Label className="text-muted">{column.heading}</Label>
            {column.items.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[12.5px] text-faint hover:text-ember"
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="text-[12.5px] text-faint">
                  {item.label}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
