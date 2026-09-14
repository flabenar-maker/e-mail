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
