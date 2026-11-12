const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const root=process.argv[2],out=process.argv[3];
const deck=JSON.parse(fs.readFileSync(path.join(root,'project/deck.json')));
const map={'0e4e7bcb64a3e8f504876377c4c7ba17':'crate','4d692e8682b8bdf3b932af25af21c9c7':'block','f4a0cacfd76eead58601ce38ab95f4bf':'ball','c9f429aa3ecd2eee77badf8dc9666f97':'person','cc777b5f2e20dcb319e278252c3c11a8':'book-table','7a4304c08214940b92942b76374e878e':'stage','4f0657d2b9dc5bca28f4764223aaf02d':'stage-wide','49b15fd4b405074e02455a063ef689f9':'cover-bg'};
const assets=path.resolve(root,'assets');
const poly=`<script>document.querySelectorAll('x-connector').forEach(c=>{const s=c.closest('section');let svg=s.querySelector('svg.__c');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','__c');svg.setAttribute('width',1920);svg.setAttribute('height',1080);svg.style.cssText='position:absolute;left:0;top:0;pointer-events:none';s.appendChild(svg)}
const st=getComputedStyle(c),col=c.style.color||'#000',w=parseFloat(c.style.borderWidth)||2,x1=+c.getAttribute('x1'),y1=+c.getAttribute('y1'),x2=+c.getAttribute('x2'),y2=+c.getAttribute('y2');const dash=(c.getAttribute('style')||'').includes('dashed');
const L=Math.hypot(x2-x1,y2-y1)||1,ux=(x2-x1)/L,uy=(y2-y1)/L,h=4*w,head=c.getAttribute('head')!=='none';
const ln=document.createElementNS(svg.namespaceURI,'line');ln.setAttribute('x1',x1);ln.setAttribute('y1',y1);ln.setAttribute('x2',head?x2-ux*h*.8:x2);ln.setAttribute('y2',head?y2-uy*h*.8:y2);ln.setAttribute('stroke',col);ln.setAttribute('stroke-width',w);ln.setAttribute('stroke-linecap','round');if(dash)ln.setAttribute('stroke-dasharray','12 10');svg.appendChild(ln);
if(head){const p=document.createElementNS(svg.namespaceURI,'polygon');p.setAttribute('points',[x2,y2,x2-ux*h-uy*h*.5,y2-uy*h+ux*h*.5,x2-ux*h+uy*h*.5,y2-uy*h-ux*h*.5].join(' '));p.setAttribute('fill',col);svg.appendChild(p)}c.remove()});</script>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
for(const id of deck.order){let h=fs.readFileSync(path.join(root,'project/slides',id+'.html'),'utf8');
h=h.replace(/<(p|div|img|x-connector)[^>]*data-build-out[^>]*>(?:[\s\S]*?<\/\1>)?/g,m=>/^<img/.test(m)?'':(/^<(p|x-connector)/.test(m)?'':m.replace(/style="/,'style="display:none;'))).replace(/\/_blob\/([0-9a-f]{32})/g,(m,k)=>'data:image/svg+xml;base64,'+fs.readFileSync(assets+'/'+map[k]+'.svg').toString('base64')).replace(/<aside>[\s\S]*?<\/aside>/,'').replace(/<x-embed[\s\S]*?<\/x-embed>/g,'');
h=h.replace('<section ','<section data-p style="position:relative;width:1920px;height:1080px;box-sizing:border-box;overflow:hidden" ').replace(/style="position:relative;width:1920px;height:1080px;box-sizing:border-box;overflow:hidden" (id="[^"]*" (?:data-transition="[^"]*" )?)style="/,'$1style="position:relative;width:1920px;height:1080px;box-sizing:border-box;overflow:hidden;');
const page=`<!doctype html><meta charset=utf-8><link rel=stylesheet href='https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600&family=Rubik:wght@500;600&family=Assistant:wght@400;600;700'><style>body{margin:0}p,h1,h2,h3{margin:0}section *{box-sizing:border-box}</style>${h}${poly}`;
await p.setContent(page,{waitUntil:'load'});
const over=await p.evaluate(()=>{const r=[];document.querySelectorAll('section p,section h1,section h2,section h3').forEach(e=>{if(e.scrollWidth>e.clientWidth+2||e.scrollHeight>e.clientHeight+2&&e.style.height)r.push(e.textContent.trim().slice(0,30));const b=e.getBoundingClientRect();if(b.bottom>1080||b.right>1920)r.push('OUT:'+e.textContent.trim().slice(0,30))});return r});
if(over.length)console.log(id,JSON.stringify(over));
await p.screenshot({path:path.join(out,id+'.png')});}
await b.close()})();
