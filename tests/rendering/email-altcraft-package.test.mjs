import assert from "node:assert/strict";
import test from "node:test";
import { buildAltcraftEntries } from "../../scripts/lib/email-altcraft-package.mjs";
const profile={id:"altcraft-mobile-base-v1",version:"1.0.1",package:{id:"altcraft-root-html-v1",html_entry:"email.html",asset_root_entry:"images",is_amp:false,is_not_inline:true}};
const html='<img src="images/logo.png">';
const image=Buffer.from([0,1,2,255]);
test("root HTML package contains only email.html and byte-identical image entries",()=>{
  const result=buildAltcraftEntries({html,assetBuffers:new Map([["images/logo.png",image]]),deliveryDocument:{subject:"Тема",sender:{mode:"inherit"},reply_to:{mode:"inherit"}},plainText:"Текст",profile});
  assert.deepEqual(result.diagnostics,[]);
  assert.deepEqual(result.entries.map(entry=>entry.path).sort(),["email.html","images/logo.png"]);
  const byPath=new Map(result.entries.map(entry=>[entry.path,entry.bytes]));
  assert.equal(byPath.get("email.html").toString(),html);
  assert.deepEqual(byPath.get("images/logo.png"),image);
});
test("explicit subject sender and reply-to never create delivery metadata files",()=>{
  const explicit={subject:"Тема",sender:{mode:"explicit",name:"ЕДИНЫЙ ЦУПИС",address:"info@1cupis.ru"},reply_to:{mode:"explicit",name:"Поддержка",address:"help@1cupis.ru"}};
  const result=buildAltcraftEntries({html,assetBuffers:new Map(),deliveryDocument:explicit,plainText:"Текст",profile});
  assert.deepEqual(result.diagnostics,[]);
  assert.deepEqual(result.entries.map(entry=>entry.path),["email.html"]);
});
test("missing HTML creates no package entries",()=>{
  const result=buildAltcraftEntries({html:"",assetBuffers:new Map(),deliveryDocument:{sender:{mode:"inherit"},reply_to:{mode:"inherit"}},plainText:"Текст",profile});
  assert.ok(result.diagnostics.length>0);assert.deepEqual(result.entries,[]);
});
test("absent subject does not invent copy or add metadata files",()=>{
  for(const subject of ["",undefined]){
    const result=buildAltcraftEntries({html,assetBuffers:new Map(),deliveryDocument:{...(subject===undefined?{}:{subject}),sender:{mode:"inherit"},reply_to:{mode:"inherit"}},plainText:"Существующий текст",profile});
    assert.deepEqual(result.diagnostics,[]);assert.deepEqual(result.entries.map(entry=>entry.path),["email.html"]);
  }
});
