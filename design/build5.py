# -*- coding: utf-8 -*-
from build import *

GRAPH_FULL = open("graph_full.svgfrag").read()

# ================================================================ SIGN IN
def build_signin():
    watermark = ('<div style="position: absolute; inset: 0; overflow: hidden; opacity: 0.16;">'
                 '<svg width="1440" height="900" viewBox="80 40 1100 780" style="display: block;">'
                 + GRAPH_FULL + '</svg></div>')
    card = """<div style="position: relative; width: 404px; border: 1px solid #17140F; background: #FBF9F5; border-radius: 5px; overflow: hidden; box-shadow: 0 24px 60px rgba(23,20,15,0.10);">
      <div style="padding: 34px 34px 0; display: flex; flex-direction: column; align-items: center; text-align: center;">
        __MARK__
        <h1 class="serif" style="font-size: 30px; letter-spacing: -0.012em; margin: 18px 0 9px; line-height: 1.15;">Open your library</h1>
        <p style="font-size: 13.5px; line-height: 1.6; color: #78705F; max-width: 30ch;">184 documents and 1,247 chunks are waiting behind one click.</p>
      </div>
      <div style="padding: 26px 34px 0;">
        <div style="height: 46px; border: 1px solid #17140F; background: #17140F; border-radius: 3px; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.74 3-4.3 3-7.3z" fill="#FBF9F5"/><path d="M12 22c2.7 0 4.96-.9 6.6-2.4l-3.2-2.5c-.9.6-2.04.95-3.4.95-2.6 0-4.8-1.76-5.6-4.12H3.1v2.6A10 10 0 0 0 12 22z" fill="#C8BFAE"/><path d="M6.4 13.93a6 6 0 0 1 0-3.84v-2.6H3.1a10 10 0 0 0 0 9.04l3.3-2.6z" fill="#8E8676"/><path d="M12 5.94c1.47 0 2.78.5 3.82 1.5l2.84-2.85C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.9 5.49l3.3 2.6C7.2 7.72 9.4 5.94 12 5.94z" fill="#FBF9F5"/></svg>
          <span style="font-size: 14px; font-weight: 500; color: #FBF9F5;">Continue with Google</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin: 20px 0;">
          <div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div>
          <span class="m" style="font-size: 10px; letter-spacing: 0.1em; color: #9C9384;">THAT IS THE WHOLE FORM</span>
          <div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div>
        </div>
        <p class="m" style="font-size: 10.5px; line-height: 1.75; color: #9C9384; text-align: center;">No password to forget, no email to verify.<br>Row Level Security keeps your rows yours.</p>
      </div>
      <div style="margin-top: 26px; border-top: 1px solid #E3DDD1; background: #F4F1EA; padding: 13px 34px; display: flex; align-items: center; justify-content: space-between;">
        <span class="m" style="font-size: 10.5px; color: #78705F;">New here?</span>
        <span class="m" style="font-size: 10.5px; color: #B2492A;">Signing in creates your library</span>
      </div>
    </div>""".replace("__MARK__", MARK.replace('width="22" height="22"', 'width="34" height="34"')
                      .replace('viewBox="0 0 22 22"', 'viewBox="0 0 22 22"'))

    top = ('<div style="position: relative; height: 72px; flex-shrink: 0; display: flex; align-items: center; '
           'justify-content: space-between; padding: 0 40px;">'
           '<div style="display: flex; align-items: center; gap: 10px;">%s%s</div>'
           '<span class="m" style="font-size: 11px; color: #9C9384;">CONTEXTUALIZE.AI</span></div>'
           % (MARK, wordmark(20)))
    bottom = ('<div style="position: relative; height: 64px; flex-shrink: 0; display: flex; align-items: center; '
              'justify-content: center; gap: 18px;">'
              '<span class="m" style="font-size: 10.5px; color: #9C9384;">PRIVACY</span>'
              '<span style="color: #D6CEBF;">&#183;</span>'
              '<span class="m" style="font-size: 10.5px; color: #9C9384;">TERMS</span>'
              '<span style="color: #D6CEBF;">&#183;</span>'
              '<span class="m" style="font-size: 10.5px; color: #9C9384;">EXPORT POLICY</span></div>')
    centre = ('<div style="position: relative; flex-grow: 1; display: flex; align-items: center; '
              'justify-content: center;">%s</div>' % card)
    return page(watermark + top + centre + bottom, h=900)

open("SignIn.dc.html", "w").write(build_signin())

# ================================================================ MOBILE
def build_mobile():
    src = "".join(
        '<div style="width: 216px; flex-shrink: 0; border: 1px solid #E3DDD1; background: #FFFFFF; '
        'border-radius: 3px; padding: 11px 12px;">'
        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;">'
        '<span class="m" style="font-size: 10px; color: #B2492A; background: #F3E4DB; border: 1px solid #E6CEC1; '
        'border-radius: 2px; padding: 1px 4px;">%s</span>%s</div>'
        '<div style="font-size: 13px; font-weight: 500; line-height: 1.35; color: #17140F;">%s</div>'
        '<div class="m" style="font-size: 10px; color: #9C9384; margin-top: 7px;">%s</div></div>'
        % (n, simbar(s, 36), t, d)
        for (n, t, d, s) in [("1", "Server Components and the cookies() boundary", "nextjs.org/docs", "0.91"),
                             ("2", "Session verification in the App Router", "supabase.com/docs", "0.87"),
                             ("3", "Refresh rotation without race conditions", "pilcrow.dev", "0.84")])

    def tab(label, icon, active):
        c = INK if active else FAINT
        bar = ('<div style="width: 22px; height: 2px; background: #17140F; border-radius: 2px;"></div>'
               if active else '<div style="width: 22px; height: 2px;"></div>')
        return ('<div style="flex: 1; height: 56px; display: flex; flex-direction: column; align-items: center; '
                'justify-content: center; gap: 5px;">%s'
                '<span style="font-size: 10.5px; font-weight: 500; color: %s;">%s</span>%s</div>'
                % (ico(icon, 20, c), c, label, bar))

    body = """<div style="width: 390px; min-height: 844px; display: flex; flex-direction: column; background: #FBF9F5;">
      <div style="height: 22px; flex-shrink: 0;"></div>
      <header style="height: 52px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-bottom: 1px solid #E3DDD1;">
        <div style="display: flex; align-items: center; gap: 9px;">__MARK____WM__</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">__SEARCH__</div>
          <div style="width: 44px; height: 44px; border-radius: 3px; background: #17140F; display: flex; align-items: center; justify-content: center;">__PLUS__</div>
        </div>
      </header>

      <div style="flex-grow: 1; padding: 20px 18px 8px; display: flex; flex-direction: column; gap: 20px; min-height: 0;">
        <div style="display: flex; flex-direction: column; gap: 7px;">
          __YOU__
          <div class="serif" style="font-size: 22px; line-height: 1.28;">What did I save about handling auth tokens in Next.js server components?</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">__SPARK____BL__<span style="color: #D6CEBF;">&#183;</span><span class="m" style="font-size: 10px; color: #9C9384;">5 CHUNKS</span></div>
          <p style="font-size: 15px; line-height: 1.66; color: #17140F;">Three saved pieces converge on the same rule: inside a Server Component, treat the session as untrusted on every read.__C1__ Only one covers rotation &#8212; it puts the refresh in middleware.__C3__</p>
          <p style="font-size: 14px; line-height: 1.6; color: #78705F; font-style: italic; border-left: 2px solid #E6CEC1; padding-left: 11px;">Nothing in your library covers what happens when a refresh fails mid-stream.</p>
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 10px;">__SRCLBL__<div style="flex-grow: 1; height: 1px; background: #E3DDD1;"></div></div>
          <div style="display: flex; gap: 10px; overflow: hidden;">__SRC__</div>
        </div>
      </div>

      <div style="padding: 10px 18px 12px; border-top: 1px solid #E3DDD1; background: #FBF9F5;">
        <div style="height: 48px; border: 1px solid #D6CEBF; background: #FFFFFF; border-radius: 4px; display: flex; align-items: center; gap: 10px; padding: 0 8px 0 14px;">
          <span style="font-size: 14px; color: #9C9384; flex-grow: 1;">Ask your library&#8230;</span>
          <div style="width: 34px; height: 34px; border-radius: 3px; background: #17140F; display: flex; align-items: center; justify-content: center;">__SEND__</div>
        </div>
      </div>
      <nav style="height: 56px; flex-shrink: 0; border-top: 1px solid #E3DDD1; background: #F4F1EA; display: flex;">__TABS__</nav>
    </div>"""
    body = (body.replace("__MARK__", MARK.replace('width="22" height="22"', 'width="20" height="20"'))
            .replace("__WM__", wordmark(17)).replace("__SEARCH__", ico(I_SEARCH, 20, INK2))
            .replace("__PLUS__", ico(I_PLUS, 20, PAPER)).replace("__YOU__", lbl("You &#183; 14:32"))
            .replace("__SPARK__", ico(I_SPARK, 13, EMBER, "1.4")).replace("__BL__", lbl("Second Brain", INK2))
            .replace("__C1__", cite("1")).replace("__C3__", cite("3"))
            .replace("__SRCLBL__", lbl("Sources")).replace("__SRC__", src)
            .replace("__SEND__", ico(I_ARROWUP, 18, PAPER, "1.7"))
            .replace("__TABS__", tab("Ask", I_ASK, True) + tab("Library", I_LIBRARY, False) + tab("Graph", I_GRAPH, False)))
    return ('<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n'
            '  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n' + HELMET + '\n'
            + body + '\n</x-dc>\n</body>\n</html>\n')

open("Mobile.dc.html", "w").write(build_mobile())
print("SignIn + Mobile written")
