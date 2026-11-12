import sys,re,json,os
sys.path.insert(0,os.path.dirname(__file__));import maslul
root=sys.argv[1]
order=json.load(open(root+'/project/deck.json'))['order']
for s in order:
    f=f'{root}/project/slides/{s}.html';h=open(f,encoding='utf8').read()
    if s=='s00-cover':
        h=re.sub(r'<img src="/_blob/49b15fd4b405074e02455a063ef689f9"[^>]*>\n?','',h)
        h=h.replace('background:#0C1238;color:#FFFFFF','background:#03060b;color:#f2fbff')
        pts=[(1210,140),(1480,300),(1720,120),(980,900),(1820,980),(860,80),(1600,760),(1100,1010),(1350,560),(1880,420)]
        stars=''.join(f'radial-gradient(circle at {x}px {y}px,#ffffffb3 1.5px,transparent 2px),' for x,y in pts)
        h=maslul.process(h)
        h=h.replace('background-image:linear-gradient(#3cb4ff29','background-image:'+stars+'linear-gradient(#3cb4ff29',1)
        h=h.replace('background-size:100px 100px,100px 100px,20px 20px,20px 20px','background-size:'+','.join(['100% 100%']*len(pts))+',100px 100px,100px 100px,20px 20px,20px 20px',1)
        h=h.replace('color:#9FB4FF','color:#3fe0f8').replace('color:#D5DCF7','color:#9db0b8').replace('font-size:116px;font-weight:700','font-size:112px;font-weight:600')
        h=h.replace("'#6FB4FF'","'#e69f00'").replace("'#B8C6FF'","'#9db0b8'").replace("'#2EE6C8'","'#2fc99a'").replace("x.fillStyle='#FFFFFF'","x.fillStyle='#f2fbff'").replace("'#CFE0FF'","'#9db0b8'")
        h=h.replace("if(glow){x.shadowColor=col;x.shadowBlur=24;}","").replace("x.font='bold 32px Arial'","x.font='500 28px Orbitron, Rubik, sans-serif'")
    else:
        h=maslul.process(h)
    open(f,'w',encoding='utf8').write(h)
