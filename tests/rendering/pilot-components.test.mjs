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
import {
  renderComponent,
  renderEmailDocument,
} from "../../scripts/lib/email-renderer.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const fixturePath = join(repoRoot, "tests/fixtures/rendering/pilot-email.json");

async function dependencies() {
  const [registries, rendererRegistry, rendering] = await Promise.all([
    loadComponentRegistries({ repoRoot }),
    loadRendererRegistry({ repoRoot }),
    loadRenderingFoundation({ repoRoot }),
  ]);
  return {
    rendererRegistry,
    componentIndex: indexComponentRegistries(registries),
    foundations: { rendering },
  };
}

async function pilot() {
  const [source, deps] = await Promise.all([
    readFile(fixturePath, "utf8"),
    dependencies(),
  ]);
  const model = JSON.parse(source);
  return { model, result: renderEmailDocument(model, deps) };
}

function collectKeys(value, output = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectKeys(item, output));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      output.push(key);
      collectKeys(child, output);
    }
  }
  return output;
}

function component(id, root) {
  return {
    id,
    status: "active",
    properties: [],
    asset_contracts: [],
    contracts: {
      mobile: { root: structuredClone(root) },
      desktop: { root: structuredClone(root) },
    },
  };
}

function instance(instanceId, componentId, extra = {}) {
  return {
    instance_id: instanceId,
    component_id: componentId,
    variants: { mobile: "mobile", desktop: "desktop" },
    property_values: [],
    content_values: [],
    asset_files: [],
    slots: [],
    ...extra,
  };
}

test("pilot fixture contains only normalized component inputs", async () => {
  const source = await readFile(fixturePath, "utf8");
  const model = JSON.parse(source);
  const keys = collectKeys(model);

  assert.equal(model.root.component_id, "email-template");
  assert.deepEqual(model.root.variants, { mobile: "mobile", desktop: "desktop" });
  assert.equal(keys.includes("html"), false);
  assert.equal(keys.includes("figma_response"), false);
  assert.equal(source.includes("<table"), false);
});

test("template slot produces one deterministic email document without disabled secondary CTA", async () => {
  const { result } = await pilot();

  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, /^<!doctype html><html><head>/u);
  assert.match(result.html, /<body><table role="presentation"/u);
  assert.doesNotMatch(result.html, /https:\/\/example\.test\/jobs|Откликнуться/u);
  assert.doesNotMatch(result.html, /placeholder|\[object Object\]/u);
});

test("secondary banner uses a direct image on mobile and a background image on desktop", async () => {
  const { result } = await pilot();

  assert.match(result.html, /<img[^>]+src="images\/secondary\.jpg"/u);
  assert.match(result.html, /<td background="images\/secondary\.jpg"/u);
  assert.match(result.html, />Всё важное рядом</u);
});

test("app download keeps store icons and text separate and stacks mobile store links", async () => {
  const { result } = await pilot();

  for (const store of ["rustore", "google-play", "appgallery", "getapps"]) {
    assert.match(
      result.html,
      new RegExp(`<a href="https://example\\.test/${store}">[\\s\\S]*?<img[^>]+src="images/${store === "google-play" ? "google-play" : store}-icon\\.png"`, "u"),
    );
  }
  assert.match(result.html, /<p[^>]*>RuStore<\/p>/u);
});

test("footer resolves boolean properties without losing the enabled social link", async () => {
  const { result } = await pilot();

  assert.doesNotMatch(result.html, /Скрытая подпись/u);
  assert.match(result.html, /Вы получили это письмо от CUPIS\./u);
  assert.match(result.html, /href="https:\/\/example\.test\/vk"/u);
  assert.doesNotMatch(result.html, /href="https:\/\/example\.test\/telegram|images\/telegram-icon\.png/u);
});

test("document returns every referenced local asset once in deterministic order", async () => {
  const { result } = await pilot();

  assert.deepEqual(
    result.assets.map(({ path }) => path),
    [
      "images/app-logo.png",
      "images/appgallery-icon.png",
      "images/getapps-icon.png",
      "images/google-play-icon.png",
      "images/qr-code.png",
      "images/rustore-icon.png",
      "images/secondary.jpg",
      "images/vk-icon.png",
    ],
  );
});

test("nested components resolve only the exact contract component id", async () => {
  const parent = component("parent", {
    id: "root",
    semantic_role: "section",
    render_mode: "presentation-table",
    visibility: { mode: "always" },
    facts: [],
    children: [
      {
        id: "child",
        semantic_role: "content",
        render_mode: "nested-component",
        visibility: { mode: "always" },
        facts: [],
        children: [],
        component_id: "exact-child",
      },
    ],
  });
  const child = component("exact-child", {
    id: "root",
    semantic_role: "text",
    render_mode: "html-text",
    visibility: { mode: "always" },
    facts: [],
    children: [],
    content_slots: [{ id: "text", type: "plain-text", required: true }],
  });
  const componentIndex = {
    bySystemId: new Map([[parent.id, parent], [child.id, child]]),
  };
  const rendererRegistry = {
    coverage: [parent, child].map(({ id: component_id }) => ({ component_id, mode: "interpreter" })),
  };
  const viewportData = instance("parent-instance", "parent", {
    nested_components: [
      {
        element_id: "child",
        instance: instance("child-instance", "exact-child", {
          content_values: [
            { element_id: "root", slot_id: "text", scope: "all", value: { type: "plain-text", value: "Exact child" } },
          ],
        }),
      },
    ],
  });

  const result = renderComponent({
    componentId: "parent",
    viewportData,
    rendererRegistry,
    componentIndex,
    foundations: { rendering: { breakpoints: [] } },
  });

  assert.deepEqual(result.diagnostics, []);
  assert.match(result.html, />Exact child<\/p>/u);

  viewportData.nested_components[0].instance.component_id = "wrong-child";
  const mismatch = renderComponent({
    componentId: "parent",
    viewportData,
    rendererRegistry,
    componentIndex,
    foundations: { rendering: { breakpoints: [] } },
  });
  assert.equal(mismatch.html, "");
  assert.deepEqual(mismatch.diagnostics.map(({ code }) => code), [
    "RENDER_NESTED_COMPONENT_MISMATCH",
    "RENDER_NESTED_COMPONENT_MISMATCH",
  ]);
});

test("recursive component references stop with a stable cycle diagnostic", async () => {
  const loop = component("loop", {
    id: "root",
    semantic_role: "section",
    render_mode: "presentation-table",
    visibility: { mode: "always" },
    facts: [],
    children: [
      {
        id: "again",
        semantic_role: "content",
        render_mode: "nested-component",
        visibility: { mode: "always" },
        facts: [],
        children: [],
        component_id: "loop",
      },
    ],
  });
  const viewportData = instance("loop-root", "loop", {
    nested_components: [
      { element_id: "again", instance: instance("loop-child", "loop") },
    ],
  });

  const result = renderComponent({
    componentId: "loop",
    viewportData,
    rendererRegistry: { coverage: [{ component_id: "loop", mode: "interpreter" }] },
    componentIndex: { bySystemId: new Map([["loop", loop]]) },
    foundations: { rendering: { breakpoints: [] } },
  });

  assert.equal(result.html, "");
  assert.ok(result.diagnostics.length > 0);
  assert.ok(result.diagnostics.every(({ code }) => code === "RENDER_COMPONENT_CYCLE"));
});
test("disabled footer social section does not require hidden content or assets", async () => {
  const [source, deps] = await Promise.all([
    readFile(fixturePath, "utf8"),
    dependencies(),
  ]);
  const model = JSON.parse(source);
  const instances = model.root.slots[0].instances;
  const footer = instances.find(({ component_id }) => component_id === "email-footer");
  footer.property_values.find(({ property_id }) => property_id === "show-social-links").value = false;
  footer.content_values = footer.content_values.filter(
    ({ element_id }) => !["root-footer-body-social-section-social-icons-vk-icon", "root-footer-body-social-section-social-icons-telegram-icon"].includes(element_id),
  );
  footer.asset_files = [];

  const result = renderEmailDocument(model, deps);

  assert.deepEqual(result.diagnostics, []);
  assert.doesNotMatch(result.html, /example\.test\/(?:vk|telegram)|images\/(?:vk|telegram)-icon\.png/u);
  assert.equal(result.assets.some(({ path }) => path === "images/vk-icon.png"), false);
  assert.equal(result.assets.some(({ path }) => path === "images/telegram-icon.png"), false);
});