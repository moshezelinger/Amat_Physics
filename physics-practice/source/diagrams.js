/* Schematic force diagrams. Exercise data own values and directions; layout owns geometry. */
const ForceDiagrams = (() => {
  const vector = {right:[1,0], left:[-1,0], up:[0,-1], down:[0,1]};
  const opposite = {right:'left', left:'right', up:'down', down:'up'};
  const directionName = {right:'ימינה', left:'שמאלה', up:'למעלה', down:'למטה'};
  const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const force = (symbol, receiver, direction, magnitude, giver, color='force') => ({symbol,receiver,direction,magnitude,giver,color});
  const passed = (state,id) => !!state.finished || (state.done || []).includes(id);

  function model(ex, state={}) {
    if (ex.type === 'third') {
      return {kind:'pair', bodies:[ex.giver,ex.receiver], caption:'מוצגים רק כוחות האינטראקציה בין שני הגופים.', forces:[
        force('F1,2',ex.receiver,ex.direction,ex.magnitude,ex.giver),
        force('F2,1',ex.giver,passed(state,'direction') ? opposite[ex.direction] : null,passed(state,'build') ? ex.magnitude : null,ex.receiver,'opp')
      ]};
    }
    if (ex.topic === 'net') {
      if (ex.object === 'ספר') return book(ex.values[1], passed(state,'build') ? ex.values[0] : null);
      return {kind:ex.pyth?'perpendicular':'horizontal', body:ex.object, caption:ex.pyth?'הכוחות מאונכים ופועלים על אותו גוף.':'מוצגים רק הכוחות האופקיים המתוארים בשאלה.',
        forces:ex.values.map((n,i)=>force('F'+(i+1),ex.object,ex.directions[i],n,null,ex.directions[i]===ex.directions[0]?'force':'opp'))};
    }
    if (!ex.diagram) return null;
    if (ex.diagram === 'book') return book(null,ex.id==='force-5'?10:null);
    if (ex.diagram === 'pull') return {kind:'rope',body:'ארגז',caption:'מוצג כוח המשיכה של החבל על הארגז.',forces:[force('F1','ארגז','right',null,'החבל')]};
    if (ex.diagram === 'same') return {kind:'horizontal',body:'ארגז',caption:'מוצגות רק דחיפות התלמידים, שתיהן ימינה.',forces:[force('F1','ארגז','right',4,'תלמיד 1'),force('F2','ארגז','right',2,'תלמיד 2')]};
    if (ex.diagram === 'opposed') return {kind:'horizontal',body:'ארגז',caption:'שני הכוחות פועלים על אותו ארגז.',forces:[force('F1','ארגז','left',4,null),force('F2','ארגז','right',2,null,'opp')]};
    if (ex.diagram === 'friction') return {kind:'friction',body:'ארגז',caption:'מוצג רק כוח החיכוך של הרצפה על הארגז.',forces:[force('Ff','ארגז','right',null,'הרצפה','opp')]};
    return {kind:'perpendicular',body:'גוף',caption:'מוצגים כיווני הכוחות בלבד, ללא קנה מידה לגדלים.',forces:[force('F1','גוף','right',null,null),force('F2','גוף','up',null,null,'opp')]};
  }

  function book(gravity, normal) {
    return {kind:'book',body:'ספר',caption:'תרשים כוחות סכמטי על הספר. השולחן מוצג להקשר.',forces:[
      force('Fg','ספר','down',gravity,'כדור הארץ'),force('FN','ספר','up',normal,'השולחן','opp')
    ]};
  }

  function symbolHTML(symbol) {
    return symbol.startsWith('F') ? `F<sub>${escape(symbol.slice(1))}</sub>` : escape(symbol);
  }
  function symbolSVG(symbol) {
    return `F<tspan baseline-shift="sub" font-size="70%">${escape(symbol.slice(1))}</tspan>`;
  }
  function label(f, magnitude=true) {
    return symbolSVG(f.symbol)+(magnitude&&f.magnitude!=null?' = '+f.magnitude+' N':'');
  }
  function text(x,y,label) { return `<text class="force-math" x="${x}" y="${y}" text-anchor="middle" direction="ltr">${label}</text>`; }

  // Vector-based head geometry from P-ARROW. Zero is never represented by a force arrow.
  function arrow(f,x,y,length) {
    if (!f.direction || length<3) return '';
    const [ux,uy]=vector[f.direction], ex=x+ux*length, ey=y+uy*length, h=Math.min(16,length*.6);
    return `<g class="arrow ${f.color}" data-force="${escape(f.symbol)}" data-receiver="${escape(f.receiver)}" data-direction="${f.direction}"${f.magnitude==null?'':` data-magnitude="${f.magnitude}"`}><line x1="${x}" y1="${y}" x2="${ex-ux*h*.8}" y2="${ey-uy*h*.8}" stroke-width="4"/><polygon points="${ex},${ey} ${ex-ux*h-uy*h*.5},${ey-uy*h+ux*h*.5} ${ex-ux*h+uy*h*.5},${ey-uy*h-ux*h*.5}"/></g>`;
  }

  function object(name,x=200,y=150) {
    let shape;
    if (/ספר/.test(name)) shape='<rect x="-46" y="-18" width="92" height="36" rx="4"/><path d="M-40 9H43 M-33 -18V18"/>';
    else if (/שולחן/.test(name)) shape='<path d="M-65 -10H65V2H-65Z M-50 2V55 M50 2V55"/>';
    else if (/כדור הארץ/.test(name)) shape='<circle r="42"/><ellipse rx="18" ry="42"/><path d="M-40 -14H40 M-40 14H40"/>';
    else if (/כדור/.test(name)) shape='<circle r="28"/><path d="M-25 -10Q0 8 25 -10 M-5 -27Q12 0 -5 27"/>';
    else if (/קיר/.test(name)) shape='<rect x="-24" y="-48" width="48" height="96"/><path d="M-24 -24H24 M-24 0H24 M-24 24H24 M0 -48V-24 M0 0V24 M-10 -24V0 M-10 24V48"/>';
    else if (/יד/.test(name)) shape='<path d="M-24 30V-22Q-24 -32 -15 -27V-41Q-11 -50 -4 -41V-45Q1 -54 8 -45V-37Q17 -43 21 -34V-9L33 -20Q45 -21 40 -8L23 28Z"/>';
    else if (/משאית/.test(name)) shape='<path d="M-60 -28H15V23H-60Z M15 -10H43L60 9V23H15Z"/><circle cx="-35" cy="28" r="11"/><circle cx="40" cy="28" r="11"/>';
    else if (/עגלה/.test(name)) shape='<rect x="-50" y="-25" width="100" height="48" rx="4"/><circle cx="-30" cy="31" r="10"/><circle cx="30" cy="31" r="10"/>';
    else if (/סוס/.test(name)) shape='<path d="M-50 -8H18L28 -39H48L58 -20H37L30 16H-45Z M-37 16L-44 47 M-12 16L-6 47 M15 16L27 47 M-50 -6L-67 -24"/>';
    else if (/מחליק/.test(name)) shape='<circle cx="0" cy="-41" r="13"/><path d="M0 -28V12L-25 47 M0 12L25 47 M0 -12L-31 5 M0 -12L31 5 M-35 50H-14 M14 50H35"/>';
    else if (name==='גוף') shape='<circle r="17"/>';
    else shape='<rect x="-43" y="-45" width="86" height="90" rx="3"/><path d="M-43 -45L43 45 M43 -45L-43 45"/>';
    return `<g class="diagram-object" transform="translate(${x} ${y})">${shape}</g>`;
  }

  function key(forces, hideDirection=false) {
    return `<div class="force-key">${forces.map(f=>`<div><span class="force-symbol ${f.color}" dir="ltr">${symbolHTML(f.symbol)}</span><span>${escape(f.giver ? f.giver+' על ה'+f.receiver : 'כוח על ה'+f.receiver)}${hideDirection||!f.direction?'':', '+directionName[f.direction]}</span></div>`).join('')}</div>`;
  }

  function wrap(ex,body,description,height=300) {
    return `<svg class="force-svg" viewBox="0 0 400 ${height}" role="img" aria-label="${escape(description)}"><title>${escape(ex.title)}</title>${body}</svg>`;
  }

  function single(ex,m) {
    let svg='',height=300;
    if (m.kind==='book') {
      svg='<g class="diagram-object"><path d="M95 170H305V180H95Z M115 180V275 M285 180V275"/></g>'+object('ספר',200,152);
      svg+=arrow(m.forces[0],200,152,120)+text(335,252,label(m.forces[0]));
      svg+=arrow(m.forces[1],200,152,120)+text(114,58,label(m.forces[1]));
    } else if (m.kind==='perpendicular') {
      const max=Math.max(...m.forces.map(f=>f.magnitude||1)),scale=135/max;
      svg=object('גוף',145,215);
      m.forces.forEach(f=>{
        const length=(f.magnitude||1)*scale;
        svg+=arrow(f,145,215,length);
        svg+=f.direction==='up'?text(215,85,label(f)):text(f.direction==='left'?75:250,260,label(f));
      });
      // A right-angle construction mark is not another force.
      const x=m.forces[0].direction==='left'?-1:1;
      svg+=`<path class="angle-mark" d="M${145+22*x} 215v-22h${-22*x}"/>`;
    } else if (m.kind==='horizontal') {
      const max=Math.max(...m.forces.map(f=>f.magnitude)),scale=135/max;
      // A single labelled body receives every arrow, at distinct heights for legibility.
      svg=object(m.body,200,155);
      m.forces.forEach((f,i)=>{
        const y=m.forces.length===3?115+40*i:m.body==='עגלה'?140+30*i:125+60*i;
        const x=f.direction==='right'?157:243;
        svg+=arrow(f,x,y,f.magnitude*scale)+text(f.direction==='right'?320:80,y-12,label(f));
      });
    } else if (m.kind==='rope') {
      svg=object('ארגז',170,155)+'<path class="rope-line" d="M213 178H285L310 192H380"/>';
      svg+=arrow(m.forces[0],213,178,130)+text(285,148,label(m.forces[0]));
    } else if (m.kind==='friction') {
      svg=object('ארגז',190,150)+'<path class="floor-line" d="M35 196H365 M45 196l-12 12 M85 196l-12 12 M125 196l-12 12 M165 196l-12 12 M205 196l-12 12 M245 196l-12 12 M285 196l-12 12 M325 196l-12 12 M365 196l-12 12"/>';
      svg+=arrow(m.forces[0],190,195,135)+text(300,175,label(m.forces[0]));
      svg+='<g class="motion-arrow" aria-label="כיוון ההחלקה שמאלה"><path d="M270 55H115 M128 45L115 55L128 65"/></g>';
    }
    const description=m.body+': '+m.forces.map(f=>`${f.symbol}, ${f.magnitude==null?'':f.magnitude+' ניוטון, '}${directionName[f.direction]}`).join('; ');
    const scaleNote=m.kind==='horizontal'||(m.kind==='perpendicular'&&m.forces[0].magnitude!=null)?'אורכי חיצי הכוח ביחס לגדלים הנתונים.':'איור סכמטי.';
    return `<div class="single-force-diagram">${wrap(ex,svg,description,height)}${m.kind==='friction'?'<div class="motion-caption">החץ האפור מציין החלקה שמאלה.</div>':''}${key(m.forces)}<div class="diagram-caption">${m.caption} ${scaleNote}</div></div>`;
  }

  function pair(ex,m) {
    const cards=m.bodies.map((body,i)=>{
      const f=m.forces.find(f=>f.receiver===body),known=!!f.direction;
      const scalar=f.magnitude==null?symbolHTML(f.symbol)+' = ?':'|'+symbolHTML(f.symbol)+'| = '+f.magnitude+' N';
      const svg=object(body,200,150)+(known?arrow(f,200,150,125):text(200,65,'?'));
      const description=body+': '+(known?`${f.symbol} ${directionName[f.direction]}`:'כוח שצריך למצוא');
      return `<section class="force-body-card"><h4>גוף ${i+1}: ${escape(body)}</h4><div class="force-symbol ${f.color}" dir="ltr">${scalar}</div>${wrap(ex,svg,description,290)}<div class="diagram-caption">כוח של ${escape(f.giver)} על ${escape(body)}${known?', '+directionName[f.direction]:''}.</div></section>`;
    }).join('');
    return `<div class="force-pair">${cards}</div><div class="diagram-caption">${m.caption} כל חץ מוצג על הגוף שמקבל את הכוח. האיורים אינם בקנה מידה.</div>`;
  }

  function render(ex,state={}) { const m=model(ex,state); return !m?'':m.kind==='pair'?pair(ex,m):single(ex,m); }
  return {model,render,vector,opposite};
})();
if (typeof module!=='undefined') module.exports=ForceDiagrams;
