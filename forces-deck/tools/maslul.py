# Restyle deck slides to the Maslul design system (night theme)
import re,sys,os,glob
BG='#03060b';SURF='#0b141b';RAISED='#13222c';LINE='#1f4450';BORDER='#5d8794';INK='#f2fbff';MUTED='#9db0b8'
CYAN='#00d4f2';CYINK='#3fe0f8';CYSOFT='#08323d';FORCE='#e69f00';OPP='#56b4e9';NET='#2fc99a';ONVEC='#03060b'
OK='#6b93ff';BADINK='#ffa57a'
GRID=(f'background-color:{BG};background-image:linear-gradient(#3cb4ff29 1px,transparent 1px),linear-gradient(90deg,#3cb4ff29 1px,transparent 1px),'
      'linear-gradient(#3cb4ff14 1px,transparent 1px),linear-gradient(90deg,#3cb4ff14 1px,transparent 1px);background-size:100px 100px,100px 100px,20px 20px,20px 20px')
PANEL=(f'background-color:{SURF};background-image:linear-gradient(#3cb4ff29 1px,transparent 1px),linear-gradient(90deg,#3cb4ff29 1px,transparent 1px),'
      'linear-gradient(#3cb4ff14 1px,transparent 1px),linear-gradient(90deg,#3cb4ff14 1px,transparent 1px);background-size:100px 100px,100px 100px,20px 20px,20px 20px;'
      f'border:1px solid {LINE}')
HUD="'Orbitron', 'Rubik', system-ui, sans-serif"
VEC={'#1f6fd0':FORCE,'#c0392b':OPP,'#0b8a83':NET,'#0b6f6b':NET,'#0b7a74':NET}
COL={'#141b4d':INK,'#4a5280':MUTED,'#7a1d14':BADINK,'#0b3f7a':INK,'#1e2f8c':CYINK,'#2c6e22':NET,'#5a3a1e':MUTED,**VEC}
BGM={'#ffffff':SURF,'#e9ecf7':RAISED,'#e3f2fb':RAISED,'#fbe7e7':RAISED,'#e6f5f4':RAISED,'#eef2f9':RAISED,'#fff1b8':CYSOFT,'#f4c51c':INK,'#4aaae3b':OK,'#4aae3b':OK,'#1e2f8c':RAISED,'#4a5280':BORDER,**VEC}
BDM={'#b9c3e0':LINE,'#c9cfe6':LINE,'#1e2f8c':BORDER,'#f4c51c':CYAN,'#4aae3b':OK,'#141b4d':BORDER,'#2e9bd6':LINE,'#4a5280':BORDER,**VEC}
def parse(s):
    out=[]
    for d in s.split(';'):
        if ':' in d:
            k,v=d.split(':',1);out.append([k.strip(),v.strip()])
    return out
def hexrep(v,m):
    return re.sub(r'#[0-9a-fA-F]{6}\b',lambda x:m.get(x.group(0).lower(),x.group(0)),v)
def restyle(tag,style,section=False,link=False):
    d=parse(style);keys={k for k,_ in d}
    bgv=next((v.lower() for k,v in d if k in('background','background-color')),'')
    on_vec=any(c in bgv for c in VEC) and not section
    on_dark_box='#1e2f8c' in bgv
    out=[]
    for k,v in d:
        lv=v.lower()
        if section and k in('background','background-color'):out.append(['__raw',GRID]);continue
        if k in('background','background-color'):
            if 'gradient' in lv:continue
            v=hexrep(v,BGM)
        elif k=='color':
            if lv in('#ffffff','#fff'):v=ONVEC if on_vec else INK
            else:v=hexrep(v,COL)
        elif k.startswith('border'):
            if k=='border-radius':
                n=re.match(r'(\d+)px',lv)
                if n and int(n.group(1))>=100:v='9999px'
                elif n and int(n.group(1))>0:v='8px'
                elif lv.startswith('256'):v='9999px'
            elif k=='border-top' and re.match(r'8px solid',lv):v=f'1px solid {LINE}'
            elif k=='border-style' and lv=='dashed' and tag!='x-connector':v='solid'
            else:
                v=hexrep(v,BDM)
                if link and k=='border':v=re.sub(r'#[0-9a-fA-F]{6}',CYAN,v)
                v=re.sub(r'\bdashed\b','solid',v) if tag!='x-connector' else v
                # card borders: thin
                if k=='border' and LINE in v:v=re.sub(r'^\d+px',' 1px',v).strip()
        elif k=='font-family':
            if 'stix' in lv:v=HUD
        out.append([k,v])
    # HUD font: shrink a little (Orbitron is wider than STIX)
    return ';'.join(v if k=='__raw' else f'{k}:{v}' for k,v in out)
def shrink_hud(html):
    def f(m):
        s=m.group(1)
        if "Orbitron" not in s:return m.group(0)
        s=re.sub(r'font-size:\s*(\d+(?:\.\d+)?)px',lambda x:f'font-size:{round(float(x.group(1))*0.8)}px',s)
        s=re.sub(r'font-weight:\s*[67]00','font-weight:500',s)
        return f'style="{s}"'
    return re.sub(r'style="([^"]*)"',f,html)
STAGES={'7a4304c08214940b92942b76374e878e','4f0657d2b9dc5bca28f4764223aaf02d'}
def process(h):
    # stage pictures -> grid panel
    def stage(m):
        tag=m.group(0)
        if not any(s in tag for s in STAGES):return tag
        st=re.search(r'style="([^"]*)"',tag).group(1)
        pos=';'.join(f'{k}:{v}' for k,v in parse(st) if k in('position','left','top','width','height'))
        bi=re.findall(r' data-build-(?:in|out)="[^"]*"',tag)
        return f'<div{"".join(bi)} style="{pos};{PANEL}"></div>'
    h=re.sub(r'<img [^>]*>',stage,h)
    # top colour bar
    h=re.sub(r'\n\s*<div style="[^"]*linear-gradient\((?:to right|90deg)[^"]*"[^>]*>\s*</div>','',h)
    out=[];pos=0
    for m in re.finditer(r'<(\w[\w-]*)([^>]*?)style="([^"]*)"',h):
        tag=m.group(1);rest=h[m.end():m.end()+400]
        link='<a href' in rest.split('</p>')[0] and tag=='p'
        new=restyle(tag,m.group(3),section=(tag=='section'),link=link)
        out.append(h[pos:m.start(3)]+new);pos=m.end(3)
    out.append(h[pos:]);h=''.join(out)
    h=re.sub(r'<a href="([^"]*)">',r'<a href="\1" style="color:#3fe0f8">',h)
    h=shrink_hud(h)
    # headings to display-s weight
    h=re.sub(r'(<h2 style="[^"]*?)font-size:\s*6[04]px',r'\1font-size:56px',h)
    h=re.sub(r'(<h2 style="[^"]*?)font-weight:\s*700',r'\1font-weight:600',h)
    return h
if __name__=='__main__':
    for f in sys.argv[1:]:
        h=open(f,encoding='utf8').read();open(f,'w',encoding='utf8').write(process(h))
