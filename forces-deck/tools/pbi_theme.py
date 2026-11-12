"""Theme the built browser player with the Power BI course design ("מגמת מידע ונתונים").

The slide sources keep their original colours. build_web.py calls apply() on the finished
player, which maps every colour to the light palette, and adds a dark option that recolours
each slide at runtime with the dark palette of the Power BI student app.
"""
import json as _j
import re

OLD_SLIDE_CSS = 'x-embed{display:block}'
OLD_SLIDE_FONTS = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600&family=Rubik:wght@500;600;700&family=Assistant:wght@400;600;700'

DATA_MAP = {
    '#03060b': '#ffffff', '#0b141b': '#f3f5f6', '#13222c': '#eaf6fc', '#1f4450': '#d5d8db', '#5d8794': '#6f6b6c',
    '#f2fbff': '#2b2829', '#9db0b8': '#5a5758', '#00d4f2': '#0b6a97', '#3fe0f8': '#0b6a97', '#08323d': '#eaf6fc',
    '#e69f00': '#a85f00', '#56b4e9': '#0072b2', '#2fc99a': '#007a5a', '#6b93ff': '#0b6a97', '#ffa57a': '#b3261e',
    '#3cb4ff14': '#ffffff00', '#3cb4ff29': '#ffffff00', '#ffffffb3': '#ffffff00',
}

def remap(html, mapping):
    def sub(m):
        h = m.group(0)
        return mapping.get(h.lower(), h)
    return re.sub(r'#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b', sub, html)


def apply(deck):
    assert OLD_SLIDE_CSS in deck and OLD_SLIDE_FONTS in deck
    d = remap(deck, DATA_MAP)
    d = d.replace("'Orbitron', 'Rubik', system-ui, sans-serif", "'Rubik', 'Heebo', system-ui, sans-serif")
    # slides keep Assistant (second font in the data-track body stack): Heebo is wider and wraps 11 fixed boxes
    d = d.replace(OLD_SLIDE_FONTS, 'https://fonts.googleapis.com/css2?family=Rubik:wght@500;600;700&family=Assistant:wght@400;600;700')
    d = d.replace(OLD_SLIDE_CSS, OLD_SLIDE_CSS + 'section{background-image:linear-gradient(#1f1d1e0a 1px,transparent 1px),linear-gradient(90deg,#1f1d1e0a 1px,transparent 1px)!important;background-size:24px 24px!important}section::after{content:"";position:absolute;top:0;left:0;right:0;height:16px;z-index:5;background:linear-gradient(to left,#25aae2 0 640px,#716d6e 640px 1280px,#ffca08 1280px)}', 1)
    d = d.replace('.primary{background:#0b6a97;color:#ffffff;border-color:#0b6a97}', '.primary{background:#ffca08;color:#1f1d1e;border-color:#ffca08}')
    d = d.replace('button,select{border:1px solid #d5d8db;border-radius:6px;background:#eaf6fc', 'button,select{border:2px solid #6f6b6c;border-radius:12px;background:#ffffff')
    d = d.replace('.toolbar{display:flex', '.toolbar{background:#f3f5f6;display:flex')
    DARK = {'#ffffff':'#0e0e0f','#f3f5f6':'#1b1b1d','#eaf6fc':'#0f2a38','#d5d8db':'#3a3a3d','#6f6b6c':'#8f8b8c','#2b2829':'#f4f2f2','#5a5758':'#bdbabb',
     '#0b6a97':'#25aae2','#a85f00':'#e69f00','#0072b2':'#56b4e9','#007a5a':'#2fc99a','#b3261e':'#ff8a80','#716d6e':'#8f8b8c','#1f1d1e0a':'#f4f2f20a'}
    import json as _j
    d = d.replace("const content=slides[index].html;", "const content=paint(slides[index].html);")
    d = d.replace("frame.srcdoc='<!doctype html>", "frame.srcdoc=paint('<!doctype html>").replace("+'</bo'+'dy></html>';update()", "+'</bo'+'dy></html>');update()")
    d = d.replace("'use strict';", "'use strict';\nconst DARK=" + _j.dumps(DARK) + ";let dark=false;try{const v=localStorage.getItem('data-theme');dark=v?v==='dark':matchMedia('(prefers-color-scheme: dark)').matches}catch(e){}\nconst paint=h=>dark?h.replace(/#[0-9a-fA-F]{8}\\b|#[0-9a-fA-F]{6}\\b/g,m=>DARK[m.toLowerCase()]||m):h;", 1)
    d = d.replace('<button id="fullscreen" type="button">מסך מלא</button></div>', '<button id="themeBtn" type="button" aria-pressed="false">ערכה כהה</button><button id="fullscreen" type="button">מסך מלא</button></div>', 1)
    d = d.replace("document.addEventListener('keydown',keys);window.addEventListener('hashchange',readHash);readHash();",
     "document.addEventListener('keydown',keys);window.addEventListener('hashchange',readHash);\nfunction setDark(v){dark=v;document.body.classList.toggle('dark',v);$('themeBtn').textContent=v?'ערכה בהירה':'ערכה כהה';$('themeBtn').setAttribute('aria-pressed',String(v));try{localStorage.setItem('data-theme',v?'dark':'light')}catch(e){}}\nsetDark(dark);$('themeBtn').onclick=()=>{setDark(!dark);if(ready)openSlide(index,step)};readHash();", 1)
    d = d.replace('</style>', 'body.dark{background:#0e0e0f;color:#f4f2f2}body.dark .toolbar{background:#1b1b1d;border-color:#3a3a3d}body.dark button,body.dark select{background:#0e0e0f;color:#f4f2f2;border-color:#8f8b8c}body.dark .primary{background:#ffca08;color:#1f1d1e;border-color:#ffca08}body.dark a,body.dark summary{color:#25aae2}body.dark details{background:#1b1b1d;border-color:#3a3a3d}body.dark #notes,body.dark .help{color:#bdbabb}body.dark iframe{background:#0e0e0f}body.dark button:focus-visible,body.dark select:focus-visible,body.dark a:focus-visible{outline-color:#ffca08}\n</style>', 1)
    assert 'paint(slides' in d and "paint('<!doctype" in d and 'themeBtn' in d and 'setDark(dark)' in d
    return d
