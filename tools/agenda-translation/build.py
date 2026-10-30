# Builds the WIRE 2026 agenda PDFs (EN check build, FR, PT) on the layout of the
# original Word agenda. The logos (header and footer) are copied from the
# original PDF; the title and table are re-set in Liberation Serif, which has
# the same metrics as Times New Roman.
#
# Usage: python3 build.py <original-EN.pdf> <out-dir>
# Needs: pymupdf (pip), node with playwright (pre-installed in the sandbox).
import html, os, subprocess, sys, tempfile
import pymupdf
from content import LANGS

FONT = '/usr/share/fonts/truetype/liberation/LiberationSerif-{}.ttf'
CSS = f"""
@font-face {{font-family: T; src: url('file://{FONT.format("Regular")}');}}
@font-face {{font-family: T; font-weight: bold; src: url('file://{FONT.format("Bold")}');}}
@font-face {{font-family: T; font-style: italic; src: url('file://{FONT.format("Italic")}');}}
@font-face {{font-family: T; font-weight: bold; font-style: italic; src: url('file://{FONT.format("BoldItalic")}');}}
@font-face {{font-family: A; src: url('file:///usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf');}}
@page {{size: 595.2pt 841.92pt; margin: 96pt 62.3pt 90pt 72.1pt;}}
html, body {{margin: 0; background: transparent;}}
body {{font-family: T; font-size: 11pt; line-height: 1.15; color: #000;}}
.head {{text-align: center; padding-top: 11pt;}}
h1 {{font-weight: bold; font-size: 19.9pt; color: #2f5496; margin: 0; line-height: 1.12;}}
.sub {{font-size: 13pt; margin: 1pt 0 0; line-height: 1.16;}}
.ag {{font-size: 13.9pt; color: #2f5496; margin: 11pt 0 0;}}
.gap {{height: 19pt;}}
table {{border-collapse: collapse; width: 100%; table-layout: fixed;}}
td {{border: 0.48pt solid #000; vertical-align: top; padding: 0.4pt 5.3pt 1.8pt;}}
col.t {{width: 70.5pt;}}
td.time {{text-align: center;}}
tr {{break-inside: avoid;}}
tr.sh td {{background: #d9d9d9; padding-bottom: 0;}}
tr.day td {{background: #b4c6e7; font-weight: bold; text-align: center; padding-bottom: 9.5pt;}}
p {{margin: 0 0 6pt;}}
p.dash, p.bul {{position: relative;}}
p.dash {{padding-left: 18pt;}}
p.dash::before {{content: '-'; font-family: A; position: absolute; left: 0;}}
p.bul {{padding-left: 36pt; font-style: italic;}}
p.bul::before {{content: '\\2022'; font-style: normal; position: absolute; left: 18pt;}}
p.desc {{font-style: italic;}}
"""


def cell(blocks):
    out = []
    for kind, val in blocks:
        if kind == 'lines':
            out.append('<p>' + '<br/>'.join(val) + '</p>')
        else:
            out.append(f'<p class="{kind}">{val}</p>')
    return ''.join(out)


def page_html(d, lang):
    rows = []
    for r in d['rows']:
        if r[0] == 'day':
            rows.append(f'<tr class="day"><td>{r[1]}</td><td>{r[2]}</td></tr>')
        else:
            t, blocks, shaded = r
            rows.append(f'<tr{" class=sh" if shaded else ""}><td class="time">{t}</td><td>{cell(blocks)}</td></tr>')
    return (f'<!doctype html><html lang="{lang.lower()}"><head><meta charset="utf-8"><style>{CSS}</style></head><body>'
            f'<div class="head"><h1>{d["title"]}</h1><p class="sub" style="margin-bottom:0">{d["place"]}</p>'
            f'<p class="sub" style="margin:0">{d["dates"]}</p><p class="ag" style="margin-bottom:0">{d["agenda"]}</p></div>'
            f'<div class="gap"></div><table><colgroup><col class="t"/><col/></colgroup>{"".join(rows)}</table></body></html>')


RENDER = """
const {chromium} = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [src, out] of JSON.parse(process.argv[2])) {
    await p.goto('file://' + src);
    await p.pdf({path: out, preferCSSPageSize: true, printBackground: true});
  }
  await b.close();
})();
"""

HEADER = pymupdf.Rect(0, 0, 595.2, 90)
FOOTER = pymupdf.Rect(0, 782, 595.2, 841.92)
META = {
    'EN': ('WIRE 2026 Nairobi – Agenda', 'en'),
    'FR': ('WIRE 2026 Nairobi – Ordre du jour', 'fr'),
    'PT': ('WIRE 2026 Nairobi – Agenda', 'pt'),
}


def main(src, outdir):
    os.makedirs(outdir, exist_ok=True)
    tmp = tempfile.mkdtemp()
    jobs = []
    for lang, d in LANGS.items():
        h = os.path.join(tmp, f'{lang}.html')
        open(h, 'w').write(page_html(d, lang))
        jobs.append([h, os.path.join(tmp, f'{lang}.body.pdf')])
    js = os.path.join(tmp, 'render.js')
    open(js, 'w').write(RENDER)
    subprocess.run(['node', js, __import__('json').dumps(jobs)], check=True)
    orig = pymupdf.open(src)
    for lang, (h, body_path) in zip(LANGS, jobs):
        body = pymupdf.open(body_path)
        out = pymupdf.open()
        for i in range(len(body)):
            pg = out.new_page(width=orig[0].rect.width, height=orig[0].rect.height)
            pg.show_pdf_page(HEADER, orig, 0, clip=HEADER)
            pg.show_pdf_page(FOOTER, orig, 0, clip=FOOTER)
            pg.show_pdf_page(pg.rect, body, i)
        title, code = META[lang]
        out.set_metadata({'title': title, 'author': 'UNODC', 'subject': 'WIRE 2026 agenda, 3-6 November 2026, Nairobi'})
        out.set_language(code)
        name = 'WIRE_2026_Nairobi_Agenda_{}{}.pdf'.format(lang, '_rebuild_check' if lang == 'EN' else '')
        out.save(os.path.join(outdir, name), garbage=4, deflate=True)
        print(name, len(out), 'pages')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
