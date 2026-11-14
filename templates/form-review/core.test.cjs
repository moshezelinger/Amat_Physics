const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const coreSource=source.match(/<script id="review-core">([\s\S]*?)<\/script>/)[1];
const context={};vm.runInNewContext(coreSource,context);const C=context.FormReviewCore;
const example=JSON.parse(fs.readFileSync(path.join(__dirname,'example.json'),'utf8'));
const copy=x=>JSON.parse(JSON.stringify(x));
C.validate(example);let state=C.empty(example);
C.decide(example,state,'change-01','accepted');
assert.equal(state.decisions['change-01'].status,'accepted');
assert.throws(()=>C.decide(example,state,'change-02','change_requested',''),/הערה|כתבו/);
C.decide(example,state,'change-02','change_requested','לקצר את השדה');
assert.equal(state.decisions['change-02'].note,'לקצר את השדה');
const exported=JSON.parse(JSON.stringify(C.packet(example,state)));
assert.equal(C.readPacket(example,exported).decisions['change-01'].status,'accepted');
const reordered={items:example.items,sources:example.sources,title:example.title,version:example.version,review_id:example.review_id,is_demo:example.is_demo,schema_version:example.schema_version};
C.readPacket(reordered,exported);
for(const mutate of [x=>x.sources[0].version='new',x=>x.items[0].after+=' שינוי',x=>x.items[0].recommendation+=' שינוי',x=>x.version='2']){
 const changed=copy(example);mutate(changed);assert.throws(()=>C.readPacket(changed,exported));assert.throws(()=>C.validateState(changed,state));
}
for(const mutate of [x=>x.items.push(copy(x.items[0])),x=>x.sources.push(copy(x.sources[0])),x=>x.items[0].evidence[0].source_id='missing',x=>x.items[0].id='__proto__',x=>x.items[0].id='constructor',x=>x.sources.pop(),x=>x.items=[],x=>x.items[0].before='']){
 const broken=copy(example);mutate(broken);assert.throws(()=>C.validate(broken));
}
C.decide(example,state,'change-01','rejected','להשאיר מקור');assert.equal(state.decisions['change-01'].status,'rejected');
C.decide(example,state,'change-02','deferred');assert.equal(state.decisions['change-02'].status,'deferred');
const invalid=copy(state);invalid.decisions.unknown={status:'accepted',note:'',saved_at:new Date().toISOString()};assert.throws(()=>C.validateState(example,invalid));
const invalidDate=copy(state);invalidDate.decisions['change-01'].saved_at='not-a-date';assert.throws(()=>C.validateState(example,invalidDate));
const embedded=JSON.parse(source.match(/<script id="review-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);assert.equal(C.stable(embedded),C.stable(example));
new vm.Script(source.match(/<script id="review-ui">([\s\S]*?)<\/script>/)[1]);
const malicious=copy(example);malicious.items[0].title='</script><img src=x onerror=alert(1)>';C.validate(malicious);
const cp=require('node:child_process'),os=require('node:os');const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'form-review-'));
try{const input=path.join(tmp,'data.json'),output=path.join(tmp,'review.html');fs.writeFileSync(input,JSON.stringify(malicious));cp.execFileSync('python3',[path.join(__dirname,'build.py'),input,output]);const rendered=fs.readFileSync(output,'utf8');assert(!rendered.includes('</script><img'));const actual=JSON.parse(rendered.match(/<script id="review-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);assert.equal(actual.items[0].title,malicious.items[0].title);C.validate(actual);}finally{fs.rmSync(tmp,{recursive:true,force:true});}
console.log('Passed: data schema, exact version/content binding, all decision states, comments, export/import, duplicate/unsafe IDs, evidence references, timestamps and UI syntax.');
