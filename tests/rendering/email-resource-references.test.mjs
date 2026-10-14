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

test("root HTML retains exact img background inline CSS style CSS and VML resource bytes", () => {
  const source='<img src="images/Картинка%20A.png"><table background="images/bg.png"><tr><td style="background:url(\'images/bg.png\')"><!--[if mso]><v:fill src="images/bg.png" /><![endif]--></td></tr></table><style>.hero{background:url("images/bg.png")}</style>';
  const result=rebasePackageResources({html:source,assetPaths,htmlEntry:"email.html",assetRootEntry:"images"});
  assert.deepEqual(result.diagnostics,[]);assert.equal(result.html,source);
  assert.deepEqual(result.references.map(({kind})=>kind).sort(),["css-url","css-url","html-background","img-src","vml-src"]);
});
test("encoded CSS quote delimiters identify only the image span and survive root rebasing", () => {
  for(const quote of ["&#39;","&#x27;","&quot;","&#34;"]){
    const source=`<table background="images/bg.png"><tr><td style="background-image:url(${quote}images/bg.png${quote})">x</td></tr></table>`;
    const refs=collectResourceReferences({html:source});
    assert.deepEqual(refs.map(({raw_value})=>raw_value),["images/bg.png","images/bg.png"],quote);
    for(const ref of refs)assert.equal(source.slice(ref.start,ref.end),ref.raw_value);
    const result=rebasePackageResources({html:source,assetPaths,htmlEntry:"email.html",assetRootEntry:"images"});
    assert.deepEqual(result.diagnostics,[],quote);assert.equal(result.html,source,quote);
    const nested=rebasePackageResources({html:source,assetPaths,htmlEntry:"email/html.html",assetRootEntry:"images"});
    assert.deepEqual(nested.diagnostics,[],quote);
    assert.equal(nested.html,source.replaceAll("images/bg.png","../images/bg.png"),quote);
  }
});
