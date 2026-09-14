# -*- coding: utf-8 -*-
from build import *

W = 1180

def sec(title, note, inner, pad="26px 40px 34px"):
    return ('<section style="border-top: 1px solid #E3DDD1;">'
            '<div style="display: flex; align-items: baseline; gap: 14px; padding: 22px 40px 0;">'
            '<h2 style="font-size: 15px; font-weight: 600; letter-spacing: -0.005em; margin: 0;">%s</h2>'
            '<span class="m" style="font-size: 10.5px; color: #9C9384;">%s</span></div>'
            '<div style="padding: %s;">%s</div></section>' % (title, note, pad, inner))

def swatch(name, hexv, role, border=False):
    bd = "1px solid #E3DDD1" if border else "1px solid rgba(23,20,15,0.07)"
    return ('<div style="width: 128px; flex-shrink: 0;">'
            '<div style="height: 62px; background: %s; border: %s; border-radius: 3px;"></div>'
            '<div style="margin-top: 8px; font-size: 12px; font-weight: 500; color: #17140F;">%s</div>'
            '<div class="m" style="font-size: 10.5px; color: #78705F; margin-top: 2px;">%s</div>'
            '<div style="font-size: 11px; color: #9C9384; margin-top: 3px; line-height: 1.4;">%s</div></div>'
            % (hexv, bd, name, hexv, role))

def specimen(label, style, text, meta):
    return ('<div style="display: flex; align-items: baseline; gap: 26px; padding: 11px 0; '
            'border-bottom: 1px solid #EFEBE2;">'
            '<span class="m" style="font-size: 10px; letter-spacing: 0.09em; text-transform: uppercase; '
            'color: #9C9384; width: 116px; flex-shrink: 0;">%s</span>'
            '<div style="flex-grow: 1; min-width: 0; %s">%s</div>'
            '<span class="m" style="font-size: 10.5px; color: #9C9384; width: 190px; flex-shrink: 0; '
            'text-align: right;">%s</span></div>' % (label, style, text, meta))

def demo(caption, inner):
    return ('<div style="display: flex; flex-direction: column; gap: 10px;">'
            '<span class="m" style="font-size: 10px; letter-spacing: 0.09em; text-transform: uppercase; '
            'color: #9C9384;">%s</span>'
            '<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">%s</div></div>'
            % (caption, inner))

def build_system():
    head = """<div style="padding: 40px 40px 30px; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 18px;">__MARK____WM__</div>
        <h1 class="serif" style="font-size: 44px; letter-spacing: -0.016em; margin: 0 0 10px; line-height: 1.1;">Card Catalogue</h1>
        <p style="font-size: 14.5px; line-height: 1.6; color: #78705F; max-width: 54ch; text-wrap: pretty;">The design language of Contextualize: warm paper, hairline rules, and monospace for anything the machine measured. Nothing is rounded more than 4px and nothing floats unless it is genuinely above the page.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 5px; text-align: right; flex-shrink: 0;">
        <span class="m" style="font-size: 10.5px; color: #9C9384;">INSTRUMENT SERIF</span>
        <span class="m" style="font-size: 10.5px; color: #9C9384;">IBM PLEX SANS</span>
        <span class="m" style="font-size: 10.5px; color: #9C9384;">IBM PLEX MONO</span>
      </div>
    </div>""".replace("__MARK__", MARK).replace("__WM__", wordmark(21))

    pal_light = "".join([
        swatch("Paper", "#FBF9F5", "Page ground", True),
        swatch("Paper sunk", "#F4F1EA", "Rails, toolbars", True),
        swatch("Surface", "#FFFFFF", "Cards, fields", True),
        swatch("Rule", "#E3DDD1", "Hairlines", True),
        swatch("Rule firm", "#D6CEBF", "Inputs, focus", True),
    ])
    pal_ink = "".join([
        swatch("Ink", "#17140F", "Text, primary fill"),
        swatch("Ink soft", "#3D372E", "Secondary text"),
        swatch("Muted", "#78705F", "Metadata"),
        swatch("Faint", "#9C9384", "Mono labels"),
    ])
    pal_acc = "".join([
        swatch("Ember", "#B2492A", "Citations, AI"),
        swatch("Ember deep", "#8E3A21", "Hover"),
        swatch("Ember wash", "#F3E4DB", "Citation ground", True),
        swatch("Moss", "#2E6A55", "Indexed, live"),
        swatch("Gold", "#8A6A2F", "Fourth cluster"),
    ])
    palette = ('<div style="display: flex; flex-direction: column; gap: 24px;">'
               '<div><div style="margin-bottom: 12px;">%s</div><div style="display: flex; gap: 12px;">%s</div></div>'
               '<div><div style="margin-bottom: 12px;">%s</div><div style="display: flex; gap: 12px;">%s</div></div>'
               '<div><div style="margin-bottom: 12px;">%s</div><div style="display: flex; gap: 12px;">%s</div></div>'
               '</div>' % (lbl("Ground"), pal_light, lbl("Ink"), pal_ink, lbl("Accent"), pal_acc))

    typo = "".join([
        specimen("Display", 'font-family: \'Instrument Serif\', Georgia, serif; font-size: 42px; '
                 'line-height: 1.1; letter-spacing: -0.016em;', "Stop saving. Start using.", "76 / 46 / 35 / 30 / 25 px"),
        specimen("Heading", 'font-size: 20px; font-weight: 600; letter-spacing: -0.008em;',
                 "Retrieved context", "20 / 16 / 15 px &#183; 600"),
        specimen("Body", 'font-size: 15px; line-height: 1.68;',
                 "Answers are grounded in your library, and every claim carries a citation back to the passage it came from.",
                 "15 / 13.5 / 12.5 px &#183; 400"),
        specimen("Metadata", 'font-family: \'IBM Plex Mono\', monospace; font-size: 11px; color: #78705F;',
                 "CHUNK 04 &#183; &#8470;0147 &#183; 0.91 &#183; 1,247 CHUNKS", "11 / 10.5 / 10 px &#183; MONO"),
        specimen("Label", 'font-family: \'IBM Plex Mono\', monospace; font-size: 10px; letter-spacing: 0.1em; '
                 'text-transform: uppercase; color: #78705F;', "Sources &#183; Clusters &#183; Pipeline",
                 "10 px &#183; 0.1em &#183; UPPER"),
    ])

    step_rows = ('<div style="display: flex; align-items: center; gap: 11px;">'
                 '<div style="width: 17px; height: 17px; border-radius: 50%; background: #2E6A55; display: flex; '
                 'align-items: center; justify-content: center;"><svg width="10" height="10" viewBox="0 0 24 24" '
                 'fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"><path d="M5.5 12.5l4 4 9-9.5"/>'
                 '</svg></div><span style="font-size: 13px; font-weight: 500;">Done</span></div>'
                 '<div style="display: flex; align-items: center; gap: 11px;">'
                 '<div style="width: 17px; height: 17px; border-radius: 50%; border: 2px solid #E6CEC1; '
                 'border-top-color: #B2492A;"></div><span style="font-size: 13px; font-weight: 500; color: #8E3A21;">'
                 'Running</span></div>'
                 '<div style="display: flex; align-items: center; gap: 11px;">'
                 '<div style="width: 17px; height: 17px; border-radius: 50%; border: 1.5px solid #E3DDD1;"></div>'
                 '<span style="font-size: 13px; font-weight: 500; color: #9C9384;">Queued</span></div>')

    field = ('<div style="width: 280px; height: 36px; border: 1px solid #D6CEBF; background: #FFFFFF; '
             'border-radius: 3px; display: flex; align-items: center; gap: 9px; padding: 0 11px;">%s'
             '<span style="font-size: 13px; color: #9C9384;">Rest</span></div>'
             '<div style="width: 280px; height: 36px; border: 1px solid #17140F; background: #FFFFFF; '
             'border-radius: 3px; display: flex; align-items: center; gap: 9px; padding: 0 11px; '
             'box-shadow: 0 0 0 3px rgba(178,73,42,0.10);">%s'
             '<span style="font-size: 13px; color: #17140F;">Focus</span></div>'
             % (ico(I_SEARCH, 15, FAINT), ico(I_SEARCH, 15, INK)))

    comps = ('<div style="display: flex; flex-direction: column; gap: 26px;">'
             '<div style="display: flex; gap: 46px; flex-wrap: wrap;">%s%s%s</div>'
             '<div style="display: flex; gap: 46px; flex-wrap: wrap;">%s%s%s</div>'
             '<div style="display: flex; gap: 46px; flex-wrap: wrap;">%s%s</div>'
             '</div>' % (
        demo("Buttons", btn_primary("Save to library", I_CHECK, height=36, font=13)
             + btn_ghost("Open original", I_EXTERNAL, 36, 13)
             + '<div style="height: 36px; display: flex; align-items: center; gap: 7px; padding: 0 13px; '
               'border: 1px solid #EFEBE2; background: #F4F1EA; border-radius: 3px; color: #B8B0A0; '
               'font-size: 13px; font-weight: 500;">Disabled</div>'),
        demo("Chips", chip("Whole library", True) + chip("Last 30 days") + chip("Unread", count="9")),
        demo("Tags", tag("next.js") + tag("auth") + tag("server-components")),
        demo("Citation", '<span style="font-size: 15px; color: #17140F;">&#8230;verified on every read' + cite("1")
             + '</span>'),
        demo("Similarity", simbar("0.91") + simbar("0.74") + simbar("0.52")),
        demo("Status", '<div style="display: flex; align-items: center; gap: 6px; border: 1px solid #CFE0D8; '
             'background: #E0EBE5; border-radius: 12px; padding: 3px 9px;">' + livedot()
             + '<span class="m" style="font-size: 10px; letter-spacing: 0.06em; color: #2E6A55;">INDEX LIVE</span>'
               '</div>' + step_rows),
        demo("Navigation", '<div style="width: 168px;">' + nav_item("Ask", I_ASK, True)
             + nav_item("Library", I_LIBRARY, False) + '</div>'),
        demo("Field", field),
    ))

    def rule_card(title, items):
        rows = "".join('<div style="display: flex; align-items: center; justify-content: space-between; '
                       'padding: 6px 0; border-bottom: 1px solid #EFEBE2;">'
                       '<span style="font-size: 12.5px; color: #3D372E;">%s</span>'
                       '<span class="m" style="font-size: 10.5px; color: #78705F;">%s</span></div>' % (k, v)
                       for (k, v) in items)
        return ('<div style="flex: 1; min-width: 0;"><div style="margin-bottom: 10px;">%s</div>%s</div>'
                % (lbl(title), rows))

    rules = ('<div style="display: flex; gap: 40px;">%s%s%s</div>' % (
        rule_card("Geometry", [("Tag, swatch", "2px"), ("Button, card, field", "3px"),
                               ("Modal, panel", "4&#8211;5px"), ("Chip, pill", "999px"),
                               ("Hairline", "1px &#183; #E3DDD1")]),
        rule_card("Rhythm", [("Row padding", "13px / 26px"), ("Section padding", "22px / 40px"),
                             ("Control height", "26 / 32 / 36 / 46px"), ("Touch target (mobile)", "44px min"),
                             ("Icon grid", "13 / 15 / 17 / 20px")]),
        rule_card("Depth", [("Page, rails, rows", "no shadow"), ("Hover card", "0 12px 28px / 13%"),
                            ("Modal", "0 26px 64px / 30%"), ("Focus ring", "3px ember @ 10%"),
                            ("Dim backdrop", "ink @ 42%")]),
    ))

    principles = "".join(
        '<div style="flex: 1; min-width: 0; border-left: 1px solid #E3DDD1; padding: 0 22px;">'
        '<div style="font-size: 14px; font-weight: 600; margin-bottom: 7px;">%s</div>'
        '<p style="font-size: 12.5px; line-height: 1.6; color: #78705F; text-wrap: pretty;">%s</p></div>' % (t, d)
        for (t, d) in [
            ("Show the mechanism", "Chunks, similarity scores and cluster counts are visible, not hidden behind a spinner. Trust in retrieval comes from seeing what was retrieved."),
            ("Monospace means measured", "If a number came from the machine &#8212; a score, a count, a timestamp &#8212; it is set in mono. Prose stays in the sans."),
            ("Rules, not shadows", "Structure comes from hairlines and ground changes. Elevation is reserved for things genuinely floating above the page."),
            ("Admit the gaps", "The library says what it does not contain. An honest &#8220;nothing saved on this&#8221; beats a confident paragraph."),
        ])

    body = (head
            + sec("Palette", "Warm neutrals &#183; two accents sharing chroma", palette)
            + sec("Typography", "Three families, one voice", typo)
            + sec("Components", "Every control in the product", comps)
            + sec("Geometry, rhythm &amp; depth", "The numbers that keep it consistent", rules)
            + sec("Principles", "Why it looks like this",
                  '<div style="display: flex; margin-left: -22px;">%s</div>' % principles))
    return page(body, w=W, h=2040)

open("System.dc.html", "w").write(build_system())
print("System written")
