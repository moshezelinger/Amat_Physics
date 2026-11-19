const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('./source/conversion-core.js').Conversions;
const expected={length:[2400000,3.5,1250,7.25,8000,64,.045,36],area:[20000,3.5,120,6.4,30000,2.5,500000,1.25],time:[150,1.5,180,1.25,144,2,48,1.5]};
for(const [key,g] of Object.entries(C.groups)){
 assert.equal(g.exercises.length,8);
 g.exercises.forEach((e,i)=>{
  const path=C.path(g,e),terms=C.terms(e,path);let r=e[0];for(const x of path)r*=x.n/x.d;
  assert(C.close(r,expected[key][i]),`${key} ${i} chain`);assert(C.close(C.answer(g,e),expected[key][i]),`${key} ${i} answer`);
  const marks=terms.map(()=>null);for(let j=0;j<path.length;j++){marks[j===0?0:1+(j-1)*2]=j;marks[2+j*2]=j}
  assert.equal(C.colorError(terms,marks,path.length),null);
  for(let j=0;j<path.length;j++)assert(C.canCancel(terms,marks,j===0?0:1+(j-1)*2,2+j*2));
  assert(!C.canCancel(terms,marks,0,0));assert(!C.canCancel(terms,marks,0,1));
  const no=marks.map(()=>null);assert(C.colorError(terms,no,path.length));
  const mixed=marks.slice();[mixed[1],mixed[2]]=[mixed[2],mixed[1]];assert(C.colorError(terms,mixed,path.length));
  assert.equal(C.reveal(path).at(-1).kind,'final');assert.deepEqual(C.reveal(path),C.reveal(path));
 });
}
const expTerms=[{u:'m²',side:'top'},{u:'m',side:'bottom'},{u:'cm²',side:'top'}];assert.equal(C.colorError(expTerms,[0,0,null],1).kind,'unit');
const sides=[{u:'m²',side:'top'},{u:'m²',side:'top'},{u:'cm²',side:'bottom'}];assert.equal(C.colorError(sides,[0,0,null],1).kind,'side');
for(const s of ['', ' ', 'abc','1/0','1,2','Infinity'])assert(Number.isNaN(C.number(s)),s);
assert.equal(C.number('2,400,000'),2400000);assert.equal(C.number('3.50'),3.5);
assert.equal(C.unitSymbol('cm2',C.groups.area.order),'cm²');
assert.equal(C.unitSymbol(' cm^2 ',C.groups.area.order),'cm²');
assert.equal(C.unitSymbol('CM2',C.groups.area.order),null,'Case is not silently changed');
assert.equal(C.unitSymbol('m2',C.groups.length.order),null,'Area cannot substitute for length');
assert.deepEqual(C.keyboardTarget({scope:'factor',index:0,key:'n'},'ArrowRight',3),{scope:'factor',index:0,key:'nu'});
assert.deepEqual(C.keyboardTarget({scope:'factor',index:0,key:'nu'},'ArrowDown',3),{scope:'factor',index:0,key:'du'});
assert.deepEqual(C.keyboardTarget({scope:'factor',index:1,key:'du'},'ArrowUp',3),{scope:'factor',index:1,key:'nu'});
assert.deepEqual(C.keyboardTarget({scope:'factor',index:0,key:'nu'},'ArrowRight',3),{scope:'factor',index:1,key:'n'});
assert.equal(C.keyboardTarget({scope:'factor',index:0,key:'n'},'ArrowLeft',3),null);
assert.deepEqual(C.keyboardTarget({scope:'result',index:1,key:'u'},'ArrowUp',3),{scope:'result',index:0,key:'u'});
assert.deepEqual(C.keyboardTarget({scope:'result',index:0,key:'n'},'ArrowRight',3),{scope:'result',index:0,key:'u'});
assert.deepEqual([null,0,1,2].map(C.cycleColor),[0,1,2,null]);
const single=[{u:'m²',side:'top'},{u:'cm²',side:'top'},{u:'m²',side:'bottom'}];
assert.equal(C.colorError(single,[1,null,1],1),null,'A single pair may use blue');
assert.equal(C.colorError(single,[2,null,2],1),null,'A single pair may use green');
for(const g of Object.values(C.groups))for(const e of g.exercises){const p=C.path(g,e),s=C.revealAtoms(p);assert.deepEqual(s.slice(0,3).map(x=>x.id),['quantity','given-n','given-u']);assert.equal(s.filter(x=>x.kind==='write').length,2+4*p.length);assert.equal(s.filter(x=>x.kind==='calculate').length,2*p.length);assert.equal(s.at(-1).id,`r${p.length-1}-u`);const firstMark=s.findIndex(x=>x.kind==='mark'),lastWrite=s.map(x=>x.kind).lastIndexOf('write');assert(firstMark>lastWrite,'Coloring follows all placement');}
const html=fs.readFileSync('index.html','utf8');for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
const questionSource=html.match(/function questions\(\)\{[\s\S]*?(?=\nfunction renderQuiz)/)[0];
for(const [topic,expectedTop,expectedBottom,count] of [['length','100 cm','1 m',4],['area','10,000 cm²','1 m²',5],['time','60 min','1 h',5]]){
 const questions=vm.runInNewContext(questionSource+';questions()',{topic});
 assert.equal(questions.length,count);for(const q of questions){assert.equal(q.o.length,3);assert.equal(q.f.length,3);assert(q.f.every(f=>typeof f==='string'&&f.length>0));assert(q.a>=0&&q.a<3)}
 const meanings=[...questions[0].o[questions[0].a].matchAll(/class="half">([^<]+)/g)].map(x=>x[1]);
 assert.equal(meanings[0],expectedTop,'The spoken ratio has the stated quantity in its numerator');
 assert.equal(meanings[1],expectedBottom,'The per-unit quantity is in its denominator');
 assert.equal(questions[1].a,1,'Converting from the smaller unit uses the reciprocal ratio');
}
console.log('PASS: 24 known results; color pair identity/side/exponent/target checks; number parsing; reveal state generation; inline JS syntax.');
