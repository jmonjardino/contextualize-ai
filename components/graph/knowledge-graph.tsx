"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { MinusIcon, PlusIcon, SparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TopBar } from "@/components/workspace/topbar";
import { useCapture } from "@/components/workspace/capture-provider";
import { CLUSTER_LABELS, LIBRARY_GRAPH as graph, UNPLACED_LABEL } from "@/lib/graph-layout";
import {
  chunkCount,
  CLUSTERS,
  clusterById,
  clusterCount,
  docById,
  docRef,
  LIBRARY_STATS,
  savedLabel,
  type ClusterId,
} from "@/lib/data/library";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 292;
const CARD_HEIGHT = 152;

export function KnowledgeGraph() {
  const router = useRouter();
  const { open } = useCapture();
  const [hidden, setHidden] = useState<Set<ClusterId>>(new Set());
  const [floor, setFloor] = useState(0.62);
  const [hovered, setHovered] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);

  const shown = useMemo(() => {
    const ids = new Set<number>();
    graph.nodes.forEach((node, i) => {
      if (node.cluster === null || !hidden.has(node.cluster)) ids.add(i);
    });
    return ids;
  }, [hidden]);

  const links = useMemo(
    () =>
      graph.links.filter(
        (link) => link.strength >= floor && shown.has(link.a) && shown.has(link.b),
      ),
    [floor, shown],
  );

  const bridges = links.filter((link) => link.bridge).length;

  function toggle(id: ClusterId) {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const node = hovered !== null ? graph.nodes[hovered] : null;
  const doc = node ? docById(node.docId) : null;
  const degree =
    hovered === null ? 0 : links.filter((l) => l.a === hovered || l.b === hovered).length;

  // Keep the hover card inside the frame: flip it left or up near an edge.
  const cardX = node
    ? Math.min(Math.max(node.x + 18, 8), graph.width - CARD_WIDTH - 8)
    : 0;
  const cardY = node
    ? node.y + CARD_HEIGHT + 24 > graph.height
      ? node.y - CARD_HEIGHT - 16
      : node.y + 16
    : 0;

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

            {graph.nodes.map((n, i) => {
              const dimmed = !shown.has(i);
              const target = docById(n.docId);
              return (
                <circle
                  key={n.docId}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.cluster === null ? "var(--color-paper)" : n.color}
                  stroke={n.cluster === null ? "var(--color-faint)" : undefined}
                  strokeWidth={n.cluster === null ? 1.2 : undefined}
                  opacity={dimmed ? 0.12 : 1}
                  className={dimmed ? undefined : "cursor-pointer"}
                  onMouseEnter={() => !dimmed && setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => !dimmed && target && router.push(`/library/${target.id}`)}
                >
                  {target ? <title>{target.title}</title> : null}
                </circle>
              );
            })}

            {node ? (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 9}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
                opacity={0.5}
              />
            ) : null}

            <text
              x={UNPLACED_LABEL.x}
              y={UNPLACED_LABEL.y}
              fill="var(--color-faint)"
              textAnchor="middle"
              className="font-mono"
              fontSize={10}
              letterSpacing={1.2}
            >
              NOT YET PLACED
            </text>

            {CLUSTER_LABELS.map((anchor) => {
              const cluster = clusterById(anchor.id);
              if (!cluster) return null;
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

            {/* The card rides in the graph's own coordinates, so it stays
                pinned to its node through zoom and rescaling. */}
            {node && doc ? (
              <foreignObject
                x={cardX}
                y={cardY}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                className="pointer-events-none overflow-visible"
              >
                <div className="overflow-hidden rounded-md border border-ink bg-surface shadow-card">
                  <div className="px-3.5 pt-3 pb-2.5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-faint">
                        №{docRef(doc)}
                      </span>
                      <span className="text-rule-firm">·</span>
                      <span
                        className="size-1.5 rounded-full"
                        style={{ background: node.color }}
                      />
                      <Label className="text-ink-soft">
                        {clusterById(doc.cluster)?.name ?? "Unclustered"}
                      </Label>
                    </div>
                    <p className="mb-1.5 line-clamp-2 text-[13.5px] font-medium leading-snug">
                      {doc.title}
                    </p>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                      {doc.summary}
                    </p>
                  </div>
                  <div className="h-px bg-rule-soft" />
                  <div className="flex items-center justify-between px-3.5 py-2">
                    <span className="font-mono text-[10px] text-faint">
                      {chunkCount(doc)} CHUNKS · {degree} LINKS
                    </span>
                    <span className="font-mono text-[10px] text-faint">
                      {savedLabel(doc)}
                    </span>
                  </div>
                </div>
              </foreignObject>
            ) : null}
          </g>
        </svg>

        <div className="absolute top-5 left-5 w-[244px] overflow-hidden rounded-md border border-rule-firm bg-paper/95 backdrop-blur-sm max-md:hidden">
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
                <span className="font-mono text-[10.5px] text-faint">
                  {clusterCount(cluster.id)}
                </span>
              </button>
            ))}
            <div className="mt-1 flex h-7 items-center gap-2.5 border-t border-rule-soft pt-1">
              <span className="size-2 shrink-0 rounded-full border border-rule-firm" />
              <span className="grow text-[12.5px] text-faint">Not yet placed</span>
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

        <div className="absolute right-5 bottom-5 flex overflow-hidden rounded-sm border border-rule-firm bg-paper">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(50, z - 12))}
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
