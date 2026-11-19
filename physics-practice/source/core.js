const PhysicsCore=(()=>{
const content=typeof PhysicsContent==='undefined'?require('./content.js'):PhysicsContent;
const opposite={right:'left',left:'right',up:'down',down:'up'};
const num=s=>{s=String(s??'').trim().replace(/−/g,'-');if(/^[-+]?\d{1,3}(,\d{3})+(\.\d+)?([eE][-+]?\d+)?$/.test(s))s=s.replace(/,/g,'');return /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/.test(s)?Number(s):NaN};
const unit=s=>String(s??'').trim().replace(/\s+/g,'').replace(/\^?2$/,'²').replace(/מטרים?לשנייה|מ׳\/ש׳/g,'m/s');
const close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1e-9,Math.abs(b)*1e-6);
const literal=s=>({text:s}),variable=s=>({variable:s}),frac=(a,b)=>({frac:[a,b]}),power=a=>({power:a}),root=a=>({root:a});
const equation=(name,nodes)=>[variable(name),literal('='),...nodes];
const choice=(q,options,a,feedback)=>content.mc(q,options,a,feedback);
const formula=(s)=>({formula:s});
function model(e,state={}){
 const values=state.values||{},fields={},stages=[];
 const f=(id,expected,type='n',label=id)=>{fields[id]={id,expected,type,label};return {field:id}};
 const q=(id,n,u,label)=>({quantity:[f(id,n,'n',label+' מספר'),f(id+'u',u,'u',label+' יחידה')]});
 const add=(id,title,expr,ids,extra={})=>stages.push({id,title,expr,fields:ids,...extra});
 const mc=(id,title,data)=>stages.push({id,title,...data});
 const finish=()=>{for(const st of stages){if(st.kind!=='choice')continue;const n=st.options.length,shift=[...e.id+st.id].reduce((a,c)=>a+c.charCodeAt(0),0)%n;st.options=st.options.map((_,i)=>st.options[(i-shift+n)%n]);st.feedback=st.feedback.map((_,i)=>st.feedback[(i-shift+n)%n]);st.a=(st.a+shift)%n;}return {fields,stages};};
 const put=(id,title,fn,extra={})=>{const before=Object.keys(fields),expr=fn();add(id,title,expr,Object.keys(fields).filter(k=>!before.includes(k)),extra)};
 const read=(id,fallback)=>Number.isFinite(num(values[id]))?num(values[id]):fallback;
 if(e.questions){e.questions.forEach((x,i)=>mc('q'+i,i?'בדקו את משמעות הכוחות':'זהו מפעיל ומקבל',x));return finish();}
 if(e.type==='net'||e.type==='pyth'){
  mc('body','זהו את הגוף הנבדק',choice('אילו כוחות ייכללו בשקול המבוקש?',[`הכוחות שפועלים על ה${e.object}`,'הכוחות שהגוף מפעיל על סביבתו','כל הכוחות על כל הגופים'],0,['השקול המבוקש הוא על גוף אחד.','אלה כוחות שפועלים על גופים אחרים.','בחרו את הגוף שעליו מחשבים את השקול.']));
  if(!e.pyth){
   const vertical=e.directions[0]==='up';
   stages.push({id:'axis',kind:'axis',title:'בחרו את הכיוון החיובי',options:vertical?['למעלה','למטה']:['ימינה','שמאלה']});
   const positive=state.axis===1?opposite[e.directions[0]==='up'?'up':'right']:(vertical?'up':'right');
   const signed=e.values.map((n,i)=>e.directions[i]===positive?n:-n);
   mc('relation','בחרו קשר מתאים',choice('איזה קשר מתאר את השקול על ציר אחד?',[formula('sum'),formula('product'),formula('pyth')],0,['מחברים רכיבים עם סימן לפי הכיוון שבחרתם.','מכפלת כוחות אינה כוח שקול.','פיתגורס מתאים לרכיבים מאונכים. כאן הכוחות על ציר אחד.']));
   put('build','הציבו כוחות עם סימנים',()=>equation('ΣF',signed.flatMap((n,i)=>[...(i?[literal('+')]:[]),literal('('),q('f'+i,n,'N',`כוח F${i+1}`),literal(')')])));
   put('calc','חשבו מספר ויחידה',()=>equation('ΣF',[q('r',signed.reduce((a,b)=>a+b,0),'N','השקול עם סימן')]));
   const total=signed.reduce((a,b)=>a+b,0),dir=total===0?'אין כיוון לשקול אפס':content.directions[total>0?positive:opposite[positive]];
   mc('interpret','פרשו את התוצאה',choice('מה גודל השקול ומה כיוונו?',[`${Math.abs(total)} N, ${dir}`,`${Math.abs(total)+2} N, ${dir}`,total?`${Math.abs(total)} N, ${content.directions[total>0?opposite[positive]:positive]}`:'אין כוחות על הגוף'],0,['הגודל אינו שלילי. הסימן נקבע לפי הכיוון החיובי שבחרתם.','בדקו את חיבור הרכיבים עם הסימנים.','כוחות יכולים להתאזן. כאשר השקול אינו אפס, הסימן קובע את כיוונו.']));
  }else{
   mc('relation','בחרו קשר מתאים',choice('איך מחשבים גודל שקול של כוחות מאונכים?',[formula('pyth'),formula('sum'),formula('product')],0,['שני הכוחות הם ניצבים במשולש ישר זווית.','סכום גדלים מתאים לכוחות באותו כיוון.','מכפלה לבדה אינה נותנת גודל כוח שקול.']));
   const a=e.values[0],b=e.values[1];
   put('build','הציבו בתוך השורש',()=>equation('|ΣF|',[root([power([q('a',[a,b],'N','הכוח הראשון')]),literal('+'),power([q('b',read('a',a)===a?b:a,'N','הכוח השני')])]) ]));
   put('squares','רבעו מספרים ויחידות',()=>equation('|ΣF|',[root([q('a2',read('a',a)**2,'N²','ריבוע הכוח הראשון'),literal('+'),q('b2',read('b',b)**2,'N²','ריבוע הכוח השני')])]));
   put('sum','חברו בתוך השורש',()=>equation('|ΣF|',[root([q('sum',a*a+b*b,'N²','סכום הריבועים')])]));
   put('calc','הוציאו שורש',()=>equation('|ΣF|',[q('r',Math.hypot(a,b),'N','גודל השקול')]));
  }
  mc('check','בדקו את המשמעות',e.check);
 }else if(e.type==='third'){
  mc('body','זהו את מקבל הכוח',choice('על מי פועל F₁,₂?',[e.receiver,e.giver,'על שני הגופים יחד'],0,['האינדקס 1,2 מציין שגוף 1 מפעיל כוח על גוף 2.','גוף 1 מפעיל את הכוח F₁,₂. הכוח פועל על גוף 2.','כל אחד מכוחות הזוג פועל על גוף אחד.']));
  mc('relation','בחרו את זוג הכוחות',choice('מי מפעיל את הכוח F₂,₁?',[`${e.receiver} על ${e.giver}`,`${e.giver} על ${e.receiver}`,'הגוף מפעיל כוח על עצמו'],0,['מחליפים בין המפעיל למקבל.','זהו שוב הכוח F₁,₂ שניתן בשאלה.','כוח התגובה הוא כוח של הגוף השני על הראשון.']));
  put('build','השלימו גודל שווה',()=>equation('|F₂,₁|',[q('f',e.magnitude,'N','גודל כוח התגובה')]));
  fields.f.nonNegative=true;
  const correct=content.directions[opposite[e.direction]],wrong=content.directions[e.direction];
  mc('direction','בחרו כיוון הפוך',choice('מה כיוון F₂,₁?',[correct,wrong,'אין לו כיוון'],0,['הכוחות בזוג שווים בגודלם והפוכים בכיוונם.','הכיוון צריך להיות הפוך לכיוון F₁,₂.','לכוח יש גודל וכיוון.']));
  mc('check','בדקו על מי פועל הכוח',e.check);
 }else{
  const speedUnit=e.du+'/'+e.tu;
  if(e.type!=='conversion'){
   mc('known','זהו את המבוקש',choice('איזה גודל צריך לחשב?',['מהירות v','מרחק d','זמן t'],{v:0,d:1,t:2}[e.target],['בדקו אם בשאלה מבקשים מטרים בכל שנייה.','מרחק נמדד ביחידות אורך. חזרו למשפט הבקשה.','זמן נמדד בשניות, בדקות או בשעות.'].map((x,i)=>i==={v:0,d:1,t:2}[e.target]?'זהו המבוקש. שני הגדלים האחרים נתונים או ניתנים להמרה.':x)));
   const givenTime=e.roundTrip?`${e.roundTrip} s (הלוך ושוב)`:e.convertTime?`${e.convertTime.n} ${e.convertTime.u}`:`${e.t} ${e.tu}`;
   const knownData=e.target==='v'?`d = ${e.d} ${e.du}, t = ${givenTime}`:e.target==='d'?`v = ${e.v} ${speedUnit}, t = ${givenTime}`:`d = ${e.d} ${e.du}, v = ${e.v} ${speedUnit}`;
   mc('data','זהו את הנתונים',choice('אילו נתונים ניתנו בשאלה?',[`<bdi>${knownData}</bdi>`,'הנתון ביחידת אורך הוא הזמן','המבוקש הוא כבר נתון מספרי'],0,['אלה הגדלים הנתונים והיחידות שלהם.','מטר וקילומטר הם יחידות מרחק. זמן נמדד למשל בשניות.','למבוקש אין עדיין ערך ידוע. בונים קשר כדי למצוא אותו.']));
   if(e.roundTrip)put('half','מצאו זמן לכיוון אחד',()=>equation('t',[frac([{quantity:[literal(e.roundTrip),literal('s')]}],[literal('2')]),literal('='),q('half',e.t,'s','זמן לכיוון אחד')]));
   if(e.convertTime){
    put('time','בנו את המרת הזמן',()=>equation('t',[{quantity:[literal(e.convertTime.n),literal(e.convertTime.u)]},literal('×'),frac([q('factor',e.convertTime.factor,'s','גורם המרה במונה')],[q('one',1,e.convertTime.u,'גורם המרה במכנה')])]),{markable:true,source:'time'});
    add('time-mark','סמנו זוגות באותו צבע',null,[],{kind:'mark',source:'time',target:'s'});
    add('time-cancel','צמצמו את הזוג שסימנתם',null,[],{kind:'cancel',source:'time',target:'s'});
    put('time-result','חשבו את הזמן בשניות',()=>equation('t',[q('converted',e.t,'s','הזמן בשניות')]),{source:'time'});
   }
   mc('relation','בחרו קשר מתאים',choice('איזה קשר ייתן את המבוקש?',[formula('v'),formula('d'),formula('t')],{v:0,d:1,t:2}[e.target],['הקשר מחלק מרחק בזמן ומחשב מהירות.','הקשר כופל מהירות בזמן ומחשב מרחק.','הקשר מחלק מרחק במהירות ומחשב זמן.'].map((x,i)=>i==={v:0,d:1,t:2}[e.target]?'זהו הקשר המתאים למבוקש. הציבו עם יחידות תואמות.':x)));
   put('build','הציבו נתונים ויחידות',()=>equation(e.target,e.target==='v'?[frac([q('d',e.d,e.du,'המרחק')],[q('t',e.t,e.tu,'הזמן')])]:e.target==='d'?[q('v',e.v,speedUnit,'המהירות'),literal('×'),q('t',e.t,e.tu,'הזמן')]:[frac([q('d',e.d,e.du,'המרחק')],[q('v',e.v,speedUnit,'המהירות')])]),{markable:!!e.cancel});
   if(e.cancel){add('mark','סמנו זוגות באותו צבע',null,[],{kind:'mark'});add('cancel','צמצמו את הזוג שסימנתם',null,[],{kind:'cancel'});}
   put('calc','חשבו מספר ויחידה',()=>equation(e.target,[q('r',e[e.target],e.target==='v'?speedUnit:e.target==='d'?e.du:e.tu,'התוצאה')]));
  }else{
   mc('known','זהו את יחידות היעד',choice('מה מבקשים לתאר ב־m/s?',['את אותה מהירות במטרים בכל שנייה','את המרחק הכולל במטרים','את הזמן בשניות בלבד'],0,['משנים יחידות. המהירות הפיזיקלית נשארת אותה מהירות.','m/s היא יחידת מהירות, לא יחידת מרחק.','ליחידת מהירות יש גם אורך וגם זמן.']));
   put('build','בנו שברי המרה',()=>equation('v',[frac([{quantity:[literal(e.value),literal('km')]}],[literal('h')]),literal('×'),frac([q('metres',1000,'m','מטרים במונה')],[q('km',1,'km','קילומטר במכנה')]),literal('×'),frac([q('hour',1,'h','שעה במונה')],[q('seconds',3600,'s','שניות במכנה')])]),{markable:true});
   add('mark','סמנו זוגות באותו צבע',null,[],{kind:'mark'});add('cancel','צמצמו את הזוגות שסימנתם',null,[],{kind:'cancel'});
   put('calc','חשבו מספר ויחידה',()=>equation('v',[q('r',e.answer,'m/s','המהירות לאחר המרה')]));
  }
  mc('check','בדקו את משמעות התוצאה',e.check);
 }
 return finish();
}
function fieldError(field,value){
 if(!String(value??'').trim())return 'השלימו את השדה המסומן.';
 if(field.type==='u')return unit(value)===field.expected?null:'בדקו את יחידת המידה בשדה המסומן. שמרו גם על החזקה ועל האותיות הגדולות והקטנות.';
 if(field.nonNegative&&num(value)<0)return 'כאן ממלאים גודל שאינו שלילי. את הכיוון בוחרים בנפרד.';
 const expected=Array.isArray(field.expected)?field.expected:[field.expected];
 return expected.some(x=>close(num(value),x))?null:'בדקו את המספר בשדה המסומן. היעזרו בנתונים ובקשר שבחרתם.';
}
// All draggable numeric values come from the current validation model, including signs and intermediate results.
function bank(e,state={},stageId){
 const m=model(e,state),stage=m.stages.find(s=>s.id===stageId);if(!stage?.fields?.length)return [];
 const fs=stage.fields.map(id=>m.fields[id]);
 const numbers=[...new Set(fs.filter(f=>f.type==='n').flatMap(f=>Array.isArray(f.expected)?f.expected:[f.expected]))];
 const units=[...new Set(fs.filter(f=>f.type==='u').map(f=>f.expected))];
 return numbers.map(v=>({type:'n',v:String(v)})).concat(units.map(v=>({type:'u',v})));
}
function formatNumber(n){return Number(n).toLocaleString('en-US',{maximumSignificantDigits:15});}
function atoms(symbol,side=1){let sign=side;return unit(symbol).split('/').flatMap((part,i)=>part.split(/[·*]/).filter(Boolean).map(x=>{const m=x.match(/^([A-Za-z]+)(²)?$/);return {unit:m?m[1]:x,sign:(i?-side:side)*(m?.[2]?2:1)};}));}
function terms(expr,values,fields){const out=[];function walk(nodes,side=1){for(const n of nodes){if(n.frac){walk(n.frac[0],side);walk(n.frac[1],-side);}else if(n.quantity){const u=n.quantity[1],symbol=u.field?unit(values[u.field]):u.text;out.push(...atoms(symbol,side));}else if(n.text&&/^(km|h|s|m)$/.test(n.text))out.push(...atoms(n.text,side));}}walk(expr);return out.map((t,i)=>({...t,id:i}));}
function dimension(ts){const out={};ts.forEach(t=>out[t.unit]=(out[t.unit]||0)+t.sign);return Object.fromEntries(Object.entries(out).filter(([,v])=>v).sort());}
function sameDim(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function colorError(ts,marks,target){
 for(let c=0;c<3;c++){const group=ts.filter(t=>marks[t.id]===c);if(!group.length)continue;if(group.length!==2)return 'כל צבע צריך לסמן שתי יחידות בלבד.';if(group[0].unit!==group[1].unit||group[0].sign!==-group[1].sign)return 'חברו באותו צבע יחידות זהות, אחת במונה ואחת במכנה.';}
 const remaining=ts.filter(t=>marks[t.id]==null);
 if(!sameDim(dimension(remaining),dimension(atoms(target))))return 'השאירו את יחידות התוצאה בלי צבע, וסמנו כל זוג מתאים בצבע משלו.';
 // A zero-sum pair left unmarked must not pass just because its dimension sums to zero.
 if(remaining.some((t,i)=>remaining.some((u,j)=>j>i&&u.unit===t.unit&&u.sign===-t.sign)))return 'סמנו גם את זוג היחידות שעדיין לא סומן.';
 return null;
}
function canCancel(ts,marks,a,b){return a!==b&&marks[a]!=null&&marks[a]===marks[b]&&ts[a].unit===ts[b].unit&&ts[a].sign===-ts[b].sign;}
return {num,unit,close,model,fieldError,terms,atoms,dimension,colorError,canCancel,opposite,bank,formatNumber};
})();
if(typeof module!=='undefined')module.exports=PhysicsCore;
