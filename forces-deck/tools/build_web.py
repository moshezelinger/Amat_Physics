"""Build a standalone browser player without changing the authored slides."""
from pathlib import Path
import base64
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
ASSETS = {
    '0e4e7bcb64a3e8f504876377c4c7ba17': 'crate',
    '4d692e8682b8bdf3b932af25af21c9c7': 'block',
    'f4a0cacfd76eead58601ce38ab95f4bf': 'ball',
    'c9f429aa3ecd2eee77badf8dc9666f97': 'person',
    'cc777b5f2e20dcb319e278252c3c11a8': 'book-table',
    '7a4304c08214940b92942b76374e878e': 'stage',
    '4f0657d2b9dc5bca28f4764223aaf02d': 'stage-wide',
    '49b15fd4b405074e02455a063ef689f9': 'cover-bg',
}


def asset(match):
    data = (ROOT / 'assets' / (ASSETS[match[1]] + '.svg')).read_bytes()
    return 'data:image/svg+xml;base64,' + base64.b64encode(data).decode()


def plain(text):
    return html.unescape(re.sub('<[^>]+>', '', text)).translate(
        dict.fromkeys([8235, 8236, 8206]))


def draggable(match, slide_id):
    tag, attrs = match.groups()
    if tag == 'x-connector':
        x = re.search(r'x1="([\d.]+)"', attrs)
        enabled = slide_id == 'w1-build' or (x and float(x[1]) >= 600)
    else:
        top = re.search(r'top:(\d+)px', attrs)
        left = re.search(r'left:(\d+)px', attrs)
        enabled = bool(top and left and (
            (slide_id == 'w1-build' and int(top[1]) in (580, 660, 740)) or
            (slide_id == 'w2-equation' and int(left[1]) >= 960 and
             500 <= int(top[1]) <= 720)))
    return '<' + tag + (' data-drag="true"' if enabled else '') + attrs + '>'


deck = json.loads((ROOT / 'project/deck.json').read_text())
slides = []
for slide_id in deck['order']:
    source = (ROOT / 'project/slides' / (slide_id + '.html')).read_text()
    title = plain(re.search(r'<(?:h1|h2)[^>]*>([\s\S]*?)</(?:h1|h2)>', source)[1])
    note = re.search(r'<aside>([\s\S]*?)</aside>', source)
    notes = plain(note[1]) if note else ''
    source = re.sub(r'<aside>[\s\S]*?</aside>', '', source)
    source = re.sub(r'/_blob/([0-9a-f]{32})', asset, source)
    source = source.replace('https://claude.ai/artifact/3YSQjhXKjk8EbPu2rTcWj1', '../forces-lab/')
    if slide_id.startswith('w'):
        source = re.sub(r'<(p|div|x-connector)\b([^>]*)>',
                        lambda m: draggable(m, slide_id), source)
        source = source.replace('לגרירה פתחו מצב עריכה. לביטול פעולה: Ctrl+Z.',
                                'גררו את החלקים. לביטול: Ctrl+Z. לאיפוס: התחלה מחדש.')
        notes = 'בגרסת הדפדפן גוררים ישירות בשקף. Ctrl+Z מבטל גרירה. הכפתור "התחלה מחדש" מאפס את השקף.\n\n' + notes
    steps = [int(n) for n in re.findall(r'data-build-(?:in|out)="\w+ (\d+)"', source)]
    slides.append({'id': slide_id, 'title': title, 'html': source,
                   'notes': notes, 'steps': max(steps, default=0)})

payload = json.dumps(slides, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e')
template = (ROOT / 'tools/web-player.html').read_text()
output = template.replace('<!-- SLIDE_DATA -->', payload)
(ROOT / 'index.html').write_text(output)
print(f'Built {len(slides)} slides: {ROOT / "index.html"}')
