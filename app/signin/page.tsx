import Link from "next/link";

import { GoogleMark, Mark } from "@/components/icons";
import { Wordmark } from "@/components/workspace/wordmark";
import { CLUSTER_LABELS, LIBRARY_GRAPH as graph } from "@/lib/graph-layout";
import { clusterById, LIBRARY_STATS } from "@/lib/data/library";

export const metadata = { title: "Sign in · Contextualize" };

export default function SignInPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-paper">
      {/* The library itself, as the ground you are signing in to. */}
      <svg
        viewBox={`80 40 1100 780`}
        className="pointer-events-none absolute inset-0 size-full opacity-15"
        aria-hidden="true"
      >
        {graph.links.map((link, i) => {
          const a = graph.nodes[link.a];
          const b = graph.nodes[link.b];
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={link.bridge ? "var(--color-ember)" : "#d3cbbc"}
              strokeDasharray={link.bridge ? "4 4" : undefined}
              strokeWidth={1}
            />
          );
        })}
        {graph.nodes.map((node) => (
          <circle key={node.id} cx={node.x} cy={node.y} r={node.r} fill={node.color} />
        ))}
        {CLUSTER_LABELS.map((anchor) => (
          <text
            key={anchor.id}
            x={anchor.x}
            y={anchor.y}
            fill={clusterById(anchor.id).color}
            textAnchor="middle"
            className="font-mono"
            fontSize={11}
            letterSpacing={1.3}
          >
            {clusterById(anchor.id).name.toUpperCase()}
          </text>
        ))}
      </svg>

      <header className="relative flex h-18 items-center justify-between px-6 lg:px-10">
        <Wordmark size={20} />
        <span className="font-mono text-[11px] tracking-[0.06em] text-faint">
          CONTEXTUALIZE.AI
        </span>
      </header>

      <main className="relative flex grow items-center justify-center px-6 py-10">
        <div className="w-full max-w-[404px] overflow-hidden rounded-lg border border-ink bg-paper shadow-lift">
          <div className="flex flex-col items-center px-8.5 pt-8.5 text-center">
            <Mark size={34} />
            <h1 className="mt-4.5 mb-2.5 font-display text-[30px] leading-[1.15] tracking-[-0.012em]">
              Open your library
            </h1>
            <p className="max-w-[30ch] text-[13.5px] leading-[1.6] text-muted">
              {LIBRARY_STATS.documents} documents and{" "}
              {LIBRARY_STATS.chunks.toLocaleString()} chunks are waiting behind one click.
            </p>
          </div>

          <div className="px-8.5 pt-6.5">
            {/* TODO: supabase.auth.signInWithOAuth({ provider: "google" }) */}
            <Link
              href="/ask"
              className="flex h-[46px] items-center justify-center gap-2.5 rounded-sm bg-ink text-paper transition-colors hover:bg-ink-soft"
            >
              <GoogleMark size={17} />
              <span className="text-sm font-medium">Continue with Google</span>
            </Link>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px grow bg-rule" />
              <span className="font-mono text-[10px] tracking-[0.1em] text-faint">
                THAT IS THE WHOLE FORM
              </span>
              <span className="h-px grow bg-rule" />
            </div>

            <p className="text-center font-mono text-[10.5px] leading-[1.75] text-faint">
              No password to forget, no email to verify.
              <br />
              Row Level Security keeps your rows yours.
            </p>
          </div>

          <div className="mt-6.5 flex items-center justify-between gap-4 border-t border-rule bg-paper-sunk px-8.5 py-3.5">
            <span className="font-mono text-[10.5px] text-muted">New here?</span>
            <span className="font-mono text-[10.5px] text-ember">
              Signing in creates your library
            </span>
          </div>
        </div>
      </main>

      <footer className="relative flex h-16 items-center justify-center gap-4">
        {["Privacy", "Terms", "Export policy"].map((item, i) => (
          <span key={item} className="flex items-center gap-4">
            {i > 0 ? <span className="text-rule-firm">·</span> : null}
            <span className="font-mono text-[10.5px] tracking-[0.06em] text-faint uppercase">
              {item}
            </span>
          </span>
        ))}
      </footer>
    </div>
  );
}
