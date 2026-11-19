'use strict';
const D=PhysicsContent,C=PhysicsCore,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=C.formatNumber;
const uh=u=>renderUnit(u).outerHTML;
const key='physics-practice-v1';let records={},currentId='force-1',selected=null,drag=null,suppressClick=false,solIndex=0;
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.schema===1){records=saved.records||{};if(D.exercises.some(e=>e.id===saved.current))currentId=saved.current;}}catch{}
const fresh=()=>({step:0,values:{},choices:{},done:[],marks:{},cancelled:[],axis:null,finished:false,pairGroups:{}});
let e,s,m,stage,p;let solutionFields={};
function save(){try{localStorage.setItem(key,JSON.stringify({schema:1,current:currentId,records}));}catch{$('#saved').textContent='השמירה אינה זמינה. השאירו את הדף פתוח.';}}
function refreshModel(){m=C.model(e,s);s.step=Math.min(s.step,m.stages.length-1);stage=m.stages[s.step];s.pairGroups||={};p=s.pairGroups[stage.source||'build']||=( {marks:{},cancelled:[],first:null} );}
function load(id){cleanupDrag();selected=null;currentId=id;e=D.exercises.find(x=>x.id===id);s=records[id]||(records[id]=fresh());refreshModel();render();save();}
function feedback(kind,lines){const box=$('#feedback');box.replaceChildren();box.hidden=!lines.length;box.className='message '+kind;if(kind){const b=document.createElement('strong');b.textContent=kind==='ok'?'✓ נכון':'✗ לא נכון';box.append(b);}for(const text of lines){const p=document.createElement('p');p.textContent=text;box.append(p);}}
function invalidate(index=s.step){s.done=s.done.filter(id=>m.stages.findIndex(x=>x.id===id)<index);s.finished=false;for(const source of Object.keys(s.pairGroups||{})){const sourceIndex=m.stages.findIndex(x=>x.id===source);if(index<=sourceIndex)delete s.pairGroups[source];}p.first=null;$('#diagram').innerHTML=diagram(e);$('#complete').hidden=true;$('#next').hidden=false;save();}
function targetUnit(){return stage.target||(e.type==='conversion'?'m/s':e.du||'m');}
function buildTerms(){const build=m.stages.find(x=>x.id===(stage.source||'build'));return build?.markable?C.terms(build.expr,s.values,m.fields):[];}
function inputHTML(id,sol,readonly){const f=(sol?solutionFields:m.fields)[id],v=sol?(Array.isArray(f.expected)?f.expected[0]:f.expected):s.values[id]??'';
 if(sol||readonly)return f.type==='u'?uh(v):`<span>${esc(v===''?'?':typeof v==='number'?fmt(v):v)}</span>`;
 const w=f.type==='u'?Math.max(2.2,String(v||f.expected).length*.62+.6):Math.max(2.5,String(v||'').length*.62+.6);
 return `<input class="entry ${f.type==='u'?'u':''}" data-field="${id}" aria-label="${esc(f.label)}" type="text" ${f.type==='n'?'inputmode="'+(typeof f.expected==='number'&&f.expected<0?'text':'decimal')+'"':''} autocomplete="off" spellcheck="false" placeholder="?" value="${esc(v)}" style="--fw:${w}em">`;
}
function exprHTML(expr,{sol=false,readonly=false,mark=false,reveal=Infinity}={}){
 let atomIndex=0;const atom=html=>{if(!sol)return html;atomIndex++;return `<span class="atom ${atomIndex===reveal?'fresh':''}" style="visibility:${atomIndex<=reveal?'visible':'hidden'}">${html}</span>`;};
 let termIndex=0;
 const token=(symbol)=>{const id=termIndex++,color=p.marks[id],cancelled=p.cancelled.includes(id),disabled=stage.kind!=='mark'&&stage.kind!=='cancel';return `<button class="unit-token ${color!=null?'color'+color:''} ${cancelled?'crossed':''} ${p.first===id?'picked':''}" data-term="${id}" aria-label="${esc(symbol)}, ${['ללא צבע','כתום','כחול','ירוק'][color==null?0:color+1]}${cancelled?', צומצמה':''}" ${disabled||cancelled?'disabled':''}>${uh(symbol)}</button>`;};
 const unitHTML=(symbol)=>symbol.split('/').map(part=>part.split(/[·*]/).map(x=>mark?token(x):uh(x)).join('·')).join('/');
 function nodes(items){return items.map(n=>{
  if(n.text!=null)return atom(/^(km|h|s|m)$/.test(n.text)?unitHTML(n.text):`<span>${esc(n.text)}</span>`);
  if(n.variable)return atom(`<var>${esc(n.variable)}</var>`);
  if(n.field)return atom(inputHTML(n.field,sol,readonly));
  if(n.quantity){const a=n.quantity[0],u=n.quantity[1],symbol=u.field?(s.values[u.field]??''):u.text;return `<span class="quantity">${nodes([a])}${mark?unitHTML(symbol):nodes([u])}</span>`;}
  if(n.frac)return `<span class="fraction"><span>${nodes(n.frac[0])}</span><span>${nodes(n.frac[1])}</span></span>`;
  if(n.power)return `<span class="power"><span>(${nodes(n.power)})</span>${atom('<sup>2</sup>')}</span>`;
  if(n.root)return `<span class="root">${atom('<span class="radical" role="img" aria-label="שורש"><svg viewBox="0 0 24 50" preserveAspectRatio="none" aria-hidden="true"><path d="M1 28 L6 25 L12 45 L21 1 L24 1" fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg></span>')}<span class="root-body">${nodes(n.root)}</span></span>`;
  return '';
 }).join('');}
 return `<div class="math-scroll"><div class="equation math">${nodes(expr)}</div></div>`;
}
function formulaHTML(type){const f=(n,d)=>`<span class="fraction"><span><var>${n}</var></span><span><var>${d}</var></span></span>`;return `<span class="math">${{v:`<var>v</var> = ${f('d','t')}`,d:'<var>d</var> = <var>v</var> × <var>t</var>',t:`<var>t</var> = ${f('d','v')}`,sum:'<var>ΣF</var> = <var>F₁</var> + <var>F₂</var>'+((e.values?.length||0)>2?' + <var>F₃</var>':''),product:'<var>F₁</var> × <var>F₂</var>',pyth:'<var>|ΣF|</var> = √(<var>F₁</var>² + <var>F₂</var>²)'}[type]}</span>`;}
function optionHTML(option){return option?.formula?formulaHTML(option.formula):option;}
function render(){refreshModel();const topic=D.topics.find(t=>t.id===e.topic),list=D.exercises.filter(x=>x.topic===e.topic),index=list.indexOf(e);
 $('#topics').innerHTML=D.topics.map(t=>`<button data-topic="${t.id}" aria-pressed="${t.id===e.topic}">${t.name}</button>`).join('');
 $('#exercise').innerHTML=list.map((x,i)=>`<option value="${x.id}" ${x.id===e.id?'selected':''}>${i+1}. ${x.title}${records[x.id]?.finished?' ✓':''}</option>`).join('');
 $('#exercise-dots').innerHTML=list.map((x,i)=>`<button data-exercise="${x.id}" aria-current="${x.id===e.id}" class="${records[x.id]?.finished?'done':''}" aria-label="תרגיל ${i+1}: ${esc(x.title)}${records[x.id]?.finished?', הושלם':''}">${i+1}${records[x.id]?.finished?' ✓':''}</button>`).join('');
 $('#total').textContent=`${D.exercises.filter(x=>records[x.id]?.finished).length} מתוך 32 הושלמו`;
 $('#title').textContent=e.title;$('#level').textContent=index<2?'מתחילים בהכוונה':index<5?'ממשיכים לתרגל':'מיישמים בהקשר חדש';$('#count').textContent=`${index+1} מתוך 8`;
 $('#task').innerHTML=formatTask(e.text);
 $('#diagram').innerHTML=diagram(e);$('#axis-note').hidden=e.type!=='net'||s.axis==null;$('#axis-note').textContent=e.type==='net'&&s.axis!=null?'בחרתם: '+m.stages.find(x=>x.id==='axis').options[s.axis]+' חיובי':'';
 $('#progress').innerHTML=m.stages.map((x,i)=>`<li class="${i===s.step?'current':s.done.includes(x.id)?'done':''}" ${i===s.step?'aria-current="step"':''}>${i+1}. ${shortTitle(x)}</li>`).join('');
 $('#instruction').textContent=stage.title;$('#choice').innerHTML='';$('#work').innerHTML='';$('#hint-text').hidden=true;feedback('',[]);$('#complete').hidden=!(s.finished&&s.step===m.stages.length-1);
 if(stage.kind==='choice'||stage.kind==='axis'){
  const selectedIndex=stage.kind==='axis'?s.axis:s.choices[stage.id];
  $('#choice').innerHTML=(stage.q?`<p style="margin:0 0 4px">${esc(stage.q)}</p>`:'')+stage.options.map((x,i)=>`<button data-option="${i}" class="${selectedIndex===i?(stage.kind==='axis'||i===stage.a?'chosen':'wrong'):''}" aria-pressed="${selectedIndex===i}">${optionHTML(x)}</button>`).join('');
 }else{
  const build=m.stages.find(x=>x.id===(stage.source||'build'));
  if(stage.kind==='mark'||stage.kind==='cancel')$('#work').innerHTML=exprHTML(build.expr,{readonly:true,mark:true});
  else if(stage.expr){
   const previous=m.stages.filter((x,i)=>x.expr&&i<s.step&&!x.id.startsWith('time')&&x.id!=='half');
   $('#work').innerHTML=previous.map(x=>`<div class="equation-row">${exprHTML(x.expr,{readonly:true,mark:!!x.markable})}</div>`).join('')+`<div class="equation-row">${exprHTML(stage.expr)}</div>`;
  }
 }
 $('#bank-wrap').hidden=!stage.fields?.length;renderBank();$('#back').disabled=s.step===0;$('#next').hidden=s.finished&&s.step===m.stages.length-1;$('#next').textContent=stage.kind==='mark'?'בדיקת הסימון והמשך':stage.kind==='cancel'?'המשך לחישוב':stage.kind==='choice'||stage.kind==='axis'?'המשך':'בדיקה והמשך';
 $('#next-exercise').textContent=index===7?'לנושא הבא':'לתרגיל הבא';
}
function formatTask(text){
 const value='[0-9][0-9,.]*',u='(?:km/h|km/s|m/s|km|day|m|N|s|h)';
 const re=new RegExp('(?:'+value+'\\s+'+u+'\\s*=\\s*'+value+'\\s+'+u+'|[vdt]\\s*=\\s*'+value+'\\s+'+u+'|'+value+'\\s+'+u+'|km/s|m/s|km/h)(?=[., \u05d0-\u05ea]|$)','g');
 return esc(text).replace(re,x=>'<bdi class="math" style="font-size:1em">'+x+'</bdi>');
}
function shortTitle(x){return ({known:'מבוקש',data:'נתונים',body:'זיהוי',axis:'כיוון חיובי',relation:'קשר',time:'המרת זמן','time-mark':'סימון זמן','time-cancel':'צמצום זמן','time-result':'זמן בשניות',half:'כיוון אחד',build:'הצבה',mark:'סימון',cancel:'צמצום',squares:'ריבועים',sum:'חיבור',calc:'חישוב',direction:'כיוון',interpret:'פירוש',check:'בקרה',q0:'זיהוי',q1:'הבנה'})[x.id]||x.title;}
function renderBank(){if(!stage.fields?.length){$('#bank').innerHTML='';return;}
 refreshModel();const items=C.bank(e,s,stage.id);
 $('#bank').innerHTML=items.map((t,i)=>`<button class="tile ${selected?.v===t.v&&selected?.type===t.type?'selected':''}" data-token="${i}" data-type="${t.type}" data-value="${esc(t.v)}" aria-label="${t.type==='u'?'יחידה':'מספר'} ${esc(t.v)}" aria-pressed="${selected?.v===t.v&&selected?.type===t.type}">${t.type==='u'?uh(t.v):fmt(Number(t.v))}</button>`).join('');
}
function validate(){
 if(stage.kind==='axis'){if(s.axis==null){feedback('no',['בחרו כיוון חיובי. הוא יקבע את סימני הכוחות.']);return false;}return true;}
 if(stage.kind==='choice'){const i=s.choices[stage.id];if(i==null){feedback('no',['בחרו תשובה לפני שממשיכים.']);return false;}if(i!==stage.a){feedback('no',[stage.feedback[i]]);return false;}return true;}
 if(stage.kind==='mark'){const err=C.colorError(buildTerms(),p.marks,targetUnit());if(err){feedback('no',[err]);return false;}return true;}
 if(stage.kind==='cancel'){if(p.cancelled.length!==buildTerms().filter(t=>p.marks[t.id]!=null).length){feedback('no',['בחרו כל זוג שסימנתם כדי לצמצם אותו.']);return false;}return true;}
 refreshModel();for(const id of stage.fields||[]){const field=m.fields[id],err=C.fieldError(field,s.values[id]);if(err){const el=$(`[data-field="${id}"]`);el.classList.add('bad');el.focus();feedback('no',[err]);return false;}}
 return true;
}
function next(){if(!validate())return;if(!s.done.includes(stage.id))s.done.push(stage.id);if(s.step===m.stages.length-1){s.finished=true;render();feedback('ok',['השלמתם דרך פתרון ובדקתם את משמעות התוצאה.']);}else{s.step++;selected=null;render();$('#instruction').scrollIntoView({block:'nearest'});}save();}
function setValue(el,value){if(!el)return;const id=el.dataset.field;if(!id)return;s.values[id]=value;invalidate();el.value=value;el.classList.remove('bad');el.style.setProperty('--fw',Math.max(2.5,value.length*.62+.6)+'em');feedback('',[]);selected=null;renderBank();}
function place(el,t){if(!el||!t)return;const type=m.fields[el.dataset.field]?.type;if(type!==t.type){feedback('no',[type==='u'?'כאן מציבים יחידת מידה.':'כאן מציבים מספר.']);return;}setValue(el,t.v);el.focus();}
$('#next').onclick=next;$('#back').onclick=()=>{if(s.step){s.step--;selected=null;p.first=null;render();save();}};
$('#choice').onclick=ev=>{const b=ev.target.closest('[data-option]');if(!b)return;const i=Number(b.dataset.option);invalidate();if(stage.kind==='axis'){s.axis=i;render();feedback('',[]);}else{s.choices[stage.id]=i;$$('#choice button').forEach(x=>{x.classList.remove('chosen','wrong');x.setAttribute('aria-pressed',String(x===b));});b.classList.add(i===stage.a?'chosen':'wrong');feedback(i===stage.a?'ok':'no',[stage.feedback[i]]);save();}};
$('#topics').onclick=ev=>{const b=ev.target.closest('[data-topic]');if(b)load(D.exercises.find(x=>x.topic===b.dataset.topic).id);};
$('#exercise-dots').onclick=ev=>{const b=ev.target.closest('[data-exercise]');if(b)load(b.dataset.exercise);};$('#exercise').onchange=ev=>load(ev.target.value);
$('#reset').onclick=()=>{cleanupDrag();records[e.id]=fresh();load(e.id);};
$('#next-exercise').onclick=()=>{load(D.exercises[(D.exercises.indexOf(e)+1)%D.exercises.length].id);$('#title').scrollIntoView({block:'start'});};
document.addEventListener('input',ev=>{if(ev.target.matches('.entry'))setValue(ev.target,ev.target.value);});
document.addEventListener('focusout',ev=>{const el=ev.target;if(el.matches('.entry.u')){const v=C.unit(el.value);if(v!==el.value)setValue(el,v);}});
document.addEventListener('click',ev=>{if(suppressClick)return;const tile=ev.target.closest('.tile');if(tile){selected={type:tile.dataset.type,v:tile.dataset.value};renderBank();$('#bank .selected')?.focus();return;}const input=ev.target.closest('.entry');if(input&&selected)place(input,selected);});
function cleanupDrag(){drag?.ghost?.remove();if(drag){try{drag.b.releasePointerCapture(drag.pointerId);}catch{}}drag=null;}
document.addEventListener('dragstart',ev=>{if(ev.target.closest('.tile'))ev.preventDefault();});
document.addEventListener('pointerdown',ev=>{const b=ev.target.closest('.tile');if(!b||ev.button!==0)return;cleanupDrag();drag={b,pointerId:ev.pointerId,x:ev.clientX,y:ev.clientY,t:{type:b.dataset.type,v:b.dataset.value},ghost:null};try{b.setPointerCapture(ev.pointerId);}catch{}});
document.addEventListener('pointermove',ev=>{if(!drag||ev.pointerId!==drag.pointerId)return;if(!drag.ghost&&Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y)>8){drag.ghost=document.createElement('div');drag.ghost.className='ghost';drag.ghost.innerHTML=drag.t.type==='u'?uh(drag.t.v):esc(drag.t.v);document.body.append(drag.ghost);}if(drag.ghost){drag.ghost.style.left=ev.clientX+'px';drag.ghost.style.top=ev.clientY+'px';}});
document.addEventListener('pointerup',ev=>{if(!drag||ev.pointerId!==drag.pointerId)return;const d=drag,wasDragging=!!d.ghost;cleanupDrag();if(wasDragging){suppressClick=true;setTimeout(()=>suppressClick=false,0);place(document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.entry'),d.t);}});
document.addEventListener('pointercancel',cleanupDrag);document.addEventListener('lostpointercapture',()=>{if(drag)cleanupDrag();});window.addEventListener('blur',cleanupDrag);document.addEventListener('visibilitychange',()=>{if(document.hidden)cleanupDrag();});
// Arrow navigation preserves normal caret movement until a field boundary is reached.
document.addEventListener('keydown',ev=>{if(ev.isComposing||ev.ctrlKey||ev.metaKey||ev.altKey||ev.shiftKey)return;const el=ev.target;
 if(el.matches('.entry')){const inputs=$$('.entry'),i=inputs.indexOf(el);if(ev.key==='Enter'){ev.preventDefault();(inputs[i+1]||$('#next')).focus();return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;if(ev.key==='ArrowLeft'&&(el.selectionStart!==0||el.selectionEnd!==0))return;if(ev.key==='ArrowRight'&&(el.selectionStart!==el.value.length||el.selectionEnd!==el.value.length))return;ev.preventDefault();let target;
  if(ev.key==='ArrowLeft'||ev.key==='ArrowRight')target=inputs[i+(ev.key==='ArrowRight'?1:-1)];else{const r=el.getBoundingClientRect(),candidates=inputs.filter(x=>{const b=x.getBoundingClientRect();return ev.key==='ArrowDown'?b.top>r.top+8:b.top<r.top-8;});target=candidates.sort((a,b)=>{const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return Math.abs(ra.left-r.left)+Math.abs(ra.top-r.top)-Math.abs(rb.left-r.left)-Math.abs(rb.top-r.top);})[0];}if(target){target.focus();target.select();target.scrollIntoView({block:'nearest',inline:'nearest'});}}
 else if(el.matches('[data-term]')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key)){ev.preventDefault();const buttons=$$('[data-term]:not([disabled])'),r=el.getBoundingClientRect(),horizontal=ev.key==='ArrowLeft'||ev.key==='ArrowRight',candidates=buttons.filter(x=>{const b=x.getBoundingClientRect();return horizontal?(Math.abs(b.top-r.top)<20&&(ev.key==='ArrowRight'?b.left>r.left:b.left<r.left)):(ev.key==='ArrowDown'?b.top>r.top+8:b.top<r.top-8);});const target=candidates.sort((a,b)=>{const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return Math.hypot(ra.left-r.left,ra.top-r.top)-Math.hypot(rb.left-r.left,rb.top-r.top);})[0];target?.focus();}
});
$('#work').onclick=ev=>{const b=ev.target.closest('[data-term]:not([disabled])');if(!b)return;const id=Number(b.dataset.term),ts=buildTerms();
 if(stage.kind==='mark'){invalidate();p.marks[id]=p.marks[id]==null?0:p.marks[id]===2?null:p.marks[id]+1;p.cancelled=[];render();const t=$(`[data-term="${id}"]`);t.classList.remove('pulse');void t.offsetWidth;t.classList.add('pulse');t.focus();save();}
 else if(stage.kind==='cancel'){
  if(p.first==null){p.first=id;b.classList.add('picked');feedback('', ['בחרו את היחידה באותו צבע.']);}
  else if(p.first===id){p.first=null;b.classList.remove('picked');}
  else if(!C.canCancel(ts,p.marks,p.first,id))feedback('no',['בחרו אותה יחידה באותו צבע, פעם במונה ופעם במכנה.']);
  else{p.cancelled.push(p.first,id);p.first=null;render();feedback('ok',['סמלי היחידה צומצמו. המספרים נשארים לחישוב.']);save();}
 }
};
$('#hint').onclick=()=>{const box=$('#hint-text');box.hidden=!box.hidden;box.textContent=stage.kind==='mark'?'כל לחיצה מחליפה צבע. חברו את אותה יחידה במונה ובמכנה. השאירו את יחידות התוצאה בלי צבע.':stage.kind==='cancel'?'בחרו את שתי היחידות של כל זוג שסימנתם. המספרים אינם נעלמים.':stage.kind==='axis'?'כל בחירה תקינה. כוח בכיוון שבחרתם יקבל סימן חיובי.':stage.id==='build'&&e.type==='pyth'?'כל כוח כולל מספר ויחידה בתוך הסוגריים. אפשר להציב את שני הכוחות בכל סדר.':stage.id==='squares'?'רבעו גם את המספר וגם את יחידת המידה.':stage.id==='build'&&e.type==='conversion'?'הקילומטר יופיע במכנה של שבר המרחק. השעה תופיע במונה של שבר הזמן.':stage.id==='build'&&e.type==='net'?'סימן הכוח נקבע לפי הכיוון החיובי. N היא יחידת ניוטון.':stage.id==='calc'?'בדקו את החשבון ואת היחידה שנותרת. אפשר להקליד סימון מדעי, למשל 3e5.':'קראו שוב מה נתון ומה מבקשים. בדקו על איזה גוף או גודל מדובר.';};
function setTheme(dark){document.documentElement.dataset.theme=dark?'dark':'light';$('#theme').textContent=dark?'ערכה בהירה':'ערכה כהה';try{localStorage.setItem('data-theme',dark?'dark':'light');}catch{}}
let theme;try{theme=localStorage.getItem('data-theme');}catch{}setTheme(theme?theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches);$('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme!=='dark');
let solutionSteps=[];
$('#solution-open').onclick=()=>{cleanupDrag();const solved={axis:s.axis,values:{}};
 if(e.type==='pyth'){solved.values.a=e.values[0];solved.values.b=e.values[1];}
 const actual=C.model(e,solved);solutionFields=actual.fields;solutionSteps=actual.stages.filter(x=>x.kind!=='mark'&&x.kind!=='cancel'&&x.kind!=='axis').flatMap(x=>x.expr?Array.from({length:atomCount(x.expr)},(_,i)=>({...x,reveal:i+1})):[x]);solIndex=0;renderSolution();$('#solution').showModal();};
function atomCount(items){return items.reduce((n,x)=>n+(x.frac?atomCount(x.frac[0])+atomCount(x.frac[1]):x.quantity?atomCount(x.quantity):x.root?1+atomCount(x.root):x.power?1+atomCount(x.power):1),0);}
function renderSolution(){const x=solutionSteps[solIndex];$('#solution-note').textContent=x.title;$('#solution-count').textContent=`${solIndex+1} מתוך ${solutionSteps.length}`;$('#solution-back').disabled=solIndex===0;$('#solution-next').disabled=solIndex===solutionSteps.length-1;
 if(x.kind==='choice')$('#solution-work').innerHTML=`<div class="solution-step"><p>${esc(x.q)}</p><div>${optionHTML(x.options[x.a])}</div><p>${esc(x.feedback[x.a])}</p></div>`;
 else $('#solution-work').innerHTML=`<div class="solution-step">${exprHTML(x.expr,{sol:true,reveal:x.reveal})}</div>`;
}
$('#solution-next').onclick=()=>{if(solIndex<solutionSteps.length-1){solIndex++;renderSolution();}};$('#solution-back').onclick=()=>{if(solIndex){solIndex--;renderSolution();}};$('#solution-close').onclick=()=>$('#solution').close();
function diagram(ex){return ForceDiagrams.render(ex,s);}
load(currentId);
