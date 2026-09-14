# -*- coding: utf-8 -*-
from build import *

# ================================================================ GRAPH
def legend_row(name, count, color, muted=False):
    op = "0.45" if muted else "1"
    return ('<div style="display: flex; align-items: center; gap: 9px; height: 28px; opacity: %s;">'
            '<span style="width: 8px; height: 8px; border-radius: 50%%; background: %s; flex-shrink: 0;"></span>'
            '<span style="font-size: 12.5px; color: #17140F; flex-grow: 1;">%s</span>'
            '<span class="m" style="font-size: 10.5px; color: #9C9384;">%s</span></div>' % (op, color, name, count))

def build_graph():
    legend = "".join(legend_row(n, k, c) for (n, k, c) in
                     [("AI &amp; Agents", "42", EMBER), ("Frontend", "31", MOSS),
                      ("Infrastructure", "18", INK), ("Design", "12", GOLD)])
    panel = """<div style="position: absolute; top: 20px; left: 20px; width: 244px; border: 1px solid #D6CEBF; background: rgba(251,249,245,0.94); border-radius: 4px; overflow: hidden;">
      <div style="padding: 12px 14px 8px; border-bottom: 1px solid #E3DDD1; display: flex; align-items: center; justify-content: space-between;">
        __CLLBL__<span class="m" style="font-size: 10px; color: #9C9384;">K-MEANS</span>
      </div>
      <div style="padding: 6px 14px 10px;">__LEGEND__
        <div style="display: flex; align-items: center; gap: 9px; height: 28px; border-top: 1px solid #EFEBE2; margin-top: 4px; padding-top: 4px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; border: 1px solid #D6CEBF; flex-shrink: 0;"></span>
          <span style="font-size: 12.5px; color: #9C9384; flex-grow: 1;">Unclustered</span>
          <span class="m" style="font-size: 10.5px; color: #9C9384;">81</span>
        </div>
      </div>
      <div style="height: 1px; background: #E3DDD1;"></div>
      <div style="padding: 12px 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px;">
          __THLBL__<span class="m" style="font-size: 10.5px; color: #3D372E;">0.62</span>
        </div>
        <div style="position: relative; height: 3px; background: #DFD7C8; border-radius: 2px;">
          <div style="width: 62%; height: 3px; background: #17140F; border-radius: 2px;"></div>
          <div style="position: absolute; left: 62%; top: -4px; width: 11px; height: 11px; border-radius: 50%; background: #FBF9F5; border: 1.5px solid #17140F; margin-left: -5px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 7px;">
          <span class="m" style="font-size: 9.5px; color: #9C9384;">LOOSE</span>
          <span class="m" style="font-size: 9.5px; color: #9C9384;">TIGHT</span>
        </div>
      </div>
      <div style="height: 1px; background: #E3DDD1;"></div>
      <div style="padding: 11px 14px 13px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 9px;">
          <svg width="22" height="6" style="flex-shrink: 0;"><line x1="0" y1="3" x2="22" y2="3" stroke="#CFC7B8" stroke-width="1.2"/></svg>
          <span style="font-size: 11.5px; color: #78705F;">Semantic neighbour</span>
        </div>
        <div style="display: flex; align-items: center; gap: 9px;">
          <svg width="22" height="6" style="flex-shrink: 0;"><line x1="0" y1="3" x2="22" y2="3" stroke="#B2492A" stroke-width="1.2" stroke-dasharray="3 3"/></svg>
          <span style="font-size: 11.5px; color: #78705F;">Cross-cluster bridge</span>
        </div>
      </div>
    </div>"""
    panel = (panel.replace("__CLLBL__", lbl("Clusters")).replace("__LEGEND__", legend)
             .replace("__THLBL__", lbl("Similarity floor")))

    tooltip = """<div style="position: absolute; top: 352px; left: 964px; width: 286px; border: 1px solid #17140F; background: #FFFFFF; border-radius: 4px; box-shadow: 0 12px 28px rgba(23,20,15,0.13); overflow: hidden;">
      <div style="padding: 11px 13px 10px;">
        <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 8px;">
          <span class="m" style="font-size: 10px; color: #9C9384;">&#8470;0144</span>
          <span style="color: #D6CEBF;">&#183;</span>
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #B2492A;"></span>
          <span class="m" style="font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #3D372E;">AI &amp; Agents</span>
        </div>
        <div style="font-size: 13.5px; font-weight: 500; line-height: 1.35; color: #17140F; margin-bottom: 6px;">Why your RAG answers are confidently wrong</div>
        <div style="font-size: 12px; line-height: 1.5; color: #78705F;">Retrieval quality collapses long before generation does &#8212; measure recall@k before touching prompts.</div>
      </div>
      <div style="height: 1px; background: #EFEBE2;"></div>
      <div style="padding: 9px 13px; display: flex; align-items: center; justify-content: space-between;">
        <span class="m" style="font-size: 10px; color: #9C9384;">22 CHUNKS &#183; 9 LINKS</span>
        <span class="m" style="font-size: 10px; color: #B2492A;">2 BRIDGES</span>
      </div>
    </div>"""

    zoom = """<div style="position: absolute; bottom: 20px; right: 20px; display: flex; align-items: center; gap: 8px;">
      <div style="display: flex; border: 1px solid #D6CEBF; background: #FBF9F5; border-radius: 3px; overflow: hidden;">
        <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-right: 1px solid #E3DDD1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3D372E" stroke-width="1.7" stroke-linecap="round"><path d="M5.5 12h13"/></svg></div>
        <div style="height: 30px; display: flex; align-items: center; padding: 0 11px;"><span class="m" style="font-size: 10.5px; color: #3D372E;">88%</span></div>
        <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-left: 1px solid #E3DDD1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3D372E" stroke-width="1.7" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg></div>
      </div>
    </div>"""

    right = (btn_ghost("Semantic layout", I_CHEV, 32, 12.5)
             + btn_ghost("Reindex", I_SPARK, 32, 12.5)
             + btn_primary("Capture", I_PLUS, height=32, font=12.5))
    canvas = ('<div style="position: relative; flex-grow: 1; overflow: hidden; background: #FBF9F5; '
              'background-image: radial-gradient(#EAE4D9 1px, transparent 1px); background-size: 26px 26px;">'
              '<svg width="1208" height="843" viewBox="0 0 1208 843" style="position: absolute; inset: 0; '
              'display: block;">' + GRAPH_FULL + '</svg>'
              + panel + tooltip + zoom + '</div>')
    body = ('<div style="display: flex; flex-grow: 1; min-height: 0;">' + sidebar("graph")
            + '<main style="flex-grow: 1; display: flex; flex-direction: column; min-width: 0;">'
            + topbar("Graph", "184 nodes &#183; 4 clusters &#183; 5 bridges", right)
            + canvas + '</main></div>')
    return page(body, h=900)

open("Graph.dc.html", "w").write(build_graph())

# ================================================================ CAPTURE MODAL
def step(name, state, detail):
    if state == "done":
        icon = ('<div style="width: 17px; height: 17px; border-radius: 50%; background: #2E6A55; display: flex; '
                'align-items: center; justify-content: center; flex-shrink: 0;">'
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" '
                'stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.5l4 4 9-9.5"/></svg></div>')
        col, dcol = INK, MUTED
    elif state == "running":
        icon = ('<div style="width: 17px; height: 17px; border-radius: 50%; border: 2px solid #E6CEC1; '
                'border-top-color: #B2492A; flex-shrink: 0;"></div>')
        col, dcol = EMBER_D, EMBER
    else:
        icon = ('<div style="width: 17px; height: 17px; border-radius: 50%; border: 1.5px solid #E3DDD1; '
                'flex-shrink: 0;"></div>')
        col, dcol = FAINT, "#B8B0A0"
    return ('<div style="display: flex; align-items: center; gap: 11px; height: 32px;">%s'
            '<span style="font-size: 13px; font-weight: 500; color: %s; flex-grow: 1;">%s</span>'
            '<span class="m" style="font-size: 10.5px; color: %s;">%s</span></div>' % (icon, col, name, dcol, detail))

def build_capture():
    steps = "".join([
        step("Fetch page", "done", "0.4s"),
        step("Strip to readable text", "done", "1,842 WORDS"),
        step("Title, summary &amp; tags", "done", "GPT-4o-MINI"),
        step("Split into chunks", "done", "7 &#215; 800 CHAR"),
        step("Embed &amp; store vectors", "running", "5 / 7"),
    ])
    modal = """<div style="position: absolute; inset: 0; background: rgba(23,20,15,0.42); display: flex; align-items: center; justify-content: center;">
      <div style="width: 568px; background: #FBF9F5; border: 1px solid #17140F; border-radius: 5px; box-shadow: 0 26px 64px rgba(23,20,15,0.3); overflow: hidden;">
        <div style="height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-bottom: 1px solid #E3DDD1; background: #F4F1EA;">
          <div style="display: flex; align-items: center; gap: 9px;">__CLIP__<span style="font-size: 14px; font-weight: 600;">Capture</span></div>
          __CLOSE__
        </div>

        <div style="padding: 18px 20px 0;">
          __URLLBL__
          <div style="margin-top: 8px; height: 40px; border: 1px solid #17140F; background: #FFFFFF; border-radius: 3px; display: flex; align-items: center; gap: 10px; padding: 0 12px;">
            <div style="width: 16px; height: 16px; border-radius: 2px; background: #17140F; flex-shrink: 0;"></div>
            <span class="m" style="font-size: 12.5px; color: #17140F; flex-grow: 1;">nextjs.org/docs/app/building-your-application/authentication</span>
          </div>
        </div>

        <div style="padding: 18px 20px 4px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            __PIPELBL__<div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div>
            <span class="m" style="font-size: 10px; color: #B2492A;">4 / 5</span>
          </div>
          __STEPS__
        </div>

        <div style="margin: 12px 20px 0; border: 1px solid #E3DDD1; background: #FFFFFF; border-radius: 3px; padding: 13px 14px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 9px;">__SPARK____PREVLBL__<div style="flex-grow: 1;"></div><span class="m" style="font-size: 10px; color: #9C9384;">EDITABLE</span></div>
          <div style="font-size: 14px; font-weight: 500; line-height: 1.35; color: #17140F; margin-bottom: 6px;">Authentication in the Next.js App Router</div>
          <div style="font-size: 12.5px; line-height: 1.55; color: #78705F; margin-bottom: 11px;">Covers session handling across Server Components, middleware and route handlers, with the cookies() verification rule spelled out.</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">__TAGS__</div>
        </div>

        <div style="margin-top: 18px; border-top: 1px solid #E3DDD1; background: #F4F1EA; padding: 13px 20px; display: flex; align-items: center; justify-content: space-between;">
          <span class="m" style="font-size: 10.5px; color: #78705F;">Stored in your library only. Never used for training.</span>
          <div style="display: flex; gap: 9px;">__CANCEL____SAVE__</div>
        </div>
      </div>
    </div>"""
    modal = (modal.replace("__CLIP__", ico(I_CLIP, 16, INK))
             .replace("__CLOSE__", ico(I_CLOSE, 17, MUTED))
             .replace("__URLLBL__", lbl("Address"))
             .replace("__PIPELBL__", lbl("Pipeline"))
             .replace("__STEPS__", steps)
             .replace("__SPARK__", ico(I_SPARK, 13, EMBER, "1.4"))
             .replace("__PREVLBL__", lbl("Generated record", EMBER_D))
             .replace("__TAGS__", tag("next.js") + tag("auth") + tag("app-router"))
             .replace("__CANCEL__", btn_ghost("Cancel", None, 34, 12.5))
             .replace("__SAVE__", btn_primary("Save to library", I_CHECK, height=34, font=12.5)))
    return build_main(overlay=modal)

open("Capture.dc.html", "w").write(build_capture())
print("Graph + Capture written")
