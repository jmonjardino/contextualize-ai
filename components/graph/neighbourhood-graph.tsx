import { QUERY_NEIGHBOURHOOD as graph } from "@/lib/graph-layout";

/** A thumbnail of the passages nearest the current question. */
export function NeighbourhoodGraph() {
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
            stroke="var(--color-rule-firm)"
            strokeWidth={0.9}
          />
        );
      })}
      {graph.nodes.map((node) => (
        <circle key={node.id} cx={node.x} cy={node.y} r={node.r} fill={node.color} />
      ))}
      <circle
        cx={graph.nodes[0].x}
        cy={graph.nodes[0].y}
        r={9}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
        opacity={0.45}
      />
    </svg>
  );
}
