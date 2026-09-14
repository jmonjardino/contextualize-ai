import { neighbourhoodGraph } from "@/lib/graph-layout";

/**
 * A thumbnail of the region the answer was drawn from: the cited documents
 * and their neighbours, rescaled out of the full projection.
 */
export function NeighbourhoodGraph({ docIds }: { docIds: string[] }) {
  const graph = neighbourhoodGraph(docIds, 264, 150);
  const cited = new Set(docIds);

  return (
    <svg
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      width="100%"
      className="block"
      role="img"
      aria-label="Map of the passages nearest your question"
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
            stroke={link.bridge ? "var(--color-ember)" : "var(--color-rule-firm)"}
            strokeDasharray={link.bridge ? "3 3" : undefined}
            strokeWidth={0.9}
          />
        );
      })}
      {graph.nodes.map((node) => (
        <g key={node.docId}>
          {cited.has(node.docId) ? (
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 5}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
              opacity={0.45}
            />
          ) : null}
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
        </g>
      ))}
    </svg>
  );
}
