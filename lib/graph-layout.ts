import {
  chunkCount,
  CLUSTERS,
  clusterCount,
  DOCS,
  docColor,
  type ClusterId,
  type Doc,
} from "@/lib/data/library";

export type GraphNode = {
  docId: string;
  x: number;
  y: number;
  /** Radius grows with the chunk count — a bigger document is a bigger dot. */
  r: number;
  cluster: ClusterId | null;
  color: string;
};

export type GraphLink = { a: number; b: number; bridge: boolean; strength: number };

export type Graph = {
  nodes: GraphNode[];
  links: GraphLink[];
  width: number;
  height: number;
};

export const GRAPH_WIDTH = 1208;
export const GRAPH_HEIGHT = 843;

/**
 * Where each cluster's centroid sits in the projection. A real build would run
 * UMAP over the 1536-dimension vectors and use its output here; this stands in
 * for that, and keeps the same contract: one node per document, positions
 * derived only from the document's own id, so a document never moves because
 * another one was added.
 */
const CENTROIDS: Record<ClusterId, { x: number; y: number }> = {
  ai: { x: 520, y: 350 },
  frontend: { x: 880, y: 232 },
  infra: { x: 880, y: 600 },
  design: { x: 470, y: 640 },
};

/**
 * A cluster's radius grows with the square root of its size, so ten documents
 * and forty documents both read as a cluster rather than a smear.
 */
const clusterRadius = (id: ClusterId) => 34 * Math.sqrt(Math.max(1, clusterCount(id)));

/** Documents the clustering job has not placed sit in a band down the margin. */
const UNPLACED_BAND = { x0: 1088, x1: 1180, y0: 120, y1: 760 };

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Two stable pseudo-randoms per document, drawn from its id. */
function pair(seed: number): [number, number] {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return [next(), next()];
}

/** The golden angle: successive points never line up into spokes. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Phyllotaxis rather than rejection sampling. Purely random placement leaves
 * holes and clumps at these cluster sizes; a sunflower spiral fills the disc
 * evenly at any N, and a hash-derived jitter keeps it from looking mechanical.
 */
function place(doc: Doc, index: number, total: number): { x: number; y: number } {
  const [u, v] = pair(hash(doc.id));

  if (doc.cluster === null) {
    const step = total > 1 ? index / (total - 1) : 0.5;
    return {
      x: UNPLACED_BAND.x0 + (0.2 + 0.6 * u) * (UNPLACED_BAND.x1 - UNPLACED_BAND.x0),
      y: UNPLACED_BAND.y0 + (step * 0.86 + v * 0.14) * (UNPLACED_BAND.y1 - UNPLACED_BAND.y0),
    };
  }

  const centroid = CENTROIDS[doc.cluster];
  const spread = clusterRadius(doc.cluster);
  const radius = spread * Math.sqrt((index + 0.5) / total) * (0.86 + 0.26 * u);
  const angle = index * GOLDEN_ANGLE + (v - 0.5) * 0.55;
  return {
    x: centroid.x + radius * Math.cos(angle),
    y: centroid.y + radius * Math.sin(angle) * 0.88,
  };
}

function buildLibraryGraph(): Graph {
  // Position within a cluster comes from the document's rank inside it, so the
  // spiral fills outward in save order and a document keeps its neighbours.
  const ranks = new Map<string, { index: number; total: number }>();
  const groups = new Map<string, Doc[]>();
  DOCS.forEach((doc) => {
    const key = doc.cluster ?? "unplaced";
    groups.set(key, [...(groups.get(key) ?? []), doc]);
  });
  groups.forEach((docs) =>
    docs.forEach((doc, index) => ranks.set(doc.id, { index, total: docs.length })),
  );

  const nodes: GraphNode[] = DOCS.map((doc) => {
    const rank = ranks.get(doc.id) ?? { index: 0, total: 1 };
    const { x, y } = place(doc, rank.index, rank.total);
    return {
      docId: doc.id,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      r: doc.cluster === null ? 3.2 : 3 + Math.min(5.4, chunkCount(doc) / 4.4),
      cluster: doc.cluster,
      color: docColor(doc),
    };
  });

  const distance = (a: GraphNode, b: GraphNode) => Math.hypot(a.x - b.x, a.y - b.y);
  const seen = new Set<string>();
  const raw: { a: number; b: number; d: number; bridge: boolean }[] = [];

  // Three nearest neighbours inside the cluster. Unplaced documents get none —
  // having no confident neighbour is exactly why they are unplaced.
  nodes.forEach((node, i) => {
    if (node.cluster === null) return;
    nodes
      .map((other, j) => ({ other, j, d: distance(node, other) }))
      .filter(({ other, j }) => j !== i && other.cluster === node.cluster)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach(({ j, d }) => {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (seen.has(key)) return;
        seen.add(key);
        raw.push({ a: i, b: j, d, bridge: false });
      });
  });

  // The closest pair across each cluster boundary: the "you saved these for
  // different reasons and they turned out related" link.
  const pairs: [ClusterId, ClusterId][] = [
    ["ai", "frontend"],
    ["ai", "infra"],
    ["frontend", "infra"],
    ["ai", "design"],
    ["design", "frontend"],
  ];
  pairs.forEach(([from, to]) => {
    let best: { a: number; b: number; d: number } | null = null;
    nodes.forEach((a, i) => {
      if (a.cluster !== from) return;
      nodes.forEach((b, j) => {
        if (b.cluster !== to) return;
        const d = distance(a, b);
        if (!best || d < best.d) best = { a: i, b: j, d };
      });
    });
    if (best) {
      const found: { a: number; b: number; d: number } = best;
      raw.push({ ...found, bridge: true });
    }
  });

  // Map projected distance onto a plausible cosine range, so the similarity
  // floor in the UI thins the graph from its weakest edges inwards.
  const longest = Math.max(...raw.map((link) => link.d), 1);
  const links: GraphLink[] = raw.map(({ a, b, d, bridge }) => ({
    a,
    b,
    bridge,
    strength: Math.round((0.99 - 0.44 * (d / longest)) * 100) / 100,
  }));

  return { nodes, links, width: GRAPH_WIDTH, height: GRAPH_HEIGHT };
}

export const LIBRARY_GRAPH = buildLibraryGraph();

const NODE_INDEX = new Map(LIBRARY_GRAPH.nodes.map((node, i) => [node.docId, i]));

/** Roughly the width of the largest cluster: the distance at which two
 *  documents stop being neighbours and start merely sharing a topic. */
const NEIGHBOUR_SCALE = 320;

/**
 * Documents nearest to this one in the projection, strongest first. This is
 * what the reader's "nearest in your library" panel lists; with real vectors it
 * becomes an ORDER BY on the embedding distance.
 */
export function nearestTo(docId: string, count = 4) {
  const self = NODE_INDEX.get(docId);
  if (self === undefined) return [];
  const origin = LIBRARY_GRAPH.nodes[self];

  return LIBRARY_GRAPH.nodes
    .filter((node) => node.docId !== docId && node.cluster !== null)
    .map((node) => ({
      docId: node.docId,
      d: Math.hypot(origin.x - node.x, origin.y - node.y),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map(({ docId: id, d }) => ({
      docId: id,
      // Scaled against a cluster's own width rather than the whole canvas, so
      // near neighbours spread across the range instead of all reading 0.93.
      similarity: Math.round(Math.max(0.5, 0.95 - 0.6 * (d / NEIGHBOUR_SCALE)) * 100) / 100,
    }));
}

/** Cluster name anchors, placed just outside each centroid. */
export const CLUSTER_LABELS = CLUSTERS.map((cluster) => {
  const members = LIBRARY_GRAPH.nodes.filter((node) => node.cluster === cluster.id);
  const below = cluster.id === "infra" || cluster.id === "design";
  const xs = members.map((n) => n.x);
  const ys = members.map((n) => n.y);
  return {
    id: cluster.id,
    x: Math.round((Math.min(...xs) + Math.max(...xs)) / 2),
    y: Math.round(below ? Math.max(...ys) + 30 : Math.min(...ys) - 20),
  };
});

/** Where to caption the margin band of documents the clustering has not placed. */
export const UNPLACED_LABEL = {
  x: (UNPLACED_BAND.x0 + UNPLACED_BAND.x1) / 2,
  y: UNPLACED_BAND.y0 - 34,
};

/**
 * The passages around one answer, rescaled into a thumbnail. Takes the cited
 * documents and their neighbours, so the rail shows the actual neighbourhood
 * the answer came from rather than a decorative constellation.
 */
export function neighbourhoodGraph(docIds: string[], width: number, height: number): Graph {
  const wanted = new Set(docIds);
  docIds.forEach((id) => nearestTo(id, 5).forEach((n) => wanted.add(n.docId)));

  const picked = LIBRARY_GRAPH.nodes
    .map((node, i) => ({ node, i }))
    .filter(({ node }) => wanted.has(node.docId));
  if (picked.length === 0) return { nodes: [], links: [], width, height };

  const xs = picked.map(({ node }) => node.x);
  const ys = picked.map(({ node }) => node.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX || 1;
  const spanY = Math.max(...ys) - minY || 1;
  const pad = 14;
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);

  const remap = new Map(picked.map(({ i }, at) => [i, at]));
  const nodes: GraphNode[] = picked.map(({ node }) => ({
    ...node,
    x: Math.round((pad + (node.x - minX) * scale) * 10) / 10,
    y: Math.round((pad + (node.y - minY) * scale) * 10) / 10,
    r: Math.max(1.8, node.r * 0.62),
  }));

  const links = LIBRARY_GRAPH.links
    .filter((link) => remap.has(link.a) && remap.has(link.b))
    .map((link) => ({
      ...link,
      a: remap.get(link.a)!,
      b: remap.get(link.b)!,
    }));

  return { nodes, links, width, height };
}
