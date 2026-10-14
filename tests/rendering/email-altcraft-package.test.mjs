import assert from "node:assert/strict";
import test from "node:test";
import { buildAltcraftEntries } from "../../scripts/lib/email-altcraft-package.mjs";
import { rebasePackageResources } from "../../scripts/lib/email-resource-references.mjs";
import { encodeZipStore } from "../../scripts/lib/zip-store.mjs";
import { renderPrimitive } from "../../scripts/lib/email-primitives.mjs";
import { serializeEmailHtml } from "../../scripts/lib/email-html-serializer.mjs";
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

function storedEntries(zip) {
  const entries = new Map();
  for (let offset = 0; zip.readUInt32LE(offset) === 0x04034b50;) {
    assert.equal(zip.readUInt16LE(offset + 8), 0);
    const size = zip.readUInt32LE(offset + 18), nameLength = zip.readUInt16LE(offset + 26), extraLength = zip.readUInt16LE(offset + 28);
    const name = zip.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
    const start = offset + 30 + nameLength + extraLength;
    entries.set(name, zip.subarray(start, start + size));
    offset = start + size;
  }
  return entries;
}

test("serialized CSS, VML and HTML background resolve to byte-identical assets in an Altcraft ZIP", () => {
  const source = '<table background="images/logo.png"><td style="background:url(&#39;images/logo.png&#39;)"><!--[if mso]><v:fill src="images/logo.png" /><![endif]--><img src="images/logo.png"><a href="https://example.com/?x=1&amp;y=2">action</a></td></table>';
  const rebased = rebasePackageResources({ html: source, assetPaths: ["images/logo.png"], htmlEntry: "email.html", assetRootEntry: "images" });
  assert.deepEqual(rebased.diagnostics, []);
  assert.equal(rebased.references.length, 4);
  const packaged = buildAltcraftEntries({ html: rebased.html, assetBuffers: new Map([["images/logo.png", image]]), deliveryDocument: { subject: "Тема", sender: { mode: "inherit" }, reply_to: { mode: "inherit" } }, plainText: "Текст", profile });
  assert.deepEqual(packaged.diagnostics, []);
  const zip = encodeZipStore(packaged.entries);
  // Independent STORE reader: inspect local headers and emitted bytes.
  const entries = storedEntries(zip);
  assert.deepEqual(entries.get("images/logo.png"), image);
  const output = entries.get("email.html").toString("utf8");
  assert.equal(output, '<table background="images/logo.png"><td style="background:url(&#39;images/logo.png&#39;)"><!--[if mso]><v:fill src="images/logo.png" /><![endif]--><img src="images/logo.png"><a href="https://example.com/?x=1&amp;y=2">action</a></td></table>');
});

test("real background primitive and serializer keep both resource forms valid in the ZIP", () => {
  const cell = renderPrimitive("background-image", { src: "images/logo.png", width: 252, height: 188 }, "Live text");
  const serialized = serializeEmailHtml({ html: `<table><tr>${cell}</tr></table>` });
  assert.deepEqual(serialized.diagnostics, []);
  const rebased = rebasePackageResources({ html: serialized.html, assetPaths: ["images/logo.png"], htmlEntry: "email.html", assetRootEntry: "images" });
  assert.deepEqual(rebased.diagnostics, []);
  assert.equal(rebased.references.length, 2);
  const packaged = buildAltcraftEntries({ html: rebased.html, assetBuffers: new Map([["images/logo.png", image]]), deliveryDocument: { subject: "Тема", sender: { mode: "inherit" }, reply_to: { mode: "inherit" } }, plainText: "Live text", profile });
  assert.deepEqual(packaged.diagnostics, []);
  const entries = storedEntries(encodeZipStore(packaged.entries));
  assert.deepEqual(entries.get("images/logo.png"), image);
  const output = entries.get("email.html").toString("utf8");
  assert.ok(output.includes('background="images/logo.png"'));
  assert.ok(output.includes('background-image:url(&#39;images/logo.png&#39;)'));
});
