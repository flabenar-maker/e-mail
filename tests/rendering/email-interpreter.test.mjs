import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const rendering = {
  breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 659, unit: "px" }],
};

async function interpreter() {
  return import("../../scripts/lib/email-interpreter.mjs");
}

function element({
  id,
  role = id,
  mode = "presentation-table",
  visibility = { mode: "always" },
  facts = [],
  children = [],
  contentSlots = [],
  componentId,
  assetContractId,
}) {
  return {
    id,
    semantic_role: role,
    render_mode: mode,
    visibility,
    facts,
    children,
    ...(contentSlots.length > 0 ? { content_slots: contentSlots } : {}),
    ...(componentId ? { component_id: componentId } : {}),
    ...(assetContractId ? { asset_contract_id: assetContractId } : {}),
  };
}

function measure(id, value, unit = "px") {
  return { id, value: { type: "measure", value, unit } };
}

function component(mobileRoot, desktopRoot = structuredClone(mobileRoot)) {
  return {
    id: "test-component",
    contracts: {
      mobile: { root: mobileRoot },
      desktop: { root: desktopRoot },
    },
  };
}

const coverage = { component_id: "test-component", mode: "interpreter" };

test("viewport pairing shares matching structure while retaining exact facts", async () => {
  const { pairViewportTrees } = await interpreter();
  const mobile = element({
    id: "root",
    children: [
      element({
        id: "title",
        role: "heading",
        mode: "html-text",
        facts: [measure("heading-font-size", 14)],
        contentSlots: [{ id: "text", type: "plain-text", required: true }],
      }),
    ],
  });
  const desktop = structuredClone(mobile);
  desktop.children[0].facts[0].value.value = 16;
  const before = structuredClone({ mobile, desktop });

  const paired = pairViewportTrees({ mobile, desktop });

  assert.equal(paired.kind, "paired");
  assert.equal(paired.children[0].kind, "paired");
  assert.equal(paired.children[0].mobile.facts[0].value.value, 14);
  assert.equal(paired.children[0].desktop.facts[0].value.value, 16);
  assert.deepEqual({ mobile, desktop }, before);
});

test("viewport pairing splits only the first structurally different subtree", async () => {
  const { pairViewportTrees } = await interpreter();
  const mobile = element({
    id: "root",
    children: [
      element({ id: "lead", mode: "html-text" }),
      element({ id: "tail", mode: "html-text" }),
    ],
  });
  const desktop = structuredClone(mobile);
  desktop.children[0].render_mode = "html-link";
  desktop.children[0].content_slots = [
    { id: "href", type: "url", required: true },
    { id: "text", type: "plain-text", required: true },
  ];

  const paired = pairViewportTrees({ mobile, desktop });

  assert.equal(paired.kind, "paired");
  assert.equal(paired.children[0].kind, "split");
  assert.equal(paired.children[1].kind, "paired");
});

test("viewport pairing treats visibility and references as structure", async () => {
  const { pairViewportTrees } = await interpreter();
  const mobile = element({
    id: "image",
    role: "image",
    mode: "direct-image",
    assetContractId: "asset-a",
  });
  const desktop = structuredClone(mobile);
  desktop.asset_contract_id = "asset-b";

  assert.equal(pairViewportTrees({ mobile, desktop }).kind, "split");

  desktop.asset_contract_id = "asset-a";
  desktop.visibility = { mode: "property", property_id: "show-image" };
  assert.equal(pairViewportTrees({ mobile, desktop }).kind, "split");
});

test("interpreter renders an exact shared tree once and escapes content", async () => {
  const { renderContractTree } = await interpreter();
  const root = element({
    id: "root",
    children: [
      element({
        id: "title",
        role: "heading",
        mode: "html-text",
        facts: [measure("heading-font-size", 16)],
        contentSlots: [{ id: "text", type: "plain-text", required: true }],
      }),
    ],
  });

  const result = renderContractTree({
    component: component(root),
    coverage,
    content: { title: { text: { type: "plain-text", value: "Hello <team>" } } },
    assets: {},
    properties: {},
    foundations: { rendering },
  });

  assert.equal(
    result.html,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0;width:100%"><tbody><tr><td valign="top" style="padding:0;text-align:left;vertical-align:top"><p style="font-size:16px;margin:0">Hello &lt;team&gt;</p></td></tr></tbody></table>',
  );
  assert.equal(result.css, "");
  assert.deepEqual(result.diagnostics, []);
});

test("Mobile text growing on a vertical parent retains its reference width", async () => {
  const { renderContractTree } = await interpreter();
  const root = element({
    id: "root",
    facts: [{ id: "layout-axis", value: { type: "keyword", value: "vertical" } }],
    children: [
      element({
        id: "copy",
        mode: "html-text",
        facts: [
          { id: "reference-size", value: { type: "dimensions", width: 80, height: 20, unit: "px" } },
          { id: "layout-grow", value: { type: "number", value: 1 } },
          { id: "layout-align", value: { type: "keyword", value: "inherit" } },
        ],
        contentSlots: [{ id: "text", type: "plain-text", required: true }],
      }),
    ],
  });

  const result = renderContractTree({
    component: component(root),
    coverage,
    content: { copy: { text: { type: "plain-text", value: "Vertical grow" } } },
    assets: {},
    properties: {},
    foundations: { rendering },
  });

  assert.match(result.html, /<p style="[^"]*max-width:80px/u);
  assert.doesNotMatch(result.html, /<p style="[^"]*width:100%/u);
  assert.deepEqual(result.diagnostics, []);
});

test("Mobile stretch text in a horizontal parent retains its reference width", async () => {
  const { renderContractTree } = await interpreter();
  const root = element({
    id: "root",
    facts: [{ id: "layout-axis", value: { type: "keyword", value: "horizontal" } }],
    children: [
      element({
        id: "copy",
        mode: "html-text",
        facts: [
          { id: "reference-size", value: { type: "dimensions", width: 80, height: 20, unit: "px" } },
          { id: "layout-grow", value: { type: "number", value: 0 } },
          { id: "layout-align", value: { type: "keyword", value: "stretch" } },
        ],
        contentSlots: [{ id: "text", type: "plain-text", required: true }],
      }),
    ],
  });

  const result = renderContractTree({
    component: { ...component(root), identity: { library: "marketing" } },
    coverage,
    content: { copy: { text: { type: "plain-text", value: "Horizontal stretch" } } },
    assets: {},
    properties: {},
    foundations: { rendering },
  });

  assert.match(result.html, /<p style="[^"]*max-width:80px/u);
  assert.doesNotMatch(result.html, /<p style="[^"]*width:100%/u);
  assert.deepEqual(result.diagnostics, []);
});

test("interpreter emits a minimal responsive split when paired facts differ", async () => {
  const { renderContractTree } = await interpreter();
  const mobile = element({
    id: "root",
    children: [
      element({
        id: "title",
        role: "heading",
        mode: "html-text",
        facts: [measure("heading-font-size", 14)],
        contentSlots: [{ id: "text", type: "plain-text", required: true }],
      }),
    ],
  });
  const desktop = structuredClone(mobile);
  desktop.children[0].facts[0].value.value = 16;

  const result = renderContractTree({
    component: component(mobile, desktop),
    coverage,
    content: { title: { text: { type: "plain-text", value: "Title" } } },
    assets: {},
    properties: {},
    foundations: { rendering },
  });

  assert.match(result.html, /<table[^>]+><tbody><tr><td[^>]+><div class="cupis-root-0-mobile"/u);
  assert.match(result.html, /font-size:14px/u);
  assert.match(result.html, /class="cupis-root-0-desktop"/u);
  assert.match(result.html, /font-size:16px/u);
  assert.equal(
    result.css,
    "@media only screen and (max-width:659px){.cupis-root-0-desktop{display:none!important;max-height:0!important;overflow:hidden!important}.cupis-root-0-mobile{display:block!important;max-height:none!important;overflow:visible!important}}",
  );
  assert.deepEqual(result.diagnostics, []);
});

test("property visibility omits disabled subtrees", async () => {
  const { renderContractTree } = await interpreter();
  const root = element({
    id: "root",
    children: [
      element({
        id: "optional-copy",
        mode: "html-text",
        visibility: { mode: "property", property_id: "show-copy" },
        contentSlots: [{ id: "text", type: "plain-text", required: true }],
      }),
    ],
  });

  const result = renderContractTree({
    component: component(root),
    coverage,
    content: { "optional-copy": { text: { type: "plain-text", value: "Hidden" } } },
    assets: {},
    properties: { "show-copy": false },
    foundations: { rendering },
  });

  assert.doesNotMatch(result.html, /Hidden/u);
  assert.deepEqual(result.diagnostics, []);
});

test("interpreter dispatches supported modes without rendering Figma-only nodes", async () => {
  const { renderContractTree } = await interpreter();
  const root = element({
    id: "root",
    facts: [
      { id: "layout-axis", value: { type: "keyword", value: "vertical" } },
      measure("layout-gap", 0),
    ],
    children: [
      element({
        id: "link",
        mode: "html-link",
        contentSlots: [{ id: "href", type: "url", required: true }],
        children: [
          element({
            id: "icon",
            role: "image",
            mode: "direct-image",
            assetContractId: "icon-asset",
            contentSlots: [{ id: "alt", type: "alt-text", required: true }],
          }),
        ],
      }),
      element({
        id: "background",
        mode: "background-image",
        assetContractId: "background-asset",
        children: [
          element({
            id: "live-copy",
            mode: "html-text",
            contentSlots: [{ id: "text", type: "plain-text", required: true }],
          }),
        ],
      }),
      element({
        id: "nested",
        mode: "nested-component",
        componentId: "child-component",
        children: [
          element({
            id: "nested-copy",
            mode: "html-text",
            contentSlots: [{ id: "text", type: "plain-text", required: true }],
          }),
        ],
      }),
      element({
        id: "slot",
        mode: "slot",
        children: [
          element({
            id: "slot-copy",
            mode: "html-text",
            contentSlots: [{ id: "text", type: "plain-text", required: true }],
          }),
        ],
      }),
      element({ id: "source", mode: "figma-source-only" }),
      element({ id: "nothing", mode: "none" }),
    ],
  });

  const result = renderContractTree({
    component: component(root),
    coverage,
    content: {
      link: { href: { type: "url", value: "https://example.test" } },
      icon: { alt: { type: "alt-text", purpose: "informative", value: "Icon" } },
      "live-copy": { text: { type: "plain-text", value: "Live" } },
      "nested-copy": { text: { type: "plain-text", value: "Nested" } },
      "slot-copy": { text: { type: "plain-text", value: "Slot" } },
    },
    assets: {
      "icon-asset": { src: "images/icon.png", width: 32, height: 32 },
      "background-asset": { src: "images/background.jpg", width: 252, height: 188 },
    },
    properties: {},
    foundations: { rendering },
  });

  assert.match(result.html, /<a href="https:\/\/example\.test"/u);
  assert.match(result.html, /<img src="images\/icon\.png"/u);
  assert.match(result.html, /background="images\/background\.jpg"/u);
  assert.match(result.html, />Live</u);
  assert.match(result.html, />Nested</u);
  assert.match(result.html, />Slot</u);
  assert.doesNotMatch(result.html, /source|nothing/u);
  assert.deepEqual(result.diagnostics, []);
});

test("unsupported render mode returns one stable diagnostic at the exact viewport path", async () => {
  const { renderContractTree } = await interpreter();
  const mobile = element({ id: "root", mode: "unknown-mode" });
  const desktop = element({ id: "root", mode: "none" });

  const result = renderContractTree({
    component: component(mobile, desktop),
    coverage,
    content: {},
    assets: {},
    properties: {},
    foundations: { rendering },
  });

  assert.equal(result.html, "");
  assert.equal(result.css, "");
  assert.deepEqual(result.diagnostics, [
    {
      code: "RENDER_MODE_UNSUPPORTED",
      path: "/contracts/mobile/root",
      message: "Unsupported render mode: unknown-mode.",
    },
  ]);
});

test("interpreter source contains no pilot-specific rendering logic", async () => {
  const source = await readFile(
    join(repoRoot, "scripts/lib/email-interpreter.mjs"),
    "utf8",
  );
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

test("a shared table splits around viewport-specific background cells", async () => {
  const { renderContractTree } = await interpreter();
  const mobile = element({
    id: "root",
    children: [
      element({
        id: "media",
        mode: "direct-image",
        assetContractId: "media-asset",
        contentSlots: [{ id: "alt", type: "alt-text", required: true }],
      }),
    ],
  });
  const desktop = structuredClone(mobile);
  desktop.children[0].render_mode = "background-image";
  desktop.children[0].content_slots = [];

  const result = renderContractTree({
    component: component(mobile, desktop),
    coverage,
    content: { media: { alt: { type: "alt-text", value: "Media" } } },
    assets: { "media-asset": { src: "images/media.jpg", width: 252, height: 188 } },
    properties: {},
    foundations: { rendering },
  });

  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /<tr><td background="images\/media\.jpg"/u);
  assert.doesNotMatch(result.html, /<td[^>]*><td background=/u);
  assert.doesNotMatch(result.html, /<tr><td[^>]*><div[^>]*><td background=/u);
});
