import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  indexComponentRegistries,
  loadComponentRegistries,
} from "../../scripts/lib/component-registry.mjs";
import { loadRenderingFoundation } from "../../scripts/lib/rendering-foundation.mjs";
import { loadRendererRegistry } from "../../scripts/lib/renderer-registry.mjs";
import { loadEmailModel } from "../../scripts/lib/email-model.mjs";
import { renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixturePath = join(repoRoot, "tests/fixtures/rendering/pilot-email.json");
const schemaPath = join(repoRoot, "schemas/email-model.schema.json");

async function pilot() {
  const [model, registries, rendererRegistry, rendering] = await Promise.all([
    loadEmailModel({ modelPath: fixturePath, schemaPath }),
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  return {
    model,
    dependencies: {
      componentIndex: indexComponentRegistries(registries),
      rendererRegistry,
      foundations: { rendering },
    },
  };
}

function instance(model, componentId) {
  const result = model.root.slots[0].instances.find(
    ({ component_id }) => component_id === componentId,
  );
  assert.ok(result, "Missing pilot instance: " + componentId);
  return result;
}

function attribute(tag, name) {
  const match = new RegExp("(?:^|\\s)" + name + "=\"([^\"]*)\"", "u").exec(tag);
  return match?.[1];
}

function cssValue(style, name) {
  return style.split(";").find((entry) => entry.startsWith(name + ":"))?.slice(name.length + 1);
}

function checkTableNesting(html) {
  const documentHtml = html.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/giu, "");
  const stack = [];
  const expectedParent = { tbody: "table", tr: "tbody", td: "tr" };
  let tables = 0;
  for (const match of documentHtml.matchAll(/<(\/?)(table|tbody|tr|td)\b[^>]*>/gu)) {
    const [, closing, tag] = match;
    if (closing) {
      assert.equal(stack.pop(), tag, "Unbalanced closing </" + tag + ">");
      continue;
    }
    if (tag === "table") {
      tables += 1;
      if (stack.length > 0) {
        assert.equal(stack.at(-1), "td", "Nested table must be inside a cell");
      }
      assert.equal(attribute(match[0], "role"), "presentation");
    } else {
      assert.equal(
        stack.at(-1),
        expectedParent[tag],
        "<" + tag + "> must be inside <" + expectedParent[tag] + ">",
      );
    }
    stack.push(tag);
  }
  assert.ok(tables > 0, "Pilot email must contain presentation tables");
  assert.deepEqual(stack, [], "Table tags must be balanced");
}

test("pilot HTML has properly nested, balanced presentation tables", async () => {
  const { model, dependencies } = await pilot();
  const result = renderEmailDocument(model, dependencies);

  assert.deepEqual(result.diagnostics, []);
  checkTableNesting(result.html);
});

test("all rendered local image references are declared and portable", async () => {
  const { model, dependencies } = await pilot();
  const result = renderEmailDocument(model, dependencies);
  const declared = new Set(result.assets.map(({ path }) => path));
  const references = [
    ...result.html.matchAll(/\b(?:src|background)="([^"]+)"/gu),
  ].map((match) => match[1]);

  assert.deepEqual(result.diagnostics, []);
  assert.ok(references.length > 0);
  for (const reference of references) {
    assert.match(reference, /^images\/[a-z0-9][a-z0-9._/-]*$/u);
    assert.equal(declared.has(reference), true, "Undeclared asset: " + reference);
  }
  assert.deepEqual(new Set(references), declared);
  assert.doesNotMatch(
    result.html,
    /(?:file:\/\/|[a-z]:\\|\\Users\\|\/Users\/|\/AppData\/Local\/Temp\/|\.\.\/)/iu,
  );
});

test("direct image dimensions are positive integers and fluid @2x images keep automatic height", async () => {
  const { model, dependencies } = await pilot();
  const result = renderEmailDocument(model, dependencies);
  const images = [...result.html.matchAll(/<img\b[^>]*>/gu)].map((match) => match[0]);

  assert.deepEqual(result.diagnostics, []);
  assert.ok(images.length > 0);
  for (const image of images) {
    for (const name of ["width", "height"]) {
      const value = attribute(image, name);
      if (value !== undefined) {
        assert.match(value, /^[1-9][0-9]*$/u, name + " must be a positive integer");
      }
    }
    const style = attribute(image, "style") ?? "";
    if (cssValue(style, "width") === "100%") {
      assert.match(style, /(?:^|;)height:auto(?:;|$)/u);
      assert.doesNotMatch(style, /(?:^|;)height:[0-9]+px(?:;|$)/u);
    }
  }
  const secondary = images.filter((image) => attribute(image, "src") === "images/secondary.jpg");
  assert.equal(secondary.length, 1);
  assert.ok(secondary.some((image) => attribute(image, "width") === "296"));
  assert.equal(attribute(secondary[0], "height"), undefined);
  assert.equal(cssValue(attribute(secondary[0], "style") ?? "", "width"), "100%");
  assert.match(attribute(secondary[0], "style") ?? "", /(?:^|;)height:auto(?:;|$)/u);
});

test("pilot has no unresolved placeholders and repeats the declared section order", async () => {
  const { model, dependencies } = await pilot();
  const first = renderEmailDocument(model, dependencies);
  const second = renderEmailDocument(structuredClone(model), dependencies);

  assert.deepEqual(first.diagnostics, []);
  assert.equal(first.html, second.html);
  assert.deepEqual(first.assets, second.assets);
  assert.doesNotMatch(first.html, /\{\{[^{}]*\}\}|\[object Object\]|\bundefined\b|resolved-slot|cupis:technical/iu);
  const landmarks = [
    "images/secondary.jpg",
    "images/app-logo.png",
    "images/vk-icon.png",
  ];
  const positions = landmarks.map((landmark) => first.html.indexOf(landmark));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
});

test("all four Footer boolean combinations control caption and social assets independently", async () => {
  const { model, dependencies } = await pilot();
  const record = dependencies.componentIndex.bySystemId.get("email-footer");
  assert.deepEqual(
    record.properties.filter(({ type }) => type === "boolean").map(({ id }) => id).sort(),
    ["show-caption", "show-social-links"],
  );

  for (const caption of [false, true]) {
    for (const social of [false, true]) {
      const variant = structuredClone(model);
      const footer = instance(variant, "email-footer");
      footer.property_values.find(({ property_id }) => property_id === "show-caption").value = caption;
      footer.property_values.find(({ property_id }) => property_id === "show-social-links").value = social;
      const result = renderEmailDocument(variant, dependencies);
      assert.deepEqual(result.diagnostics, [], "Footer combination " + caption + "/" + social);
      assert.equal(result.html.includes("Скрытая подпись"), caption);
      assert.equal(result.html.includes("https://example.test/vk"), social);
      assert.equal(result.html.includes("images/vk-icon.png"), social);
      assert.equal(result.assets.some(({ path }) => path === "images/vk-icon.png"), social);
      assert.equal(result.html.includes("https://example.test/telegram"), false);
      assert.equal(result.html.includes("images/telegram-icon.png"), false);
      assert.equal(result.assets.some(({ path }) => path === "images/telegram-icon.png"), false);
    }
  }
});

test("all four Secondary boolean combinations control the supplied nested button", async () => {
  const { model, dependencies } = await pilot();
  const record = dependencies.componentIndex.bySystemId.get("banner-secondary");
  assert.deepEqual(
    record.properties.filter(({ type }) => type === "boolean").map(({ id }) => id).sort(),
    ["show-body", "show-button"],
  );

  for (const body of [false, true]) {
    for (const button of [false, true]) {
      const variant = structuredClone(model);
      const banner = instance(variant, "banner-secondary");
      banner.property_values.find(({ property_id }) => property_id === "show-body").value = body;
      banner.property_values.find(({ property_id }) => property_id === "show-button").value = button;
      const result = renderEmailDocument(variant, dependencies);
      assert.deepEqual(result.diagnostics, []);
      assert.equal(result.html.includes("Поясняющая подпись на несколько красивых строк"), body);
      assert.equal(result.html.includes("https://example.test/secondary"), button);
    }
  }
});

test("document shell propagates exact language and direction to html and body wrapper", async () => {
  const { model, dependencies } = await pilot();
  const result = renderEmailDocument(model, dependencies);

  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /^<!doctype html><html lang="ru" dir="ltr">/u);
  assert.match(
    result.html,
    /<body style="margin:0;padding:0"><div lang="ru" dir="ltr">/u,
  );
  assert.match(result.html, /<\/div><\/body><\/html>$/u);
});

test("tagged informative and decorative alt values render without implicit defaults", async () => {
  const { model, dependencies } = await pilot();
  const secondary = instance(model, "banner-secondary");
  const alt = secondary.content_values.find(
    ({ element_id, slot_id }) =>
      element_id === "root-card-secondary-image" && slot_id === "alt",
  );
  assert.ok(alt);

  alt.value = {
    type: "alt-text",
    purpose: "informative",
    value: 'CUPIS & "спорт"',
  };
  const informative = renderEmailDocument(model, dependencies);
  assert.deepEqual(informative.diagnostics, []);
  assert.match(
    informative.html,
    /<img[^>]*src="images\/secondary\.jpg"[^>]*alt="CUPIS &amp; &quot;спорт&quot;"/u,
  );

  alt.value = {
    type: "alt-text",
    purpose: "decorative",
    value: "",
  };
  const decorative = renderEmailDocument(model, dependencies);
  assert.deepEqual(decorative.diagnostics, []);
  assert.match(
    decorative.html,
    /<img[^>]*src="images\/secondary\.jpg"[^>]*alt=""/u,
  );
});
test("pilot output exposes UTF-8 byte metrics", async () => {
  const { model, dependencies } = await pilot();
  const result = renderEmailDocument(model, dependencies);

  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.metrics, {
    html_bytes: Buffer.byteLength(result.html, "utf8"),
    embedded_css_bytes: result.metrics.embedded_css_bytes,
  });
  assert.ok(result.metrics.embedded_css_bytes > 0);
});

test("renderer blocks output at or above the exclusive embedded CSS limit", async () => {
  const { model, dependencies } = await pilot();
  dependencies.foundations.rendering.embedded_css.max_bytes_exclusive = 1;

  const result = renderEmailDocument(model, dependencies);

  assert.equal(result.html, "");
  assert.ok(
    result.diagnostics.some(
      ({ code, path }) =>
        code === "RENDER_EMBEDDED_CSS_BUDGET_EXCEEDED" &&
        path === "/embedded_css",
    ),
  );
});
// Task9 canonical fixture reads registered facts, while CTA text/href expectations are literal.
function task9CanonicalWalk(instance, visit) {
  visit(instance);
  for (const slot of instance.slots ?? []) for (const child of slot.instances ?? []) task9CanonicalWalk(child, visit);
  for (const nested of instance.nested_components ?? []) task9CanonicalWalk(nested.instance, visit);
}
async function task9CanonicalScene({ repeated = false, profile = "default" } = {}) {
  const { model, dependencies } = await pilot();
  const { loadAssetsFoundation } = await import("../../scripts/lib/assets-foundation.mjs");
  const assets = await loadAssetsFoundation({ repoRoot });
  const build = (componentId, instanceId) => {
    const record = dependencies.componentIndex.bySystemId.get(componentId); assert.ok(record, componentId);
    const result = { instance_id: instanceId, component_id: componentId, variants: { mobile: "mobile", desktop: "desktop" }, property_values: (record.properties ?? []).filter(p => p.type === "boolean").map(p => ({ property_id: p.id, scope: "all", value: p.default })), content_values: [], asset_files: [], slots: [] };
    const nested = new Map(); const assetIds = new Set();
    for (const viewport of ["mobile", "desktop"]) {
      const occurrences = new Map();
      const visit = node => {
        if (node.visibility?.mode === "instance" && node.visibility.default_visible === false) return;
        if (node.visibility?.mode === "property" && !result.property_values.find(p => p.property_id === node.visibility.property_id)?.value) return;
        for (const slot of node.content_slots ?? []) {
          if (slot.type === "placeholder") continue;
          const text = node.facts?.find(f => f.id === "source-text")?.value?.value ?? `${instanceId} ${node.id}`;
          const value = slot.type === "url" ? { type: "url", value: `https://example.test/source-${instanceId}-${node.id}-${slot.id}` }
            : slot.type === "alt-text" ? { type: "alt-text", purpose: "decorative", value: "" }
            : { type: slot.type, value: text };
          result.content_values.push({ element_id: node.id, slot_id: slot.id, scope: viewport, value });
        }
        if (["direct-image", "background-image"].includes(node.render_mode)) assetIds.add(node.asset_contract_id);
        if (node.render_mode === "nested-component") {
          const ordinal = occurrences.get(node.component_id) ?? 0; occurrences.set(node.component_id, ordinal + 1);
          const key = node.component_id + "/" + ordinal; const item = nested.get(key) ?? { componentId: node.component_id, ids: {} };
          item.ids[viewport] = node.id; nested.set(key, item);
        }
        for (const child of node.children ?? []) visit(child);
      };
      visit(record.contracts[viewport].root);
    }
    result.asset_files = [...assetIds].map(id => {
      const contract = record.asset_contracts.find(c => c.id === id); assert.ok(contract);
      const exportProfile = assets.export_profiles.find(p => p.id === contract.export_profile_id); assert.ok(exportProfile);
      return { asset_contract_id: id, path: `images/${id}${exportProfile.contract.suffix}${exportProfile.contract.extension}` };
    });
    if (nested.size) result.nested_components = [...nested.values()].map((item, ordinal) => ({
      ...(item.ids.mobile === item.ids.desktop ? { element_id: item.ids.mobile } : { element_ids: item.ids }),
      instance: build(item.componentId, `${instanceId}-nested-${ordinal}`),
    }));
    return result;
  };
  const hero = build("banner-hero", "task9-hero"); const steps = build("block-steps", "task9-steps");
  const top = [hero, steps, ...(repeated ? [build("banner-hero", "task9-hero-repeat")] : [])];
  for (const [sceneIndex, scene] of top.entries()) task9CanonicalWalk(scene, instance => {
    if (!["button-primary", "button-secondary"].includes(instance.component_id)) return;
    for (const value of instance.content_values) {
      if (value.slot_id === "href") value.value.value = `https://example.test/task9-canonical-${sceneIndex}`;
      if (value.element_id === "root-label" && value.slot_id === "text") value.value.value = `${sceneIndex === 0 ? "HERO" : sceneIndex === 1 ? "STEPS" : "REPEAT"} ${value.scope} CTA`;
    }
  });
  model.root.slots.find(slot => slot.element_id === "content").instances = top;
  const { validateEmailModelSemantics } = await import("../../scripts/lib/email-model.mjs");
  assert.deepEqual(validateEmailModelSemantics(model, dependencies), [], "canonical Hero/Steps model semantic precondition");
  if (profile === "altcraft-mobile-base-v1") {
    const { loadEmailDeliveryProfiles, selectDeliveryProfile } = await import("../../scripts/lib/email-delivery-profile.mjs");
    dependencies.deliveryProfile = selectDeliveryProfile(await loadEmailDeliveryProfiles({ repoRoot, componentIndex: dependencies.componentIndex }), profile);
  }
  const result = renderEmailDocument(model, dependencies);
  assert.deepEqual(result.diagnostics, []); checkTableNesting(result.html);
  return { result, model, dependencies };
}
function task9CanonicalOuterTag(html, marker) {
  const at = html.indexOf(marker); assert.ok(at >= 0, marker); const stack = [];
  for (const match of html.slice(0, at).matchAll(/<\/?table\b[^>]*>/gu)) { if (match[0].startsWith("</")) stack.pop(); else stack.push(match[0]); }
  assert.ok(stack.length, marker); return stack.at(-1);
}
for (const profile of ["default", "altcraft-mobile-base-v1"]) test("canonical Hero Desktop CTA centers its actual outer table while min/Fill Hero and Steps stay unchanged: " + profile, async () => {
  const { result, dependencies } = await task9CanonicalScene({ profile });
  const hero = dependencies.componentIndex.bySystemId.get("banner-hero"); const steps = dependencies.componentIndex.bySystemId.get("block-steps");
  const find = (node, id) => node.id === id ? node : (node.children ?? []).map(child => find(child, id)).find(Boolean);
  assert.equal(find(hero.contracts.desktop.root, "root-card-content-area").facts.find(f => f.id === "counter-alignment").value.value, "center");
  for (const viewport of ["mobile", "desktop"]) assert.equal(find(steps.contracts[viewport].root, "root-content-area").facts.find(f => f.id === "counter-alignment").value.value, "min");
  const desktop = task9CanonicalOuterTag(result.html, "HERO desktop CTA");
  assert.equal(attribute(desktop, "align"), "center"); assert.match(attribute(desktop, "style") ?? "", /(?:^|;)margin:0 auto(?:;|$)/u);
  assert.equal((desktop.match(/\salign=/gu) ?? []).length, 1);
  for (const marker of ["HERO mobile CTA", "STEPS mobile CTA", "STEPS desktop CTA"]) assert.notEqual(attribute(task9CanonicalOuterTag(result.html, marker), "align"), "center", marker + " follows its actual min parent");
  for (const marker of ["HERO mobile CTA", "STEPS mobile CTA"]) assert.equal(attribute(task9CanonicalOuterTag(result.html, marker), "width"), "100%");
  for (const ordinal of [0, 1]) assert.match(result.html, new RegExp('href="https://example\\.test/task9-canonical-' + ordinal + '"', "u"));
  assert.ok(result.assets.some(asset => asset.path === "images/hero-image@2x.jpg"));
  if (profile === "altcraft-mobile-base-v1") {
    assert.equal((result.html.match(/<!-- cupis:block button-primary \/ /gu) ?? []).length, 2);
    assert.equal((result.html.match(/<!-- cupis:block button-secondary \/ /gu) ?? []).length, 2);
    assert.match(result.html, /<!--\[if mso\]>/u); assert.match(result.html, /<!--\[if !mso\]><!-->/u);
  }
});
test("serialized repeated canonical CTA instances retain live href, scope/order, images and balanced tables", async () => {
  const { result } = await task9CanonicalScene({ repeated: true, profile: "altcraft-mobile-base-v1" });
  for (const viewport of ["mobile", "desktop"]) {
    const positions = ["HERO", "STEPS", "REPEAT"].map(label => result.html.indexOf(label + " " + viewport + " CTA"));
    assert.ok(positions.every(at => at >= 0)); assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  }
  assert.equal((result.html.match(/<!-- cupis:block button-primary \/ /gu) ?? []).length, 4);
  assert.equal((result.html.match(/<!-- cupis:end button-primary \/ /gu) ?? []).length, 4);
  assert.match(result.html, /task9-hero-repeat/u); assert.match(result.html, /href="https:\/\/example\.test\/task9-canonical-2"/u);
  assert.ok(result.assets.some(asset => asset.path === "images/hero-image@2x.jpg"));
  assert.doesNotMatch(result.html, /\[object Object\]|\bundefined\b|resolved-slot/u);
});
