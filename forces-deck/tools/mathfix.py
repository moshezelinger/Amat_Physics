import re,sys,glob,os
SUB=dict(zip('₀₁₂₃₄₅₆₇₈₉ₓᵧ','0123456789xy'))
SUP={'²':'2'}
def prop(style,name):
    m=re.search(r'(?:^|;)\s*'+re.escape(name)+r'\s*:\s*([^;]+)',style);return m.group(1).strip() if m else None
def tokens(s):
    out=[];i=0
    while i<len(s):
        c=s[i]
        if c=='F' and i+1<len(s) and s[i+1]=='⃗':out.append(('vec','F'));i+=2;continue
        if c in SUB or (c==',' and out and out[-1][0]=='sub' and i+1<len(s) and s[i+1] in SUB):
            v=SUB.get(c,',')
            if out and out[-1][0]=='sub':out[-1]=('sub',out[-1][1]+v)
            else:out.append(('sub',v))
            i+=1;continue
        if c in SUP:out.append(('sup',SUP[c]));i+=1;continue
        if out and out[-1][0]=='t':out[-1]=('t',out[-1][1]+c)
        else:out.append(('t',c))
        i+=1
    return out
def nb(t):return re.sub(r'^ +|(?<=\S) +$',lambda m:'&#160;'*len(m.group(0)),t).replace('  ',' &#160;')
def run(tok,fs,ff,fw,col):
    base=f"font-family:{ff};font-weight:{fw};color:{col};"
    k,v=tok;small=round(fs*0.6)
    if k=='t':return f'<p style="{base}font-size:{fs}px;line-height:1.2">{nb(v)}</p>'
    if k=='sub':return f'<p style="{base}font-size:{small}px;line-height:1.2">{v}</p>'
    if k=='sup':return f'<p style="align-self:flex-start;{base}font-size:{small}px;line-height:1.2">{v}</p>'
    a=max(14,round(fs*0.5))
    return (f'<div style="display:flex;flex-direction:column;align-items:center">'
            f'<p style="{base}font-size:{a}px;line-height:0.55">→</p>'
            f'<p style="{base}font-size:{fs}px;line-height:1.2">F</p></div>')
MAG=re.compile(r'^(Σ)?F⃗[₁₂]? (=|≈) [\d.]+ N$')
def build(attrs,style,math):
    if MAG.match(math):math=math.replace('⃗','')
    fs=int(re.search(r'\d+',prop(style,'font-size')).group());ff=prop(style,'font-family') or "'STIX Two Text', 'Times New Roman', serif"
    if 'STIX' not in ff:ff="'STIX Two Text', 'Times New Roman', serif"
    fw=prop(style,'font-weight') or '600';col=prop(style,'color') or '#141B4D';ta=prop(style,'text-align') or 'center'
    keep=[]
    for n in ['position','left','top','right','bottom','width','background','border','border-radius','padding']:
        v=prop(style,n)
        if v is not None:keep.append(f'{n}:{v}')
    jc={'left':'flex-start','right':'flex-end'}.get(ta,'center')
    inner=''.join(run(t,fs,ff,fw,col) for t in tokens(math))
    return f'<div{attrs}style="{";".join(keep)+';' if keep else ''}display:flex;flex-direction:row;align-items:flex-end;justify-content:{jc}">{inner}</div>'
PAT=re.compile(r'<p( [^>]*?)?style="([^"]*)">&#8206;([^<]*?)&#8206;</p>')
def fix(html):
    def rep(m):
        attrs=(m.group(1) or ' ');math=m.group(3)
        if not re.search('[⃗₀-₉ₓᵧ²]',math):return m.group(0)
        return build(attrs,m.group(2),math)
    html=PAT.sub(rep,html)
    def vecp(m):
        style,pre=m.group(1),m.group(2)
        fs=int(re.search(r'\d+',prop(style,'font-size')).group());ff=prop(style,'font-family');fw=prop(style,'font-weight') or '600';col=prop(style,'color')
        out=(f'<p style="{style}">{nb(pre)}</p>' if pre else '')+run(('vec','F'),fs,ff,fw,col)
        return out
    html=re.sub(r'<p style="([^"]*)">((?:= −)?)F⃗</p>',vecp,html)
    html=re.sub(r'(<div[^>]*?)align-items:baseline([^>]*>(?:(?!</div>).)*?→)',lambda m:m.group(1)+'align-items:flex-end'+m.group(2),html,flags=re.S)
    return html
for f in sys.argv[1:]:
    s=open(f,encoding='utf8').read();n=fix(s)
    if n!=s:open(f,'w',encoding='utf8').write(n);print('fixed',os.path.basename(f))
