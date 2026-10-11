import assert from "node:assert/strict";
import test from "node:test";
import { collectResourceReferences, rebasePackageResources } from "../../scripts/lib/email-resource-references.mjs";
const html = `<img src="images/Картинка%20A.png"><table background='images/bg.png'><tr><td style="background-image:url('images/bg.png')"><!--[if mso]><v:fill src="images/bg.png" /><![endif]--><a href="images/bg.png">не ресурс</a></td></tr></table>`;
const assetPaths = ["images/Картинка A.png", "images/bg.png"];
test("resource collector covers img, HTML background, CSS url, and VML but not href", () => {
  const refs = collectResourceReferences({ html });
  assert.deepEqual(refs.map(({ kind }) => kind).sort(), ["css-url", "html-background", "img-src", "vml-src"]);
  assert.equal(refs.some(({ raw_value }) => raw_value === "images/bg.png" && refs.length === 5), false);
});
test("rebase changes only exact declared asset ranges and preserves quoting and escaping", () => {
  const result = rebasePackageResources({ html, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
  assert.deepEqual(result.diagnostics, []); assert.match(result.html, /src="\.\.\/images\/Картинка%20A\.png"/);
  assert.match(result.html, /href="images\/bg\.png"/); assert.equal(result.references.length, 4);
});
test("rebase rejects case drift, path escapes, backslashes, and undeclared resources", () => {
  for (const bad of ["images/BG.png", "../images/bg.png", "images\\bg.png", "images/missing.png"]) {
    const result = rebasePackageResources({ html: `<img src="${bad}">`, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.ok(result.diagnostics.length > 0, bad);
  }
});
