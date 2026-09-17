import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function primitives() {
  return import("../../scripts/lib/email-primitives.mjs");
}

test("table and cell keep email-critical attributes and styles inline", async () => {
  const { renderPrimitive } = await primitives();
  const cell = renderPrimitive(
    "cell",
    { valign: "middle", style: { padding: "12px" } },
    "Body",
  );
  const html = renderPrimitive(
    "table",
    { width: 600, style: { "background-color": "#F3F3F5" } },
    `<tr>${cell}</tr>`,
  );

  assert.equal(
    cell,
    '<td valign="middle" style="padding:12px;text-align:left;vertical-align:middle">Body</td>',
  );
  assert.equal(
    html,
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F3F5;border-collapse:collapse;border-spacing:0"><tbody><tr><td valign="middle" style="padding:12px;text-align:left;vertical-align:middle">Body</td></tr></tbody></table>',
  );
  assert.doesNotMatch(html, /<style|@media/iu);
});

test("text and link escape untrusted text and attributes", async () => {
  const { renderPrimitive } = await primitives();

  assert.equal(
    renderPrimitive("text", {
      text: '5 < 6 & "safe"',
      style: { color: "#101010", "font-size": "16px" },
    }),
    '<p style="color:#101010;font-size:16px;margin:0">5 &lt; 6 &amp; &quot;safe&quot;</p>',
  );
  assert.equal(
    renderPrimitive("link", {
      href: 'https://example.test/?a=1&b="2"',
      text: "Open <now>",
    }),
    '<a href="https://example.test/?a=1&amp;b=&quot;2&quot;" target="_blank" style="display:inline-block;text-decoration:none">Open &lt;now&gt;</a>',
  );
});

test("direct image uses fluid width with automatic proportional height", async () => {
  const { renderPrimitive } = await primitives();
  const html = renderPrimitive("direct-image", {
    src: "images/card.jpg",
    alt: 'Card & "badge"',
    width: 232,
    height: 148,
    fluid: true,
    style: { "border-radius": "18px" },
  });

  assert.equal(
    html,
    '<img src="images/card.jpg" width="232" alt="Card &amp; &quot;badge&quot;" border="0" style="border:0;border-radius:18px;display:block;height:auto;line-height:100%;max-width:100%;outline:none;text-decoration:none;width:100%">',
  );
  assert.match(html, /height:auto/u);
  assert.doesNotMatch(html, /\sheight="/u);
  assert.doesNotMatch(html, /height:148px/u);
});

test("background image renders as a presentation cell without alt", async () => {
  const { renderPrimitive } = await primitives();
  const html = renderPrimitive(
    "background-image",
    { src: "images/banner?a=1&b=2", width: 252, height: 188 },
    "Live text",
  );

  assert.equal(
    html,
    '<td background="images/banner?a=1&amp;b=2" width="252" height="188" valign="top" style="background-image:url(&#39;images/banner?a=1&amp;b=2&#39;);background-position:center;background-repeat:no-repeat;background-size:cover;height:188px;width:252px">Live text</td>',
  );
  assert.doesNotMatch(html, /\salt=/u);
});

test("responsive visibility primitive contains only the base visibility state", async () => {
  const { renderPrimitive } = await primitives();

  assert.equal(
    renderPrimitive(
      "responsive-visibility",
      { className: "cupis-root-0-mobile", hidden: true },
      "Mobile",
    ),
    '<div class="cupis-root-0-mobile" style="display:none;max-height:0;overflow:hidden">Mobile</div>',
  );
  assert.equal(
    renderPrimitive(
      "responsive-visibility",
      { className: "cupis-root-0-desktop", hidden: false },
      "Desktop",
    ),
    '<div class="cupis-root-0-desktop">Desktop</div>',
  );
});

test("unknown primitive fails explicitly", async () => {
  const { renderPrimitive } = await primitives();

  assert.throws(
    () => renderPrimitive("component-card", {}, ""),
    (error) => error.code === "PRIMITIVE_UNSUPPORTED",
  );
});

test("primitive module stays pure and component-agnostic", async () => {
  const source = await readFile(
    join(repoRoot, "scripts/lib/email-primitives.mjs"),
    "utf8",
  );

  assert.doesNotMatch(source, /node:fs|registry|figma/iu);
  for (const id of [
    "email-template",
    "button-primary",
    "card-image",
    "banner-secondary",
    "banner-app-download",
    "email-footer",
  ]) {
    assert.equal(source.includes(id), false, `unexpected component id ${id}`);
  }
});

test("direct image requires an own alt property and preserves explicit decorative alt", async () => {
  const { renderPrimitive } = await primitives();

  assert.throws(
    () => renderPrimitive("direct-image", { src: "images/decorative.png" }),
    (error) => error.code === "DIRECT_IMAGE_ALT_REQUIRED",
  );

  const html = renderPrimitive("direct-image", {
    src: "images/decorative.png",
    alt: "",
    width: 24,
    height: 24,
  });
  assert.match(html, /\salt=""/u);
});
test("email shell derives inner minimum width from the whole supported viewport", async () => {
  const { renderPrimitive } = await primitives();
  const html = renderPrimitive(
    "email-shell",
    {
      background_color: "#F3F3F5",
      horizontal_inset_px: 15,
      max_width_px: 600,
      min_supported_viewport_px: 300,
    },
    "Body",
  );

  assert.match(html, /min-width:270px/u);
  assert.doesNotMatch(html, /min-width:300px/u);
});