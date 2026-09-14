# -*- coding: utf-8 -*-
from build import *

# ================================================================ LANDING
def nav(dark=False):
    c = PAPER if dark else INK
    links = "".join('<span style="font-size: 13.5px; color: %s; opacity: .78;">%s</span>' % (c, t)
                    for t in ["How it works", "What it will not do", "Pricing"])
    return ('<header style="height: 72px; flex-shrink: 0; display: flex; align-items: center; '
            'justify-content: space-between; padding: 0 56px; border-bottom: 1px solid #E3DDD1;">'
            '<div style="display: flex; align-items: center; gap: 10px;">%s%s</div>'
            '<nav style="display: flex; align-items: center; gap: 28px;">%s</nav>'
            '<div style="display: flex; align-items: center; gap: 12px;">'
            '<span style="font-size: 13.5px; color: %s; font-weight: 500;">Sign in</span>%s</div></header>'
            % (MARK, wordmark(20), links, INK, btn_primary("Add to Chrome", None, height=36, font=13)))

def hero_visual():
    src = "".join(
        '<div style="flex: 1; border: 1px solid #E3DDD1; background: #FBF9F5; border-radius: 3px; padding: 9px 10px; '
        'min-width: 0;"><div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">'
        '<span class="m" style="font-size: 9.5px; color: #B2492A; background: #F3E4DB; border: 1px solid #E6CEC1; '
        'border-radius: 2px; padding: 0 3px;">%s</span>%s</div>'
        '<div style="font-size: 11.5px; font-weight: 500; line-height: 1.3; color: #17140F;">%s</div>'
        '<div class="m" style="font-size: 9.5px; color: #9C9384; margin-top: 5px;">%s</div></div>'
        % (n, simbar(s, 30), t, d)
        for (n, t, d, s) in [("1", "Server Components and the cookies() boundary", "nextjs.org", "0.91"),
                             ("2", "Session verification in the App Router", "supabase.com", "0.87"),
                             ("3", "Refresh rotation without race conditions", "pilcrow.dev", "0.84")])
    return """<div style="width: 596px; flex-shrink: 0; border: 1px solid #17140F; border-radius: 5px; background: #FFFFFF; overflow: hidden; box-shadow: 0 22px 52px rgba(23,20,15,0.10);">
      <div style="height: 38px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; border-bottom: 1px solid #E3DDD1; background: #F4F1EA;">
        <div style="display: flex; align-items: center; gap: 7px;">__M2__<span class="m" style="font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #3D372E;">Ask</span></div>
        <span style="display: flex; align-items: center; gap: 5px;">__DOT__<span class="m" style="font-size: 9.5px; color: #2E6A55;">184 DOCS INDEXED</span></span>
      </div>
      <div style="padding: 18px 20px 20px;">
        <div class="serif" style="font-size: 19px; line-height: 1.3; color: #17140F; margin-bottom: 14px;">What did I save about handling auth tokens in Next.js server components?</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 9px;">__SPARK____BL__<span style="color: #D6CEBF;">&#183;</span><span class="m" style="font-size: 9.5px; color: #9C9384;">5 CHUNKS &#183; 1.8s</span></div>
        <p style="font-size: 13px; line-height: 1.62; color: #3D372E; margin-bottom: 16px;">Three saved pieces converge on the same rule: inside a Server Component, treat the session as untrusted on every read. Only one covers rotation &#8212; it puts the refresh in middleware.__C1____C2____C3__</p>
        <div style="display: flex; gap: 8px;">__SRC__</div>
      </div>
    </div>"""\
        .replace("__M2__", MARK.replace('width="22" height="22"', 'width="15" height="15"'))\
        .replace("__DOT__", livedot()).replace("__SPARK__", ico(I_SPARK, 12, EMBER, "1.4"))\
        .replace("__BL__", lbl("Second Brain", INK2, 9))\
        .replace("__C1__", cite("1")).replace("__C2__", cite("2")).replace("__C3__", cite("3"))\
        .replace("__SRC__", src)

def hero():
    return """<section style="display: flex; align-items: flex-start; gap: 60px; padding: 74px 56px 78px;">
      <div style="flex-grow: 1; max-width: 600px;">
        <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 26px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #B2492A;"></span>
          __EYEBROW__
        </div>
        <h1 class="serif" style="font-size: 76px; line-height: 1.02; letter-spacing: -0.022em; margin: 0 0 26px; color: #17140F;">Stop saving.<br><span style="font-style: italic; color: #B2492A;">Start using.</span></h1>
        <p style="font-size: 18px; line-height: 1.6; color: #3D372E; max-width: 48ch; margin-bottom: 15px; text-wrap: pretty;">You have read the answer already. It is in a tab you closed, an article you bookmarked, a link you sent yourself at midnight. Contextualize keeps the text, not the link &#8212; and answers from it.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #78705F; max-width: 52ch; margin-bottom: 32px;">One click saves the page. Every answer cites the pieces it came from, so you can go back and read the original.</p>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px;">
          __CTA____CTA2__
        </div>
        <div style="display: flex; align-items: center; gap: 18px;">
          <span class="m" style="font-size: 11px; color: #9C9384;">CHROME &amp; EDGE</span>
          <span style="color: #D6CEBF;">&#183;</span>
          <span class="m" style="font-size: 11px; color: #9C9384;">FREE FOR 500 DOCUMENTS</span>
          <span style="color: #D6CEBF;">&#183;</span>
          <span class="m" style="font-size: 11px; color: #9C9384;">EXPORT ANY TIME</span>
        </div>
      </div>
      __VISUAL__
    </section>"""\
        .replace("__EYEBROW__", lbl("A second brain with citations", INK2, 11))\
        .replace("__CTA__", btn_primary("Add to Chrome", I_PLUS, height=46, font=14.5))\
        .replace("__CTA2__", btn_ghost("See a live library", I_CHEV, 46, 14))\
        .replace("__VISUAL__", hero_visual())

def band_quote():
    return """<section style="background: #17140F; padding: 74px 56px;">
      <div style="max-width: 1000px;">
        __LBL__
        <p class="serif" style="font-size: 42px; line-height: 1.24; letter-spacing: -0.012em; color: #FBF9F5; margin: 20px 0 0; text-wrap: pretty;">A bookmark is a promise to your future self that you almost never keep. The article is not saved &#8212; only its address is. <span style="color: #D9663F; font-style: italic;">Contextualize saves the words.</span></p>
      </div>
    </section>""".replace("__LBL__", lbl("The problem", "#9C9384", 11))

STEPS = [
    ("01", "Capture", "Click once in the toolbar. The extension strips navigation, ads and cookie banners, keeps the readable text, and writes a title, a one-line summary and three tags.",
     "EXTENSION &#183; ~2s"),
    ("02", "Index", "The text is split into 800-character chunks and embedded as vectors. Chunks are what retrieval actually searches &#8212; smaller segments beat whole documents on precision.",
     "pgvector &#183; 1536 DIM"),
    ("03", "Ask", "Your question is embedded too, matched against your own vectors, and the closest passages are handed to the model. Every claim carries a citation back to the source.",
     "TOP-5 &#183; CITED"),
]

def step_diagram(i):
    if i == 0:
        inner = ('<rect x="10" y="14" width="52" height="38" rx="3" stroke="#D6CEBF"/>'
                 '<path d="M10 24h52" stroke="#D6CEBF"/><circle cx="16" cy="19" r="1.6" fill="#D6CEBF" stroke="none"/>'
                 '<path d="M20 32h26M20 39h32M20 46h18" stroke="#17140F"/>'
                 '<circle cx="60" cy="48" r="9" fill="#B2492A" stroke="none"/>'
                 '<path d="M56.4 48h7.2M60 44.4v7.2" stroke="#FBF9F5" stroke-width="1.6"/>')
    elif i == 1:
        inner = ('<path d="M12 20h22M12 28h22M12 36h22M12 44h22" stroke="#D6CEBF"/>'
                 '<path d="M40 32h10" stroke="#17140F"/>'
                 '<circle cx="58" cy="20" r="3.4" fill="#B2492A" stroke="none"/>'
                 '<circle cx="67" cy="30" r="2.6" fill="#B2492A" stroke="none"/>'
                 '<circle cx="56" cy="36" r="3" fill="#B2492A" stroke="none"/>'
                 '<circle cx="65" cy="45" r="2.2" fill="#B2492A" stroke="none"/>'
                 '<path d="M58 20l9 10M58 20l-2 16M56 36l9 9" stroke="#E0D6C6"/>')
    else:
        inner = ('<circle cx="18" cy="32" r="7" stroke="#17140F"/>'
                 '<path d="M25 32h12" stroke="#D6CEBF"/>'
                 '<rect x="37" y="16" width="32" height="32" rx="3" stroke="#D6CEBF"/>'
                 '<path d="M43 25h20M43 32h20M43 39h12" stroke="#17140F"/>'
                 '<rect x="60" y="36" width="9" height="9" rx="1.5" fill="#B2492A" stroke="none"/>')
    return ('<svg width="80" height="64" viewBox="0 0 80 64" fill="none" stroke-width="1.3" '
            'stroke-linecap="round">%s</svg>' % inner)

def how():
    cells = ""
    for i, (n, t, d, meta) in enumerate(STEPS):
        cells += ('<div style="flex: 1; padding: 0 34px; border-left: 1px solid #E3DDD1; min-width: 0;">'
                  '<div style="margin-bottom: 22px;">%s</div>'
                  '<div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px;">'
                  '<span class="m" style="font-size: 11px; color: #B2492A; letter-spacing: 0.08em;">%s</span>'
                  '<span class="serif" style="font-size: 27px; color: #17140F;">%s</span></div>'
                  '<p style="font-size: 14px; line-height: 1.62; color: #3D372E; margin-bottom: 14px; text-wrap: pretty;">%s</p>'
                  '<span class="m" style="font-size: 10px; letter-spacing: 0.09em; color: #9C9384;">%s</span></div>'
                  % (step_diagram(i), n, t, d, meta))
    return ('<section style="padding: 78px 56px;">'
            '<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 44px;">'
            '<h2 class="serif" style="font-size: 38px; letter-spacing: -0.012em; margin: 0;">How it works</h2>'
            '<span class="m" style="font-size: 11px; color: #9C9384;">CAPTURE &#8594; INDEX &#8594; ASK</span></div>'
            '<div style="display: flex; margin-left: -34px;">%s</div></section>' % cells)

NOTS = [
    ("No folders to maintain", "Clusters are derived from the vectors, not from a filing habit you will abandon in week three."),
    ("No summary instead of the source", "Every answer links to the passage it used. The original is one click away, always."),
    ("Nothing leaves your library", "Retrieval runs against your rows only, enforced in the database. Your text is never training data."),
]

def nots():
    cells = "".join(
        '<div style="flex: 1; border: 1px solid #E3DDD1; background: #FFFFFF; border-radius: 4px; padding: 24px 24px 26px; min-width: 0;">'
        '<div style="width: 26px; height: 26px; border: 1px solid #E3DDD1; border-radius: 50%%; display: flex; '
        'align-items: center; justify-content: center; margin-bottom: 16px;">'
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B2492A" stroke-width="1.8" '
        'stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg></div>'
        '<div style="font-size: 16px; font-weight: 600; color: #17140F; margin-bottom: 9px; letter-spacing: -0.005em;">%s</div>'
        '<p style="font-size: 13.5px; line-height: 1.6; color: #78705F; text-wrap: pretty;">%s</p></div>' % (t, d)
        for (t, d) in NOTS)
    return ('<section style="background: #F4F1EA; border-top: 1px solid #E3DDD1; border-bottom: 1px solid #E3DDD1; '
            'padding: 72px 56px;">'
            '<h2 class="serif" style="font-size: 38px; letter-spacing: -0.012em; margin: 0 0 8px;">What it will not do</h2>'
            '<p style="font-size: 15px; color: #78705F; margin-bottom: 38px;">The constraints are the product.</p>'
            '<div style="display: flex; gap: 18px;">%s</div></section>' % cells)

def built_on():
    items = "".join('<span class="m" style="font-size: 11.5px; letter-spacing: 0.06em; color: #3D372E;">%s</span>'
                    '<span style="color: #D6CEBF;">&#183;</span>' % t
                    for t in ["Next.js", "Supabase", "pgvector", "OpenAI embeddings", "Row Level Security"])
    return ('<section style="padding: 30px 56px; display: flex; align-items: center; gap: 22px; '
            'border-bottom: 1px solid #E3DDD1;">%s<span class="m" style="font-size: 11.5px; color: #3D372E;">'
            'Open schema, exportable</span>'
            '<div style="flex-grow: 1;"></div>%s</section>'
            % ('<span class="m" style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; '
               'color: #9C9384; margin-right: 8px;">Built on</span>' + items, ""))

def final_cta():
    return """<section style="padding: 84px 56px 92px; display: flex; align-items: center; justify-content: space-between; gap: 50px;">
      <div style="max-width: 560px;">
        <h2 class="serif" style="font-size: 46px; line-height: 1.14; letter-spacing: -0.016em; margin: 0 0 16px;">Your reading list is already an archive. Give it an index.</h2>
        <p style="font-size: 15px; line-height: 1.62; color: #78705F;">Install the extension, save five things you were going to read anyway, and ask it something on Friday.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: stretch; width: 268px; flex-shrink: 0;">
        __CTA__
        __CTA2__
        <span class="m" style="font-size: 10.5px; color: #9C9384; text-align: center; line-height: 1.5;">No card required.<br>Export your library whenever you like.</span>
      </div>
    </section>"""\
        .replace("__CTA__", btn_primary("Add to Chrome", I_PLUS, w="100%", height=48, font=15))\
        .replace("__CTA2__", '<div style="height: 44px; display: flex; align-items: center; justify-content: center; '
                             'border: 1px solid #D6CEBF; border-radius: 3px; font-size: 13.5px; font-weight: 500; '
                             'color: #3D372E;">Sign in with Google</div>')

def footer():
    cols = "".join(
        '<div style="display: flex; flex-direction: column; gap: 9px; min-width: 128px;">%s%s</div>'
        % (lbl(h, "#78705F"), "".join('<span style="font-size: 12.5px; color: #9C9384;">%s</span>' % i for i in items))
        for (h, items) in [("Product", ["How it works", "Extension", "Changelog"]),
                           ("Your data", ["Export", "Delete account", "Security"]),
                           ("Elsewhere", ["Docs", "Status", "Contact"])])
    return ('<footer style="border-top: 1px solid #E3DDD1; background: #F4F1EA; padding: 40px 56px 34px; '
            'display: flex; justify-content: space-between; gap: 40px;">'
            '<div style="max-width: 250px;"><div style="display: flex; align-items: center; gap: 9px; '
            'margin-bottom: 12px;">%s%s</div>'
            '<p class="m" style="font-size: 10.5px; line-height: 1.7; color: #9C9384;">[YOUR COMPANY], [CITY]<br>'
            '&#169; 2026 &#183; Privacy &#183; Terms</p></div>'
            '<div style="display: flex; gap: 56px;">%s</div></footer>' % (MARK, wordmark(18), cols))

def build_landing():
    body = nav() + hero() + band_quote() + how() + nots() + built_on() + final_cta() + footer()
    return page(body, w=1440, h=2600)

open("Landing.dc.html", "w").write(build_landing())
print("Landing written")
