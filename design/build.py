# -*- coding: utf-8 -*-
"""Generates the Contextualize.ai design-canvas artboards (.dc.html)."""
import io, json, os

GRAPH_FULL = open("graph_full.svgfrag").read()
GRAPH_MINI = open("graph_mini.svgfrag").read()

# ---------------------------------------------------------------- tokens
INK      = "#17140F"
INK2     = "#3D372E"
MUTED    = "#78705F"
FAINT    = "#9C9384"
PAPER    = "#FBF9F5"
PAPER2   = "#F4F1EA"
PAPER3   = "#EFEBE2"
WHITE    = "#FFFFFF"
RULE     = "#E3DDD1"
RULE2    = "#D6CEBF"
EMBER    = "#B2492A"
EMBER_D  = "#8E3A21"
EMBER_S  = "#F3E4DB"
MOSS     = "#2E6A55"
MOSS_S   = "#E0EBE5"
GOLD     = "#8A6A2F"

HELMET = """<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=Instrument+Serif:ital@0;1&amp;display=swap">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #FBF9F5; color: #17140F;
           font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
           -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    a { color: #B2492A; text-decoration: none; }
    a:hover { color: #8E3A21; }
    p { margin: 0; }
    .m { font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace; font-variant-ligatures: none; }
    .lbl { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10px;
           letter-spacing: 0.1em; text-transform: uppercase; color: #78705F; }
    .serif { font-family: 'Instrument Serif', 'Times New Roman', Georgia, serif; font-weight: 400; }
    ::-webkit-scrollbar { width: 9px; height: 9px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D6CEBF; border-radius: 9px; }
  </style>
</helmet>"""

def page(body, w=1440, h=900, bg=PAPER, overlay=""):
    return (
        '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n'
        '  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n'
        + HELMET + '\n'
        + '<div style="position: relative; width: %dpx; min-height: %dpx; background: %s; display: flex; '
          'flex-direction: column;">\n' % (w, h, bg)
        + body + overlay
        + '\n</div>\n</x-dc>\n</body>\n</html>\n'
    )

# ---------------------------------------------------------------- icons
def ico(path, size=17, color="currentColor", w="1.5", extra=""):
    return ('<svg width="%d" height="%d" viewBox="0 0 24 24" fill="none" stroke="%s" '
            'stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" '
            'style="flex-shrink: 0;">%s%s</svg>' % (size, size, color, w, path, extra))

I_ASK      = '<path d="M4.5 5.5h15v10h-9l-6 4.5v-14.5z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>'
I_LIBRARY  = '<path d="M4 4.5h4v15H4zM10 4.5h4v15h-4z"/><path d="M16.8 5.6l3.4 13.6-2.3.6L14.5 6.2z"/>'
I_GRAPH    = '<circle cx="6" cy="7" r="2.4"/><circle cx="18" cy="6" r="2"/><circle cx="12.5" cy="17.5" r="2.6"/><path d="M7.9 8.6l3.2 6.6M17 7.9l-3.2 7.1M8.2 6.4l7.9-.3"/>'
I_PLUS     = '<path d="M12 5.5v13M5.5 12h13"/>'
I_SEARCH   = '<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4l4.1 4.1"/>'
I_TUNE     = '<path d="M4 7.5h9M17.5 7.5h2.5M4 16.5h3.5M12 16.5h8"/><circle cx="15.2" cy="7.5" r="2.2"/><circle cx="9.7" cy="16.5" r="2.2"/>'
I_ARROWUP  = '<path d="M12 19V6.5M6.4 12.1L12 6.5l5.6 5.6"/>'
I_EXTERNAL = '<path d="M14 5h5v5M19.2 4.8l-7.7 7.7M17.5 13.5v5.5h-13v-13H10"/>'
I_CLOSE    = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'
I_CHECK    = '<path d="M5.2 12.6l4.4 4.4L18.8 7"/>'
I_CLIP     = '<path d="M6 4.5h12v15l-6-4.2-6 4.2z"/>'
I_CHEV     = '<path d="M9 5.5l6.5 6.5L9 18.5"/>'
I_BACK     = '<path d="M15 5.5L8.5 12l6.5 6.5"/>'
I_DOT      = '<circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/>'
I_SPARK    = '<path d="M12 4.2l1.9 5.4 5.4 1.9-5.4 1.9-1.9 5.4-1.9-5.4-5.4-1.9 5.4-1.9z"/>'
I_TAG      = '<path d="M4.5 4.5h7l8 8-7 7-8-8z"/><circle cx="8.6" cy="8.6" r="1.5"/>'
I_TRASH    = '<path d="M5 7h14M9.5 7V4.8h5V7M7 7l.9 12.2h8.2L17 7"/>'
I_CLOCK    = '<circle cx="12" cy="12" r="7.6"/><path d="M12 7.6V12l3 2"/>'

MARK = ('<svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="flex-shrink: 0;">'
        '<rect x="0.6" y="0.6" width="20.8" height="20.8" rx="3.4" stroke="#17140F" stroke-width="1.2"/>'
        '<path d="M6.2 15.2L11 6.9l4.8 6.4" stroke="#17140F" stroke-width="1" stroke-linejoin="round"/>'
        '<circle cx="6.2" cy="15.2" r="2.1" fill="#B2492A"/>'
        '<circle cx="11" cy="6.9" r="1.7" fill="#17140F"/>'
        '<circle cx="15.8" cy="13.3" r="1.7" fill="#17140F"/></svg>')

def wordmark(size=19, color=INK):
    return ('<span class="serif" style="font-size: %dpx; letter-spacing: -0.005em; color: %s; '
            'line-height: 1;">Contextualize</span>' % (size, color))

# ---------------------------------------------------------------- atoms
def lbl(text, color=MUTED, size=10, extra=""):
    return ('<span class="m" style="font-size: %dpx; letter-spacing: 0.1em; text-transform: uppercase; '
            'color: %s;%s">%s</span>' % (size, color, extra, text))

def mono(text, size=11, color=MUTED, extra=""):
    return '<span class="m" style="font-size: %dpx; color: %s;%s">%s</span>' % (size, color, extra, text)

def btn_primary(label, icon=None, w=None, height=38, font=13):
    width = ("width: %s;" % w) if w else ""
    ic = (ico(icon, 16, PAPER) + " ") if icon else ""
    return ('<div style="%s height: %dpx; display: flex; align-items: center; justify-content: center; '
            'gap: 8px; background: #17140F; color: #FBF9F5; border-radius: 3px; font-size: %dpx; '
            'font-weight: 500; letter-spacing: 0.01em; padding: 0 16px; white-space: nowrap;">%s<span>%s</span></div>'
            % (width, height, font, ic, label))

def btn_ghost(label, icon=None, height=32, font=12.5, color=INK2):
    ic = (ico(icon, 15, color) + " ") if icon else ""
    return ('<div style="height: %dpx; display: flex; align-items: center; gap: 7px; padding: 0 11px; '
            'border: 1px solid #E3DDD1; background: #FFFFFF; border-radius: 3px; color: %s; '
            'font-size: %dpx; font-weight: 500; white-space: nowrap;">%s<span>%s</span></div>' % (height, color, font, ic, label))

def chip(label, active=False, count=None):
    bg, bd, cl = (EMBER_S, "#E6CEC1", EMBER_D) if active else (WHITE, RULE, INK2)
    cnt = ('<span class="m" style="font-size: 10px; color: %s; opacity: .75;">%s</span>' % (cl, count)) if count else ""
    return ('<div style="height: 26px; display: inline-flex; align-items: center; gap: 6px; padding: 0 10px; '
            'border: 1px solid %s; background: %s; border-radius: 13px; color: %s; font-size: 12px; '
            'font-weight: 500; white-space: nowrap;"><span>%s</span>%s</div>' % (bd, bg, cl, label, cnt))

def tag(label, color=INK2):
    return ('<span class="m" style="font-size: 10px; letter-spacing: 0.04em; color: %s; '
            'border: 1px solid #E3DDD1; border-radius: 2px; padding: 2px 5px; background: #FBF9F5;">%s</span>'
            % (color, label))

def cite(n):
    return ('<sup class="m" style="font-size: 9.5px; color: #B2492A; border: 1px solid #E6CEC1; '
            'background: #F3E4DB; border-radius: 2px; padding: 1px 3px; margin: 0 1px; '
            'vertical-align: 2px; line-height: 1;">%s</sup>' % n)

def rule_h(color=RULE, m=""):
    return '<div style="height: 1px; background: %s;%s"></div>' % (color, m)

def livedot(color=MOSS):
    return ('<span style="width: 6px; height: 6px; border-radius: 50%%; background: %s; '
            'display: inline-block; flex-shrink: 0;"></span>' % color)

def simbar(value, width=64, color=EMBER):
    pct = int(round(float(value) * 100))
    return ('<div style="display: flex; align-items: center; gap: 7px;">'
            '<div style="width: %dpx; height: 3px; background: #DFD7C8; border-radius: 2px; overflow: hidden;">'
            '<div style="width: %d%%; height: 3px; background: %s;"></div></div>'
            '<span class="m" style="font-size: 10px; color: #3D372E;">%s</span></div>'
            % (width, pct, color, value))

# ---------------------------------------------------------------- sidebar
CLUSTERS = [("AI &amp; Agents", "42", EMBER), ("Frontend", "31", MOSS),
            ("Infrastructure", "18", INK), ("Design", "12", GOLD)]

def nav_item(label, icon, active=False):
    if active:
        return ('<div style="display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 11px; '
                'border-radius: 3px; background: #17140F; color: #FBF9F5; font-size: 13.5px; '
                'font-weight: 500;">%s<span>%s</span></div>' % (ico(icon, 17, PAPER), label))
    return ('<div style="display: flex; align-items: center; gap: 10px; height: 34px; padding: 0 11px; '
            'border-radius: 3px; color: #3D372E; font-size: 13.5px; font-weight: 500;">%s<span>%s</span></div>'
            % (ico(icon, 17, INK2), label))

def sidebar(active="ask"):
    cl = "".join(
        '<div style="display: flex; align-items: center; gap: 9px; height: 27px; padding: 0 11px;">'
        '<span style="width: 7px; height: 7px; border-radius: 50%%; background: %s; flex-shrink: 0;"></span>'
        '<span style="font-size: 12.5px; color: #3D372E; flex-grow: 1;">%s</span>'
        '<span class="m" style="font-size: 10.5px; color: #9C9384;">%s</span></div>' % (c, n, k)
        for (n, k, c) in CLUSTERS)
    return """<aside style="width: 232px; flex-shrink: 0; background: #F4F1EA; border-right: 1px solid #E3DDD1; display: flex; flex-direction: column;">
  <div style="height: 57px; display: flex; align-items: center; gap: 9px; padding: 0 16px; border-bottom: 1px solid #E3DDD1;">
    __MARK__
    __WORDMARK__
  </div>
  <div style="padding: 14px 12px 10px;">
    <div style="height: 38px; display: flex; align-items: center; gap: 8px; background: #17140F; color: #FBF9F5; border-radius: 3px; padding: 0 12px;">
      __PLUS__
      <span style="font-size: 13px; font-weight: 500; flex-grow: 1;">Capture</span>
      <span class="m" style="font-size: 10px; color: #9C9384; border: 1px solid #3D372E; border-radius: 2px; padding: 1px 4px;">&#8984;K</span>
    </div>
  </div>
  <nav style="display: flex; flex-direction: column; gap: 2px; padding: 2px 12px 0;">
    __NAV__
  </nav>
  <div style="margin: 20px 12px 8px; display: flex; align-items: center; justify-content: space-between; padding: 0 11px;">
    __CLLABEL__
    <span class="m" style="font-size: 10px; color: #9C9384;">AUTO</span>
  </div>
  <div style="display: flex; flex-direction: column; padding: 0 12px;">__CLUSTERS__</div>
  <div style="flex-grow: 1;"></div>
  <div style="border-top: 1px solid #E3DDD1; padding: 13px 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;">
      __IDXLABEL__
      <span style="display: flex; align-items: center; gap: 5px;">__DOT__<span class="m" style="font-size: 10px; color: #2E6A55;">LIVE</span></span>
    </div>
    <div style="height: 3px; background: #E3DDD1; border-radius: 2px; overflow: hidden;"><div style="width: 68%; height: 3px; background: #3D372E;"></div></div>
    <div style="display: flex; justify-content: space-between; margin-top: 6px;">
      <span class="m" style="font-size: 10px; color: #78705F;">184 docs &#183; 1,247 chunks</span>
    </div>
  </div>
  <div style="border-top: 1px solid #E3DDD1; height: 54px; display: flex; align-items: center; gap: 10px; padding: 0 16px;">
    <div style="width: 27px; height: 27px; border-radius: 3px; background: #17140F; color: #FBF9F5; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 600; flex-shrink: 0;">JM</div>
    <div style="flex-grow: 1; min-width: 0;">
      <div style="font-size: 12.5px; font-weight: 500; color: #17140F; line-height: 1.2;">Jo&#227;o Monjardino</div>
      <div class="m" style="font-size: 10px; color: #9C9384;">Free &#183; 184 / 500</div>
    </div>
    __TUNE__
  </div>
</aside>""" \
        .replace("__MARK__", MARK) \
        .replace("__WORDMARK__", wordmark(19)) \
        .replace("__PLUS__", ico(I_PLUS, 16, PAPER)) \
        .replace("__NAV__", "\n    ".join([
            nav_item("Ask", I_ASK, active == "ask"),
            nav_item("Library", I_LIBRARY, active == "library"),
            nav_item("Graph", I_GRAPH, active == "graph"),
        ])) \
        .replace("__CLLABEL__", lbl("Clusters")) \
        .replace("__CLUSTERS__", cl) \
        .replace("__IDXLABEL__", lbl("Index")) \
        .replace("__DOT__", livedot()) \
        .replace("__TUNE__", ico(I_TUNE, 17, FAINT))

def topbar(title, sub, right):
    return ('<header style="height: 57px; flex-shrink: 0; border-bottom: 1px solid #E3DDD1; display: flex; '
            'align-items: center; justify-content: space-between; padding: 0 26px; background: #FBF9F5;">'
            '<div style="display: flex; align-items: baseline; gap: 11px;">'
            '<span style="font-size: 15px; font-weight: 600; letter-spacing: -0.01em;">%s</span>'
            '<span class="m" style="font-size: 11px; color: #9C9384;">%s</span></div>'
            '<div style="display: flex; align-items: center; gap: 12px;">%s</div></header>' % (title, sub, right))

# ================================================================ MAIN / ASK
SOURCES = [
    ("1", "Server Components and the cookies() boundary", "nextjs.org/docs", "12 Mar", "0.91", EMBER),
    ("2", "Session verification in the App Router", "supabase.com/docs", "04 Feb", "0.87", EMBER),
    ("3", "Refresh rotation without race conditions", "pilcrow.dev", "27 Jan", "0.84", EMBER),
]

def source_card(n, title, domain, date, sim, color):
    return ('<div style="flex: 1; border: 1px solid #E3DDD1; background: #FFFFFF; border-radius: 3px; '
            'padding: 11px 12px 10px; display: flex; flex-direction: column; gap: 7px; min-width: 0;">'
            '<div style="display: flex; align-items: center; justify-content: space-between;">'
            '<span class="m" style="font-size: 10px; color: #B2492A; background: #F3E4DB; border: 1px solid #E6CEC1; '
            'border-radius: 2px; padding: 1px 4px; line-height: 1.3;">%s</span>%s</div>'
            '<div style="font-size: 12.5px; font-weight: 500; line-height: 1.35; color: #17140F;">%s</div>'
            '<div style="display: flex; align-items: center; gap: 6px; margin-top: auto;">'
            '<span class="m" style="font-size: 10px; color: #78705F;">%s</span>'
            '<span style="color: #D6CEBF;">&#183;</span>'
            '<span class="m" style="font-size: 10px; color: #9C9384;">%s</span></div></div>'
            % (n, simbar(sim, 40), title, domain, date))

def chunk_card(cid, doc, sim, quote, src, dim=False):
    op = ' opacity: 0.55;' if dim else ''
    return ('<div style="border: 1px solid #E3DDD1; background: #FFFFFF; border-radius: 3px; padding: 10px 11px;%s">'
            '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;">'
            '<span class="m" style="font-size: 9.5px; letter-spacing: 0.07em; color: #78705F;">%s &#183; %s</span>%s</div>'
            '<div style="font-size: 11.5px; line-height: 1.5; color: #3D372E; border-left: 2px solid #E3DDD1; '
            'padding-left: 9px;">%s</div>'
            '<div style="margin-top: 8px; font-size: 10.5px; color: #9C9384; white-space: nowrap; overflow: hidden; '
            'text-overflow: ellipsis;">%s</div></div>'
            % (op, cid, doc, simbar(sim, 38), quote, src))

ANSWER = (
  '<p style="margin-bottom: 15px;">Three saved pieces converge on the same rule: inside a Server Component, '
  'treat the session as untrusted on every read. The Next.js docs are the strictest &#8212; a Server Component can be '
  'rendered for a request your code did not initiate, so anything derived from <span class="m" style="font-size: 13px; '
  'background: #F4F1EA; border: 1px solid #E3DDD1; border-radius: 2px; padding: 0 4px;">cookies()</span> has to be '
  're-verified rather than memoised at module scope.' + cite("1") + '</p>'
  '<p style="margin-bottom: 15px;">Your Supabase notes agree on the rule but move the work: verification lives in a '
  '<span class="m" style="font-size: 13px; background: #F4F1EA; border: 1px solid #E3DDD1; border-radius: 2px; '
  'padding: 0 4px;">getSession()</span> helper called from the layout, paying a duplicate check to keep call sites '
  'clean.' + cite("2") + ' Only one source covers rotation &#8212; it puts the refresh in middleware so the Server '
  'Component never observes a stale token.' + cite("3") + '</p>'
  '<p style="color: #78705F; font-style: italic; border-left: 2px solid #E6CEC1; padding-left: 12px;">'
  'Nothing in your library covers what happens when a refresh fails mid-stream.</p>'
)

def build_main(overlay=""):
    right_rail_chunks = "\n".join([
        chunk_card("CHUNK 04", "&#8470;0147", "0.91",
                   "&#8230;because a Server Component may render for a request your code did not initiate, any value "
                   "derived from cookies() must be re-verified rather than memoised across&#8230;",
                   "Server Components and the cookies() boundary"),
        chunk_card("CHUNK 11", "&#8470;0092", "0.87",
                   "&#8230;we moved the check into a single getSession() helper. It runs twice per request in the worst "
                   "case, which we accepted in exchange for one place to audit&#8230;",
                   "Session verification in the App Router"),
        chunk_card("CHUNK 02", "&#8470;0203", "0.84",
                   "&#8230;rotate in middleware. By the time any React code runs, the cookie already holds a token with "
                   "a full TTL, so no component has to think about expiry&#8230;",
                   "Refresh rotation without race conditions"),
    ])
    body = """<div style="display: flex; flex-grow: 1; min-height: 0;">
__SIDEBAR__
<main style="flex-grow: 1; display: flex; flex-direction: column; min-width: 0; background: #FBF9F5;">
__TOPBAR__
  <div style="flex-grow: 1; display: flex; min-height: 0;">
    <section style="flex-grow: 1; display: flex; flex-direction: column; min-width: 0;">
      <div style="flex-grow: 1; padding: 30px 44px 8px; display: flex; flex-direction: column; gap: 26px; overflow: hidden;">

        <div style="max-width: 700px; display: flex; flex-direction: column; gap: 9px;">
          __YOULBL__
          <div class="serif" style="font-size: 25px; line-height: 1.28; color: #17140F; letter-spacing: -0.005em;">What did I save about handling auth tokens in Next.js server components?</div>
        </div>

        <div style="max-width: 700px; display: flex; gap: 14px;">
          <div style="width: 26px; height: 26px; border: 1px solid #E3DDD1; background: #FFFFFF; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">__SPARK__</div>
          <div style="flex-grow: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 10px; height: 26px;">
              __BRAINLBL__
              <span style="color: #D6CEBF;">&#183;</span>
              <span class="m" style="font-size: 10px; color: #9C9384;">5 CHUNKS &#183; 3 SOURCES &#183; 1.8s</span>
            </div>
            <div style="font-size: 15px; line-height: 1.68; color: #17140F;">__ANSWER__</div>

            <div style="margin-top: 22px; display: flex; align-items: center; gap: 10px;">
              __SRCLBL__
              <div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div>
            </div>
            <div style="margin-top: 11px; display: flex; gap: 10px;">__SOURCES__</div>

            <div style="margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap;">
              __CHIP1__
              __CHIP2__
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 14px 44px 20px; background: #FBF9F5;">
        <div style="max-width: 740px; border: 1px solid #D6CEBF; background: #FFFFFF; border-radius: 4px; overflow: hidden;">
          <div style="padding: 14px 16px 10px; font-size: 14px; color: #9C9384;">Ask your library anything&#8230;</div>
          <div style="height: 1px; background: #EFEBE2;"></div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 9px 10px 9px 12px;">
            <div style="display: flex; align-items: center; gap: 7px;">
              __SCOPE1____SCOPE2____SCOPE3__
            </div>
            <div style="display: flex; align-items: center; gap: 11px;">
              <span class="m" style="font-size: 10px; color: #9C9384;">GPT-4o &#183; TOP 5</span>
              <div style="width: 31px; height: 31px; border-radius: 3px; background: #17140F; display: flex; align-items: center; justify-content: center;">__SEND__</div>
            </div>
          </div>
        </div>
        <div style="max-width: 740px; margin-top: 9px; display: flex; justify-content: space-between;">
          <span class="m" style="font-size: 10px; color: #9C9384;">Answers are grounded in your library. Nothing else.</span>
          <span class="m" style="font-size: 10px; color: #9C9384;">&#8629; to send &#183; &#8679;&#8629; for a new line</span>
        </div>
      </div>
    </section>

    <aside style="width: 322px; flex-shrink: 0; border-left: 1px solid #E3DDD1; background: #F8F5F0; display: flex; flex-direction: column;">
      <div style="height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #E3DDD1;">
        __CTXLBL__
        <span class="m" style="font-size: 10px; color: #9C9384;">&#8805; 0.78</span>
      </div>
      <div style="padding: 13px 14px; display: flex; flex-direction: column; gap: 9px;">
        __CHUNKS__
        <div style="display: flex; align-items: center; gap: 8px; padding: 3px 2px;">
          <div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div>
          <span class="m" style="font-size: 9.5px; color: #9C9384;">2 MORE BELOW THRESHOLD</span>
          <div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div>
        </div>
      </div>
      <div style="margin-top: auto; border-top: 1px solid #E3DDD1; padding: 13px 16px 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px;">
          __NBLBL__
          <span class="m" style="font-size: 10px; color: #9C9384;">19 NODES</span>
        </div>
        <div style="border: 1px solid #E3DDD1; background: #FBF9F5; border-radius: 3px; overflow: hidden;">
          <svg width="288" height="150" viewBox="0 0 264 150" style="display: block;">__MINIGRAPH__</svg>
        </div>
      </div>
    </aside>
  </div>
</main>
</div>"""
    right = (mono("184 DOCS", 10, MUTED) + '<span style="color: #D6CEBF;">|</span>' +
             mono("1,247 CHUNKS", 10, MUTED) +
             '<div style="display: flex; align-items: center; gap: 6px; border: 1px solid #CFE0D8; background: #E0EBE5; '
             'border-radius: 12px; padding: 3px 9px;">' + livedot() +
             '<span class="m" style="font-size: 10px; letter-spacing: 0.06em; color: #2E6A55;">INDEX LIVE</span></div>')
    out = (body
        .replace("__SIDEBAR__", sidebar("ask"))
        .replace("__TOPBAR__", topbar("Ask", "grounded in 184 documents", right))
        .replace("__YOULBL__", lbl("You &#183; 14:32"))
        .replace("__SPARK__", ico(I_SPARK, 14, EMBER, "1.4"))
        .replace("__BRAINLBL__", lbl("Second Brain", INK2))
        .replace("__ANSWER__", ANSWER)
        .replace("__SRCLBL__", lbl("Sources"))
        .replace("__SOURCES__", "".join(source_card(*s) for s in SOURCES))
        .replace("__CHIP1__", chip("Show me the middleware snippet"))
        .replace("__CHIP2__", chip("What else did I save in March?"))
        .replace("__SCOPE1__", chip("Whole library", True))
        .replace("__SCOPE2__", chip("Last 30 days"))
        .replace("__SCOPE3__", chip("Cluster: Frontend"))
        .replace("__SEND__", ico(I_ARROWUP, 17, PAPER, "1.7"))
        .replace("__CTXLBL__", lbl("Retrieved context"))
        .replace("__CHUNKS__", right_rail_chunks)
        .replace("__NBLBL__", lbl("Query neighbourhood"))
        .replace("__MINIGRAPH__", GRAPH_MINI))
    return page(out, overlay=overlay)

open("Main.dc.html", "w").write(build_main())
print("Main.dc.html", os.path.getsize("Main.dc.html"))
