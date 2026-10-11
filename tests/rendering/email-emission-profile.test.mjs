import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  createViewportRules,
  resolveEmissionProfile,
} from "../../scripts/lib/email-emission-profile.mjs";
import { renderContractTree } from "../../scripts/lib/email-interpreter.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const renderingFoundation = {
  breakpoints: [{ id: "cupis-mobile", query: "max-width", value: 659, unit: "px" }],
};
const coverage = { component_id: "altcraft-scenario", mode: "interpreter" };

const scenarios = JSON.parse(await readFile(
  join(repoRoot, "tests", "fixtures", "rendering", "altcraft-profile-scenarios.json"),
  "utf8",
));

function element({
  id,
  role = id,
  mode = "presentation-table",
  visibility = { mode: "always" },
  facts = [],
  children = [],
  contentSlots = [],
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
    ...(assetContractId ? { asset_contract_id: assetContractId } : {}),
  };
}

function text(id, value, visibility = { mode: "always" }) {
  return element({
    id,
    mode: "html-text",
    visibility,
    contentSlots: [{ id: "text", type: "plain-text", required: true }],
    facts: [{ id: "reference-size", value: { type: "dimensions", width: 120, height: 20, unit: "px" } }],
    children: [],
    value,
  });
}

function component(mobileRoot, desktopRoot = structuredClone(mobileRoot)) {
  return {
    id: coverage.component_id,
    contracts: { mobile: { root: mobileRoot }, desktop: { root: desktopRoot } },
  };
}

function altcraftProfile() {
  return resolveEmissionProfile({
    deliveryProfile: scenarios.profile,
    renderingFoundation,
  });
}

function renderScenario({ mobile, desktop, content, assets = {} }) {
  return renderContractTree({
    component: component(mobile, desktop),
    coverage,
    content,
    assets,
    properties: {},
    foundations: { rendering: renderingFoundation },
    emissionProfile: altcraftProfile(),
  });
}

test("profile-without-delivery-preserves-current-default", () => {
  const profile = resolveEmissionProfile({ renderingFoundation });
  assert.equal(profile.fallback_viewport, "desktop");
  assert.equal(profile.id, "desktop-default");
});

test("altcraft-profile-has-mobile-fallback", () => {
  const profile = altcraftProfile();
  assert.equal(profile.id, "altcraft-mobile-base-v1");
  assert.equal(profile.version, "1.0.0");
  assert.equal(profile.fallback_viewport, "mobile");
  assert.equal(profile.mso_desktop, true);
  assert.equal(profile.preserve_structural_splits, true);
});

test("desktop-needs-both-widths", () => {
  const profile = altcraftProfile();
  assert.equal(profile.desktop_condition.viewport_min_px, 660);
  assert.equal(profile.desktop_condition.device_min_px, 660);
  const rules = createViewportRules({
    profile,
    classes: { mobile: "scenario-mobile", desktop: "scenario-desktop" },
    mobileDisplay: "table",
    desktopDisplay: "table",
  });
  assert.equal(rules.ordinaryRules.length, 1);
  assert.match(rules.ordinaryRules[0], /min-width:660px/u);
  assert.match(rules.ordinaryRules[0], /min-device-width:660px/u);
  assert.match(rules.ordinaryRules[0], /scenario-mobile\s*\{\s*display:none!important/u);
  assert.match(rules.ordinaryRules[0], /scenario-desktop\s*\{\s*display:table!important/u);
});

test("Altcraft viewport CSS keeps declarations readable without mixing the MSO branch", () => {
  const rules = createViewportRules({
    profile: altcraftProfile(),
    classes: { mobile: "scenario-mobile", desktop: "scenario-desktop" },
    mobileDisplay: "table",
    desktopDisplay: "table",
  });
  const [ordinary] = rules.ordinaryRules;
  const [mso] = rules.msoRules;

  assert.match(ordinary, /@media only screen and \(min-width:660px\) and \(min-device-width:660px\)\s*\{\s*\n/u);
  assert.match(ordinary, /\.scenario-mobile\s*\{\s*\n\s+display:none!important;\s*\n\s+max-height:0!important;\s*\n\s+overflow:hidden!important;\s*\n\s*\}/u);
  assert.match(ordinary, /\.scenario-desktop\s*\{\s*\n\s+display:table!important;\s*\n\s+max-height:none!important;\s*\n\s+overflow:visible!important;\s*\n\s*\}/u);
  assert.doesNotMatch(ordinary, /mso/iu);
  assert.match(mso, /\.scenario-desktop\s*\{\s*\n\s+display:table!important;\s*\n\s+max-height:none!important;\s*\n\s+overflow:visible!important;\s*\n\s*\}/u);
  assert.doesNotMatch(mso, /@media/iu);
});

test("unknown-profile-rejected", () => {
  assert.throws(
    () => resolveEmissionProfile({
      deliveryProfile: { id: "unknown-profile", version: "1.0.0", emission: scenarios.profile.emission },
      renderingFoundation,
    }),
    (error) => error?.code === "EMISSION_PROFILE_UNKNOWN",
  );
});

test("no-css-shows-mobile-once", () => {
  const mobile = element({ id: "root", children: [text("mobile-copy", "mobile copy")] });
  const desktop = element({ id: "root", children: [text("desktop-copy", "desktop copy")] });
  const result = renderScenario({
    mobile,
    desktop,
    content: {
      "mobile-copy": { text: { type: "plain-text", value: "mobile copy" } },
      "desktop-copy": { text: { type: "plain-text", value: "desktop copy" } },
    },
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /mobile copy/u);
  assert.match(result.html, /desktop copy/u);
  const mobileTag = result.html.match(/<div\b(?=[^>]*\bclass="cupis-root(?:-\d+)?-mobile")[^>]*>/u);
  assert.ok(mobileTag, "the mobile wrapper must be emitted");
  assert.doesNotMatch(mobileTag[0], /display\s*:\s*none/iu);
  assert.match(result.html, /cupis-root(?:-\d+)?-desktop[^>]*style="[^"]*display\s*:\s*none/u);
  assert.match(result.css, /min-width:660px/u);
  assert.match(result.css, /min-device-width:660px/u);
  assert.equal((result.html.match(/mobile copy/gu) ?? []).length, 1);
});

test("viewport-980-device-390-keeps-mobile-and-660-is-the-desktop-boundary", () => {
  const profile = altcraftProfile();
  const rules = createViewportRules({
    profile,
    classes: { mobile: "scenario-mobile", desktop: "scenario-desktop" },
    mobileDisplay: "block",
    desktopDisplay: "block",
  });
  const css = rules.ordinaryRules.join("");
  for (const scenario of scenarios.viewport_cases) {
    const desktop = scenario.viewport_width >= profile.desktop_condition.viewport_min_px
      && scenario.device_width >= profile.desktop_condition.device_min_px;
    assert.equal(desktop ? "desktop" : "mobile", scenario.expected);
  }
  assert.match(css, /min-width:660px/u);
  assert.match(css, /min-device-width:660px/u);
});

test("mobile-only-and-desktop-only-nodes-remain-visible-in-their-own-mode", () => {
  const mobile = element({
    id: "root",
    children: [text("mobile-only", "mobile only", { mode: "always" })],
  });
  const desktop = element({
    id: "root",
    children: [text("desktop-only", "desktop only", { mode: "always" })],
  });
  const result = renderScenario({
    mobile,
    desktop,
    content: {
      "mobile-only": { text: { type: "plain-text", value: "mobile only" } },
      "desktop-only": { text: { type: "plain-text", value: "desktop only" } },
    },
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /mobile only/u);
  assert.match(result.html, /desktop only/u);
  assert.match(result.css, /min-width:660px/u);
});

test("different-tree-preserves-split-and-keeps-mso-rules-conditional", () => {
  const mobile = element({ id: "root", children: [text("mobile-copy", "mobile tree")] });
  const desktop = element({
    id: "root",
    children: [element({
      id: "desktop-link",
      mode: "html-link",
      contentSlots: [
        { id: "href", type: "url", required: true },
        { id: "text", type: "plain-text", required: true },
      ],
    })],
  });
  const result = renderScenario({
    mobile,
    desktop,
    content: {
      "mobile-copy": { text: { type: "plain-text", value: "mobile tree" } },
      "desktop-link": {
        href: { type: "url", value: "https://example.test/desktop" },
        text: { type: "plain-text", value: "desktop tree" },
      },
    },
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /mobile tree/u);
  assert.match(result.html, /desktop tree/u);
  assert.match(result.html, /\[if !mso\]/iu);
  assert.match(result.msoCss, /cupis-root(?:-\d+)?-desktop/u);
  assert.doesNotMatch(result.css, /mso/iu);
  assert.doesNotMatch(result.css, /cupis-root(?:-\d+)?-desktop\s*\{[^}]*display:table/u);
});

test("split-div-wrappers-restore-block-and-inner-tables-retain-native-display", () => {
  const image = (id, sizing, width, height) => element({
    id,
    role: "image",
    mode: "direct-image",
    assetContractId: `${id}-asset`,
    facts: [
      { id: "reference-size", value: { type: "dimensions", width, height, unit: "px" } },
      { id: "horizontal-sizing", value: { type: "keyword", value: sizing } },
    ],
    contentSlots: [{ id: "alt", type: "alt-text", required: true }],
  });
  const rootFacts = [
    { id: "layout-axis", value: { type: "keyword", value: "vertical" } },
    { id: "layout-gap", value: { type: "measure", value: 0, unit: "px" } },
  ];
  const mobile = element({ id: "root", facts: rootFacts, children: [image("fixed", "fixed", 32, 20), image("fill", "fill", 252, 188)] });
  const desktop = structuredClone(mobile);
  desktop.children[0].facts[0].value.width = 48;
  const result = renderScenario({
    mobile,
    desktop,
    content: {
      fixed: { alt: { type: "alt-text", value: "Fixed" } },
      fill: { alt: { type: "alt-text", value: "Fill" } },
    },
    assets: {
      "fixed-asset": { src: "images/fixed.png" },
      "fill-asset": { src: "images/fill.png" },
    },
  });
  assert.deepEqual(result.diagnostics, []);
  assert.match(result.css, /cupis-root(?:-\d+)?-(?:mobile|desktop)\s*\{\s*display:block!important/u);
  assert.match(result.html, /<div class="cupis-root(?:-\d+)?-(?:mobile|desktop)"/u);
  assert.match(result.html, /<table\b/u);
  const fixed = [...result.html.matchAll(/<img\b[^>]*src="images\/fixed\.png"[^>]*>/gu)].map((match) => match[0]);
  const fill = [...result.html.matchAll(/<img\b[^>]*src="images\/fill\.png"[^>]*>/gu)].map((match) => match[0]);
  assert.ok(fixed.length > 0);
  assert.ok(fill.length > 0);
  for (const tag of fixed) {
    const style = tag.match(/\sstyle="([^"]*)"/u);
    assert.ok(style);
    assert.doesNotMatch(style[1], /(?:^|;)\s*width\s*:\s*100%/u);
    assert.match(tag, /min-width:(?:32|48)px/u);
  }
  for (const tag of fill) {
    const style = tag.match(/\sstyle="([^"]*)"/u);
    assert.ok(style);
    assert.match(style[1], /(?:^|;)\s*width\s*:\s*100%/u);
    assert.match(tag, /height:auto/u);
    assert.doesNotMatch(tag, /\sheight="/u);
  }
});

test("ordinary-and-mso-css-share-the-16384-byte-budget", () => {
  const profile = altcraftProfile();
  const rules = createViewportRules({
    profile,
    classes: { mobile: "scenario-mobile", desktop: "scenario-desktop" },
    mobileDisplay: "block",
    desktopDisplay: "block",
  });
  const bytes = Buffer.byteLength(rules.ordinaryRules.join(""), "utf8")
    + Buffer.byteLength(rules.msoRules.join(""), "utf8");
  assert.equal(bytes < 16384, true);
  assert.ok(rules.msoRules.every((rule) => !rules.ordinaryRules.includes(rule)));
});
