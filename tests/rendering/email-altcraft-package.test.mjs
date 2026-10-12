import assert from "node:assert/strict";
import test from "node:test";
import { buildAltcraftEntries } from "../../scripts/lib/email-altcraft-package.mjs";
const profile={id:"altcraft-mobile-base-v1",version:"1.0.0",package:{id:"altcraft-full-v1",html_entry:"email/html.html",asset_root_entry:"images",is_amp:false,is_not_inline:true}}; const html='<img src="../images/logo.png">'; const image=Buffer.from([0,1,2,255]);
test("full Altcraft entries use the canonical email directory and byte-identical images",()=>{const result=buildAltcraftEntries({html,assetBuffers:new Map([["images/logo.png",image]]),deliveryDocument:{subject:"Тема",sender:{mode:"inherit"},reply_to:{mode:"inherit"}},plainText:"Текст",profile});assert.deepEqual(result.diagnostics,[]);const byPath=new Map(result.entries.map(e=>[e.path,e.bytes]));for(const p of ["email/html.html","email/subject.txt","email/text.txt","email/is_amp.txt","email/is_not_inline.txt","images/logo.png"])assert.ok(byPath.has(p),p);assert.equal(byPath.has("template.json"),false);assert.deepEqual(byPath.get("images/logo.png"),image);assert.equal(byPath.has("email/from_email.txt"),false);assert.equal(byPath.get("email/is_amp.txt").toString(),"false");});
test("explicit native sender and reply-to names create canonical files; missing HTML creates no entries",()=>{const explicit={subject:"Тема",sender:{mode:"explicit",name:"ЕДИНЫЙ ЦУПИС",address:"info@1cupis.ru"},reply_to:{mode:"explicit",name:"Поддержка",address:"help@1cupis.ru"}};const ok=buildAltcraftEntries({html,assetBuffers:new Map(),deliveryDocument:explicit,plainText:"Текст",profile});for(const p of ["email/from_email.txt","email/from_name.txt","email/replyto_email.txt","email/replyto_name.txt"])assert.ok(ok.entries.some(e=>e.path===p),p);const missing=buildAltcraftEntries({html:"",assetBuffers:new Map(),deliveryDocument:explicit,plainText:"Текст",profile});assert.ok(missing.diagnostics.length>0);assert.equal(missing.entries.length,0);});

test("absent subject produces an empty subject file without invented copy or blocking ZIP", () => {
  for (const subject of ["", undefined]) {
    const result = buildAltcraftEntries({ html, assetBuffers: new Map(), deliveryDocument: { ...(subject === undefined ? {} : { subject }), sender: { mode: "inherit" }, reply_to: { mode: "inherit" } }, plainText: "Существующий текст", profile });
    assert.deepEqual(result.diagnostics, []);
    assert.equal(result.entries.find(entry => entry.path === "email/subject.txt").bytes.length, 0);
    assert.equal(result.entries.find(entry => entry.path === "email/text.txt").bytes.toString(), "Существующий текст");
  }
});
