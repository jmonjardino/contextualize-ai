# -*- coding: utf-8 -*-
"""Geometry for the knowledge-graph artboards. Coordinates are 1:1 CSS px."""
import random, math, json

W, H = 1208, 843          # graph canvas area (1440 - sidebar, 900 - topbar)

CLUSTERS = [
    ("AI & Agents",    505, 345, 168, 25, "#B2492A", (0, -196)),
    ("Frontend",       886, 212, 132, 18, "#2E6A55", (0, -142)),
    ("Infrastructure", 902, 622, 132, 16, "#17140F", (0, 152)),
    ("Design",         452, 664, 108, 12, "#8A6A2F", (0, 136)),
]

def gauss_pt(cx, cy, s, rng):
    while True:
        x = rng.gauss(cx, s * 0.48)
        y = rng.gauss(cy, s * 0.44)
        if math.hypot(x - cx, y - cy) < s * 1.12:
            return x, y

def layout(seed=20260914):
    rng = random.Random(seed)
    nodes = []
    for ci, (name, cx, cy, s, n, color, off) in enumerate(CLUSTERS):
        for _ in range(n):
            x, y = gauss_pt(cx, cy, s, rng)
            nodes.append({"x": round(x, 1), "y": round(y, 1),
                          "r": rng.choice([2.6, 3.0, 3.4, 3.4, 3.9, 4.6, 5.6]),
                          "c": ci, "color": color})
    links = set()
    for i, a in enumerate(nodes):
        same = sorted((math.hypot(a["x"] - b["x"], a["y"] - b["y"]), j)
                      for j, b in enumerate(nodes) if j != i and b["c"] == a["c"])
        for _, j in same[:3]:
            links.add((min(i, j), max(i, j)))
    bridges = []
    for (ca, cb) in [(0, 1), (0, 2), (1, 2), (0, 3), (3, 1)]:
        best = None
        for i, a in enumerate(nodes):
            if a["c"] != ca: continue
            for j, b in enumerate(nodes):
                if b["c"] != cb: continue
                d = math.hypot(a["x"] - b["x"], a["y"] - b["y"])
                if best is None or d < best[0]:
                    best = (d, i, j)
        bridges.append((best[1], best[2]))
    return nodes, sorted(links), bridges

def svg_inner(nodes, links, bridges, labels=True, focus=None,
              link_c="#D3CBBC", lw=1.0, rmul=1.0, dx=0, dy=0, scale=1.0):
    def X(v): return round(v * scale + dx, 1)
    def Y(v): return round(v * scale + dy, 1)
    out = []
    for (i, j) in links:
        a, b = nodes[i], nodes[j]
        out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s"/>'
                   % (X(a["x"]), Y(a["y"]), X(b["x"]), Y(b["y"]), link_c, lw))
    for (i, j) in bridges:
        a, b = nodes[i], nodes[j]
        out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#B2492A" stroke-width="%s" '
                   'stroke-dasharray="4 4" opacity="0.5"/>'
                   % (X(a["x"]), Y(a["y"]), X(b["x"]), Y(b["y"]), lw))
    if focus is not None:
        f = nodes[focus]
        out.append('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="#17140F" stroke-width="1.2" opacity="0.5"/>'
                   % (X(f["x"]), Y(f["y"]), round(13 * scale, 1)))
    for nd in nodes:
        out.append('<circle cx="%s" cy="%s" r="%s" fill="%s"/>'
                   % (X(nd["x"]), Y(nd["y"]), round(max(1.2, nd["r"] * rmul * scale), 1), nd["color"]))
    if focus is not None:
        f = nodes[focus]
        out.append('<circle cx="%s" cy="%s" r="%s" fill="#FBF9F5" stroke="#17140F" stroke-width="2"/>'
                   % (X(f["x"]), Y(f["y"]), round(5.4 * scale, 1)))
    if labels:
        for ci, (name, cx, cy, s, n, color, off) in enumerate(CLUSTERS):
            out.append('<text x="%s" y="%s" fill="%s" font-family="IBM Plex Mono, monospace" '
                       'font-size="11" letter-spacing="1.3" text-anchor="middle">%s</text>'
                       % (X(cx + off[0]), Y(cy + off[1]), color, name.upper().replace("&", "&amp;")))
    return "\n".join(out)

nodes, links, bridges = layout()
# focus node: the Infrastructure node closest to its centre
# focus: the right-most AI & Agents node, so the hover card sits in open space
focus = max(((n["x"], i) for i, n in enumerate(nodes) if n["c"] == 0))[1]

open("graph_full.svgfrag", "w").write(svg_inner(nodes, links, bridges, labels=True, focus=focus))
json.dump({"w": W, "h": H, "focus": {"x": nodes[focus]["x"], "y": nodes[focus]["y"]},
           "counts": [c[4] for c in CLUSTERS]}, open("graph_meta.json", "w"))

# rail neighbourhood: 19 nodes, 264 x 150
rng = random.Random(77)
MINI = [(66, 58, 33, 7, "#B2492A"), (194, 48, 29, 6, "#2E6A55"), (136, 112, 27, 6, "#17140F")]
mn = []
for ci, (cx, cy, s, n, color) in enumerate(MINI):
    for _ in range(n):
        x, y = gauss_pt(cx, cy, s, rng)
        mn.append({"x": round(x, 1), "y": round(y, 1), "r": rng.choice([2.2, 2.6, 3.0, 3.6]),
                   "c": ci, "color": color})
ml = set()
for i, a in enumerate(mn):
    same = sorted((math.hypot(a["x"] - b["x"], a["y"] - b["y"]), j)
                  for j, b in enumerate(mn) if j != i and b["c"] == a["c"])
    for _, j in same[:2]:
        ml.add((min(i, j), max(i, j)))
open("graph_mini.svgfrag", "w").write(
    svg_inner(mn, sorted(ml), [], labels=False, focus=0, link_c="#D9D1C2", lw=0.9))
print("nodes", len(nodes), "links", len(links), "focus at", nodes[focus]["x"], nodes[focus]["y"])
