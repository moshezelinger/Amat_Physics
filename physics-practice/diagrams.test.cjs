const assert=require('node:assert/strict');
const D=require('./source/content.js'),G=require('./source/diagrams.js');
const diagrams=D.exercises.filter(e=>e.topic!=='speed');
const complete={done:['build','direction'],finished:true};
let groups=0;
const test=(name,fn)=>{fn();groups++;console.log('✓ '+name);};
function arrows(html){return [...html.matchAll(/<g class="arrow [^"]*"([^>]*)><line ([^>]*)\/><polygon points="([^"]*)"/g)].map(m=>{
 const attrs=s=>Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));
 const a=attrs(m[1]),line=attrs(m[2]),tip=m[3].split(' ')[0].split(',').map(Number);
 return {...a,x:Number(line.x1),y:Number(line.y1),tip,length:Math.hypot(tip[0]-Number(line.x1),tip[1]-Number(line.y1))};
});}
test('All 24 force exercises render, and speed exercises have no force diagram',()=>{
 assert.equal(diagrams.length,24);for(const e of diagrams)assert.ok(G.render(e).includes('<svg'),e.id);
 for(const e of D.exercises.filter(e=>e.topic==='speed'))assert.equal(G.render(e),'');
});
test('Net diagram values and directions match the actual written data',()=>{
 for(const e of diagrams.filter(e=>e.topic==='net'&&e.object!=='ספר')){
  const printed=[...e.text.matchAll(/(\d+) N (ימינה|שמאלה|למעלה|למטה)/g)];
  const fs=G.model(e).forces;assert.equal(fs.length,printed.length,e.id);
  const dir={ימינה:'right',שמאלה:'left',למעלה:'up',למטה:'down'};
  printed.forEach((p,i)=>{assert.equal(fs[i].magnitude,Number(p[1]));assert.equal(fs[i].direction,dir[p[2]]);assert.equal(fs[i].receiver,e.object);});
 }
});
test('Book, rope and friction graphics include their actual surroundings',()=>{
 const book=G.render(D.exercises.find(e=>e.id==='force-1'));
 assert.ok(book.includes('השולחן על הספר'));assert.ok(book.includes('כדור הארץ על הספר'));assert.ok(book.includes('M95 170H305'));
 assert.ok(G.render(D.exercises.find(e=>e.id==='force-2')).includes('rope-line'));
 const friction=G.render(D.exercises.find(e=>e.id==='force-6'));
 assert.ok(friction.includes('floor-line'));assert.ok(friction.includes('motion-arrow'));
 assert.equal(arrows(friction).length,1);assert.equal(arrows(friction)[0]['data-direction'],'right');assert.ok(friction.includes('החלקה שמאלה'));
});
test('Book forces act on the book, with upward table push and downward Earth pull',()=>{
 for(const id of ['force-1','force-5','force-8','net-6']){
  const e=D.exercises.find(e=>e.id===id),fs=G.model(e).forces;
  assert.equal(fs.find(f=>f.giver==='השולחן').direction,'up');assert.equal(fs.find(f=>f.giver==='כדור הארץ').direction,'down');assert.ok(fs.every(f=>f.receiver==='ספר'));const drawn=arrows(G.render(e));assert.equal(drawn[0].x,drawn[1].x);assert.equal(drawn[0].y,drawn[1].y);
 }
 const e=D.exercises.find(e=>e.id==='net-6');assert.equal(G.model(e).forces.find(f=>f.symbol==='FN').magnitude,null);assert.equal(G.model(e,complete).forces.find(f=>f.symbol==='FN').magnitude,30);
});
test('Every third-law given matches the text; response belongs to the other named body',()=>{
 for(const e of diagrams.filter(e=>e.type==='third')){
  assert.ok(e.text.includes(e.magnitude+' N'),e.id);const before=G.model(e),after=G.model(e,complete);
  assert.deepEqual(before.bodies,[e.giver,e.receiver]);assert.equal(after.forces[0].receiver,e.receiver);assert.equal(after.forces[1].receiver,e.giver);
  assert.equal(after.forces[0].magnitude,after.forces[1].magnitude);assert.equal(after.forces[1].direction,G.opposite[after.forces[0].direction]);
  assert.equal(arrows(G.render(e)).length,1);assert.equal(arrows(G.render(e,complete)).length,2);
 }
});
test('Unknown response magnitude and direction are revealed only after their checked steps',()=>{
 for(const e of diagrams.filter(e=>e.type==='third')){
  let m=G.model(e,{values:{f:String(e.magnitude)},done:[]});assert.equal(m.forces[1].magnitude,null);assert.equal(m.forces[1].direction,null);
  m=G.model(e,{done:['build']});assert.equal(m.forces[1].magnitude,e.magnitude);assert.equal(m.forces[1].direction,null);
  m=G.model(e,{done:['build','direction']});assert.equal(m.forces[1].direction,G.opposite[e.direction]);
 }
});
test('Every SVG arrow points in its declared direction and stays within its canvas',()=>{
 for(const e of diagrams)for(const a of arrows(G.render(e,complete))){
  const [vx,vy]=G.vector[a['data-direction']],dx=a.tip[0]-a.x,dy=a.tip[1]-a.y;
  assert.ok(dx*vx+dy*vy>0,e.id);assert.ok(Math.abs(dx*vy-dy*vx)<1e-8,e.id);
  assert.ok(a.tip[0]>=0&&a.tip[0]<=400&&a.tip[1]>=0&&a.tip[1]<=300,e.id);
 }
});
test('Arrow lengths preserve known force ratios, including unequal perpendicular forces',()=>{
 for(const e of diagrams.filter(e=>e.type==='net'&&e.object!=='ספר'||e.type==='pyth'||e.type==='third')){
  const as=arrows(G.render(e,complete));let ratio;
  for(const a of as){const r=a.length/Number(a['data-magnitude']);if(ratio==null)ratio=r;assert.ok(Math.abs(r-ratio)<1e-8,e.id);}
 }
 const e=D.exercises.find(e=>e.id==='net-7'),as=arrows(G.render(e));
 assert.ok(Math.abs(as[0].length/as[1].length-6/8)<1e-8);
});
console.log(groups+' diagram check groups passed');
