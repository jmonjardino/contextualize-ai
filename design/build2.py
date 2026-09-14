# -*- coding: utf-8 -*-
from build import *

# ================================================================ LIBRARY
DOCS = [
    ("0147", "Server Components and the cookies() boundary", "nextjs.org/docs",
     "Any value derived from cookies() must be re-verified per read, never memoised at module scope.",
     "AI &amp; Agents", EMBER, "7", "12 Mar", False),
    ("0146", "Embedding models are not interchangeable", "pilcrow.dev",
     "Swapping text-embedding-3-small for a larger model invalidates every vector you already stored.",
     "AI &amp; Agents", EMBER, "11", "11 Mar", False),
    ("0145", "A field guide to pgvector index types", "supabase.com/docs",
     "IVFFlat trades recall for speed; HNSW costs memory but survives growth without retraining.",
     "Infrastructure", INK, "14", "09 Mar", False),
    ("0144", "Why your RAG answers are confidently wrong", "arxiv.org",
     "Retrieval quality collapses long before generation does &#8212; measure recall@k before touching prompts.",
     "AI &amp; Agents", EMBER, "22", "07 Mar", False),
    ("0143", "Type-setting long-form text on the web", "pilcrow.dev",
     "Optical margin alignment and text-wrap: pretty do more for readability than any font choice.",
     "Design", GOLD, "6", "05 Mar", False),
    ("0142", "Streaming responses without layout shift", "nextjs.org/docs",
     "Reserve the answer block&#8217;s height from the first token, or every citation reflows twice.",
     "Frontend", MOSS, "9", "03 Mar", False),
    ("0141", "Row Level Security patterns worth copying", "supabase.com/docs",
     "One policy per table per operation. Anything cleverer becomes unauditable within a month.",
     "Infrastructure", INK, "13", "01 Mar", False),
    ("0140", "The cost of a chunk", "pilcrow.dev",
     "Chunk size is a retrieval decision, not a token-budget one. 800 characters beat 2,000 in every test.",
     "AI &amp; Agents", EMBER, "8", "27 Feb", True),
]

def doc_row(no, title, domain, summary, cluster, ccol, chunks, date, hover):
    bg = "#F4F1EA" if hover else "transparent"
    actions = ""
    tail = ('<span class="m" style="font-size: 10.5px; color: #9C9384; width: 138px; flex-shrink: 0; '
            'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">%s</span>'
            '<span class="m" style="font-size: 10.5px; color: #9C9384; width: 56px; flex-shrink: 0; '
            'text-align: right;">%s</span>' % (domain, date))
    if hover:
        actions = ('<div style="display: flex; align-items: center; gap: 6px;">'
                   + btn_ghost("Ask", I_ASK, 27, 11.5) + btn_ghost("Open", I_EXTERNAL, 27, 11.5)
                   + '<div style="width: 27px; height: 27px; border: 1px solid #E3DDD1; background: #FFFFFF; '
                     'border-radius: 3px; display: flex; align-items: center; justify-content: center;">'
                   + ico(I_TRASH, 14, FAINT) + '</div></div>')
    else:
        actions = tail
    return ('<div style="display: flex; align-items: flex-start; gap: 18px; padding: 13px 26px 13px 20px; '
            'border-bottom: 1px solid #EFEBE2; background: %s;">'
            '<span class="m" style="font-size: 10.5px; color: #9C9384; width: 40px; flex-shrink: 0; padding-top: 3px;">&#8470;%s</span>'
            '<div style="flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px;">'
            '<div style="font-size: 13.5px; font-weight: 500; color: #17140F; line-height: 1.35;">%s</div>'
            '<div style="font-size: 12.5px; color: #78705F; line-height: 1.45; max-width: 620px;">%s</div></div>'
            '<div style="width: 128px; flex-shrink: 0; display: flex; align-items: center; gap: 7px; padding-top: 2px;">'
            '<span style="width: 6px; height: 6px; border-radius: 50%%; background: %s; flex-shrink: 0;"></span>'
            '<span style="font-size: 11.5px; color: #3D372E;">%s</span></div>'
            '<span class="m" style="font-size: 10.5px; color: #9C9384; width: 58px; flex-shrink: 0; padding-top: 3px;">%s ch</span>'
            '<div style="width: 244px; flex-shrink: 0; display: flex; align-items: center; justify-content: flex-end; '
            'gap: 16px; padding-top: 1px;">%s</div>'
            '</div>' % (bg, no, title, summary, ccol, cluster, chunks, actions))

def build_library():
    hdr = ('<div style="display: flex; align-items: center; gap: 18px; padding: 10px 26px 10px 20px; '
           'border-bottom: 1px solid #E3DDD1; background: #F8F5F0;">'
           '<span style="width: 40px; flex-shrink: 0;">%s</span>'
           '<span style="flex-grow: 1;">%s</span>'
           '<span style="width: 128px; flex-shrink: 0;">%s</span>'
           '<span style="width: 58px; flex-shrink: 0;">%s</span>'
           '<span style="width: 138px; flex-shrink: 0;">%s</span>'
           '<span style="width: 56px; flex-shrink: 0; text-align: right;">%s</span></div>'
           % (lbl("&#8470;"), lbl("Document"), lbl("Cluster"), lbl("Chunks"),
              lbl("Source"), lbl("Saved")))
    rows = "".join(doc_row(*d) for d in DOCS)
    toolbar = """<div style="display: flex; align-items: center; gap: 12px; padding: 15px 26px; border-bottom: 1px solid #E3DDD1;">
      <div style="flex-grow: 1; max-width: 430px; height: 34px; border: 1px solid #D6CEBF; background: #FFFFFF; border-radius: 3px; display: flex; align-items: center; gap: 9px; padding: 0 11px;">
        __SEARCH__
        <span style="font-size: 13px; color: #9C9384;">Search titles, summaries and full text&#8230;</span>
      </div>
      __F1____F2____F3__
      <div style="flex-grow: 1;"></div>
      <span class="m" style="font-size: 10.5px; color: #9C9384;">SORT</span>
      __SORT__
    </div>"""
    toolbar = (toolbar.replace("__SEARCH__", ico(I_SEARCH, 15, FAINT))
               .replace("__F1__", chip("All", True)).replace("__F2__", chip("Unread", count="9"))
               .replace("__F3__", chip("Added this week", count="14"))
               .replace("__SORT__", btn_ghost("Newest first", I_CHEV, 34, 12.5)))
    right = (btn_ghost("Export", I_EXTERNAL, 32, 12.5) + btn_primary("Capture", I_PLUS, height=32, font=12.5))
    body = ('<div style="display: flex; flex-grow: 1; min-height: 0;">' + sidebar("library")
            + '<main style="flex-grow: 1; display: flex; flex-direction: column; min-width: 0; background: #FBF9F5;">'
            + topbar("Library", "184 documents &#183; 1,247 chunks", right)
            + toolbar + hdr + rows
            + '<div style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 18px;">'
            + '<div style="width: 60px; height: 1px; background: #E3DDD1;"></div>'
            + '<span class="m" style="font-size: 10.5px; color: #9C9384;">SHOWING 8 OF 184</span>'
            + '<div style="width: 60px; height: 1px; background: #E3DDD1;"></div></div>'
            + '</main></div>')
    return page(body, h=900)

open("Library.dc.html", "w").write(build_library())

# ================================================================ DOCUMENT
PARAS = [
  ("01", False, "Every framework that renders on the server eventually has to answer the same question: who is this "
   "request for? The answer feels obvious until you notice that a Server Component does not own its own lifecycle. It "
   "can be re-rendered as part of a request it never saw begin."),
  ("02", False, "The temptation is to read the session once, at module scope, and hand it to everything below. It is "
   "the cheapest thing to write and the most expensive thing to debug, because the failure is silent and only shows up "
   "under load, when two requests happen to share a worker."),
  ("04", True, "Because a Server Component may render for a request your code did not initiate, any value derived from "
   "cookies() must be re-verified rather than memoised across renders. Treat the cookie as an assertion, not a fact: "
   "it is a claim that has to be checked against the session store on every read, including reads that feel redundant."),
  ("05", False, "The redundancy is the point. A verification you skipped is a verification an attacker gets to skip "
   "too, and the cost &#8212; a single round trip to a store you are already talking to &#8212; is smaller than almost "
   "anything else on the page."),
]

def build_document():
    prose = ""
    for cid, hl, text in PARAS:
        bg = "#FAF1EC" if hl else "transparent"
        bd = "#E6CEC1" if hl else "transparent"
        prose += ('<div style="display: flex; gap: 20px; padding: 11px 0;">'
                  '<div style="width: 34px; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; padding-top: 5px;">'
                  '<span class="m" style="font-size: 9.5px; letter-spacing: 0.06em; color: %s;">%s</span>'
                  '<div style="width: 18px; height: 1px; background: #E3DDD1;"></div></div>'
                  '<p style="flex-grow: 1; font-size: 15.5px; line-height: 1.72; color: #17140F; background: %s; '
                  'border-left: 2px solid %s; padding: 6px 12px; margin: 0; text-wrap: pretty;">%s</p></div>'
                  % (EMBER if hl else FAINT, cid, bg, bd, text))

    meta_rows = [("Source", "nextjs.org/docs"), ("Captured", "12 Mar 2026, 09:14"),
                 ("Words", "1,842"), ("Reading", "8 min"), ("Chunks", "7 &#183; 800 char"),
                 ("Vectors", "text-embedding-3-small")]
    meta = "".join(
        '<div style="display: flex; align-items: baseline; justify-content: space-between; padding: 7px 0; '
        'border-bottom: 1px solid #EFEBE2;"><span class="m" style="font-size: 10px; letter-spacing: 0.09em; '
        'text-transform: uppercase; color: #9C9384;">%s</span>'
        '<span class="m" style="font-size: 11px; color: #3D372E; text-align: right;">%s</span></div>' % (k, v)
        for (k, v) in meta_rows)

    related = "".join(
        '<div style="display: flex; align-items: flex-start; gap: 9px; padding: 9px 0; border-bottom: 1px solid #EFEBE2;">'
        '<span style="width: 6px; height: 6px; border-radius: 50%%; background: %s; margin-top: 5px; flex-shrink: 0;"></span>'
        '<div style="flex-grow: 1; min-width: 0;">'
        '<div style="font-size: 12px; font-weight: 500; line-height: 1.35; color: #17140F;">%s</div>'
        '<div style="margin-top: 3px;">%s</div></div></div>' % (c, t, simbar(s, 44))
        for (t, c, s) in [
            ("Session verification in the App Router", EMBER, "0.88"),
            ("Row Level Security patterns worth copying", INK, "0.81"),
            ("Refresh rotation without race conditions", EMBER, "0.79"),
            ("Streaming responses without layout shift", MOSS, "0.74"),
        ])

    reader = """<section style="flex-grow: 1; display: flex; flex-direction: column; min-width: 0;">
      <div style="padding: 30px 52px 0; max-width: 820px;">
        <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 15px;">
          __NO__
          <span style="color: #D6CEBF;">&#183;</span>
          <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #B2492A;"></span><span class="m" style="font-size: 10px; letter-spacing: 0.09em; text-transform: uppercase; color: #3D372E;">AI &amp; Agents</span></span>
        </div>
        <h1 class="serif" style="font-size: 35px; line-height: 1.18; letter-spacing: -0.01em; margin: 0 0 14px; color: #17140F;">Server Components and the cookies() boundary</h1>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
          <span class="m" style="font-size: 11px; color: #78705F;">nextjs.org/docs</span>
          __EXT__
        </div>
        <div style="border: 1px solid #E6CEC1; background: #FAF1EC; border-radius: 3px; padding: 14px 16px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">__SPARK____SUMLBL__</div>
          <p style="font-size: 13.5px; line-height: 1.6; color: #3D372E;">Server Components can be re-rendered for requests they did not originate, so session data read from cookies must be verified on every access instead of cached at module scope. The safest shape is a small helper called from the layout, with token rotation pushed into middleware.</p>
        </div>
      </div>
      <div style="flex-grow: 1; padding: 14px 52px 40px; max-width: 820px;">__PROSE__</div>
    </section>"""
    reader = (reader.replace("__NO__", mono("&#8470;0147", 11, FAINT))
              .replace("__EXT__", ico(I_EXTERNAL, 14, FAINT))
              .replace("__SPARK__", ico(I_SPARK, 13, EMBER, "1.4"))
              .replace("__SUMLBL__", lbl("AI summary", EMBER_D))
              .replace("__PROSE__", prose))

    rail = """<aside style="width: 322px; flex-shrink: 0; border-left: 1px solid #E3DDD1; background: #F8F5F0; display: flex; flex-direction: column;">
      <div style="padding: 16px;">__ASKBTN__</div>
      <div style="height: 1px; background: #E3DDD1;"></div>
      <div style="padding: 14px 16px 8px;">__METALBL__</div>
      <div style="padding: 0 16px 12px;">__META__</div>
      <div style="height: 1px; background: #E3DDD1;"></div>
      <div style="padding: 14px 16px 8px; display: flex; align-items: center; justify-content: space-between;">__TAGLBL__<span class="m" style="font-size: 10px; color: #9C9384;">AUTO</span></div>
      <div style="padding: 0 16px 14px; display: flex; gap: 6px; flex-wrap: wrap;">__TAGS__</div>
      <div style="height: 1px; background: #E3DDD1;"></div>
      <div style="padding: 14px 16px 8px;">__RELLBL__</div>
      <div style="padding: 0 16px 16px;">__RELATED__</div>
    </aside>"""
    rail = (rail.replace("__ASKBTN__", btn_primary("Ask about this document", I_ASK, w="100%", height=36, font=12.5))
            .replace("__METALBL__", lbl("Record"))
            .replace("__META__", meta)
            .replace("__TAGLBL__", lbl("Tags"))
            .replace("__TAGS__", tag("next.js") + tag("auth") + tag("server-components") + tag("cookies"))
            .replace("__RELLBL__", lbl("Nearest in your library"))
            .replace("__RELATED__", related))

    right = (btn_ghost("Open original", I_EXTERNAL, 32, 12.5) + btn_ghost("Tag", I_TAG, 32, 12.5)
             + btn_ghost("Remove", I_TRASH, 32, 12.5, MUTED))
    back = ('<div style="display: flex; align-items: center; gap: 7px;">%s<span style="font-size: 13px; '
            'color: #3D372E; font-weight: 500;">Library</span></div>' % ico(I_BACK, 16, INK2))
    hdr = ('<header style="height: 57px; flex-shrink: 0; border-bottom: 1px solid #E3DDD1; display: flex; '
           'align-items: center; justify-content: space-between; padding: 0 26px;">%s'
           '<div style="display: flex; align-items: center; gap: 8px;">%s</div></header>' % (back, right))
    body = ('<div style="display: flex; flex-grow: 1; min-height: 0;">' + sidebar("library")
            + '<main style="flex-grow: 1; display: flex; flex-direction: column; min-width: 0;">' + hdr
            + '<div style="flex-grow: 1; display: flex; min-height: 0;">' + reader + rail + '</div></main></div>')
    return page(body, h=900)

open("Document.dc.html", "w").write(build_document())
print("Library + Document written")
