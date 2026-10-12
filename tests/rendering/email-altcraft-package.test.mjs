import assert from "node:assert/strict";
import test from "node:test";
import { buildAltcraftEntries } from "../../scripts/lib/email-altcraft-package.mjs";
import { rebasePackageResources } from "../../scripts/lib/email-resource-references.mjs";
import { encodeZipStore } from "../../scripts/lib/zip-store.mjs";
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

test("serialized CSS, VML and HTML background resolve to byte-identical assets in an Altcraft ZIP", () => {
  const source = '<table background="images/logo.png"><td style="background:url(&#39;images/logo.png&#39;)"><!--[if mso]><v:fill src="images/logo.png" /><![endif]--><img src="images/logo.png"><a href="https://example.com/?x=1&amp;y=2">action</a></td></table>';
  const rebased = rebasePackageResources({ html: source, assetPaths: ["images/logo.png"], htmlEntry: "email/html.html", assetRootEntry: "images" });
  assert.deepEqual(rebased.diagnostics, []);
  assert.equal(rebased.references.length, 4);
  const packaged = buildAltcraftEntries({ html: rebased.html, assetBuffers: new Map([["images/logo.png", image]]), deliveryDocument: { subject: "Тема", sender: { mode: "inherit" }, reply_to: { mode: "inherit" } }, plainText: "Текст", profile });
  assert.deepEqual(packaged.diagnostics, []);
  const zip = encodeZipStore(packaged.entries);
  // Independent STORE reader: inspect local headers and emitted bytes.
  const entries = new Map();
  for (let offset = 0; zip.readUInt32LE(offset) === 0x04034b50;) {
    assert.equal(zip.readUInt16LE(offset + 8), 0);
    const size = zip.readUInt32LE(offset + 18), nameLength = zip.readUInt16LE(offset + 26), extraLength = zip.readUInt16LE(offset + 28);
    const name = zip.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
    const start = offset + 30 + nameLength + extraLength;
    entries.set(name, zip.subarray(start, start + size));
    offset = start + size;
  }
  assert.deepEqual(entries.get("images/logo.png"), image);
  const output = entries.get("email/html.html").toString("utf8");
  assert.equal(output, '<table background="../images/logo.png"><td style="background:url(&#39;../images/logo.png&#39;)"><!--[if mso]><v:fill src="../images/logo.png" /><![endif]--><img src="../images/logo.png"><a href="https://example.com/?x=1&amp;y=2">action</a></td></table>');
});
