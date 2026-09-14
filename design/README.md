# Design source — Card Catalogue

The artboards behind the Contextualize front end, published as a Claude Design
canvas: <https://claude.ai/code/artifact/cc1ee309-c678-47b2-8ff8-da6777e62965>

Each `*.dc.html` file is one artboard; `canvas.json` lays them out across three
pages (App, Marketing & auth, Foundations). `System.dc.html` is the specimen
sheet — palette, type ramp, components, geometry — and its values are the ones
implemented in `app/globals.css`.

## Regenerating

The artboards are generated, not hand-written, so the token set stays in one
place:

```bash
python3 gen_graph.py     # knowledge-graph geometry -> *.svgfrag
python3 build.py         # tokens, primitives, Main (Ask)
python3 build2.py        # Library, Document
python3 build3.py        # Graph, Capture
python3 build4.py        # Landing
python3 build5.py        # Sign in, Mobile
python3 build6.py        # Foundations
```

Then re-seed and publish the canvas with the `design` skill's helper, passing
every artboard plus `canvas.json`.

## Note

Document titles, domains, similarity scores and counts across the artboards are
sample data written for the interface. Facts that need a real value — company,
city — are left bracketed.
