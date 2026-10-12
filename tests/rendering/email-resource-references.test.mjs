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
  // In a style element, HTML entities are literal CSS characters, not quoting.
  assert.equal(collectResourceReferences({ html: '<style>.x{background:url(&quot;images/bg.png&quot;)}</style>' }).length, 0);
});
