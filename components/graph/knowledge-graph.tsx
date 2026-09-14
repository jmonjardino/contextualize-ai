"use client";

import { useMemo, useState } from "react";

import { MinusIcon, PlusIcon, SparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TopBar } from "@/components/workspace/topbar";
import { useCapture } from "@/components/workspace/capture-provider";
import { CLUSTER_LABELS, LIBRARY_GRAPH as graph } from "@/lib/graph-layout";
import { CLUSTERS, clusterById, DOCS, LIBRARY_STATS, type ClusterId } from "@/lib/data/library";
import { cn } from "@/lib/utils";

/** One representative document per cluster, for the hover card. */
const SPECIMEN: Record<ClusterId, string> = {
  ai: "confidently-wrong-rag",
  frontend: "streaming-layout-shift",
  infra: "pgvector-index-types",
  design: "typesetting-long-form",
};

export function KnowledgeGraph() {
  const { open } = useCapture();
  const [hidden, setHidden] = useState<Set<ClusterId>>(new Set());
  const [floor, setFloor] = useState(0.62);
  const [hovered, setHovered] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);

  const visible = useMemo(
    () => new Set(graph.nodes.filter((n) => !hidden.has(n.cluster)).map((n) => n.id)),
    [hidden],
  );

  const links = useMemo(
    () =>
      graph.links.filter(
        (link) =>
          link.strength >= floor && visible.has(link.a) && visible.has(link.b),
      ),
    [floor, visible],
  );

  const bridges = links.filter((l) => l.bridge).length;

  function toggle(id: ClusterId) {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const hoveredNode = hovered !== null ? graph.nodes[hovered] : null;
  const hoveredDoc = hoveredNode
    ? DOCS.find((d) => d.id === SPECIMEN[hoveredNode.cluster])
    : null;

  return (
    <>
      <TopBar
        title="Graph"
        meta={`${LIBRARY_STATS.documents} nodes · ${CLUSTERS.length} clusters · ${bridges} bridges`}
        actions={
          <>
            <Button className="max-md:hidden">
              <SparkIcon size={15} />
              Reindex
            </Button>
            <Button variant="primary" onClick={open}>
              <PlusIcon size={15} />
              Capture
            </Button>
          </>
        }
      />

      <div
        className="relative grow overflow-hidden bg-paper"
        style={{
          backgroundImage: "radial-gradient(#eae4d9 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <svg
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Your library projected into two dimensions, clustered by meaning"
        >
          <g
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
              transition: "transform 180ms ease-out",
            }}
          >
          {links.map((link, i) => {
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
                strokeWidth={1}
                strokeDasharray={link.bridge ? "4 4" : undefined}
                opacity={link.bridge ? 0.5 : 1}
              />
            );
          })}

          {graph.nodes.map((node) => {
            const dimmed = hidden.has(node.cluster);
            return (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.color}
                opacity={dimmed ? 0.12 : 1}
                className="cursor-pointer"
                onMouseEnter={() => !dimmed && setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {hoveredNode ? (
            <circle
              cx={hoveredNode.x}
              cy={hoveredNode.y}
              r={13}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
              opacity={0.5}
            />
          ) : null}

          {CLUSTER_LABELS.map((anchor) => {
            const cluster = clusterById(anchor.id);
            return (
              <text
                key={anchor.id}
                x={anchor.x}
                y={anchor.y}
                fill={cluster.color}
                textAnchor="middle"
                className="font-mono"
                fontSize={11}
                letterSpacing={1.3}
                opacity={hidden.has(anchor.id) ? 0.25 : 1}
              >
                {cluster.name.toUpperCase()}
              </text>
            );
          })}
          </g>
        </svg>

        <div className="absolute top-5 left-5 w-[244px] overflow-hidden rounded-md border border-rule-firm bg-paper/95 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-rule px-3.5 pt-3 pb-2">
            <Label>Clusters</Label>
            <span className="font-mono text-[10px] text-faint">K-MEANS</span>
          </div>

          <div className="px-3.5 pt-1.5 pb-2.5">
            {CLUSTERS.map((cluster) => (
              <button
                key={cluster.id}
                type="button"
                onClick={() => toggle(cluster.id)}
                aria-pressed={!hidden.has(cluster.id)}
                className={cn(
                  "flex h-7 w-full items-center gap-2.5 text-left transition-opacity",
                  hidden.has(cluster.id) && "opacity-45",
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: cluster.color }}
                />
                <span className="grow text-[12.5px]">{cluster.name}</span>
                <span className="font-mono text-[10.5px] text-faint">{cluster.count}</span>
              </button>
            ))}
            <div className="mt-1 flex h-7 items-center gap-2.5 border-t border-rule-soft pt-1">
              <span className="size-2 shrink-0 rounded-full border border-rule-firm" />
              <span className="grow text-[12.5px] text-faint">Unclustered</span>
              <span className="font-mono text-[10.5px] text-faint">
                {LIBRARY_STATS.unclustered}
              </span>
            </div>
          </div>

          <div className="h-px bg-rule" />
          <div className="px-3.5 py-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>Similarity floor</Label>
              <span className="font-mono text-[10.5px] text-ink-soft">{floor.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.55}
              max={0.95}
              step={0.01}
              value={floor}
              onChange={(event) => setFloor(Number(event.target.value))}
              aria-label="Similarity floor"
              className="w-full accent-ink"
            />
            <div className="mt-1.5 flex justify-between">
              <span className="font-mono text-[9.5px] text-faint">LOOSE</span>
              <span className="font-mono text-[9.5px] text-faint">TIGHT</span>
            </div>
          </div>

          <div className="h-px bg-rule" />
          <div className="flex flex-col gap-2 px-3.5 pt-2.5 pb-3">
            <span className="flex items-center gap-2.5">
              <svg width="22" height="6" aria-hidden="true" className="shrink-0">
                <line x1="0" y1="3" x2="22" y2="3" stroke="#d3cbbc" strokeWidth="1.2" />
              </svg>
              <span className="text-[11.5px] text-muted">Semantic neighbour</span>
            </span>
            <span className="flex items-center gap-2.5">
              <svg width="22" height="6" aria-hidden="true" className="shrink-0">
                <line
                  x1="0"
                  y1="3"
                  x2="22"
                  y2="3"
                  stroke="var(--color-ember)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              </svg>
              <span className="text-[11.5px] text-muted">Cross-cluster bridge</span>
            </span>
          </div>
        </div>

        {hoveredDoc ? (
          <div className="pointer-events-none absolute top-[352px] left-[964px] w-[286px] overflow-hidden rounded-md border border-ink bg-surface shadow-card max-2xl:top-5 max-2xl:right-5 max-2xl:left-auto">
            <div className="px-3.5 pt-3 pb-2.5">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-faint">№{hoveredDoc.ref}</span>
                <span className="text-rule-firm">·</span>
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: clusterById(hoveredDoc.cluster).color }}
                />
                <Label className="text-ink-soft">{clusterById(hoveredDoc.cluster).name}</Label>
              </div>
              <p className="mb-1.5 text-[13.5px] font-medium leading-snug">{hoveredDoc.title}</p>
              <p className="text-xs leading-relaxed text-muted">{hoveredDoc.summary}</p>
            </div>
            <div className="h-px bg-rule-soft" />
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-mono text-[10px] text-faint">
                {hoveredDoc.chunks} CHUNKS · {links.filter((l) => l.a === hovered || l.b === hovered).length} LINKS
              </span>
              <span className="font-mono text-[10px] text-ember">{bridges} BRIDGES</span>
            </div>
          </div>
        ) : null}

        <div className="absolute right-5 bottom-5 flex overflow-hidden rounded-sm border border-rule-firm bg-paper">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(40, z - 12))}
            className="flex size-[30px] items-center justify-center border-r border-rule text-ink-soft hover:bg-paper-sunk"
          >
            <MinusIcon size={13} strokeWidth={1.7} />
          </button>
          <span className="flex h-[30px] items-center px-3 font-mono text-[10.5px] text-ink-soft">
            {zoom}%
          </span>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(200, z + 12))}
            className="flex size-[30px] items-center justify-center border-l border-rule text-ink-soft hover:bg-paper-sunk"
          >
            <PlusIcon size={13} strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </>
  );
}
