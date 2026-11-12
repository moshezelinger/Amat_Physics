import re,json,sys,os
root=os.path.join(os.path.dirname(__file__),'../project/');sl=root+'slides/'
d=json.load(open(root+'deck.json',encoding='utf8'));o=d['order']
LAB='https://claude.ai/artifact/3YSQjhXKjk8EbPu2rTcWj1'
links={'s04-axis':1,'s05-book':2,'w1-build':2,'s06-third':3,'s07a-ball':4,'s07-ball':4,'s11-pyth':5,'s11b-angle':5,'x2-riddles':6,'x3-riddles':6}
def heb_units(h):
    # inside Hebrew (RLM-wrapped) text, join a number to its unit so bidi keeps "10N" together
    return re.sub(r'&#82(?:07|35);([^<]*?)&#82(?:07|36);',lambda m:'&#8207;'+re.sub(r'(\d) N\b',r'\1N',m.group(1))+'&#8207;',h)
n=len(o)
for k,sid in enumerate(o,1):
    f=sl+sid+'.html';h=open(f,encoding='utf8').read()
    h=re.sub(r'>\d+ / \d+</p>',f'>{k} / {n}</p>',h);h=re.sub(r'\n<p data-lab[^\n]*','',h)
    if sid in links:
        st=links[sid];pill=f'\n<p data-lab="1" style="position:absolute;left:460px;bottom:58px;width:380px;font-size:28px;font-weight:700;text-align:center;background:#FFFFFF;border:2px solid #1E2F8C;border-radius:999px;padding:2px 0;color:#1E2F8C">&#8207;<a href="{LAB}#st{st}">במעבדה: תחנה {st}</a>&#8207;</p>'
        h=re.sub(r'(<p style="position:absolute;left:128px;bottom:64px;[^\n]*</p>)',lambda m:m.group(1)+pill,h,count=1)
    body,_,rest=h.partition('<aside>');body=heb_units(body)
    body=re.sub(r'&#8207;([\s\S]*?)&#8207;',r'&#8235;\1&#8236;',body)
    h=body+('<aside>'+rest if rest else '')
    open(f,'w',encoding='utf8').write(h)
print('renumbered',n)
