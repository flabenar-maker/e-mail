import assert from "node:assert/strict";
import test from "node:test";
import { serializeEmailHtml } from "../../scripts/lib/email-html-serializer.mjs";

const mso = "<!--[if mso]><v:rect fill=\"t\"><v:fill src=\"images/фон.png\" /></v:rect><![endif]-->";
const protectedText = "Привет {{first_name}} <a href=\"https://example.test?a=1&b=2\">рядом</a><span>!</span>";
const html = `<table role="presentation"><tbody><tr><td>${protectedText}</td></tr></tbody></table>${mso}<table><tr><td style="padding:0 0 0  ;">x</td></tr></table>`;
function optionsFor(value) {
  return { html:value, blockBoundaries:[{start:0,end:value.indexOf(mso)},{start:value.indexOf(mso),end:value.length}], protectedFragments:[{start:value.indexOf(protectedText),end:value.indexOf(protectedText)+protectedText.length,text:protectedText},{start:value.indexOf(mso),end:value.indexOf(mso)+mso.length,text:mso}], indentWidth:2 };
}
test("serializer adds structural lines without changing protected inline, MSO, URL, or Unicode payloads", () => {
  const result=serializeEmailHtml(optionsFor(html)); assert.deepEqual(result.diagnostics,[]); assert.match(result.html,/\n\s*<tbody>\n\s*<tr>/); assert.ok(result.html.includes(protectedText)); assert.ok(result.html.includes(mso)); assert.ok(result.html.includes('padding:0 0 0  ;'));
});
test("serializer is idempotent when protected spans are recomputed for its input", () => {
  const first=serializeEmailHtml(optionsFor(html)); const second=serializeEmailHtml(optionsFor(first.html)); assert.deepEqual(second.diagnostics,[]); assert.equal(second.html,first.html);
});
