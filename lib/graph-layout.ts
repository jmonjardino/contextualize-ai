import { CLUSTERS, type ClusterId } from "@/lib/data/library";

export type GraphNode = {
  id: number;
  x: number;
  y: number;
  r: number;
  cluster: ClusterId;
  color: string;
  /** Documents cluster tightly; this stands in for embedding distance. */
  strength: number;
};

export type GraphLink = { a: number; b: number; bridge: boolean; strength: number };

export type Graph = { nodes: GraphNode[]; links: GraphLink[]; width: number; height: number };

type Seed = { id: ClusterId; cx: number; cy: number; spread: number; count: number };

/**
 * Deterministic layout. A real build would project the 1536-dimension vectors
 * down with UMAP or t-SNE and hand the result here; until then the same seed
 * produces the same picture on the server and in the browser, so nothing
 * shifts on hydration.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function buildGraph({
  width,
  height,
  seeds,
  seedValue = 20260914,
  neighbours = 3,
  radii = [2.6, 3, 3.4, 3.4, 3.9, 4.6, 5.6],
  bridgePairs = [],
}: {
  width: number;
  height: number;
  seeds: Seed[];
  seedValue?: number;
  neighbours?: number;
  radii?: number[];
  bridgePairs?: [ClusterId, ClusterId][];
}): Graph {
  const rand = mulberry32(seedValue);
  const nodes: GraphNode[] = [];

  for (const seed of seeds) {
    const color =
      CLUSTERS.find((c) => c.id === seed.id)?.color ?? "var(--color-ink)";
    for (let i = 0; i < seed.count; i += 1) {
      let x = 0;
      let y = 0;
      do {
        x = seed.cx + gaussian(rand) * seed.spread * 0.48;
        y = seed.cy + gaussian(rand) * seed.spread * 0.44;
      } while (Math.hypot(x - seed.cx, y - seed.cy) > seed.spread * 1.12);
      nodes.push({
        id: nodes.length,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        r: radii[Math.floor(rand() * radii.length)],
        cluster: seed.id,
        color,
        strength: 0,
      });
    }
  }

  const seen = new Set<string>();
  const raw: { a: number; b: number; d: number }[] = [];

  nodes.forEach((node) => {
    const near = nodes
      .filter((other) => other.id !== node.id && other.cluster === node.cluster)
      .map((other) => ({ other, d: Math.hypot(node.x - other.x, node.y - other.y) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, neighbours);

    near.forEach(({ other, d }) => {
      const key = `${Math.min(node.id, other.id)}-${Math.max(node.id, other.id)}`;
      if (seen.has(key)) return;
      seen.add(key);
      raw.push({ a: node.id, b: other.id, d });
    });
  });

  // Map projected distance onto a plausible cosine range: the closest pair in
  // the layout reads as ~0.99, the furthest neighbour link as ~0.55, so the
  // similarity floor in the UI thins the graph from its edges inwards.
  const longest = Math.max(...raw.map((link) => link.d), 1);
  const links: GraphLink[] = raw.map(({ a, b, d }) => {
    const strength = Math.round((0.99 - 0.44 * (d / longest)) * 100) / 100;
    nodes[a].strength = Math.max(nodes[a].strength, strength);
    nodes[b].strength = Math.max(nodes[b].strength, strength);
    return { a, b, bridge: false, strength };
  });

  bridgePairs.forEach(([from, to]) => {
    let best: { a: number; b: number; d: number } | null = null;
    nodes.forEach((a) => {
      if (a.cluster !== from) return;
      nodes.forEach((b) => {
        if (b.cluster !== to) return;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (!best || d < best.d) best = { a: a.id, b: b.id, d };
      });
    });
    if (best) {
      const found = best as { a: number; b: number; d: number };
      links.push({ a: found.a, b: found.b, bridge: true, strength: 0.62 });
    }
  });

  return { nodes, links, width, height };
}

/** The full library, laid out for the Graph screen. */
export const LIBRARY_GRAPH = buildGraph({
  width: 1208,
  height: 843,
  seeds: [
    { id: "ai", cx: 505, cy: 345, spread: 168, count: 25 },
    { id: "frontend", cx: 886, cy: 212, spread: 132, count: 18 },
    { id: "infra", cx: 902, cy: 622, spread: 132, count: 16 },
    { id: "design", cx: 452, cy: 664, spread: 108, count: 12 },
  ],
  bridgePairs: [
    ["ai", "frontend"],
    ["ai", "infra"],
    ["frontend", "infra"],
    ["ai", "design"],
    ["design", "frontend"],
  ],
});

/** The passages around one question, for the Ask rail. */
export const QUERY_NEIGHBOURHOOD = buildGraph({
  width: 264,
  height: 150,
  seedValue: 77,
  neighbours: 2,
  radii: [2.2, 2.6, 3, 3.6],
  seeds: [
    { id: "ai", cx: 66, cy: 58, spread: 33, count: 7 },
    { id: "frontend", cx: 194, cy: 48, spread: 29, count: 6 },
    { id: "infra", cx: 136, cy: 112, spread: 27, count: 6 },
  ],
});

/** Label anchors, offset from each cluster's centroid. */
export const CLUSTER_LABELS: { id: ClusterId; x: number; y: number }[] = [
  { id: "ai", x: 505, y: 149 },
  { id: "frontend", x: 886, y: 70 },
  { id: "infra", x: 902, y: 774 },
  { id: "design", x: 452, y: 800 },
];
