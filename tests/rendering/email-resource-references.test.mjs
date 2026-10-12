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

test("serialized CSS entity quotes preserve raw resource spans and rebase only paths", () => {
  for (const quote of ["&quot;", "&#39;", "&#x27;", "&apos;"]) {
    const input = `<td style="color:red;background-image:url( ${quote}images/bg.png${quote} )"><a href="images/bg.png?x=1&amp;y=2">link</a><!--opaque:images/bg.png--></td>`;
    const refs = collectResourceReferences({ html: input });
    assert.equal(refs.length, 1, quote);
    assert.equal(refs[0].raw_value, "images/bg.png", quote);
    assert.equal(input.slice(refs[0].start, refs[0].end), "images/bg.png", quote);
    const result = rebasePackageResources({ html: input, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.deepEqual(result.diagnostics, [], quote);
    assert.equal(result.html, `<td style="color:red;background-image:url( ${quote}../images/bg.png${quote} )"><a href="images/bg.png?x=1&amp;y=2">link</a><!--opaque:images/bg.png--></td>`);
  }
});

test("encoded resource prefix separator rebases without duplicating the asset root", () => {
  for (const path of ["%69mages%2Fcard%20A.png", "images&#47;card%20A.png"]) {
    const input = `<img src="${path}"><td style="background:url(&quot;${path}&quot;)">`;
    const result = rebasePackageResources({ html: input, assetPaths: ["images/card A.png"], htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.deepEqual(result.diagnostics, []);
    assert.equal(result.html, '<img src="../images/card%20A.png"><td style="background:url(&quot;../images/card%20A.png&quot;)">');
  }
});

test("unsafe serialized CSS resources fail closed with original HTML intact", () => {
  for (const path of ["https&#58;//example.com/bg.png", "data&#58;image/png,AAAA", "&#47;images/bg.png", "images/%2e%2e/bg.png", "images%5cbg.png", "images/BG.png", "images/missing.png"]) {
    const input = `<td style="background:url(&#39;${path}&#39;)">`;
    const result = rebasePackageResources({ html: input, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.ok(result.diagnostics.length > 0, path);
    assert.equal(result.html, input, path);
  }
});

test("repeated resources use their own offsets and style raw text keeps literal entities", () => {
  const input = '<td style="background:url(&quot;images/bg.png&quot;),url(&#39;images/bg.png&#39;)"><style>.x{background:url("images/bg.png")}</style>';
  const result = rebasePackageResources({ html: input, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.references.length, 3);
  assert.equal(result.html, '<td style="background:url(&quot;../images/bg.png&quot;),url(&#39;../images/bg.png&#39;)"><style>.x{background:url("../images/bg.png")}</style>');
  // In a style element, entities are literal URL characters, not quoting.
  const literal = '<style>.x{background:url(&quot;images/bg.png&quot;)}</style>';
  const refs = collectResourceReferences({ html: literal });
  assert.equal(refs.length, 1);
  assert.equal(refs[0].raw_value, '&quot;images/bg.png&quot;');
  assert.equal(literal.slice(refs[0].start, refs[0].end), '&quot;images/bg.png&quot;');
  const rejected = rebasePackageResources({ html: literal, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
  assert.ok(rejected.diagnostics.length > 0);
  assert.equal(rejected.html, literal);
});

test("HTML entities decode once in attributes and stay literal in stylesheet resource names", () => {
  const input = '<td style="background:url(&quot;images/bg&amp;.png&quot;)"><style>.x{background:url("images/bg&amp;.png")}</style>';
  const result = rebasePackageResources({ html: input, assetPaths: ["images/bg&.png", "images/bg&amp;.png"], htmlEntry: "email/html.html", assetRootEntry: "images" });
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.html, '<td style="background:url(&quot;../images/bg&amp;.png&quot;)"><style>.x{background:url("../images/bg&amp;.png")}</style>');
  for (const [html, declared, foreign] of [
    ['<style>.x{background:url("images/bg&amp;.png")}</style>', 'images/bg&amp;.png', 'images/bg&.png'],
    ['<td style="background:url(&quot;images/bg&amp;.png&quot;)">', 'images/bg&.png', 'images/bg&amp;.png'],
  ]) {
    const matching = rebasePackageResources({ html, assetPaths: [declared], htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.deepEqual(matching.diagnostics, []);
    assert.equal(matching.html, html.replace('images/', '../images/'));
    const wrongContext = rebasePackageResources({ html, assetPaths: [foreign], htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.ok(wrongContext.diagnostics.length > 0);
    assert.equal(wrongContext.html, html);
  }
  for (const [html, declared] of [['<img src="images/bg&#38;amp;.png">', 'images/bg&amp;.png']]) {
    const once = rebasePackageResources({ html, assetPaths: [declared], htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.deepEqual(once.diagnostics, []);
    assert.equal(once.html, html.replace('images/', '../images/'));
  }
  // The browser leaves the nested numeric spelling literal after one decode;
  // it must not alias a declared path containing an extra directory separator.
  const nested = '<img src="images/bg&amp;#47;.png">';
  const alias = rebasePackageResources({ html: nested, assetPaths: ['images/bg/.png'], htmlEntry: "email/html.html", assetRootEntry: "images" });
  assert.ok(alias.diagnostics.length > 0);
  assert.equal(alias.html, nested);
});

test("only actual case-sensitive HTML entity names bind declared resources", () => {
  for (const quote of ["&QUOT;", "&#X27;"]) {
    const html = `<td style="background:url(${quote}images/bg.png${quote})">`;
    const valid = rebasePackageResources({ html, assetPaths, htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.deepEqual(valid.diagnostics, []);
    assert.equal(valid.html, html.replace('images/', '../images/'));
  }
  for (const html of ['<td style="background:url(&QuOt;images/bg.png&QuOt;)">', '<td style="background:url(&APOS;images/bg.png&APOS;)">', '<img src="images/bg&aMp;.png">']) {
    const invalid = rebasePackageResources({ html, assetPaths: [...assetPaths, 'images/bg&.png'], htmlEntry: "email/html.html", assetRootEntry: "images" });
    assert.ok(invalid.diagnostics.length > 0, html);
    assert.equal(invalid.html, html);
  }
});
